export const dynamic = "force-dynamic";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect, notFound } from "next/navigation";
import { formatCurrency } from "@/lib/pricing";
import type { Currency } from "@/lib/pricing";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import {
  ArrowLeft,
  MapPin,
  Building2,
  CalendarDays,
  Users,
  BedDouble,
  Receipt,
} from "lucide-react";
import { CancelBookingButton } from "@/components/portal/cancel-booking-button";

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800 border-yellow-200",
  CONFIRMED: "bg-blue-100 text-blue-800 border-blue-200",
  CANCELLED: "bg-red-100 text-red-800 border-red-200",
  COMPLETED: "bg-green-100 text-green-800 border-green-200",
  REFUNDED: "bg-gray-100 text-gray-800 border-gray-200",
};

const paymentStatusColors: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  COMPLETED: "bg-green-100 text-green-800",
  FAILED: "bg-red-100 text-red-800",
  REFUNDED: "bg-gray-100 text-gray-800",
};

export default async function BookingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const { id } = await params;

  let booking;
  try {
    booking = await db.booking.findUnique({
      where: { id },
      include: {
        tour: { select: { id: true, name: true, slug: true } },
        accommodation: { select: { id: true, name: true, slug: true } },
        roomType: { select: { id: true, name: true } },
        addOns: {
          include: { addOn: { select: { name: true } } },
        },
        payments: {
          orderBy: { createdAt: "desc" },
        },
      },
    });
  } catch (error) {
    console.error("Error fetching booking:", error);
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Something went wrong loading this booking.</p>
        <Button asChild variant="outline" className="mt-4">
          <Link href="/portal/bookings">Back to Bookings</Link>
        </Button>
      </div>
    );
  }

  if (!booking || booking.userId !== session.user.id) {
    notFound();
  }

  const currency = booking.currency as Currency;
  const isTour = booking.type === "TOUR";
  const name = isTour ? booking.tour?.name : booking.accommodation?.name;
  const canCancel = booking.status === "PENDING" || booking.status === "CONFIRMED";

  const formatDate = (date: Date | null) => {
    if (!date) return "TBD";
    return new Date(date).toLocaleDateString("en-GB", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Button variant="ghost" size="sm" asChild className="-ml-2">
        <Link href="/portal/bookings">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Bookings
        </Link>
      </Button>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold text-gray-900">{name || "Booking"}</h1>
            <Badge variant="secondary" className={statusColors[booking.status]}>
              {booking.status}
            </Badge>
          </div>
          <p className="text-gray-500 font-mono text-sm">
            Ref: {booking.bookingRef}
          </p>
        </div>
        <div className="flex gap-2">
          {canCancel && <CancelBookingButton bookingId={booking.id} />}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Booking Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                {isTour ? (
                  <MapPin className="h-5 w-5 text-teal-600" />
                ) : (
                  <Building2 className="h-5 w-5 text-amber-600" />
                )}
                {isTour ? "Tour Details" : "Accommodation Details"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                <div>
                  <dt className="text-sm text-gray-500">Type</dt>
                  <dd className="text-sm font-medium text-gray-900 mt-0.5">
                    {isTour ? "Tour" : "Accommodation"}
                  </dd>
                </div>

                {isTour ? (
                  <>
                    <div>
                      <dt className="text-sm text-gray-500">Tour Date</dt>
                      <dd className="text-sm font-medium text-gray-900 mt-0.5 flex items-center gap-1.5">
                        <CalendarDays className="h-4 w-4 text-gray-400" />
                        {formatDate(booking.tourDate)}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm text-gray-500">Guests</dt>
                      <dd className="text-sm font-medium text-gray-900 mt-0.5 flex items-center gap-1.5">
                        <Users className="h-4 w-4 text-gray-400" />
                        {booking.guests} guest{booking.guests !== 1 ? "s" : ""}
                      </dd>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <dt className="text-sm text-gray-500">Room Type</dt>
                      <dd className="text-sm font-medium text-gray-900 mt-0.5">
                        {booking.roomType?.name || "Standard"}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm text-gray-500">Check-in</dt>
                      <dd className="text-sm font-medium text-gray-900 mt-0.5 flex items-center gap-1.5">
                        <CalendarDays className="h-4 w-4 text-gray-400" />
                        {formatDate(booking.checkIn)}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm text-gray-500">Check-out</dt>
                      <dd className="text-sm font-medium text-gray-900 mt-0.5 flex items-center gap-1.5">
                        <CalendarDays className="h-4 w-4 text-gray-400" />
                        {formatDate(booking.checkOut)}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm text-gray-500">Rooms</dt>
                      <dd className="text-sm font-medium text-gray-900 mt-0.5 flex items-center gap-1.5">
                        <BedDouble className="h-4 w-4 text-gray-400" />
                        {booking.rooms || 1} room{(booking.rooms || 1) !== 1 ? "s" : ""}
                      </dd>
                    </div>
                  </>
                )}

                <div>
                  <dt className="text-sm text-gray-500">Booked On</dt>
                  <dd className="text-sm font-medium text-gray-900 mt-0.5">
                    {formatDate(booking.createdAt)}
                  </dd>
                </div>

                <div>
                  <dt className="text-sm text-gray-500">Pricing Tier</dt>
                  <dd className="text-sm font-medium text-gray-900 mt-0.5 capitalize">
                    {booking.pricingTier.toLowerCase()} &middot;{" "}
                    {booking.season.toLowerCase()} season
                  </dd>
                </div>
              </dl>

              {booking.specialRequests && (
                <div className="mt-6 pt-4 border-t border-gray-100">
                  <dt className="text-sm text-gray-500 mb-1">Special Requests</dt>
                  <dd className="text-sm text-gray-900 bg-gray-50 rounded-lg p-3">
                    {booking.specialRequests}
                  </dd>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Payment History */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Receipt className="h-5 w-5 text-gray-500" />
                Payment History
              </CardTitle>
            </CardHeader>
            <CardContent>
              {booking.payments.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">
                  No payments recorded yet.
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Method</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {booking.payments.map((payment) => (
                        <TableRow key={payment.id}>
                          <TableCell className="text-sm">
                            {new Date(payment.createdAt).toLocaleDateString("en-GB", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </TableCell>
                          <TableCell className="text-sm capitalize">
                            {payment.method.toLowerCase().replace("_", " ")}
                          </TableCell>
                          <TableCell className="text-sm">
                            {payment.isDeposit ? "Deposit" : "Full Payment"}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="secondary"
                              className={paymentStatusColors[payment.status]}
                            >
                              {payment.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right font-medium text-sm">
                            {formatCurrency(payment.amount, payment.currency as Currency)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar: Pricing + Contact */}
        <div className="space-y-6">
          {/* Pricing Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Pricing Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Base Price</span>
                  <span className="font-medium">
                    {formatCurrency(booking.basePrice, currency)}
                  </span>
                </div>
                {booking.addOns.length > 0 && (
                  <>
                    {booking.addOns.map((addon) => (
                      <div key={addon.id} className="flex justify-between text-sm">
                        <span className="text-gray-500">
                          {addon.addOn.name} x{addon.quantity}
                        </span>
                        <span className="font-medium">
                          {formatCurrency(addon.price * addon.quantity, currency)}
                        </span>
                      </div>
                    ))}
                  </>
                )}
                {booking.addOnsTotal > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Add-ons Subtotal</span>
                    <span className="font-medium">
                      {formatCurrency(booking.addOnsTotal, currency)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-sm pt-3 border-t border-gray-100">
                  <span className="font-semibold text-gray-900">Total</span>
                  <span className="font-bold text-gray-900 text-base">
                    {formatCurrency(booking.totalPrice, currency)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Customer Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Contact Info</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="space-y-3">
                <div>
                  <dt className="text-xs text-gray-500">Name</dt>
                  <dd className="text-sm font-medium text-gray-900">
                    {booking.customerName}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-gray-500">Email</dt>
                  <dd className="text-sm font-medium text-gray-900">
                    {booking.customerEmail}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-gray-500">Phone</dt>
                  <dd className="text-sm font-medium text-gray-900">
                    {booking.customerPhone}
                  </dd>
                </div>
              </dl>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
