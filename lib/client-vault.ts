"use client";

import { Landlord, Resident } from "@/lib/types";

export interface ClientVaultAccount {
  id: string;
  name: string;
  roleCategory: "landlord" | "resident";
  roleTitle: string;
  estate: string;
  location: string;
  badge: string;
  phone: string;
  email: string;
  metric: string;
  securityStatus: string;
  passcode: string;
  pinCode: string;
  destination: string;
  issuedAt: string;
  issuedBy: string;
  deliveryMethod: "Tamper-Evident Physical Folio" | "VIP WhatsApp Concierge Dispatch" | "Executive Courier";
  isLiveAccount: boolean;
}

const STORAGE_KEY = "elevation_real_clients_production_vault_v4";

// In live production, start with zero demo clients. Real clients are added via /admin.
export function getClientVaults(): ClientVaultAccount[] {
  if (typeof window === "undefined") {
    return [];
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }
    const parsed: ClientVaultAccount[] = JSON.parse(raw);
    // Exclude any legacy mock IDs
    return parsed.filter(
      (c) =>
        c &&
        c.id !== "adlk-01" &&
        c.id !== "danb-02" &&
        c.id !== "alabi-03" &&
        c.id !== "ops-04" &&
        c.id !== "ops-master"
    );
  } catch {
    return [];
  }
}

export function addClientVaultInStorage(
  client: Omit<ClientVaultAccount, "id" | "issuedAt" | "isLiveAccount">
): ClientVaultAccount[] {
  if (typeof window === "undefined") return [];
  try {
    const current = getClientVaults();
    const newId = `cli-live-${Date.now().toString(36)}`;
    const now = new Date();
    const formattedDate =
      now.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) +
      ", " +
      now.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }) +
      " WAT";

    const newAccount: ClientVaultAccount = {
      ...client,
      id: newId,
      issuedAt: formattedDate,
      passcode: client.passcode.trim().toUpperCase(),
      pinCode: client.pinCode.trim(),
      isLiveAccount: true,
    };

    const updated = [newAccount, ...current];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event("elevation_vault_updated"));
    return updated;
  } catch {
    return [];
  }
}

export function deleteClientVaultInStorage(clientId: string): ClientVaultAccount[] {
  if (typeof window === "undefined") return [];
  try {
    const current = getClientVaults();
    const updated = current.filter((c) => c.id !== clientId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event("elevation_vault_updated"));
    return updated;
  } catch {
    return [];
  }
}

export function clearAllRealClients(): ClientVaultAccount[] {
  if (typeof window === "undefined") return [];
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
    window.dispatchEvent(new Event("elevation_vault_updated"));
    return [];
  } catch {
    return [];
  }
}

export function updateClientCredentialsInStorage(
  clientId: string,
  newPasscode: string,
  newPinCode: string
): ClientVaultAccount[] {
  if (typeof window === "undefined") return [];
  try {
    const current = getClientVaults();
    const updated = current.map((c) => {
      if (c.id === clientId) {
        return {
          ...c,
          passcode: newPasscode.trim().toUpperCase(),
          pinCode: newPinCode.trim(),
          issuedAt:
            new Date().toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            }) +
            ", " +
            new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }) +
            " WAT",
        };
      }
      return c;
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event("elevation_vault_updated"));
    return updated;
  } catch {
    return [];
  }
}

export function generateRandomPin(): string {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

export function generateRandomPasskey(prefix: string): string {
  const cleanPrefix = prefix.replace(/[^a-zA-Z]/g, "").toUpperCase().slice(0, 7) || "CLIENT";
  const num = Math.floor(1000 + Math.random() * 9000);
  return `${cleanPrefix}-${num}`;
}

export function vaultToLandlord(v: ClientVaultAccount): Landlord {
  const cleanCode = v.passcode.replace(/[^A-Z0-9]/gi, "").slice(0, 8).toLowerCase() || "vault";
  return {
    id: v.id,
    name: v.name,
    organizationName: `${v.name} Asset Trust`,
    clientType: v.roleTitle.includes("Commercial")
      ? "Grade-A Commercial Office"
      : v.roleTitle.includes("Mixed")
      ? "Mixed-Use Prime Asset"
      : "Residential Family Compound",
    email: v.email,
    phone: v.phone,
    subaccountCode: `ACCT_${cleanCode}`,
    bankName: "Guaranty Trust Bank (Private Wealth Desk)",
    accountNumber: "00" + Math.abs(v.id.split("").reduce((a, b) => a + b.charCodeAt(0), 10000000)).toString().slice(0, 8),
    managementFeePercent: 7.5,
    totalAnnualYield: 0,
    propertiesCount: 1,
    primaryLocation: `${v.estate}, ${v.location}`,
  };
}

export function vaultToResident(v: ClientVaultAccount): Resident {
  return {
    id: v.id,
    name: v.name,
    email: v.email,
    phone: v.phone,
    compoundId: "cmp-01",
    unitId: "unt-01",
    unitName: `${v.estate} · Executive Suite`,
    leaseStartDate: "2026-03-01",
    leaseEndDate: "2027-02-28",
    rentStatus: "paid",
    serviceChargeStatus: "paid",
    annexureSigned: true,
    annexureSignedDate: "2026-02-20",
  };
}

const AUTH_STORAGE_KEY = "elevation_active_authenticated_client_id";
const ADMIN_AUTH_KEY = "elevation_admin_master_session";
export const ADMIN_MASTER_DEFAULT_KEY = "ELEVATE-MASTER-2025";
export const ADMIN_MASTER_DEFAULT_PIN = "8820";

export function setActiveClientId(id: string | null): void {
  if (typeof window === "undefined") return;
  if (!id) {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  } else {
    localStorage.setItem(AUTH_STORAGE_KEY, id);
  }
  window.dispatchEvent(new Event("elevation_auth_changed"));
}

export function getActiveClientId(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(AUTH_STORAGE_KEY);
}

export function getActiveClient(): ClientVaultAccount | null {
  if (typeof window === "undefined") return null;
  const activeId = getActiveClientId();
  if (!activeId) return null;
  const all = getClientVaults();
  return all.find((c) => c.id === activeId) || null;
}

export function isAdminAuthenticated(): boolean {
  if (typeof window === "undefined") return false;
  return sessionStorage.getItem(ADMIN_AUTH_KEY) === "true";
}

export function setAdminAuthenticated(authenticated: boolean): void {
  if (typeof window === "undefined") return;
  if (authenticated) {
    sessionStorage.setItem(ADMIN_AUTH_KEY, "true");
  } else {
    sessionStorage.removeItem(ADMIN_AUTH_KEY);
  }
  window.dispatchEvent(new Event("elevation_admin_auth_changed"));
}

export function verifyAdminMasterKey(input: string): boolean {
  const trimmed = input.trim();
  return (
    trimmed.toUpperCase() === ADMIN_MASTER_DEFAULT_KEY ||
    trimmed === ADMIN_MASTER_DEFAULT_PIN
  );
}
