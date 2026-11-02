"use client";

import { Compound } from "@/lib/types";
import { MOCK_COMPOUNDS } from "@/lib/mock-data";

const STORAGE_KEY = "elevation_live_compounds_registry_v1";

export function getLiveCompounds(): Compound[] {
  if (typeof window === "undefined") {
    return MOCK_COMPOUNDS;
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return MOCK_COMPOUNDS;
    }
    const parsed: Compound[] = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : MOCK_COMPOUNDS;
  } catch {
    return MOCK_COMPOUNDS;
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
    localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
    window.dispatchEvent(new Event("elevation_compounds_updated"));
    return [];
  } catch {
    return [];
  }
}
