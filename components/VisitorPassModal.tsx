"use client";

import { useState } from "react";
import { VisitorPass } from "@/lib/types";
import { ShieldCheck, Share2, Copy, Check, MessageSquare, Clock, Car, User, X, QrCode } from "lucide-react";
import { QRCodeView } from "./QRCodeView";
import { Logo } from "./Logo";
import { useToast } from "./ToastProvider";

interface VisitorPassModalProps {
  onClose: () => void;
  onPassCreated: (pass: VisitorPass) => void;
  unitName: string;
  compoundName: string;
  residentName: string;
}

export function VisitorPassModal({
  onClose,
  onPassCreated,
  unitName,
  compoundName,
  residentName,
}: VisitorPassModalProps) {
  const { showToast } = useToast();
  const [guestName, setGuestName] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [vehiclePlate, setVehiclePlate] = useState("");
  const [passDuration, setPassDuration] = useState("4"); // hours
  const [generatedPass, setGeneratedPass] = useState<VisitorPass | null>(null);
  const [copied, setCopied] = useState(false);

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName) return;

    const randomSuffix = Math.floor(100000 + Math.random() * 900000);
    const code = `EST-${randomSuffix}`;
    const now = new Date();
    const expiry = new Date(now.getTime() + parseInt(passDuration) * 60 * 60 * 1000);

    const formatTime = (d: Date) =>
      d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });

    const messageText = encodeURIComponent(
      `*Elevated Stay Gate Clearance Pass*\n` +
      `Estate: ${compoundName}\n` +
      `Host: ${residentName} (${unitName})\n` +
      `Guest: ${guestName}\n` +
      `Passcode: *${code}*\n` +
      `Valid: Today until ${formatTime(expiry)} WAT\n` +
      (vehiclePlate ? `Vehicle: ${vehiclePlate}\n` : "") +
      `_Present this code to the compound security gate for automated verification._`
    );

    const newPass: VisitorPass = {
      id: `vst-${Date.now()}`,
      code,
      guestName,
      guestPhone: guestPhone || "+234...",
      residentId: "res-01",
      residentName,
      unitName,
      compoundName,
      validFrom: formatTime(now),
      validUntil: formatTime(expiry),
      status: "active",
      vehiclePlate: vehiclePlate.toUpperCase() || undefined,
      whatsappMessageUrl: `https://wa.me/?text=${messageText}`,
    };

    setGeneratedPass(newPass);
    onPassCreated(newPass);

    showToast({
      title: "Visitor Gate Pass Generated",
      detail: `Pre-clearance pass ${code} created for ${guestName}. Valid for ${passDuration} hrs.`,
      type: "security",
      actionUrl: "/resident",
    });
  };

  const copyCode = () => {
    if (!generatedPass) return;
    navigator.clipboard.writeText(generatedPass.code);
    setCopied(true);
    showToast({
      title: "Gate Code Copied",
      detail: `Passcode ${generatedPass.code} copied to clipboard.`,
      type: "security",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-md bg-[#121722] border border-[#C2A774]/30 rounded-2xl p-6 sm:p-7 shadow-2xl text-left">
        <div className="mb-4">
          <Logo size="sm" href="" />
        </div>
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.08] mb-5">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-[#C2A774]/10 text-[#C2A774] border border-[#C2A774]/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">1-Click Visitor Pre-Clearance</h3>
              <p className="text-[11px] text-neutral-400 font-mono">Headless Gate Pass · WhatsApp Sync</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-white p-1 rounded-lg hover:bg-white/[0.05]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {!generatedPass ? (
          <form onSubmit={handleGenerate} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-[#C2A774]" /> Guest Full Name / Designation
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Dr. Kemi Johnson (Consultant)"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#0C1017] border border-white/10 rounded-xl text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#C2A774] transition"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1 flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-[#C2A774]" /> Guest Phone (WhatsApp)
                </label>
                <input
                  type="tel"
                  placeholder="+234 800 000 0000"
                  value={guestPhone}
                  onChange={(e) => setGuestPhone(e.target.value)}
                  className="w-full px-3 py-2 bg-[#0C1017] border border-white/10 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#C2A774] transition"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1 flex items-center gap-1.5">
                  <Car className="w-3.5 h-3.5 text-[#C2A774]" /> Vehicle Plate (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. APP-491-KJ"
                  value={vehiclePlate}
                  onChange={(e) => setVehiclePlate(e.target.value)}
                  className="w-full px-3 py-2 bg-[#0C1017] border border-white/10 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#C2A774] transition uppercase"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#C2A774]" /> Access Validity Window
              </label>
              <select
                value={passDuration}
                onChange={(e) => setPassDuration(e.target.value)}
                className="w-full px-3 py-2 bg-[#0C1017] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#C2A774] transition"
              >
                <option value="2">2 Hours (Quick Courier / Delivery)</option>
                <option value="4">4 Hours (Standard Meeting)</option>
                <option value="8">8 Hours (Full Day Executive Guest)</option>
                <option value="24">24 Hours (Overnight Approved Guest)</option>
              </select>
            </div>

            <div className="p-3 rounded-xl bg-[#090C12] border border-white/[0.05] text-[11px] text-neutral-400">
              <span className="text-[#DFCA9E] font-medium block mb-0.5">Annexure Rule Reminder:</span>
              Quiet hours commence at 22:00. Unregistered commercial vehicles or parties exceeding unit occupancy threshold require 48h advance concierge approval.
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center gap-2.5">
              <button
                type="submit"
                className="w-full sm:flex-1 py-3 px-4 bg-[#D4AF37] hover:bg-[#E5C158] text-[#0A0D12] font-bold text-xs rounded-xl shadow-md shadow-[#D4AF37]/20 transition-all flex items-center justify-center gap-2 active:scale-98"
              >
                <span>Generate Gate Pass</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto py-3 px-4 bg-white/[0.04] hover:bg-white/[0.08] text-neutral-300 text-xs font-medium rounded-xl border border-white/10 transition text-center"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-4 text-center">
            <div className="p-6 rounded-3xl bg-gradient-to-b from-[#0F141F] to-[#0A0D14] border border-[#D4AF37]/40 relative overflow-hidden space-y-4 shadow-2xl">
              <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
                <div className="flex items-center gap-1.5 text-[10px] font-mono tracking-wider uppercase text-[#DFCA9E]">
                  <QrCode className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>Gate Barrier Pass</span>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-[#D4AF37]/15 text-[#DFCA9E] border border-[#D4AF37]/30">
                  Pre-Cleared
                </span>
              </div>

              {/* Scannable Optical QR Code */}
              <div className="flex justify-center py-1">
                <div className="p-2 rounded-2xl bg-white shadow-xl border-2 border-[#D4AF37]/40">
                  <QRCodeView
                    value={`https://stay.com.ng/verify/gate?pass=${generatedPass.code}&compound=${encodeURIComponent(compoundName)}`}
                    size={140}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest block">
                  6-Digit Gate Access Code
                </span>
                <div className="text-3xl font-mono font-bold tracking-widest text-white">
                  {generatedPass.code}
                </div>
              </div>

              <div className="text-xs text-neutral-300 pt-2 border-t border-white/[0.06] space-y-1">
                <p>
                  Guest: <strong className="text-white font-medium">{generatedPass.guestName}</strong>
                </p>
                <p className="text-[11px] text-neutral-400 font-mono">
                  Valid Today until {generatedPass.validUntil} WAT
                </p>
                {generatedPass.vehiclePlate && (
                  <div className="inline-block mt-1 px-2.5 py-0.5 rounded bg-white/10 text-xs font-mono text-white">
                    Plate: {generatedPass.vehiclePlate}
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                onClick={copyCode}
                className="py-2.5 px-3 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-white font-medium flex items-center justify-center gap-1.5 transition"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? "Copied!" : "Copy Code"}</span>
              </button>

              <a
                href={generatedPass.whatsappMessageUrl}
                target="_blank"
                rel="noreferrer"
                onClick={() =>
                  showToast({
                    title: "Shared via WhatsApp",
                    detail: `Gate clearance invitation dispatched for ${generatedPass.guestName}.`,
                    type: "messaging",
                  })
                }
                className="py-2.5 px-3 rounded-xl bg-[#25D366] hover:bg-[#20BD5A] text-black font-semibold flex items-center justify-center gap-1.5 transition"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Share via WhatsApp</span>
              </a>
            </div>

            <button
              onClick={onClose}
              className="w-full py-2 text-xs text-neutral-400 hover:text-white transition"
            >
              Done & Return to Resident Hub
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

