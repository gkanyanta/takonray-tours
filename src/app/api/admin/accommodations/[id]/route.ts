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
      type,
      description,
      address,
      amenities,
      images,
      featured,
      active,
      roomTypes,
    } = body;

    const accommodation = await db.$transaction(async (tx) => {
      const updateData: any = {};
      if (name !== undefined) updateData.name = name;
      if (slug !== undefined) updateData.slug = slug;
      if (type !== undefined) updateData.type = type;
      if (description !== undefined) updateData.description = description;
      if (address !== undefined) updateData.address = address || null;
      if (amenities !== undefined) updateData.amenities = amenities;
      if (images !== undefined) updateData.images = images;
      if (featured !== undefined) updateData.featured = featured;
      if (active !== undefined) updateData.active = active;

      await tx.accommodation.update({
        where: { id },
        data: updateData,
      });

      // Replace room types if provided
      if (roomTypes) {
        // Delete existing room types (cascade deletes pricing)
        await tx.roomType.deleteMany({
          where: { accommodationId: id },
        });

        for (const rt of roomTypes) {
          const roomType = await tx.roomType.create({
            data: {
              accommodationId: id,
              name: rt.name,
              description: rt.description || null,
              maxOccupancy: parseInt(rt.maxOccupancy),
              images: [],
            },
          });

          if (rt.pricing && rt.pricing.length > 0) {
            await tx.roomPricing.createMany({
              data: rt.pricing
                .filter((p: any) => p.price > 0)
                .map((p: any) => ({
                  roomTypeId: roomType.id,
                  tier: p.tier,
                  season: p.season,
                  price: parseFloat(p.price),
                })),
            });
          }
        }
      }

      return tx.accommodation.findUnique({
        where: { id },
        include: { roomTypes: { include: { pricing: true } } },
      });
    });

    return NextResponse.json(accommodation);
  } catch (error) {
    console.error("PATCH accommodation error:", error);
    return NextResponse.json(
      { error: "Failed to update accommodation" },
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
    await db.accommodation.update({
      where: { id },
      data: { active: false },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE accommodation error:", error);
    return NextResponse.json(
      { error: "Failed to delete accommodation" },
      { status: 500 }
    );
  }
}
