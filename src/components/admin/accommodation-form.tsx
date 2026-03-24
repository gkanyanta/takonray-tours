"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Trash2, Upload, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";

const TIERS = ["LOCAL", "SADC", "INTERNATIONAL"] as const;
const SEASONS = ["PEAK", "HIGH", "LOW"] as const;
const TYPES = ["HOTEL", "LODGE", "GUESTHOUSE", "CAMPSITE", "HOSTEL", "VILLA"];

const roomPricingSchema = z.object({
  tier: z.enum(["LOCAL", "SADC", "INTERNATIONAL"]),
  season: z.enum(["PEAK", "HIGH", "LOW"]),
  price: z.number().min(0),
});

const roomTypeSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Room name is required"),
  description: z.string().optional(),
  maxOccupancy: z.number().int().min(1),
  pricing: z.array(roomPricingSchema),
});

const formSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  slug: z
    .string()
    .min(3)
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with hyphens"),
  type: z.string().min(1, "Type is required"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  address: z.string().min(1, "Address is required"),
  amenities: z.array(z.object({ value: z.string().min(1) })),
  images: z.array(z.string()).optional(),
  featured: z.boolean(),
  active: z.boolean(),
  roomTypes: z.array(roomTypeSchema),
});

type FormValues = z.infer<typeof formSchema>;

interface AccommodationData {
  id: string;
  name: string;
  slug: string;
  type: string;
  description: string;
  address: string | null;
  amenities: string[];
  images: string[];
  featured: boolean;
  active: boolean;
  roomTypes: {
    id: string;
    name: string;
    description: string | null;
    maxOccupancy: number;
    pricing: { tier: string; season: string; price: number }[];
  }[];
}

