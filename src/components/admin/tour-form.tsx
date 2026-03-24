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

const tourFormSchema = z.object({
  name: z.string().min(3, "Tour name must be at least 3 characters"),
  slug: z
    .string()
    .min(3)
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with hyphens"),
  categoryId: z.string().min(1, "Category is required"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  duration: z.string().min(1, "Duration is required"),
  maxGroupSize: z.number().int().min(1).max(100),
  difficulty: z.string().optional(),
  highlights: z.array(z.object({ value: z.string().min(1) })),
  includes: z.array(z.object({ value: z.string().min(1) })),
  excludes: z.array(z.object({ value: z.string().min(1) })),
  images: z.array(z.string()).optional(),
  featured: z.boolean(),
  active: z.boolean(),
  pricing: z.array(
    z.object({
      tier: z.enum(["LOCAL", "SADC", "INTERNATIONAL"]),
      season: z.enum(["PEAK", "HIGH", "LOW"]),
      price: z.number().min(0),
    })
  ),
  addOns: z.array(
    z.object({
      id: z.string().optional(),
      name: z.string().min(1),
      description: z.string().optional(),
      price: z.number().min(0),
    })
  ),
});

type TourFormValues = z.infer<typeof tourFormSchema>;

interface Category {
  id: string;
  name: string;
}

interface TourData {
  id: string;
  name: string;
  slug: string;
  categoryId: string;
  description: string;
  duration: string;
  maxGroupSize: number;
  difficulty: string | null;
  highlights: string[];
  includes: string[];
  excludes: string[];
  images: string[];
  featured: boolean;
  active: boolean;
  pricing: { tier: string; season: string; price: number }[];
  addOns: { id: string; name: string; description: string | null; price: number }[];
}

const TIERS = ["LOCAL", "SADC", "INTERNATIONAL"] as const;
const SEASONS = ["PEAK", "HIGH", "LOW"] as const;
const DIFFICULTIES = ["EASY", "MODERATE", "CHALLENGING", "EXTREME"];

function generateSlug(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function buildDefaultPricing() {
  const pricing: { tier: (typeof TIERS)[number]; season: (typeof SEASONS)[number]; price: number }[] = [];
  for (const tier of TIERS) {
    for (const season of SEASONS) {
      pricing.push({ tier, season, price: 0 });
    }
  }
  return pricing;
}

export function TourForm({
  tour,
  categories,
}: {
  tour?: TourData;
  categories: Category[];
}) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  const existingPricing = tour?.pricing
    ? buildDefaultPricing().map((dp) => {
        const found = tour.pricing.find(
          (p) => p.tier === dp.tier && p.season === dp.season
        );
        return found ? { ...dp, price: found.price } : dp;
      })
    : buildDefaultPricing();

  const form = useForm<TourFormValues>({
    resolver: zodResolver(tourFormSchema),
    defaultValues: {
      name: tour?.name ?? "",
      slug: tour?.slug ?? "",
      categoryId: tour?.categoryId ?? "",
      description: tour?.description ?? "",
      duration: tour?.duration ?? "",
      maxGroupSize: tour?.maxGroupSize ?? 10,
      difficulty: tour?.difficulty ?? "",
      highlights: tour?.highlights?.map((v) => ({ value: v })) ?? [
        { value: "" },
      ],
      includes: tour?.includes?.map((v) => ({ value: v })) ?? [{ value: "" }],
      excludes: tour?.excludes?.map((v) => ({ value: v })) ?? [{ value: "" }],
      images: tour?.images ?? [],
      featured: tour?.featured ?? false,
      active: tour?.active ?? true,
      pricing: existingPricing,
      addOns: tour?.addOns?.map((a) => ({
        id: a.id,
        name: a.name,
        description: a.description ?? "",
        price: a.price,
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

  const highlightsField = useFieldArray({ control, name: "highlights" });
  const includesField = useFieldArray({ control, name: "includes" });
  const excludesField = useFieldArray({ control, name: "excludes" });
  const addOnsField = useFieldArray({ control, name: "addOns" });

  const watchName = watch("name");

  const onSubmit = async (data: TourFormValues) => {
    setSaving(true);
    try {
      const payload = {
        ...data,
        highlights: data.highlights.map((h) => h.value).filter(Boolean),
        includes: data.includes.map((i) => i.value).filter(Boolean),
        excludes: data.excludes.map((e) => e.value).filter(Boolean),
      };

      const url = tour
        ? `/api/admin/tours/${tour.id}`
        : "/api/admin/tours";
      const method = tour ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        alert(err.error || "Failed to save tour");
        return;
      }

      router.push("/admin/tours");
      router.refresh();
    } catch (error) {
      alert("Failed to save tour");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="flex items-center gap-4">
        <Button asChild variant="ghost" size="sm">
          <Link href="/admin/tours">
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back
          </Link>
        </Button>
      </div>

      {/* Basic Info */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="name">Tour Name *</Label>
              <Input
                id="name"
                {...register("name")}
                onChange={(e) => {
                  register("name").onChange(e);
                  if (!tour) {
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

          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <Label>Category *</Label>
              <Select
                value={watch("categoryId")}
                onValueChange={(v) => setValue("categoryId", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.categoryId && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.categoryId.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="duration">Duration *</Label>
              <Input
                id="duration"
                placeholder="e.g., 3 hours, Full day"
                {...register("duration")}
              />
              {errors.duration && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.duration.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="maxGroupSize">Max Group Size *</Label>
              <Input
                id="maxGroupSize"
                type="number"
                {...register("maxGroupSize")}
              />
            </div>
          </div>

          <div>
            <Label>Difficulty</Label>
            <Select
              value={watch("difficulty") || ""}
              onValueChange={(v) => setValue("difficulty", v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select difficulty" />
              </SelectTrigger>
              <SelectContent>
                {DIFFICULTIES.map((d) => (
                  <SelectItem key={d} value={d}>
                    {d}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              rows={5}
              {...register("description")}
            />
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

      {/* Dynamic Lists */}
      {(
        [
          { label: "Highlights", field: highlightsField, name: "highlights" },
          { label: "Includes", field: includesField, name: "includes" },
          { label: "Excludes", field: excludesField, name: "excludes" },
        ] as const
      ).map(({ label, field, name }) => (
        <Card key={name}>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>{label}</CardTitle>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => field.append({ value: "" })}
            >
              <Plus className="mr-1 h-4 w-4" />
              Add
            </Button>
          </CardHeader>
          <CardContent className="space-y-2">
            {field.fields.map((item, index) => (
              <div key={item.id} className="flex items-center gap-2">
                <Input
                  {...register(`${name}.${index}.value`)}
                  placeholder={`${label} item ${index + 1}`}
                />
                {field.fields.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-red-500"
                    onClick={() => field.remove(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      ))}

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
              PNG, JPG up to 5MB each. Cloudinary integration ready.
            </p>
            <Button type="button" variant="outline" className="mt-3">
              Select Files
            </Button>
          </div>
          {watch("images") && watch("images")!.length > 0 && (
            <div className="mt-4 grid grid-cols-4 gap-2">
              {watch("images")!.map((url, i) => (
                <div key={i} className="relative aspect-video overflow-hidden rounded border">
                  <img
                    src={url}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pricing Grid */}
      <Card>
        <CardHeader>
          <CardTitle>Pricing</CardTitle>
        </CardHeader>
        <CardContent>
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
                  <tr key={tier} className="border-b">
                    <td className="py-3 pr-4 font-medium">{tier}</td>
                    {SEASONS.map((season, sIdx) => {
                      const idx = tIdx * 3 + sIdx;
                      return (
                        <td key={`${tier}-${season}`} className="px-1 py-3">
                          <div className="relative">
                            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400">
                              $
                            </span>
                            <Input
                              type="number"
                              step="0.01"
                              className="pl-6 text-center"
                              {...register(`pricing.${idx}.price`)}
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
        </CardContent>
      </Card>

      {/* Add-ons */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Add-ons</CardTitle>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              addOnsField.append({ name: "", description: "", price: 0 })
            }
          >
            <Plus className="mr-1 h-4 w-4" />
            Add Add-on
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {addOnsField.fields.length === 0 ? (
            <p className="text-sm text-gray-500">No add-ons yet</p>
          ) : (
            addOnsField.fields.map((item, index) => (
              <div
                key={item.id}
                className="flex items-start gap-3 rounded-lg border p-3"
              >
                <div className="grid flex-1 gap-3 md:grid-cols-3">
                  <div>
                    <Label>Name</Label>
                    <Input {...register(`addOns.${index}.name`)} />
                  </div>
                  <div>
                    <Label>Description</Label>
                    <Input {...register(`addOns.${index}.description`)} />
                  </div>
                  <div>
                    <Label>Price ($)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      {...register(`addOns.${index}.price`)}
                    />
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="mt-6 text-red-500"
                  onClick={() => addOnsField.remove(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
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
          {tour ? "Update Tour" : "Create Tour"}
        </Button>
        <Button asChild variant="outline">
          <Link href="/admin/tours">Cancel</Link>
        </Button>
      </div>
    </form>
  );
}
