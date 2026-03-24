import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StarRating } from "@/components/star-rating";
import { MapPin, Wifi, Car, Coffee, ArrowRight } from "lucide-react";
import { formatPrice, type Currency } from "@/lib/pricing";

const amenityIcons: Record<string, React.ReactNode> = {
  wifi: <Wifi className="size-4" />,
  parking: <Car className="size-4" />,
  breakfast: <Coffee className="size-4" />,
};

interface AccommodationCardProps {
  accommodation: {
    id: string;
    name: string;
    slug: string;
    description: string;
    type: string;
    address?: string | null;
    amenities: string[];
    images: string[];
    rating?: number | null;
    featured: boolean;
    roomTypes: {
      pricing: {
        price: number;
      }[];
    }[];
    reviews: {
      rating: number;
    }[];
  };
  currency?: Currency;
}

export function AccommodationCard({
  accommodation,
  currency = "USD",
}: AccommodationCardProps) {
  const allPrices = accommodation.roomTypes.flatMap((rt) =>
    rt.pricing.map((p) => p.price)
  );
  const lowestPrice = allPrices.length > 0 ? Math.min(...allPrices) : null;

  const avgRating =
    accommodation.reviews.length > 0
      ? accommodation.reviews.reduce((sum, r) => sum + r.rating, 0) /
        accommodation.reviews.length
      : accommodation.rating || 0;

  const placeholderImage =
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&h=400&fit=crop";

  const typeLabels: Record<string, string> = {
    lodge: "Lodge",
    hotel: "Hotel",
    guesthouse: "Guesthouse",
    camping: "Camping",
    resort: "Resort",
  };

  return (
    <Card className="group overflow-hidden transition-shadow hover:shadow-lg">
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={accommodation.images[0] || placeholderImage}
          alt={accommodation.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute left-3 top-3">
          <Badge className="bg-brand-amber text-white">
            {typeLabels[accommodation.type] || accommodation.type}
          </Badge>
        </div>
        {accommodation.featured && (
          <div className="absolute right-3 top-3">
            <Badge className="bg-brand-teal text-white">Featured</Badge>
          </div>
        )}
      </div>
      <CardContent className="flex flex-col gap-3">
        <div>
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-heading text-lg font-semibold leading-tight text-brand-charcoal">
              {accommodation.name}
            </h3>
            {avgRating > 0 && <StarRating rating={avgRating} size="sm" />}
          </div>
          {accommodation.address && (
            <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
              <MapPin className="size-3" />
              {accommodation.address}
            </p>
          )}
        </div>
        <p className="line-clamp-2 text-sm text-muted-foreground">
          {accommodation.description}
        </p>
        {accommodation.amenities.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {accommodation.amenities.slice(0, 4).map((amenity) => (
              <span
                key={amenity}
                className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground"
              >
                {amenityIcons[amenity.toLowerCase()] || null}
                {amenity}
              </span>
            ))}
            {accommodation.amenities.length > 4 && (
              <span className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                +{accommodation.amenities.length - 4} more
              </span>
            )}
          </div>
        )}
        <div className="flex items-center justify-between border-t pt-3">
          {lowestPrice !== null ? (
            <div>
              <span className="text-xs text-muted-foreground">From</span>
              <p className="text-lg font-bold text-brand-teal">
                {formatPrice(lowestPrice, currency)}
                <span className="text-xs font-normal text-muted-foreground">
                  /night
                </span>
              </p>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Contact for pricing</p>
          )}
        </div>
        <Link href={`/accommodations/${accommodation.slug}`}>
          <Button
            className="w-full bg-brand-teal hover:bg-brand-teal-600"
            size="lg"
          >
            View Details
            <ArrowRight className="size-4" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
