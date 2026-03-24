"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

interface GalleryImage {
  id: string;
  url: string;
  caption?: string | null;
  category?: string | null;
}

interface GalleryGridProps {
  images: GalleryImage[];
  categories: string[];
}

export function GalleryGrid({ images, categories }: GalleryGridProps) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filtered =
    activeCategory === "All"
      ? images
      : images.filter((img) => img.category === activeCategory);

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);

  const goToPrev = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex(
      lightboxIndex === 0 ? filtered.length - 1 : lightboxIndex - 1
    );
  };

  const goToNext = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex(
      lightboxIndex === filtered.length - 1 ? 0 : lightboxIndex + 1
    );
  };

  return (
    <>
      {/* Filter Tabs */}
      <div className="mb-8 flex flex-wrap gap-2">
        {categories.map((cat) => (
          <Badge
            key={cat}
            className={`cursor-pointer px-4 py-1.5 text-sm transition-colors ${
              activeCategory === cat
                ? "bg-brand-teal text-white"
                : "bg-muted text-muted-foreground hover:bg-brand-teal/10"
            }`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </Badge>
        ))}
      </div>

      {/* Image Grid */}
      <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
        {filtered.map((image, index) => (
          <div
            key={image.id}
            className="mb-4 cursor-pointer overflow-hidden rounded-xl break-inside-avoid"
            onClick={() => openLightbox(index)}
          >
            <div className="group relative">
              <img
                src={image.url}
                alt={image.caption || "Gallery image"}
                className="w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100">
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  {image.caption && (
                    <p className="text-sm font-medium text-white">
                      {image.caption}
                    </p>
                  )}
                  {image.category && (
                    <span className="mt-1 inline-block rounded-full bg-brand-teal/80 px-2 py-0.5 text-xs text-white">
                      {image.category}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="py-20 text-center">
          <p className="text-muted-foreground">
            No images found in this category.
          </p>
        </div>
      )}

      {/* Lightbox Dialog */}
      <Dialog
        open={lightboxIndex !== null}
        onOpenChange={(open) => {
          if (!open) closeLightbox();
        }}
      >
        <DialogContent className="max-w-4xl border-none bg-black/95 p-0 sm:max-w-4xl">
          <DialogTitle className="sr-only">Gallery Image Viewer</DialogTitle>
          <DialogDescription className="sr-only">
            View gallery images in full size
          </DialogDescription>
          {lightboxIndex !== null && filtered[lightboxIndex] && (
            <div className="relative">
              <img
                src={filtered[lightboxIndex].url}
                alt={filtered[lightboxIndex].caption || "Gallery image"}
                className="max-h-[80vh] w-full object-contain"
              />
              {filtered[lightboxIndex].caption && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                  <p className="text-lg text-white">
                    {filtered[lightboxIndex].caption}
                  </p>
                </div>
              )}
              {filtered.length > 1 && (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      goToPrev();
                    }}
                    className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/40 text-white hover:bg-black/60"
                  >
                    <ChevronLeft className="size-6" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      goToNext();
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/40 text-white hover:bg-black/60"
                  >
                    <ChevronRight className="size-6" />
                  </Button>
                </>
              )}
              <div className="absolute right-3 top-3 text-xs text-white/70">
                {lightboxIndex + 1} / {filtered.length}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
