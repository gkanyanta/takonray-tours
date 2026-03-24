import { Card, CardContent } from "@/components/ui/card";
import { StarRating } from "@/components/star-rating";
import { Quote } from "lucide-react";

interface ReviewCardProps {
  review: {
    id: string;
    rating: number;
    comment: string;
    createdAt: Date | string;
    user: {
      name: string | null;
      image: string | null;
    };
  };
}

export function ReviewCard({ review }: ReviewCardProps) {
  const initials = (review.user.name || "Guest")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const date = new Date(review.createdAt);

  return (
    <Card className="h-full">
      <CardContent className="flex flex-col gap-4">
        <Quote className="size-8 text-brand-amber/30" />
        <p className="flex-1 text-sm leading-relaxed text-muted-foreground">
          &ldquo;{review.comment}&rdquo;
        </p>
        <div className="flex items-center gap-3 pt-2">
          <div className="flex size-10 items-center justify-center rounded-full bg-brand-teal text-sm font-semibold text-white">
            {review.user.image ? (
              <img
                src={review.user.image}
                alt={review.user.name || "Guest"}
                className="size-10 rounded-full object-cover"
              />
            ) : (
              initials
            )}
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">{review.user.name || "Guest"}</p>
            <StarRating rating={review.rating} size="sm" />
          </div>
          <time className="text-xs text-muted-foreground">
            {date.toLocaleDateString("en-US", {
              month: "short",
              year: "numeric",
            })}
          </time>
        </div>
      </CardContent>
    </Card>
  );
}
