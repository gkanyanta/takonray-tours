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

function makeFallbackTour(data: {
  id: string; name: string; slug: string; description: string;
  highlights: string[]; duration: string; maxGroupSize: number; difficulty: string;
  includes: string[]; excludes: string[]; images: string[];
  category: { name: string; slug: string };
  basePrice: number;
}) {
  return {
    ...data,
    featured: true,
    pricing: [
      { tier: "LOCAL", season: "PEAK", price: Math.round(data.basePrice * 0.5) },
      { tier: "LOCAL", season: "HIGH", price: Math.round(data.basePrice * 0.4) },
      { tier: "LOCAL", season: "LOW", price: Math.round(data.basePrice * 0.3) },
      { tier: "SADC", season: "PEAK", price: Math.round(data.basePrice * 0.7) },
      { tier: "SADC", season: "HIGH", price: Math.round(data.basePrice * 0.6) },
      { tier: "SADC", season: "LOW", price: Math.round(data.basePrice * 0.5) },
      { tier: "INTERNATIONAL", season: "PEAK", price: data.basePrice },
      { tier: "INTERNATIONAL", season: "HIGH", price: Math.round(data.basePrice * 0.85) },
      { tier: "INTERNATIONAL", season: "LOW", price: Math.round(data.basePrice * 0.7) },
    ],
    addOns: [] as { id: string; name: string; description: string; price: number }[],
    reviews: [
      { id: "r1", rating: 5, comment: "Amazing experience! Highly recommend this tour to anyone visiting Livingstone.", createdAt: "2025-11-15", user: { name: "Sarah Thompson", image: null } },
      { id: "r2", rating: 5, comment: "Our guide was incredibly knowledgeable and passionate. Made the whole experience unforgettable.", createdAt: "2025-10-22", user: { name: "David Chen", image: null } },
      { id: "r3", rating: 4, comment: "Well organized tour with beautiful scenery. Would definitely come back!", createdAt: "2025-09-08", user: { name: "Maria Gonzalez", image: null } },
    ],
  };
}

