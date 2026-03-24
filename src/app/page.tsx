export const dynamic = "force-dynamic";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TourCard } from "@/components/tour-card";
import { AccommodationCard } from "@/components/accommodation-card";
import { ReviewCard } from "@/components/review-card";
import {
  MapPin,
  Shield,
  Clock,
  Headphones,
  ArrowRight,
  Compass,
  Waves,
  Camera,
  TreePine,
} from "lucide-react";
import { HeroSearch } from "@/components/home/hero-search";
import { HeroSlideshow } from "@/components/home/hero-slideshow";

export const metadata = {
  title: "Takonray Tours | Discover the Magic of Livingstone, Zambia",
  description:
    "Explore Victoria Falls, Zambezi River cruises, wildlife safaris, and thrilling adventures in Livingstone, Zambia. Book with Takonray Tours for unforgettable African experiences.",
};

const fallbackTours = [
  {
    id: "1",
    name: "Victoria Falls Guided Tour",
    slug: "victoria-falls-guided-tour",
    description:
      "Experience the thundering majesty of Victoria Falls, one of the Seven Natural Wonders of the World. Walk along the rainforest trail with panoramic viewpoints.",
    duration: "3 hours",
    maxGroupSize: 12,
    difficulty: "Easy",
    images: [
      "https://images.unsplash.com/photo-1568625502763-2a5ec6a94c47?w=600&h=400&fit=crop",
    ],
    featured: true,
    category: { name: "Sightseeing", slug: "sightseeing" },
    pricing: [{ price: 45 }],
    reviews: [{ rating: 5 }, { rating: 4 }, { rating: 5 }],
  },
  {
    id: "2",
    name: "Zambezi River Sunset Cruise",
    slug: "zambezi-sunset-cruise",
    description:
      "Cruise along the mighty Zambezi River as the African sun sets over the horizon. Spot hippos, crocodiles, and elephants along the banks.",
    duration: "2.5 hours",
    maxGroupSize: 16,
    difficulty: "Easy",
    images: [
      "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=600&h=400&fit=crop",
    ],
    featured: true,
    category: { name: "River Activities", slug: "river-activities" },
    pricing: [{ price: 65 }],
    reviews: [{ rating: 5 }, { rating: 5 }, { rating: 4 }],
  },
  {
    id: "3",
    name: "Bungee Jumping at Victoria Falls Bridge",
    slug: "bungee-jumping-victoria-falls",
    description:
      "Take the ultimate leap of faith from the iconic Victoria Falls Bridge, 111 meters above the Zambezi River gorge. An adrenaline rush like no other.",
    duration: "1 hour",
    maxGroupSize: 8,
    difficulty: "Extreme",
    images: [
      "https://images.unsplash.com/photo-1540039455722-5dfc077e8af0?w=600&h=400&fit=crop",
    ],
    featured: true,
    category: { name: "Adventure", slug: "adventure" },
    pricing: [{ price: 160 }],
    reviews: [{ rating: 5 }, { rating: 5 }],
  },
  {
    id: "4",
    name: "Chobe National Park Day Trip",
    slug: "chobe-national-park-day-trip",
    description:
      "Cross the border into Botswana for an unforgettable day of wildlife viewing in Chobe National Park, home to Africa's largest elephant population.",
    duration: "Full Day",
    maxGroupSize: 10,
    difficulty: "Moderate",
    images: [
      "https://images.unsplash.com/photo-1549366021-9f761d450615?w=600&h=400&fit=crop",
    ],
    featured: true,
    category: { name: "Wildlife Safari", slug: "wildlife-safari" },
    pricing: [{ price: 195 }],
    reviews: [{ rating: 5 }, { rating: 4 }, { rating: 5 }, { rating: 5 }],
  },
];

const fallbackAccommodations = [
  {
    id: "1",
    name: "Royal Livingstone Hotel",
    slug: "royal-livingstone-hotel",
    description:
      "A luxury hotel on the banks of the Zambezi River, just a short walk from Victoria Falls. Colonial elegance meets African wilderness.",
    type: "hotel",
    address: "Mosi-oa-Tunya Road, Livingstone",
    amenities: ["WiFi", "Pool", "Restaurant", "Spa", "River View"],
    images: [
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&h=400&fit=crop",
    ],
    rating: 4.8,
    featured: true,
    roomTypes: [{ pricing: [{ price: 250 }] }],
    reviews: [{ rating: 5 }, { rating: 5 }, { rating: 4 }],
  },
  {
    id: "2",
    name: "Bushfront Lodge",
    slug: "bushfront-lodge",
    description:
      "A charming bush lodge offering authentic African hospitality surrounded by indigenous trees and abundant birdlife.",
    type: "lodge",
    address: "Nakatindi Road, Livingstone",
    amenities: ["WiFi", "Pool", "Garden", "Breakfast"],
    images: [
      "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=600&h=400&fit=crop",
    ],
    rating: 4.5,
    featured: true,
    roomTypes: [{ pricing: [{ price: 85 }] }],
    reviews: [{ rating: 4 }, { rating: 5 }],
  },
  {
    id: "3",
    name: "Zambezi Waterfront",
    slug: "zambezi-waterfront",
    description:
      "Located right on the Zambezi River with stunning sunset views. Perfect for both adventure seekers and those looking for a peaceful retreat.",
    type: "lodge",
    address: "Sichango Road, Livingstone",
    amenities: ["WiFi", "Restaurant", "Bar", "River Front", "Parking"],
    images: [
      "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=600&h=400&fit=crop",
    ],
    rating: 4.6,
    featured: true,
    roomTypes: [{ pricing: [{ price: 120 }] }],
    reviews: [{ rating: 5 }, { rating: 4 }, { rating: 5 }],
  },
];

