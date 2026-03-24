import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  Calendar,
  CreditCard,
  MapPin,
} from "lucide-react";
import { BookingStatusUpdate } from "@/components/admin/booking-status-update";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function BookingDetailPage({ params }: Props) {
  const { id } = await params;
  const booking = await db.booking.findUnique({
    where: { id },
    include: {
      user: true,
      tour: true,
      accommodation: true,
      roomType: true,
      addOns: { include: { addOn: true } },
      payments: { orderBy: { createdAt: "desc" } },
    },
  });

  if (!booking) notFound();

  const statusColors: Record<string, string> = {
    PENDING: "bg-yellow-100 text-yellow-800",
    CONFIRMED: "bg-green-100 text-green-800",
    CANCELLED: "bg-red-100 text-red-800",
    COMPLETED: "bg-blue-100 text-blue-800",
    REFUNDED: "bg-gray-100 text-gray-800",
  };

  const paymentStatusColors: Record<string, string> = {
    PENDING: "bg-yellow-100 text-yellow-800",
    COMPLETED: "bg-green-100 text-green-800",
    FAILED: "bg-red-100 text-red-800",
    REFUNDED: "bg-gray-100 text-gray-800",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button asChild variant="ghost" size="sm">
          <Link href="/admin/bookings">
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Booking {booking.bookingRef}
          </h1>
          <p className="text-sm text-gray-500">
            Created {format(new Date(booking.createdAt), "MMMM d, yyyy 'at' h:mm a")}
          </p>
        </div>
        <Badge
          className={
            statusColors[booking.status] ?? "bg-gray-100 text-gray-800"
          }
          variant="secondary"
        >
          {booking.status}
        </Badge>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Info */}
        <div className="space-y-6 lg:col-span-2">
          {/* Booking Details */}
          <Card>
            <CardHeader>
              <CardTitle>Booking Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-sm text-gray-500">Type</p>
                  <p className="font-medium">{booking.type}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">
                    {booking.type === "TOUR" ? "Tour" : "Accommodation"}
                  </p>
                  <p className="font-medium">
                    {booking.tour?.name ??
                      booking.accommodation?.name ??
                      "N/A"}
                  </p>
                </div>
                {booking.roomType && (
                  <div>
                    <p className="text-sm text-gray-500">Room Type</p>
                    <p className="font-medium">{booking.roomType.name}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-gray-500">
                    {booking.type === "TOUR" ? "Tour Date" : "Check-in / Check-out"}
                  </p>
                  <p className="font-medium">
                    {booking.tourDate
                      ? format(new Date(booking.tourDate), "MMMM d, yyyy")
                      : booking.checkIn
                      ? `${format(new Date(booking.checkIn), "MMM d, yyyy")} - ${
                          booking.checkOut
                            ? format(new Date(booking.checkOut), "MMM d, yyyy")
                            : "?"
                        }`
                      : "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">
                    {booking.type === "TOUR" ? "Guests" : "Rooms"}
                  </p>
                  <p className="font-medium">
                    {booking.type === "TOUR"
                      ? booking.guests
                      : booking.rooms ?? "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Pricing Tier</p>
                  <p className="font-medium">{booking.pricingTier}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Season</p>
                  <p className="font-medium">{booking.season}</p>
                </div>
              </div>

              {booking.specialRequests && (
                <>
                  <Separator />
                  <div>
                    <p className="text-sm text-gray-500">Special Requests</p>
                    <p className="mt-1 text-sm">{booking.specialRequests}</p>
                  </div>
                </>
              )}

              {/* Add-ons */}
              {booking.addOns.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <p className="mb-2 text-sm font-medium text-gray-500">
                      Add-ons
                    </p>
                    {booking.addOns.map((ba) => (
                      <div
                        key={ba.id}
                        className="flex items-center justify-between rounded border p-2 text-sm"
                      >
                        <span>
                          {ba.addOn.name} x{ba.quantity}
                        </span>
                        <span className="font-medium">
                          ${ba.price.toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Pricing */}
          <Card>
            <CardHeader>
              <CardTitle>Pricing</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Base Price</span>
                  <span>${booking.basePrice.toFixed(2)}</span>
                </div>
                {booking.addOnsTotal > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Add-ons</span>
                    <span>${booking.addOnsTotal.toFixed(2)}</span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between font-medium">
                  <span>Total</span>
                  <span>
                    {booking.currency} ${booking.totalPrice.toFixed(2)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment History */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Payment History
              </CardTitle>
            </CardHeader>
            <CardContent>
              {booking.payments.length === 0 ? (
                <p className="text-sm text-gray-500">No payments recorded</p>
              ) : (
                <div className="space-y-3">
                  {booking.payments.map((payment) => (
                    <div
                      key={payment.id}
                      className="flex items-center justify-between rounded-lg border p-3"
                    >
                      <div>
                        <p className="text-sm font-medium">
                          {payment.currency} {payment.amount.toFixed(2)}
                        </p>
                        <p className="text-xs text-gray-500">
                          {payment.method} &middot;{" "}
                          {format(
                            new Date(payment.createdAt),
                            "MMM d, yyyy h:mm a"
                          )}
                        </p>
                        {payment.isDeposit && (
                          <Badge variant="outline" className="mt-1 text-xs">
                            Deposit
                          </Badge>
                        )}
                      </div>
                      <Badge
                        className={
                          paymentStatusColors[payment.status] ??
                          "bg-gray-100 text-gray-800"
                        }
                        variant="secondary"
                      >
                        {payment.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Customer Info */}
          <Card>
            <CardHeader>
              <CardTitle>Customer Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-gray-400" />
                <span className="text-sm">{booking.customerName}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-gray-400" />
                <span className="text-sm">{booking.customerEmail}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-gray-400" />
                <span className="text-sm">{booking.customerPhone}</span>
              </div>
              {booking.user && (
                <div className="mt-2 rounded bg-gray-50 p-2 text-xs text-gray-500">
                  Registered user: {booking.user.email}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Status Update */}
          <Card>
            <CardHeader>
              <CardTitle>Update Status</CardTitle>
            </CardHeader>
            <CardContent>
              <BookingStatusUpdate
                bookingId={booking.id}
                currentStatus={booking.status}
              />
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="h-2 w-2 rounded-full bg-teal-500" />
                    <div className="w-px flex-1 bg-gray-200" />
                  </div>
                  <div className="pb-4">
                    <p className="text-sm font-medium">Booking Created</p>
                    <p className="text-xs text-gray-500">
                      {format(
                        new Date(booking.createdAt),
                        "MMM d, yyyy h:mm a"
                      )}
                    </p>
                  </div>
                </div>
                {booking.payments.map((payment, idx) => (
                  <div key={payment.id} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="h-2 w-2 rounded-full bg-blue-500" />
                      {idx < booking.payments.length - 1 && (
                        <div className="w-px flex-1 bg-gray-200" />
                      )}
                    </div>
                    <div className="pb-4">
                      <p className="text-sm font-medium">
                        Payment {payment.status.toLowerCase()} - {payment.currency}{" "}
                        {payment.amount.toFixed(2)}
                      </p>
                      <p className="text-xs text-gray-500">
                        {format(
                          new Date(payment.createdAt),
                          "MMM d, yyyy h:mm a"
                        )}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
