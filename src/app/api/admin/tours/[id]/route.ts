import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

async function requireAdmin() {
  const session = await auth();
  if (
    !session?.user ||
    (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")
  ) {
    return null;
  }
  return session;
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAdmin();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const tour = await db.tour.findUnique({
      where: { id },
      include: {
        category: true,
        pricing: true,
        addOns: true,
        _count: { select: { bookings: true, reviews: true } },
      },
    });

    if (!tour) {
      return NextResponse.json({ error: "Tour not found" }, { status: 404 });
    }

    return NextResponse.json(tour);
  } catch (error) {
    console.error("GET tour error:", error);
    return NextResponse.json(
      { error: "Failed to fetch tour" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAdmin();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const {
      name,
      slug,
      categoryId,
      description,
      duration,
      maxGroupSize,
      difficulty,
      highlights,
      includes,
      excludes,
      images,
      featured,
      active,
      pricing,
      addOns,
    } = body;

    const tour = await db.$transaction(async (tx) => {
      const updateData: any = {};
      if (name !== undefined) updateData.name = name;
      if (slug !== undefined) updateData.slug = slug;
      if (categoryId !== undefined) updateData.categoryId = categoryId;
      if (description !== undefined) updateData.description = description;
      if (duration !== undefined) updateData.duration = duration;
      if (maxGroupSize !== undefined) updateData.maxGroupSize = maxGroupSize;
      if (difficulty !== undefined) updateData.difficulty = difficulty || null;
      if (highlights !== undefined) updateData.highlights = highlights;
      if (includes !== undefined) updateData.includes = includes;
      if (excludes !== undefined) updateData.excludes = excludes;
      if (images !== undefined) updateData.images = images;
      if (featured !== undefined) updateData.featured = featured;
      if (active !== undefined) updateData.active = active;

      const updated = await tx.tour.update({
        where: { id },
        data: updateData,
      });

      // Replace pricing if provided
      if (pricing) {
        await tx.tourPricing.deleteMany({ where: { tourId: id } });
        if (pricing.length > 0) {
          await tx.tourPricing.createMany({
            data: pricing
              .filter((p: any) => p.price > 0)
              .map((p: any) => ({
                tourId: id,
                tier: p.tier,
                season: p.season,
                price: parseFloat(p.price),
              })),
          });
        }
      }

      // Replace add-ons if provided
      if (addOns) {
        await tx.tourAddOn.deleteMany({ where: { tourId: id } });
        if (addOns.length > 0) {
          await tx.tourAddOn.createMany({
            data: addOns
              .filter((a: any) => a.name)
              .map((a: any) => ({
                tourId: id,
                name: a.name,
                description: a.description || null,
                price: parseFloat(a.price),
              })),
          });
        }
      }

      return tx.tour.findUnique({
        where: { id },
        include: { pricing: true, addOns: true, category: true },
      });
    });

    return NextResponse.json(tour);
  } catch (error) {
    console.error("PATCH tour error:", error);
    return NextResponse.json(
      { error: "Failed to update tour" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAdmin();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    // Soft delete
    await db.tour.update({
      where: { id },
      data: { active: false },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE tour error:", error);
    return NextResponse.json(
      { error: "Failed to delete tour" },
      { status: 500 }
    );
  }
}
