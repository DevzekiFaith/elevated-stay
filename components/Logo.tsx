"use client";

import Link from "next/link";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  href?: string;
  glow?: boolean;
  variant?: "full" | "mark";
}

export function Logo({
  className = "",
  size = "md",
  href = "/",
  glow = true,
  variant = "full",
}: LogoProps) {
  const heightClasses = {
    sm: "h-8",
    md: "h-10 sm:h-11",
    lg: "h-14 sm:h-16",
    xl: "h-20 sm:h-24",
  }[size];

  const markSizeClasses = {
    sm: "w-9 h-9 p-1.5",
    md: "w-12 h-12 p-2",
    lg: "w-16 h-16 p-2.5",
    xl: "w-24 h-24 p-3.5",
  }[size];

  const content =
    variant === "full" ? (
      <div className={`relative inline-flex items-center select-none group ${className}`}>
        {/* Subtle architectural ambient glow */}
        {glow && (
          <div className="absolute inset-0 rounded-2xl bg-[#D4AF37]/15 blur-lg opacity-30 group-hover:opacity-70 transition-opacity duration-500 pointer-events-none" />
        )}
        <div
          className={`relative ${heightClasses} flex items-center justify-center transition-transform duration-300 group-hover:scale-[1.02]`}
        >
          {/* Light Mode Logo (Original High-Contrast Dark Navy + Gold) */}
          <img
            src="/logo-full.png"
            alt="Elevated Stay — Curated Spaces. Seamless Living."
            className="logo-light-version h-full w-auto object-contain drop-shadow-sm"
          />
          {/* Dark Mode Logo (Crisp Alabaster White + Gold) */}
          <img
            src="/logo-full-dark.png"
            alt="Elevated Stay — Curated Spaces. Seamless Living."
            className="logo-dark-version h-full w-auto object-contain filter drop-shadow-[0_2px_12px_rgba(212,175,55,0.25)]"
          />
        </div>
      </div>
    ) : (
      <div className={`relative inline-flex items-center justify-center select-none group ${className}`}>
        {glow && (
          <div className="absolute inset-0 rounded-2xl bg-[#D4AF37]/15 blur-lg opacity-40 group-hover:opacity-80 transition-opacity duration-500 pointer-events-none" />
        )}
        <div
          className={`relative ${markSizeClasses} rounded-2xl overflow-hidden border border-[#D4AF37]/35 bg-gradient-to-b from-[#141A24] to-[#0A0D14] shadow-xl group-hover:border-[#D4AF37] transition-all duration-300 flex items-center justify-center`}
        >
          <img
            src="/logo-mark-transparent.png"
            alt="Elevated Stay Architectural Insignia"
            className="logo-light-version w-full h-full object-contain filter drop-shadow-[0_2px_8px_rgba(212,175,55,0.3)] group-hover:scale-105 transition-transform duration-300"
          />
          <img
            src="/logo-mark-dark.png"
            alt="Elevated Stay Architectural Insignia"
            className="logo-dark-version w-full h-full object-contain filter drop-shadow-[0_2px_8px_rgba(212,175,55,0.4)] group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      </div>
    );

  if (href) {
    return (
      <Link href={href} aria-label="Elevated Stay Home" className="inline-block">
        {content}
      </Link>
    );
  }

  return content;
}
