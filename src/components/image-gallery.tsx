"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ImageGalleryProps {
  images: string[];
  alt: string;
  placeholderImage?: string;
}

export function ImageGallery({
  images,
  alt,
  placeholderImage = "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1200&h=800&fit=crop",
}: ImageGalleryProps) {
  const allImages = images.length > 0 ? images : [placeholderImage];
  const [selectedIndex, setSelectedIndex] = useState(0);

  const goToPrevious = () => {
    setSelectedIndex((prev) =>
      prev === 0 ? allImages.length - 1 : prev - 1
    );
  };

  const goToNext = () => {
    setSelectedIndex((prev) =>
      prev === allImages.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="relative aspect-[16/9] overflow-hidden rounded-xl bg-muted">
        <img
          src={allImages[selectedIndex]}
          alt={`${alt} - Image ${selectedIndex + 1}`}
          className="h-full w-full object-cover"
        />
        {allImages.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="icon"
              onClick={goToPrevious}
              className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/40 text-white hover:bg-black/60"
            >
              <ChevronLeft className="size-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={goToNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/40 text-white hover:bg-black/60"
            >
              <ChevronRight className="size-5" />
            </Button>
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2">
              <span className="rounded-full bg-black/50 px-3 py-1 text-xs text-white">
                {selectedIndex + 1} / {allImages.length}
              </span>
            </div>
          </>
        )}
      </div>
      {allImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {allImages.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedIndex(index)}
              className={cn(
                "relative h-16 w-24 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-all",
                index === selectedIndex
                  ? "border-brand-teal ring-2 ring-brand-teal/20"
                  : "border-transparent opacity-70 hover:opacity-100"
              )}
            >
              <img
                src={image}
                alt={`${alt} thumbnail ${index + 1}`}
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