const fallbackTours: Record<string, ReturnType<typeof makeFallbackTour>> = {
  "victoria-falls-guided-tour": makeFallbackTour({
    id: "1", name: "Victoria Falls Guided Tour", slug: "victoria-falls-guided-tour",
    description: "Experience the awe-inspiring power and beauty of Victoria Falls, locally known as Mosi-oa-Tunya — 'The Smoke That Thunders.' This guided walking tour takes you along the famous rainforest trail on the Zambian side, offering breathtaking panoramic views of the world's largest curtain of falling water.\n\nYour expert local guide will share fascinating stories about the geological formation of the falls, the history of David Livingstone's exploration, and the cultural significance of this natural wonder to the Tonga people.\n\nThe tour includes entry to the Victoria Falls National Park, where you'll visit all the major viewpoints including the Knife Edge Bridge. Keep your camera in a waterproof bag — you will get wet!",
    highlights: ["Panoramic views from 16 viewpoints along the gorge", "Walk across the iconic Knife Edge Bridge", "Expert commentary on geology, history, and local culture", "Visit the David Livingstone statue", "Spot rainbows in the mist (sunny days)", "Optional helicopter flight upgrade"],
    duration: "3 hours", maxGroupSize: 12, difficulty: "Easy",
    includes: ["National Park entry fee", "Professional English-speaking guide", "Raincoat and poncho", "Hotel pickup and drop-off", "Bottled water"],
    excludes: ["Gratuities (optional)", "Personal expenses", "Travel insurance", "Helicopter flight upgrade"],
    images: ["https://images.unsplash.com/photo-1568625502763-2a5ec6a94c47?w=1200&h=800&fit=crop", "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1200&h=800&fit=crop", "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=1200&h=800&fit=crop"],
    category: { name: "Sightseeing", slug: "sightseeing" }, basePrice: 55,
  }),
  "zambezi-sunset-cruise": makeFallbackTour({
    id: "2", name: "Zambezi River Sunset Cruise", slug: "zambezi-sunset-cruise",
    description: "Cruise along the mighty Zambezi River as the African sun paints the sky in brilliant shades of gold and crimson. This unforgettable evening experience combines wildlife viewing with relaxation aboard a comfortable cruise boat.\n\nAs you glide upstream from the Royal Livingstone jetty, keep your eyes peeled for hippos, crocodiles, and elephants that frequent the riverbanks. Your onboard guide will point out the diverse birdlife, including the majestic African fish eagle.\n\nEnjoy complimentary drinks and snacks as you watch one of Africa's most spectacular sunsets. The cruise returns under the stars for a truly magical conclusion to the day.",
    highlights: ["Stunning Zambezi River sunset views", "Wildlife spotting — hippos, elephants, crocodiles", "Complimentary drinks and snacks", "Expert guide with bird and wildlife knowledge", "Photo opportunities at golden hour", "Calm and relaxing river experience"],
    duration: "2.5 hours", maxGroupSize: 16, difficulty: "Easy",
    includes: ["Cruise boat with comfortable seating", "Complimentary drinks and snacks", "Professional guide", "Hotel pickup and drop-off"],
    excludes: ["Gratuities", "Personal expenses", "Premium drinks"],
    images: ["https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1200&h=800&fit=crop", "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1200&h=800&fit=crop", "https://images.unsplash.com/photo-1535083783855-76ae62b2914e?w=1200&h=800&fit=crop"],
    category: { name: "River Activities", slug: "river-activities" }, basePrice: 65,
  }),
  "bungee-jumping-victoria-falls": makeFallbackTour({
    id: "3", name: "Bungee Jumping at Victoria Falls Bridge", slug: "bungee-jumping-victoria-falls",
    description: "Take the ultimate leap of faith from the iconic Victoria Falls Bridge, suspended 111 meters above the churning waters of the Zambezi River gorge. This is one of the world's highest commercial bungee jumps and an absolute must for adrenaline junkies.\n\nThe bridge straddles the border between Zambia and Zimbabwe, offering jaw-dropping views of the falls and the Batoka Gorge. After a thorough safety briefing from experienced jump masters, you'll step to the edge and take the plunge of a lifetime.\n\nThe freefall lasts about 4 seconds before the cord catches you, bouncing you above the raging rapids below. A GoPro video of your jump is available for purchase.",
    highlights: ["111-meter freefall from Victoria Falls Bridge", "Breathtaking views of the Batoka Gorge", "Professional safety equipment and briefing", "Certificate of completion", "Optional GoPro video package", "Border-straddling jump between two countries"],
    duration: "1 hour", maxGroupSize: 8, difficulty: "Extreme",
    includes: ["Bungee jump", "Safety equipment and briefing", "Jump certificate", "Border crossing assistance"],
    excludes: ["GoPro video (available for purchase)", "Transport to bridge", "Gratuities"],
    images: ["https://images.unsplash.com/photo-1601024445121-e5b82f020549?w=1200&h=800&fit=crop", "https://images.unsplash.com/photo-1534177616064-76c28f23711e?w=1200&h=800&fit=crop"],
    category: { name: "Adventure", slug: "adventure" }, basePrice: 160,
  }),
  "chobe-national-park-day-trip": makeFallbackTour({
    id: "4", name: "Chobe National Park Day Trip", slug: "chobe-national-park-day-trip",
    description: "Cross the border into Botswana for an unforgettable full day of wildlife viewing in Chobe National Park — home to Africa's largest elephant population, estimated at over 120,000.\n\nYour day begins with an early morning game drive through the park's diverse habitats, from riverine woodland to open savanna. Expect to see large herds of elephants, buffalo, giraffes, zebras, and with luck, lions and leopards.\n\nAfter a riverside lunch, board a boat for an afternoon cruise along the Chobe River, where you'll get incredibly close to elephants swimming and drinking at the water's edge. The birdlife is spectacular, with over 450 species recorded in the park.",
    highlights: ["Morning game drive through Chobe", "Afternoon boat cruise on Chobe River", "Africa's largest elephant population", "Big Five wildlife viewing potential", "Riverside lunch included", "Professional wildlife guide"],
    duration: "Full Day", maxGroupSize: 10, difficulty: "Moderate",
    includes: ["Return transfers from Livingstone", "Park entry fees", "Game drive vehicle", "Boat cruise", "Lunch and bottled water", "Border crossing fees", "Professional guide"],
    excludes: ["Visa fees (if applicable)", "Gratuities", "Personal items", "Travel insurance"],
    images: ["https://images.unsplash.com/photo-1549366021-9f761d450615?w=1200&h=800&fit=crop", "https://images.unsplash.com/photo-1517960413843-0aee8e2b3285?w=1200&h=800&fit=crop", "https://images.unsplash.com/photo-1534188753412-3e26d0d618d6?w=1200&h=800&fit=crop"],
    category: { name: "Wildlife Safari", slug: "wildlife-safari" }, basePrice: 195,
  }),
  "white-water-rafting-zambezi": makeFallbackTour({
    id: "5", name: "White Water Rafting - Zambezi Rapids", slug: "white-water-rafting-zambezi",
    description: "Tackle the famous Grade 5 rapids of the Zambezi River below Victoria Falls — widely regarded as one of the world's best one-day white water rafting experiences.\n\nThe Batoka Gorge creates an incredible series of rapids with names like 'The Washing Machine,' 'Oblivion,' and 'Stairway to Heaven.' Your experienced river guides will navigate you through up to 25 rapids over the course of the day.\n\nNo previous rafting experience is needed — just a sense of adventure and the ability to swim. Safety kayakers accompany every trip. Between rapids, float through calm pools and marvel at the dramatic 200-meter gorge walls towering above you.",
    highlights: ["Up to 25 rapids including Grade 5", "World-class Batoka Gorge scenery", "Experienced safety-certified guides", "Riverside lunch in the gorge", "No experience necessary", "Safety kayakers on every trip"],
    duration: "Full Day", maxGroupSize: 12, difficulty: "Challenging",
    includes: ["All rafting equipment", "Safety briefing and training", "Professional river guides", "Lunch and drinks", "Transfer back to top of gorge"],
    excludes: ["Transport to put-in point", "Photos and videos (available for purchase)", "Gratuities"],
    images: ["https://images.unsplash.com/photo-1530866495561-507c83091b04?w=1200&h=800&fit=crop", "https://images.unsplash.com/photo-1489392191049-fc10c97e64b6?w=1200&h=800&fit=crop"],
    category: { name: "Adventure", slug: "adventure" }, basePrice: 150,
  }),
  "livingstone-cultural-village-tour": makeFallbackTour({
    id: "6", name: "Livingstone Cultural Village Tour", slug: "livingstone-cultural-village-tour",
    description: "Visit a traditional Zambian village near Livingstone and experience the authentic customs, music, dance, and daily life of the local Tonga and Lozi communities.\n\nYour village host will welcome you with a traditional greeting and lead you through the homestead, explaining the significance of different huts, the cooking area, and the community meeting space. Watch local artisans at work — basket weaving, wood carving, and pottery making.\n\nParticipate in traditional drumming and dancing, taste locally prepared food including nshima (the Zambian staple), and hear stories of local history and folklore. A portion of all tour fees goes directly to community development projects.",
    highlights: ["Authentic village homestead visit", "Traditional drumming and dancing", "Taste local Zambian cuisine including nshima", "Watch artisans: basket weaving, wood carving", "Community-supported tourism", "Learn about Tonga and Lozi traditions"],
    duration: "3 hours", maxGroupSize: 15, difficulty: "Easy",
    includes: ["Village entry and cultural fee", "Local guide and translator", "Traditional food tasting", "Hotel pickup and drop-off"],
    excludes: ["Gratuities", "Craft purchases", "Personal expenses"],
    images: ["https://images.unsplash.com/photo-1523805009345-7448845a9e53?w=1200&h=800&fit=crop", "https://images.unsplash.com/photo-1489392191049-fc10c97e64b6?w=1200&h=800&fit=crop"],
    category: { name: "Cultural", slug: "cultural" }, basePrice: 35,
  }),
};

const fallbackTour = fallbackTours["victoria-falls-guided-tour"]!;

// Add specific add-ons to the Victoria Falls tour
fallbackTour.addOns = [
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
];

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
    return fallbackTours[slug] ?? null;
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
    return Object.keys(fallbackTours).map((slug) => ({ slug }));
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
