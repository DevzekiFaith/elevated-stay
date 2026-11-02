"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, ShieldCheck, Wrench, Check, ArrowRight, Gauge, Cpu, Droplets, Zap, ShieldAlert, FileCheck } from "lucide-react";
import { formatNaira } from "@/lib/payment-split";
import { MaintenanceTicket } from "@/lib/types";

interface InspectionSliderProps {
  title: string;
  category: string;
  compoundName: string;
  unitName: string;
  contractorName: string;
  costAmount: number;
  beforeImage: string;
  afterImage: string;
  notes: string;
  tickets?: MaintenanceTicket[];
  onSelectTicket?: (ticket: MaintenanceTicket) => void;
}

export function InspectionSlider({
  title,
  category,
  compoundName,
  unitName,
  contractorName,
  costAmount,
  beforeImage,
  afterImage,
  notes,
  tickets,
  onSelectTicket,
}: InspectionSliderProps) {
  const [sliderPosition, setSliderPosition] = useState(50); // percentage 0 to 100
  const [viewMode, setViewMode] = useState<"split" | "before" | "after">("split");
  const [selectedTicketIndex, setSelectedTicketIndex] = useState(0);

  // If tickets list is provided, we can dynamically drive the ticket state
  const activeTicket = tickets && tickets.length > 0 ? tickets[selectedTicketIndex] : null;

  const currentTitle = activeTicket ? activeTicket.title : title;
  const currentCategory = activeTicket ? activeTicket.category : category;
  const currentCompound = activeTicket ? activeTicket.compoundName : compoundName;
  const currentUnit = activeTicket ? activeTicket.unitName : unitName;
  const currentContractor = activeTicket ? (activeTicket.contractorName || contractorName) : contractorName;
  const currentCost = activeTicket ? (activeTicket.invoiceAmount || activeTicket.contractorInvoiceAmount || costAmount) : costAmount;
  const currentBeforeImg = activeTicket ? activeTicket.beforePhotoUrl : beforeImage;
  const currentAfterImg = activeTicket ? (activeTicket.afterPhotoUrl || activeTicket.beforePhotoUrl) : afterImage;
  const currentNotes = activeTicket ? (activeTicket.contractorNotes || notes) : notes;

  const handleSliderMove = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSliderPosition(Number(e.target.value));
    if (viewMode !== "split") setViewMode("split");
  };

  const handleTicketSelect = (index: number) => {
    setSelectedTicketIndex(index);
    if (tickets && onSelectTicket) {
      onSelectTicket(tickets[index]);
    }
  };

  const isElectric = currentCategory.toLowerCase().includes("electric") || currentCategory.toLowerCase().includes("solar");
  const isWater = currentCategory.toLowerCase().includes("plumb") || currentCategory.toLowerCase().includes("water");

  const telemetryAfter = isElectric
    ? "Switchover: 12ms · BMS v4.9 Synced"
    : isWater
    ? "Permeate TDS: 14 PPM · UV Sterilized"
    : "Efficiency: 98.4% · 410A Spec Stabilized";

  const telemetryBefore = isElectric
    ? "BMS Cell Imbalance & Delay Flagged"
    : isWater
    ? "Pre-Filter TDS Saturation: 62 PPM"
    : "Marine Salt Scale & Acidity Flagged";

  return (
    <div className="rounded-3xl bg-[#0B0F17] border border-white/[0.09] hover:border-[#D4AF37]/40 transition-all p-5 sm:p-7 space-y-6 shadow-2xl relative overflow-hidden group">
      {/* Architectural subtle ambient background */}
      <div className="absolute -top-24 -right-24 w-80 h-80 bg-[#D4AF37]/5 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-[#D4AF37]/3 blur-[90px] rounded-full pointer-events-none" />

      {/* If multi-tickets are passed, show sleek technical system tabs */}
      {tickets && tickets.length > 1 && (
        <div className="flex items-center gap-1.5 p-1 bg-black/60 rounded-2xl border border-white/[0.08] overflow-x-auto scrollbar-none">
          {tickets.map((t, idx) => {
            const isSelected = selectedTicketIndex === idx;
            // Short title for mobile to prevent cramming
            const shortName = t.category.toLowerCase().includes("hvac")
              ? "HVAC VRV"
              : t.category.toLowerCase().includes("electric")
              ? "Solar BMS"
              : "RO Hydro";

            const isElectric = currentCategory.toLowerCase().includes("electric") || currentCategory.toLowerCase().includes("solar");
  const isWater = currentCategory.toLowerCase().includes("plumb") || currentCategory.toLowerCase().includes("water");

  const telemetryAfter = isElectric
    ? "Switchover: 12ms · BMS v4.9 Synced"
    : isWater
    ? "Permeate TDS: 14 PPM · UV Sterilized"
    : "Efficiency: 98.4% · 410A Spec Stabilized";

  const telemetryBefore = isElectric
    ? "BMS Cell Imbalance & Delay Flagged"
    : isWater
    ? "Pre-Filter TDS Saturation: 62 PPM"
    : "Marine Salt Scale & Acidity Flagged";

  return (
              <button
                key={t.id}
                onClick={() => handleTicketSelect(idx)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-mono font-bold transition-all whitespace-nowrap shrink-0 ${
                  isSelected
                    ? "bg-[#D4AF37] text-[#0A0D12] shadow-md shadow-[#D4AF37]/20 border border-[#D4AF37]"
                    : "text-[#0F172A] dark:text-white hover:bg-slate-200 dark:hover:bg-white/10"
                }`}
              >
                {t.category.toLowerCase().includes("hvac") && <Gauge className="w-3.5 h-3.5" />}
                {t.category.toLowerCase().includes("electric") && <Zap className="w-3.5 h-3.5" />}
                {t.category.toLowerCase().includes("plumb") && <Droplets className="w-3.5 h-3.5" />}
                <span className="hidden sm:inline">{t.category}</span>
                <span className="sm:hidden">{shortName}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/[0.08]">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono tracking-wider uppercase font-semibold bg-[#D4AF37]/15 text-[#DFCA9E] border border-[#D4AF37]/30">
              {currentCategory}
            </span>
            <span className="text-xs text-neutral-400 font-mono">
              {currentUnit} · {currentCompound}
            </span>
          </div>
          <h4 className="text-base sm:text-lg font-bold text-white font-sans tracking-tight">
            {currentTitle}
          </h4>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono text-[#DFCA9E] bg-[#D4AF37]/15 border border-[#D4AF37]/30 font-semibold shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-pulse" />
            <CheckCircle2 className="w-3.5 h-3.5 text-[#D4AF37]" />
            QS AUDITED
          </span>
        </div>
      </div>

      {/* View Mode Switcher Pills */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs">
        <span className="text-neutral-400 font-mono text-[11px] flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
          Visual Mode:
        </span>
        <div className="grid grid-cols-3 sm:flex sm:items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-black/60 border border-slate-300 dark:border-white/10 text-xs w-full sm:w-auto">
          <button
            onClick={() => setViewMode("split")}
            className={`py-2 px-3.5 rounded-lg transition font-bold text-center text-xs ${
              viewMode === "split"
                ? "bg-[#D4AF37] text-[#0A0D12] shadow-sm border border-[#D4AF37]"
                : "text-[#0F172A] dark:text-white hover:bg-slate-200 dark:hover:bg-white/10"
            }`}
          >
            Split
          </button>
          <button
            onClick={() => {
              setViewMode("before");
              setSliderPosition(100);
            }}
            className={`py-2 px-3.5 rounded-lg transition font-bold text-center text-xs ${
              viewMode === "before"
                ? "bg-slate-800 text-white dark:bg-white/20 dark:text-white shadow-sm border border-slate-700 dark:border-white/30"
                : "text-[#0F172A] dark:text-white hover:bg-slate-200 dark:hover:bg-white/10"
            }`}
          >
            Before
          </button>
          <button
            onClick={() => {
              setViewMode("after");
              setSliderPosition(0);
            }}
            className={`py-2 px-3.5 rounded-lg transition font-bold text-center text-xs ${
              viewMode === "after"
                ? "bg-[#D4AF37] text-[#0A0D12] shadow-sm border border-[#D4AF37]"
                : "text-[#0F172A] dark:text-white hover:bg-slate-200 dark:hover:bg-white/10"
            }`}
          >
            After
          </button>
        </div>
      </div>

      {/* Interactive Photo Comparison HUD */}
      <div className="relative h-72 sm:h-84 w-full rounded-2xl overflow-hidden select-none border border-white/10 bg-black shadow-2xl">
        {/* After Image (Full background) */}
        <img
          src={currentAfterImg}
          alt="After Restoration"
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        />

        {/* Telemetry Pin: After (Restored) */}
        <div className="absolute top-4 right-4 z-10 space-y-1.5 text-right pointer-events-none">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-black/90 backdrop-blur-md text-[10px] font-mono text-[#DFCA9E] border border-[#D4AF37]/40 shadow-xl">
            <Check className="w-3 h-3 text-[#D4AF37]" />
            AFTER RESTORATION
          </span>
          <div className="hidden sm:block text-[9px] font-mono text-neutral-300 bg-black/80 px-2.5 py-1 rounded-md backdrop-blur-sm border border-white/10 shadow-lg">
            {telemetryAfter}
          </div>
        </div>

        {/* Before Image (Clipped by slider position) */}
        <div
          className="absolute inset-y-0 left-0 overflow-hidden"
          style={{ width: `${sliderPosition}%` }}
        >
          <img
            src={currentBeforeImg}
            alt="Before Restoration"
            className="absolute inset-0 w-full h-full object-cover pointer-events-none max-w-none"
            style={{ width: "100%", minWidth: "100%", height: "100%" }}
          />

          {/* Telemetry Pin: Before (Degraded) */}
          <div className="absolute top-4 left-4 z-10 space-y-1.5 text-left pointer-events-none">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-black/90 backdrop-blur-md text-[10px] font-mono text-white/80 border border-white/20 shadow-xl">
              <ShieldAlert className="w-3 h-3 text-[#D4AF37]" />
              BEFORE DISPATCH
            </span>
            <div className="hidden sm:block text-[9px] font-mono text-neutral-300 bg-black/80 px-2.5 py-1 rounded-md backdrop-blur-sm border border-white/10 shadow-lg">
              {telemetryBefore}
            </div>
          </div>
        </div>

        {/* Divider Bar with tactile Golden Handle */}
        {viewMode === "split" && (
          <div
            className="absolute inset-y-0 w-1 bg-[#D4AF37] shadow-[0_0_20px_rgba(212,175,55,1)] pointer-events-none z-20"
            style={{ left: `calc(${sliderPosition}% - 2px)` }}
          >
            <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-[#D4AF37] text-[#0A0D12] flex items-center justify-center font-bold text-xs shadow-2xl border-2 border-white/60">
              ⇄
            </div>
          </div>
        )}

        {/* Invisible Range Slider on top for smooth dragging */}
        <input
          type="range"
          min="0"
          max="100"
          value={sliderPosition}
          onChange={handleSliderMove}
          className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-30"
          aria-label="Drag horizontally to compare before and after repairs"
        />

        {/* Bottom subtle hint overlay */}
        <div className="absolute bottom-3 inset-x-0 flex justify-center pointer-events-none z-10">
          <span className="px-3 py-1 rounded-full bg-black/75 backdrop-blur-md text-[9px] font-mono text-neutral-300 border border-white/10">
            Slide horizontally to inspect repairs
          </span>
        </div>
      </div>

      {/* Audit Specification & Escrow Transfer Proof */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#080B11] border border-white/[0.08] space-y-3.5 text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 pb-3 border-b border-white/[0.06]">
          <div>
            <span className="text-[10px] font-mono text-neutral-400 block uppercase tracking-wider">
              Certified Contractor
            </span>
            <span className="text-white font-semibold text-xs sm:text-sm mt-0.5 block">
              {currentContractor}
            </span>
          </div>

          <div className="sm:text-right">
            <span className="text-[10px] font-mono text-neutral-400 block uppercase tracking-wider">
              Escrow Disbursal (Service Charge)
            </span>
            <span className="font-mono text-[#DFCA9E] font-bold text-base sm:text-lg mt-0.5 block">
              {formatNaira(currentCost)}
            </span>
          </div>
        </div>

        <div className="text-neutral-300 text-[11px] leading-relaxed italic bg-black/40 p-3 rounded-xl border border-white/5 relative">
          <span className="text-[#D4AF37] font-serif text-lg leading-none absolute -top-1 left-2">“</span>
          <p className="pl-3">{currentNotes}</p>
        </div>
      </div>

      {/* Footer Instructions & Proof Tag */}
      <div className="text-[10px] text-neutral-400 font-mono flex items-center justify-between pt-1">
        <span className="flex items-center gap-1.5">
          <FileCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span>Voucher Hash: ESC-2026-VCHR-88421</span>
        </span>
        <span className="text-[#DFCA9E] font-semibold bg-[#D4AF37]/10 px-2.5 py-0.5 rounded-full border border-[#D4AF37]/20">
          100% Escrow Funded
        </span>
      </div>
    </div>
  );
}
