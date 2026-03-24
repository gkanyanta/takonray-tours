import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Look up by booking ID or booking ref
    const booking = await db.booking.findFirst({
      where: {
        OR: [{ id }, { bookingRef: id }],
        ...(session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN"
          ? { userId: session.user.id }
          : {}),
      },
      include: {
        tour: {
          select: { name: true, slug: true, duration: true, images: true },
        },
        accommodation: {
          select: { name: true, slug: true, type: true, images: true },
        },
        roomType: {
          select: { name: true, description: true },
        },
        addOns: {
          include: {
            addOn: { select: { name: true } },
          },
        },
        payments: {
          select: {
            id: true,
            amount: true,
            currency: true,
            method: true,
            status: true,
            isDeposit: true,
            createdAt: true,
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    return NextResponse.json(booking);
  } catch (error) {
    console.error("Fetch booking error:", error);
    return NextResponse.json(
      { error: "Failed to fetch booking" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const { status } = body as { status?: string };

    if (!status) {
      return NextResponse.json({ error: "Status is required" }, { status: 400 });
    }

    const validStatuses = ["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED", "REFUNDED"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    // Only admins can update status, or users can cancel their own bookings
    const existingBooking = await db.booking.findFirst({
      where: {
        OR: [{ id }, { bookingRef: id }],
      },
    });

    if (!existingBooking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    const isAdmin =
      session.user.role === "ADMIN" || session.user.role === "SUPER_ADMIN";
    const isOwner = existingBooking.userId === session.user.id;

    if (!isAdmin && !isOwner) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if (!isAdmin && status !== "CANCELLED") {
      return NextResponse.json(
        { error: "You can only cancel your own bookings" },
        { status: 403 }
      );
    }

    const updated = await db.booking.update({
      where: { id: existingBooking.id },
      data: { status: status as "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED" | "REFUNDED" },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Update booking error:", error);
    return NextResponse.json(
      { error: "Failed to update booking" },
      { status: 500 }
    );
  }
}
