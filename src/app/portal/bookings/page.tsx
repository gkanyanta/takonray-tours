"use client";

import { useEffect, useState, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import {
  CalendarDays,
  MapPin,
  Building2,
  ChevronLeft,
  ChevronRight,
  PackageOpen,
} from "lucide-react";

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  CONFIRMED: "bg-blue-100 text-blue-800",
  CANCELLED: "bg-red-100 text-red-800",
  COMPLETED: "bg-green-100 text-green-800",
  REFUNDED: "bg-gray-100 text-gray-800",
};

interface Booking {
  id: string;
  bookingRef: string;
  type: "TOUR" | "ACCOMMODATION";
  status: string;
  totalPrice: number;
  currency: string;
  tourDate: string | null;
  checkIn: string | null;
  checkOut: string | null;
  guests: number;
  rooms: number | null;
  createdAt: string;
  tour: { id: string; name: string; slug: string; images: string[] } | null;
  accommodation: { id: string; name: string; slug: string; images: string[] } | null;
}

const tabs = [
  { value: "all", label: "All" },
  { value: "upcoming", label: "Upcoming" },
  { value: "past", label: "Past" },
  { value: "cancelled", label: "Cancelled" },
];

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "10",
        status: tab,
      });
      const res = await fetch(`/api/portal/bookings?${params}`);
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setBookings(data.bookings);
      setTotalPages(data.pagination.totalPages);
    } catch {
      console.error("Error fetching bookings");
    } finally {
      setLoading(false);
    }
  }, [page, tab]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const handleTabChange = (value: string) => {
    setTab(value);
    setPage(1);
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "TBD";
    return new Date(dateStr).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formatCurrency = (amount: number, currency: string) => {
    const symbols: Record<string, string> = { USD: "$", ZMW: "ZMW ", EUR: "\u20ac", GBP: "\u00a3" };
    return `${symbols[currency] || "$"}${amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">My Bookings</h1>
        <p className="mt-1 text-gray-500">View and manage all your bookings.</p>
      </div>

      <Tabs value={tab} onValueChange={handleTabChange}>
        <TabsList className="bg-white border">
          {tabs.map((t) => (
            <TabsTrigger
              key={t.value}
              value={t.value}
              className="data-[state=active]:bg-teal-50 data-[state=active]:text-teal-700"
            >
              {t.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <Skeleton className="h-12 w-12 rounded-lg" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                  <Skeleton className="h-6 w-20" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : bookings.length === 0 ? (
        <Card>
          <CardContent className="p-12">
            <div className="text-center">
              <PackageOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                No bookings found
              </h3>
              <p className="text-gray-500 mb-6">
                {tab === "upcoming"
                  ? "You have no upcoming trips. Time to plan your next adventure!"
                  : tab === "past"
                  ? "You haven't completed any trips yet."
                  : tab === "cancelled"
                  ? "No cancelled bookings."
                  : "You haven't made any bookings yet. Start exploring!"}
              </p>
              <Button asChild className="bg-teal-700 hover:bg-teal-800">
                <Link href="/tours">Browse Tours</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="space-y-3">
            {bookings.map((booking) => {
              const name =
                booking.type === "TOUR"
                  ? booking.tour?.name
                  : booking.accommodation?.name;
              const date =
                booking.type === "TOUR"
                  ? booking.tourDate
                  : booking.checkIn;

              return (
                <Link key={booking.id} href={`/portal/bookings/${booking.id}`}>
                  <Card className="hover:border-gray-300 transition-colors cursor-pointer mb-3">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4 min-w-0">
                          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100 flex-shrink-0">
                            {booking.type === "TOUR" ? (
                              <MapPin className="h-6 w-6 text-teal-600" />
                            ) : (
                              <Building2 className="h-6 w-6 text-amber-600" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-gray-900 truncate">
                              {name || "Untitled"}
                            </p>
                            <div className="flex items-center gap-2 text-sm text-gray-500 mt-0.5">
                              <span className="font-mono text-xs">
                                {booking.bookingRef}
                              </span>
                              <span>&middot;</span>
                              <span className="flex items-center gap-1">
                                <CalendarDays className="h-3.5 w-3.5" />
                                {formatDate(date)}
                              </span>
                              <span>&middot;</span>
                              <span>
                                {booking.type === "TOUR"
                                  ? `${booking.guests} guest${booking.guests !== 1 ? "s" : ""}`
                                  : `${booking.rooms || 1} room${(booking.rooms || 1) !== 1 ? "s" : ""}`}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 flex-shrink-0">
                          <Badge
                            variant="secondary"
                            className={statusColors[booking.status]}
                          >
                            {booking.status}
                          </Badge>
                          <span className="text-sm font-semibold text-gray-900 min-w-[80px] text-right">
                            {formatCurrency(booking.totalPrice, booking.currency)}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-4">
              <Button
                variant="outline"
                size="sm"
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm text-gray-500">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
