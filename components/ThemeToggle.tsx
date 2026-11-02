"use client";

import { useTheme } from "./ThemeProvider";
import { Sun, Moon } from "lucide-react";
import { useToast } from "./ToastProvider";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const { showToast } = useToast();

  const handleToggle = () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    toggleTheme();
    showToast({
      title: nextTheme === "light" ? "Private Wealth Alabaster (Light)" : "Midnight Obsidian (Dark)",
      detail:
        nextTheme === "light"
          ? "Switched to high-contrast white paper view for effortless daylight reading."
          : "Switched to midnight obsidian architectural dark mode.",
      type: "info",
    });
  };

  return (
    <button
      onClick={handleToggle}
      className={`relative inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-mono font-semibold transition-all active:scale-95 border ${
        theme === "light"
          ? "bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#0F172A] border-[#CBD5E1] shadow-sm"
          : "bg-[#161D27] hover:bg-[#1E2735] text-[#DFCA9E] border-[#D4AF37]/35 hover:border-[#D4AF37] shadow-sm"
      }`}
      title={
        theme === "light"
          ? "Switch to Midnight Obsidian (Dark Mode)"
          : "Switch to Private Wealth Alabaster (Light Mode for senior readability)"
      }
      aria-label="Toggle visual theme"
    >
      {theme === "light" ? (
        <>
          <Sun className="w-3.5 h-3.5 text-[#B45309]" />
          <span className="hidden sm:inline text-[11px]">Alabaster</span>
        </>
      ) : (
        <>
          <Moon className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span className="hidden sm:inline text-[11px]">Midnight</span>
        </>
      )}
    </button>
  );
}

