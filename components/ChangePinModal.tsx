"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Key, Check, ShieldCheck, X, Eye, EyeOff } from "lucide-react";
import { Logo } from "@/components/Logo";
import { useToast } from "@/components/ToastProvider";
import {
  getClientVaults,
  updateClientCredentialsInStorage,
  ADMIN_MASTER_DEFAULT_PIN,
  ADMIN_MASTER_DEFAULT_KEY,
} from "@/lib/client-vault";

interface ChangePinModalProps {
  isOpen: boolean;
  onClose: () => void;
  clientId: string;
  clientName: string;
  role: "Landlord Principal" | "Resident Suite";
}

export function ChangePinModal({
  isOpen,
  onClose,
  clientId,
  clientName,
  role,
}: ChangePinModalProps) {
  const { showToast } = useToast();
  const [currentPin, setCurrentPin] = useState("");
  const [newPin, setNewPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const vaults = getClientVaults();
    const client = vaults.find((v) => v.id === clientId);

    // Verify current PIN
    const isMasterAuthorized =
      currentPin.trim() === ADMIN_MASTER_DEFAULT_PIN ||
      currentPin.trim().toUpperCase() === ADMIN_MASTER_DEFAULT_KEY;
    const isClientPinValid = client && (client.pinCode === currentPin.trim() || client.passcode.toUpperCase() === currentPin.trim().toUpperCase());

    if (!isMasterAuthorized && !isClientPinValid) {
      setError("Current PIN or Passkey is incorrect.");
      return;
    }

    // Validate new PIN
    const cleanNewPin = newPin.trim();
    if (!/^\d{4,6}$/.test(cleanNewPin)) {
      setError("New PIN must be 4 to 6 numeric digits.");
      return;
    }

    if (cleanNewPin !== confirmPin.trim()) {
      setError("New PIN and Confirmation PIN do not match.");
      return;
    }

    // Update in storage
    const existingPasscode = client?.passcode || "PASS-" + Math.floor(1000 + Math.random() * 9000);
    updateClientCredentialsInStorage(clientId, existingPasscode, cleanNewPin);

    setIsSuccess(true);
    showToast({
      title: "Security Credentials Updated",
      detail: `New 4-digit PIN has been assigned to ${clientName}. Effective immediately.`,
      type: "security",
    });

    setTimeout(() => {
      setIsSuccess(false);
      setCurrentPin("");
      setNewPin("");
      setConfirmPin("");
      onClose();
    }, 1200);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full max-w-md bg-[#0F141E] border border-white/[0.12] rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden"
        >
          {/* Subtle gold glow */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-[#D4AF37]/10 blur-[80px] pointer-events-none rounded-full" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-neutral-400 hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="mb-4">
            <Logo size="sm" href="" />
          </div>

          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-2xl bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[#DFCA9E]">
              <Lock className="w-5 h-5 text-[#D4AF37]" />
            </div>
            <div>
              <span className="text-[10px] font-mono tracking-widest uppercase font-bold text-[#DFCA9E] block">
                {role} CREDENTIAL ROTATION
              </span>
              <h2 className="text-lg font-bold text-white tracking-tight">
                Change Security PIN
              </h2>
            </div>
          </div>

          <p className="text-xs text-neutral-300 font-mono mb-5 leading-relaxed">
            Update the 4-digit security PIN used to decrypt <strong className="text-white">{clientName}</strong>&apos;s isolated portal.
          </p>

          {isSuccess ? (
            <div className="py-8 text-center space-y-3">
              <div className="w-12 h-12 mx-auto rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <Check className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">PIN Successfully Rotated</h3>
              <p className="text-xs text-neutral-300 font-mono">
                Your new security PIN is now active for future logins.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-[11px] font-mono text-neutral-300 block mb-1.5 uppercase">
                  Current PIN or Passkey
                </label>
                <div className="relative">
                  <input
                    type={showCurrent ? "text" : "password"}
                    value={currentPin}
                    onChange={(e) => {
                      setCurrentPin(e.target.value);
                      setError(null);
                    }}
                    placeholder="Enter existing PIN"
                    className="w-full py-2.5 pl-3.5 pr-10 rounded-xl bg-black/60 border border-white/15 text-white font-mono text-sm focus:border-[#D4AF37] focus:outline-none transition"
                    required
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrent(!showCurrent)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white"
                  >
                    {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-mono text-neutral-300 block mb-1.5 uppercase">
                  New 4-Digit Security PIN
                </label>
                <div className="relative">
                  <input
                    type={showNew ? "text" : "password"}
                    maxLength={6}
                    value={newPin}
                    onChange={(e) => {
                      setNewPin(e.target.value);
                      setError(null);
                    }}
                    placeholder="e.g. 4820"
                    className="w-full py-2.5 pl-3.5 pr-10 rounded-xl bg-black/60 border border-white/15 text-white font-mono text-sm focus:border-[#D4AF37] focus:outline-none transition"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew(!showNew)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white"
                  >
                    {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-mono text-neutral-300 block mb-1.5 uppercase">
                  Confirm New PIN
                </label>
                <input
                  type={showNew ? "text" : "password"}
                  maxLength={6}
                  value={confirmPin}
                  onChange={(e) => {
                    setConfirmPin(e.target.value);
                    setError(null);
                  }}
                  placeholder="Re-enter 4-digit PIN"
                  className="w-full py-2.5 pl-3.5 pr-3.5 rounded-xl bg-black/60 border border-white/15 text-white font-mono text-sm focus:border-[#D4AF37] focus:outline-none transition"
                  required
                />
              </div>

              {error && (
                <div className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/25 text-red-400 text-xs font-mono">
                  {error}
                </div>
              )}

              <div className="pt-2 flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-1/3 py-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-neutral-300 text-xs font-semibold font-mono border border-white/10 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-2/3 py-3 rounded-xl bg-[#D4AF37] hover:bg-[#E5C158] text-[#0A0D12] text-xs font-bold font-mono shadow-md shadow-[#D4AF37]/20 flex items-center justify-center gap-2 transition"
                >
                  <Key className="w-3.5 h-3.5 text-[#0A0D12]" />
                  <span>Update PIN</span>
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

