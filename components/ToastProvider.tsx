"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  CheckCircle2,
  ShieldCheck,
  Zap,
  TrendingUp,
  KeyRound,
  X,
  ChevronRight,
  MessageSquare,
  BadgeCheck,
  Wrench,
} from "lucide-react";

export interface ToastItem {
  id: string;
  title: string;
  detail: string;
  type?: "finance" | "security" | "iot" | "maintenance" | "messaging" | "info" | "system";
  actionUrl?: string;
  duration?: number;
}

interface ToastContextType {
  toasts: ToastItem[];
  showToast: (toast: Omit<ToastItem, "id">) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    ({ title, detail, type = "info", actionUrl, duration = 5000 }: Omit<ToastItem, "id">) => {
      const id = `toast-${Date.now()}-${Math.random()}`;
      const newToast: ToastItem = { id, title, detail, type, actionUrl, duration };

      setToasts((prev) => [newToast, ...prev].slice(0, 4)); // Keep up to 4 concurrent toasts

      // Also dispatch a browser custom event so the Push Notification Bell in Navbar increments!
      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("elevation_new_notification", {
            detail: { id, title, detail, category: type, timestamp: "Just now" },
          })
        );
      }

      // Auto dismiss
      setTimeout(() => {
        removeToast(id);
      }, duration);
    },
    [removeToast]
  );

  return (
    <ToastContext.Provider value={{ toasts, showToast, removeToast }}>
      {children}

      {/* Floating Stacked Toast Notifications Container */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ duration: 0.25 }}
              className="pointer-events-auto p-4 rounded-2xl bg-[#0F1420]/95 border border-[#D4AF37]/45 shadow-2xl backdrop-blur-xl text-left space-y-2 text-xs relative overflow-hidden group"
            >
              {/* Subtle top gold accent line */}
              <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#D4AF37]/60 to-transparent" />

              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[#DFCA9E] shrink-0">
                    {toast.type === "finance" && <TrendingUp className="w-3.5 h-3.5 text-[#D4AF37]" />}
                    {toast.type === "security" && <KeyRound className="w-3.5 h-3.5 text-[#D4AF37]" />}
                    {toast.type === "iot" && <Zap className="w-3.5 h-3.5 text-[#D4AF37]" />}
                    {toast.type === "messaging" && <MessageSquare className="w-3.5 h-3.5 text-[#D4AF37]" />}
                    {toast.type === "maintenance" && <Wrench className="w-3.5 h-3.5 text-[#D4AF37]" />}
                    {(toast.type === "info" || toast.type === "system") && <BadgeCheck className="w-3.5 h-3.5 text-[#D4AF37]" />}
                  </span>
                  <strong className="text-white font-semibold text-xs tracking-tight">
                    {toast.title}
                  </strong>
                </div>

                <button
                  onClick={() => removeToast(toast.id)}
                  className="text-neutral-400 hover:text-white p-1 rounded-lg hover:bg-white/[0.05] transition"
                  aria-label="Close notification"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <p className="text-[11px] text-neutral-300 leading-relaxed pl-8">
                {toast.detail}
              </p>

              {toast.actionUrl && (
                <div className="pl-8 pt-1 flex items-center justify-end">
                  <a
                    href={toast.actionUrl}
                    onClick={() => removeToast(toast.id)}
                    className="text-[#DFCA9E] hover:underline flex items-center gap-1 font-mono text-[10px] font-semibold"
                  >
                    <span>Inspect Details</span>
                    <ChevronRight className="w-3 h-3 text-[#D4AF37]" />
                  </a>
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}

