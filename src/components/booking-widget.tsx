"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import {
  Calendar,
  Users,
  Minus,
  Plus,
  ShieldCheck,
  BedDouble,
} from "lucide-react";
import { formatPrice, type Currency } from "@/lib/pricing";
import Link from "next/link";

interface TourAddOn {
  id: string;
  name: string;
  description?: string | null;
  price: number;
}

interface BookingWidgetProps {
  type: "tour" | "accommodation";
  slug: string;
  name: string;
  basePrice: number;
  currency?: Currency;
  maxGroupSize?: number;
  addOns?: TourAddOn[];
  roomTypes?: {
    id: string;
    name: string;
    maxOccupancy: number;
    lowestPrice: number;
  }[];
}

export function BookingWidget({
  type,
  slug,
  name,
  basePrice,
  currency = "USD",
  maxGroupSize = 20,
  addOns = [],
  roomTypes = [],
}: BookingWidgetProps) {
  const [date, setDate] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);
  const [rooms, setRooms] = useState(1);
  const [selectedAddOns, setSelectedAddOns] = useState<Set<string>>(new Set());
  const [selectedRoomType, setSelectedRoomType] = useState(
    roomTypes[0]?.id || ""
  );

  const toggleAddOn = (id: string) => {
    setSelectedAddOns((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const addOnsTotal = useMemo(() => {
    return addOns
      .filter((a) => selectedAddOns.has(a.id))
      .reduce((sum, a) => sum + a.price, 0);
  }, [addOns, selectedAddOns]);

  const selectedRoom = roomTypes.find((r) => r.id === selectedRoomType);
  const roomPrice = selectedRoom?.lowestPrice || basePrice;

  const nights = useMemo(() => {
    if (!date || !checkOut) return 1;
    const start = new Date(date);
    const end = new Date(checkOut);
    const diff = Math.ceil(
      (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
    );
    return diff > 0 ? diff : 1;
  }, [date, checkOut]);

  const totalPrice =
    type === "tour"
      ? basePrice * guests + addOnsTotal * guests
      : roomPrice * rooms * nights;

  const bookingUrl =
    type === "tour" ? `/book/tour/${slug}` : `/book/accommodation/${slug}`;

  return (
    <Card className="sticky top-24 border-brand-teal/20 shadow-lg">
      <CardHeader className="bg-brand-teal pb-4 text-white rounded-t-xl -mt-4 -mx-0">
        <CardTitle className="flex items-center gap-2 text-white text-lg">
          <Calendar className="size-5" />
          Book {type === "tour" ? "This Tour" : "Your Stay"}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 pt-4">
        {type === "tour" ? (
          <div>
            <Label htmlFor="tour-date" className="text-sm font-medium">
              Select Date
            </Label>
            <Input
              id="tour-date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="mt-1"
              min={new Date().toISOString().split("T")[0]}
            />
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="check-in" className="text-sm font-medium">
                Check-in
              </Label>
              <Input
                id="check-in"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="mt-1"
                min={new Date().toISOString().split("T")[0]}
              />
            </div>
            <div>
              <Label htmlFor="check-out" className="text-sm font-medium">
                Check-out
              </Label>
              <Input
                id="check-out"
                type="date"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                className="mt-1"
                min={date || new Date().toISOString().split("T")[0]}
              />
            </div>
          </div>
        )}

        {type === "accommodation" && roomTypes.length > 0 && (
          <div>
            <Label className="text-sm font-medium">Room Type</Label>
            <div className="mt-1 flex flex-col gap-2">
              {roomTypes.map((rt) => (
                <button
                  key={rt.id}
                  onClick={() => setSelectedRoomType(rt.id)}
                  className={`flex items-center justify-between rounded-lg border p-3 text-left transition-colors ${
                    selectedRoomType === rt.id
                      ? "border-brand-teal bg-brand-teal-50"
                      : "border-border hover:border-brand-teal/50"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <BedDouble className="size-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">{rt.name}</p>
                      <p className="text-xs text-muted-foreground">
                        Up to {rt.maxOccupancy} guests
                      </p>
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-brand-teal">
                    {formatPrice(rt.lowestPrice, currency)}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        <div>
          <Label className="text-sm font-medium">
            {type === "tour" ? "Guests" : "Rooms"}
          </Label>
          <div className="mt-1 flex items-center gap-3">
            <Button
              variant="outline"
              size="icon"
              onClick={() =>
                type === "tour"
                  ? setGuests(Math.max(1, guests - 1))
                  : setRooms(Math.max(1, rooms - 1))
              }
              disabled={type === "tour" ? guests <= 1 : rooms <= 1}
            >
              <Minus className="size-4" />
            </Button>
            <span className="w-8 text-center text-lg font-semibold">
              {type === "tour" ? guests : rooms}
            </span>
            <Button
              variant="outline"
              size="icon"
              onClick={() =>
                type === "tour"
                  ? setGuests(Math.min(maxGroupSize, guests + 1))
                  : setRooms(rooms + 1)
              }
              disabled={type === "tour" && guests >= maxGroupSize}
            >
              <Plus className="size-4" />
            </Button>
            {type === "tour" && (
              <span className="text-xs text-muted-foreground">
                Max {maxGroupSize}
              </span>
            )}
          </div>
        </div>

        {type === "tour" && addOns.length > 0 && (
          <div>
            <Label className="text-sm font-medium">Add-ons</Label>
            <div className="mt-2 flex flex-col gap-2">
              {addOns.map((addon) => (
                <label
                  key={addon.id}
                  className="flex cursor-pointer items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted/50"
                >
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={selectedAddOns.has(addon.id)}
                      onCheckedChange={() => toggleAddOn(addon.id)}
                    />
                    <div>
                      <p className="text-sm font-medium">{addon.name}</p>
                      {addon.description && (
                        <p className="text-xs text-muted-foreground">
                          {addon.description}
                        </p>
                      )}
                    </div>
                  </div>
                  <span className="text-sm font-medium text-brand-teal">
                    +{formatPrice(addon.price, currency)}
                  </span>
                </label>
              ))}
            </div>
          </div>
        )}

        <Separator />

        <div className="flex flex-col gap-2">
          {type === "tour" ? (
            <>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  {formatPrice(basePrice, currency)} x {guests} guest
                  {guests !== 1 ? "s" : ""}
                </span>
                <span>{formatPrice(basePrice * guests, currency)}</span>
              </div>
              {addOnsTotal > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    Add-ons x {guests}
                  </span>
                  <span>
                    {formatPrice(addOnsTotal * guests, currency)}
                  </span>
                </div>
              )}
            </>
          ) : (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">
                {formatPrice(roomPrice, currency)} x {rooms} room
                {rooms !== 1 ? "s" : ""} x {nights} night
                {nights !== 1 ? "s" : ""}
              </span>
              <span>{formatPrice(roomPrice * rooms * nights, currency)}</span>
            </div>
          )}
          <Separator />
          <div className="flex justify-between text-base font-bold">
            <span>Total</span>
            <span className="text-brand-teal">
              {formatPrice(totalPrice, currency)}
            </span>
          </div>
        </div>

        <Link href={bookingUrl}>
          <Button
            className="w-full bg-brand-amber text-white hover:bg-brand-amber-600"
            size="lg"
          >
            Book Now
          </Button>
        </Link>

        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <ShieldCheck className="size-4" />
          <span>Free cancellation up to 48 hours before</span>
        </div>
      </CardContent>
    </Card>
  );
}
