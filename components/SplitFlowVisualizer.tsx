"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Building, ShieldCheck, Wallet, ArrowRight, CheckCircle2, Lock, BadgeCheck, RefreshCw } from "lucide-react";
import { formatNaira, calculateTransactionSplit } from "@/lib/payment-split";

export function SplitFlowVisualizer() {
  const [rentAmount, setRentAmount] = useState<number>(40000000);
  const [serviceCharge, setServiceCharge] = useState<number>(6500000);
  const [mgmtFeePercent, setMgmtFeePercent] = useState<number>(7.5);
  const [activeNode, setActiveNode] = useState<"all" | "landlord" | "escrow" | "elevation">("all");

  const split = calculateTransactionSplit({
    baseRent: rentAmount,
    serviceCharge: serviceCharge,
    managementFeePercent: mgmtFeePercent,
  });

  return (
    <div className="w-full rounded-3xl bg-gradient-to-b from-[#0F141F] to-[#0A0D14] border border-[#D4AF37]/20 p-6 sm:p-10 shadow-2xl relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#D4AF37]/5 blur-[120px] rounded-full pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-white/[0.08] gap-4">
        <div>
          <span className="text-[11px] font-mono tracking-widest uppercase text-[#D4AF37] font-semibold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse" />
            Zero-Commingling Ledger Protocol
          </span>
          <h3 className="text-xl sm:text-2xl font-bold text-white mt-1">
            Automated Multi-Subaccount Transaction Split
          </h3>
          <p className="text-xs text-neutral-400 mt-1 max-w-xl">
            Rent and facility reserves are separated at the gateway level. Landlords receive immediate direct wire disbursements without passing through middleman agency accounts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-neutral-400">Total Remittance:</span>
          <span className="text-lg font-bold font-mono text-white px-3 py-1 rounded-xl bg-white/[0.04] border border-white/10">
            {formatNaira(split.totalCharge)}
          </span>
        </div>
      </div>

      {/* Interactive Controls & Diagram */}
      <div className="py-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left: Input sliders */}
        <div className="lg:col-span-4 space-y-5 p-5 rounded-2xl bg-[#080B10] border border-white/[0.06]">
          <span className="text-[11px] font-mono uppercase text-[#DFCA9E] block tracking-wider font-semibold">
            Configure Compound Lease Structure:
          </span>

          <div>
            <div className="flex justify-between text-xs mb-1.5">
              <span className="text-neutral-300">Base Annual Rent</span>
              <span className="font-mono text-[#E2C792] font-semibold">{formatNaira(rentAmount)}</span>
            </div>
            <input
              type="range"
              min={20000000}
              max={80000000}
              step={1000000}
              value={rentAmount}
              onChange={(e) => setRentAmount(Number(e.target.value))}
              className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#D4AF37]"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1.5">
              <span className="text-neutral-300">Compound Service Charge</span>
              <span className="font-mono text-purple-400 font-semibold">{formatNaira(serviceCharge)}</span>
            </div>
            <input
              type="range"
              min={3000000}
              max={15000000}
              step={500000}
              value={serviceCharge}
              onChange={(e) => setServiceCharge(Number(e.target.value))}
              className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-purple-400"
            />
          </div>

          <div className="pt-2 flex items-center justify-between text-xs border-t border-white/[0.06]">
            <span className="text-neutral-400">Management Tier:</span>
            <span className="font-mono text-white font-semibold">{mgmtFeePercent}% Retainer</span>
          </div>
        </div>

        {/* Center to Right: Visual Node Diagram */}
        <div className="lg:col-span-8 space-y-4">
          {/* Node 1: Direct Landlord */}
          <motion.div
            whileHover={{ scale: 1.01 }}
            onClick={() => setActiveNode(activeNode === "landlord" ? "all" : "landlord")}
            className={`p-5 rounded-2xl border transition-all cursor-pointer ${
              activeNode === "landlord" || activeNode === "all"
                ? "bg-[#111722] border-[#D4AF37]/50 shadow-lg shadow-[#D4AF37]/5"
                : "bg-[#0B0E14] border-white/5 opacity-50"
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-[#D4AF37]/15 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37]">
                  <Building className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white font-sans">
                      Landlord Direct Subaccount Payout
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-[#D4AF37]/20 text-[#DFCA9E]">
                      {100 - mgmtFeePercent}% NET
                    </span>
                  </div>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    Settles automatically to GTB / Zenith designated subaccount · Instant NIP Wire
                  </p>
                </div>
              </div>

              <div className="text-left sm:text-right">
                <span className="text-lg font-bold font-mono text-[#DFCA9E] block">
                  {formatNaira(split.destinationSummary.landlordSubaccountPayout)}
                </span>
                <span className="text-[10px] font-mono text-emerald-400">0 Day Clearing Delay</span>
              </div>
            </div>
          </motion.div>

          {/* Node 2: Compound Facility Escrow */}
          <motion.div
            whileHover={{ scale: 1.01 }}
            onClick={() => setActiveNode(activeNode === "escrow" ? "all" : "escrow")}
            className={`p-5 rounded-2xl border transition-all cursor-pointer ${
              activeNode === "escrow" || activeNode === "all"
                ? "bg-[#141224] border-purple-500/50 shadow-lg shadow-purple-500/5"
                : "bg-[#0B0E14] border-white/5 opacity-50"
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white font-sans">
                      Compound Facility Escrow Pool
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-purple-500/20 text-purple-300">
                      100% RINGFENCED
                    </span>
                  </div>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    Dedicated Standard Chartered Bank Escrow · Powers Caterpillar Generators, Inverters & Water TDS
                  </p>
                </div>
              </div>

              <div className="text-left sm:text-right">
                <span className="text-lg font-bold font-mono text-purple-300 block">
                  {formatNaira(split.destinationSummary.compoundEscrowDeposit)}
                </span>
                <span className="text-[10px] font-mono text-neutral-400">Restricted Disbursal Protocol</span>
              </div>
            </div>
          </motion.div>

          {/* Node 3: Elevated Stay Retainer */}
          <motion.div
            whileHover={{ scale: 1.01 }}
            onClick={() => setActiveNode(activeNode === "elevation" ? "all" : "elevation")}
            className={`p-5 rounded-2xl border transition-all cursor-pointer ${
              activeNode === "elevation" || activeNode === "all"
                ? "bg-[#10141C] border-white/20 shadow-lg"
                : "bg-[#0B0E14] border-white/5 opacity-50"
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-white/[0.06] border border-white/10 flex items-center justify-center text-neutral-300">
                  <Wallet className="w-5 h-5 text-[#D4AF37]" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white font-sans">
                      Elevated Stay Asset Lifecycle Retainer
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-white/10 text-neutral-300">
                      {mgmtFeePercent}% RETAINER
                    </span>
                  </div>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    Preventive MEP audits, legal lease compliance & headless WhatsApp pass infrastructure
                  </p>
                </div>
              </div>

              <div className="text-left sm:text-right">
                <span className="text-lg font-bold font-mono text-white block">
                  {formatNaira(split.destinationSummary.elevationStudioTreasury)}
                </span>
                <span className="text-[10px] font-mono text-neutral-400">Tax Deductible Opex</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Footer reassurance bar */}
      <div className="pt-4 border-t border-white/[0.06] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-neutral-400">
        <div className="flex items-center gap-2 font-mono text-[11px] text-[#DFCA9E]">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          <span>Paystack Subaccounts API verified · Automated Settlement Rules Enforced</span>
        </div>
        <div className="font-mono text-[10px] text-neutral-500">
          AUDIT HASH: SHA256-ESCROW-SPLIT-849102-LIVE
        </div>
      </div>
    </div>
  );
}

