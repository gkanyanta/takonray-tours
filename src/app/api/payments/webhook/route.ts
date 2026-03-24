export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyWebhookSignature } from "@/lib/flutterwave";
import { sendPaymentReceipt } from "@/lib/email";
import { formatCurrency, type Currency } from "@/lib/pricing";

export async function POST(req: NextRequest) {
  try {
    // Verify webhook signature
    const signature = req.headers.get("verif-hash") ?? "";
    const secret = process.env.FLUTTERWAVE_WEBHOOK_SECRET ?? "";

    if (!verifyWebhookSignature(signature, secret)) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const payload = await req.json();
    const { event, data } = payload as {
      event: string;
      data: {
        id: number;
        tx_ref: string;
        flw_ref: string;
        amount: number;
        currency: string;
        status: string;
        payment_type: string;
        customer: { email: string; name: string };
      };
    };

    if (event !== "charge.completed") {
      return NextResponse.json({ status: "ignored" });
    }

    // Extract bookingRef and paymentId from tx_ref (format: TKR-XXXXXX-paymentId)
    const txRefParts = data.tx_ref.split("-");
    const bookingRef = txRefParts.slice(0, 2).join("-"); // TKR-XXXXXX
    const paymentId = txRefParts.slice(2).join("-");

    // Find the payment record
    const payment = paymentId
      ? await db.payment.findUnique({ where: { id: paymentId } })
      : await db.payment.findFirst({
          where: { flutterwaveRef: bookingRef },
          orderBy: { createdAt: "desc" },
        });

    if (!payment) {
      console.error("Payment not found for tx_ref:", data.tx_ref);
      return NextResponse.json({ error: "Payment not found" }, { status: 404 });
    }

    // Update payment status
    const isSuccessful = data.status === "successful";
    await db.payment.update({
      where: { id: payment.id },
      data: {
        status: isSuccessful ? "COMPLETED" : "FAILED",
        flutterwaveTxId: String(data.id),
        flutterwaveRef: data.flw_ref,
        metadata: JSON.parse(JSON.stringify(data)),
      },
    });

    if (isSuccessful) {
      // Update booking status
      const booking = await db.booking.findUnique({
        where: { id: payment.bookingId },
      });

      if (booking) {
        await db.booking.update({
          where: { id: booking.id },
          data: { status: "CONFIRMED" },
        });

        // Send receipt email
        try {
          await sendPaymentReceipt(booking.customerEmail, {
            customerName: booking.customerName,
            bookingRef: booking.bookingRef,
            amountPaid: formatCurrency(data.amount, (data.currency || "USD") as Currency),
            paymentMethod: data.payment_type,
            transactionId: String(data.id),
            date: new Date().toLocaleDateString("en-GB", {
              day: "numeric",
              month: "long",
              year: "numeric",
            }),
            remainingBalance: payment.isDeposit
              ? formatCurrency(
                  booking.totalPrice - data.amount,
                  (booking.currency || "USD") as Currency
                )
              : undefined,
          });
        } catch (emailError) {
          console.error("Failed to send payment receipt:", emailError);
        }
      }
    }

    return NextResponse.json({ status: "success" });
  } catch (error) {
    console.error("Webhook processing error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}
