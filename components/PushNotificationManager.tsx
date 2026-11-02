"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  X,
  CheckCircle2,
  ShieldCheck,
  Zap,
  TrendingUp,
  KeyRound,
  FileCheck,
  Radio,
  ExternalLink,
  ChevronRight,
  BadgeCheck,
} from "lucide-react";

export interface LiveActivityNotification {
  id: string;
  category: "finance" | "security" | "iot" | "maintenance";
  title: string;
  detail: string;
  timestamp: string;
  unread: boolean;
  compound: string;
  actionUrl?: string;
}

const INITIAL_ACTIVITIES: LiveActivityNotification[] = [
  {
    id: "notif-1",
    category: "finance",
    title: "Net Landlord Remittance Dispatched",
    detail: "₦35,150,000 (92.5% Base Rent) atomically deposited to Verified Landlord GTBank Subaccount.",
    timestamp: "Just now",
    unread: true,
    compound: "The Obsidian Courtyard",
    actionUrl: "/landlord",
  },
  {
    id: "notif-2",
    category: "security",
    title: "Lobby Turnstile Gate Pre-Clearance",
    detail: "Visitor Pass EST-849204 scanned and authorized for Chuka Obi at main barrier speed-gates.",
    timestamp: "4 mins ago",
    unread: true,
    compound: "The Obsidian Courtyard",
    actionUrl: "/resident",
  },
  {
    id: "notif-3",
    category: "iot",
    title: "Solar BMS Grid Switchover Executed",
    detail: "BMS firmware v4.9 automatic switchover in 12ms. Lithium bank at 99.4% SoC. Zero server blink.",
    timestamp: "12 mins ago",
    unread: true,
    compound: "Aura Residence",
    actionUrl: "/landlord",
  },
  {
    id: "notif-4",
    category: "maintenance",
    title: "Quantity Surveyor Escrow Sealed",
    detail: "₦485,000 disbursed from ringfenced escrow to Carrier & Daikin Certified Nigeria Ltd. 98.4% coil restored.",
    timestamp: "42 mins ago",
    unread: false,
    compound: "The Obsidian Courtyard",
    actionUrl: "/landlord",
  },
  {
    id: "notif-5",
    category: "iot",
    title: "Borehole Reverse Osmosis Verified",
    detail: "Permeate hydro sensor verified at 13.8 PPM (potable gold standard). UV filtration active.",
    timestamp: "2 hrs ago",
    unread: false,
    compound: "Kano Crescent Villas",
    actionUrl: "/landlord",
  },
];

