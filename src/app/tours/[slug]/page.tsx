export const dynamic = "force-dynamic";

import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { ImageGallery } from "@/components/image-gallery";
import { BookingWidget } from "@/components/booking-widget";
import { ReviewCard } from "@/components/review-card";
import { StarRating } from "@/components/star-rating";
import {
  ChevronRight,
  Clock,
  Users,
  Mountain,
  CheckCircle2,
  XCircle,
  Sparkles,
} from "lucide-react";

export const metadata = {
  title: "Tour Details | Takonray Tours",
};

const fallbackTour = {
  id: "1",
  name: "Victoria Falls Guided Tour",
  slug: "victoria-falls-guided-tour",
  description:
    "Experience the awe-inspiring power and beauty of Victoria Falls, locally known as Mosi-oa-Tunya — 'The Smoke That Thunders.' This guided walking tour takes you along the famous rainforest trail on the Zambian side, offering breathtaking panoramic views of the world's largest curtain of falling water.\n\nYour expert local guide will share fascinating stories about the geological formation of the falls, the history of David Livingstone's exploration, and the cultural significance of this natural wonder to the Tonga people. During the peak water season (February to May), you'll experience the full force of the Zambezi River plunging 108 meters into the gorge below, creating a mist that rises over 400 meters into the sky.\n\nThe tour includes entry to the Victoria Falls National Park, where you'll visit all the major viewpoints including the Knife Edge Bridge, where you'll be surrounded by spray from the Eastern Cataract. Keep your camera in a waterproof bag — you will get wet!",
  highlights: [
    "Panoramic views from 16 viewpoints along the gorge",
    "Walk across the iconic Knife Edge Bridge",
    "Expert commentary on geology, history, and local culture",
    "Visit the David Livingstone statue",
    "Spot rainbows in the mist (sunny days)",
    "Optional helicopter flight upgrade for aerial views",
  ],
  duration: "3 hours",
  maxGroupSize: 12,
  difficulty: "Easy",
  includes: [
    "National Park entry fee",
    "Professional English-speaking guide",
    "Raincoat and poncho",
    "Hotel pickup and drop-off",
    "Bottled water",
  ],
  excludes: [
    "Gratuities (optional)",
    "Personal expenses",
    "Travel insurance",
    "Helicopter flight upgrade",
  ],
  images: [
    "https://images.unsplash.com/photo-1568625502763-2a5ec6a94c47?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=1200&h=800&fit=crop",
  ],
  featured: true,
  category: { name: "Sightseeing", slug: "sightseeing" },
  pricing: [
    { tier: "LOCAL", season: "PEAK", price: 25 },
    { tier: "LOCAL", season: "HIGH", price: 20 },
    { tier: "LOCAL", season: "LOW", price: 15 },
    { tier: "SADC", season: "PEAK", price: 35 },
    { tier: "SADC", season: "HIGH", price: 30 },
    { tier: "SADC", season: "LOW", price: 25 },
    { tier: "INTERNATIONAL", season: "PEAK", price: 55 },
    { tier: "INTERNATIONAL", season: "HIGH", price: 45 },
    { tier: "INTERNATIONAL", season: "LOW", price: 35 },
  ],
  addOns: [
    {
      id: "a1",
      name: "Helicopter Flight (15 min)",
      description: "Aerial view of the falls and Batoka Gorge",
      price: 150,
    },
    {
      id: "a2",
      name: "Professional Photo Package",
      description: "High-quality photos taken by a professional photographer",
      price: 40,
    },
    {
      id: "a3",
      name: "Lunch at The Lookout Cafe",
      description: "Meal at a restaurant overlooking the gorge",
      price: 25,
    },
  ],
  reviews: [
    {
      id: "r1",
      rating: 5,
      comment:
        "The most incredible natural sight I have ever seen. Our guide Mwamba was absolutely fantastic — his knowledge and passion made the experience even more special.",
      createdAt: "2025-11-15",
      user: { name: "Sarah Thompson", image: null },
    },
    {
      id: "r2",
      rating: 5,
      comment:
        "Visiting during peak water season was magical. The sheer power of the falls is indescribable. The raincoats provided were essential — we got completely soaked!",
      createdAt: "2025-10-22",
      user: { name: "David Chen", image: null },
    },
    {
      id: "r3",
      rating: 4,
      comment:
        "Great tour with beautiful views. The guide was informative and friendly. Would recommend the helicopter add-on for truly breathtaking aerial views.",
      createdAt: "2025-09-08",
      user: { name: "Maria Gonzalez", image: null },
    },
  ],
};

