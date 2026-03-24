export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const reviews = await db.review.findMany({
      where: { userId: session.user.id },
      include: {
        tour: { select: { id: true, name: true, slug: true } },
        accommodation: { select: { id: true, name: true, slug: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ reviews });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json(
      { error: "Failed to fetch reviews" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { tourId, accommodationId, rating, comment } = body;

    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Rating must be between 1 and 5" },
        { status: 400 }
      );
    }

    if (!comment || comment.trim().length < 10) {
      return NextResponse.json(
        { error: "Comment must be at least 10 characters" },
        { status: 400 }
      );
    }

    if (!tourId && !accommodationId) {
      return NextResponse.json(
        { error: "Must specify either a tour or accommodation to review" },
        { status: 400 }
      );
    }

    // Check that user has a completed booking for this tour/accommodation
    const completedBooking = await db.booking.findFirst({
      where: {
        userId: session.user.id,
        status: "COMPLETED",
        ...(tourId ? { tourId } : { accommodationId }),
      },
    });

    if (!completedBooking) {
      return NextResponse.json(
        { error: "You can only review tours or accommodations you have completed" },
        { status: 403 }
      );
    }

    // Check for existing review
    const existingReview = await db.review.findFirst({
      where: {
        userId: session.user.id,
        ...(tourId ? { tourId } : { accommodationId }),
      },
    });

    if (existingReview) {
      return NextResponse.json(
        { error: "You have already reviewed this item" },
        { status: 400 }
      );
    }

    const review = await db.review.create({
      data: {
        userId: session.user.id,
        tourId: tourId || null,
        accommodationId: accommodationId || null,
        rating,
        comment: comment.trim(),
      },
      include: {
        tour: { select: { id: true, name: true, slug: true } },
        accommodation: { select: { id: true, name: true, slug: true } },
      },
    });

    return NextResponse.json({ review }, { status: 201 });
  } catch (error) {
    console.error("Error creating review:", error);
    return NextResponse.json(
      { error: "Failed to create review" },
      { status: 500 }
    );
  }
}
