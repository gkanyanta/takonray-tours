export const dynamic = "force-dynamic";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { TourCard } from "@/components/tour-card";
import { TourFilters } from "@/components/tours/tour-filters";
import { ChevronRight, Compass, Search } from "lucide-react";

export const metadata = {
  title: "Tours & Activities | Takonray Tours",
  description:
    "Browse our collection of tours and activities in Livingstone, Zambia. From Victoria Falls visits to wildlife safaris and adrenaline adventures.",
};

const fallbackCategories = [
  { id: "1", name: "Sightseeing", slug: "sightseeing" },
  { id: "2", name: "Adventure", slug: "adventure" },
  { id: "3", name: "River Activities", slug: "river-activities" },
  { id: "4", name: "Wildlife Safari", slug: "wildlife-safari" },
  { id: "5", name: "Cultural", slug: "cultural" },
];

const fallbackTours = [
  {
    id: "1",
    name: "Victoria Falls Guided Tour",
    slug: "victoria-falls-guided-tour",
    description:
      "Experience the thundering majesty of Victoria Falls, one of the Seven Natural Wonders of the World.",
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
      "Cruise along the mighty Zambezi River as the African sun sets over the horizon. Spot hippos, crocodiles, and elephants.",
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
      "Take the ultimate leap of faith from the iconic Victoria Falls Bridge, 111 meters above the Zambezi River gorge.",
    duration: "1 hour",
    maxGroupSize: 8,
    difficulty: "Extreme",
    images: [
      "https://images.unsplash.com/photo-1540039455722-5dfc077e8af0?w=600&h=400&fit=crop",
    ],
    featured: false,
    category: { name: "Adventure", slug: "adventure" },
    pricing: [{ price: 160 }],
    reviews: [{ rating: 5 }, { rating: 5 }],
  },
  {
    id: "4",
    name: "Chobe National Park Day Trip",
    slug: "chobe-national-park-day-trip",
    description:
      "Cross into Botswana for a full day of wildlife viewing in Chobe National Park, home to Africa's largest elephant population.",
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
  {
    id: "5",
    name: "White Water Rafting - Zambezi Rapids",
    slug: "white-water-rafting-zambezi",
    description:
      "Tackle the famous Grade 5 rapids of the Zambezi River below Victoria Falls. One of the world's best rafting experiences.",
    duration: "Full Day",
    maxGroupSize: 12,
    difficulty: "Challenging",
    images: [
      "https://images.unsplash.com/photo-1530866495561-507c83091b04?w=600&h=400&fit=crop",
    ],
    featured: false,
    category: { name: "Adventure", slug: "adventure" },
    pricing: [{ price: 150 }],
    reviews: [{ rating: 5 }, { rating: 4 }],
  },
  {
    id: "6",
    name: "Livingstone Cultural Village Tour",
    slug: "livingstone-cultural-village-tour",
    description:
      "Visit a traditional Zambian village and experience local customs, music, dance, and cuisine. A genuine cultural immersion.",
    duration: "3 hours",
    maxGroupSize: 15,
    difficulty: "Easy",
    images: [
      "https://images.unsplash.com/photo-1523805009345-7448845a9e53?w=600&h=400&fit=crop",
    ],
    featured: false,
    category: { name: "Cultural", slug: "cultural" },
    pricing: [{ price: 35 }],
    reviews: [{ rating: 4 }, { rating: 5 }, { rating: 4 }],
  },
];

async function getCategories() {
  try {
    const { db } = await import("@/lib/db");
    const categories = await db.tourCategory.findMany({
      orderBy: { name: "asc" },
    });
    return categories.length > 0 ? categories : fallbackCategories;
  } catch {
    return fallbackCategories;
  }
}

async function getTours(filters: {
  category?: string;
  difficulty?: string;
}) {
  try {
    const { db } = await import("@/lib/db");
    const where: Record<string, unknown> = { active: true };
    if (filters.category) {
      where.category = { slug: filters.category };
    }
    if (filters.difficulty) {
      where.difficulty = filters.difficulty;
    }
    const tours = await db.tour.findMany({
      where,
      include: {
        category: true,
        pricing: true,
        reviews: { where: { approved: true }, select: { rating: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    return tours.length > 0 ? tours : fallbackTours;
  } catch {
    return fallbackTours;
  }
}

export default async function ToursPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; difficulty?: string; duration?: string }>;
}) {
  const params = await searchParams;
  const [categories, tours] = await Promise.all([
    getCategories(),
    getTours({ category: params.category, difficulty: params.difficulty }),
  ]);

  // Client-side filter for fallback data
  let filteredTours = tours as typeof fallbackTours;
  if (params.category) {
    filteredTours = filteredTours.filter(
      (t) => t.category.slug === params.category
    );
  }
  if (params.difficulty) {
    filteredTours = filteredTours.filter(
      (t) => t.difficulty === params.difficulty
    );
  }

  return (
    <main className="min-h-screen">
      {/* Header */}
      <section className="bg-brand-teal py-16">
        <div className="mx-auto max-w-7xl px-4">
          <nav className="mb-4 flex items-center gap-2 text-sm text-white/70">
            <Link href="/" className="hover:text-white">
              Home
            </Link>
            <ChevronRight className="size-3" />
            <span className="text-white">Tours</span>
          </nav>
          <h1 className="font-heading text-3xl font-bold text-white sm:text-4xl">
            Tours & Activities
          </h1>
          <p className="mt-2 max-w-2xl text-white/80">
            Discover thrilling adventures, scenic tours, and cultural
            experiences in and around Livingstone, the adventure capital of
            Africa.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-10">
        {/* Filters */}
        <div className="mb-8 rounded-xl border bg-card p-4">
          <TourFilters categories={categories} />
        </div>

        {/* Results count */}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing{" "}
            <span className="font-semibold text-brand-charcoal">
              {filteredTours.length}
            </span>{" "}
            tour{filteredTours.length !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Tour Grid */}
        {filteredTours.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredTours.map((tour) => (
              <TourCard key={tour.id} tour={tour} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="flex size-16 items-center justify-center rounded-full bg-muted">
              <Search className="size-8 text-muted-foreground" />
            </div>
            <h3 className="mt-4 font-heading text-lg font-semibold text-brand-charcoal">
              No tours found
            </h3>
            <p className="mt-2 max-w-sm text-sm text-muted-foreground">
              Try adjusting your filters or browse all our available tours and
              activities.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
