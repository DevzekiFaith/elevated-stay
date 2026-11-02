"use client";

import { Compound } from "@/lib/types";

const STORAGE_KEY = "elevation_live_compounds_production_v2";
const LEGACY_STORAGE_KEY = "elevation_live_compounds_registry_v1";

// Live production mode: starts with ZERO demo compounds. Real compounds are onboarded via /admin.
export function getLiveCompounds(): Compound[] {
  if (typeof window === "undefined") {
    return [];
  }
  try {
    // Purge legacy storage key if present to eliminate old demo compounds
    if (localStorage.getItem(LEGACY_STORAGE_KEY)) {
      localStorage.removeItem(LEGACY_STORAGE_KEY);
    }

    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }
    const parsed: Compound[] = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    // Filter out any legacy mock compounds (cmp-01 through cmp-06)
    return parsed.filter(
      (c) =>
        c &&
        !["cmp-01", "cmp-02", "cmp-03", "cmp-04", "cmp-05", "cmp-06"].includes(c.id) &&
        !c.name.toLowerCase().includes("obsidian") &&
        !c.name.toLowerCase().includes("aura residence")
    );
  } catch {
    return [];
  }
}

export function saveLiveCompounds(compounds: Compound[]): Compound[] {
  if (typeof window === "undefined") return compounds;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(compounds));
    window.dispatchEvent(new Event("elevation_compounds_updated"));
    return compounds;
  } catch {
    return compounds;
  }
}

export function addLiveCompound(compound: Compound): Compound[] {
  if (typeof window === "undefined") return [compound];
  try {
    const current = getLiveCompounds();
    const updated = [compound, ...current];
    return saveLiveCompounds(updated);
  } catch {
    return [compound];
  }
}

export function deleteLiveCompound(compoundId: string): Compound[] {
  if (typeof window === "undefined") return [];
  try {
    const current = getLiveCompounds();
    const updated = current.filter((c) => c.id !== compoundId);
    return saveLiveCompounds(updated);
  } catch {
    return [];
  }
}

export function resetToCleanLiveRegistry(): Compound[] {
  if (typeof window === "undefined") return [];
  try {
    localStorage.removeItem(LEGACY_STORAGE_KEY);
    localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
    window.dispatchEvent(new Event("elevation_compounds_updated"));
    return [];
  } catch {
    return [];
  }
}
