import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const status = searchParams.get("status");
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {
      userId: session.user.id,
    };

    if (status && status !== "all") {
      if (status === "upcoming") {
        where.status = { in: ["PENDING", "CONFIRMED"] };
        where.OR = [
          { tourDate: { gte: new Date() } },
          { checkIn: { gte: new Date() } },
        ];
      } else if (status === "past") {
        where.status = "COMPLETED";
      } else if (status === "cancelled") {
        where.status = { in: ["CANCELLED", "REFUNDED"] };
      } else {
        where.status = status.toUpperCase();
      }
    }

    const [bookings, total] = await Promise.all([
      db.booking.findMany({
        where,
        include: {
          tour: { select: { id: true, name: true, slug: true, images: true } },
          accommodation: { select: { id: true, name: true, slug: true, images: true } },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      db.booking.count({ where }),
    ]);

    return NextResponse.json({
      bookings,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return NextResponse.json(
      { error: "Failed to fetch bookings" },
      { status: 500 }
    );
  }
}
