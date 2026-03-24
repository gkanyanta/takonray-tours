export const dynamic = "force-dynamic";

import { db } from "@/lib/db";
import {
  DollarSign,
  CalendarCheck,
  Map,
  UserPlus,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { format } from "date-fns";

async function getDashboardStats() {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [
    totalRevenue,
    totalBookings,
    activeTours,
    newUsersThisMonth,
    recentBookings,
    pendingReviews,
  ] = await Promise.all([
    db.payment
      .aggregate({
        where: { status: "COMPLETED" },
        _sum: { amount: true },
      })
      .then((r) => r._sum.amount ?? 0),
    db.booking.count(),
    db.tour.count({ where: { active: true } }),
    db.user.count({ where: { createdAt: { gte: startOfMonth } } }),
    db.booking.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
      include: { tour: true, accommodation: true },
    }),
    db.review.findMany({
      where: { approved: false },
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { user: true, tour: true, accommodation: true },
    }),
  ]);

  return {
    totalRevenue,
    totalBookings,
    activeTours,
    newUsersThisMonth,
    recentBookings,
    pendingReviews,
  };
}

export default async function AdminDashboard() {
  const stats = await getDashboardStats();

  const statCards = [
    {
      title: "Total Revenue",
      value: `$${stats.totalRevenue.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
      icon: DollarSign,
      change: "+12.5%",
      up: true,
      color: "bg-teal-600",
    },
    {
      title: "Total Bookings",
      value: stats.totalBookings.toString(),
      icon: CalendarCheck,
      change: "+8.2%",
      up: true,
      color: "bg-amber-600",
    },
    {
      title: "Active Tours",
      value: stats.activeTours.toString(),
      icon: Map,
      change: "+2",
      up: true,
      color: "bg-blue-600",
    },
    {
      title: "New Users",
      value: stats.newUsersThisMonth.toString(),
      icon: UserPlus,
      change: "+15.3%",
      up: true,
      color: "bg-purple-600",
    },
  ];

  const statusColors: Record<string, string> = {
    PENDING: "bg-yellow-100 text-yellow-800",
    CONFIRMED: "bg-green-100 text-green-800",
    CANCELLED: "bg-red-100 text-red-800",
    COMPLETED: "bg-blue-100 text-blue-800",
    REFUNDED: "bg-gray-100 text-gray-800",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500">
            Overview of your tour business
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link href="/admin/tours/new">Add Tour</Link>
          </Button>
          <Button asChild className="bg-teal-600 hover:bg-teal-700">
            <Link href="/admin/bookings">View Bookings</Link>
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      {stat.title}
                    </p>
                    <p className="mt-1 text-2xl font-bold text-gray-900">
                      {stat.value}
                    </p>
                  </div>
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-lg ${stat.color}`}
                  >
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div className="mt-3 flex items-center text-sm">
                  {stat.up ? (
                    <ArrowUpRight className="mr-1 h-4 w-4 text-green-500" />
                  ) : (
                    <ArrowDownRight className="mr-1 h-4 w-4 text-red-500" />
                  )}
                  <span
                    className={stat.up ? "text-green-600" : "text-red-600"}
                  >
                    {stat.change}
                  </span>
                  <span className="ml-1 text-gray-500">vs last month</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Revenue Chart Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Revenue</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex h-64 items-end gap-2">
            {[65, 45, 78, 52, 88, 72, 95, 60, 82, 70, 55, 90].map(
              (height, i) => (
                <div key={i} className="flex flex-1 flex-col items-center gap-1">
                  <div
                    className="w-full rounded-t bg-teal-500 transition-all hover:bg-teal-600"
                    style={{ height: `${height}%` }}
                  />
                  <span className="text-[10px] text-gray-500">
                    {
                      [
                        "Jan",
                        "Feb",
                        "Mar",
                        "Apr",
                        "May",
                        "Jun",
                        "Jul",
                        "Aug",
                        "Sep",
                        "Oct",
                        "Nov",
                        "Dec",
                      ][i]
                    }
                  </span>
                </div>
              )
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Bookings */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Bookings</CardTitle>
            <Button asChild variant="ghost" size="sm">
              <Link href="/admin/bookings">View all</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.recentBookings.length === 0 ? (
                <p className="text-sm text-gray-500">No bookings yet</p>
              ) : (
                stats.recentBookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="flex items-center justify-between rounded-lg border p-3"
                  >
                    <div>
                      <p className="text-sm font-medium">
                        {booking.customerName}
                      </p>
                      <p className="text-xs text-gray-500">
                        {booking.bookingRef} &middot;{" "}
                        {booking.tour?.name ??
                          booking.accommodation?.name ??
                          "N/A"}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">
                        ${booking.totalPrice.toFixed(2)}
                      </span>
                      <Badge
                        className={
                          statusColors[booking.status] ??
                          "bg-gray-100 text-gray-800"
                        }
                        variant="secondary"
                      >
                        {booking.status}
                      </Badge>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Reviews to Moderate */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Reviews to Moderate</CardTitle>
            <Button asChild variant="ghost" size="sm">
              <Link href="/admin/reviews">View all</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.pendingReviews.length === 0 ? (
                <p className="text-sm text-gray-500">
                  No reviews pending moderation
                </p>
              ) : (
                stats.pendingReviews.map((review) => (
                  <div
                    key={review.id}
                    className="rounded-lg border p-3"
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">
                        {review.user.name ?? review.user.email}
                      </p>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <span
                            key={i}
                            className={
                              i < review.rating
                                ? "text-amber-400"
                                : "text-gray-300"
                            }
                          >
                            &#9733;
                          </span>
                        ))}
                      </div>
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                      {review.tour?.name ??
                        review.accommodation?.name ??
                        "N/A"}
                    </p>
                    <p className="mt-1 line-clamp-2 text-sm text-gray-600">
                      {review.comment}
                    </p>
                    <p className="mt-1 text-xs text-gray-400">
                      {format(new Date(review.createdAt), "MMM d, yyyy")}
                    </p>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
