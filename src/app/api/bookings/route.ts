export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { bookingSchema } from "@/lib/validations";
import {
  getSeason,
  getPricingTier,
  calculateBookingPrice,
} from "@/lib/pricing";

function generateBookingRef(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let result = "TKR-";
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "You must be signed in to make a booking" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const parsed = bookingSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid booking data", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const data = parsed.data;
    const isTour = !!data.tourId;
    const isAccommodation = !!data.accommodationId;

    if (!isTour && !isAccommodation) {
      return NextResponse.json(
        { error: "Either tourId or accommodationId is required" },
        { status: 400 }
      );
    }

    const tourDate = new Date(data.date);
    const season = getSeason(tourDate);
    const pricingTier = getPricingTier(data.nationality);

    let basePrice = 0;
    let addOnsTotal = 0;
    let totalPrice = 0;
    let tourRecord = null;
    let accommodationRecord = null;
    let roomTypeRecord = null;

    if (isTour && data.tourId) {
      tourRecord = await db.tour.findUnique({
        where: { id: data.tourId },
        include: { pricing: true, addOns: true },
      });

      if (!tourRecord || !tourRecord.active) {
        return NextResponse.json({ error: "Tour not found or inactive" }, { status: 404 });
      }

      // Find matching price
      const pricing = tourRecord.pricing.find(
        (p) => p.tier === pricingTier && p.season === season
      );
      basePrice = pricing?.price ?? tourRecord.pricing[0]?.price ?? 0;

      // Calculate add-ons
      const addOnItems = (data.addOns ?? []).map((selected) => {
        const addOn = tourRecord!.addOns.find((a: any) => a.id === selected.id);
        return { price: addOn?.price ?? 0, quantity: selected.quantity };
      });

      const calc = calculateBookingPrice({
        basePrice,
        guests: data.guests,
        addOns: addOnItems,
      });

      addOnsTotal = calc.addOnsTotal;
      totalPrice = calc.total;
    }

    if (isAccommodation && data.accommodationId) {
      accommodationRecord = await db.accommodation.findUnique({
        where: { id: data.accommodationId },
        include: { roomTypes: { include: { pricing: true } } },
      });

      if (!accommodationRecord || !accommodationRecord.active) {
        return NextResponse.json(
          { error: "Accommodation not found or inactive" },
          { status: 404 }
        );
      }

      // Find room type
      const roomTypeId = (body as Record<string, unknown>).roomTypeId as string | undefined;
      roomTypeRecord = roomTypeId
        ? accommodationRecord.roomTypes.find((r) => r.id === roomTypeId)
        : accommodationRecord.roomTypes[0];

      if (!roomTypeRecord) {
        return NextResponse.json({ error: "Room type not found" }, { status: 404 });
      }

      const roomPricing = roomTypeRecord.pricing.find(
        (p) => p.tier === pricingTier && p.season === season
      );
      const pricePerNight = roomPricing?.price ?? roomTypeRecord.pricing[0]?.price ?? 0;

      const checkInDate = new Date(data.date);
      const checkOutDate = data.endDate ? new Date(data.endDate) : new Date(checkInDate.getTime() + 86400000);
      const nights = Math.max(
        1,
        Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / 86400000)
      );
      const roomsCount = (body as Record<string, unknown>).rooms as number ?? 1;

      basePrice = pricePerNight;
      totalPrice = pricePerNight * nights * roomsCount;
    }

    // Generate unique booking ref
    let bookingRef = generateBookingRef();
    let refExists = await db.booking.findUnique({ where: { bookingRef } });
    while (refExists) {
      bookingRef = generateBookingRef();
      refExists = await db.booking.findUnique({ where: { bookingRef } });
    }

    // Create booking
    const booking = await db.booking.create({
      data: {
        bookingRef,
        userId: session.user.id,
        type: isTour ? "TOUR" : "ACCOMMODATION",
        tourId: isTour ? data.tourId : undefined,
        accommodationId: isAccommodation ? data.accommodationId : undefined,
        roomTypeId: roomTypeRecord?.id,
        status: "PENDING",
        tourDate: isTour ? new Date(data.date) : undefined,
        checkIn: isAccommodation ? new Date(data.date) : undefined,
        checkOut:
          isAccommodation && data.endDate ? new Date(data.endDate) : undefined,
        guests: data.guests,
        rooms: isAccommodation ? ((body as Record<string, unknown>).rooms as number ?? 1) : undefined,
        pricingTier,
        season,
        basePrice,
        addOnsTotal,
        totalPrice,
        currency: "USD",
        customerName: data.contactName,
        customerEmail: data.contactEmail,
        customerPhone: data.contactPhone,
        specialRequests: data.specialRequests,
        addOns: {
          create: (data.addOns ?? []).map((selected) => {
            const addOn = tourRecord?.addOns.find((a) => a.id === selected.id);
            return {
              addOnId: selected.id,
              quantity: selected.quantity,
              price: addOn?.price ?? 0,
            };
          }),
        },
      },
      include: {
        tour: { select: { name: true, slug: true } },
        accommodation: { select: { name: true, slug: true } },
        addOns: { include: { addOn: true } },
      },
    });

    return NextResponse.json(booking, { status: 201 });
  } catch (error) {
    console.error("Booking creation error:", error);
    return NextResponse.json(
      { error: "Failed to create booking" },
      { status: 500 }
    );
  }
}
