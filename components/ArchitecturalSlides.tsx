"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, ShieldCheck, MapPin, Building, Clock, ArrowRight } from "lucide-react";
import { formatNaira } from "@/lib/payment-split";
import Link from "next/link";

interface SlideData {
  id: string;
  name: string;
  code: string;
  location: string;
  city: "Lagos" | "Abuja";
  headline: string;
  subheading: string;
  escrowBalance: number;
  escrowBank: string;
  quietHours: string;
  unitsOccupancy: string;
  image: string;
  tag: string;
}

const SLIDES: SlideData[] = [
  {
    id: "slide-1",
    name: "The Obsidian Courtyard",
    code: "OBS-RES",
    location: "Prime Residential Enclave, Lagos",
    city: "Lagos",
    headline: "Ultra-Quiet Residential Sanctuary",
    subheading: "4-bedroom penthouses with private keycard elevator access, 24/7 de-ionized water reverse osmosis, and soundproof double-glazed envelopes.",
    escrowBalance: 0,
    escrowBank: "Standard Chartered Bank (Escrow)",
    quietHours: "22:00 – 07:00 WAT",
    unitsOccupancy: "Grade-A Residential Enclave",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=85",
    tag: "Iconic Compound",
  },
  {
    id: "slide-2",
    name: "Aura Residence & Terraces",
    code: "AUR-RES",
    location: "Waterfront Residential Enclave, Lagos",
    city: "Lagos",
    headline: "Waterfront Serenity & Dedicated Microgrid",
    subheading: "Private jetty, 60kVA lithium-ion solar hybrid array, and automated Paystack subaccount split disbursements directly to institutional diaspora landlords.",
    escrowBalance: 0,
    escrowBank: "Guaranty Trust Bank (Private Banking Escrow)",
    quietHours: "22:00 – 07:00 WAT",
    unitsOccupancy: "Waterfront Microgrid Active",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=85",
    tag: "Waterfront Compound",
  },
  {
    id: "slide-3",
    name: "Diplomatic Enclave Residences",
    code: "DIP-ABJ",
    location: "Diplomatic Zone, Abuja",
    city: "Abuja",
    headline: "Diplomatic-Grade Security & Passive Asset Oversight",
    subheading: "Executive ambassador residences, biometric gate barrier passcodes, zero public directory disclosure, and audited quarterly preventive lifecycle overhauls.",
    escrowBalance: 0,
    escrowBank: "Zenith Bank (Prestige Escrow)",
    quietHours: "22:00 – 07:00 WAT",
    unitsOccupancy: "Diplomatic Security Protocol",
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=85",
    tag: "Diplomatic Compound",
  },
];

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? "100%" : "-100%",
    opacity: 0,
    scale: 0.98,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
    scale: 1,
    transition: {
      x: { type: "spring" as const, stiffness: 280, damping: 32 },
      opacity: { duration: 0.4 },
      scale: { duration: 0.5 },
    },
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? "100%" : "-100%",
    opacity: 0,
    scale: 0.98,
    transition: {
      x: { type: "spring" as const, stiffness: 280, damping: 32 },
      opacity: { duration: 0.3 },
    },
  }),
};

