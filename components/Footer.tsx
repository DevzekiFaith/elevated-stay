"use client";

import Link from "next/link";
import { MapPin, Lock, ShieldCheck, Mail, ArrowUpRight } from "lucide-react";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="w-full border-t border-white/[0.08] bg-[#07090D] text-neutral-400 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-12 pb-14 border-b border-white/[0.06]">
          {/* Brand Info (5 cols) */}
          <div className="md:col-span-5 space-y-5">
            <Logo size="lg" />
            <p className="text-xs sm:text-[13px] text-neutral-300 leading-relaxed max-w-md font-normal">
              The turnkey residential management and Asset Lifecycle Protection arm of{" "}
              <strong className="text-white font-medium">Elevation Studio</strong>. Dedicated to preserving capital value,
              structural longevity, and tranquil communal peace across high-value family compounds.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono text-[#DFCA9E] bg-[#C2A774]/10 border border-[#C2A774]/20">
                <ShieldCheck className="w-3.5 h-3.5 text-[#C2A774]" />
                Ringfenced Facility Escrows
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono text-neutral-300 bg-white/[0.04] border border-white/[0.08]">
                Bespoke Concierge & Maintenance
              </span>
            </div>
          </div>

          {/* Quick Links / Portals (2 cols) */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-white font-semibold text-xs tracking-wider uppercase font-sans">
              Portals
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link
                  href="/landlord"
                  className="text-neutral-400 hover:text-[#DFCA9E] transition flex items-center gap-1 group py-0.5"
                >
                  <span>Landlord Oversight</span>
                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link
                  href="/resident"
                  className="text-neutral-400 hover:text-[#DFCA9E] transition flex items-center gap-1 group py-0.5"
                >
                  <span>Resident Hub</span>
                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <span className="text-neutral-500 py-0.5 block">Annexure Regulations</span>
              </li>
            </ul>
          </div>

          {/* Locations (2 cols) */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-white font-semibold text-xs tracking-wider uppercase font-sans">
              Operational Hubs
            </h4>
            <ul className="space-y-2.5 text-xs text-neutral-400">
              <li className="flex items-start gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#C2A774] shrink-0 mt-0.5" />
                <span>Lagos: Ikoyi, Banana Is. & Eko Atlantic</span>
              </li>
              <li className="flex items-start gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#C2A774] shrink-0 mt-0.5" />
                <span>Abuja FCT: Maitama & Asokoro</span>
              </li>
              <li className="flex items-start gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#C2A774] shrink-0 mt-0.5" />
                <span>Rivers: Port Harcourt (Old GRA)</span>
              </li>
              <li className="flex items-start gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#C2A774] shrink-0 mt-0.5" />
                <span>Enugu: Independence & Golf Estate</span>
              </li>
              <li className="flex items-start gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#C2A774] shrink-0 mt-0.5" />
                <span>Oyo: Ibadan (Iyaganku GRA)</span>
              </li>
              <li className="flex items-start gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#C2A774] shrink-0 mt-0.5" />
                <span>Liaison: Mayfair London & Dubai DIFC</span>
              </li>
            </ul>
          </div>

          {/* Private Client Confidentiality Protocol (3 cols) */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-white font-semibold text-xs tracking-wider uppercase font-sans">
              Confidentiality Protocol
            </h4>
            <div className="p-4 rounded-2xl bg-[#0D1017] border border-white/[0.07] text-xs space-y-2">
              <div className="flex items-center gap-1.5 text-[#DFCA9E] font-medium text-[11px] tracking-wide uppercase font-mono">
                <Lock className="w-3 h-3 text-[#C2A774]" /> Zero Public Directory Policy
              </div>
              <p className="text-[11px] leading-relaxed text-neutral-400">
                To protect family privacy and security, Elevated Stay maintains zero searchable public directories of occupied estates or resident identities.
              </p>
              <div className="pt-1 flex items-center gap-1.5 text-[11px] text-neutral-300">
                <Mail className="w-3 h-3 text-[#C2A774]" />
                <span>concierge@stay.com.ng</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-400">
          <div suppressHydrationWarning className="text-[11px]">
            © {new Date().getFullYear()} Elevated Stay (www.stay.com.ng). A division of{" "}
            <Link href="/admin" className="hover:text-[#DFCA9E] transition" title="Master Operations Desk">
              Elevation Studio
            </Link>
            . All rights reserved.
          </div>
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-[11px]">
            <span className="hover:text-white transition cursor-pointer">Terms of Asset Protection</span>
            <span className="hover:text-white transition cursor-pointer">Annexure Quiet Hours Code</span>
            <span className="text-[#DFCA9E] font-mono">Lagos · Abuja · Port Harcourt · Enugu · Ibadan · London · Dubai</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