async function getTour(slug: string) {
  try {
    const { db } = await import("@/lib/db");
    const tour = await db.tour.findUnique({
      where: { slug, active: true },
      include: {
        category: true,
        pricing: true,
        addOns: true,
        reviews: {
          where: { approved: true },
          include: { user: { select: { name: true, image: true } } },
          orderBy: { createdAt: "desc" },
        },
      },
    });
    return tour;
  } catch {
    if (slug === fallbackTour.slug) return fallbackTour;
    return null;
  }
}

export async function generateStaticParams() {
  try {
    const { db } = await import("@/lib/db");
    const tours = await db.tour.findMany({
      where: { active: true },
      select: { slug: true },
    });
    return tours.map((t) => ({ slug: t.slug }));
  } catch {
    return [{ slug: "victoria-falls-guided-tour" }];
  }
}

export default async function TourDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tour = await getTour(slug);

  if (!tour) {
    notFound();
  }

  const t = tour as typeof fallbackTour;

  const avgRating =
    t.reviews.length > 0
      ? t.reviews.reduce((sum, r) => sum + r.rating, 0) / t.reviews.length
      : 0;

  const lowestPrice =
    t.pricing.length > 0 ? Math.min(...t.pricing.map((p) => p.price)) : 0;

  // Group pricing by tier
  const pricingByTier: Record<string, { season: string; price: number }[]> = {};
  t.pricing.forEach((p) => {
    if (!pricingByTier[p.tier]) pricingByTier[p.tier] = [];
    pricingByTier[p.tier].push({ season: p.season, price: p.price });
  });

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

  return (
    <main className="min-h-screen">
      {/* Header */}
      <section className="bg-brand-teal py-8">
        <div className="mx-auto max-w-7xl px-4">
          <nav className="mb-3 flex items-center gap-2 text-sm text-white/70">
            <Link href="/" className="hover:text-white">
              Home
            </Link>
            <ChevronRight className="size-3" />
            <Link href="/tours" className="hover:text-white">
              Tours
            </Link>
            <ChevronRight className="size-3" />
            <span className="text-white">{t.name}</span>
          </nav>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Image Gallery */}
            <ImageGallery images={t.images} alt={t.name} />

            {/* Tour Info */}
            <div className="mt-6">
              <div className="flex flex-wrap items-start gap-2">
                <Badge className="bg-brand-teal text-white">
                  {t.category.name}
                </Badge>
                {t.featured && (
                  <Badge className="bg-brand-amber text-white">Featured</Badge>
                )}
              </div>
              <h1 className="mt-3 font-heading text-2xl font-bold text-brand-charcoal sm:text-3xl">
                {t.name}
              </h1>
              <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Clock className="size-4 text-brand-teal" />
                  {t.duration}
                </span>
                <span className="flex items-center gap-1.5">
                  <Users className="size-4 text-brand-teal" />
                  Max {t.maxGroupSize} people
                </span>
                {t.difficulty && (
                  <span className="flex items-center gap-1.5">
                    <Mountain className="size-4 text-brand-teal" />
                    {t.difficulty}
                  </span>
                )}
                {avgRating > 0 && (
                  <span className="flex items-center gap-1.5">
                    <StarRating rating={avgRating} size="sm" showValue />
                    <span className="text-xs">({t.reviews.length} reviews)</span>
                  </span>
                )}
              </div>
            </div>

            <Separator className="my-6" />

            {/* Description */}
            <div>
              <h2 className="font-heading text-xl font-semibold text-brand-charcoal">
                About This Tour
              </h2>
              <div className="mt-3 space-y-4 text-sm leading-relaxed text-muted-foreground">
                {t.description.split("\n\n").map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>
            </div>

            <Separator className="my-6" />

            {/* Highlights */}
            {t.highlights.length > 0 && (
              <>
                <div>
                  <h2 className="font-heading text-xl font-semibold text-brand-charcoal">
                    Tour Highlights
                  </h2>
                  <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                    {t.highlights.map((highlight, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="mt-0.5 size-4 flex-shrink-0 text-brand-teal" />
                        <span className="text-sm text-muted-foreground">
                          {highlight}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
                <Separator className="my-6" />
              </>
            )}

            {/* Pricing Tabs */}
            {Object.keys(pricingByTier).length > 0 && (
              <>
                <div>
                  <h2 className="font-heading text-xl font-semibold text-brand-charcoal">
                    Pricing
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Prices vary by nationality and season. All prices are per
                    person in USD.
                  </p>
                  <Tabs defaultValue={Object.keys(pricingByTier)[0]} className="mt-4">
                    <TabsList>
                      {Object.keys(pricingByTier).map((tier) => (
                        <TabsTrigger key={tier} value={tier}>
                          {tierLabels[tier] || tier}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                    {Object.entries(pricingByTier).map(([tier, prices]) => (
                      <TabsContent key={tier} value={tier}>
                        <Card>
                          <CardContent className="pt-4">
                            <div className="grid gap-3">
                              {prices.map((p) => (
                                <div
                                  key={p.season}
                                  className="flex items-center justify-between rounded-lg bg-muted/50 px-4 py-3"
                                >
                                  <span className="text-sm text-muted-foreground">
                                    {seasonLabels[p.season] || p.season}
                                  </span>
                                  <span className="text-lg font-bold text-brand-teal">
                                    ${p.price.toFixed(2)}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      </TabsContent>
                    ))}
                  </Tabs>
                </div>
                <Separator className="my-6" />
              </>
            )}

            {/* Includes / Excludes */}
            <div className="grid gap-6 sm:grid-cols-2">
              {t.includes.length > 0 && (
                <div>
                  <h3 className="font-heading text-lg font-semibold text-brand-charcoal">
                    What&apos;s Included
                  </h3>
                  <ul className="mt-3 space-y-2">
                    {t.includes.map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="mt-0.5 size-4 flex-shrink-0 text-green-600" />
                        <span className="text-sm text-muted-foreground">
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {t.excludes.length > 0 && (
                <div>
                  <h3 className="font-heading text-lg font-semibold text-brand-charcoal">
                    What&apos;s Excluded
                  </h3>
                  <ul className="mt-3 space-y-2">
                    {t.excludes.map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <XCircle className="mt-0.5 size-4 flex-shrink-0 text-red-400" />
                        <span className="text-sm text-muted-foreground">
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Add-ons */}
            {t.addOns && t.addOns.length > 0 && (
              <>
                <Separator className="my-6" />
                <div>
                  <h2 className="font-heading text-xl font-semibold text-brand-charcoal">
                    <Sparkles className="mb-1 mr-2 inline size-5 text-brand-amber" />
                    Available Add-ons
                  </h2>
                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    {t.addOns.map((addon) => (
                      <Card key={addon.id} className="border-brand-amber/20">
                        <CardContent className="flex items-center justify-between pt-4">
                          <div>
                            <p className="font-medium text-brand-charcoal">
                              {addon.name}
                            </p>
                            {addon.description && (
                              <p className="text-xs text-muted-foreground">
                                {addon.description}
                              </p>
                            )}
                          </div>
                          <span className="text-lg font-bold text-brand-amber">
                            +${addon.price}
                          </span>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Reviews */}
            {t.reviews.length > 0 && (
              <>
                <Separator className="my-6" />
                <div>
                  <h2 className="font-heading text-xl font-semibold text-brand-charcoal">
                    Guest Reviews
                  </h2>
                  <div className="mt-2 flex items-center gap-3">
                    <StarRating rating={avgRating} size="md" />
                    <span className="text-sm text-muted-foreground">
                      {avgRating.toFixed(1)} out of 5 ({t.reviews.length}{" "}
                      review{t.reviews.length !== 1 ? "s" : ""})
                    </span>
                  </div>
                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    {t.reviews.map((review) => (
                      <ReviewCard key={review.id} review={review} />
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Booking Widget Sidebar */}
          <div className="lg:col-span-1">
            <BookingWidget
              type="tour"
              slug={t.slug}
              name={t.name}
              basePrice={lowestPrice}
              maxGroupSize={t.maxGroupSize}
              addOns={t.addOns}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
