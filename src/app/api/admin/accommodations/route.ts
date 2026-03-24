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

export async function GET(req: NextRequest) {
  try {
    const session = await requireAdmin();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search");
    const type = searchParams.get("type");

    const where: any = {};
    if (search) {
      where.name = { contains: search, mode: "insensitive" };
    }
    if (type) {
      where.type = type;
    }

    const accommodations = await db.accommodation.findMany({
      where,
      include: {
        roomTypes: { include: { pricing: true } },
        _count: { select: { bookings: true, reviews: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(accommodations);
  } catch (error) {
    console.error("GET accommodations error:", error);
    return NextResponse.json(
      { error: "Failed to fetch accommodations" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await requireAdmin();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

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

    const existing = await db.accommodation.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json(
        { error: "An accommodation with this slug already exists" },
        { status: 400 }
      );
    }

    const accommodation = await db.$transaction(async (tx) => {
      const created = await tx.accommodation.create({
        data: {
          name,
          slug,
          type,
          description,
          address: address || null,
          amenities: amenities ?? [],
          images: images ?? [],
          featured: featured ?? false,
          active: active ?? true,
        },
      });

      // Create room types with pricing
      if (roomTypes && roomTypes.length > 0) {
        for (const rt of roomTypes) {
          const roomType = await tx.roomType.create({
            data: {
              accommodationId: created.id,
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
        where: { id: created.id },
        include: { roomTypes: { include: { pricing: true } } },
      });
    });

    return NextResponse.json(accommodation, { status: 201 });
  } catch (error) {
    console.error("POST accommodation error:", error);
    return NextResponse.json(
      { error: "Failed to create accommodation" },
      { status: 500 }
    );
  }
}
