"use client";

import { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Logo } from "@/components/Logo";
import { ArchitecturalSlides } from "@/components/ArchitecturalSlides";
import { InspectionSlider } from "@/components/InspectionSlider";
import { NocturnalPeaceRadar } from "@/components/NocturnalPeaceRadar";
import { NationwideHubs } from "@/components/NationwideHubs";
import { IoTTelemetryFeed } from "@/components/IoTTelemetryFeed";
import { WhatsAppBotSimulator } from "@/components/WhatsAppBotSimulator";
import { MOCK_MAINTENANCE_TICKETS, MOCK_LANDLORD, MOCK_UNITS, MOCK_COMPOUNDS } from "@/lib/mock-data";
import { formatNaira } from "@/lib/payment-split";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2,
  Lock,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Zap,
  Layers,
  ChevronRight,
  Scale,
  KeyRound,
  FileText,
  Clock,
  Wrench,
  Check,
  Building,
  TrendingUp,
  Receipt,
  UserCheck,
  Award,
  Activity,
} from "lucide-react";

export default function HomePage() {
  const [activePortalTab, setActivePortalTab] = useState<"landlord" | "resident" | "admin">("landlord");
  const highlightTicket = MOCK_MAINTENANCE_TICKETS[0];

  return (
    <div className="min-h-screen flex flex-col bg-[#07090E] text-[#F3F4F6] selection:bg-[#D4AF37]/25 selection:text-[#F5E6B8]">
      <Navbar />

      {/* 1. Hero: Monolithic Architectural Statement */}
      <section className="relative pt-20 pb-28 md:pt-32 md:pb-40 overflow-hidden architectural-grid border-b border-white/[0.08]">
        {/* Ambient Warm Titanium Lighting */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] bg-[#D4AF37]/8 blur-[180px] rounded-full pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-[450px] h-[450px] bg-emerald-500/5 blur-[160px] rounded-full pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          {/* Brand Insignia (Logo Mark Only, No Name) */}
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex justify-center"
          >
            <Logo size="lg" glow={true} />
          </motion.div>

          {/* Editorial Display Heading */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="max-w-5xl mx-auto space-y-4"
          >
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.08] font-sans">
              Turnkey Residential Management &{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F5E6B8] via-[#D4AF37] to-[#A07B1E]">
                Asset Lifecycle Protection.
              </span>
            </h1>

            <p className="text-base sm:text-lg lg:text-xl text-neutral-300 max-w-3xl mx-auto leading-relaxed font-normal pt-2">
              Engineered for high-value family compounds and institutional diaspora landlords across Old Ikoyi, Banana Island, and Maitama.
              Eliminating agency commingling, tenant friction, and structural degradation through software-enforced governance.
            </p>
          </motion.div>

          {/* Primary Action Buttons (Concise, spacious & fully responsive) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2 w-full max-w-lg mx-auto sm:max-w-none"
          >
            <Link
              href="/landlord"
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#D4AF37] to-[#B38F24] hover:from-[#F5E6B8] hover:to-[#D4AF37] text-[#0A0D12] font-semibold text-xs sm:text-sm shadow-xl shadow-[#D4AF37]/10 flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5"
            >
              <Building2 className="w-4 h-4" />
              <span>Landlord Portal</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/resident"
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-[#121722] hover:bg-[#18202E] text-white border border-white/10 hover:border-[#D4AF37]/40 font-medium text-xs sm:text-sm transition-all flex items-center justify-center gap-2"
            >
              <KeyRound className="w-4 h-4 text-[#D4AF37]" />
              <span>Resident Hub</span>
              <ChevronRight className="w-4 h-4 text-neutral-400" />
            </Link>

            <Link
              href="/admin"
              className="w-full sm:w-auto px-5 py-3.5 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] text-neutral-300 font-medium text-xs sm:text-sm transition-all flex items-center justify-center gap-2 border border-white/5"
            >
              <Layers className="w-4 h-4 text-[#D4AF37]" />
              <span>Master Ops</span>
            </Link>
          </motion.div>

          {/* Architectural Metrics Bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.35 }}
            className="pt-10 max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-4 text-left"
          >
            <div className="p-4 rounded-2xl bg-[#0D1119] border border-white/[0.06]">
              <span className="text-[10px] font-mono text-neutral-400 uppercase block">Settled Gross Rent</span>
              <span className="text-lg font-bold font-mono text-[#DFCA9E] block mt-0.5">92.5% Direct</span>
              <span className="text-[10px] text-[#DFCA9E] font-mono">Zero Agency Commingling</span>
            </div>

            <div className="p-4 rounded-2xl bg-[#0D1119] border border-white/[0.06]">
              <span className="text-[10px] font-mono text-neutral-400 uppercase block">Direct Landlord Payout</span>
              <span className="text-lg font-bold font-mono text-white block mt-0.5">Automated Split</span>
              <span className="text-[10px] text-neutral-400 font-mono">Paystack Subaccounts</span>
            </div>

            <div className="p-4 rounded-2xl bg-[#0D1119] border border-white/[0.06]">
              <span className="text-[10px] font-mono text-neutral-400 uppercase block">Compound Escrow Pool</span>
              <span className="text-lg font-bold font-mono text-white block mt-0.5">100% Ringfenced</span>
              <span className="text-[10px] text-neutral-400 font-mono">Dedicated Commercial Escrows</span>
            </div>

            <div className="p-4 rounded-2xl bg-[#0D1119] border border-white/[0.06]">
              <span className="text-[10px] font-mono text-neutral-400 uppercase block">Contractual Peace</span>
              <span className="text-lg font-bold font-mono text-[#DFCA9E] block mt-0.5">22:00 – 07:00</span>
              <span className="text-[10px] text-neutral-400 font-mono">Zero Short-Let Parties</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. Interactive Ecosystem Showcase: The 3 Portals */}
      <section className="py-20 sm:py-28 bg-[#090C13] border-b border-white/[0.08]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-mono uppercase tracking-wider text-[#D4AF37] font-semibold">
              Unified PropTech Ecosystem
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold text-white mt-1.5">
              Three Specialized Portals. Zero Operational Friction.
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 mt-2">
              Select a portal below to preview how Elevated Stay separates passive oversight, headless resident convenience, and studio operations.
            </p>
          </div>

          {/* Tab Selector (Uncluttered, responsive scroll on mobile) */}
          <div className="flex justify-center w-full">
            <div className="p-1 sm:p-1.5 rounded-2xl bg-[#10141D] border border-white/10 flex items-center justify-start sm:justify-center gap-1.5 text-xs font-medium max-w-full overflow-x-auto scrollbar-none px-2 sm:px-1.5">
              <button
                onClick={() => setActivePortalTab("landlord")}
                className={`py-2 px-3.5 sm:px-4 rounded-xl transition flex items-center gap-2 whitespace-nowrap shrink-0 ${
                  activePortalTab === "landlord"
                    ? "bg-[#D4AF37] text-[#0A0D12] font-bold shadow-md shadow-[#D4AF37]/20"
                    : "text-neutral-300 hover:text-white hover:bg-white/[0.04]"
                }`}
              >
                <Building2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">01. Landlord Oversight</span>
                <span className="sm:hidden">01. Landlord</span>
              </button>

              <button
                onClick={() => setActivePortalTab("resident")}
                className={`py-2 px-3.5 sm:px-4 rounded-xl transition flex items-center gap-2 whitespace-nowrap shrink-0 ${
                  activePortalTab === "resident"
                    ? "bg-[#D4AF37] text-[#0A0D12] font-bold shadow-md shadow-[#D4AF37]/20"
                    : "text-neutral-300 hover:text-white hover:bg-white/[0.04]"
                }`}
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">02. Resident Hub</span>
                <span className="sm:hidden">02. Resident</span>
              </button>

              <button
                onClick={() => setActivePortalTab("admin")}
                className={`py-2 px-3.5 sm:px-4 rounded-xl transition flex items-center gap-2 whitespace-nowrap shrink-0 ${
                  activePortalTab === "admin"
                    ? "bg-[#D4AF37] text-[#0A0D12] font-bold shadow-md shadow-[#D4AF37]/20"
                    : "text-neutral-300 hover:text-white hover:bg-white/[0.04]"
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">03. Master Ops</span>
                <span className="sm:hidden">03. Operations</span>
              </button>
            </div>
          </div>

          {/* Interactive Portal Preview Container */}
          <div className="rounded-3xl bg-[#0D111A] border border-white/[0.08] p-6 sm:p-10 shadow-2xl relative overflow-hidden">
            <AnimatePresence mode="wait">
              {activePortalTab === "landlord" && (
                <motion.div
                  key="landlord-tab"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2.5 py-0.5 rounded text-[10px] font-mono uppercase bg-[#D4AF37]/20 text-[#DFCA9E]">
                          Landlord View-Only Dashboard
                        </span>
                        <span className="text-xs text-neutral-400 font-mono">Live Institutional Enclave</span>
                      </div>
                      <h3 className="text-xl font-bold text-white">Passive Yield & Maintenance Oversight</h3>
                      <p className="text-xs text-neutral-400 mt-1">
                        Real-time rent inflows direct to your subaccount, active lease countdowns, and contractor repair photo audits.
                      </p>
                    </div>

                    <Link
                      href="/landlord"
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#D4AF37] text-[#0A0D12] text-xs font-semibold hover:bg-[#F5E6B8] transition self-start sm:self-auto"
                    >
                      <span>Open Landlord Portal</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>

                  {/* 3 Metric Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-4 rounded-xl bg-[#070A0F] border border-white/[0.06]">
                      <span className="text-[10px] font-mono text-neutral-400 block uppercase">Net Disbursed to Bank</span>
                      <span className="text-xl font-bold font-mono text-[#DFCA9E] block mt-1">92.5% Automated</span>
                      <span className="text-[10px] text-[#DFCA9E] font-mono mt-1 block">Direct to GTB/SCB Subaccount</span>
                    </div>

                    <div className="p-4 rounded-xl bg-[#070A0F] border border-white/[0.06]">
                      <span className="text-[10px] font-mono text-neutral-400 block uppercase">Occupancy & Void Gap</span>
                      <span className="text-xl font-bold font-mono text-white block mt-1">0 Days Void Gap</span>
                      <span className="text-[10px] text-neutral-400 font-mono mt-1 block">Continuous Long-Term Tenancies</span>
                    </div>

                    <div className="p-4 rounded-xl bg-[#070A0F] border border-white/[0.06]">
                      <span className="text-[10px] font-mono text-neutral-400 block uppercase">Facility Escrow Balance</span>
                      <span className="text-xl font-bold font-mono text-white block mt-1">100% Ringfenced</span>
                      <span className="text-[10px] text-neutral-400 font-mono mt-1 block">Dedicated Bank Escrow</span>
                    </div>
                  </div>

                  {/* Recent Settlement Snapshot */}
                  <div className="p-4 rounded-xl bg-[#070A0F] border border-white/[0.06] flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs font-mono">
                    <div className="space-y-1">
                      <span className="text-neutral-400 block">AUTOMATED SUBACCOUNT SPLIT PROTOCOL:</span>
                      <span className="text-white font-semibold">92.5% Net Rent Direct to Landlord · 7.5% Elevation Retainer</span>
                    </div>
                    <div className="text-left sm:text-right">
                      <span className="text-[#DFCA9E] font-bold block">Zero Commingling Architecture</span>
                      <span className="text-neutral-500 text-[10px]">Settled via Paystack Direct NIP</span>
                    </div>
                  </div>
                </motion.div>
              )}

              {activePortalTab === "resident" && (
                <motion.div
                  key="resident-tab"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2.5 py-0.5 rounded text-[10px] font-mono uppercase bg-[#D4AF37]/15 text-[#DFCA9E] border border-[#D4AF37]/30">
                          Resident Headless Experience
                        </span>
                        <span className="text-xs text-neutral-400 font-mono">Executive Resident Portal</span>
                      </div>
                      <h3 className="text-xl font-bold text-white">Daily Operations via WhatsApp Triggers</h3>
                      <p className="text-xs text-neutral-400 mt-1">
                        Instant 1-click visitor pre-clearance gate passes, downloadable branded PDF receipts, and quiet hours sanctuary.
                      </p>
                    </div>

                    <Link
                      href="/resident"
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#D4AF37] text-[#0A0D12] text-xs font-semibold hover:bg-[#F5E6B8] transition self-start sm:self-auto"
                    >
                      <span>Open Resident Hub</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-4 rounded-xl bg-[#070A0F] border border-white/[0.06] space-y-2">
                      <div className="flex items-center gap-2 text-xs font-semibold text-white">
                        <KeyRound className="w-4 h-4 text-[#D4AF37]" />
                        <span>1-Click Visitor Passes</span>
                      </div>
                      <p className="text-[11px] text-neutral-400 leading-relaxed">
                        Generates a secure 6-digit code (e.g. <code>EST-849204</code>) with an instant "Share via WhatsApp" pass to drivers or guests.
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-[#070A0F] border border-white/[0.06] space-y-2">
                      <div className="flex items-center gap-2 text-xs font-semibold text-white">
                        <Receipt className="w-4 h-4 text-[#D4AF37]" />
                        <span>Downloadable PDF Receipts</span>
                      </div>
                      <p className="text-[11px] text-neutral-400 leading-relaxed">
                        Every settled invoice generates an official cryptographically hashed PDF voucher ready to download or print.
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-[#070A0F] border border-white/[0.06] space-y-2">
                      <div className="flex items-center gap-2 text-xs font-semibold text-white">
                        <Wrench className="w-4 h-4 text-[#D4AF37]" />
                        <span>Photo Maintenance Tickets</span>
                      </div>
                      <p className="text-[11px] text-neutral-400 leading-relaxed">
                        Attach photo evidence directly. Certified HVAC, inverter, or plumbing contractors dispatched and paid from escrow.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              {activePortalTab === "admin" && (
                <motion.div
                  key="admin-tab"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2.5 py-0.5 rounded text-[10px] font-mono uppercase bg-[#D4AF37]/15 text-[#DFCA9E] border border-[#D4AF37]/30">
                          Studio Master Operations
                        </span>
                        <span className="text-xs text-neutral-400 font-mono">Elevation Studio Executive Desk</span>
                      </div>
                      <h3 className="text-xl font-bold text-white">Compound Onboarding & Portfolio Escrow Oversight</h3>
                      <p className="text-xs text-neutral-400 mt-1">
                        Onboard new compounds, configure Paystack subaccounts, assign certified contractor dispatches, and trigger WhatsApp notifications.
                      </p>
                    </div>

                    <Link
                      href="/admin"
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#D4AF37] text-[#0A0D12] text-xs font-semibold hover:bg-[#F5E6B8] transition self-start sm:self-auto"
                    >
                      <span>Open Master Ops</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-4 rounded-xl bg-[#070A0F] border border-white/[0.06] space-y-1">
                      <span className="text-[10px] font-mono text-neutral-400 uppercase block">Active Estates Under Watch</span>
                      <span className="text-xl font-bold font-mono text-white block mt-1">3 Premier Compounds</span>
                      <span className="text-[10px] text-neutral-400 font-mono block">Old Ikoyi · Banana Island · Maitama</span>
                    </div>

                    <div className="p-4 rounded-xl bg-[#070A0F] border border-white/[0.06] space-y-1">
                      <span className="text-[10px] font-mono text-neutral-400 uppercase block">Total Escrow Liquidity Held</span>
                      <span className="text-xl font-bold font-mono text-white block mt-1">100% Segregated</span>
                      <span className="text-[10px] text-neutral-400 font-mono block">Power Generators, Solar & RO Water</span>
                    </div>

                    <div className="p-4 rounded-xl bg-[#070A0F] border border-white/[0.06] space-y-1">
                      <span className="text-[10px] font-mono text-neutral-400 uppercase block">Platform-wide Yield Margin</span>
                      <span className="text-xl font-bold font-mono text-[#DFCA9E] block mt-1">7.5% Asset Retainer</span>
                      <span className="text-[10px] text-neutral-400 font-mono block">Zero-commingling audit verified</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* 3. The 4 Pillars of Asset Lifecycle Protection */}
      <section className="py-20 sm:py-28 bg-[#07090E] border-b border-white/[0.08]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-mono uppercase tracking-wider text-[#D4AF37] font-semibold">
              The Elevation Standard
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold text-white mt-1.5">
              Four Pillars of Asset Lifecycle Protection
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 mt-2">
              How Elevated Stay guarantees structural value preservation, steady net remittance, and communal harmony.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Pillar 1 */}
            <div className="p-6 rounded-3xl bg-[#0D111A] border border-white/[0.06] hover:border-[#D4AF37]/35 transition-all space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#D4AF37]/10 border border-[#D4AF37]/25 flex items-center justify-center text-[#D4AF37]">
                <Scale className="w-6 h-6 text-[#D4AF37]" />
              </div>
              <h3 className="text-base font-bold text-white">01. Automated Split Routing</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                90%–95% of base rent routes directly to the landlord's subaccount, while 100% of service charges are segregated into dedicated compound facility escrows. Zero middleman commingling.
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="p-6 rounded-3xl bg-[#0D111A] border border-white/[0.06] hover:border-[#D4AF37]/35 transition-all space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#D4AF37]/10 border border-[#D4AF37]/25 flex items-center justify-center text-[#D4AF37]">
                <Wrench className="w-6 h-6 text-[#D4AF37]" />
              </div>
              <h3 className="text-base font-bold text-white">02. Preventative Engineering</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Quarterly certified overhauls for Daikin VRV chillers, solar BMS hybrid inverters, and reverse osmosis boreholes. Every repair requires photographic proof before escrow release.
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="p-6 rounded-3xl bg-[#0D111A] border border-white/[0.06] hover:border-[#D4AF37]/35 transition-all space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#D4AF37]/10 border border-[#D4AF37]/25 flex items-center justify-center text-[#D4AF37]">
                <Clock className="w-6 h-6 text-[#D4AF37]" />
              </div>
              <h3 className="text-base font-bold text-white">03. Annexure Peace Code</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Strict nocturnal quiet hours (22:00 – 07:00 WAT). Commercial party short-lets are contractually prohibited, preserving a tranquil sanctuary for resident families.
              </p>
            </div>

            {/* Pillar 4 */}
            <div className="p-6 rounded-3xl bg-[#0D111A] border border-white/[0.06] hover:border-[#D4AF37]/35 transition-all space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#D4AF37]/10 border border-[#D4AF37]/25 flex items-center justify-center text-[#D4AF37]">
                <Lock className="w-6 h-6 text-[#D4AF37]" />
              </div>
              <h3 className="text-base font-bold text-white">04. Zero Public Directory</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Occupied compounds and resident identities are strictly non-indexed over the public web. All access is protected by passwordless single-use magic links.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Curated Compound Exhibition (Slides) */}
      <section className="py-20 sm:py-28 bg-[#090C13] border-b border-white/[0.08]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-[#D4AF37] font-semibold flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-[#D4AF37]" /> Curated Asset Portfolio
              </span>
              <h2 className="text-2xl sm:text-4xl font-bold text-white mt-1.5">
                Premier Residential Compounds Under Protection
              </h2>
              <p className="text-xs sm:text-sm text-neutral-400 mt-1 max-w-2xl">
                Explore signature properties in Old Ikoyi, Banana Island, and Maitama operating under dedicated facility escrows.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-neutral-400">
              <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse" />
              <span>Real-Time Escrow Liquidity Live</span>
            </div>
          </div>

          <ArchitecturalSlides />
        </div>
      </section>

      {/* 4B. Nationwide Multi-State Operations Hubs */}
      <section className="py-20 sm:py-28 bg-[#07090E] border-b border-white/[0.08]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <NationwideHubs />
        </div>
      </section>

      {/* 5. Before & After Contractor Restoration Proof */}
      <section className="py-20 sm:py-28 bg-[#07090E] border-b border-white/[0.08] relative overflow-hidden">
        {/* Architectural atmospheric glow */}
        <div className="absolute top-1/2 left-0 w-96 h-96 bg-[#D4AF37]/5 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/[0.08]">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-full text-[10px] font-mono uppercase tracking-widest text-[#D4AF37] font-semibold bg-[#D4AF37]/10 border border-[#D4AF37]/25">
                  Lifecycle Engineering Assurance
                </span>
                <span className="text-xs text-neutral-400 font-mono hidden sm:inline">
                  Carrier · Daikin · Schneider Electric Certified
                </span>
              </div>
              <h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
                Before & After Contractor Restoration Proof
              </h2>
              <p className="text-xs sm:text-sm text-neutral-400 max-w-2xl leading-relaxed">
                Landlords enjoy full passive oversight without attending to maintenance emergencies. Certified contractor repairs require photographic telemetry and Quantity Surveyor sign-off before escrow release.
              </p>
            </div>

            <Link
              href="/landlord"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.04] hover:bg-[#D4AF37]/10 border border-white/10 hover:border-[#D4AF37]/40 text-xs font-mono text-[#DFCA9E] transition-all group shrink-0"
            >
              <span>View Audit Ledger</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Interactive Drag Card with Multi-System Telemetry (7 Cols) */}
            <div className="lg:col-span-7">
              <InspectionSlider
                title={highlightTicket.title}
                category={highlightTicket.category}
                compoundName={highlightTicket.compoundName}
                unitName={highlightTicket.unitName}
                contractorName={highlightTicket.contractorName || "Carrier & Daikin Certified Nigeria Ltd"}
                costAmount={highlightTicket.invoiceAmount || 485000}
                beforeImage={highlightTicket.beforePhotoUrl}
                afterImage={highlightTicket.afterPhotoUrl || highlightTicket.beforePhotoUrl}
                notes={highlightTicket.contractorNotes || "Inspected & certified."}
                tickets={MOCK_MAINTENANCE_TICKETS}
              />
            </div>

            {/* The Asset Protection Standard (5 Cols) */}
            <div className="lg:col-span-5 space-y-6">
              <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-[#0D111A] to-[#080B10] border border-white/[0.09] space-y-6 shadow-2xl relative overflow-hidden">
                {/* Subtle gold line accent */}
                <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#D4AF37]/60 to-transparent" />

                {/* Section Header */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#DFCA9E]">
                    <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
                    <span>The Asset Protection Standard</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-snug">
                    Why Preventative Lifecycle Audits Stop Capital Decay
                  </h3>
                  <p className="text-xs text-neutral-300 leading-relaxed pt-1">
                    In prime Lagos and Abuja residential properties (Old Ikoyi, Banana Island, Maitama), major capital loss occurs when minor issues (VRV chiller coil acidity from marine air, borehole TDS membrane saturation, solar BMS balance delays) are ignored until total component failure.
                  </p>
                </div>

                {/* Audited Financial & Engineering KPI Ribbon */}
                <div className="grid grid-cols-3 gap-2.5 p-3 rounded-2xl bg-black/50 border border-white/[0.06] text-center">
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-mono text-neutral-400 uppercase block">Landlord Cost</span>
                    <span className="text-sm sm:text-base font-bold font-mono text-emerald-400 block">₦0.00</span>
                    <span className="text-[9px] text-neutral-400 font-mono block">100% Escrow</span>
                  </div>
                  <div className="space-y-0.5 border-x border-white/[0.08]">
                    <span className="text-[10px] font-mono text-neutral-400 uppercase block">Efficiency</span>
                    <span className="text-sm sm:text-base font-bold font-mono text-[#DFCA9E] block">98.4%</span>
                    <span className="text-[9px] text-neutral-400 font-mono block">Restored Spec</span>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-mono text-neutral-400 uppercase block">Overhaul Cycle</span>
                    <span className="text-sm sm:text-base font-bold font-mono text-white block">90 Days</span>
                    <span className="text-[9px] text-neutral-400 font-mono block">QS Audited</span>
                  </div>
                </div>

                {/* The 3 Tenets of Capital Defense (Architectural Numbered Cards) */}
                <div className="space-y-3.5 pt-1 text-xs">
                  {/* Tenet 01 */}
                  <div className="p-3.5 rounded-2xl bg-[#090C14] border border-white/[0.06] hover:border-[#D4AF37]/30 transition-all space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#D4AF37]/20 text-[#DFCA9E]">
                        01
                      </span>
                      <strong className="text-white text-xs font-semibold">Quarterly Scheduled Overhauls</strong>
                    </div>
                    <p className="text-neutral-400 text-[11px] leading-relaxed pl-7">
                      Funded directly from the estate's ringfenced facility escrow balance. Pre-emptive servicing before peak heat or rain cycles prevents emergency compressor burnouts and maintains 99.4% cooling uptime.
                    </p>
                  </div>

                  {/* Tenet 02 */}
                  <div className="p-3.5 rounded-2xl bg-[#090C14] border border-white/[0.06] hover:border-[#D4AF37]/30 transition-all space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300">
                        02
                      </span>
                      <strong className="text-white text-xs font-semibold">Zero Out-of-Pocket Surprises</strong>
                    </div>
                    <p className="text-neutral-400 text-[11px] leading-relaxed pl-7">
                      Landlords never get unexpected repair invoices from opportunistic contractors. All scope, OEM parts, and labour rates are strictly pre-negotiated under institutional master service agreements.
                    </p>
                  </div>

                  {/* Tenet 03 */}
                  <div className="p-3.5 rounded-2xl bg-[#090C14] border border-white/[0.06] hover:border-[#D4AF37]/30 transition-all space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300">
                        03
                      </span>
                      <strong className="text-white text-xs font-semibold">Quantity Surveyor Sign-Off</strong>
                    </div>
                    <p className="text-neutral-400 text-[11px] leading-relaxed pl-7">
                      All repairs are photographically audited and timestamped on your view-only dashboard before any funds leave the dedicated subaccount.
                    </p>
                  </div>
                </div>

                {/* Institutional Verification Stamp */}
                <div className="pt-3 border-t border-white/[0.07] flex items-center justify-between text-[10px] font-mono text-neutral-400">
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-[#D4AF37]" />
                    <span>Elevation Studio QS Desk Verified</span>
                  </div>
                  <span className="text-neutral-400">License QS-NG-88421</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5B. Live IoT Estate Facilities Diagnostics */}
      <section className="py-20 sm:py-28 bg-[#090C13] border-b border-white/[0.08]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <IoTTelemetryFeed />
        </div>
      </section>

      {/* 6. Nocturnal Peace & Annexure Radar */}
      <section className="py-20 sm:py-28 bg-[#07090E] border-b border-white/[0.08]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-mono uppercase tracking-wider text-[#D4AF37] font-semibold">
              Communal Harmony & Sanctions
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold text-white mt-1.5">
              Contractual Annexure Peace Enforcement
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 mt-2">
              High-net-worth residents expect absolute nocturnal silence and exclusivity. Elevated Stay enforces contractual quiet hours and bans party disruptions.
            </p>
          </div>

          <NocturnalPeaceRadar />
        </div>
      </section>

      {/* 6B. Headless WhatsApp Cloud Enterprise Gateway */}
      <section className="py-20 sm:py-28 bg-[#090C13] border-b border-white/[0.08]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <WhatsAppBotSimulator />
        </div>
      </section>

      {/* 7. Institutional Advisory Inquiries */}
      <section className="py-20 sm:py-28 bg-[#07090E] border-b border-white/[0.08]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <span className="text-xs font-mono uppercase tracking-wider text-[#D4AF37] font-semibold">
            Institutional Asset Management Inquiries
          </span>
          <h2 className="text-3xl sm:text-5xl font-bold text-white leading-tight">
            Commission Asset Lifecycle Protection for Your Residential Compound
          </h2>
          <p className="text-xs sm:text-sm text-neutral-300 max-w-2xl mx-auto leading-relaxed">
            Whether you own a multi-family compound in Old Ikoyi, a diplomatic residence in Maitama, or a diaspora residential portfolio across Lagos, our asset architects are available for private consultations.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="mailto:private@stay.com.ng"
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-[#D4AF37] to-[#B38F24] hover:from-[#F5E6B8] hover:to-[#D4AF37] text-[#0A0D12] font-semibold text-xs transition shadow-lg"
            >
              Request Private Portfolio Advisory
            </a>
            <Link
              href="/landlord"
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-[#121722] hover:bg-[#18202E] text-white border border-white/10 text-xs font-medium transition"
            >
              Preview Passive Oversight Ledger
            </Link>
          </div>

          <p className="text-[11px] text-neutral-500 font-mono pt-4">
            Direct Concierge Desk: concierge@stay.com.ng · Old Ikoyi & Maitama Desks
          </p>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
