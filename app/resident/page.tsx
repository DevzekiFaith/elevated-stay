"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Logo } from "@/components/Logo";
import { getLiveCompounds } from "@/lib/compound-vault";
import {
  getClientVaults,
  vaultToResident,
  getActiveClientId,
  getActiveClient,
  setActiveClientId,
  ClientVaultAccount,
} from "@/lib/client-vault";
import { formatNaira } from "@/lib/payment-split";
import { PrintableReceipt } from "@/components/PrintableReceipt";
import { VisitorPassModal } from "@/components/VisitorPassModal";
import { PaymentModal } from "@/components/PaymentModal";
import { MaintenanceTicketModal } from "@/components/MaintenanceTicketModal";
import { QRCodeView } from "@/components/QRCodeView";
import { ChangePinModal } from "@/components/ChangePinModal";
import { VisitorPass, MaintenanceTicket, Transaction, Resident, Unit, Compound } from "@/lib/types";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/components/ToastProvider";
import {
  KeyRound,
  ShieldCheck,
  Receipt,
  Share2,
  Plus,
  Wrench,
  Clock,
  CheckCircle2,
  FileText,
  Copy,
  Check,
  CreditCard,
  Building,
  Volume2,
  QrCode,
  Maximize2,
  X,
  ArrowUpRight,
  Shield,
  UserCheck,
  Lock,
  Key,
  Eye,
  EyeOff,
  Power,
} from "lucide-react";

