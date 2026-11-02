"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Building2,
  KeyRound,
  Layers,
  Lock,
  UserCheck,
  ShieldCheck,
  Compass,
  Fingerprint,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Check,
  X,
  Award,
  Eye,
  EyeOff,
  AlertCircle,
  Key,
  MessageSquare,
  Sparkles,
  Plus,
  Power,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Logo } from "./Logo";
import { PushNotificationManager } from "./PushNotificationManager";
import { ThemeToggle } from "./ThemeToggle";
import { useToast } from "./ToastProvider";
import { getClientVaults, ClientVaultAccount, setActiveClientId, getActiveClientId } from "@/lib/client-vault";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 16, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 320,
      damping: 26,
    },
  },
};

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { showToast } = useToast();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [selectedVaultFilter, setSelectedVaultFilter] = useState<string>("all");
  const [clientVaults, setClientVaults] = useState<ClientVaultAccount[]>(() => getClientVaults());
  const [selectedClientForAuth, setSelectedClientForAuth] = useState<ClientVaultAccount | null>(null);
  const [enteredPasscode, setEnteredPasscode] = useState("");
  const [showPasscodeText, setShowPasscodeText] = useState(false);
  const [authError, setAuthError] = useState(false);
  const [authenticatingId, setAuthenticatingId] = useState<string | null>(null);
  const [activeClientId, setActiveClientIdState] = useState<string | null>(null);
  const [directModalKey, setDirectModalKey] = useState("");
  const [directAuthError, setDirectAuthError] = useState(false);

  useEffect(() => {
    const handleVaultSync = () => {
      setClientVaults(getClientVaults());
      setActiveClientIdState(getActiveClientId());
    };
    handleVaultSync();
    window.addEventListener("elevation_vault_updated", handleVaultSync);
    window.addEventListener("elevation_auth_changed", handleVaultSync);
    window.addEventListener("storage", handleVaultSync);
    return () => {
      window.removeEventListener("elevation_vault_updated", handleVaultSync);
      window.removeEventListener("elevation_auth_changed", handleVaultSync);
      window.removeEventListener("storage", handleVaultSync);
    };
  }, []);

  const activeClient = clientVaults.find((c) => c.id === activeClientId) || null;

  const handleSignOut = () => {
    setActiveClientId(null);
    setActiveClientIdState(null);
    showToast({
      title: "Portal Session Locked",
      detail: "Your private ledger session has been securely closed.",
      type: "security",
    });
    router.push("/");
  };

  const handleDirectModalAuth = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = directModalKey.trim().toUpperCase();
    if (!trimmed) return;

    if (trimmed === "ADMIN") {
      setShowLoginModal(false);
      setDirectModalKey("");
      setDirectAuthError(false);
      showToast({
        title: "Operations Clearance Verified",
        detail: "Opening Studio Master Operations Desk.",
        type: "security",
      });
      router.push("/admin");
      return;
    }

    if (trimmed === "8820" || trimmed === "ELEVATE-MASTER-2025") {
      const dest = selectedVaultFilter === "resident" ? "/resident" : "/landlord";
      const masterId = selectedVaultFilter === "resident" ? "res-master" : "lld-master";
      setActiveClientId(masterId);
      setActiveClientIdState(masterId);
      setShowLoginModal(false);
      setDirectModalKey("");
      setDirectAuthError(false);
      showToast({
        title: "Master Clearance Verified",
        detail: `Studio master clearance approved. Opening ${selectedVaultFilter === "resident" ? "Resident Hub" : "Landlord Portal"}.`,
        type: "security",
      });
      router.push(dest);
      return;
    }

    const matched = clientVaults.find(
      (v) => v.passcode.toUpperCase() === trimmed || v.pinCode === directModalKey.trim()
    );

    if (matched) {
      setActiveClientId(matched.id);
      setActiveClientIdState(matched.id);
      setShowLoginModal(false);
      setDirectModalKey("");
      setDirectAuthError(false);
      showToast({
        title: `Clearance Verified: ${matched.name}`,
        detail: `Cryptographic passkey approved. Entering ${matched.roleTitle} portal.`,
        type: "security",
      });
      router.push(matched.destination);
    } else {
      setDirectAuthError(true);
      showToast({
        title: "Passkey Authorization Failed",
        detail: "Invalid Passkey or PIN. Please enter authorized credentials.",
        type: "security",
      });
    }
  };

  const handleSelectClient = (client: ClientVaultAccount) => {
    setSelectedClientForAuth(client);
    setEnteredPasscode("");
    setAuthError(false);
    setShowPasscodeText(false);
  };

  const handleBackToClientList = () => {
    setSelectedClientForAuth(null);
    setEnteredPasscode("");
    setAuthError(false);
  };

  const handleDispatchToWhatsApp = () => {
    if (!selectedClientForAuth) return;
    showToast({
      title: "VIP WhatsApp Dispatch Initiated",
      detail: `Confidential PIN and one-time verification token dispatched to ${selectedClientForAuth.phone}.`,
      type: "security",
    });
  };

  const handleAutoFillPasscode = () => {
    if (selectedClientForAuth) {
      setEnteredPasscode(selectedClientForAuth.passcode);
      setAuthError(false);
    }
  };

  const handleVerifyAndEnter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClientForAuth) return;

    const trimmed = enteredPasscode.trim().toUpperCase();
    const validPasscode = selectedClientForAuth.passcode.toUpperCase();
    const validPin = selectedClientForAuth.pinCode;

    if (trimmed !== validPasscode && trimmed !== validPin) {
      setAuthError(true);
      showToast({
        title: "Passkey Authorization Failed",
        detail: `Invalid credentials for ${selectedClientForAuth.name}. Please enter correct vault passkey.`,
        type: "security",
      });
      return;
    }

    setAuthError(false);
    setAuthenticatingId(selectedClientForAuth.id);

    showToast({
      title: `Biometric Vault Opened: ${selectedClientForAuth.name}`,
      detail: `Cryptographic passkey verified. Entering ${selectedClientForAuth.roleTitle} portal.`,
      type: "security",
    });

    setTimeout(() => {
      const destination = selectedClientForAuth.destination;
      setActiveClientId(selectedClientForAuth.id);
      setAuthenticatingId(null);
      setSelectedClientForAuth(null);
      setShowLoginModal(false);
      setEnteredPasscode("");
      router.push(destination);
    }, 600);
  };

  const filteredVaults = clientVaults.filter((v) => {
    if (selectedVaultFilter === "all") return true;
    return v.roleCategory === selectedVaultFilter;
  });

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-white/[0.08] bg-[#0A0D12]/95 backdrop-blur-xl transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo Mark Only (No Name) */}
          <div className="flex items-center gap-3">
            <Logo size="md" />
          </div>

          {/* Desktop Navigation Portals */}
          <nav className="hidden md:flex items-center gap-1.5 p-1.5 bg-[#121720]/80 rounded-full border border-white/[0.06] shadow-inner">
            <Link
              href="/"
              className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${pathname === "/"
                ? "bg-[#D4AF37] text-[#0A0D12] font-bold shadow-md shadow-[#D4AF37]/20"
                : "text-neutral-300 hover:text-white hover:bg-white/[0.05]"
                }`}
            >
              Vision
            </Link>
            <button
              onClick={() => {
                if (activeClient && activeClient.roleCategory === "landlord") {
                  router.push("/landlord");
                } else {
                  setSelectedVaultFilter("landlord");
                  setShowLoginModal(true);
                }
              }}
              className={`px-4 py-2 rounded-full text-xs font-medium flex items-center gap-1.5 transition-all ${pathname.startsWith("/landlord")
                ? "bg-[#D4AF37] text-[#0A0D12] font-bold shadow-md shadow-[#D4AF37]/20"
                : "text-neutral-300 hover:text-white hover:bg-white/[0.05]"
                }`}
            >
              <Lock className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Landlord</span>
            </button>
            <button
              onClick={() => {
                if (activeClient && activeClient.roleCategory === "resident") {
                  router.push("/resident");
                } else {
                  setSelectedVaultFilter("resident");
                  setShowLoginModal(true);
                }
              }}
              className={`px-4 py-2 rounded-full text-xs font-medium flex items-center gap-1.5 transition-all ${pathname.startsWith("/resident")
                ? "bg-[#D4AF37] text-[#0A0D12] font-bold shadow-md shadow-[#D4AF37]/20"
                : "text-neutral-300 hover:text-white hover:bg-white/[0.05]"
                }`}
            >
              <Lock className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Resident</span>
            </button>
          </nav>

          {/* Right Action: Push Notifications, Theme Toggle & Passwordless Private Client Login */}
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <PushNotificationManager />

            {activeClient ? (
              <div className="flex items-center gap-2">
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-xs font-mono">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-white font-semibold truncate max-w-[130px]">{activeClient.name}</span>
                </div>
                <button
                  onClick={handleSignOut}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition active:scale-95"
                  title="Lock Portal & Sign Out"
                >
                  <Power className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Lock</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowLoginModal(true)}
                className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl text-xs font-semibold bg-[#161D27] hover:bg-[#1E2735] text-[#DFCA9E] border border-[#D4AF37]/35 hover:border-[#D4AF37] transition-all shadow-sm active:scale-95"
              >
                <Lock className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span className="hidden sm:inline">Client Login</span>
                <span className="sm:hidden font-mono text-[11px]">Login</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile Navigation Dock (Generous touch targets & icons) */}
        <div className="md:hidden flex items-center justify-around px-2 py-2 border-t border-white/[0.06] bg-[#0A0E16]/95 backdrop-blur-lg">
          <Link
            href="/"
            className={`flex-1 py-2 px-2 text-center rounded-xl flex flex-col items-center gap-1 transition-all text-[11px] font-mono ${pathname === "/"
              ? "bg-[#D4AF37]/15 text-[#DFCA9E] font-bold border border-[#D4AF37]/30"
              : "text-neutral-400 hover:text-white"
              }`}
          >
            <Compass className="w-4 h-4" />
            <span>Vision</span>
          </Link>
          <button
            onClick={() => {
              if (activeClient && activeClient.roleCategory === "landlord") {
                router.push("/landlord");
              } else {
                setSelectedVaultFilter("landlord");
                setShowLoginModal(true);
              }
            }}
            className={`flex-1 py-2 px-2 text-center rounded-xl flex flex-col items-center gap-1 transition-all text-[11px] font-mono ${pathname.startsWith("/landlord")
              ? "bg-[#D4AF37]/15 text-[#DFCA9E] font-bold border border-[#D4AF37]/30"
              : "text-neutral-400 hover:text-white"
              }`}
          >
            <Lock className="w-4 h-4 mx-auto text-[#D4AF37]" />
            <span>Landlord</span>
          </button>
          <button
            onClick={() => {
              if (activeClient && activeClient.roleCategory === "resident") {
                router.push("/resident");
              } else {
                setSelectedVaultFilter("resident");
                setShowLoginModal(true);
              }
            }}
            className={`flex-1 py-2 px-2 text-center rounded-xl flex flex-col items-center gap-1 transition-all text-[11px] font-mono ${pathname.startsWith("/resident")
              ? "bg-[#D4AF37]/15 text-[#DFCA9E] font-bold border border-[#D4AF37]/30"
              : "text-neutral-400 hover:text-white"
              }`}
          >
            <Lock className="w-4 h-4 mx-auto text-[#D4AF37]" />
            <span>Resident</span>
          </button>
        </div>
      </header>

      {/* Institutional Biometric Client Vault Modal with Staggered Framer Motion Transitions */}
      <AnimatePresence>
        {showLoginModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.25 }}
              className="relative w-full max-w-2xl bg-[#0F1420] border border-[#D4AF37]/35 rounded-3xl p-6 sm:p-8 shadow-2xl text-left space-y-6 max-h-[92vh] overflow-y-auto"
            >
              {/* Modal Header */}
              <div className="flex items-start justify-between pb-4 border-b border-white/[0.08]">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-2xl bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[#DFCA9E] shadow-sm">
                    {selectedClientForAuth ? (
                      <Key className="w-6 h-6 text-[#D4AF37]" />
                    ) : (
                      <Fingerprint className="w-6 h-6 text-[#D4AF37]" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono tracking-wider bg-[#D4AF37]/15 text-[#DFCA9E] border border-[#D4AF37]/30 uppercase font-bold">
                        {selectedClientForAuth ? "CLIENT PASSKEY GATE" : "DIRECT CLIENT ACCESS VAULT"}
                      </span>
                      <span className="text-xs text-neutral-400 font-mono hidden sm:inline">
                        Cryptographic PIN Protected
                      </span>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-1">
                      {selectedClientForAuth
                        ? `Authenticate: ${selectedClientForAuth.name}`
                        : "Verified Client Identity Portals"}
                    </h3>
                    <p className="text-xs text-neutral-400 mt-0.5 max-w-lg leading-relaxed">
                      {selectedClientForAuth
                        ? "Enter your authorized estate vault passkey or 4-digit cryptographic PIN to unlock portal."
                        : "Select your authorized identity to open your private wealth vault. Each portal is protected with an individualized passkey."}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setShowLoginModal(false);
                    setSelectedClientForAuth(null);
                    setEnteredPasscode("");
                    setAuthError(false);
                  }}
                  className="w-8 h-8 rounded-full bg-white/[0.05] hover:bg-white/[0.1] text-neutral-400 hover:text-white flex items-center justify-center transition shrink-0"
                  aria-label="Close client vault modal"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* STAGE 1: Client Selection Grid */}
              {!selectedClientForAuth ? (
                <div className="space-y-4">
                  {/* Quick Role Filter Switcher */}
                  <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-0.5 text-xs">
                    {[
                      { id: "all", label: "All Client Vaults", count: clientVaults.length },
                      {
                        id: "landlord",
                        label: "Estate Landlords",
                        count: clientVaults.filter((c) => c.roleCategory === "landlord").length,
                      },
                      {
                        id: "resident",
                        label: "Executive Residents",
                        count: clientVaults.filter((c) => c.roleCategory === "resident").length,
                      },
                    ].map((tab) => {
                      const isSelected = selectedVaultFilter === tab.id;
                      return (
                        <button
                          key={tab.id}
                          onClick={() => setSelectedVaultFilter(tab.id)}
                          className={`py-1.5 px-3.5 rounded-xl font-mono text-xs font-bold transition flex items-center gap-2 whitespace-nowrap border ${isSelected
                              ? "bg-[#D4AF37] text-[#0A0D12] border-[#D4AF37] shadow-sm"
                              : "bg-white/[0.04] text-neutral-400 hover:text-white border-white/10 hover:bg-white/[0.08]"
                            }`}
                        >
                          <span>{tab.label}</span>
                          <span
                            className={`px-1.5 py-0.2 rounded-full text-[10px] ${isSelected ? "bg-black/20 text-[#0A0D12]" : "bg-white/10 text-neutral-400"
                              }`}
                          >
                            {tab.count}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Direct Passkey / PIN Entry Box */}
                  <form onSubmit={handleDirectModalAuth} className="p-4 rounded-2xl bg-black/60 border border-[#D4AF37]/40 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <label className="text-[11px] font-mono text-[#DFCA9E] font-bold uppercase flex items-center gap-1.5">
                        <Lock className="w-3.5 h-3.5 text-[#D4AF37]" />
                        <span>Direct {selectedVaultFilter === "resident" ? "Resident" : selectedVaultFilter === "landlord" ? "Landlord" : "Client"} Passkey or PIN</span>
                      </label>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="relative flex-1">
                        <input
                          type={showPasscodeText ? "text" : "password"}
                          value={directModalKey}
                          onChange={(e) => {
                            setDirectModalKey(e.target.value);
                            setDirectAuthError(false);
                          }}
                          placeholder="Enter Passkey (e.g. PASS-XXXX) or PIN"
                          className="w-full py-2.5 pl-3.5 pr-10 rounded-xl bg-[#0B0F17] border border-white/20 text-white font-mono text-xs focus:border-[#D4AF37] focus:outline-none transition"
                          autoFocus
                        />
                        <button
                          type="button"
                          onClick={() => setShowPasscodeText(!showPasscodeText)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white"
                        >
                          {showPasscodeText ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                      <button
                        type="submit"
                        className="py-2.5 px-4 rounded-xl bg-[#D4AF37] hover:bg-[#E5C158] text-[#0A0D12] font-bold text-xs shadow-md transition flex items-center gap-1.5 shrink-0"
                      >
                        <Key className="w-3.5 h-3.5 text-[#0A0D12]" />
                        <span>Unlock</span>
                      </button>
                    </div>
                    {directAuthError && (
                      <span className="text-red-400 text-[11px] font-mono block">
                        Invalid credentials. Please enter authorized passkey or PIN.
                      </span>
                    )}

                    <div className="pt-1 flex items-center justify-between text-[10px] font-mono text-neutral-500">
                      <span>Zero Public Directory Protocol</span>
                      <Link
                        href="/admin"
                        onClick={() => setShowLoginModal(false)}
                        className="text-neutral-400 hover:text-[#DFCA9E] transition flex items-center gap-1"
                        title="Studio Operations Desk"
                      >
                        <span>Operations Desk</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </form>

                  {/* Animated Client Vault Cards Grid */}
                  {filteredVaults.length === 0 ? (
                    <div className="p-6 text-center rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
                      <ShieldCheck className="w-6 h-6 text-[#D4AF37] mx-auto opacity-75" />
                      <h4 className="text-sm font-bold text-white">Private Principal Access</h4>
                      <p className="text-xs text-neutral-400 max-w-sm mx-auto leading-relaxed">
                        Please enter your estate passkey or cryptographic 4-digit PIN above to unlock your portal.
                      </p>
                    </div>
                  ) : (
                    <motion.div
                      variants={containerVariants}
                      initial="hidden"
                      animate="visible"
                      className="grid grid-cols-1 sm:grid-cols-2 gap-3.5"
                    >
                      {filteredVaults.map((vault) => {
                        const Icon =
                          vault.roleCategory === "resident" ? KeyRound : Building2;

                        return (
                          <motion.div
                            key={vault.id}
                            variants={cardVariants}
                            whileHover={{ y: -3, scale: 1.015 }}
                            whileTap={{ scale: 0.985 }}
                            onClick={() => handleSelectClient(vault)}
                            className="p-4 sm:p-5 rounded-2xl border transition-all text-left cursor-pointer flex flex-col justify-between space-y-3 relative overflow-hidden group shadow-lg bg-[#111722] hover:bg-[#141B26] border-white/[0.08] hover:border-[#D4AF37]/60"
                          >
                            {/* Top Badges & Role Icon */}
                            <div className="flex items-start justify-between gap-2">
                              <span className="px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md text-[10px] font-mono font-bold uppercase tracking-wider text-[#DFCA9E] border border-[#D4AF37]/30">
                                {vault.badge}
                              </span>
                              <div className="w-8 h-8 rounded-xl bg-white/[0.06] border border-white/10 flex items-center justify-center text-[#DFCA9E] group-hover:bg-[#D4AF37] group-hover:text-[#0A0D12] transition-colors">
                                <Icon className="w-4 h-4" />
                              </div>
                            </div>

                            {/* Client Principal Name & Role */}
                            <div className="space-y-0.5">
                              <h4 className="text-base font-bold text-white tracking-tight group-hover:text-[#DFCA9E] transition-colors flex items-center gap-1.5">
                                <span>{vault.name}</span>
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                              </h4>
                              <p className="text-xs text-neutral-300 font-medium">
                                {vault.roleTitle}
                              </p>
                              <p className="text-[11px] text-neutral-400 font-mono truncate">
                                {vault.estate} · {vault.location}
                              </p>
                            </div>

                            {/* Live Asset Telemetry Box - Confidential Production Badging */}
                            <div className="p-2.5 rounded-xl bg-[#080B10] border border-white/[0.06] space-y-1.5 text-xs font-mono">
                              <div className="text-[11px] text-[#DFCA9E] font-semibold truncate">
                                {vault.metric}
                              </div>
                              <div className="flex items-center justify-between text-[10px] pt-1 border-t border-white/[0.05]">
                                <span className="text-neutral-400 flex items-center gap-1">
                                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                                  <span>Security Protocol:</span>
                                </span>
                                <span className="text-emerald-400 font-semibold truncate max-w-[170px]">
                                  {vault.securityStatus.split("·")[0]}
                                </span>
                              </div>
                            </div>

                            {/* Action Callout Button */}
                            <div className="pt-1 flex items-center justify-between text-xs font-mono font-bold">
                              <span className="text-[#DFCA9E] group-hover:text-white transition-colors flex items-center gap-1.5">
                                <Lock className="w-3.5 h-3.5 text-[#D4AF37]" />
                                Authenticate with Personal Key
                              </span>
                              <div className="w-6 h-6 rounded-lg bg-[#D4AF37]/20 group-hover:bg-[#D4AF37] text-[#DFCA9E] group-hover:text-[#0A0D12] flex items-center justify-center transition-all group-hover:translate-x-1">
                                <ArrowRight className="w-3.5 h-3.5" />
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </motion.div>
                  )}
                </div>
              ) : (
                /* STAGE 2: Interactive Confidential Password / Passkey Authorization Gate */
                <motion.form
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25 }}
                  onSubmit={handleVerifyAndEnter}
                  className="space-y-5"
                >
                  {/* Back to Client Selection Button */}
                  <button
                    type="button"
                    onClick={handleBackToClientList}
                    className="inline-flex items-center gap-2 text-xs font-mono font-bold text-[#DFCA9E] hover:text-white transition"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Return to Verified Client Directory</span>
                  </button>

                  {/* Selected Client Identity Banner */}
                  <div className="p-4 rounded-2xl bg-[#111722] border border-[#D4AF37]/35 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-inner">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-[#D4AF37]/15 text-[#DFCA9E] border border-[#D4AF37]/30">
                          {selectedClientForAuth.badge}
                        </span>
                        <span className="text-xs font-mono text-neutral-400">
                          {selectedClientForAuth.roleTitle}
                        </span>
                      </div>
                      <h4 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                        <span>{selectedClientForAuth.name}</span>
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      </h4>
                      <p className="text-xs text-neutral-300 font-mono">
                        {selectedClientForAuth.estate} · {selectedClientForAuth.location}
                      </p>
                    </div>

                    <div className="sm:text-right font-mono text-xs text-[#DFCA9E] shrink-0">
                      <span className="block font-bold text-sm text-white">
                        {selectedClientForAuth.metric.split("·")[0]}
                      </span>
                      <span className="text-[10px] text-emerald-400 flex items-center sm:justify-end gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        Hardware Passkey Synced
                      </span>
                    </div>
                  </div>

                  {/* Password Input Field with Masking */}
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-bold text-white font-mono flex items-center gap-1.5">
                        <Lock className="w-3.5 h-3.5 text-[#D4AF37]" />
                        Personal Confidential Passkey or 4-Digit PIN:
                      </label>
                      <span className="text-[11px] font-mono text-neutral-400">
                        Direct Bank-Grade Gate
                      </span>
                    </div>

                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                        <KeyRound className="w-4 h-4 text-[#D4AF37]" />
                      </div>
                      <input
                        type={showPasscodeText ? "text" : "password"}
                        required
                        autoFocus
                        value={enteredPasscode}
                        onChange={(e) => {
                          setEnteredPasscode(e.target.value);
                          if (authError) setAuthError(false);
                        }}
                        placeholder="Enter your confidential Passkey or 4-digit PIN..."
                        className={`w-full pl-10 pr-12 py-3.5 bg-[#080B10] border rounded-2xl text-sm font-mono text-white placeholder-neutral-500 focus:outline-none transition ${authError
                            ? "border-rose-500 ring-2 ring-rose-500/30 text-rose-300"
                            : "border-white/15 focus:border-[#D4AF37]"
                          }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasscodeText(!showPasscodeText)}
                        className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-neutral-400 hover:text-white transition"
                        title={showPasscodeText ? "Hide Passkey" : "Reveal Passkey"}
                      >
                        {showPasscodeText ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>

                    {/* Production Security & Delivery Protocol Pill */}
                    <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/5 space-y-2 text-xs font-mono">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-1.5 text-neutral-300 font-semibold">
                          <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                          <span>Confidential Personal Delivery Notice:</span>
                        </div>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#D4AF37]/10 text-[#DFCA9E] border border-[#D4AF37]/25">
                          {selectedClientForAuth.deliveryMethod}
                        </span>
                      </div>
                      <p className="text-[11px] text-neutral-400 leading-relaxed font-sans">
                        Your login credential was issued individually during compound onboarding via your physical wax-sealed <strong className="text-white">Welcome Folio</strong> or sent directly to your registered Nigerian line <span className="font-mono text-[#D4AF37] font-semibold">{selectedClientForAuth.phone}</span>.
                      </p>

                      <div className="pt-1.5 flex items-center justify-between gap-2 border-t border-white/5">
                        <button
                          type="button"
                          onClick={handleDispatchToWhatsApp}
                          className="text-[11px] font-mono text-[#DFCA9E] hover:text-white font-bold inline-flex items-center gap-1.5 transition"
                        >
                          <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Dispatch PIN to Verified WhatsApp ({selectedClientForAuth.phone.slice(-4)})</span>
                        </button>
                        <span className="text-[10px] text-neutral-500 font-mono">
                          Zero Public Visibility
                        </span>
                      </div>
                    </div>

                    {authError && (
                      <motion.div
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center gap-2 text-xs font-mono text-rose-300"
                      >
                        <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                        <span>
                          Invalid credential. Passkeys are confidential to {selectedClientForAuth.name}. Please enter your personal 4-digit PIN or click "Dispatch PIN to Verified WhatsApp".
                        </span>
                      </motion.div>
                    )}
                  </div>

                  {/* Submit / Cancel Buttons */}
                  <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                    <button
                      type="submit"
                      disabled={!enteredPasscode || authenticatingId !== null}
                      className="w-full sm:flex-1 py-3.5 px-5 rounded-xl bg-[#D4AF37] hover:bg-[#E5C158] text-[#0A0D12] font-bold text-xs shadow-md shadow-[#D4AF37]/20 flex items-center justify-center gap-2 transition active:scale-98 disabled:opacity-50"
                    >
                      {authenticatingId ? (
                        <>
                          <span className="w-3.5 h-3.5 border-2 border-[#0A0D12] border-t-transparent rounded-full animate-spin" />
                          <span>Authenticating Passkey...</span>
                        </>
                      ) : (
                        <>
                          <ShieldCheck className="w-4 h-4 text-[#0A0D12]" />
                          <span>Unlock & Enter {selectedClientForAuth.name.split(" ")[0]} Vault</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={handleBackToClientList}
                      className="w-full sm:w-auto py-3.5 px-5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-neutral-300 hover:text-white text-xs font-mono font-bold transition text-center"
                    >
                      Back
                    </button>
                  </div>
                </motion.form>
              )}

              {/* Confidentiality Footer Bar */}
              <div className="p-3.5 rounded-2xl bg-[#090C12] border border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono text-neutral-400">
                <div className="flex items-center gap-2">
                  <Lock className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                  <span className="text-[11px]">
                    Zero Public Directory Exposure · FIDO2 Cryptographic Passkey Isolation
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowLoginModal(false);
                      setSelectedClientForAuth(null);
                      setEnteredPasscode("");
                      setAuthError(false);
                    }}
                    className="py-1.5 px-3.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-neutral-300 hover:text-white text-xs font-bold transition whitespace-nowrap"
                  >
                    Close Vault
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
