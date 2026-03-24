export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { initializePayment } from "@/lib/flutterwave";
import { getDepositAmount } from "@/lib/pricing";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { bookingRef, method, isDeposit } = body as {
      bookingRef: string;
      method?: string;
      isDeposit?: boolean;
    };

    if (!bookingRef) {
      return NextResponse.json(
        { error: "Booking reference is required" },
        { status: 400 }
      );
    }

    // Find the booking
    const booking = await db.booking.findFirst({
      where: {
        bookingRef,
        userId: session.user.id,
      },
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    if (booking.status === "CANCELLED" || booking.status === "REFUNDED") {
      return NextResponse.json(
        { error: "Cannot process payment for a cancelled or refunded booking" },
        { status: 400 }
      );
    }

    // Calculate amount
    const amount = isDeposit
      ? getDepositAmount(booking.totalPrice)
      : booking.totalPrice;

    // Determine payment method for DB
    let paymentMethod: "CARD" | "MOBILE_MONEY" | "BANK_TRANSFER" = "CARD";
    if (method && method.includes("mobilemoney")) {
      paymentMethod = "MOBILE_MONEY";
    } else if (method === "banktransfer") {
      paymentMethod = "BANK_TRANSFER";
    }

    // Create payment record
    const payment = await db.payment.create({
      data: {
        bookingId: booking.id,
        amount,
        currency: booking.currency,
        method: paymentMethod,
        status: "PENDING",
        isDeposit: !!isDeposit,
        flutterwaveRef: bookingRef,
      },
    });

    // Initialize with Flutterwave
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const redirectUrl = `${appUrl}/api/payments/verify?bookingRef=${bookingRef}&paymentId=${payment.id}`;

    const flutterwaveResponse = await initializePayment({
      amount,
      currency: booking.currency,
      email: booking.customerEmail,
      name: booking.customerName,
      phone: booking.customerPhone,
      bookingRef: `${bookingRef}-${payment.id}`,
      redirectUrl,
      paymentMethod: method,
    });

    if (flutterwaveResponse.status !== "success") {
      // Mark payment as failed
      await db.payment.update({
        where: { id: payment.id },
        data: { status: "FAILED" },
      });

      return NextResponse.json(
        { error: flutterwaveResponse.message || "Payment initialization failed" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      paymentLink: flutterwaveResponse.data.link,
      paymentId: payment.id,
    });
  } catch (error) {
    console.error("Payment initialization error:", error);
    return NextResponse.json(
      { error: "Failed to initialize payment" },
      { status: 500 }
    );
  }
}
