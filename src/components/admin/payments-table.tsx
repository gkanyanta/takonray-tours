"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Download } from "lucide-react";

interface Payment {
  id: string;
  amount: number;
  currency: string;
  method: string;
  status: string;
  isDeposit: boolean;
  createdAt: string;
  booking: {
    bookingRef: string;
    customerName: string;
    customerEmail: string;
  };
}

const STATUS_OPTIONS = ["PENDING", "COMPLETED", "FAILED", "REFUNDED"];
const METHOD_OPTIONS = ["CARD", "MOBILE_MONEY", "BANK_TRANSFER"];

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  COMPLETED: "bg-green-100 text-green-800",
  FAILED: "bg-red-100 text-red-800",
  REFUNDED: "bg-gray-100 text-gray-800",
};

export function PaymentsTable({
  payments,
  currentStatus,
  currentMethod,
}: {
  payments: Payment[];
  currentStatus: string;
  currentMethod: string;
}) {
  const router = useRouter();

  const applyFilter = (overrides: Record<string, string> = {}) => {
    const params = new URLSearchParams();
    const s = overrides.status ?? currentStatus;
    const m = overrides.method ?? currentMethod;
    if (s && s !== "all") params.set("status", s);
    if (m && m !== "all") params.set("method", m);
    router.push(`/admin/payments?${params.toString()}`);
  };

  const exportCSV = () => {
    const headers = [
      "Booking Ref",
      "Customer",
      "Amount",
      "Currency",
      "Method",
      "Status",
      "Deposit",
      "Date",
    ];
    const rows = payments.map((p) => [
      p.booking.bookingRef,
      p.booking.customerName,
      p.amount.toFixed(2),
      p.currency,
      p.method,
      p.status,
      p.isDeposit ? "Yes" : "No",
      format(new Date(p.createdAt), "yyyy-MM-dd HH:mm"),
    ]);
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `payments-${format(new Date(), "yyyy-MM-dd")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div className="flex flex-col gap-3 border-b p-4 sm:flex-row sm:items-center">
        <Select
          value={currentStatus || "all"}
          onValueChange={(v) => applyFilter({ status: v })}
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
          value={currentMethod || "all"}
          onValueChange={(v) => applyFilter({ method: v })}
        >
          <SelectTrigger className="w-full sm:w-44">
            <SelectValue placeholder="All Methods" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Methods</SelectItem>
            {METHOD_OPTIONS.map((m) => (
              <SelectItem key={m} value={m}>
                {m.replace("_", " ")}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="flex-1" />
        <Button variant="outline" onClick={exportCSV}>
          <Download className="mr-2 h-4 w-4" />
          Export CSV
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Booking Ref</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Method</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {payments.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="py-8 text-center text-gray-500">
                No payments found
              </TableCell>
            </TableRow>
          ) : (
            payments.map((payment) => (
              <TableRow key={payment.id}>
                <TableCell className="font-mono text-sm">
                  {payment.booking.bookingRef}
                </TableCell>
                <TableCell>
                  <div>
                    <p className="text-sm font-medium">
                      {payment.booking.customerName}
                    </p>
                    <p className="text-xs text-gray-500">
                      {payment.booking.customerEmail}
                    </p>
                  </div>
                </TableCell>
                <TableCell className="font-medium">
                  {payment.currency} {payment.amount.toFixed(2)}
                </TableCell>
                <TableCell>
                  <Badge variant="outline">
                    {payment.method.replace("_", " ")}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    className={
                      statusColors[payment.status] ??
                      "bg-gray-100 text-gray-800"
                    }
                    variant="secondary"
                  >
                    {payment.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {payment.isDeposit ? (
                    <Badge variant="outline">Deposit</Badge>
                  ) : (
                    <span className="text-sm text-gray-500">Full</span>
                  )}
                </TableCell>
                <TableCell className="text-sm text-gray-500">
                  {format(new Date(payment.createdAt), "MMM d, yyyy")}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