function generateSlug(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function buildDefaultRoomPricing() {
  const pricing: { tier: (typeof TIERS)[number]; season: (typeof SEASONS)[number]; price: number }[] = [];
  for (const tier of TIERS) {
    for (const season of SEASONS) {
      pricing.push({ tier, season, price: 0 });
    }
  }
  return pricing;
}

export function AccommodationForm({
  accommodation,
}: {
  accommodation?: AccommodationData;
}) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: accommodation?.name ?? "",
      slug: accommodation?.slug ?? "",
      type: accommodation?.type ?? "",
      description: accommodation?.description ?? "",
      address: accommodation?.address ?? "",
      amenities: accommodation?.amenities?.map((v) => ({ value: v })) ?? [
        { value: "" },
      ],
      images: accommodation?.images ?? [],
      featured: accommodation?.featured ?? false,
      active: accommodation?.active ?? true,
      roomTypes:
        accommodation?.roomTypes?.map((rt) => ({
          id: rt.id,
          name: rt.name,
          description: rt.description ?? "",
          maxOccupancy: rt.maxOccupancy,
          pricing: buildDefaultRoomPricing().map((dp) => {
            const found = rt.pricing.find(
              (p) => p.tier === dp.tier && p.season === dp.season
            );
            return found ? { ...dp, price: found.price } : dp;
          }),
        })) ?? [],
    },
  });

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    formState: { errors },
  } = form;

  const amenitiesField = useFieldArray({ control, name: "amenities" });
  const roomTypesField = useFieldArray({ control, name: "roomTypes" });

  const addRoomType = () => {
    roomTypesField.append({
      name: "",
      description: "",
      maxOccupancy: 2,
      pricing: buildDefaultRoomPricing(),
    });
  };

  const onSubmit = async (data: FormValues) => {
    setSaving(true);
    try {
      const payload = {
        ...data,
        amenities: data.amenities.map((a) => a.value).filter(Boolean),
      };

      const url = accommodation
        ? `/api/admin/accommodations/${accommodation.id}`
        : "/api/admin/accommodations";
      const method = accommodation ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        alert(err.error || "Failed to save accommodation");
        return;
      }

      router.push("/admin/accommodations");
      router.refresh();
    } catch {
      alert("Failed to save accommodation");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Button asChild variant="ghost" size="sm">
        <Link href="/admin/accommodations">
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back
        </Link>
      </Button>

      {/* Basic Info */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                {...register("name")}
                onChange={(e) => {
                  register("name").onChange(e);
                  if (!accommodation) {
                    setValue("slug", generateSlug(e.target.value));
                  }
                }}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.name.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="slug">Slug *</Label>
              <Input id="slug" {...register("slug")} />
              {errors.slug && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.slug.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label>Type *</Label>
              <Select
                value={watch("type")}
                onValueChange={(v) => setValue("type", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {TYPES.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.type && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.type.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="address">Address *</Label>
              <Input id="address" {...register("address")} />
              {errors.address && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.address.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description *</Label>
            <Textarea id="description" rows={5} {...register("description")} />
            {errors.description && (
              <p className="mt-1 text-sm text-red-500">
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Switch
                checked={watch("active")}
                onCheckedChange={(v) => setValue("active", v)}
              />
              <Label>Active</Label>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                checked={watch("featured")}
                onCheckedChange={(v) => setValue("featured", v)}
              />
              <Label>Featured</Label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Amenities */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Amenities</CardTitle>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => amenitiesField.append({ value: "" })}
          >
            <Plus className="mr-1 h-4 w-4" />
            Add
          </Button>
        </CardHeader>
        <CardContent className="space-y-2">
          {amenitiesField.fields.map((item, index) => (
            <div key={item.id} className="flex items-center gap-2">
              <Input
                {...register(`amenities.${index}.value`)}
                placeholder={`Amenity ${index + 1} (e.g., WiFi, Pool)`}
              />
              {amenitiesField.fields.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-red-500"
                  onClick={() => amenitiesField.remove(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Image Upload Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle>Images</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-8 text-center">
            <Upload className="mb-2 h-8 w-8 text-gray-400" />
            <p className="text-sm font-medium text-gray-600">
              Drag and drop images or click to upload
            </p>
            <p className="mt-1 text-xs text-gray-400">
              PNG, JPG up to 5MB each
            </p>
            <Button type="button" variant="outline" className="mt-3">
              Select Files
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Room Types */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Room Types</CardTitle>
          <Button type="button" variant="outline" size="sm" onClick={addRoomType}>
            <Plus className="mr-1 h-4 w-4" />
            Add Room Type
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          {roomTypesField.fields.length === 0 ? (
            <p className="text-sm text-gray-500">No room types added yet</p>
          ) : (
            roomTypesField.fields.map((room, rIdx) => (
              <div
                key={room.id}
                className="rounded-lg border p-4 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Room Type {rIdx + 1}</h4>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-red-500"
                    onClick={() => roomTypesField.remove(rIdx)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <div>
                    <Label>Name</Label>
                    <Input {...register(`roomTypes.${rIdx}.name`)} />
                  </div>
                  <div>
                    <Label>Description</Label>
                    <Input {...register(`roomTypes.${rIdx}.description`)} />
                  </div>
                  <div>
                    <Label>Max Occupancy</Label>
                    <Input
                      type="number"
                      {...register(`roomTypes.${rIdx}.maxOccupancy`)}
                    />
                  </div>
                </div>

                {/* Room Pricing Grid */}
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="pb-2 pr-4 text-left font-medium text-gray-500">
                          Tier / Season
                        </th>
                        {SEASONS.map((s) => (
                          <th
                            key={s}
                            className="pb-2 text-center font-medium text-gray-500"
                          >
                            {s}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {TIERS.map((tier, tIdx) => (
                        <tr key={tier} className="border-b last:border-0">
                          <td className="py-2 pr-4 font-medium">{tier}</td>
                          {SEASONS.map((season, sIdx) => {
                            const pIdx = tIdx * 3 + sIdx;
                            return (
                              <td key={`${tier}-${season}`} className="px-1 py-2">
                                <div className="relative">
                                  <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400">
                                    $
                                  </span>
                                  <Input
                                    type="number"
                                    step="0.01"
                                    className="pl-6 text-center"
                                    {...register(
                                      `roomTypes.${rIdx}.pricing.${pIdx}.price`
                                    )}
                                  />
                                </div>
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Submit */}
      <div className="flex items-center gap-3">
        <Button
          type="submit"
          disabled={saving}
          className="bg-teal-600 hover:bg-teal-700"
        >
          {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {accommodation ? "Update Accommodation" : "Create Accommodation"}
        </Button>
        <Button asChild variant="outline">
          <Link href="/admin/accommodations">Cancel</Link>
        </Button>
      </div>
    </form>
  );
}
