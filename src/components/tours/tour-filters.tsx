"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SlidersHorizontal, X } from "lucide-react";

interface TourFiltersProps {
  categories: { id: string; name: string; slug: string }[];
}

const difficulties = ["Easy", "Moderate", "Challenging", "Extreme"];
const durations = [
  { label: "Under 3 hours", value: "short" },
  { label: "Half Day", value: "half" },
  { label: "Full Day", value: "full" },
  { label: "Multi-Day", value: "multi" },
];

export function TourFilters({ categories }: TourFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const activeCategory = searchParams.get("category") || "";
  const activeDifficulty = searchParams.get("difficulty") || "";
  const activeDuration = searchParams.get("duration") || "";

  const updateFilter = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (params.get(key) === value) {
        params.delete(key);
      } else {
        params.set(key, value);
      }
      router.push(`/tours?${params.toString()}`);
    },
    [router, searchParams]
  );

  const clearFilters = () => {
    router.push("/tours");
  };

  const hasFilters = activeCategory || activeDifficulty || activeDuration;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-medium text-brand-charcoal">
          <SlidersHorizontal className="size-4" />
          Filters
        </div>
        {hasFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            <X className="size-3" />
            Clear all
          </Button>
        )}
      </div>

      {/* Categories */}
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Category
        </p>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <Badge
              key={cat.id}
              className={`cursor-pointer transition-colors ${
                activeCategory === cat.slug
                  ? "bg-brand-teal text-white"
                  : "bg-muted text-muted-foreground hover:bg-brand-teal/10"
              }`}
              onClick={() => updateFilter("category", cat.slug)}
            >
              {cat.name}
            </Badge>
          ))}
        </div>
      </div>

      {/* Difficulty */}
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Difficulty
        </p>
        <div className="flex flex-wrap gap-2">
          {difficulties.map((diff) => (
            <Badge
              key={diff}
              className={`cursor-pointer transition-colors ${
                activeDifficulty === diff
                  ? "bg-brand-amber text-white"
                  : "bg-muted text-muted-foreground hover:bg-brand-amber/10"
              }`}
              onClick={() => updateFilter("difficulty", diff)}
            >
              {diff}
            </Badge>
          ))}
        </div>
      </div>

      {/* Duration */}
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Duration
        </p>
        <div className="flex flex-wrap gap-2">
          {durations.map((dur) => (
            <Badge
              key={dur.value}
              className={`cursor-pointer transition-colors ${
                activeDuration === dur.value
                  ? "bg-brand-teal text-white"
                  : "bg-muted text-muted-foreground hover:bg-brand-teal/10"
              }`}
              onClick={() => updateFilter("duration", dur.value)}
            >
              {dur.label}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
}
