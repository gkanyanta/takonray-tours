"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { formatCurrency, type Currency } from "@/lib/pricing";

interface BookingDetails {
  id: string;
  bookingRef: string;
  type: "TOUR" | "ACCOMMODATION";
  status: string;
  tourDate: string | null;
  checkIn: string | null;
  checkOut: string | null;
  guests: number;
  rooms: number | null;
  basePrice: number;
  addOnsTotal: number;
  totalPrice: number;
  currency: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  tour?: { name: string; duration: string; images: string[] };
  accommodation?: { name: string; type: string; images: string[] };
  roomType?: { name: string };
  addOns?: { addOn: { name: string }; quantity: number; price: number }[];
  payments?: { amount: number; status: string; isDeposit: boolean }[];
}

type PaymentMethodOption = {
  id: string;
  label: string;
  description: string;
  icon: string;
  flutterwaveMethod: string;
};

const PAYMENT_METHODS: PaymentMethodOption[] = [
  {
    id: "card",
    label: "Credit/Debit Card",
    description: "Visa, Mastercard, Verve",
    icon: "💳",
    flutterwaveMethod: "card",
  },
  {
    id: "mtn",
    label: "MTN Mobile Money",
    description: "Pay with MTN MoMo",
    icon: "📱",
    flutterwaveMethod: "mobilemoneyzambia",
  },
  {
    id: "airtel",
    label: "Airtel Money",
    description: "Pay with Airtel Money",
    icon: "📱",
    flutterwaveMethod: "mobilemoneyzambia",
  },
  {
    id: "zamtel",
    label: "Zamtel Money",
    description: "Pay with Zamtel Kwacha",
    icon: "📱",
    flutterwaveMethod: "mobilemoneyzambia",
  },
];

