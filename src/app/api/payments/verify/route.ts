export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyPayment } from "@/lib/flutterwave";
import { sendPaymentReceipt } from "@/lib/email";
import { formatCurrency, type Currency } from "@/lib/pricing";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const bookingRef = searchParams.get("bookingRef");
  const paymentId = searchParams.get("paymentId");
  const transactionId = searchParams.get("transaction_id");
  const status = searchParams.get("status");

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  if (!bookingRef) {
    return NextResponse.redirect(
      `${appUrl}/booking/confirmation?status=failed`
    );
  }

  try {
    // If payment was cancelled or failed at Flutterwave's end
    if (status === "cancelled" || status === "failed") {
      if (paymentId) {
        await db.payment.update({
          where: { id: paymentId },
          data: { status: "FAILED" },
        });
      }
      return NextResponse.redirect(
        `${appUrl}/booking/confirmation?status=failed&ref=${bookingRef}`
      );
    }

    // Verify with Flutterwave
    if (!transactionId) {
      return NextResponse.redirect(
        `${appUrl}/booking/confirmation?status=failed&ref=${bookingRef}`
      );
    }

    const verification = await verifyPayment(transactionId);

    if (
      verification.status !== "success" ||
      verification.data?.status !== "successful"
    ) {
      if (paymentId) {
        await db.payment.update({
          where: { id: paymentId },
          data: {
            status: "FAILED",
            flutterwaveTxId: transactionId,
          },
        });
      }
      return NextResponse.redirect(
        `${appUrl}/booking/confirmation?status=failed&ref=${bookingRef}`
      );
    }

    const txData = verification.data;

    // Update payment record
    if (paymentId) {
      await db.payment.update({
        where: { id: paymentId },
        data: {
          status: "COMPLETED",
          flutterwaveTxId: transactionId,
          flutterwaveRef: txData.flw_ref,
          metadata: JSON.parse(JSON.stringify(txData)),
        },
      });
    }

    // Update booking status
    const booking = await db.booking.findUnique({
      where: { bookingRef },
    });

    if (booking) {
      await db.booking.update({
        where: { id: booking.id },
        data: { status: "CONFIRMED" },
      });

      // Look up the payment to check deposit status
      const payment = paymentId
        ? await db.payment.findUnique({ where: { id: paymentId } })
        : null;

      // Send receipt
      try {
        await sendPaymentReceipt(booking.customerEmail, {
          customerName: booking.customerName,
          bookingRef: booking.bookingRef,
          amountPaid: formatCurrency(
            txData.amount,
            (txData.currency || "USD") as Currency
          ),
          paymentMethod: txData.payment_type ?? "Card",
          transactionId: transactionId,
          date: new Date().toLocaleDateString("en-GB", {
            day: "numeric",
            month: "long",
            year: "numeric",
          }),
          remainingBalance: payment?.isDeposit
            ? formatCurrency(
                booking.totalPrice - txData.amount,
                (booking.currency || "USD") as Currency
              )
            : undefined,
        });
      } catch (emailError) {
        console.error("Failed to send payment receipt:", emailError);
      }
    }

    // Redirect to confirmation
    const confirmUrl = new URL(`${appUrl}/booking/confirmation`);
    confirmUrl.searchParams.set("status", "success");
    confirmUrl.searchParams.set("ref", bookingRef);
    confirmUrl.searchParams.set("tx_ref", transactionId);
    confirmUrl.searchParams.set("amount", String(txData.amount));
    confirmUrl.searchParams.set("currency", txData.currency || "USD");

    return NextResponse.redirect(confirmUrl.toString());
  } catch (error) {
    console.error("Payment verification error:", error);
    return NextResponse.redirect(
      `${appUrl}/booking/confirmation?status=failed&ref=${bookingRef}`
    );
  }
}
