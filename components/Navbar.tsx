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
  const [showPasscodeText, setShowPasscodeText] = useState(false);
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
      const dest = pathname.includes("resident") ? "/resident" : "/landlord";
      const masterId = pathname.includes("resident") ? "res-master" : "lld-master";
      setActiveClientId(masterId);
      setActiveClientIdState(masterId);
      setShowLoginModal(false);
      setDirectModalKey("");
      setDirectAuthError(false);
      showToast({
        title: "Master Clearance Verified",
        detail: `Studio master clearance approved. Opening ${pathname.includes("resident") ? "Resident Hub" : "Landlord Portal"}.`,
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
              className="relative w-full max-w-lg bg-[#0F1420] border border-[#D4AF37]/35 rounded-3xl p-6 sm:p-8 shadow-2xl text-left space-y-6 overflow-hidden"
            >
              {/* Subtle gold glow */}
              <div className="absolute top-0 right-0 w-60 h-60 bg-[#D4AF37]/5 blur-[90px] rounded-full pointer-events-none" />

              {/* Modal Header */}
              <div className="flex items-start justify-between pb-4 border-b border-white/[0.08] relative z-10">
                <div className="space-y-3">
                  <Logo size="sm" href="" />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono tracking-wider bg-[#D4AF37]/15 text-[#DFCA9E] border border-[#D4AF37]/30 uppercase font-bold">
                        CONFIDENTIAL CLIENT GATEWAY
                      </span>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-1 font-sans">
                      Private Enclave Access
                    </h3>
                    <p className="text-xs text-neutral-400 mt-0.5 leading-relaxed">
                      Enter your authorized estate passkey or 4-digit security PIN to unlock your personified portal.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setShowLoginModal(false);
                    setDirectModalKey("");
                    setDirectAuthError(false);
                  }}
                  className="w-8 h-8 rounded-full bg-white/[0.05] hover:bg-white/[0.1] text-neutral-400 hover:text-white flex items-center justify-center transition shrink-0"
                  aria-label="Close client vault modal"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Direct Passkey / PIN Entry Form */}
              <form onSubmit={handleDirectModalAuth} className="space-y-4 relative z-10">
                <div>
                  <label className="text-[11px] font-mono text-neutral-300 block mb-1.5 uppercase font-medium">
                    Estate Passkey or 4-Digit Security PIN
                  </label>
                  <div className="relative">
                    <input
                      type={showPasscodeText ? "text" : "password"}
                      value={directModalKey}
                      onChange={(e) => {
                        setDirectModalKey(e.target.value);
                        setDirectAuthError(false);
                      }}
                      placeholder="e.g. PASS-XXXX or 4-Digit PIN"
                      className="w-full py-3 pl-4 pr-12 rounded-xl bg-black/60 border border-white/20 text-white font-mono text-sm focus:border-[#D4AF37] focus:outline-none transition"
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasscodeText(!showPasscodeText)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white transition"
                    >
                      {showPasscodeText ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {directAuthError && (
                    <span className="text-red-400 text-xs font-mono mt-2 block">
                      Invalid credentials. Please enter authorized passkey or PIN.
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

              {/* Confidentiality Notice Box */}
              <div className="p-3.5 rounded-2xl bg-[#0B0E15] border border-white/[0.08] space-y-1.5 relative z-10">
                <div className="flex items-center gap-2 text-xs font-mono text-[#DFCA9E] font-semibold">
                  <ShieldCheck className="w-4 h-4 text-[#D4AF37] shrink-0" />
                  <span>Zero Public Directory Protocol</span>
                </div>
                <p className="text-[11px] text-neutral-400 font-mono leading-relaxed">
                  Family compounds, diaspora landlords, and resident suites are strictly isolated. No client names, property units, or yields are indexed or exposed publicly. Each key unlocks only its designated enclave.
                </p>
              </div>

              {/* Modal Footer */}
              <div className="pt-2 border-t border-white/[0.08] flex items-center justify-between text-[11px] font-mono text-neutral-500 relative z-10">
                <span>Elevated Stay Security Protocol</span>
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
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
