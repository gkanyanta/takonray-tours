import { GalleryGrid } from "@/components/gallery/gallery-grid";

export const metadata = {
  title: "Gallery | Takonray Tours",
  description:
    "Browse stunning photos from our tours and activities in Livingstone, Zambia. Victoria Falls, wildlife safaris, river cruises, and more.",
};

const fallbackImages = [
  {
    id: "1",
    url: "https://images.unsplash.com/photo-1568625502763-2a5ec6a94c47?w=800&h=600&fit=crop",
    caption: "Victoria Falls, the Smoke That Thunders",
    category: "Scenery",
  },
  {
    id: "2",
    url: "https://images.unsplash.com/photo-1549366021-9f761d450615?w=800&h=600&fit=crop",
    caption: "Elephants at Chobe National Park",
    category: "Wildlife",
  },
  {
    id: "3",
    url: "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800&h=600&fit=crop",
    caption: "Sunset over the Zambezi River",
    category: "Scenery",
  },
  {
    id: "4",
    url: "https://images.unsplash.com/photo-1540039455722-5dfc077e8af0?w=800&h=600&fit=crop",
    caption: "Bungee jumping from Victoria Falls Bridge",
    category: "Activities",
  },
  {
    id: "5",
    url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop",
    caption: "Royal Livingstone Hotel",
    category: "Accommodation",
  },
  {
    id: "6",
    url: "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=800&h=600&fit=crop",
    caption: "Rainbow over Victoria Falls",
    category: "Scenery",
  },
  {
    id: "7",
    url: "https://images.unsplash.com/photo-1530866495561-507c83091b04?w=800&h=600&fit=crop",
    caption: "White water rafting on the Zambezi",
    category: "Activities",
  },
  {
    id: "8",
    url: "https://images.unsplash.com/photo-1534177616064-76c28f23711e?w=800&h=600&fit=crop",
    caption: "African wild dogs on safari",
    category: "Wildlife",
  },
  {
    id: "9",
    url: "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800&h=600&fit=crop",
    caption: "Bushfront Lodge gardens",
    category: "Accommodation",
  },
  {
    id: "10",
    url: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&h=600&fit=crop",
    caption: "Victoria Falls from the air",
    category: "Scenery",
  },
  {
    id: "11",
    url: "https://images.unsplash.com/photo-1523805009345-7448845a9e53?w=800&h=600&fit=crop",
    caption: "Traditional Zambian village tour",
    category: "Activities",
  },
  {
    id: "12",
    url: "https://images.unsplash.com/photo-1535083783855-76ae62b2914e?w=800&h=600&fit=crop",
    caption: "Hippos in the Zambezi River",
    category: "Wildlife",
  },
  {
    id: "13",
    url: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800&h=600&fit=crop",
    caption: "Luxury tented suite at Thorntree River Lodge",
    category: "Accommodation",
  },
  {
    id: "14",
    url: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&h=600&fit=crop",
    caption: "Camping along the Zambezi",
    category: "Activities",
  },
  {
    id: "15",
    url: "https://images.unsplash.com/photo-1517960413843-0aee8e2b3285?w=800&h=600&fit=crop",
    caption: "Giraffe at Mosi-oa-Tunya National Park",
    category: "Wildlife",
  },
];

async function getGalleryImages() {
  try {
    const { db } = await import("@/lib/db");
    const images = await db.galleryImage.findMany({
      orderBy: { order: "asc" },
    });
    return images.length > 0 ? images : fallbackImages;
  } catch {
    return fallbackImages;
  }
}

export default async function GalleryPage() {
  const images = await getGalleryImages();

  const categories = [
    "All",
    ...Array.from(
      new Set(
        (images as typeof fallbackImages)
          .map((img) => img.category)
          .filter(Boolean)
      )
    ),
  ];

  return (
    <main className="min-h-screen">
      <section className="bg-brand-teal py-16">
        <div className="mx-auto max-w-7xl px-4">
          <h1 className="font-heading text-3xl font-bold text-white sm:text-4xl">
            Photo Gallery
          </h1>
          <p className="mt-2 max-w-2xl text-white/80">
            Explore stunning moments captured during our tours and adventures in
            Livingstone and beyond.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-10">
        <GalleryGrid
          images={images as typeof fallbackImages}
          categories={categories}
        />
      </div>
    </main>
  );
}
