"use client";

import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
  {
    image:
      "https://images.unsplash.com/photo-1568625502763-2a5ec6a94c47?w=1920&h=1080&fit=crop",
    title: "Victoria Falls",
    subtitle: "The Smoke That Thunders",
  },
  {
    image:
      "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1920&h=1080&fit=crop",
    title: "Zambezi Sunset Cruises",
    subtitle: "Golden Evenings on the River",
  },
  {
    image:
      "https://images.unsplash.com/photo-1549366021-9f761d450615?w=1920&h=1080&fit=crop",
    title: "Wildlife Safaris",
    subtitle: "Chobe & Mosi-oa-Tunya Game Drives",
  },
  {
    image:
      "https://images.unsplash.com/photo-1540039455722-5dfc077e8af0?w=1920&h=1080&fit=crop",
    title: "Bungee Jumping",
    subtitle: "111m Above the Zambezi Gorge",
  },
  {
    image:
      "https://images.unsplash.com/photo-1530866495561-507c83091b04?w=1920&h=1080&fit=crop",
    title: "White Water Rafting",
    subtitle: "Grade 5 Rapids on the Zambezi",
  },
  {
    image:
      "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=1920&h=1080&fit=crop",
    title: "Scenic Wonders",
    subtitle: "Rainbows Over the Falls",
  },
];

export function HeroSlideshow() {
  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const goTo = useCallback(
    (index: number) => {
      if (isTransitioning) return;
      setIsTransitioning(true);
      setCurrent(index);
      setTimeout(() => setIsTransitioning(false), 800);
    },
    [isTransitioning]
  );

  const next = useCallback(() => {
    goTo((current + 1) % slides.length);
  }, [current, goTo]);

  const prev = useCallback(() => {
    goTo((current - 1 + slides.length) % slides.length);
  }, [current, goTo]);

  // Auto-advance every 6 seconds
  useEffect(() => {
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [next]);

  return (
    <div className="absolute inset-0">
      {/* Slides */}
      {slides.map((slide, i) => (
        <div
          key={i}
          className="absolute inset-0 transition-all duration-[1200ms] ease-in-out"
          style={{
            opacity: i === current ? 1 : 0,
            transform: i === current ? "scale(1)" : "scale(1.08)",
          }}
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url('${slide.image}')` }}
          />
        </div>
      ))}

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />

      {/* Slide caption - bottom left */}
      <div className="absolute bottom-32 left-8 z-20 hidden md:block">
        <div
          className="overflow-hidden"
          key={current}
        >
          <p
            className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-400"
            style={{
              animation: "slideUp 0.6s ease-out forwards",
            }}
          >
            {slides[current].subtitle}
          </p>
          <h3
            className="mt-1 font-heading text-2xl font-bold text-white/90"
            style={{
              animation: "slideUp 0.6s ease-out 0.1s forwards",
              opacity: 0,
            }}
          >
            {slides[current].title}
          </h3>
        </div>
      </div>

      {/* Navigation arrows */}
      <button
        onClick={prev}
        className="absolute left-4 top-1/2 z-20 -translate-y-1/2 rounded-full border border-white/20 bg-black/20 p-2.5 text-white/80 backdrop-blur-sm transition-all hover:border-white/40 hover:bg-black/40 hover:text-white md:left-8 md:p-3"
        aria-label="Previous slide"
      >
        <ChevronLeft className="size-5 md:size-6" />
      </button>
      <button
        onClick={next}
        className="absolute right-4 top-1/2 z-20 -translate-y-1/2 rounded-full border border-white/20 bg-black/20 p-2.5 text-white/80 backdrop-blur-sm transition-all hover:border-white/40 hover:bg-black/40 hover:text-white md:right-8 md:p-3"
        aria-label="Next slide"
      >
        <ChevronRight className="size-5 md:size-6" />
      </button>

      {/* Dot indicators */}
      <div className="absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className="group relative h-2.5 transition-all duration-300"
            style={{ width: i === current ? "2rem" : "0.625rem" }}
            aria-label={`Go to slide ${i + 1}`}
          >
            <span
              className="absolute inset-0 rounded-full transition-all duration-300"
              style={{
                backgroundColor: i === current ? "#D97706" : "rgba(255,255,255,0.4)",
              }}
            />
            {/* Progress bar inside active dot */}
            {i === current && (
              <span
                className="absolute inset-y-0 left-0 rounded-full bg-amber-400"
                style={{
                  animation: "progress 6s linear forwards",
                }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Slide counter */}
      <div className="absolute bottom-8 right-8 z-20 hidden items-center gap-2 text-sm text-white/60 md:flex">
        <span className="text-lg font-semibold text-white">
          {String(current + 1).padStart(2, "0")}
        </span>
        <span className="text-white/40">/</span>
        <span>{String(slides.length).padStart(2, "0")}</span>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes slideUp {
          from {
            transform: translateY(1.5rem);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        @keyframes progress {
          from {
            width: 0%;
          }
          to {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
