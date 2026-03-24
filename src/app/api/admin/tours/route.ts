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
    const category = searchParams.get("category");
    const page = parseInt(searchParams.get("page") ?? "1");
    const limit = parseInt(searchParams.get("limit") ?? "50");

    const where: any = {};
    if (search) {
      where.name = { contains: search, mode: "insensitive" };
    }
    if (category) {
      where.categoryId = category;
    }

    const [tours, total] = await Promise.all([
      db.tour.findMany({
        where,
        include: {
          category: true,
          pricing: true,
          addOns: true,
          _count: { select: { bookings: true, reviews: true } },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      db.tour.count({ where }),
    ]);

    return NextResponse.json({ tours, total, page, limit });
  } catch (error) {
    console.error("GET tours error:", error);
    return NextResponse.json(
      { error: "Failed to fetch tours" },
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

    // Check slug uniqueness
    const existing = await db.tour.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json(
        { error: "A tour with this slug already exists" },
        { status: 400 }
      );
    }

    const tour = await db.$transaction(async (tx) => {
      const created = await tx.tour.create({
        data: {
          name,
          slug,
          categoryId,
          description,
          duration,
          maxGroupSize,
          difficulty: difficulty || null,
          highlights: highlights ?? [],
          includes: includes ?? [],
          excludes: excludes ?? [],
          images: images ?? [],
          featured: featured ?? false,
          active: active ?? true,
        },
      });

      // Create pricing entries
      if (pricing && pricing.length > 0) {
        await tx.tourPricing.createMany({
          data: pricing
            .filter((p: any) => p.price > 0)
            .map((p: any) => ({
              tourId: created.id,
              tier: p.tier,
              season: p.season,
              price: parseFloat(p.price),
            })),
        });
      }

      // Create add-ons
      if (addOns && addOns.length > 0) {
        await tx.tourAddOn.createMany({
          data: addOns
            .filter((a: any) => a.name)
            .map((a: any) => ({
              tourId: created.id,
              name: a.name,
              description: a.description || null,
              price: parseFloat(a.price),
            })),
        });
      }

      return tx.tour.findUnique({
        where: { id: created.id },
        include: { pricing: true, addOns: true, category: true },
      });
    });

    return NextResponse.json(tour, { status: 201 });
  } catch (error) {
    console.error("POST tour error:", error);
    return NextResponse.json(
      { error: "Failed to create tour" },
      { status: 500 }
    );
  }
}
