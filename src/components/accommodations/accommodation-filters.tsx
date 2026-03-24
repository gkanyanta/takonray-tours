"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SlidersHorizontal, X } from "lucide-react";

const types = [
  { label: "Hotel", value: "hotel" },
  { label: "Lodge", value: "lodge" },
  { label: "Guesthouse", value: "guesthouse" },
  { label: "Camping", value: "camping" },
  { label: "Resort", value: "resort" },
];

const ratings = [
  { label: "4+ Stars", value: "4" },
  { label: "3+ Stars", value: "3" },
];

export function AccommodationFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const activeType = searchParams.get("type") || "";
  const activeRating = searchParams.get("rating") || "";

  const updateFilter = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (params.get(key) === value) {
        params.delete(key);
      } else {
        params.set(key, value);
      }
      router.push(`/accommodations?${params.toString()}`);
    },
    [router, searchParams]
  );

  const clearFilters = () => {
    router.push("/accommodations");
  };

  const hasFilters = activeType || activeRating;

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

      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Type
        </p>
        <div className="flex flex-wrap gap-2">
          {types.map((type) => (
            <Badge
              key={type.value}
              className={`cursor-pointer transition-colors ${
                activeType === type.value
                  ? "bg-brand-teal text-white"
                  : "bg-muted text-muted-foreground hover:bg-brand-teal/10"
              }`}
              onClick={() => updateFilter("type", type.value)}
            >
              {type.label}
            </Badge>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Rating
        </p>
        <div className="flex flex-wrap gap-2">
          {ratings.map((r) => (
            <Badge
              key={r.value}
              className={`cursor-pointer transition-colors ${
                activeRating === r.value
                  ? "bg-brand-amber text-white"
                  : "bg-muted text-muted-foreground hover:bg-brand-amber/10"
              }`}
              onClick={() => updateFilter("rating", r.value)}
            >
              {r.label}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
}
