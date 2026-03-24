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
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SADC_COUNTRIES } from "@/lib/constants";
import { formatCurrency, type Currency } from "@/lib/pricing";

interface TourData {
  id: string;
  name: string;
  slug: string;
  description: string;
  duration: string;
  maxGroupSize: number;
  difficulty: string | null;
  images: string[];
  includes: string[];
  excludes: string[];
  highlights: string[];
  pricing: { tier: string; season: string; price: number }[];
  addOns: { id: string; name: string; description: string | null; price: number }[];
}

interface AddOnSelection {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

const STEPS = ["Date & Guests", "Your Details", "Review & Confirm"];

const NATIONALITIES = ["Zambia", ...SADC_COUNTRIES.filter((c) => c !== "Zambia"), "Other"];

export default function TourBookingPage() {
  const router = useRouter();
  const params = useParams();
  const slug = params.slug as string;

  const [step, setStep] = useState(0);
  const [tour, setTour] = useState<TourData | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Step 1 fields
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [guests, setGuests] = useState(1);
  const [selectedAddOns, setSelectedAddOns] = useState<AddOnSelection[]>([]);

  // Step 2 fields
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [nationality, setNationality] = useState("");
  const [specialRequests, setSpecialRequests] = useState("");

  useEffect(() => {
    async function fetchTour() {
      try {
        const res = await fetch(`/api/tours/${slug}`);
        if (!res.ok) throw new Error("Tour not found");
        const data = await res.json();
        setTour(data);
      } catch {
        setError("Could not load tour details. Please try again.");
      } finally {
        setLoading(false);
      }
    }
    fetchTour();
  }, [slug]);

  const getPrice = useCallback(() => {
    if (!tour || !selectedDate) return 0;
    const month = selectedDate.getMonth() + 1;
    let season: string;
    if (month >= 6 && month <= 10) season = "PEAK";
    else if (month === 4 || month === 5 || month === 11) season = "HIGH";
    else season = "LOW";

    const upper = nationality.toUpperCase();
    let tier: string;
    if (upper === "ZAMBIA" || upper === "ZAMBIAN") tier = "LOCAL";
    else if (SADC_COUNTRIES.some((c) => c.toUpperCase() === upper)) tier = "SADC";
    else tier = "INTERNATIONAL";

    const pricing = tour.pricing.find((p) => p.tier === tier && p.season === season);
    return pricing?.price ?? tour.pricing[0]?.price ?? 0;
  }, [tour, selectedDate, nationality]);

  const basePrice = getPrice();
  const baseTotal = basePrice * guests;
  const addOnsTotal = selectedAddOns.reduce((sum, a) => sum + a.price * a.quantity, 0);
  const grandTotal = baseTotal + addOnsTotal;

  function toggleAddOn(addOn: TourData["addOns"][0]) {
    setSelectedAddOns((prev) => {
      const exists = prev.find((a) => a.id === addOn.id);
      if (exists) return prev.filter((a) => a.id !== addOn.id);
      return [...prev, { id: addOn.id, name: addOn.name, price: addOn.price, quantity: 1 }];
    });
  }

  function updateAddOnQty(id: string, qty: number) {
    setSelectedAddOns((prev) => prev.map((a) => (a.id === id ? { ...a, quantity: Math.max(1, qty) } : a)));
  }

  function canProceedStep0() {
    return selectedDate && guests >= 1;
  }

  function canProceedStep1() {
    return contactName.trim().length >= 2 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail) && contactPhone.trim().length >= 9;
  }

