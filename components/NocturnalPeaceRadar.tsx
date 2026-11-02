"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Volume2, VolumeX, ShieldCheck, Moon, Clock, CheckCircle2, AlertOctagon } from "lucide-react";
import { useToast } from "./ToastProvider";

export function NocturnalPeaceRadar() {
  const { showToast } = useToast();
  const [mode, setMode] = useState<"standard" | "disruption">("standard");

  const handleSelectMode = (newMode: "standard" | "disruption") => {
    setMode(newMode);
    if (newMode === "disruption") {
      showToast({
        title: "Acoustic Disruption Logged (74.2 dB)",
        detail: "Decibel threshold breached at Penthouse East. Automated annexure warning dispatched via WhatsApp.",
        type: "security",
      });
    } else {
      showToast({
        title: "Acoustic Sanctuary Verified (28.4 dB)",
        detail: "Decibel level well within nocturnal quiet hours threshold (under 35 dB).",
        type: "security",
      });
    }
  };

  return (
    <div className="w-full rounded-3xl bg-[#0B0E15] border border-white/[0.08] p-6 sm:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/[0.06]">
        <div>
          <span className="text-[11px] font-mono tracking-wider uppercase text-[#DFCA9E] font-semibold flex items-center gap-1.5">
            <Moon className="w-3.5 h-3.5 text-[#D4AF37]" />
            Annexure Quiet Hours Governance (22:00 – 07:00 WAT)
          </span>
          <h3 className="text-xl font-bold text-white mt-1">
            Zero-Disruption Family Compound Sanctuary
          </h3>
          <p className="text-xs text-neutral-400 mt-0.5">
            Why premier family compounds trust Elevated Stay: Strict contractual bans on short-let parties and nocturnal acoustic disturbance.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:flex sm:items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-black/60 border border-slate-300 dark:border-white/10 text-xs w-full sm:w-auto">
          <button
            onClick={() => handleSelectMode("standard")}
            className={`py-2 px-3.5 rounded-lg font-bold transition text-center text-xs ${
              mode === "standard"
                ? "bg-[#D4AF37] text-[#0A0D12] shadow-md shadow-[#D4AF37]/20 border border-[#D4AF37]"
                : "text-[#0F172A] dark:text-white hover:bg-slate-200 dark:hover:bg-white/10"
            }`}
          >
            Peaceful (&lt;35 dB)
          </button>
          <button
            onClick={() => handleSelectMode("disruption")}
            className={`py-2 px-3.5 rounded-lg font-bold transition text-center text-xs ${
              mode === "disruption"
                ? "bg-slate-800 text-white dark:bg-white/20 dark:text-white border border-slate-700 dark:border-white/30 shadow-sm"
                : "text-[#0F172A] dark:text-white hover:bg-slate-200 dark:hover:bg-white/10"
            }`}
          >
            Acoustic Incident (70+ dB)
          </button>
        </div>
      </div>

      {/* Interactive Visualizer */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Radar meter (7 cols) */}
        <div className="md:col-span-7 p-6 rounded-2xl bg-[#07090E] border border-white/[0.06] space-y-4">
          <div className="flex items-center justify-between text-xs">
            <span className="text-neutral-400 font-mono">Real-Time Acoustic Telemetry:</span>
            <span
              className={`font-mono font-bold text-sm ${
                mode === "standard" ? "text-[#DFCA9E]" : "text-white"
              }`}
            >
              {mode === "standard" ? "31.4 dB · Nocturnal Peace" : "84.2 dB · Breach Flagged"}
            </span>
          </div>

          {/* Decibel visual bar */}
          <div className="w-full h-3 rounded-full bg-white/10 overflow-hidden relative">
            <motion.div
              initial={false}
              animate={{
                width: mode === "standard" ? "24%" : "88%",
                backgroundColor: mode === "standard" ? "#D4AF37" : "#E5E7EB",
              }}
              transition={{ type: "spring", stiffness: 200, damping: 25 }}
              className="h-full rounded-full"
            />
          </div>

          <div className="flex justify-between text-[10px] text-neutral-500 font-mono">
            <span>0 dB (Silence)</span>
            <span>35 dB (Protected Threshold)</span>
            <span>70 dB+ (Commercial / Party Barred)</span>
          </div>

          {/* Status Message */}
          <div
            className={`p-3.5 rounded-xl border text-xs flex items-start gap-3 transition-colors ${
              mode === "standard"
                ? "bg-[#D4AF37]/15 border-[#D4AF37]/30 text-[#DFCA9E]"
                : "bg-white/[0.05] border-white/20 text-neutral-200"
            }`}
          >
            {mode === "standard" ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                <p className="text-[11px] leading-relaxed">
                  <strong>Compound Status: Compliant.</strong> Quiet hours strictly active across penthouses and courtyards. Resident rest fully protected.
                </p>
              </>
            ) : (
              <>
                <AlertOctagon className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <p className="text-[11px] leading-relaxed">
                  <strong>Automated Concierge Alert:</strong> Sound spike detected above 35 dB limit. Security gate passes frozen for unregistered non-residents. Host unit notified via WhatsApp dispatch.
                </p>
              </>
            )}
          </div>
        </div>

        {/* 3 Core Rules (5 cols) */}
        <div className="md:col-span-5 space-y-3 text-xs">
          <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06]">
            <span className="text-white font-medium block">1. No Short-Let Subletting</span>
            <span className="text-[11px] text-neutral-400">
              Units cannot be turned into commercial party venues or unvetted short-term Airbnb lets.
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06]">
            <span className="text-white font-medium block">2. 22:00 Gate Clearance Lock</span>
            <span className="text-[11px] text-neutral-400">
              Non-registered commercial delivery vehicles require resident one-click pre-authorization.
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06]">
            <span className="text-white font-medium block">3. Escrow Maintenance Assurance</span>
            <span className="text-[11px] text-neutral-400">
              Soundproofing, chiller vibration isolators, and generator silencers inspected quarterly.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

