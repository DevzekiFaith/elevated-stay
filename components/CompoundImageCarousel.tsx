"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Camera } from "lucide-react";

interface CompoundImageCarouselProps {
  images?: string[];
  fallbackImage: string;
  compoundName: string;
  className?: string;
  children?: React.ReactNode;
}

export function CompoundImageCarousel({
  images,
  fallbackImage,
  compoundName,
  className = "h-48 sm:h-52",
  children,
}: CompoundImageCarouselProps) {
  const imageList = images && images.length > 0 ? images : [fallbackImage];
  const [currentIndex, setCurrentIndex] = useState(0);

  const hasMultiple = imageList.length > 1;

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setCurrentIndex((prev) => (prev === 0 ? imageList.length - 1 : prev - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setCurrentIndex((prev) => (prev === imageList.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className={`relative overflow-hidden group select-none bg-slate-900 ${className}`}>
      {/* Current Slide Image */}
      <img
        src={imageList[currentIndex] || fallbackImage}
        alt={`${compoundName} view ${currentIndex + 1}`}
        className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        loading="lazy"
      />

      {/* Subtle Dark Gradient Overlay for Badges & Contrast */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/60 pointer-events-none" />

      {/* Photo Counter Pill (shown if multiple images) */}
      {hasMultiple && (
        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/80 backdrop-blur-md text-[10px] font-mono text-[#DFCA9E] border border-[#D4AF37]/35 shadow-md font-semibold">
            <Camera className="w-3 h-3 text-[#D4AF37]" />
            <span>
              {currentIndex + 1} of {imageList.length}
            </span>
          </span>
        </div>
      )}

      {/* Navigation Arrows (Visible if multiple images) */}
      {hasMultiple && (
        <>
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Previous building photo"
            className="absolute left-2.5 top-1/2 -translate-y-1/2 z-30 p-1.5 rounded-full bg-black/75 hover:bg-[#D4AF37] text-white hover:text-[#0A0D12] border border-white/20 hover:border-[#D4AF37] transition opacity-0 group-hover:opacity-100 shadow-xl active:scale-90"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={handleNext}
            aria-label="Next building photo"
            className="absolute right-2.5 top-1/2 -translate-y-1/2 z-30 p-1.5 rounded-full bg-black/75 hover:bg-[#D4AF37] text-white hover:text-[#0A0D12] border border-white/20 hover:border-[#D4AF37] transition opacity-0 group-hover:opacity-100 shadow-xl active:scale-90"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </>
      )}

      {/* Pagination Dots (Bottom Center) */}
      {hasMultiple && (
        <div className="absolute bottom-9 inset-x-0 z-20 flex items-center justify-center gap-1.5 pointer-events-auto">
          {imageList.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                setCurrentIndex(idx);
              }}
              aria-label={`Go to photo ${idx + 1}`}
              className={`h-1.5 rounded-full transition-all ${
                idx === currentIndex
                  ? "w-4 bg-[#D4AF37] shadow-sm shadow-[#D4AF37]/50"
                  : "w-1.5 bg-white/40 hover:bg-white/70"
              }`}
            />
          ))}
        </div>
      )}

      {/* Overlay Children (e.g. Code Badge, City, Trash, Occupancy Strip) */}
      {children}
    </div>
  );
}