  async function handleSubmit() {
    if (!tour || !selectedDate) return;
    setSubmitting(true);
    setError("");

    try {
      const body = {
        tourId: tour.id,
        date: selectedDate.toISOString(),
        guests,
        addOns: selectedAddOns.map((a) => ({ id: a.id, quantity: a.quantity })),
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

  if (!tour) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center">
            <p className="text-red-600 mb-4">{error || "Tour not found"}</p>
            <Button onClick={() => router.push("/tours")} variant="outline">
              Browse Tours
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
          <h1 className="text-3xl font-bold text-gray-900">Book: {tour.name}</h1>
          <p className="text-gray-600 mt-1">{tour.duration} &middot; Max {tour.maxGroupSize} guests</p>
        </div>

        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {STEPS.map((label, i) => (
              <div key={label} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                      i <= step
                        ? "bg-teal-700 text-white"
                        : "bg-gray-200 text-gray-500"
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
                  <span
                    className={`text-xs mt-1 ${
                      i <= step ? "text-teal-700 font-medium" : "text-gray-400"
                    }`}
                  >
                    {label}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div
                    className={`h-0.5 flex-1 mx-2 ${
                      i < step ? "bg-teal-700" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}

            {/* Step 1: Date & Guests */}
            {step === 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Select Date &amp; Guests</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label className="text-sm font-medium mb-2 block">Tour Date</Label>
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      disabled={(date) => date < new Date()}
                      className="rounded-md border"
                    />
                  </div>

                  <div>
                    <Label htmlFor="guests">Number of Guests</Label>
                    <div className="flex items-center gap-3 mt-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setGuests(Math.max(1, guests - 1))}
                      >
                        -
                      </Button>
                      <span className="text-lg font-semibold w-8 text-center">{guests}</span>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setGuests(Math.min(tour.maxGroupSize, guests + 1))}
                      >
                        +
                      </Button>
                      <span className="text-sm text-gray-500">
                        (max {tour.maxGroupSize})
                      </span>
                    </div>
                  </div>

                  {tour.addOns.length > 0 && (
                    <div>
                      <Label className="text-sm font-medium mb-3 block">Add-ons</Label>
                      <div className="space-y-3">
                        {tour.addOns.map((addOn) => {
                          const selected = selectedAddOns.find((a) => a.id === addOn.id);
                          return (
                            <div
                              key={addOn.id}
                              className={`flex items-start gap-3 p-3 rounded-lg border transition-colors ${
                                selected ? "border-teal-700 bg-teal-50" : "border-gray-200"
                              }`}
                            >
                              <Checkbox
                                checked={!!selected}
                                onCheckedChange={() => toggleAddOn(addOn)}
                              />
                              <div className="flex-1">
                                <p className="font-medium text-sm">{addOn.name}</p>
                                {addOn.description && (
                                  <p className="text-xs text-gray-500 mt-0.5">{addOn.description}</p>
                                )}
                              </div>
                              <div className="text-right">
                                <p className="font-semibold text-sm text-teal-700">
                                  {formatCurrency(addOn.price, "USD" as Currency)}
                                </p>
                                {selected && (
                                  <div className="flex items-center gap-1 mt-1">
                                    <button
                                      type="button"
                                      className="w-6 h-6 rounded bg-gray-200 text-xs"
                                      onClick={() => updateAddOnQty(addOn.id, selected.quantity - 1)}
                                    >
                                      -
                                    </button>
                                    <span className="text-xs w-4 text-center">{selected.quantity}</span>
                                    <button
                                      type="button"
                                      className="w-6 h-6 rounded bg-gray-200 text-xs"
                                      onClick={() => updateAddOnQty(addOn.id, selected.quantity + 1)}
                                    >
                                      +
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

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
                      placeholder="Dietary requirements, accessibility needs, etc."
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

            {/* Step 3: Review & Confirm */}
            {step === 2 && (
              <Card>
                <CardHeader>
                  <CardTitle>Review Your Booking</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    <h3 className="font-semibold text-gray-900">Tour Details</h3>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <span className="text-gray-500">Tour</span>
                      <span className="font-medium">{tour.name}</span>
                      <span className="text-gray-500">Date</span>
                      <span className="font-medium">
                        {selectedDate?.toLocaleDateString("en-GB", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                      <span className="text-gray-500">Guests</span>
                      <span className="font-medium">{guests}</span>
                      <span className="text-gray-500">Duration</span>
                      <span className="font-medium">{tour.duration}</span>
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
                    {specialRequests && (
                      <div className="text-sm">
                        <span className="text-gray-500 block">Special Requests</span>
                        <span className="font-medium">{specialRequests}</span>
                      </div>
                    )}
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
                {tour.images[0] && (
                  <img
                    src={tour.images[0]}
                    alt={tour.name}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                )}

                <div>
                  <h3 className="font-semibold">{tour.name}</h3>
                  <div className="flex gap-2 mt-1">
                    <Badge variant="secondary">{tour.duration}</Badge>
                    {tour.difficulty && <Badge variant="outline">{tour.difficulty}</Badge>}
                  </div>
                </div>

                <Separator />

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      {formatCurrency(basePrice, "USD" as Currency)} x {guests} guest{guests > 1 ? "s" : ""}
                    </span>
                    <span className="font-medium">{formatCurrency(baseTotal, "USD" as Currency)}</span>
                  </div>

                  {selectedAddOns.map((addOn) => (
                    <div key={addOn.id} className="flex justify-between">
                      <span className="text-gray-600">
                        {addOn.name} x{addOn.quantity}
                      </span>
                      <span className="font-medium">
                        {formatCurrency(addOn.price * addOn.quantity, "USD" as Currency)}
                      </span>
                    </div>
                  ))}
                </div>

                <Separator />

                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-teal-700">
                    {formatCurrency(grandTotal, "USD" as Currency)}
                  </span>
                </div>

                <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
                  <p className="font-medium text-gray-700 mb-1">Deposit Option</p>
                  <p>
                    You can pay a 30% deposit of{" "}
                    <span className="font-semibold">
                      {formatCurrency(Math.round(grandTotal * 0.3 * 100) / 100, "USD" as Currency)}
                    </span>{" "}
                    now and the balance before your tour.
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
