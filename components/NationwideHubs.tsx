"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  MapPin,
  Building2,
  ShieldCheck,
  Phone,
  HardHat,
  Users,
  Compass,
  ArrowRight,
  Globe2,
} from "lucide-react";
import { MOCK_REGIONAL_OFFICES } from "@/lib/mock-data";
import { formatNaira } from "@/lib/payment-split";

export function NationwideHubs() {
  const [selectedHubId, setSelectedHubId] = useState(MOCK_REGIONAL_OFFICES[0].id);

  const activeHub =
    MOCK_REGIONAL_OFFICES.find((h) => h.id === selectedHubId) || MOCK_REGIONAL_OFFICES[0];

  return (
    <div className="rounded-3xl bg-[#090D14] border border-white/[0.09] p-6 sm:p-10 space-y-8 shadow-2xl relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#D4AF37]/5 blur-[120px] rounded-full pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-white/[0.08]">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-[10px] font-mono tracking-widest uppercase font-semibold bg-[#D4AF37]/15 text-[#DFCA9E] border border-[#D4AF37]/30 flex items-center gap-1.5 shadow-sm">
              <Compass className="w-3.5 h-3.5 text-[#D4AF37]" />
              NATIONWIDE FOOTPRINT & DIASPORA DESKS
            </span>
          </div>
          <h3 className="text-2xl sm:text-4xl font-bold text-white tracking-tight">
            Multi-State Operations Hubs
          </h3>
          <p className="text-xs sm:text-sm text-neutral-400 max-w-2xl leading-relaxed">
            Elevated Stay operates physical field engineering offices across Nigeria's prime wealth corridors. Each state operations hub coordinates vetted contractor dispatches and dedicated regional facility escrows.
          </p>
        </div>

        <div className="text-xs font-mono text-neutral-400 flex items-center gap-2 shrink-0">
          <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse" />
          <span>5 States Active + 2 International Liaison Desks</span>
        </div>
      </div>

      {/* Hub State Switcher Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1">
        {MOCK_REGIONAL_OFFICES.map((hub) => {
          const isSelected = hub.id === selectedHubId;
          return (
            <button
              key={hub.id}
              onClick={() => setSelectedHubId(hub.id)}
              className={`py-2.5 px-4 rounded-2xl text-xs font-mono font-bold transition-all whitespace-nowrap shrink-0 flex items-center gap-2 border ${
                isSelected
                  ? "bg-[#D4AF37] text-[#0A0D12] shadow-md shadow-[#D4AF37]/20 border-[#D4AF37]"
                  : "bg-slate-100 hover:bg-slate-200 text-[#0F172A] dark:bg-white/[0.08] dark:hover:bg-white/15 dark:text-white border-slate-300 dark:border-white/10"
              }`}
            >
              {hub.state.includes("International") ? (
                <Globe2 className="w-3.5 h-3.5" />
              ) : (
                <MapPin className="w-3.5 h-3.5" />
              )}
              <span>{hub.state.split(" ")[0]}</span>
            </button>
          );
        })}
      </div>

      {/* Active Hub Showcase Detail */}
      <motion.div
        key={activeHub.id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="p-6 sm:p-8 rounded-2xl bg-[#0F1420] border border-white/[0.08] space-y-6 shadow-xl"
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-white/[0.06]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono text-[#DFCA9E] font-semibold uppercase">
                {activeHub.state}
              </span>
              {activeHub.isFlagship && (
                <span className="px-2 py-0.5 rounded text-[9px] font-mono bg-[#D4AF37]/15 text-[#DFCA9E] border border-[#D4AF37]/30">
                  NATIONAL HEADQUARTERS
                </span>
              )}
            </div>
            <h4 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              {activeHub.hubName}
            </h4>
            <p className="text-xs text-neutral-400 mt-1 flex items-center gap-1.5 font-mono">
              <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>{activeHub.officeAddress}</span>
            </p>
          </div>

          <div className="flex items-center gap-3 self-start lg:self-auto">
            <a
              href={`tel:${activeHub.phone}`}
              className="py-2 px-3.5 rounded-xl bg-white/[0.05] hover:bg-[#D4AF37]/20 text-neutral-200 hover:text-[#DFCA9E] border border-white/10 text-xs font-mono flex items-center gap-2 transition"
            >
              <Phone className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>{activeHub.phone}</span>
            </a>
          </div>
        </div>

        {/* 4 Operations Telemetry Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-[#080B10] border border-white/[0.06] space-y-1">
            <span className="text-[10px] font-mono text-neutral-400 uppercase block">Regional Escrow Liquidity</span>
            <span className="text-lg font-bold font-mono text-white block">
              {activeHub.facilityEscrowPool > 0 ? formatNaira(activeHub.facilityEscrowPool) : "Escrow Provisioned"}
            </span>
            <span className="text-[10px] text-neutral-500 font-mono">100% Ringfenced Facilities</span>
          </div>

          <div className="p-4 rounded-xl bg-[#080B10] border border-white/[0.06] space-y-1">
            <span className="text-[10px] font-mono text-neutral-400 uppercase block">Compounds Under Watch</span>
            <span className="text-lg font-bold font-mono text-white block">
              {activeHub.compoundsUnderWatch} Estates
            </span>
            <span className="text-[10px] text-[#DFCA9E] font-mono">100% Leased / Active</span>
          </div>

          <div className="p-4 rounded-xl bg-[#080B10] border border-white/[0.06] space-y-1">
            <span className="text-[10px] font-mono text-neutral-400 uppercase block">Vetted Contractor Network</span>
            <span className="text-lg font-bold font-mono text-[#DFCA9E] block">
              {activeHub.licensedContractorsCount} Certified
            </span>
            <span className="text-[10px] text-neutral-500 font-mono">Carrier, Daikin, Schneider</span>
          </div>

          <div className="p-4 rounded-xl bg-[#080B10] border border-white/[0.06] space-y-1">
            <span className="text-[10px] font-mono text-neutral-400 uppercase block">Lead Operations Engineer</span>
            <span className="text-xs font-bold text-white block truncate mt-1">
              {activeHub.leadEngineer}
            </span>
            <span className="text-[10px] text-neutral-500 font-mono">Licensed & Bonded</span>
          </div>
        </div>

        {/* Coverage Zones Pills */}
        <div className="space-y-2 pt-2 border-t border-white/[0.06]">
          <span className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider block">
            Covered Residential & Diplomatic Enclaves:
          </span>
          <div className="flex flex-wrap items-center gap-2">
            {activeHub.coverageZones.map((zone, i) => (
              <span
                key={i}
                className="px-3 py-1 rounded-xl bg-black/40 border border-white/10 text-xs font-mono text-neutral-300"
              >
                {zone}
              </span>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