const fallbackReviews = [
  {
    id: "1",
    rating: 5,
    comment:
      "Absolutely incredible experience! The Victoria Falls tour was beyond our expectations. Our guide was knowledgeable and passionate about the falls and its history.",
    createdAt: "2025-11-15",
    user: { name: "Sarah Thompson", image: null },
  },
  {
    id: "2",
    rating: 5,
    comment:
      "The sunset cruise on the Zambezi was the highlight of our entire African trip. We saw elephants drinking right from the riverbank. Magical!",
    createdAt: "2025-10-22",
    user: { name: "James Okafor", image: null },
  },
  {
    id: "3",
    rating: 4,
    comment:
      "Takonray Tours made our Livingstone adventure seamless. From airport pickup to the Chobe day trip, everything was perfectly organized. Will definitely come back!",
    createdAt: "2025-12-01",
    user: { name: "Maria Gonzalez", image: null },
  },
];

async function getFeaturedTours() {
  try {
    const { db } = await import("@/lib/db");
    const tours = await db.tour.findMany({
      where: { featured: true, active: true },
      include: {
        category: true,
        pricing: true,
        reviews: { where: { approved: true }, select: { rating: true } },
      },
      take: 4,
    });
    return tours.length > 0 ? tours : fallbackTours;
  } catch {
    return fallbackTours;
  }
}

async function getFeaturedAccommodations() {
  try {
    const { db } = await import("@/lib/db");
    const accommodations = await db.accommodation.findMany({
      where: { featured: true, active: true },
      include: {
        roomTypes: { include: { pricing: true } },
        reviews: { where: { approved: true }, select: { rating: true } },
      },
      take: 3,
    });
    return accommodations.length > 0 ? accommodations : fallbackAccommodations;
  } catch {
    return fallbackAccommodations;
  }
}

async function getReviews() {
  try {
    const { db } = await import("@/lib/db");
    const reviews = await db.review.findMany({
      where: { approved: true },
      include: { user: { select: { name: true, image: true } } },
      orderBy: { createdAt: "desc" },
      take: 3,
    });
    return reviews.length > 0 ? reviews : fallbackReviews;
  } catch {
    return fallbackReviews;
  }
}

