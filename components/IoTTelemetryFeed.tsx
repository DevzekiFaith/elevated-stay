"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Zap,
  Droplets,
  Fuel,
  Activity,
  CheckCircle2,
  Clock,
  ShieldCheck,
  RefreshCw,
  Cpu,
  Wifi,
} from "lucide-react";
import { MOCK_IOT_TELEMETRY } from "@/lib/mock-data";

export function IoTTelemetryFeed() {
  const [telemetry, setTelemetry] = useState(MOCK_IOT_TELEMETRY);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setTelemetry((prev) => ({
        ...prev,
        solarBatterySoC: 99.4,
        generatorFuelLiters: 4248,
        waterTdsPpm: 13.8,
        lastSyncTimestamp: "Just now (IoT Telemetry Verified)",
      }));
    }, 800);
  };

  const fuelPercent = Math.round(
    (telemetry.generatorFuelLiters / telemetry.generatorFuelCapacity) * 100
  );

  return (
    <div className="rounded-3xl bg-gradient-to-b from-[#0F141F] to-[#0A0D15] border border-white/[0.09] p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden">
      {/* Ambient lighting */}
      <div className="absolute top-0 right-1/3 w-80 h-80 bg-[#D4AF37]/5 blur-[100px] rounded-full pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono tracking-widest uppercase font-semibold bg-[#D4AF37]/15 text-[#DFCA9E] border border-[#D4AF37]/30 flex items-center gap-1.5 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-pulse" />
              LIVE ESTATE HARDWARE TELEMETRY
            </span>
            <span className="text-xs text-neutral-400 font-mono hidden sm:inline">
              LoRaWAN & Cellular Gateway v3.1
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight font-sans">
            Compound Facilities Critical Diagnostics
          </h3>
          <p className="text-xs text-neutral-400 max-w-xl">
            Real-time IoT telemetry from compound diesel tanks, hybrid solar BMS lithium banks, and borehole reverse osmosis filtration.
          </p>
        </div>

        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/[0.04] hover:bg-[#D4AF37]/15 text-[#DFCA9E] border border-[#D4AF37]/30 text-xs font-mono transition-all self-start sm:self-auto shrink-0 active:scale-95 disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-[#D4AF37] ${isRefreshing ? "animate-spin" : ""}`} />
          <span>Sync Sensors</span>
        </button>
      </div>

      {/* 3 Live Telemetry Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Metric 1: Perkins / CAT Diesel Tank */}
        <div className="p-5 rounded-2xl bg-[#080B10] border border-white/[0.07] hover:border-[#D4AF37]/30 transition-all space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#DFCA9E] flex items-center gap-1.5 font-semibold">
              <Fuel className="w-4 h-4 text-[#D4AF37]" />
              Diesel Fuel Reserve
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.04] text-neutral-300 border border-white/10">
              STANDBY
            </span>
          </div>

          <div className="space-y-1">
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-bold font-mono text-white">
                {telemetry.generatorFuelLiters.toLocaleString()} L
              </span>
              <span className="text-xs font-mono text-neutral-400">
                / {telemetry.generatorFuelCapacity.toLocaleString()} L ({fuelPercent}%)
              </span>
            </div>
            {/* Progress Bar */}
            <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full bg-[#D4AF37] rounded-full transition-all duration-500"
                style={{ width: `${fuelPercent}%` }}
              />
            </div>
          </div>

          <div className="pt-2 border-t border-white/[0.06] text-[11px] font-mono text-neutral-400 flex items-center justify-between">
            <span>Runtime: {telemetry.generatorRunningHours} hrs</span>
            <span className="text-white">No Water Intrusion</span>
          </div>
        </div>

        {/* Metric 2: Solar BMS & Hybrid Inverter */}
        <div className="p-5 rounded-2xl bg-[#080B10] border border-white/[0.07] hover:border-[#D4AF37]/30 transition-all space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#DFCA9E] flex items-center gap-1.5 font-semibold">
              <Zap className="w-4 h-4 text-[#D4AF37]" />
              Solar BMS Lithium Bank
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#D4AF37]/15 text-[#DFCA9E] border border-[#D4AF37]/30">
              OPTIMAL
            </span>
          </div>

          <div className="space-y-1">
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-bold font-mono text-white">
                {telemetry.solarBatterySoC}%
              </span>
              <span className="text-xs font-mono text-neutral-400">
                Latency: {telemetry.solarGridSwitchoverMs}ms
              </span>
            </div>
            {/* Progress Bar */}
            <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full bg-[#D4AF37] rounded-full transition-all duration-500"
                style={{ width: `${telemetry.solarBatterySoC}%` }}
              />
            </div>
          </div>

          <div className="pt-2 border-t border-white/[0.06] text-[11px] font-mono text-neutral-400 flex items-center justify-between">
            <span>Daily Harvest: {telemetry.solarDailyHarvestKwh} kWh</span>
            <span className="text-[#DFCA9E]">Zero Grid Blink</span>
          </div>
        </div>

        {/* Metric 3: Water Desalination / TDS Purity */}
        <div className="p-5 rounded-2xl bg-[#080B10] border border-white/[0.07] hover:border-[#D4AF37]/30 transition-all space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#DFCA9E] flex items-center gap-1.5 font-semibold">
              <Droplets className="w-4 h-4 text-[#D4AF37]" />
              Reverse Osmosis Purity
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#D4AF37]/15 text-[#DFCA9E] border border-[#D4AF37]/30">
              POTABLE GOLD
            </span>
          </div>

          <div className="space-y-1">
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-bold font-mono text-white">
                {telemetry.waterTdsPpm} PPM
              </span>
              <span className="text-xs font-mono text-[#DFCA9E]">
                &lt; 45 PPM Spec
              </span>
            </div>
            {/* Progress Bar (lower is better for TDS) */}
            <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full bg-[#D4AF37] rounded-full transition-all duration-500"
                style={{ width: "24%" }}
              />
            </div>
          </div>

          <div className="pt-2 border-t border-white/[0.06] text-[11px] font-mono text-neutral-400 flex items-center justify-between">
            <span>UV Sterilizer: Active</span>
            <span className="text-white">{telemetry.waterDailyVolumeLiters.toLocaleString()} L Today</span>
          </div>
        </div>
      </div>

      {/* Footer live sync stamp */}
      <div className="flex items-center justify-between text-[10px] font-mono text-neutral-400 pt-1 border-t border-white/[0.06]">
        <span className="flex items-center gap-1.5">
          <Wifi className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span>{telemetry.lastSyncTimestamp}</span>
        </span>
        <span className="text-neutral-400">Ringfenced Facilities Escrow Backed</span>
      </div>
    </div>
  );
}

