import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { ImageGallery } from "@/components/image-gallery";
import { BookingWidget } from "@/components/booking-widget";
import { ReviewCard } from "@/components/review-card";
import { StarRating } from "@/components/star-rating";
import {
  ChevronRight,
  MapPin,
  Star,
  Wifi,
  Car,
  UtensilsCrossed,
  Waves,
  Dumbbell,
  Coffee,
  TreePine,
  ShieldCheck,
  Users,
  CheckCircle2,
} from "lucide-react";

export const metadata = {
  title: "Accommodation Details | Takonray Tours",
};

const amenityIcons: Record<string, React.ReactNode> = {
  wifi: <Wifi className="size-5" />,
  pool: <Waves className="size-5" />,
  restaurant: <UtensilsCrossed className="size-5" />,
  spa: <ShieldCheck className="size-5" />,
  parking: <Car className="size-5" />,
  gym: <Dumbbell className="size-5" />,
  breakfast: <Coffee className="size-5" />,
  garden: <TreePine className="size-5" />,
  bar: <Coffee className="size-5" />,
};

const fallbackAccommodation = {
  id: "1",
  name: "Royal Livingstone Hotel",
  slug: "royal-livingstone-hotel",
  description:
    "The Royal Livingstone Hotel sits majestically on the banks of the Zambezi River, just a ten-minute walk from the thundering Victoria Falls. This magnificent five-star hotel combines colonial grandeur with warm Zambian hospitality, offering an unforgettable stay in one of Africa's most iconic destinations.\n\nGuests are greeted by roaming zebras and giraffes on the hotel's grounds, which border the Mosi-oa-Tunya National Park. The hotel features elegant rooms and suites, each with a private veranda overlooking the Zambezi River or the lush gardens.\n\nDine at the award-winning restaurant serving both international and traditional Zambian cuisine, or enjoy sundowner cocktails on the deck as hippos surface in the river below. The on-site spa offers treatments inspired by African wellness traditions.",
  type: "hotel",
  address: "Mosi-oa-Tunya Road, Livingstone, Zambia",
  amenities: [
    "WiFi",
    "Pool",
    "Restaurant",
    "Spa",
    "River View",
    "Bar",
    "Gym",
    "Parking",
    "Room Service",
    "Laundry",
  ],
  images: [
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=1200&h=800&fit=crop",
  ],
  rating: 4.8,
  featured: true,
  roomTypes: [
    {
      id: "rt1",
      name: "Deluxe River View Room",
      description:
        "Spacious room with king-size bed and private balcony overlooking the Zambezi River.",
      maxOccupancy: 2,
      images: [],
      pricing: [
        { tier: "LOCAL", season: "PEAK", price: 180 },
        { tier: "LOCAL", season: "HIGH", price: 150 },
        { tier: "LOCAL", season: "LOW", price: 120 },
        { tier: "SADC", season: "PEAK", price: 220 },
        { tier: "SADC", season: "HIGH", price: 180 },
        { tier: "SADC", season: "LOW", price: 150 },
        { tier: "INTERNATIONAL", season: "PEAK", price: 350 },
        { tier: "INTERNATIONAL", season: "HIGH", price: 280 },
        { tier: "INTERNATIONAL", season: "LOW", price: 220 },
      ],
    },
    {
      id: "rt2",
      name: "Premium Suite",
      description:
        "Luxurious suite with separate living area, premium bathroom, and panoramic river views.",
      maxOccupancy: 3,
      images: [],
      pricing: [
        { tier: "LOCAL", season: "PEAK", price: 300 },
        { tier: "LOCAL", season: "HIGH", price: 250 },
        { tier: "LOCAL", season: "LOW", price: 200 },
        { tier: "SADC", season: "PEAK", price: 380 },
        { tier: "SADC", season: "HIGH", price: 320 },
        { tier: "SADC", season: "LOW", price: 260 },
        { tier: "INTERNATIONAL", season: "PEAK", price: 550 },
        { tier: "INTERNATIONAL", season: "HIGH", price: 450 },
        { tier: "INTERNATIONAL", season: "LOW", price: 350 },
      ],
    },
    {
      id: "rt3",
      name: "Standard Garden Room",
      description:
        "Comfortable room with queen-size bed and views of the hotel's manicured gardens.",
      maxOccupancy: 2,
      images: [],
      pricing: [
        { tier: "LOCAL", season: "PEAK", price: 120 },
        { tier: "LOCAL", season: "HIGH", price: 100 },
        { tier: "LOCAL", season: "LOW", price: 80 },
        { tier: "SADC", season: "PEAK", price: 160 },
        { tier: "SADC", season: "HIGH", price: 130 },
        { tier: "SADC", season: "LOW", price: 100 },
        { tier: "INTERNATIONAL", season: "PEAK", price: 250 },
        { tier: "INTERNATIONAL", season: "HIGH", price: 200 },
        { tier: "INTERNATIONAL", season: "LOW", price: 160 },
      ],
    },
  ],
  reviews: [
    {
      id: "r1",
      rating: 5,
      comment:
        "An absolutely magical place to stay. Waking up to the sound of the Zambezi and seeing zebras from our balcony was surreal. The service was impeccable.",
      createdAt: "2025-11-10",
      user: { name: "Elena Rossi", image: null },
    },
    {
      id: "r2",
      rating: 5,
      comment:
        "Worth every penny. The location is unbeatable — we walked to Victoria Falls every morning. The restaurant's bream fish was outstanding.",
      createdAt: "2025-10-05",
      user: { name: "Robert Williams", image: null },
    },
    {
      id: "r3",
      rating: 4,
      comment:
        "Beautiful hotel with fantastic amenities. The pool area is gorgeous. Only minor note — WiFi can be slow at times. Otherwise perfect!",
      createdAt: "2025-09-18",
      user: { name: "Amina Kone", image: null },
    },
  ],
};

