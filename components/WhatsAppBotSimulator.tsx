"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Send, CheckCheck, Phone, ShieldCheck, ArrowRight, Bot } from "lucide-react";
import { useToast } from "./ToastProvider";

interface ChatMessage {
  id: string;
  sender: "user" | "bot";
  text: string;
  timestamp: string;
  badge?: string;
}

export function WhatsAppBotSimulator() {
  const { showToast } = useToast();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "msg-1",
      sender: "bot",
      text: "Elevated Stay Private Desk · Secure Headless Session Active. Send 'PASS' for visitor clearance, 'BALANCE' for rent payout ledger, or 'ESCROW' for facility reserves.",
      timestamp: "10:14 AM",
    },
    {
      id: "msg-2",
      sender: "user",
      text: "PASS Chuka Obi +2348039112004",
      timestamp: "10:15 AM",
    },
    {
      id: "msg-3",
      sender: "bot",
      text: "✓ Gate Clearance Pass Generated: EST-849204 for Chuka Obi at The Obsidian Courtyard (4 Bourdillon Rd). Optical QR code auto-dispatched to guest WhatsApp. Valid until 23:59 WAT.",
      timestamp: "10:15 AM",
      badge: "EST-849204 Verified",
    },
  ]);

  const [inputCommand, setInputCommand] = useState("");

  const handleCommand = (cmd: string) => {
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: cmd,
      timestamp: "Just now",
    };

    let replyText = "";
    let replyBadge: string | undefined = undefined;

    if (cmd.toUpperCase().includes("BALANCE") || cmd.toUpperCase().includes("PAYOUT")) {
      replyText = "Landlord Principal: Latest automated rent split settled on Feb 28. Net landlord wire: ₦35,150,000 (92.5%) deposited to Verified Subaccount. Download signed voucher: stay.com.ng/v/8812";
      replyBadge = "₦35,150,000 Disbursed";
    } else if (cmd.toUpperCase().includes("ESCROW")) {
      replyText = "The Obsidian Courtyard Facility Escrow: ₦34,500,000 held at Standard Chartered. Last certified deduction: ₦485,000 (Quarterly Daikin VRV chiller coil servicing by Carrier & Daikin Certified Nigeria).";
      replyBadge = "₦34.5M Liquid Escrow";
    } else if (cmd.toUpperCase().includes("PASS")) {
      replyText = "Gate pass EST-629104 created for Arch. Kemi Williams. WhatsApp clearance SMS sent with optical barrier QR barcode. Valid for 4 hours.";
      replyBadge = "Gate Barcode Synced";
    } else {
      replyText = "Command acknowledged by Elevated Stay Master Operations. Your request has been routed to the Lagos Flagship Operations Desk. Status: Optimal.";
    }

    const botMsg: ChatMessage = {
      id: `bot-${Date.now()}`,
      sender: "bot",
      text: replyText,
      timestamp: "Just now",
      badge: replyBadge,
    };

    setMessages((prev) => [...prev, userMsg, botMsg]);
    setInputCommand("");

    showToast({
      title: `WhatsApp Gateway: ${replyBadge || "Command Synced"}`,
      detail: replyText.length > 95 ? replyText.slice(0, 95) + "..." : replyText,
      type: "messaging",
    });
  };

  return (
    <div className="rounded-3xl bg-[#090D14] border border-white/[0.09] hover:border-[#D4AF37]/40 shadow-2xl p-6 sm:p-8 space-y-6 relative overflow-hidden transition-all">
      {/* Subtle gold ambient lighting */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-[#D4AF37]/5 blur-[120px] rounded-full pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono tracking-widest uppercase font-semibold bg-[#D4AF37]/15 text-[#DFCA9E] border border-[#D4AF37]/30 flex items-center gap-1.5 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-pulse" />
              LIVE WHATSAPP CLOUD API GATEWAY
            </span>
            <span className="text-xs text-neutral-400 font-mono hidden sm:inline">
              Zero App Download Required
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Live Headless WhatsApp Operations Desk
          </h3>
          <p className="text-xs text-neutral-400 mt-1 max-w-xl">
            High-net-worth clients avoid heavy software. Issue gate clearance passes, query live rent balances, and audit facility escrows directly via WhatsApp.
          </p>
        </div>

        <div className="flex items-center gap-2 p-1.5 rounded-xl bg-black/40 border border-white/10 text-xs font-mono text-[#DFCA9E]">
          <Bot className="w-4 h-4 text-[#D4AF37]" />
          <span>Gateway Active</span>
        </div>
      </div>

      {/* Interactive Chat Window */}
      <div className="rounded-2xl bg-[#07090E] border border-white/[0.07] p-4 sm:p-5 space-y-4 max-h-96 overflow-y-auto shadow-inner">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex flex-col ${m.sender === "user" ? "items-end" : "items-start"}`}
          >
            <div
              className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-3 text-xs leading-relaxed shadow-md ${
                m.sender === "user"
                  ? "bg-[#D4AF37]/15 text-white border border-[#D4AF37]/30"
                  : "bg-[#121722] text-neutral-200 border border-white/10"
              }`}
            >
              {m.badge && (
                <span className="inline-block px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-black/60 text-[#DFCA9E] border border-[#D4AF37]/30 mb-1.5">
                  {m.badge}
                </span>
              )}
              <p>{m.text}</p>
              <div className="flex items-center justify-end gap-1 text-[9px] font-mono text-neutral-400 mt-1.5">
                <span>{m.timestamp}</span>
                {m.sender === "user" && <CheckCheck className="w-3 h-3 text-[#D4AF37]" />}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Interactive Command Buttons */}
      <div className="space-y-2">
        <span className="text-[11px] font-mono text-[#DFCA9E] uppercase tracking-wider block font-semibold">
          Execute Real-Time Command:
        </span>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => handleCommand("PAYOUTS")}
            className="py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/[0.08] dark:hover:bg-[#D4AF37]/20 border border-slate-300 dark:border-white/15 text-xs font-mono font-bold text-[#0F172A] dark:text-[#DFCA9E] transition active:scale-98 shadow-sm"
          >
            "PAYOUTS" (Query Net Rent)
          </button>
          <button
            onClick={() => handleCommand("PASS Arch. Kemi Williams")}
            className="py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/[0.08] dark:hover:bg-[#D4AF37]/20 border border-slate-300 dark:border-white/15 text-xs font-mono font-bold text-[#0F172A] dark:text-white transition active:scale-98 shadow-sm"
          >
            "PASS" (1-Click Gate QR Code)
          </button>
          <button
            onClick={() => handleCommand("ESCROW The Obsidian")}
            className="py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/[0.08] dark:hover:bg-[#D4AF37]/20 border border-slate-300 dark:border-white/15 text-xs font-mono font-bold text-[#0F172A] dark:text-[#DFCA9E] transition active:scale-98 shadow-sm"
          >
            "ESCROW" (Audit Facility Reserve)
          </button>
        </div>
      </div>
    </div>
  );
}

