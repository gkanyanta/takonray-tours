"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SADC_COUNTRIES } from "@/lib/constants";
import { formatCurrency, type Currency } from "@/lib/pricing";

interface RoomType {
  id: string;
  name: string;
  description: string | null;
  maxOccupancy: number;
  images: string[];
  pricing: { tier: string; season: string; price: number }[];
}

interface AccommodationData {
  id: string;
  name: string;
  slug: string;
  description: string;
  type: string;
  address: string | null;
  amenities: string[];
  images: string[];
  roomTypes: RoomType[];
}

const STEPS = ["Stay Details", "Your Details", "Review & Confirm"];
const NATIONALITIES = ["Zambia", ...SADC_COUNTRIES.filter((c) => c !== "Zambia"), "Other"];

export default function AccommodationBookingPage() {
  const router = useRouter();
  const params = useParams();
  const slug = params.slug as string;

  const [step, setStep] = useState(0);
  const [accommodation, setAccommodation] = useState<AccommodationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Step 1
  const [checkIn, setCheckIn] = useState<Date | undefined>(undefined);
  const [checkOut, setCheckOut] = useState<Date | undefined>(undefined);
  const [selectedRoomType, setSelectedRoomType] = useState("");
  const [roomsCount, setRoomsCount] = useState(1);
  const [guests, setGuests] = useState(1);

  // Step 2
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [nationality, setNationality] = useState("");
  const [specialRequests, setSpecialRequests] = useState("");

  useEffect(() => {
    async function fetchAccommodation() {
      try {
        const res = await fetch(`/api/accommodations/${slug}`);
        if (!res.ok) throw new Error("Accommodation not found");
        const data = await res.json();
        setAccommodation(data);
        if (data.roomTypes.length > 0) {
          setSelectedRoomType(data.roomTypes[0].id);
        }
      } catch {
        setError("Could not load accommodation details.");
      } finally {
        setLoading(false);
      }
    }
    fetchAccommodation();
  }, [slug]);

  const nights =
    checkIn && checkOut
      ? Math.max(1, Math.ceil((checkOut.getTime() - checkIn.getTime()) / 86400000))
      : 0;

  const selectedRoom = accommodation?.roomTypes.find((r) => r.id === selectedRoomType);

  const getRoomPrice = useCallback(() => {
    if (!selectedRoom || !checkIn) return 0;
    const month = checkIn.getMonth() + 1;
    let season: string;
    if (month >= 6 && month <= 10) season = "PEAK";
    else if (month === 4 || month === 5 || month === 11) season = "HIGH";
    else season = "LOW";

    const upper = nationality.toUpperCase();
    let tier: string;
    if (upper === "ZAMBIA" || upper === "ZAMBIAN") tier = "LOCAL";
    else if (SADC_COUNTRIES.some((c) => c.toUpperCase() === upper)) tier = "SADC";
    else tier = "INTERNATIONAL";

    const pricing = selectedRoom.pricing.find((p) => p.tier === tier && p.season === season);
    return pricing?.price ?? selectedRoom.pricing[0]?.price ?? 0;
  }, [selectedRoom, checkIn, nationality]);

  const pricePerNight = getRoomPrice();
  const totalPrice = pricePerNight * nights * roomsCount;

  function canProceedStep0() {
    return checkIn && checkOut && selectedRoomType && nights > 0 && roomsCount >= 1;
  }

  function canProceedStep1() {
    return (
      contactName.trim().length >= 2 &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail) &&
      contactPhone.trim().length >= 9
    );
  }

  async function handleSubmit() {
    if (!accommodation || !checkIn || !checkOut) return;
    setSubmitting(true);
    setError("");

    try {
      const body = {
        accommodationId: accommodation.id,
        roomTypeId: selectedRoomType,
        date: checkIn.toISOString(),
        endDate: checkOut.toISOString(),
        guests,
        rooms: roomsCount,
        contactName,
        contactEmail,
        contactPhone,
        nationality,
        specialRequests: specialRequests || undefined,
      };

      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Booking failed");
      }

      const booking = await res.json();
      router.push(`/checkout/${booking.bookingRef}`);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Something went wrong";
      setError(message);
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-700" />
      </div>
    );
  }

  if (!accommodation) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center">
            <p className="text-red-600 mb-4">{error || "Accommodation not found"}</p>
            <Button onClick={() => router.push("/accommodation")} variant="outline">
              Browse Accommodations
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Book: {accommodation.name}</h1>
          <p className="text-gray-600 mt-1">
            <Badge variant="secondary">{accommodation.type}</Badge>
            {accommodation.address && (
              <span className="ml-2 text-sm">{accommodation.address}</span>
            )}
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {STEPS.map((label, i) => (
              <div key={label} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                      i <= step ? "bg-teal-700 text-white" : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {i < step ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      i + 1
                    )}
                  </div>
                  <span className={`text-xs mt-1 ${i <= step ? "text-teal-700 font-medium" : "text-gray-400"}`}>
                    {label}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`h-0.5 flex-1 mx-2 ${i < step ? "bg-teal-700" : "bg-gray-200"}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}

            {/* Step 1: Stay Details */}
            {step === 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Stay Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Room Type Selection */}
                  <div>
                    <Label className="text-sm font-medium mb-3 block">Room Type</Label>
                    <div className="space-y-3">
                      {accommodation.roomTypes.map((room) => (
                        <div
                          key={room.id}
                          onClick={() => setSelectedRoomType(room.id)}
                          className={`p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                            selectedRoomType === room.id
                              ? "border-teal-700 bg-teal-50"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-semibold">{room.name}</p>
                              {room.description && (
                                <p className="text-sm text-gray-500 mt-1">{room.description}</p>
                              )}
                              <p className="text-xs text-gray-400 mt-1">
                                Max occupancy: {room.maxOccupancy} guests
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-teal-700">
                                {formatCurrency(room.pricing[0]?.price ?? 0, "USD" as Currency)}
                              </p>
                              <p className="text-xs text-gray-500">per night</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Check-in / Check-out */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <Label className="text-sm font-medium mb-2 block">Check-in Date</Label>
                      <Calendar
                        mode="single"
                        selected={checkIn}
                        onSelect={(date) => {
                          setCheckIn(date);
                          if (date && checkOut && date >= checkOut) {
                            setCheckOut(undefined);
                          }
                        }}
                        disabled={(date) => date < new Date()}
                        className="rounded-md border"
                      />
                    </div>
                    <div>
                      <Label className="text-sm font-medium mb-2 block">Check-out Date</Label>
                      <Calendar
                        mode="single"
                        selected={checkOut}
                        onSelect={setCheckOut}
                        disabled={(date) => !checkIn || date <= checkIn}
                        className="rounded-md border"
                      />
                    </div>
                  </div>

                  {/* Rooms & Guests */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="rooms">Number of Rooms</Label>
                      <div className="flex items-center gap-3 mt-2">
                        <Button variant="outline" size="sm" onClick={() => setRoomsCount(Math.max(1, roomsCount - 1))}>
                          -
                        </Button>
                        <span className="text-lg font-semibold w-8 text-center">{roomsCount}</span>
                        <Button variant="outline" size="sm" onClick={() => setRoomsCount(Math.min(10, roomsCount + 1))}>
                          +
                        </Button>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="guests">Number of Guests</Label>
                      <div className="flex items-center gap-3 mt-2">
                        <Button variant="outline" size="sm" onClick={() => setGuests(Math.max(1, guests - 1))}>
                          -
                        </Button>
                        <span className="text-lg font-semibold w-8 text-center">{guests}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            setGuests(Math.min((selectedRoom?.maxOccupancy ?? 4) * roomsCount, guests + 1))
                          }
                        >
                          +
                        </Button>
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={() => setStep(1)}
                    disabled={!canProceedStep0()}
                    className="w-full bg-teal-700 hover:bg-teal-800"
                  >
                    Continue to Your Details
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Step 2: Customer Details */}
            {step === 1 && (
              <Card>
                <CardHeader>
                  <CardTitle>Your Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        placeholder="John Doe"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        placeholder="john@example.com"
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        value={contactPhone}
                        onChange={(e) => setContactPhone(e.target.value)}
                        placeholder="+260 XXX XXX XXX"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="nationality">Nationality</Label>
                      <Select value={nationality} onValueChange={setNationality}>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select nationality" />
                        </SelectTrigger>
                        <SelectContent>
                          {NATIONALITIES.map((n) => (
                            <SelectItem key={n} value={n}>
                              {n}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="requests">Special Requests</Label>
                    <Textarea
                      id="requests"
                      value={specialRequests}
                      onChange={(e) => setSpecialRequests(e.target.value)}
                      placeholder="Early check-in, extra bed, dietary requirements, etc."
                      className="mt-1"
                      rows={3}
                    />
                  </div>

                  <div className="flex gap-3">
                    <Button variant="outline" onClick={() => setStep(0)} className="flex-1">
                      Back
                    </Button>
                    <Button
                      onClick={() => setStep(2)}
                      disabled={!canProceedStep1()}
                      className="flex-1 bg-teal-700 hover:bg-teal-800"
                    >
                      Review Booking
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 3: Review */}
            {step === 2 && (
              <Card>
                <CardHeader>
                  <CardTitle>Review Your Booking</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    <h3 className="font-semibold text-gray-900">Stay Details</h3>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <span className="text-gray-500">Accommodation</span>
                      <span className="font-medium">{accommodation.name}</span>
                      <span className="text-gray-500">Room Type</span>
                      <span className="font-medium">{selectedRoom?.name}</span>
                      <span className="text-gray-500">Check-in</span>
                      <span className="font-medium">
                        {checkIn?.toLocaleDateString("en-GB", { weekday: "short", year: "numeric", month: "long", day: "numeric" })}
                      </span>
                      <span className="text-gray-500">Check-out</span>
                      <span className="font-medium">
                        {checkOut?.toLocaleDateString("en-GB", { weekday: "short", year: "numeric", month: "long", day: "numeric" })}
                      </span>
                      <span className="text-gray-500">Nights</span>
                      <span className="font-medium">{nights}</span>
                      <span className="text-gray-500">Rooms</span>
                      <span className="font-medium">{roomsCount}</span>
                      <span className="text-gray-500">Guests</span>
                      <span className="font-medium">{guests}</span>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <h3 className="font-semibold text-gray-900">Contact Information</h3>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <span className="text-gray-500">Name</span>
                      <span className="font-medium">{contactName}</span>
                      <span className="text-gray-500">Email</span>
                      <span className="font-medium">{contactEmail}</span>
                      <span className="text-gray-500">Phone</span>
                      <span className="font-medium">{contactPhone}</span>
                      {nationality && (
                        <>
                          <span className="text-gray-500">Nationality</span>
                          <span className="font-medium">{nationality}</span>
                        </>
                      )}
                    </div>
                  </div>

                  <Separator />

                  <div className="flex gap-3">
                    <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                      Back
                    </Button>
                    <Button
                      onClick={handleSubmit}
                      disabled={submitting}
                      className="flex-1 bg-amber-600 hover:bg-amber-700 text-white"
                    >
                      {submitting ? (
                        <span className="flex items-center gap-2">
                          <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                          Processing...
                        </span>
                      ) : (
                        "Confirm & Proceed to Payment"
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Price Summary Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle className="text-lg">Price Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {accommodation.images[0] && (
                  <img
                    src={accommodation.images[0]}
                    alt={accommodation.name}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                )}

                <div>
                  <h3 className="font-semibold">{accommodation.name}</h3>
                  <Badge variant="secondary" className="mt-1">{accommodation.type}</Badge>
                </div>

                <Separator />

                <div className="space-y-2 text-sm">
                  {selectedRoom && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">{selectedRoom.name}</span>
                      <span className="font-medium">
                        {formatCurrency(pricePerNight, "USD" as Currency)}/night
                      </span>
                    </div>
                  )}
                  {nights > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">
                        {nights} night{nights > 1 ? "s" : ""} x {roomsCount} room{roomsCount > 1 ? "s" : ""}
                      </span>
                      <span className="font-medium">{formatCurrency(totalPrice, "USD" as Currency)}</span>
                    </div>
                  )}
                </div>

                <Separator />

                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-teal-700">
                    {formatCurrency(totalPrice, "USD" as Currency)}
                  </span>
                </div>

                <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
                  <p className="font-medium text-gray-700 mb-1">Deposit Option</p>
                  <p>
                    Pay a 30% deposit of{" "}
                    <span className="font-semibold">
                      {formatCurrency(Math.round(totalPrice * 0.3 * 100) / 100, "USD" as Currency)}
                    </span>{" "}
                    now and the balance before check-in.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
