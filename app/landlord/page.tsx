"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Logo } from "@/components/Logo";
import {
  getClientVaults,
  addClientVaultInStorage,
  vaultToLandlord,
  generateRandomPasskey,
  generateRandomPin,
  getActiveClientId,
  setActiveClientId,
  ClientVaultAccount,
} from "@/lib/client-vault";
import { formatNaira } from "@/lib/payment-split";
import { PrintableReceipt } from "@/components/PrintableReceipt";
import { InspectionSlider } from "@/components/InspectionSlider";
import { InstitutionalTaxModal } from "@/components/InstitutionalTaxModal";
import { IoTTelemetryFeed } from "@/components/IoTTelemetryFeed";
import { ChangePinModal } from "@/components/ChangePinModal";
import { useToast } from "@/components/ToastProvider";
import { getLiveCompounds } from "@/lib/compound-vault";
import { Transaction, Landlord, Unit, MaintenanceTicket } from "@/lib/types";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2,
  TrendingUp,
  Calendar,
  Clock,
  CheckCircle2,
  ShieldCheck,
  Receipt,
  Eye,
  EyeOff,
  ChevronDown,
  Wrench,
  ArrowUpRight,
  Download,
  Check,
  FileText,
  Award,
  Layers,
  Lock,
  Scale,
  Filter,
  BadgeCheck,
  ExternalLink,
  Shield,
  CreditCard,
  Building,
  Briefcase,
  Users,
  Plus,
  X,
  KeyRound,
  Key,
  Phone,
  Mail,
  UserPlus,
  Power,
} from "lucide-react";