async function getAccommodation(slug: string) {
  try {
    const { db } = await import("@/lib/db");
    const acc = await db.accommodation.findUnique({
      where: { slug, active: true },
      include: {
        roomTypes: { include: { pricing: true } },
        reviews: {
          where: { approved: true },
          include: { user: { select: { name: true, image: true } } },
          orderBy: { createdAt: "desc" },
        },
      },
    });
    return acc;
  } catch {
    if (slug === fallbackAccommodation.slug) return fallbackAccommodation;
    return null;
  }
}

export async function generateStaticParams() {
  try {
    const { db } = await import("@/lib/db");
    const accs = await db.accommodation.findMany({
      where: { active: true },
      select: { slug: true },
    });
    return accs.map((a) => ({ slug: a.slug }));
  } catch {
    return [{ slug: "royal-livingstone-hotel" }];
  }
}

export default async function AccommodationDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const accommodation = await getAccommodation(slug);

  if (!accommodation) {
    notFound();
  }

  const acc = accommodation as typeof fallbackAccommodation;

  const avgRating =
    acc.reviews.length > 0
      ? acc.reviews.reduce((sum, r) => sum + r.rating, 0) / acc.reviews.length
      : acc.rating || 0;

  const lowestPrice = Math.min(
    ...acc.roomTypes.flatMap((rt) => rt.pricing.map((p) => p.price))
  );

  const typeLabels: Record<string, string> = {
    hotel: "Hotel",
    lodge: "Lodge",
    guesthouse: "Guesthouse",
    camping: "Camping",
    resort: "Resort",
  };

  const tierLabels: Record<string, string> = {
    LOCAL: "Zambian Residents",
    SADC: "SADC Nationals",
    INTERNATIONAL: "International",
  };

  const seasonLabels: Record<string, string> = {
    PEAK: "Peak Season (Jun-Oct)",
    HIGH: "High Season (Apr-May, Nov)",
    LOW: "Low Season (Dec-Mar)",
  };

  const roomTypesForWidget = acc.roomTypes.map((rt) => ({
    id: rt.id,
    name: rt.name,
    maxOccupancy: rt.maxOccupancy,
    lowestPrice: Math.min(...rt.pricing.map((p) => p.price)),
  }));

  return (
    <main className="min-h-screen">
      <section className="bg-brand-teal py-8">
        <div className="mx-auto max-w-7xl px-4">
          <nav className="mb-3 flex items-center gap-2 text-sm text-white/70">
            <Link href="/" className="hover:text-white">
              Home
            </Link>
            <ChevronRight className="size-3" />
            <Link href="/accommodations" className="hover:text-white">
              Accommodations
            </Link>
            <ChevronRight className="size-3" />
            <span className="text-white">{acc.name}</span>
          </nav>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <ImageGallery images={acc.images} alt={acc.name} />

            <div className="mt-6">
              <div className="flex flex-wrap items-start gap-2">
                <Badge className="bg-brand-amber text-white">
                  {typeLabels[acc.type] || acc.type}
                </Badge>
                {acc.featured && (
                  <Badge className="bg-brand-teal text-white">Featured</Badge>
                )}
              </div>
              <h1 className="mt-3 font-heading text-2xl font-bold text-brand-charcoal sm:text-3xl">
                {acc.name}
              </h1>
              <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                {acc.address && (
                  <span className="flex items-center gap-1.5">
                    <MapPin className="size-4 text-brand-teal" />
                    {acc.address}
                  </span>
                )}
                {avgRating > 0 && (
                  <span className="flex items-center gap-1.5">
                    <StarRating rating={avgRating} size="sm" showValue />
                    <span className="text-xs">
                      ({acc.reviews.length} reviews)
                    </span>
                  </span>
                )}
              </div>
            </div>

            <Separator className="my-6" />

            {/* Description */}
            <div>
              <h2 className="font-heading text-xl font-semibold text-brand-charcoal">
                About This Property
              </h2>
              <div className="mt-3 space-y-4 text-sm leading-relaxed text-muted-foreground">
                {acc.description.split("\n\n").map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </div>

            <Separator className="my-6" />

            {/* Amenities */}
            {acc.amenities.length > 0 && (
              <>
                <div>
                  <h2 className="font-heading text-xl font-semibold text-brand-charcoal">
                    Amenities
                  </h2>
                  <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {acc.amenities.map((amenity) => (
                      <div
                        key={amenity}
                        className="flex items-center gap-3 rounded-lg bg-muted/50 p-3"
                      >
                        <div className="text-brand-teal">
                          {amenityIcons[amenity.toLowerCase()] || (
                            <CheckCircle2 className="size-5" />
                          )}
                        </div>
                        <span className="text-sm font-medium">{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <Separator className="my-6" />
              </>
            )}

            {/* Room Types */}
            {acc.roomTypes.length > 0 && (
              <>
                <div>
                  <h2 className="font-heading text-xl font-semibold text-brand-charcoal">
                    Room Types
                  </h2>
                  <div className="mt-4 space-y-6">
                    {acc.roomTypes.map((rt) => {
                      const pricingByTier: Record<
                        string,
                        { season: string; price: number }[]
                      > = {};
                      rt.pricing.forEach((p) => {
                        if (!pricingByTier[p.tier]) pricingByTier[p.tier] = [];
                        pricingByTier[p.tier].push({
                          season: p.season,
                          price: p.price,
                        });
                      });

                      return (
                        <Card key={rt.id}>
                          <CardContent className="pt-4">
                            <div className="flex items-start justify-between">
                              <div>
                                <h3 className="font-heading text-lg font-semibold text-brand-charcoal">
                                  {rt.name}
                                </h3>
                                {rt.description && (
                                  <p className="mt-1 text-sm text-muted-foreground">
                                    {rt.description}
                                  </p>
                                )}
                                <div className="mt-2 flex items-center gap-1 text-sm text-muted-foreground">
                                  <Users className="size-4" />
                                  Up to {rt.maxOccupancy} guest
                                  {rt.maxOccupancy !== 1 ? "s" : ""}
                                </div>
                              </div>
                              <div className="text-right">
                                <span className="text-xs text-muted-foreground">
                                  From
                                </span>
                                <p className="text-xl font-bold text-brand-teal">
                                  ${Math.min(...rt.pricing.map((p) => p.price))}
                                </p>
                                <span className="text-xs text-muted-foreground">
                                  per night
                                </span>
                              </div>
                            </div>

                            {Object.keys(pricingByTier).length > 0 && (
                              <Tabs
                                defaultValue={Object.keys(pricingByTier)[0]}
                                className="mt-4"
                              >
                                <TabsList>
                                  {Object.keys(pricingByTier).map((tier) => (
                                    <TabsTrigger key={tier} value={tier}>
                                      {tierLabels[tier] || tier}
                                    </TabsTrigger>
                                  ))}
                                </TabsList>
                                {Object.entries(pricingByTier).map(
                                  ([tier, prices]) => (
                                    <TabsContent key={tier} value={tier}>
                                      <div className="grid gap-2">
                                        {prices.map((p) => (
                                          <div
                                            key={p.season}
                                            className="flex items-center justify-between rounded-md bg-muted/50 px-3 py-2"
                                          >
                                            <span className="text-xs text-muted-foreground">
                                              {seasonLabels[p.season] ||
                                                p.season}
                                            </span>
                                            <span className="font-semibold text-brand-teal">
                                              ${p.price.toFixed(2)}
                                            </span>
                                          </div>
                                        ))}
                                      </div>
                                    </TabsContent>
                                  )
                                )}
                              </Tabs>
                            )}
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>
                <Separator className="my-6" />
              </>
            )}

            {/* Reviews */}
            {acc.reviews.length > 0 && (
              <div>
                <h2 className="font-heading text-xl font-semibold text-brand-charcoal">
                  Guest Reviews
                </h2>
                <div className="mt-2 flex items-center gap-3">
                  <StarRating rating={avgRating} size="md" />
                  <span className="text-sm text-muted-foreground">
                    {avgRating.toFixed(1)} out of 5 ({acc.reviews.length}{" "}
                    review{acc.reviews.length !== 1 ? "s" : ""})
                  </span>
                </div>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  {acc.reviews.map((review) => (
                    <ReviewCard key={review.id} review={review} />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Booking Widget */}
          <div className="lg:col-span-1">
            <BookingWidget
              type="accommodation"
              slug={acc.slug}
              name={acc.name}
              basePrice={lowestPrice}
              roomTypes={roomTypesForWidget}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