export function ArchitecturalSlides() {
  const [[page, direction], setPage] = useState([0, 0]);
  const [isPaused, setIsPaused] = useState(false);

  const currentSlideIndex = ((page % SLIDES.length) + SLIDES.length) % SLIDES.length;
  const slide = SLIDES[currentSlideIndex];

  const paginate = (newDirection: number) => {
    setPage([page + newDirection, newDirection]);
  };

  // Auto advance every 6.5s if not paused
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      paginate(1);
    }, 6500);
    return () => clearInterval(interval);
  }, [page, isPaused]);

  return (
    <div
      className="relative w-full overflow-hidden rounded-3xl border border-white/[0.08] bg-[#0E131C] shadow-2xl"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Slides Container */}
      <div className="relative h-[480px] sm:h-[540px] lg:h-[600px] w-full">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={page}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="absolute inset-0 w-full h-full"
          >
            {/* Background Image with Architectural Gradient Overlay */}
            <div className="absolute inset-0">
              <img
                src={slide.image}
                alt={slide.name}
                className="w-full h-full object-cover object-center filter brightness-[0.65] contrast-[1.08] slide-image"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0D12] via-[#0A0D12]/85 to-black/40 slide-overlay-t" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#0A0D12] via-[#0A0D12]/70 to-transparent slide-overlay-r" />
            </div>

            {/* Slide Content Overlay */}
            <div className="relative h-full max-w-7xl mx-auto px-5 sm:px-10 lg:px-12 flex flex-col justify-end pb-8 sm:pb-12 z-10">
              <div className="max-w-2xl space-y-3.5 text-left p-6 sm:p-7 rounded-2xl bg-[#0A0D12]/85 sm:bg-[#0A0D12]/75 backdrop-blur-md border border-white/10 slide-content-box shadow-2xl">
                {/* Meta Badges */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-[10px] font-mono tracking-wider bg-[#C2A774]/25 text-[#DFCA9E] border border-[#C2A774]/40 uppercase font-semibold slide-badge-gold">
                    {slide.tag}
                  </span>
                  <span className="px-3 py-1 rounded-full text-[10px] font-mono bg-white/10 text-white border border-white/15 slide-badge-dark">
                    {slide.city} · {slide.code}
                  </span>
                  <span className="hidden sm:inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-mono bg-[#D4AF37]/15 text-[#DFCA9E] border border-[#D4AF37]/30 slide-badge-gold">
                    <ShieldCheck className="w-3 h-3 text-[#D4AF37]" /> {slide.unitsOccupancy}
                  </span>
                </div>

                {/* Compound Title */}
                <div>
                  <h3 className="text-2xl sm:text-4xl font-bold tracking-tight text-white font-sans slide-title">
                    {slide.name}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-neutral-300 mt-1 slide-location">
                    <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>{slide.location}</span>
                  </div>
                </div>

                {/* Subtitle */}
                <p className="text-xs sm:text-sm text-neutral-200 leading-relaxed font-normal line-clamp-3 slide-subheading">
                  {slide.subheading}
                </p>

                {/* Financial Escrow & Peace Readout */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                  <div className="p-3 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 text-xs slide-stat-card">
                    <span className="text-[10px] text-neutral-400 font-mono block slide-stat-label">Compound Facility Escrow</span>
                    <span className="font-mono font-bold text-white text-sm slide-stat-value">
                      {slide.escrowBalance > 0 ? formatNaira(slide.escrowBalance) : "100% Ring-Fenced"}
                    </span>
                    <span className="text-[9px] text-neutral-400 block truncate slide-stat-sub">{slide.escrowBank}</span>
                  </div>

                  <div className="p-3 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 text-xs slide-stat-card">
                    <span className="text-[10px] text-neutral-400 font-mono block slide-stat-label">Contractual Quiet Hours</span>
                    <span className="font-mono font-bold text-[#DFCA9E] text-sm flex items-center gap-1 slide-stat-gold">
                      <Clock className="w-3.5 h-3.5 text-[#D4AF37]" /> 22:00 – 07:00
                    </span>
                    <span className="text-[9px] text-neutral-400 block slide-stat-sub">Strict Annexure Rule</span>
                  </div>

                  <div className="hidden sm:block p-3 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 text-xs slide-stat-card">
                    <span className="text-[10px] text-neutral-400 font-mono block slide-stat-label">Tenant Interface</span>
                    <span className="font-mono font-bold text-[#DFCA9E] text-sm slide-stat-gold">Headless Gate</span>
                    <span className="text-[9px] text-neutral-400 block slide-stat-sub">1-Click WhatsApp Passes</span>
                  </div>
                </div>

                {/* Portal Link (Responsive & clean) */}
                <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                  <Link
                    href="/landlord"
                    className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#D4AF37] hover:bg-[#E5C158] text-[#0A0D12] text-xs font-bold shadow-md shadow-[#D4AF37]/20 transition active:scale-98"
                  >
                    <span className="hidden sm:inline">Inspect Compound Oversight</span>
                    <span className="sm:hidden">Inspect Compound</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#0A0D12]" />
                  </Link>

                  <Link
                    href="/resident"
                    className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white/[0.04] hover:bg-[#D4AF37]/15 text-white hover:text-[#DFCA9E] text-xs font-medium backdrop-blur-md transition border border-white/10 hover:border-[#D4AF37]/30 active:scale-98"
                  >
                    <span>Resident Portal</span>
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Slide Navigation Buttons */}
      <div className="absolute top-6 right-6 z-20 flex items-center gap-2">
        <button
          onClick={() => paginate(-1)}
          className="w-10 h-10 rounded-full bg-black/50 hover:bg-black/80 backdrop-blur-md border border-white/15 flex items-center justify-center text-white transition hover:scale-105 slide-nav-btn"
          aria-label="Previous Slide"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={() => paginate(1)}
          className="w-10 h-10 rounded-full bg-black/50 hover:bg-black/80 backdrop-blur-md border border-white/15 flex items-center justify-center text-white transition hover:scale-105 slide-nav-btn"
          aria-label="Next Slide"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Bottom Thumbnails & Dots */}
      <div className="absolute bottom-4 right-6 z-20 hidden sm:flex items-center gap-2">
        {SLIDES.map((s, idx) => (
          <button
            key={s.id}
            onClick={() => {
              const diff = idx - currentSlideIndex;
              if (diff !== 0) paginate(diff);
            }}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              idx === currentSlideIndex
                ? "w-8 bg-[#C2A774] slide-dot-active"
                : "w-2 bg-white/30 hover:bg-white/60 slide-dot-inactive"
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
