"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

function ConfirmationContent() {
  const searchParams = useSearchParams();

  const status = searchParams.get("status") ?? "success";
  const bookingRef = searchParams.get("ref") ?? "";
  const txRef = searchParams.get("tx_ref") ?? "";
  const amount = searchParams.get("amount") ?? "";
  const currency = searchParams.get("currency") ?? "USD";

  const isSuccess = status === "success" || status === "successful";

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <Card className="max-w-lg w-full">
        <CardContent className="pt-8 pb-8 text-center">
          {isSuccess ? (
            <>
              {/* Success Icon */}
              <div className="mx-auto w-20 h-20 rounded-full bg-teal-100 flex items-center justify-center mb-6">
                <svg
                  className="w-10 h-10 text-teal-700"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>

              <h1 className="text-2xl font-bold text-gray-900 mb-2">Booking Confirmed!</h1>
              <p className="text-gray-600 mb-6">
                Your payment has been processed successfully. Thank you for choosing Takonray Tours!
              </p>

              {bookingRef && (
                <div className="bg-teal-50 rounded-lg p-4 mb-6">
                  <p className="text-sm text-gray-500">Booking Reference</p>
                  <p className="text-2xl font-mono font-bold text-teal-700">{bookingRef}</p>
                </div>
              )}

              <div className="text-left space-y-3 mb-6">
                {amount && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Amount Paid</span>
                    <span className="font-semibold">
                      {currency} {parseFloat(amount).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                )}
                {txRef && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Transaction Reference</span>
                    <span className="font-mono text-xs">{txRef}</span>
                  </div>
                )}
              </div>

              <Separator className="mb-6" />

              <div className="text-left mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">What happens next?</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex gap-2">
                    <span className="text-teal-700 font-bold">1.</span>
                    You will receive a confirmation email with your booking details and receipt.
                  </li>
                  <li className="flex gap-2">
                    <span className="text-teal-700 font-bold">2.</span>
                    Our team will contact you within 24 hours to finalize arrangements.
                  </li>
                  <li className="flex gap-2">
                    <span className="text-teal-700 font-bold">3.</span>
                    You can view and manage your bookings from your account dashboard.
                  </li>
                </ul>
              </div>

              <div className="flex gap-3">
                <Button asChild variant="outline" className="flex-1">
                  <Link href="/portal/bookings">View My Bookings</Link>
                </Button>
                <Button asChild className="flex-1 bg-teal-700 hover:bg-teal-800">
                  <Link href="/tours">Explore More Tours</Link>
                </Button>
              </div>
            </>
          ) : (
            <>
              {/* Failure Icon */}
              <div className="mx-auto w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mb-6">
                <svg
                  className="w-10 h-10 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>

              <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Failed</h1>
              <p className="text-gray-600 mb-6">
                Unfortunately, your payment could not be processed. Your booking has been saved and you
                can try again.
              </p>

              {bookingRef && (
                <div className="bg-gray-100 rounded-lg p-4 mb-6">
                  <p className="text-sm text-gray-500">Booking Reference</p>
                  <p className="text-xl font-mono font-bold text-gray-700">{bookingRef}</p>
                </div>
              )}

              <div className="text-left mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">What you can do:</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex gap-2">
                    <span className="text-amber-600 font-bold">&bull;</span>
                    Try a different payment method
                  </li>
                  <li className="flex gap-2">
                    <span className="text-amber-600 font-bold">&bull;</span>
                    Check your card or mobile money balance
                  </li>
                  <li className="flex gap-2">
                    <span className="text-amber-600 font-bold">&bull;</span>
                    Contact us via WhatsApp for assistance
                  </li>
                </ul>
              </div>

              <div className="flex gap-3">
                {bookingRef && (
                  <Button asChild className="flex-1 bg-amber-600 hover:bg-amber-700">
                    <Link href={`/checkout/${bookingRef}`}>Try Again</Link>
                  </Button>
                )}
                <Button asChild variant="outline" className="flex-1">
                  <Link href="/contact">Contact Support</Link>
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function BookingConfirmationPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-700" />
        </div>
      }
    >
      <ConfirmationContent />
    </Suspense>
  );
}