export default async function HomePage() {
  const [tours, accommodations, reviews] = await Promise.all([
    getFeaturedTours(),
    getFeaturedAccommodations(),
    getReviews(),
  ]);

  return (
    <main>
      {/* Hero Slideshow Section */}
      <section className="relative flex min-h-[100vh] items-center justify-center overflow-hidden">
        <HeroSlideshow />
        <div className="relative z-10 mx-auto max-w-5xl px-4 text-center">
          <Badge className="mb-6 border-none bg-amber-500/90 px-4 py-1.5 text-sm font-medium text-white shadow-lg">
            Livingstone, Zambia
          </Badge>
          <h1 className="font-heading text-4xl font-extrabold leading-[1.1] tracking-tight text-white drop-shadow-lg sm:text-5xl md:text-6xl lg:text-7xl">
            Discover the Magic
            <br />
            <span className="bg-gradient-to-r from-amber-400 to-amber-500 bg-clip-text text-transparent">
              of Livingstone
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-white/90 drop-shadow sm:text-xl">
            Stand before the thundering Victoria Falls, cruise the mighty
            Zambezi River, and embark on unforgettable African adventures. Your
            journey of a lifetime starts here.
          </p>
          <HeroSearch />
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link href="/tours">
              <Button
                size="lg"
                className="h-13 bg-teal-700 px-8 text-base font-semibold text-white shadow-xl transition-all hover:bg-teal-800 hover:shadow-2xl"
              >
                <Compass className="size-5" />
                Explore Tours
              </Button>
            </Link>
            <Link href="/contact">
              <Button
                size="lg"
                variant="outline"
                className="h-13 border-white/30 bg-white/10 px-8 text-base font-semibold text-white shadow-xl backdrop-blur-sm transition-all hover:bg-white/20 hover:text-white"
              >
                Book Now
              </Button>
            </Link>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 z-10 h-32 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* Featured Tours */}
      <section className="mx-auto max-w-7xl px-4 py-20">
        <div className="text-center">
          <Badge variant="secondary" className="mb-3 px-3">
            <Compass className="mr-1 size-3" />
            Our Tours
          </Badge>
          <h2 className="font-heading text-3xl font-bold text-brand-charcoal sm:text-4xl">
            Featured Experiences
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
            Handpicked tours and activities showcasing the very best of
            Livingstone and Victoria Falls. Every experience is guided by
            passionate local experts.
          </p>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {(tours as typeof fallbackTours).map((tour) => (
            <TourCard key={tour.id} tour={tour} />
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link href="/tours">
            <Button variant="outline" size="lg">
              View All Tours
              <ArrowRight className="size-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-muted/50 py-20">
        <div className="mx-auto max-w-7xl px-4">
          <div className="text-center">
            <h2 className="font-heading text-3xl font-bold text-brand-charcoal sm:text-4xl">
              Why Choose Takonray Tours
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
              We are Livingstone&apos;s trusted tour operator, dedicated to
              crafting unforgettable experiences with safety, authenticity, and
              value at the forefront.
            </p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: <MapPin className="size-8" />,
                title: "Expert Local Guides",
                description:
                  "Born and raised in Livingstone, our guides share deep knowledge of the region's history, culture, and hidden gems.",
              },
              {
                icon: <Shield className="size-8" />,
                title: "Best Price Guarantee",
                description:
                  "We offer competitive local pricing with special rates for Zambian residents and SADC nationals. No hidden fees.",
              },
              {
                icon: <Clock className="size-8" />,
                title: "Flexible Booking",
                description:
                  "Free cancellation up to 48 hours before your tour. Reschedule anytime at no extra cost.",
              },
              {
                icon: <Headphones className="size-8" />,
                title: "24/7 Support",
                description:
                  "Our team is available around the clock via WhatsApp, phone, or email. We are here whenever you need us.",
              },
            ].map((feature) => (
              <Card key={feature.title} className="text-center">
                <CardContent className="flex flex-col items-center gap-4 pt-6">
                  <div className="flex size-16 items-center justify-center rounded-2xl bg-brand-teal/10 text-brand-teal">
                    {feature.icon}
                  </div>
                  <h3 className="font-heading text-lg font-semibold text-brand-charcoal">
                    {feature.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Accommodations Preview */}
      <section className="mx-auto max-w-7xl px-4 py-20">
        <div className="text-center">
          <Badge variant="secondary" className="mb-3 px-3">
            <TreePine className="mr-1 size-3" />
            Stay With Us
          </Badge>
          <h2 className="font-heading text-3xl font-bold text-brand-charcoal sm:text-4xl">
            Where to Stay in Livingstone
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
            From luxury riverfront lodges to cozy guesthouses, we have partnered
            with the best accommodations in Livingstone.
          </p>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {(accommodations as typeof fallbackAccommodations).map((acc) => (
            <AccommodationCard key={acc.id} accommodation={acc} />
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link href="/accommodations">
            <Button variant="outline" size="lg">
              View All Accommodations
              <ArrowRight className="size-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-muted/50 py-20">
        <div className="mx-auto max-w-7xl px-4">
          <div className="text-center">
            <Badge variant="secondary" className="mb-3 px-3">
              <Camera className="mr-1 size-3" />
              Testimonials
            </Badge>
            <h2 className="font-heading text-3xl font-bold text-brand-charcoal sm:text-4xl">
              What Our Guests Say
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
              Hear from travellers who have explored Livingstone with us. Their
              stories speak louder than words.
            </p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {(reviews as typeof fallbackReviews).map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden py-24">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1920&h=600&fit=crop')",
          }}
        />
        <div className="absolute inset-0 bg-brand-charcoal/80" />
        <div className="relative z-10 mx-auto max-w-3xl px-4 text-center">
          <h2 className="font-heading text-3xl font-bold text-white sm:text-4xl md:text-5xl">
            Ready for Your{" "}
            <span className="text-brand-amber">African Adventure?</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-white/80">
            Whether it&apos;s the thundering falls, a wild safari, or a peaceful
            sunset cruise — your dream trip to Livingstone is just one click
            away.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link href="/tours">
              <Button
                size="lg"
                className="h-12 bg-brand-amber px-8 text-base font-semibold text-white hover:bg-brand-amber-600"
              >
                Start Planning
                <ArrowRight className="size-5" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button
                size="lg"
                variant="outline"
                className="h-12 border-white/30 px-8 text-base font-semibold text-white hover:bg-white/10 hover:text-white"
              >
                <Waves className="size-5" />
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
