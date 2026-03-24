export const dynamic = "force-dynamic";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { formatCurrency } from "@/lib/pricing";
import type { Currency } from "@/lib/pricing";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  CalendarDays,
  Plane,
  DollarSign,
  MapPin,
  Building2,
  ArrowRight,
} from "lucide-react";

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  CONFIRMED: "bg-blue-100 text-blue-800",
  CANCELLED: "bg-red-100 text-red-800",
  COMPLETED: "bg-green-100 text-green-800",
  REFUNDED: "bg-gray-100 text-gray-800",
};

export default async function PortalDashboard() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  let totalBookings = 0;
  let upcomingTrips = 0;
  let totalSpent = 0;
  let recentBookings: Array<{
    id: string;
    bookingRef: string;
    type: string;
    status: string;
    totalPrice: number;
    currency: string;
    tourDate: Date | null;
    checkIn: Date | null;
    createdAt: Date;
    tour: { name: string } | null;
    accommodation: { name: string } | null;
  }> = [];

  try {
    const [countAll, countUpcoming, spentResult, recent] = await Promise.all([
      db.booking.count({ where: { userId: session.user.id } }),
      db.booking.count({
        where: {
          userId: session.user.id,
          status: { in: ["PENDING", "CONFIRMED"] },
          OR: [
            { tourDate: { gte: new Date() } },
            { checkIn: { gte: new Date() } },
          ],
        },
      }),
      db.booking.aggregate({
        where: {
          userId: session.user.id,
          status: { in: ["CONFIRMED", "COMPLETED"] },
        },
        _sum: { totalPrice: true },
      }),
      db.booking.findMany({
        where: { userId: session.user.id },
        include: {
          tour: { select: { name: true } },
          accommodation: { select: { name: true } },
        },
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
    ]);

    totalBookings = countAll;
    upcomingTrips = countUpcoming;
    totalSpent = spentResult._sum.totalPrice || 0;
    recentBookings = recent;
  } catch (error) {
    console.error("Error loading dashboard data:", error);
  }

  const firstName = session.user.name?.split(" ")[0] || "there";

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          Welcome back, {firstName}
        </h1>
        <p className="mt-1 text-gray-500">
          Here is an overview of your bookings and trips.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-teal-50">
                <CalendarDays className="h-6 w-6 text-teal-700" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Bookings</p>
                <p className="text-2xl font-bold text-gray-900">{totalBookings}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-amber-50">
                <Plane className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Upcoming Trips</p>
                <p className="text-2xl font-bold text-gray-900">{upcomingTrips}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-50">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Spent</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(totalSpent, "USD")}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3">
        <Button asChild className="bg-teal-700 hover:bg-teal-800">
          <Link href="/tours">
            <MapPin className="h-4 w-4 mr-2" />
            Browse Tours
          </Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/accommodations">
            <Building2 className="h-4 w-4 mr-2" />
            Browse Accommodations
          </Link>
        </Button>
      </div>

      {/* Recent Bookings */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Recent Bookings</CardTitle>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/portal/bookings" className="text-teal-700 hover:text-teal-800">
              View all
              <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          {recentBookings.length === 0 ? (
            <div className="text-center py-8">
              <CalendarDays className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No bookings yet</p>
              <p className="text-sm text-gray-400 mt-1">
                Start exploring tours and accommodations in Livingstone!
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentBookings.map((booking) => {
                const name =
                  booking.type === "TOUR"
                    ? booking.tour?.name
                    : booking.accommodation?.name;
                const date =
                  booking.type === "TOUR"
                    ? booking.tourDate
                    : booking.checkIn;

                return (
                  <Link
                    key={booking.id}
                    href={`/portal/bookings/${booking.id}`}
                    className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 flex-shrink-0">
                        {booking.type === "TOUR" ? (
                          <MapPin className="h-5 w-5 text-gray-500" />
                        ) : (
                          <Building2 className="h-5 w-5 text-gray-500" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {name || booking.bookingRef}
                        </p>
                        <p className="text-xs text-gray-500">
                          {booking.bookingRef} &middot;{" "}
                          {date
                            ? new Date(date).toLocaleDateString("en-GB", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })
                            : "Date TBD"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <Badge
                        variant="secondary"
                        className={statusColors[booking.status]}
                      >
                        {booking.status}
                      </Badge>
                      <span className="text-sm font-medium text-gray-900">
                        {formatCurrency(booking.totalPrice, booking.currency as Currency)}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
