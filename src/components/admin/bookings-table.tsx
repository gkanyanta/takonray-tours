"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Eye } from "lucide-react";

interface Booking {
  id: string;
  bookingRef: string;
  customerName: string;
  customerEmail: string;
  type: string;
  status: string;
  totalPrice: number;
  currency: string;
  tourDate: string | null;
  checkIn: string | null;
  checkOut: string | null;
  createdAt: string;
  tour: { name: string } | null;
  accommodation: { name: string } | null;
}

const STATUS_OPTIONS = ["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED", "REFUNDED"];
const TYPE_OPTIONS = ["TOUR", "ACCOMMODATION"];

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  CONFIRMED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
  COMPLETED: "bg-blue-100 text-blue-800",
  REFUNDED: "bg-gray-100 text-gray-800",
};

export function BookingsTable({
  bookings,
  currentStatus,
  currentType,
  currentSearch,
}: {
  bookings: Booking[];
  currentStatus: string;
  currentType: string;
  currentSearch: string;
}) {
  const router = useRouter();
  const [search, setSearch] = useState(currentSearch);

  const applyFilters = (overrides: Record<string, string> = {}) => {
    const params = new URLSearchParams();
    const s = overrides.search ?? search;
    const st = overrides.status ?? currentStatus;
    const t = overrides.type ?? currentType;
    if (s) params.set("search", s);
    if (st && st !== "all") params.set("status", st);
    if (t && t !== "all") params.set("type", t);
    router.push(`/admin/bookings?${params.toString()}`);
  };

  const updateStatus = async (id: string, status: string) => {
    await fetch(`/api/admin/bookings/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    router.refresh();
  };

  return (
    <div>
      <div className="flex flex-col gap-3 border-b p-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search by ref, name, or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && applyFilters()}
            className="pl-9"
          />
        </div>
        <Select
          value={currentStatus || "all"}
          onValueChange={(v) => applyFilters({ status: v })}
        >
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            {STATUS_OPTIONS.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={currentType || "all"}
          onValueChange={(v) => applyFilters({ type: v })}
        >
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {TYPE_OPTIONS.map((t) => (
              <SelectItem key={t} value={t}>
                {t}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button onClick={() => applyFilters()} variant="outline">
          Search
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Ref</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Tour / Accommodation</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bookings.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="py-8 text-center text-gray-500">
                No bookings found
              </TableCell>
            </TableRow>
          ) : (
            bookings.map((booking) => (
              <TableRow key={booking.id}>
                <TableCell className="font-mono text-sm">
                  {booking.bookingRef}
                </TableCell>
                <TableCell>
                  <div>
                    <p className="text-sm font-medium">
                      {booking.customerName}
                    </p>
                    <p className="text-xs text-gray-500">
                      {booking.customerEmail}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{booking.type}</Badge>
                </TableCell>
                <TableCell>
                  {booking.tour?.name ?? booking.accommodation?.name ?? "N/A"}
                </TableCell>
                <TableCell className="text-sm">
                  {booking.tourDate
                    ? format(new Date(booking.tourDate), "MMM d, yyyy")
                    : booking.checkIn
                    ? `${format(new Date(booking.checkIn), "MMM d")} - ${
                        booking.checkOut
                          ? format(new Date(booking.checkOut), "MMM d")
                          : "?"
                      }`
                    : "N/A"}
                </TableCell>
                <TableCell className="font-medium">
                  {booking.currency} {booking.totalPrice.toFixed(2)}
                </TableCell>
                <TableCell>
                  <Select
                    value={booking.status}
                    onValueChange={(v) => updateStatus(booking.id, v)}
                  >
                    <SelectTrigger className="h-7 w-32">
                      <Badge
                        className={
                          statusColors[booking.status] ??
                          "bg-gray-100 text-gray-800"
                        }
                        variant="secondary"
                      >
                        {booking.status}
                      </Badge>
                    </SelectTrigger>
                    <SelectContent>
                      {STATUS_OPTIONS.map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    asChild
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                  >
                    <Link href={`/admin/bookings/${booking.id}`}>
                      <Eye className="h-4 w-4" />
                    </Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