export function PushNotificationManager() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<LiveActivityNotification[]>(INITIAL_ACTIVITIES);
  const [activeFilter, setActiveFilter] = useState<"all" | "finance" | "security" | "iot">("all");
  const [pushEnabled, setPushEnabled] = useState(false);

  const unreadCount = notifications.filter((n) => n.unread).length;

  // Request browser push notification permission
  const handleEnableBrowserPush = async () => {
    if ("Notification" in window) {
      try {
        const permission = await Notification.requestPermission();
        if (permission === "granted") {
          setPushEnabled(true);
          new Notification("Elevated Stay Live Alerts Enabled", {
            body: "Real-time payout alerts, turnstile gate passes, and IoT sensor updates are now active.",
            icon: "/favicon.ico",
          });
        }
      } catch (err) {
        console.warn("Push permission error:", err);
      }
    } else {
      setPushEnabled(true);
    }
  };

  // Listen to platform-wide live events emitted via ToastProvider / user interactions
  useEffect(() => {
    const handleLiveEvent = (e: Event) => {
      const customEvent = e as CustomEvent<{
        id?: string;
        title: string;
        detail: string;
        category?: "finance" | "security" | "iot" | "maintenance" | "messaging";
        timestamp?: string;
        compound?: string;
        actionUrl?: string;
      }>;

      if (customEvent.detail) {
        const d = customEvent.detail;
        const categoryMap = (d.category === "messaging" ? "security" : d.category) || "finance";
        const newNotif: LiveActivityNotification = {
          id: d.id || `live-${Date.now()}`,
          category: categoryMap as "finance" | "security" | "iot" | "maintenance",
          title: d.title,
          detail: d.detail,
          timestamp: d.timestamp || "Just now",
          unread: true,
          compound: d.compound || "Lagos Operations Desk",
          actionUrl: d.actionUrl,
        };

        setNotifications((prev) => [newNotif, ...prev]);

        // Trigger native browser notification if granted
        if ("Notification" in window && Notification.permission === "granted") {
          try {
            new Notification(d.title, {
              body: d.detail,
              icon: "/favicon.ico",
            });
          } catch (err) {
            console.warn("Native push dispatch error:", err);
          }
        }
      }
    };

    window.addEventListener("elevation_new_notification", handleLiveEvent);
    return () => {
      window.removeEventListener("elevation_new_notification", handleLiveEvent);
    };
  }, []);

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const filteredNotifications = notifications.filter((n) => {
    if (activeFilter === "all") return true;
    return n.category === activeFilter;
  });

  return (
    <>
      {/* Navbar Bell Trigger */}
      <button
        onClick={() => setIsOpen(true)}
        className="relative p-2.5 rounded-xl bg-[#161D27] hover:bg-[#1E2735] text-[#DFCA9E] border border-[#D4AF37]/35 hover:border-[#D4AF37] transition-all shadow-sm active:scale-95"
        title="Live Compound Activity Stream & Push Notifications"
        aria-label="View notifications"
      >
        <Bell className="w-4 h-4 text-[#D4AF37]" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#D4AF37] text-[#0A0D12] font-mono text-[9px] font-bold flex items-center justify-center shadow-md animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Floating Push Notification Drawer */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm">
            {/* Click outside to close */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0"
            />

            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="relative w-full max-w-md h-full bg-[#0B0F17] border-l border-white/[0.08] shadow-2xl flex flex-col justify-between text-left z-10"
            >
              {/* Drawer Header */}
              <div className="p-5 sm:p-6 border-b border-white/[0.08] bg-[#0E131F]/90 backdrop-blur-md space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[#DFCA9E]">
                      <Radio className="w-4 h-4 text-[#D4AF37] animate-pulse" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white font-sans">Live Push Notifications</h3>
                      <p className="text-[10px] text-neutral-400 font-mono">Real-Time Compound Operational Stream</p>
                    </div>
                  </div>

                  <button
                    onClick={() => setIsOpen(false)}
                    className="w-8 h-8 rounded-full bg-white/[0.05] hover:bg-white/[0.1] text-neutral-400 hover:text-white flex items-center justify-center transition"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Browser Push Permission Ribbon */}
                <div className="p-3 rounded-2xl bg-black/40 border border-[#D4AF37]/25 flex items-center justify-between gap-2">
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-mono text-[#DFCA9E] uppercase font-bold block">
                      Browser Instant Alerts
                    </span>
                    <span className="text-[11px] text-neutral-300 block">
                      {pushEnabled ? "Active: Dispatches instant payouts & gate alerts" : "Enable background push notifications"}
                    </span>
                  </div>

                  {!pushEnabled ? (
                    <button
                      onClick={handleEnableBrowserPush}
                      className="px-3 py-1.5 rounded-xl bg-[#D4AF37] hover:bg-[#E5C158] text-[#0A0D12] font-mono text-[10px] font-bold shadow-md shadow-[#D4AF37]/20 whitespace-nowrap transition active:scale-95"
                    >
                      Enable
                    </button>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[10px] font-mono text-[#DFCA9E]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#D4AF37]" /> Connected
                    </span>
                  )}
                </div>

                {/* Filter Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pt-1">
                  {(["all", "finance", "security", "iot"] as const).map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setActiveFilter(filter)}
                      className={`px-3 py-1 rounded-xl text-[11px] font-mono transition-all capitalize shrink-0 ${
                        activeFilter === filter
                          ? "bg-[#D4AF37] text-[#0A0D12] font-bold shadow-sm"
                          : "bg-white/[0.04] text-neutral-400 hover:text-white"
                      }`}
                    >
                      {filter}
                    </button>
                  ))}

                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="ml-auto text-[10px] font-mono text-neutral-400 hover:text-[#DFCA9E] transition whitespace-nowrap"
                    >
                      Mark all read
                    </button>
                  )}
                </div>
              </div>

              {/* Notification Items List */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
                {filteredNotifications.length === 0 ? (
                  <div className="py-12 text-center text-xs text-neutral-400 font-mono space-y-2">
                    <Bell className="w-8 h-8 text-neutral-600 mx-auto" />
                    <p>No active alerts in this category.</p>
                  </div>
                ) : (
                  filteredNotifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={`p-4 rounded-2xl border transition-all text-xs space-y-2 ${
                        notif.unread
                          ? "bg-[#111724] border-[#D4AF37]/30 shadow-md"
                          : "bg-[#090C12] border-white/[0.05] opacity-80"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
                          <span className="font-semibold text-white">{notif.title}</span>
                        </div>
                        <span className="text-[10px] text-neutral-400 font-mono shrink-0">
                          {notif.timestamp}
                        </span>
                      </div>

                      <p className="text-[11px] text-neutral-300 leading-relaxed">
                        {notif.detail}
                      </p>

                      <div className="pt-1 flex items-center justify-between text-[10px] font-mono">
                        <span className="text-neutral-400">{notif.compound}</span>
                        {notif.actionUrl && (
                          <a
                            href={notif.actionUrl}
                            onClick={() => setIsOpen(false)}
                            className="text-[#DFCA9E] hover:underline flex items-center gap-1"
                          >
                            <span>Inspect</span>
                            <ChevronRight className="w-3 h-3 text-[#D4AF37]" />
                          </a>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Drawer Footer */}
              <div className="p-4 border-t border-white/[0.08] bg-[#0A0D15] flex items-center justify-between text-[11px] font-mono text-neutral-400">
                <span>Elevated Stay Real-Time Bus</span>
                <span className="text-[#DFCA9E] font-bold">256-Bit SSL Encrypted</span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