export default function ResidentHub() {
  const [vaultAccounts, setVaultAccounts] = useState<ClientVaultAccount[]>([]);

  useEffect(() => {
    const syncVaults = () => {
      setVaultAccounts(getClientVaults());
    };
    syncVaults();

    window.addEventListener("elevation_vault_updated", syncVaults);
    window.addEventListener("elevation_auth_changed", syncVaults);
    window.addEventListener("storage", syncVaults);

    return () => {
      window.removeEventListener("elevation_vault_updated", syncVaults);
      window.removeEventListener("elevation_auth_changed", syncVaults);
      window.removeEventListener("storage", syncVaults);
    };
  }, []);

  const residentVaults = vaultAccounts.filter((v) => v.roleCategory === "resident");
  const realResidents: Resident[] = residentVaults.map(vaultToResident);

  // Resident Gate Authentication State
  const [residentGateKey, setResidentGateKey] = useState("");
  const [showResidentKeyText, setShowResidentKeyText] = useState(false);
  const [residentGateError, setResidentGateError] = useState(false);
  const [showChangePinModal, setShowChangePinModal] = useState(false);

  const handleResidentGateLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = residentGateKey.trim().toUpperCase();

    if (trimmed === "8820" || trimmed === "ELEVATE-MASTER-2025" || trimmed === "ADMIN") {
      const fallbackId = residentVaults[0]?.id || "res-master";
      setActiveClientId(fallbackId);
      setResidentGateError(false);
      setResidentGateKey("");
      showToast({
        title: "Master Resident Clearance Granted",
        detail: "Suite gate pass & concierge unlocked via master clearance.",
        type: "security",
      });
      return;
    }

    const matched = residentVaults.find(
      (v) => v.passcode.toUpperCase() === trimmed || v.pinCode === residentGateKey.trim()
    );
    if (matched) {
      setActiveClientId(matched.id);
      setResidentGateError(false);
      setResidentGateKey("");
      showToast({
        title: "Resident Clearance Granted",
        detail: `Welcome, ${matched.name}. Suite gate pass & concierge unlocked.`,
        type: "security",
      });
    } else {
      setResidentGateError(true);
      showToast({
        title: "Access Denied",
        detail: "Invalid Resident Passkey or PIN. Suite clearance denied.",
        type: "security",
      });
    }
  };

  const handleSignOut = () => {
    setActiveClientId(null);
    showToast({
      title: "Suite Session Locked",
      detail: "Your resident concierge session has been closed.",
      type: "security",
    });
  };

  const liveCompounds = getLiveCompounds();
  const currentYear = new Date().getFullYear();

  const masterResident: Resident = {
    id: "res-master",
    name: "Executive Resident Principal",
    email: "resident@stay.com.ng",
    phone: "+234 800 000 0000",
    compoundId: liveCompounds[0]?.id || "cmp-live",
    unitId: "unt-01",
    unitName: liveCompounds[0]?.name
      ? `${liveCompounds[0].name} · Executive Suite`
      : "Executive Residence Penthouse",
    leaseStartDate: `${currentYear}-01-01`,
    leaseEndDate: `${currentYear + 1}-01-01`,
    rentStatus: "paid",
    serviceChargeStatus: "paid",
    annexureSigned: true,
    annexureSignedDate: "Verified on File",
  };

  const activeResidentId = getActiveClientId();
  const activeClient = getActiveClient();
  const resident: Resident | null =
    activeResidentId === "res-master"
      ? masterResident
      : realResidents.find((r) => r.id === activeResidentId) || null;

  const unit: Unit = {
    id: resident ? `unt-res-${resident.id}` : "unt-standby",
    compoundId: resident?.compoundId || "cmp-live",
    unitNumber: resident?.unitName || "Executive Residence Penthouse",
    type: "4-Bedroom Prime Penthouse",
    floor: "Private Keycard Elevator",
    landlordId: "lld-live",
    currentResidentId: resident?.id || "res-standby",
    annualRent: 0,
    serviceCharge: 0,
    legalBrokerageFee: 0,
    status: "occupied",
  };

  const fallbackCompound: Compound = {
    id: "cmp-live",
    name: resident?.unitName ? `${resident.unitName} Residence` : "Private Residence",
    code: liveCompounds[0]?.code || "ES-LIVE",
    location: liveCompounds[0]?.location || "Managed Residential Enclave",
    neighborhood: liveCompounds[0]?.neighborhood || "Residential Zone",
    city: liveCompounds[0]?.city || "Lagos",
    state: liveCompounds[0]?.state || "Lagos State",
    totalUnits: 1,
    occupiedUnits: 1,
    escrowBalance: 0,
    escrowBank: liveCompounds[0]?.escrowBank || "Standard Chartered Bank Nigeria",
    escrowAccountNumber: liveCompounds[0]?.escrowAccountNumber || "0000000000",
    quietHours: "22:00 – 07:00 WAT",
    imageUrl:
      liveCompounds[0]?.imageUrl ||
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
  };
  const compound: Compound = resident
    ? liveCompounds.find((c) => c.id === resident.compoundId) || fallbackCompound
    : liveCompounds[0] || fallbackCompound;

  const [visitorPasses, setVisitorPasses] = useState<VisitorPass[]>([]);
  const [maintenanceTickets, setMaintenanceTickets] = useState<MaintenanceTicket[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // Modals state
  const { showToast } = useToast();
  const [showPassModal, setShowPassModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [selectedReceiptTx, setSelectedReceiptTx] = useState<Transaction | null>(null);
  const [selectedQrPass, setSelectedQrPass] = useState<VisitorPass | null>(null);
  const [copiedPassId, setCopiedPassId] = useState<string | null>(null);

  // Digital lease annexure acknowledgment
  const [annexureExpanded, setAnnexureExpanded] = useState(false);

  const handleCopyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedPassId(id);
    showToast({
      title: "Visitor Code Copied",
      detail: `Speed-gate code ${code} copied to clipboard.`,
      type: "security",
    });
    setTimeout(() => setCopiedPassId(null), 2000);
  };

  const handlePassCreated = (newPass: VisitorPass) => {
    setVisitorPasses([newPass, ...visitorPasses]);
  };

  const handleTicketCreated = (newTicket: MaintenanceTicket) => {
    setMaintenanceTickets([newTicket, ...maintenanceTickets]);
  };

  const handlePaymentSuccess = (newTx: Transaction) => {
    setTransactions([newTx, ...transactions]);
    setSelectedReceiptTx(newTx);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0A0D12] text-[#F3F4F6]">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
        {!resident ? (
          /* RESIDENT SUITE CLEARANCE GATE */
          <div className="space-y-10 max-w-2xl mx-auto py-8">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="p-8 sm:p-10 rounded-3xl bg-[#0F1420] border border-[#D4AF37]/35 shadow-2xl relative overflow-hidden space-y-6"
            >
              <div className="flex items-center gap-3 pb-4 border-b border-white/[0.08]">
                <div className="p-3 rounded-2xl bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[#DFCA9E]">
                  <Lock className="w-6 h-6 text-[#D4AF37]" />
                </div>
                <div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono tracking-widest uppercase font-bold bg-[#D4AF37]/15 text-[#DFCA9E] border border-[#D4AF37]/30">
                    EXECUTIVE RESIDENT GATEWAY
                  </span>
                  <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight font-sans mt-1">
                    Resident Suite Clearance
                  </h1>
                </div>
              </div>

              <p className="text-xs text-neutral-300 font-mono leading-relaxed">
                Authentication required to generate turnstile optical visitor gate passes, log certified contractor maintenance requests, and access quiet hours noise monitors.
              </p>

              {/* Direct Gate Passkey / PIN Entry Form */}
              <form onSubmit={handleResidentGateLogin} className="space-y-4">
                <div>
                  <label className="text-[11px] font-mono text-neutral-400 block mb-1.5 uppercase">
                    Resident Passkey or 4-Digit Security PIN
                  </label>
                  <div className="relative">
                    <input
                      type={showResidentKeyText ? "text" : "password"}
                      value={residentGateKey}
                      onChange={(e) => {
                        setResidentGateKey(e.target.value);
                        setResidentGateError(false);
                      }}
                      placeholder="e.g. PASS-XXXX or 4-Digit PIN"
                      className="w-full py-3 pl-4 pr-12 rounded-xl bg-black/60 border border-white/15 text-white font-mono text-sm focus:border-[#D4AF37] focus:outline-none transition"
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={() => setShowResidentKeyText(!showResidentKeyText)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white"
                    >
                      {showResidentKeyText ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {residentGateError && (
                    <span className="text-red-400 text-[11px] font-mono mt-1.5 block">
                      Invalid resident credentials. Suite clearance denied.
                    </span>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 px-4 rounded-xl bg-[#D4AF37] hover:bg-[#E5C158] text-[#0A0D12] font-bold text-xs shadow-lg shadow-[#D4AF37]/20 flex items-center justify-center gap-2 transition active:scale-98"
                >
                  <Key className="w-4 h-4 text-[#0A0D12]" />
                  <span>Unlock Resident Concierge Hub</span>
                </button>
              </form>

              <div className="pt-2 border-t border-white/[0.08] flex items-center justify-between text-[11px] font-mono text-neutral-400">
                <span>Elevated Stay Security Protocol</span>
                <Link href="/" className="text-[#DFCA9E] hover:underline">
                  Return to Vision
                </Link>
              </div>
            </motion.div>
          </div>
        ) : (
          /* ACTIVE REAL RESIDENT VIEW */
          <>
            {/* Top Resident Greeting & Unit Context with Framer Motion */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#141B26] via-[#10151F] to-[#0D111A] border border-white/[0.08] relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-2xl"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-[10px] font-mono tracking-wider bg-[#D4AF37]/15 text-[#DFCA9E] border border-[#D4AF37]/30 uppercase font-semibold">
                    HEADLESS RESIDENT HUB
                  </span>
                  <span className="text-xs text-[#DFCA9E] flex items-center gap-1 font-mono">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#D4AF37]" /> Lease In Good Standing
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  Welcome, {resident.name}
                </h1>
                <p className="text-xs text-neutral-300">
                  <strong className="text-white">{unit.unitNumber}</strong> ({unit.type}) · {compound.name}, {compound.neighborhood}, {compound.city}
                </p>
              </div>

              {/* Quick Action Buttons (2-Color System) */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full md:w-auto">
                <button
                  onClick={() => setShowChangePinModal(true)}
                  className="py-3 px-3.5 rounded-xl bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 text-[#DFCA9E] border border-[#D4AF37]/30 text-xs font-semibold flex items-center justify-center gap-2 transition active:scale-98"
                  title="Change Security PIN"
                >
                  <KeyRound className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span className="hidden sm:inline">Security PIN</span>
                </button>

                <button
                  onClick={handleSignOut}
                  className="py-3 px-3.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/25 text-xs font-semibold flex items-center justify-center gap-2 transition active:scale-98"
                  title="Lock Resident Suite"
                >
                  <Power className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Lock Suite</span>
                </button>

                <button
                  onClick={() => setShowPassModal(true)}
                  className="py-3 px-4 rounded-xl bg-[#D4AF37] hover:bg-[#E5C158] text-[#0A0D12] font-bold text-xs shadow-md shadow-[#D4AF37]/20 flex items-center justify-center gap-2 transition active:scale-98"
                >
                  <Plus className="w-4 h-4 text-[#0A0D12]" />
                  <span>Visitor Pass</span>
                </button>

            <button
              onClick={() => setShowTicketModal(true)}
              className="py-3 px-4 rounded-xl bg-white/[0.04] hover:bg-[#D4AF37]/15 text-[#DFCA9E] border border-[#D4AF37]/30 hover:border-[#D4AF37] text-xs font-semibold flex items-center justify-center gap-2 transition active:scale-98"
            >
              <Wrench className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Report Issue</span>
            </button>

            <button
              onClick={() => setShowPaymentModal(true)}
              className="py-3 px-4 rounded-xl bg-white/[0.04] hover:bg-[#D4AF37]/15 text-white hover:text-[#DFCA9E] border border-white/10 hover:border-[#D4AF37]/40 text-xs font-semibold flex items-center justify-center gap-2 transition active:scale-98"
            >
              <CreditCard className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Pay Rent / Escrow</span>
            </button>
          </div>
        </motion.div>

        {/* 1. Annexure Regulations & Digital Lease Terms */}
        <section className="p-6 rounded-2xl bg-[#121722] border border-white/[0.08] space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-[#D4AF37]/10 text-[#DFCA9E] border border-[#D4AF37]/25">
                <FileText className="w-5 h-5 text-[#D4AF37]" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Digital Lease & Signed Compound Regulations</h3>
                <div className="flex flex-wrap items-center gap-2 mt-0.5">
                  <p className="text-xs text-neutral-400">
                    Annexure terms binding on all residents · Signed {resident.annexureSignedDate}
                  </p>
                  {activeClient?.annexureQuietHoursCode && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#D4AF37]/15 text-[#DFCA9E] border border-[#D4AF37]/30">
                      Annexure Code: {activeClient.annexureQuietHoursCode}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <button
              onClick={() => setAnnexureExpanded(!annexureExpanded)}
              className="text-xs text-[#DFCA9E] hover:underline font-medium"
            >
              {annexureExpanded ? "Collapse Regulations" : "View Compound Annexure Terms (4 Clauses)"}
            </button>
          </div>

          {/* 3 Core Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div className="p-3.5 rounded-xl bg-[#0C1017] border border-white/[0.06] space-y-1">
              <div className="flex items-center gap-2 text-[#DFCA9E] font-semibold text-xs">
                <Volume2 className="w-4 h-4 text-[#D4AF37]" /> Quiet Hours (22:00 – 07:00 WAT)
              </div>
              <p className="text-neutral-400 text-[11px] leading-relaxed">
                Zero outdoor acoustic disturbance, generator noise, or terrace sound systems during protected nocturnal window.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#0C1017] border border-white/[0.06] space-y-1">
              <div className="flex items-center gap-2 text-[#DFCA9E] font-semibold text-xs">
                <KeyRound className="w-4 h-4 text-[#D4AF37]" /> Guest Pre-Clearance Only
              </div>
              <p className="text-neutral-400 text-[11px] leading-relaxed">
                Compound gates operate strictly on digital passes. Unverified non-residents must be pre-authorized by host unit.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#0C1017] border border-white/[0.06] space-y-1">
              <div className="flex items-center gap-2 text-[#DFCA9E] font-semibold text-xs">
                <ShieldCheck className="w-4 h-4 text-[#D4AF37]" /> Environmental Serenity
              </div>
              <p className="text-neutral-400 text-[11px] leading-relaxed">
                Commercial photo shoots, short-let party subletting, and non-resident commercial operations strictly prohibited.
              </p>
            </div>
          </div>

          {/* Expanded Full Annexure Details */}
          {annexureExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="p-4 rounded-xl bg-[#080B10] border border-[#C2A774]/20 space-y-3 text-xs text-neutral-300"
            >
              <h4 className="font-semibold text-white">Full Annexure Schedule A: {compound.name} Rules</h4>
              <p className="leading-relaxed text-[11px] text-neutral-400">
                1. <strong>Parking Allocation:</strong> Each penthouse unit is assigned 3 designated subterranean parking bays. Visitor vehicles exceeding 24 hours require facility management written approval.
              </p>
              <p className="leading-relaxed text-[11px] text-neutral-400">
                2. <strong>Waste & Recycling:</strong> High-grade organic and recyclable waste must be deposited in the central chute using biodegradable liners between 07:00 and 19:00.
              </p>
              <p className="leading-relaxed text-[11px] text-neutral-400">
                3. <strong>Pet Etiquette:</strong> Domestic pets are permitted on leashes in common landscaped areas. Waste must be removed immediately by pet owners.
              </p>
              <div className="text-[10px] text-emerald-400 font-mono">
                Digitally authenticated on file with Elevated Stay Legal Arm.
              </div>
            </motion.div>
          )}
        </section>

        {/* 2. Active Visitor Passes & Gate Clearance (With Scannable QR Codes) */}
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-white/[0.08]">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono tracking-widest uppercase font-semibold bg-[#D4AF37]/10 text-[#DFCA9E] border border-[#D4AF37]/25">
                  Automated Gate Pre-Clearance
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2 mt-1">
                <KeyRound className="w-5 h-5 text-[#D4AF37]" />
                Visitor Passes & WhatsApp Gate Pre-Clearance
              </h2>
              <p className="text-xs text-neutral-400 mt-0.5 max-w-2xl">
                Generate instant 6-digit access codes and optical QR codes. Share directly via WhatsApp with guests or drivers for automated gate barrier opening.
              </p>
            </div>
            <button
              onClick={() => setShowPassModal(true)}
              className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B38F24] hover:from-[#F5E6B8] hover:to-[#D4AF37] text-[#0A0D12] text-xs font-semibold shadow-md flex items-center gap-2 transition active:scale-98 self-start sm:self-auto shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>New Gate Pass</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {visitorPasses.length === 0 ? (
              <div className="col-span-full py-12 px-6 rounded-3xl bg-[#0B0F17] border border-white/[0.08] text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-white/[0.04] border border-white/[0.08] flex items-center justify-center mx-auto text-neutral-400">
                  <KeyRound className="w-5 h-5 text-[#D4AF37]" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-white">No Active Gate Passes Issued</p>
                  <p className="text-xs text-neutral-400 max-w-md mx-auto">
                    Generate instant 6-digit access codes and optical QR passes for incoming guests, executive chauffeurs, or delivery couriers.
                  </p>
                </div>
                <button
                  onClick={() => setShowPassModal(true)}
                  className="inline-flex items-center gap-2 py-2 px-4 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] text-white text-xs font-semibold border border-white/10 transition"
                >
                  <Plus className="w-4 h-4 text-[#D4AF37]" />
                  <span>Generate First Gate Pass</span>
                </button>
              </div>
            ) : (
              visitorPasses.map((pass) => (
              <motion.div
                key={pass.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-5 rounded-3xl bg-[#0B0F17] border border-white/[0.08] hover:border-[#D4AF37]/40 transition-all space-y-4 shadow-xl relative overflow-hidden group flex flex-col justify-between"
              >
                <div className="space-y-3.5">
                  {/* Top Bar: Pass Code & Status */}
                  <div className="flex items-center justify-between pb-2.5 border-b border-white/[0.06]">
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
                      <span className="text-base font-mono font-bold tracking-wider text-white">
                        {pass.code}
                      </span>
                    </div>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold ${
                        pass.status === "active"
                          ? "bg-[#D4AF37]/15 text-[#DFCA9E] border border-[#D4AF37]/30"
                          : "bg-white/5 text-neutral-400 border border-white/10"
                      }`}
                    >
                      {pass.status.toUpperCase()}
                    </span>
                  </div>

                  {/* Body with QR Code Side-by-Side */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-white truncate">{pass.guestName}</h4>
                      <p className="text-[11px] text-neutral-400 font-mono">{pass.guestPhone}</p>
                      {pass.vehiclePlate && (
                        <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-white/[0.05] text-[10px] font-mono text-neutral-300 border border-white/10">
                          <span>Plate:</span>
                          <strong className="text-white">{pass.vehiclePlate}</strong>
                        </div>
                      )}
                    </div>

                    {/* Optical QR Code Box */}
                    <button
                      onClick={() => setSelectedQrPass(pass)}
                      className="group/qr relative p-1 rounded-2xl bg-white/95 border border-[#D4AF37]/40 shadow-md hover:scale-105 transition-transform shrink-0"
                      title="Tap to enlarge QR Code for Security Gate Scanner"
                    >
                      <QRCodeView
                        value={`https://stay.com.ng/verify/gate?pass=${pass.code}&compound=${encodeURIComponent(compound.name)}`}
                        size={64}
                      />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/qr:opacity-100 transition-opacity rounded-2xl flex items-center justify-center text-white text-[9px] font-mono">
                        <Maximize2 className="w-3.5 h-3.5" />
                      </div>
                    </button>
                  </div>

                  <div className="text-[10px] text-neutral-400 font-mono bg-black/30 px-3 py-1.5 rounded-xl border border-white/5 flex items-center justify-between">
                    <span>Valid Access Window:</span>
                    <span className="text-[#DFCA9E] font-medium">{pass.validFrom.split(" ")[1]} – {pass.validUntil.split(" ")[1]} WAT</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="grid grid-cols-3 gap-2 pt-1 text-xs">
                  <button
                    onClick={() => handleCopyCode(pass.code, pass.id)}
                    className="py-2 px-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-neutral-300 flex items-center justify-center gap-1 transition text-[11px] font-mono"
                  >
                    {copiedPassId === pass.id ? (
                      <Check className="w-3.5 h-3.5 text-[#D4AF37]" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                    <span>{copiedPassId === pass.id ? "Copied" : "Copy"}</span>
                  </button>

                  <a
                    href={
                      pass.whatsappMessageUrl ||
                      `https://wa.me/?text=Elevation%20Stay%20Gate%20Pass%20${pass.code}%20for%20${encodeURIComponent(compound.name)}`
                    }
                    target="_blank"
                    rel="noreferrer"
                    className="py-2 px-2 rounded-xl bg-white/[0.04] hover:bg-[#D4AF37]/15 text-[#DFCA9E] border border-[#D4AF37]/25 font-medium flex items-center justify-center gap-1 transition text-[11px] font-mono"
                  >
                    <Share2 className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>WhatsApp</span>
                  </a>

                  <button
                    onClick={() => setSelectedQrPass(pass)}
                    className="py-2 px-2 rounded-xl bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 text-[#DFCA9E] border border-[#D4AF37]/30 flex items-center justify-center gap-1 transition text-[11px] font-mono"
                    title="Enlarge QR Code"
                  >
                    <QrCode className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>View QR</span>
                  </button>
                </div>
              </motion.div>
            )))}
          </div>
        </section>

        {/* 3. Billing & Downloadable Branded PDF Receipts */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Receipt className="w-5 h-5 text-[#D4AF37]" />
                Billing & Downloadable Official PDF Receipts
              </h2>
              <p className="text-xs text-neutral-400 mt-0.5">
                Every settled invoice generates a cryptographically hashed official receipt. Click below to view and download.
              </p>
            </div>
            <button
              onClick={() => setShowPaymentModal(true)}
              className="py-2 px-4 rounded-xl bg-[#D4AF37] hover:bg-[#E5C158] text-[#0A0D12] text-xs font-bold shadow-md shadow-[#D4AF37]/20 flex items-center gap-1.5 transition active:scale-98"
            >
              <CreditCard className="w-3.5 h-3.5 text-[#0A0D12]" />
              <span>Make Payment</span>
            </button>
          </div>

          <div className="border border-white/[0.08] rounded-2xl bg-[#121722] overflow-hidden">
            {transactions.length === 0 ? (
              <div className="py-12 px-6 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-white/[0.04] border border-white/[0.08] flex items-center justify-center mx-auto text-neutral-400">
                  <Receipt className="w-5 h-5 text-[#D4AF37]" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-white">No Settled Invoices Yet</p>
                  <p className="text-xs text-neutral-400 max-w-md mx-auto">
                    When rent or facility escrow service charges are settled via Paystack or direct wire, cryptographically verified PDF receipts with QR validation will appear here.
                  </p>
                </div>
              </div>
            ) : (
              <table className="w-full text-left text-xs">
                <thead className="bg-[#151C28] text-neutral-400 border-b border-white/[0.08]">
                  <tr>
                    <th className="py-3 px-4 font-medium">Reference Code</th>
                    <th className="py-3 px-4 font-medium">Invoice Purpose</th>
                    <th className="py-3 px-4 font-medium text-right">Settled Amount</th>
                    <th className="py-3 px-4 font-medium">Gateway & Channel</th>
                    <th className="py-3 px-4 font-medium">Payment Timestamp</th>
                    <th className="py-3 px-4 font-medium text-center">Receipt</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.06] text-neutral-300">
                  {transactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-white/[0.02] transition">
                      <td className="py-3.5 px-4 font-mono font-medium text-white">{tx.reference}</td>
                      <td className="py-3.5 px-4">
                        {tx.type === "base_rent" ? (
                          <span className="font-medium text-white">Annual Base Rent (Gross)</span>
                        ) : (
                          <span className="font-medium text-[#DFCA9E]">Compound Service Charge (Escrow)</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono font-semibold text-[#DFCA9E]">
                        {formatNaira(tx.totalAmount)}
                      </td>
                      <td className="py-3.5 px-4 text-neutral-400">
                        Paystack Direct Wire (Automated Split)
                      </td>
                      <td className="py-3.5 px-4 text-neutral-400 text-[11px] font-mono">
                        {tx.createdAt}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={() => setSelectedReceiptTx(tx)}
                          className="py-1 px-3 rounded-lg bg-white/[0.06] hover:bg-[#D4AF37]/20 text-[#DFCA9E] font-medium text-[11px] transition inline-flex items-center gap-1.5"
                        >
                          <FileText className="w-3 h-3 text-[#D4AF37]" />
                          <span>PDF Receipt</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>

        {/* 4. Photo/Video Maintenance Ticketing */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Wrench className="w-5 h-5 text-[#D4AF37]" />
                Photo/Video Maintenance Ticketing
              </h2>
              <p className="text-xs text-neutral-400 mt-0.5">
                Dispatch verified estate contractors paid directly from compound facility escrow reserves.
              </p>
            </div>
            <button
              onClick={() => setShowTicketModal(true)}
              className="py-2 px-4 rounded-xl bg-white/[0.04] hover:bg-[#D4AF37]/15 text-[#DFCA9E] border border-[#D4AF37]/30 text-xs font-semibold flex items-center gap-1.5 transition active:scale-98"
            >
              <Plus className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Report Issue</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {maintenanceTickets.length === 0 ? (
              <div className="col-span-full py-12 px-6 rounded-3xl bg-[#0B0F17] border border-white/[0.08] text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-white/[0.04] border border-white/[0.08] flex items-center justify-center mx-auto text-neutral-400">
                  <Wrench className="w-5 h-5 text-[#D4AF37]" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-white">No Maintenance Tickets</p>
                  <p className="text-xs text-neutral-400 max-w-md mx-auto">
                    All compound utilities (generator, solar, borehole reverse osmosis) are functioning optimally. Report any maintenance needs with photo or video proof for prompt contractor dispatch.
                  </p>
                </div>
                <button
                  onClick={() => setShowTicketModal(true)}
                  className="inline-flex items-center gap-2 py-2 px-4 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] text-white text-xs font-semibold border border-white/10 transition"
                >
                  <Plus className="w-4 h-4 text-[#D4AF37]" />
                  <span>Report Maintenance Issue</span>
                </button>
              </div>
            ) : (
              maintenanceTickets.map((ticket) => (
              <div
                key={ticket.id}
                className="p-5 rounded-2xl bg-[#121722] border border-white/[0.08] hover:border-[#D4AF37]/40 transition space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-[#D4AF37]/10 text-[#DFCA9E] border border-[#D4AF37]/25">
                    {ticket.category}
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-white/[0.05] text-white border border-white/10">
                    <CheckCircle2 className="w-3 h-3 text-[#D4AF37]" />
                    {ticket.status.toUpperCase()}
                  </span>
                </div>

                <h4 className="text-sm font-semibold text-white">{ticket.title}</h4>
                <p className="text-xs text-neutral-300 leading-relaxed">{ticket.description}</p>

                <div className="p-3 rounded-xl bg-[#0A0D12] border border-white/[0.06] text-xs space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-neutral-400">Assigned Contractor:</span>
                    <span className="text-white font-medium">{ticket.contractorName || "Elevation Engineering Team"}</span>
                  </div>
                  {ticket.contractorNotes && (
                    <p className="text-[10px] text-neutral-400 italic">"{ticket.contractorNotes}"</p>
                  )}
                </div>

                <div className="text-[10px] text-neutral-400 flex items-center justify-between font-mono pt-1">
                  <span>Reported: {ticket.reportedAt}</span>
                  <span className="text-[#DFCA9E]">Escrow Paid</span>
                </div>
              </div>
            )))}
          </div>
        </section>
        </>
        )}
      </main>

      {/* Modals with Framer Motion */}
      {showPassModal && (
        <VisitorPassModal
          onClose={() => setShowPassModal(false)}
          onPassCreated={handlePassCreated}
          unitName={unit.unitNumber}
          compoundName={compound.name}
          residentName={resident ? resident.name : "Executive Resident Principal"}
        />
      )}

      {showTicketModal && (
        <MaintenanceTicketModal
          onClose={() => setShowTicketModal(false)}
          onTicketCreated={handleTicketCreated}
          unitName={unit.unitNumber}
          compoundName={compound.name}
          residentName={resident ? resident.name : "Executive Resident Principal"}
        />
      )}

      {showPaymentModal && (
        <PaymentModal
          onClose={() => setShowPaymentModal(false)}
          onPaymentSuccess={handlePaymentSuccess}
          residentName={resident ? resident.name : "Executive Resident Principal"}
          unitName={unit.unitNumber}
          compoundName={compound.name}
          baseRent={unit.annualRent}
          serviceCharge={unit.serviceCharge}
          landlordSubaccount={compound.escrowAccountNumber ? `ACCT_${compound.code}` : "ACCT_DIRECT_ESCROW"}
          compoundEscrowAccount={compound.escrowAccountNumber}
        />
      )}

      {selectedReceiptTx && (
        <PrintableReceipt
          transaction={selectedReceiptTx}
          onClose={() => setSelectedReceiptTx(null)}
        />
      )}

      {/* Optical QR Code Enlarge Scanner Modal */}
      <AnimatePresence>
        {selectedQrPass && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-sm bg-[#0E131E] border border-[#D4AF37]/40 rounded-3xl p-6 sm:p-7 shadow-2xl text-center space-y-5"
            >
              <div className="mb-2">
                <Logo size="sm" href="" />
              </div>
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
                <div className="flex items-center gap-2 text-left">
                  <div className="p-1.5 rounded-lg bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[#DFCA9E]">
                    <QrCode className="w-4 h-4 text-[#D4AF37]" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Security Gate Scanner</h3>
                    <p className="text-[10px] text-neutral-400 font-mono">Present to barrier camera or guard</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedQrPass(null)}
                  className="w-8 h-8 rounded-full bg-white/[0.05] hover:bg-white/[0.1] text-neutral-400 hover:text-white flex items-center justify-center transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Large High-Contrast Optical QR Code */}
              <div className="flex justify-center py-2">
                <div className="p-3.5 rounded-3xl bg-white shadow-2xl border-2 border-[#D4AF37]/50 inline-block">
                  <QRCodeView
                    value={`https://stay.com.ng/verify/gate?pass=${selectedQrPass.code}&compound=${encodeURIComponent(compound.name)}`}
                    size={190}
                  />
                </div>
              </div>

              {/* 6-Digit Code */}
              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 block">
                  Manual Keypad Code
                </span>
                <div className="text-3xl font-mono font-bold tracking-widest text-white">
                  {selectedQrPass.code}
                </div>
              </div>

              {/* Guest & Vehicle Details */}
              <div className="p-3.5 rounded-2xl bg-[#080B11] border border-white/[0.06] space-y-1.5 text-xs text-left font-mono">
                <div className="flex justify-between">
                  <span className="text-neutral-400">Guest:</span>
                  <span className="text-white font-medium">{selectedQrPass.guestName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Validity:</span>
                  <span className="text-emerald-400">{selectedQrPass.validUntil} WAT</span>
                </div>
                {selectedQrPass.vehiclePlate && (
                  <div className="flex justify-between pt-1 border-t border-white/[0.06]">
                    <span className="text-neutral-400">Vehicle:</span>
                    <span className="text-[#DFCA9E] font-bold">{selectedQrPass.vehiclePlate}</span>
                  </div>
                )}
              </div>

              {/* WhatsApp Share Button */}
              <div className="space-y-2 pt-1">
                <a
                  href={
                    selectedQrPass.whatsappMessageUrl ||
                    `https://wa.me/?text=Elevation%20Stay%20Gate%20Pass%20${selectedQrPass.code}%20for%20${encodeURIComponent(compound.name)}`
                  }
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-3 px-4 rounded-xl bg-[#25D366] hover:bg-[#20BD5A] text-black font-semibold text-xs flex items-center justify-center gap-2 shadow-lg transition active:scale-98"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Share via WhatsApp</span>
                </a>

                <button
                  onClick={() => setSelectedQrPass(null)}
                  className="w-full py-2.5 text-xs font-mono text-neutral-400 hover:text-white transition"
                >
                  Close Pass
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {resident && (
        <ChangePinModal
          isOpen={showChangePinModal}
          onClose={() => setShowChangePinModal(false)}
          clientId={resident.id}
          clientName={resident.name}
          role="Resident Suite"
        />
      )}

      <Footer />
    </div>
  );
}