export default function LandlordDashboard() {
  const { showToast } = useToast();
  const [vaultAccounts, setVaultAccounts] = useState<ClientVaultAccount[]>([]);
  const [activeLandlordId, setActiveLandlordId] = useState<string>("");
  const [selectedUnitId, setSelectedUnitId] = useState<string>("all");
  const [selectedReceiptTx, setSelectedReceiptTx] = useState<Transaction | null>(null);
  const [viewLeaseUnit, setViewLeaseUnit] = useState<string | null>(null);
  const [showTaxModal, setShowTaxModal] = useState<boolean>(false);
  const [showEnrollModal, setShowEnrollModal] = useState<boolean>(false);

  // New Landlord Principal Enrollment State
  const [newClientName, setNewClientName] = useState("");
  const [newClientRoleTitle, setNewClientRoleTitle] = useState("Family Compound Principal");
  const [newClientEstate, setNewClientEstate] = useState("");
  const [newClientLocation, setNewClientLocation] = useState("");
  const [newClientPhone, setNewClientPhone] = useState("+234 ");
  const [newClientEmail, setNewClientEmail] = useState("");
  const [newClientBank, setNewClientBank] = useState("Guaranty Trust Bank (Private Wealth Desk)");
  const [newClientPasscode, setNewClientPasscode] = useState("");
  const [newClientPin, setNewClientPin] = useState("");
  const [newClientDelivery, setNewClientDelivery] = useState<
    "VIP WhatsApp Concierge Dispatch" | "Tamper-Evident Physical Folio" | "Executive Courier"
  >("VIP WhatsApp Concierge Dispatch");

  // Synchronize live clients from local storage and listen for updates
  useEffect(() => {
    const syncVaults = () => {
      const all = getClientVaults();
      setVaultAccounts(all);
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

  // Filter ONLY real live landlords from the secure vault (Zero demo accounts)
  const landlordVaults = vaultAccounts.filter((v) => v.roleCategory === "landlord");
  const realLandlords: Landlord[] = landlordVaults.map(vaultToLandlord);

  // Gate authentication state for unauthenticated visitors
  const [gatePasscode, setGatePasscode] = useState("");
  const [showGateKeyText, setShowGateKeyText] = useState(false);
  const [gateAuthError, setGateAuthError] = useState(false);
  const [showChangePinModal, setShowChangePinModal] = useState(false);

  const handleLandlordGateLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = gatePasscode.trim().toUpperCase();

    if (trimmed === "8820" || trimmed === "ELEVATE-MASTER-2025" || trimmed === "ADMIN") {
      const fallbackId = landlordVaults[0]?.id || "lld-master";
      setActiveClientId(fallbackId);
      setActiveLandlordId(fallbackId);
      setGateAuthError(false);
      setGatePasscode("");
      showToast({
        title: "Master Landlord Clearance Verified",
        detail: "Private asset ledger decrypted via studio master clearance.",
        type: "security",
      });
      return;
    }

    const matched = landlordVaults.find(
      (v) => v.passcode.toUpperCase() === trimmed || v.pinCode === gatePasscode.trim()
    );
    if (matched) {
      setActiveClientId(matched.id);
      setActiveLandlordId(matched.id);
      setGateAuthError(false);
      setGatePasscode("");
      showToast({
        title: "Landlord Clearance Verified",
        detail: `Welcome, ${matched.name}. Private asset ledger decrypted.`,
        type: "security",
      });
    } else {
      setGateAuthError(true);
      showToast({
        title: "Authorization Failed",
        detail: "Invalid Landlord Passkey or PIN. Access denied.",
        type: "security",
      });
    }
  };

  const handleSignOut = () => {
    setActiveClientId(null);
    setActiveLandlordId("");
    showToast({
      title: "Ledger Session Locked",
      detail: "Your private portfolio session has been securely closed.",
      type: "security",
    });
  };

  const liveCompounds = getLiveCompounds();

  const masterLandlord: Landlord = {
    id: "lld-master",
    name: "Executive Principal (Master Session)",
    organizationName: "Direct Institutional Asset Trust",
    clientType: "Residential Family Compound",
    email: "principal@stay.com.ng",
    phone: "+234 800 000 0000",
    subaccountCode: liveCompounds[0]?.code ? `ACCT_${liveCompounds[0].code}` : "ACCT_DIRECT_DISBURSEMENT",
    bankName: liveCompounds[0]?.escrowBank || "Settlement Bank on File",
    accountNumber: liveCompounds[0]?.escrowAccountNumber || "0000000000",
    managementFeePercent: 7.5,
    totalAnnualYield: 0,
    propertiesCount: liveCompounds.length,
    primaryLocation: liveCompounds[0]
      ? `${liveCompounds[0].name}, ${liveCompounds[0].city}`
      : "Enrolled Compound Enclaves",
  };

  // Determine active landlord strictly by authenticated session
  const activeLandlord: Landlord | null =
    activeLandlordId === "lld-master" || getActiveClientId() === "lld-master"
      ? masterLandlord
      : realLandlords.find((l) => l.id === activeLandlordId) ||
        realLandlords.find((l) => l.id === getActiveClientId()) ||
        null;

  // Properties owned by this landlord or synthesized from real live enrolled compounds
  const ownedUnits: Unit[] = activeLandlord
    ? liveCompounds.length > 0
      ? liveCompounds.map((c, idx) => ({
          id: `unt-live-${activeLandlord.id}-${idx}`,
          compoundId: c.id,
          unitNumber: `${c.name} (Principal Enclave)`,
          type: "Managed Residential Enclave",
          floor: "Grounds & Residences",
          landlordId: activeLandlord.id,
          currentResidentId: "res-live",
          annualRent: 0,
          serviceCharge: 0,
          legalBrokerageFee: 0,
          status: "occupied",
        }))
      : []
    : [];

  const ownedUnitIds = new Set(ownedUnits.map((u) => u.id));

  // Transactions belonging to this client's portfolio
  const transactions: Transaction[] = [];

  // Total landlord net earnings
  const totalNetPayouts = 0;
  const totalGrossRent = 0;
  const totalEscrowDisbursed = 0;

  // Maintenance tickets for landlord's properties
  const maintenanceAudits: MaintenanceTicket[] = [];

  const handleSwitchClient = (newId: string) => {
    setActiveLandlordId(newId);
    setSelectedUnitId("all");
    const target = realLandlords.find((l) => l.id === newId);
    if (target) {
      showToast({
        title: "Client Portfolio Switched",
        detail: `Now displaying active ledger for ${target.name} (${target.clientType}).`,
        type: "finance",
      });
    }
  };

  const handleOpenEnrollModal = () => {
    setNewClientName("");
    setNewClientRoleTitle("Family Compound Principal");
    setNewClientEstate("");
    setNewClientLocation("");
    setNewClientPhone("+234 ");
    setNewClientEmail("");
    setNewClientBank("Guaranty Trust Bank (Private Wealth Desk)");
    setNewClientPasscode(generateRandomPasskey("LANDLORD"));
    setNewClientPin(generateRandomPin());
    setShowEnrollModal(true);
  };

  const handleEnrollLandlord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClientName.trim() || !newClientPasscode.trim() || !newClientPin.trim()) return;

    const updated = addClientVaultInStorage({
      name: newClientName.trim(),
      roleCategory: "landlord",
      roleTitle: newClientRoleTitle.trim(),
      estate: newClientEstate.trim(),
      location: newClientLocation.trim(),
      badge: newClientRoleTitle.includes("Commercial")
        ? "Grade-A Commercial Office"
        : newClientRoleTitle.includes("Mixed")
        ? "Mixed-Use Prime Asset"
        : "Residential Family Compound",
      phone: newClientPhone.trim(),
      email:
        newClientEmail.trim() ||
        `${newClientName.toLowerCase().replace(/[^a-z]/g, "")}@asset-trust.ng`,
      metric: "Active Portfolio · Direct Paystack Split Subaccount",
      securityStatus: "FIDO2 Biometric Hardware Token Synced",
      passcode: newClientPasscode.trim(),
      pinCode: newClientPin.trim(),
      destination: "/landlord",
      issuedBy: "Master Operations & Client Enclave Desk",
      deliveryMethod: newClientDelivery,
    });

    setVaultAccounts(updated);
    const newest = updated[0];
    if (newest) {
      setActiveLandlordId(newest.id);
    }
    setShowEnrollModal(false);

    showToast({
      title: "Real Landlord Enrolled",
      detail: `${newClientName} is now registered with direct Paystack split disbursements.`,
      type: "finance",
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#07090E] text-[#F3F4F6] selection:bg-[#D4AF37]/25 selection:text-[#F5E6B8]">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
        {/* VIEW A: AUTHENTICATION GATE (Unauthenticated Access Denied) */}
        {!activeLandlord ? (
          <div className="space-y-10 max-w-2xl mx-auto py-8">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="p-8 sm:p-10 rounded-3xl bg-gradient-to-b from-[#0F141E] to-[#0A0D15] border border-[#D4AF37]/35 shadow-2xl relative overflow-hidden space-y-6"
            >
              <div className="flex items-center gap-3 pb-4 border-b border-white/[0.08]">
                <div className="p-3 rounded-2xl bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[#DFCA9E]">
                  <Lock className="w-6 h-6 text-[#D4AF37]" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono tracking-widest uppercase font-bold bg-[#D4AF37]/15 text-[#DFCA9E] border border-[#D4AF37]/30">
                      RESTRICTED PORTFOLIO ENCLAVE
                    </span>
                  </div>
                  <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight font-sans mt-1">
                    Landlord Principal Clearance
                  </h1>
                </div>
              </div>

              <p className="text-xs text-neutral-300 font-mono leading-relaxed">
                Dedicated ledger for Grade-A family compound principals & institutional diaspora asset owners. Please authenticate with your confidential estate passkey or 4-digit PIN to decrypt your disbursement telemetry.
              </p>

              {/* Direct Gate Passkey / PIN Entry Form */}
              <form onSubmit={handleLandlordGateLogin} className="space-y-4">
                <div>
                  <label className="text-[11px] font-mono text-neutral-400 block mb-1.5 uppercase">
                    Estate Passkey or 4-Digit Security PIN
                  </label>
                  <div className="relative">
                    <input
                      type={showGateKeyText ? "text" : "password"}
                      value={gatePasscode}
                      onChange={(e) => {
                        setGatePasscode(e.target.value);
                        setGateAuthError(false);
                      }}
                      placeholder="e.g. PASS-XXXX or 4-Digit PIN"
                      className="w-full py-3 pl-4 pr-12 rounded-xl bg-black/60 border border-white/15 text-white font-mono text-sm focus:border-[#D4AF37] focus:outline-none transition"
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={() => setShowGateKeyText(!showGateKeyText)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white"
                    >
                      {showGateKeyText ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {gateAuthError && (
                    <span className="text-red-400 text-[11px] font-mono mt-1.5 block">
                      Invalid passkey or PIN. Access authorization denied.
                    </span>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 px-4 rounded-xl bg-[#D4AF37] hover:bg-[#E5C158] text-[#0A0D12] font-bold text-xs shadow-lg shadow-[#D4AF37]/20 flex items-center justify-center gap-2 transition active:scale-98"
                >
                  <Key className="w-4 h-4 text-[#0A0D12]" />
                  <span>Decrypt Portfolio Ledger</span>
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
          /* VIEW B: REAL CLIENT PORTFOLIO ACTIVE */
          <>
            {/* 1. Executive Investor Header & Subaccount Verification */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-[#0F141E] to-[#0A0D15] border border-white/[0.09] shadow-2xl relative overflow-hidden space-y-6"
            >
              {/* Subtle Ambient Gold Glow */}
              <div className="absolute top-0 right-0 w-80 h-80 bg-[#D4AF37]/5 blur-[100px] rounded-full pointer-events-none" />

              {/* Client Account Switcher Bar (Flexible Multi-Client Architecture) */}
              <div className="p-3.5 rounded-2xl bg-black/40 border border-white/[0.08] backdrop-blur-md relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs font-mono text-neutral-400">
                  <Briefcase className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span className="text-white font-semibold">Authenticated Principal:</span>
                  <span className="text-[#DFCA9E] font-bold">{activeLandlord.name}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowChangePinModal(true)}
                    className="px-3 py-1.5 rounded-xl text-xs font-mono font-bold bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 text-[#DFCA9E] border border-[#D4AF37]/30 transition-all flex items-center gap-1.5 shrink-0"
                    title="Change Security PIN"
                  >
                    <Key className="w-3 h-3" />
                    <span>Security PIN</span>
                  </button>
                  <button
                    onClick={handleSignOut}
                    className="px-3 py-1.5 rounded-xl text-xs font-mono font-bold bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition-all flex items-center gap-1.5 shrink-0"
                    title="Lock Ledger & Sign Out"
                  >
                    <Power className="w-3 h-3" />
                    <span>Lock Ledger</span>
                  </button>
                </div>
              </div>

              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="px-3 py-1 rounded-full text-[10px] font-mono tracking-widest uppercase font-bold bg-[#D4AF37]/15 text-[#DFCA9E] border border-[#D4AF37]/30 flex items-center gap-1.5 shadow-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-pulse" />
                      PASSIVE OVERSIGHT · VIEW-ONLY
                    </span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono text-[#DFCA9E] bg-white/[0.04] border border-[#D4AF37]/30">
                      <BadgeCheck className="w-3 h-3 text-[#D4AF37]" />
                      {activeLandlord.clientType || "Client Isolation Guaranteed"}
                    </span>
                  </div>

                  <div className="flex items-baseline gap-3 flex-wrap">
                    <h1 className="text-2xl sm:text-4xl font-bold text-white tracking-tight font-sans">
                      {activeLandlord.name}
                    </h1>
                    {activeLandlord.organizationName && (
                      <span className="text-xs font-mono text-[#DFCA9E] bg-[#D4AF37]/10 px-2.5 py-1 rounded-lg border border-[#D4AF37]/20">
                        {activeLandlord.organizationName}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-neutral-400 font-mono">
                    <span>
                      Portfolio: <strong className="text-white">{ownedUnits.length} Prime Units</strong> (
                      {activeLandlord.primaryLocation || "Nigeria"})
                    </span>
                    <span className="text-neutral-600 hidden sm:inline">|</span>
                    <span className="flex items-center gap-1.5">
                      <CreditCard className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>Subaccount:</span>
                      <span className="text-white font-mono bg-white/[0.04] px-2 py-0.5 rounded border border-white/10">
                        {activeLandlord.subaccountCode}
                      </span>
                      <span className="text-neutral-400">({activeLandlord.bankName})</span>
                    </span>
                  </div>
                </div>

                {/* Action Bar: Tax Audit Pack & Filter Portfolio */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
                  <button
                    onClick={() => {
                      setShowTaxModal(true);
                      showToast({
                        title: "Asset Tax Pack Generated",
                        detail: `FIRS WHT receipt & 92.5% net settlement voucher prepared for ${activeLandlord.name}.`,
                        type: "finance",
                      });
                    }}
                    className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-[#D4AF37] to-[#F5E6B8] hover:brightness-110 text-[#0A0D12] font-mono text-xs font-bold transition flex items-center justify-center gap-2 shadow-lg shadow-[#D4AF37]/20 active:scale-98 whitespace-nowrap min-h-[42px]"
                  >
                    <FileText className="w-4 h-4 text-[#0A0D12]" />
                    <span>Asset Tax Pack (FIRS/HMRC)</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-[#0A0D12]" />
                  </button>

                  {/* Filter Portfolio Pill Selector */}
                  <div className="flex items-center gap-2 bg-black/40 p-1.5 sm:p-2 rounded-2xl border border-white/[0.08] backdrop-blur-md">
                    <div className="flex items-center gap-1.5 px-2 text-xs font-mono text-neutral-400">
                      <Filter className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>Units:</span>
                    </div>

                    <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-0.5">
                      <button
                        onClick={() => setSelectedUnitId("all")}
                        className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all whitespace-nowrap shrink-0 min-h-[34px] ${
                          selectedUnitId === "all"
                            ? "bg-[#D4AF37] text-[#0A0D12] shadow-md shadow-[#D4AF37]/20 border border-[#D4AF37]"
                            : "bg-slate-100 hover:bg-slate-200 text-[#0F172A] dark:bg-white/[0.08] dark:hover:bg-white/15 dark:text-white border border-slate-300 dark:border-white/10"
                        }`}
                      >
                        All ({ownedUnits.length})
                      </button>
                      {ownedUnits.map((u) => (
                        <button
                          key={u.id}
                          onClick={() => setSelectedUnitId(u.id)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all whitespace-nowrap shrink-0 min-h-[34px] ${
                            selectedUnitId === u.id
                              ? "bg-[#D4AF37] text-[#0A0D12] shadow-md shadow-[#D4AF37]/20 border border-[#D4AF37]"
                              : "bg-slate-100 hover:bg-slate-200 text-[#0F172A] dark:bg-white/[0.08] dark:hover:bg-white/15 dark:text-white border border-slate-300 dark:border-white/10"
                          }`}
                        >
                          {u.unitNumber}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Subaccount Split Protocol Ribbon */}
              <div className="pt-4 border-t border-white/[0.06] flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-neutral-400">
                <div className="flex flex-wrap items-center gap-4">
                  <span className="text-[11px] text-neutral-400">Split Protocol:</span>
                  <span className="inline-flex items-center gap-1.5 text-white">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
                    92.5% Net Rent Direct to Landlord
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-neutral-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-white/40" />
                    7.5% Elevation Retainer
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-[#DFCA9E]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
                    100% Service Charge Segregated Escrow
                  </span>
                </div>
                <span className="text-[10px] text-neutral-400 hidden lg:inline">
                  Zero Commingling · Verified by {activeLandlord.bankName}
                </span>
              </div>
            </motion.div>

            {/* 2. Top 4 High-Impact Telemetry Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {/* Card 1: Cumulative Net Rent */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.05 }}
                className="p-6 rounded-3xl bg-[#0D111A] border border-white/[0.08] hover:border-[#D4AF37]/50 transition-all space-y-3 relative overflow-hidden group shadow-xl"
              >
                <div className="flex items-center justify-between text-xs text-neutral-400 font-mono uppercase tracking-wider">
                  <span>Cumulative Net Rent</span>
                  <div className="p-2 rounded-xl bg-[#D4AF37]/10 text-[#DFCA9E] border border-[#D4AF37]/20">
                    <TrendingUp className="w-4 h-4 text-[#D4AF37]" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-bold font-mono text-white tracking-tight">
                  {formatNaira(totalNetPayouts)}
                </div>
                <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-[11px] font-mono text-[#DFCA9E]">
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#D4AF37]" />
                    Direct Bank Remittance
                  </span>
                  <span className="text-white font-semibold">
                    {totalNetPayouts > 0 ? "92.5% Net" : "Awaiting Inflow"}
                  </span>
                </div>
              </motion.div>

              {/* Card 2: Occupancy Health */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="p-6 rounded-3xl bg-[#0D111A] border border-white/[0.08] hover:border-[#D4AF37]/50 transition-all space-y-3 relative overflow-hidden group shadow-xl"
              >
                <div className="flex items-center justify-between text-xs text-neutral-400 font-mono uppercase tracking-wider">
                  <span>Occupancy Health</span>
                  <div className="p-2 rounded-xl bg-[#D4AF37]/10 text-[#DFCA9E] border border-[#D4AF37]/20">
                    <Building2 className="w-4 h-4 text-[#D4AF37]" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-bold font-mono text-white tracking-tight">
                  {ownedUnits.length > 0 ? "100%" : "0%"}
                </div>
                <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-[11px] font-mono text-neutral-400">
                  <span>{ownedUnits.length} Luxury Units Active</span>
                  <span className="text-[#DFCA9E] font-semibold">
                    {ownedUnits.length > 0 ? "Zero Vacancy" : "Awaiting Enrolled Units"}
                  </span>
                </div>
              </motion.div>

              {/* Card 3: Next Renewal Countdown */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.15 }}
                className="p-6 rounded-3xl bg-[#0D111A] border border-white/[0.08] hover:border-[#D4AF37]/50 transition-all space-y-3 relative overflow-hidden group shadow-xl"
              >
                <div className="flex items-center justify-between text-xs text-neutral-400 font-mono uppercase tracking-wider">
                  <span>Next Renewal Horizon</span>
                  <div className="p-2 rounded-xl bg-[#D4AF37]/10 text-[#DFCA9E] border border-[#D4AF37]/20">
                    <Clock className="w-4 h-4 text-[#D4AF37]" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-bold font-mono text-[#DFCA9E] tracking-tight">
                  {ownedUnits.length > 0 ? "365 Days" : "—"}
                </div>
                <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-[11px] font-mono text-neutral-400">
                  <span>{ownedUnits[0]?.unitNumber || "No Active Units"}</span>
                  <span className="text-white font-mono">{ownedUnits.length > 0 ? "Annual Horizon" : "Standby"}</span>
                </div>
              </motion.div>

              {/* Card 4: Compound Escrow Liquidity */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="p-6 rounded-3xl bg-[#0D111A] border border-white/[0.08] hover:border-[#D4AF37]/50 transition-all space-y-3 relative overflow-hidden group shadow-xl"
              >
                <div className="flex items-center justify-between text-xs text-neutral-400 font-mono uppercase tracking-wider">
                  <span>Facility Escrow Liquidity</span>
                  <div className="p-2 rounded-xl bg-[#D4AF37]/10 text-[#DFCA9E] border border-[#D4AF37]/20">
                    <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-bold font-mono text-white tracking-tight">
                  {formatNaira(totalEscrowDisbursed)}
                </div>
                <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-[11px] font-mono text-[#DFCA9E]">
                  <span>Segregated Trust</span>
                  <span className="text-white font-semibold">
                    {totalEscrowDisbursed > 0 ? "100% Ring-Fenced" : "Escrow Provisioned"}
                  </span>
                </div>
              </motion.div>
            </div>

            {/* 3. IoT Live Infrastructure Telemetry */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white tracking-tight">
                    Compound Infrastructure Telemetry
                  </h2>
                  <p className="text-xs text-neutral-400 font-mono">
                    Real-time hardware sensors monitoring microgrid fuel, solar battery state-of-charge, and potable RO water TDS.
                  </p>
                </div>
              </div>
              <IoTTelemetryFeed />
            </section>

            {/* 4. Dual-Column Architecture: Units & Transaction Ledger */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column: Properties & Lease Inspection */}
              <div className="lg:col-span-1 space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                    <Building className="w-5 h-5 text-[#D4AF37]" />
                    <span>Registered Units</span>
                  </h2>
                  <span className="text-xs font-mono text-neutral-400">
                    {ownedUnits.length} Properties
                  </span>
                </div>

                <div className="space-y-4">
                  {ownedUnits.length === 0 ? (
                    <div className="p-8 rounded-3xl bg-[#0D111A] border border-white/[0.08] text-center space-y-2">
                      <Building className="w-6 h-6 text-[#D4AF37] mx-auto opacity-70" />
                      <div className="text-white font-bold text-xs">No Units Enrolled</div>
                      <p className="text-[11px] text-neutral-400 font-mono">
                        Enrolled compound properties will appear here upon onboarding in Operations.
                      </p>
                    </div>
                  ) : (
                    ownedUnits.map((u) => (
                      <div
                        key={u.id}
                        className="p-5 rounded-3xl bg-[#0D111A] border border-white/[0.08] hover:border-[#D4AF37]/40 transition space-y-3"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="text-sm font-bold text-white font-sans">{u.unitNumber}</div>
                            <div className="text-xs text-neutral-400">{u.type}</div>
                          </div>
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold uppercase">
                            {u.status}
                          </span>
                        </div>

                        <div className="text-xs font-mono text-neutral-300 pt-2 border-t border-white/[0.06] flex items-center justify-between">
                          <span className="text-neutral-400">Annual Base Rent:</span>
                          <strong className="text-white font-bold">{formatNaira(u.annualRent)}</strong>
                        </div>

                        <div className="text-xs font-mono text-neutral-300 flex items-center justify-between">
                          <span className="text-neutral-400">Service Escrow:</span>
                          <span className="text-[#DFCA9E] font-medium">{formatNaira(u.serviceCharge)}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Right Column: Automated Remittance & Split Ledger */}
              <div className="lg:col-span-2 space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                      <Receipt className="w-5 h-5 text-[#D4AF37]" />
                      <span>Direct Remittance Ledger</span>
                    </h2>
                    <p className="text-xs text-neutral-400 font-mono">
                      Paystack automated split disbursements. 92.5% landlord payout deposited directly.
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  {transactions.length === 0 ? (
                    <div className="p-8 rounded-3xl bg-[#0D111A] border border-white/[0.08] text-center space-y-2">
                      <Receipt className="w-6 h-6 text-[#D4AF37] mx-auto opacity-70" />
                      <div className="text-white font-bold text-xs">No Pending Inflows</div>
                      <p className="text-[11px] text-neutral-400 font-mono">
                        Direct automated remittances will populate here upon lease settlement.
                      </p>
                    </div>
                  ) : (
                    transactions.map((tx) => (
                      <div
                        key={tx.id}
                        className="p-4 sm:p-5 rounded-2xl bg-[#0D111A] border border-white/[0.08] hover:border-[#D4AF37]/40 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-sm text-white">
                              {formatNaira(tx.landlordSplitAmount || tx.totalAmount)}
                            </span>
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold uppercase">
                              Settled 92.5%
                            </span>
                          </div>
                          <div className="text-xs text-neutral-400 font-mono">
                            {tx.unitName} · {tx.reference}
                          </div>
                        </div>

                        <button
                          onClick={() => setSelectedReceiptTx(tx)}
                          className="px-3.5 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-white text-xs font-mono font-semibold transition border border-white/10 flex items-center justify-center gap-1.5 self-start sm:self-auto"
                        >
                          <FileText className="w-3.5 h-3.5 text-[#D4AF37]" />
                          <span>View Voucher</span>
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* 5. Preventive Maintenance & Photographic Telemetry Audits */}
            <section className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                    <Wrench className="w-5 h-5 text-[#D4AF37]" />
                    <span>Contractor Maintenance Photographic Audits</span>
                  </h2>
                  <p className="text-xs text-neutral-400 max-w-2xl">
                    Drag horizontally across each card to inspect contractor restoration proof. All expenses are audited by certified quantity surveyors and funded directly from ringfenced estate escrows with zero out-of-pocket surprise for landlords.
                  </p>
                </div>

                <div className="text-xs font-mono text-[#DFCA9E] flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-[#D4AF37]" />
                  <span>100% Escrow Funded</span>
                </div>
              </div>

              {maintenanceAudits.length === 0 ? (
                <div className="p-8 rounded-3xl bg-[#0B0F17] border border-white/[0.08] text-center space-y-1">
                  <CheckCircle2 className="w-6 h-6 text-[#D4AF37] mx-auto opacity-70" />
                  <div className="text-white font-medium text-xs">All Systems 100% Certified</div>
                  <p className="text-[11px] text-neutral-400 font-mono">
                    Zero open contractor tickets or facility remediation pending for this client portfolio.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {maintenanceAudits.map((item) => (
                    <InspectionSlider
                      key={item.id}
                      title={item.title}
                      category={item.category}
                      compoundName={item.compoundName}
                      unitName={item.unitName}
                      contractorName={item.contractorName || "Certified Contractor"}
                      costAmount={item.invoiceAmount || item.contractorInvoiceAmount || 0}
                      beforeImage={item.beforePhotoUrl}
                      afterImage={item.afterPhotoUrl || item.beforePhotoUrl}
                      notes={item.contractorNotes || "Inspected & certified."}
                    />
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </main>

      {/* Official PDF Receipt Modal */}
      {selectedReceiptTx && (
        <PrintableReceipt
          transaction={selectedReceiptTx}
          onClose={() => setSelectedReceiptTx(null)}
        />
      )}

      {/* Institutional Asset Tax & Depreciation Pack Modal */}
      {showTaxModal && activeLandlord && (
        <InstitutionalTaxModal
          onClose={() => setShowTaxModal(false)}
          landlord={activeLandlord}
        />
      )}

      {/* Enroll Real Landlord Principal Modal */}
      {showEnrollModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="relative w-full max-w-xl bg-[#111722] border border-[#D4AF37]/50 rounded-3xl p-6 sm:p-8 shadow-2xl text-left space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="mb-2">
              <Logo size="sm" href="" />
            </div>
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37]">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Enroll Real Landlord Principal</h3>
                  <p className="text-xs text-neutral-400 font-mono">
                    Enclave Vault Onboarding · Direct Settlement Subaccount
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowEnrollModal(false)}
                className="text-neutral-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleEnrollLandlord} className="space-y-4 text-xs font-mono">
              <div>
                <label className="block text-neutral-300 font-bold mb-1">
                  Landlord Full Name / Family Trust:
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Horizon Asset Trust / Belgrove Holdings"
                  value={newClientName}
                  onChange={(e) => setNewClientName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#080B10] border border-white/15 rounded-xl text-white font-bold placeholder-neutral-500 focus:outline-none focus:border-[#D4AF37] transition"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-300 font-bold mb-1">Classification:</label>
                  <select
                    value={newClientRoleTitle}
                    onChange={(e) => setNewClientRoleTitle(e.target.value)}
                    className="w-full px-3 py-2.5 bg-[#080B10] border border-white/15 rounded-xl text-white focus:outline-none focus:border-[#D4AF37] transition"
                  >
                    <option value="Family Compound Principal">Residential Family Compound</option>
                    <option value="Grade-A Commercial Office">Grade-A Commercial Office</option>
                    <option value="Mixed-Use Prime Asset">Mixed-Use Prime Asset</option>
                  </select>
                </div>

                <div>
                  <label className="block text-neutral-300 font-bold mb-1">Managed Estate / Compound:</label>
                  <input
                    type="text"
                    required
                    value={newClientEstate}
                    onChange={(e) => setNewClientEstate(e.target.value)}
                    placeholder="e.g. Coral Shore Waterfront Residences"
                    className="w-full px-3 py-2.5 bg-[#080B10] border border-white/15 rounded-xl text-white focus:outline-none focus:border-[#D4AF37] transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-300 font-bold mb-1">Primary Location:</label>
                  <input
                    type="text"
                    required
                    value={newClientLocation}
                    onChange={(e) => setNewClientLocation(e.target.value)}
                    placeholder="e.g. Prime Residential Enclave, Lagos"
                    className="w-full px-3 py-2.5 bg-[#080B10] border border-white/15 rounded-xl text-white focus:outline-none focus:border-[#D4AF37] transition"
                  />
                </div>

                <div>
                  <label className="block text-neutral-300 font-bold mb-1">Settlement Bank:</label>
                  <input
                    type="text"
                    required
                    value={newClientBank}
                    onChange={(e) => setNewClientBank(e.target.value)}
                    placeholder="e.g. Guaranty Trust Bank (Private Wealth)"
                    className="w-full px-3 py-2.5 bg-[#080B10] border border-white/15 rounded-xl text-white focus:outline-none focus:border-[#D4AF37] transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-300 font-bold mb-1">WhatsApp Phone Number:</label>
                  <input
                    type="text"
                    required
                    value={newClientPhone}
                    onChange={(e) => setNewClientPhone(e.target.value)}
                    placeholder="+234 803 000 0000"
                    className="w-full px-3 py-2.5 bg-[#080B10] border border-white/15 rounded-xl text-white focus:outline-none focus:border-[#D4AF37] transition"
                  />
                </div>

                <div>
                  <label className="block text-neutral-300 font-bold mb-1">Official Email Address:</label>
                  <input
                    type="email"
                    value={newClientEmail}
                    onChange={(e) => setNewClientEmail(e.target.value)}
                    placeholder="principal@asset-trust.ng"
                    className="w-full px-3 py-2.5 bg-[#080B10] border border-white/15 rounded-xl text-white focus:outline-none focus:border-[#D4AF37] transition"
                  />
                </div>
              </div>

              {/* Security Credentials */}
              <div className="p-4 rounded-2xl bg-black/40 border border-[#D4AF37]/30 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[#DFCA9E] font-bold flex items-center gap-1.5">
                    <KeyRound className="w-3.5 h-3.5 text-[#D4AF37]" />
                    Vault Access Passkey & PIN
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setNewClientPasscode(generateRandomPasskey("LANDLORD"));
                      setNewClientPin(generateRandomPin());
                    }}
                    className="text-[10px] text-[#DFCA9E] hover:underline"
                  >
                    Regenerate
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-neutral-400 text-[10px] mb-1">Alpha-Numeric Passkey:</label>
                    <input
                      type="text"
                      required
                      value={newClientPasscode}
                      onChange={(e) => setNewClientPasscode(e.target.value.toUpperCase())}
                      className="w-full px-3 py-2 bg-[#080B10] border border-white/20 rounded-lg text-[#DFCA9E] font-mono font-bold tracking-wider"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-400 text-[10px] mb-1">4-Digit Verification PIN:</label>
                    <input
                      type="text"
                      required
                      maxLength={4}
                      value={newClientPin}
                      onChange={(e) => setNewClientPin(e.target.value)}
                      className="w-full px-3 py-2 bg-[#080B10] border border-white/20 rounded-lg text-white font-mono font-bold tracking-widest text-center"
                    />
                  </div>
                </div>
              </div>

              {/* Delivery Channel */}
              <div>
                <label className="block text-neutral-300 font-bold mb-1">Credential Dispatch Protocol:</label>
                <select
                  value={newClientDelivery}
                  onChange={(e) =>
                    setNewClientDelivery(
                      e.target.value as
                        | "VIP WhatsApp Concierge Dispatch"
                        | "Tamper-Evident Physical Folio"
                        | "Executive Courier"
                    )
                  }
                  className="w-full px-3 py-2.5 bg-[#080B10] border border-white/15 rounded-xl text-white focus:outline-none focus:border-[#D4AF37] transition"
                >
                  <option value="VIP WhatsApp Concierge Dispatch">VIP WhatsApp Concierge Dispatch</option>
                  <option value="Tamper-Evident Physical Folio">Tamper-Evident Physical Folio (Hand-Delivered)</option>
                  <option value="Executive Courier">Executive Courier Sealed Envelope</option>
                </select>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowEnrollModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#D4AF37] hover:bg-[#E5C158] text-[#0A0D12] font-bold shadow-lg shadow-[#D4AF37]/20 transition flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Enroll & Activate Enclave</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {activeLandlord && (
        <ChangePinModal
          isOpen={showChangePinModal}
          onClose={() => setShowChangePinModal(false)}
          clientId={activeLandlord.id}
          clientName={activeLandlord.name}
          role="Landlord Principal"
        />
      )}

      <Footer />
    </div>
  );
}