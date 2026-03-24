export const dynamic = "force-dynamic";

import Link from "next/link";
import { AccommodationCard } from "@/components/accommodation-card";
import { AccommodationFilters } from "@/components/accommodations/accommodation-filters";
import { ChevronRight, Search } from "lucide-react";

export const metadata = {
  title: "Accommodations | Takonray Tours",
  description:
    "Find the perfect place to stay in Livingstone, Zambia. From luxury hotels to cozy lodges and budget-friendly guesthouses near Victoria Falls.",
};

const fallbackAccommodations = [
  {
    id: "1",
    name: "Royal Livingstone Hotel",
    slug: "royal-livingstone-hotel",
    description:
      "A luxury hotel on the banks of the Zambezi River, just a short walk from Victoria Falls. Colonial elegance meets African wilderness with world-class dining and impeccable service.",
    type: "hotel",
    address: "Mosi-oa-Tunya Road, Livingstone",
    amenities: ["WiFi", "Pool", "Restaurant", "Spa", "River View", "Bar", "Gym"],
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
      "A charming bush lodge offering authentic African hospitality surrounded by indigenous trees and abundant birdlife. A peaceful retreat minutes from town.",
    type: "lodge",
    address: "Nakatindi Road, Livingstone",
    amenities: ["WiFi", "Pool", "Garden", "Breakfast", "Parking"],
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
      "Located right on the Zambezi River with stunning sunset views. Adventure centre on site with direct access to river activities and tours.",
    type: "lodge",
    address: "Sichango Road, Livingstone",
    amenities: ["WiFi", "Restaurant", "Bar", "River Front", "Parking", "Tours Desk"],
    images: [
      "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=600&h=400&fit=crop",
    ],
    rating: 4.6,
    featured: true,
    roomTypes: [{ pricing: [{ price: 120 }] }],
    reviews: [{ rating: 5 }, { rating: 4 }, { rating: 5 }],
  },
  {
    id: "4",
    name: "Jollyboys Backpackers",
    slug: "jollyboys-backpackers",
    description:
      "Livingstone's most popular backpackers hostel, set in a charming colonial-era house with a lively atmosphere and affordable rates for budget travellers.",
    type: "guesthouse",
    address: "559 Mokambo Road, Livingstone",
    amenities: ["WiFi", "Pool", "Kitchen", "Bar", "Laundry"],
    images: [
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&h=400&fit=crop",
    ],
    rating: 4.2,
    featured: false,
    roomTypes: [{ pricing: [{ price: 25 }] }],
    reviews: [{ rating: 4 }, { rating: 4 }, { rating: 5 }],
  },
  {
    id: "5",
    name: "Thorntree River Lodge",
    slug: "thorntree-river-lodge",
    description:
      "An exclusive safari-style lodge within the Mosi-oa-Tunya National Park, offering luxurious tented suites with private plunge pools overlooking the Zambezi.",
    type: "lodge",
    address: "Mosi-oa-Tunya National Park, Livingstone",
    amenities: ["WiFi", "Pool", "Restaurant", "Spa", "Game Drives", "River View"],
    images: [
      "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=600&h=400&fit=crop",
    ],
    rating: 4.9,
    featured: true,
    roomTypes: [{ pricing: [{ price: 450 }] }],
    reviews: [{ rating: 5 }, { rating: 5 }, { rating: 5 }],
  },
  {
    id: "6",
    name: "Maramba River Lodge",
    slug: "maramba-river-lodge",
    description:
      "A family-run lodge on the banks of the Maramba River offering camping, chalets, and tented accommodation. Great for nature lovers on any budget.",
    type: "camping",
    address: "Maramba River, Livingstone",
    amenities: ["Camping", "Pool", "Restaurant", "Bar", "Wildlife"],
    images: [
      "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=600&h=400&fit=crop",
    ],
    rating: 4.3,
    featured: false,
    roomTypes: [{ pricing: [{ price: 15 }] }],
    reviews: [{ rating: 4 }, { rating: 5 }],
  },
];

async function getAccommodations(filters: { type?: string; rating?: string }) {
  try {
    const { db } = await import("@/lib/db");
    const where: Record<string, unknown> = { active: true };
    if (filters.type) where.type = filters.type;
    const accommodations = await db.accommodation.findMany({
      where,
      include: {
        roomTypes: { include: { pricing: true } },
        reviews: { where: { approved: true }, select: { rating: true } },
      },
      orderBy: { featured: "desc" },
    });
    return accommodations.length > 0 ? accommodations : fallbackAccommodations;
  } catch {
    return fallbackAccommodations;
  }
}

export default async function AccommodationsPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string; rating?: string }>;
}) {
  const params = await searchParams;
  const accommodations = await getAccommodations(params);

  let filtered = accommodations as typeof fallbackAccommodations;
  if (params.type) {
    filtered = filtered.filter((a) => a.type === params.type);
  }
  if (params.rating) {
    const minRating = parseFloat(params.rating);
    filtered = filtered.filter((a) => (a.rating || 0) >= minRating);
  }

  return (
    <main className="min-h-screen">
      <section className="bg-brand-teal py-16">
        <div className="mx-auto max-w-7xl px-4">
          <nav className="mb-4 flex items-center gap-2 text-sm text-white/70">
            <Link href="/" className="hover:text-white">
              Home
            </Link>
            <ChevronRight className="size-3" />
            <span className="text-white">Accommodations</span>
          </nav>
          <h1 className="font-heading text-3xl font-bold text-white sm:text-4xl">
            Accommodations in Livingstone
          </h1>
          <p className="mt-2 max-w-2xl text-white/80">
            From luxury riverfront lodges to budget-friendly guesthouses, find
            the perfect place to rest after your Zambian adventures.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="mb-8 rounded-xl border bg-card p-4">
          <AccommodationFilters />
        </div>

        <div className="mb-6">
          <p className="text-sm text-muted-foreground">
            Showing{" "}
            <span className="font-semibold text-brand-charcoal">
              {filtered.length}
            </span>{" "}
            accommodation{filtered.length !== 1 ? "s" : ""}
          </p>
        </div>

        {filtered.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((acc) => (
              <AccommodationCard key={acc.id} accommodation={acc} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="flex size-16 items-center justify-center rounded-full bg-muted">
              <Search className="size-8 text-muted-foreground" />
            </div>
            <h3 className="mt-4 font-heading text-lg font-semibold">
              No accommodations found
            </h3>
            <p className="mt-2 max-w-sm text-sm text-muted-foreground">
              Try adjusting your filters to see more options.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