export default function CheckoutPage() {
  const params = useParams();
  const router = useRouter();
  const bookingRef = params.bookingRef as string;

  const [booking, setBooking] = useState<BookingDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [isDeposit, setIsDeposit] = useState(false);

  useEffect(() => {
    async function fetchBooking() {
      try {
        const res = await fetch(`/api/bookings/${bookingRef}`);
        if (!res.ok) throw new Error("Booking not found");
        const data = await res.json();
        setBooking(data);
      } catch {
        setError("Could not load booking details.");
      } finally {
        setLoading(false);
      }
    }
    fetchBooking();
  }, [bookingRef]);

  const paymentAmount = booking
    ? isDeposit
      ? Math.round(booking.totalPrice * 0.3 * 100) / 100
      : booking.totalPrice
    : 0;

  async function handlePayment() {
    if (!booking) return;
    setProcessing(true);
    setError("");

    try {
      const selectedMethod = PAYMENT_METHODS.find((m) => m.id === paymentMethod);

      const res = await fetch("/api/payments/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingRef: booking.bookingRef,
          method: selectedMethod?.flutterwaveMethod ?? "card",
          isDeposit,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Payment initialization failed");
      }

      const { paymentLink } = await res.json();
      window.location.href = paymentLink;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Payment failed";
      setError(message);
      setProcessing(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-700" />
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center">
            <p className="text-red-600 mb-4">{error || "Booking not found"}</p>
            <Button onClick={() => router.push("/")} variant="outline">
              Go Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const itemName =
    booking.type === "TOUR"
      ? booking.tour?.name ?? "Tour"
      : booking.accommodation?.name ?? "Accommodation";

  const itemImage =
    booking.type === "TOUR"
      ? booking.tour?.images?.[0]
      : booking.accommodation?.images?.[0];

  const currency = (booking.currency || "USD") as Currency;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
          <p className="text-gray-600 mt-1">
            Booking Reference: <span className="font-mono font-semibold">{booking.bookingRef}</span>
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Payment Section */}
          <div className="lg:col-span-2 space-y-6">
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}

            {/* Deposit Toggle */}
            <Card>
              <CardHeader>
                <CardTitle>Payment Amount</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between p-4 rounded-lg border">
                  <div>
                    <Label htmlFor="deposit-toggle" className="font-medium">
                      Pay deposit only (30%)
                    </Label>
                    <p className="text-sm text-gray-500 mt-1">
                      Pay {formatCurrency(Math.round(booking.totalPrice * 0.3 * 100) / 100, currency)} now,
                      balance of {formatCurrency(Math.round(booking.totalPrice * 0.7 * 100) / 100, currency)} due
                      before your {booking.type === "TOUR" ? "tour" : "check-in"}
                    </p>
                  </div>
                  <Switch
                    id="deposit-toggle"
                    checked={isDeposit}
                    onCheckedChange={setIsDeposit}
                  />
                </div>
                <div className="mt-4 text-center">
                  <p className="text-sm text-gray-500">Amount to pay now</p>
                  <p className="text-3xl font-bold text-teal-700">
                    {formatCurrency(paymentAmount, currency)}
                  </p>
                  {isDeposit && (
                    <Badge className="mt-2 bg-amber-100 text-amber-800 hover:bg-amber-100">
                      30% Deposit
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Payment Method Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Payment Method</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {PAYMENT_METHODS.map((method) => (
                    <div
                      key={method.id}
                      onClick={() => setPaymentMethod(method.id)}
                      className={`flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                        paymentMethod === method.id
                          ? "border-teal-700 bg-teal-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <span className="text-2xl">{method.icon}</span>
                      <div className="flex-1">
                        <p className="font-semibold text-sm">{method.label}</p>
                        <p className="text-xs text-gray-500">{method.description}</p>
                      </div>
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          paymentMethod === method.id
                            ? "border-teal-700"
                            : "border-gray-300"
                        }`}
                      >
                        {paymentMethod === method.id && (
                          <div className="w-3 h-3 rounded-full bg-teal-700" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <Button
                  onClick={handlePayment}
                  disabled={processing}
                  className="w-full mt-6 bg-amber-600 hover:bg-amber-700 text-white py-6 text-lg"
                >
                  {processing ? (
                    <span className="flex items-center gap-2">
                      <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                      Redirecting to payment...
                    </span>
                  ) : (
                    `Pay ${formatCurrency(paymentAmount, currency)} Now`
                  )}
                </Button>

                <p className="text-xs text-gray-400 text-center mt-3">
                  Secured by Flutterwave. Your payment details are encrypted and secure.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle className="text-lg">Booking Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {itemImage && (
                  <img
                    src={itemImage}
                    alt={itemName}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                )}

                <div>
                  <h3 className="font-semibold">{itemName}</h3>
                  <Badge variant="secondary" className="mt-1">
                    {booking.type === "TOUR" ? "Tour" : "Accommodation"}
                  </Badge>
                </div>

                <Separator />

                <div className="space-y-2 text-sm">
                  {booking.type === "TOUR" && booking.tourDate && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Date</span>
                      <span className="font-medium">
                        {new Date(booking.tourDate).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  )}
                  {booking.type === "ACCOMMODATION" && booking.checkIn && booking.checkOut && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Check-in</span>
                        <span className="font-medium">
                          {new Date(booking.checkIn).toLocaleDateString("en-GB", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Check-out</span>
                        <span className="font-medium">
                          {new Date(booking.checkOut).toLocaleDateString("en-GB", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                    </>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-500">Guests</span>
                    <span className="font-medium">{booking.guests}</span>
                  </div>
                  {booking.rooms && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Rooms</span>
                      <span className="font-medium">{booking.rooms}</span>
                    </div>
                  )}
                </div>

                <Separator />

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Base Price</span>
                    <span>{formatCurrency(booking.basePrice, currency)}</span>
                  </div>
                  {booking.addOnsTotal > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Add-ons</span>
                      <span>{formatCurrency(booking.addOnsTotal, currency)}</span>
                    </div>
                  )}
                </div>

                <Separator />

                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-teal-700">
                    {formatCurrency(booking.totalPrice, currency)}
                  </span>
                </div>

                <div className="text-xs text-gray-500">
                  <p>
                    <span className="font-medium">Customer:</span> {booking.customerName}
                  </p>
                  <p>{booking.customerEmail}</p>
                  <p>{booking.customerPhone}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
