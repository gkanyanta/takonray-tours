import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StarRating } from "@/components/star-rating";
import { Clock, Users, ArrowRight, MapPin } from "lucide-react";
import { formatPrice, type Currency } from "@/lib/pricing";

interface TourCardProps {
  tour: {
    id: string;
    name: string;
    slug: string;
    description: string;
    duration: string;
    maxGroupSize: number;
    difficulty?: string | null;
    images: string[];
    featured: boolean;
    category: {
      name: string;
      slug: string;
    };
    pricing: {
      price: number;
    }[];
    reviews: {
      rating: number;
    }[];
  };
  currency?: Currency;
}

export function TourCard({ tour, currency = "USD" }: TourCardProps) {
  const lowestPrice =
    tour.pricing.length > 0
      ? Math.min(...tour.pricing.map((p) => p.price))
      : null;

  const avgRating =
    tour.reviews.length > 0
      ? tour.reviews.reduce((sum, r) => sum + r.rating, 0) / tour.reviews.length
      : 0;

  const placeholderImage =
    "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=600&h=400&fit=crop";

  return (
    <Card className="group overflow-hidden transition-shadow hover:shadow-lg">
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={tour.images[0] || placeholderImage}
          alt={tour.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute left-3 top-3">
          <Badge className="bg-brand-teal text-white">
            {tour.category.name}
          </Badge>
        </div>
        {tour.featured && (
          <div className="absolute right-3 top-3">
            <Badge className="bg-brand-amber text-white">Featured</Badge>
          </div>
        )}
      </div>
      <CardContent className="flex flex-col gap-3">
        <div>
          <h3 className="font-heading text-lg font-semibold leading-tight text-brand-charcoal">
            {tour.name}
          </h3>
          <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
            {tour.description}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <Clock className="size-4" />
            {tour.duration}
          </span>
          <span className="flex items-center gap-1">
            <Users className="size-4" />
            Max {tour.maxGroupSize}
          </span>
          {tour.difficulty && (
            <span className="flex items-center gap-1">
              <MapPin className="size-4" />
              {tour.difficulty}
            </span>
          )}
        </div>
        <div className="flex items-center justify-between border-t pt-3">
          <div>
            {lowestPrice !== null ? (
              <div>
                <span className="text-xs text-muted-foreground">From</span>
                <p className="text-lg font-bold text-brand-teal">
                  {formatPrice(lowestPrice, currency)}
                </p>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Contact for pricing</p>
            )}
          </div>
          <div className="flex items-center gap-2">
            {avgRating > 0 && (
              <StarRating rating={avgRating} size="sm" showValue />
            )}
          </div>
        </div>
        <Link href={`/tours/${tour.slug}`}>
          <Button className="w-full bg-brand-teal hover:bg-brand-teal-600" size="lg">
            View Details
            <ArrowRight className="size-4" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
