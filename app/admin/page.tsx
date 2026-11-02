"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Logo } from "@/components/Logo";
import { CompoundImageCarousel } from "@/components/CompoundImageCarousel";
import { useToast } from "@/components/ToastProvider";
import {
  getLiveCompounds,
  addLiveCompound,
  deleteLiveCompound,
  saveLiveCompounds,
  resetToCleanLiveRegistry,
} from "@/lib/compound-vault";
import { Compound, MaintenanceTicket } from "@/lib/types";
import { formatNaira } from "@/lib/payment-split";
import {
  getClientVaults,
  addClientVaultInStorage,
  deleteClientVaultInStorage,
  clearAllRealClients,
  updateClientCredentialsInStorage,
  generateRandomPasskey,
  generateRandomPin,
  generateAnnexureQuietHoursCode,
  ClientVaultAccount,
  isAdminAuthenticated,
  setAdminAuthenticated,
  verifyAdminMasterKey,
} from "@/lib/client-vault";
import {
  Layers,
  Building,
  Plus,
  ShieldCheck,
  TrendingUp,
  Wrench,
  CheckCircle2,
  DollarSign,
  MessageSquare,
  AlertCircle,
  X,
  Radio,
  Search,
  Copy,
  Check,
  MapPin,
  Users,
  ExternalLink,
  ShieldAlert,
  KeyRound,
  Lock,
  Eye,
  EyeOff,
  FileText,
  RefreshCw,
  Send,
  Smartphone,
  Key,
  Sparkles,
  Printer,
  Trash2,
  UserPlus,
  Power,
  Camera,
  Upload,
  Image as ImageIcon,
  Clock,
} from "lucide-react";

export default function AdminOperations() {
  const { showToast } = useToast();
  const [compounds, setCompounds] = useState<Compound[]>(() => getLiveCompounds());
  const [tickets, setTickets] = useState<MaintenanceTicket[]>([]);
  const [selectedCity, setSelectedCity] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [copiedBankId, setCopiedBankId] = useState<string | null>(null);

  // Client Security Vault Management State
  const [clientVaults, setClientVaults] = useState<ClientVaultAccount[]>(() => getClientVaults());
  const [showSecretsMap, setShowSecretsMap] = useState<Record<string, boolean>>({});
  const [editingClient, setEditingClient] = useState<ClientVaultAccount | null>(null);
  const [customPasscode, setCustomPasscode] = useState("");
  const [customPin, setCustomPin] = useState("");
  const [whatsappDispatchClient, setWhatsappDispatchClient] = useState<ClientVaultAccount | null>(null);
  const [folioModalClient, setFolioModalClient] = useState<ClientVaultAccount | null>(null);

  // Enroll Real Client State
  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const [newClientName, setNewClientName] = useState("");
  const [newClientRoleCategory, setNewClientRoleCategory] = useState<"landlord" | "resident">("landlord");
  const [newClientRoleTitle, setNewClientRoleTitle] = useState("Family Compound Principal");
  const [newClientEstate, setNewClientEstate] = useState("");
  const [newClientLocation, setNewClientLocation] = useState("");
  const [newClientPhone, setNewClientPhone] = useState("+234 ");
  const [newClientEmail, setNewClientEmail] = useState("");
  const [newClientMetric, setNewClientMetric] = useState("");
  const [newClientPasscode, setNewClientPasscode] = useState("");
  const [newClientPin, setNewClientPin] = useState("");
  const [newClientDelivery, setNewClientDelivery] = useState<
    "Tamper-Evident Physical Folio" | "VIP WhatsApp Concierge Dispatch" | "Executive Courier"
  >("VIP WhatsApp Concierge Dispatch");
  const [newClientQuietHoursCode, setNewClientQuietHoursCode] = useState("");

  // Admin Master Authentication Gate State
  const [isAdminAuthed, setIsAdminAuthed] = useState<boolean>(false);
  const [adminInputKey, setAdminInputKey] = useState("");
  const [showAdminKeyText, setShowAdminKeyText] = useState(false);
  const [adminAuthError, setAdminAuthError] = useState(false);

  useEffect(() => {
    setIsAdminAuthed(isAdminAuthenticated());
    const syncAdmin = () => {
      setIsAdminAuthed(isAdminAuthenticated());
    };
    const syncCompounds = () => {
      setCompounds(getLiveCompounds());
    };
    window.addEventListener("elevation_admin_auth_changed", syncAdmin);
    window.addEventListener("elevation_compounds_updated", syncCompounds);
    return () => {
      window.removeEventListener("elevation_admin_auth_changed", syncAdmin);
      window.removeEventListener("elevation_compounds_updated", syncCompounds);
    };
  }, []);

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (verifyAdminMasterKey(adminInputKey)) {
      setAdminAuthenticated(true);
      setIsAdminAuthed(true);
      setAdminAuthError(false);
      setAdminInputKey("");
      showToast({
        title: "Master Ops Access Granted",
        detail: "Elevated Stay Studio Operations terminal decrypted and unlocked.",
        type: "security",
      });
    } else {
      setAdminAuthError(true);
      showToast({
        title: "Access Denied",
        detail: "Invalid Master Passcode or PIN. Unauthorized access attempts are monitored.",
        type: "security",
      });
    }
  };

  const handleAdminSignOut = () => {
    setAdminAuthenticated(false);
    setIsAdminAuthed(false);
    showToast({
      title: "Operations Terminal Locked",
      detail: "Master admin session terminated.",
      type: "security",
    });
  };
  useEffect(() => {
    const handleSync = () => {
      setClientVaults(getClientVaults());
    };
    window.addEventListener("elevation_vault_updated", handleSync);
    return () => window.removeEventListener("elevation_vault_updated", handleSync);
  }, []);

  const toggleShowSecret = (id: string) => {
    setShowSecretsMap((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleOpenEditModal = (client: ClientVaultAccount) => {
    setEditingClient(client);
    setCustomPasscode(client.passcode);
    setCustomPin(client.pinCode);
  };

  const handleSaveClientCredentials = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingClient || !customPasscode || !customPin) return;

    const updated = updateClientCredentialsInStorage(
      editingClient.id,
      customPasscode,
      customPin
    );
    setClientVaults(updated);
    showToast({
      title: "Client Credentials Re-Keyed",
      detail: `New passkey & PIN assigned to ${editingClient.name}. Ready for personal dispatch.`,
      type: "security",
    });
    setEditingClient(null);
  };

  const handleGenerateRandom = () => {
    if (!editingClient) return;
    const surname = editingClient.name.split(" ").slice(-1)[0] || "KEY";
    const newPasskey = generateRandomPasskey(surname);
    const newPin = generateRandomPin();
    setCustomPasscode(newPasskey);
    setCustomPin(newPin);
  };

  useEffect(() => {
    if (showEnrollModal) {
      setNewClientQuietHoursCode(
        generateAnnexureQuietHoursCode(newClientName, newClientEstate, newClientRoleCategory)
      );
    }
  }, [newClientName, newClientEstate, newClientRoleCategory, showEnrollModal]);

  const handleOpenEnrollModal = () => {
    const defaultEstate = compounds[0]?.name || "";
    const defaultLocation = compounds[0]?.location || "";
    setNewClientName("");
    setNewClientRoleCategory("landlord");
    setNewClientRoleTitle("Family Compound Principal");
    setNewClientEstate(defaultEstate);
    setNewClientLocation(defaultLocation);
    setNewClientPhone("+234 ");
    setNewClientEmail("");
    setNewClientMetric("");
    setNewClientPasscode(generateRandomPasskey("CLIENT"));
    setNewClientPin(generateRandomPin());
    setNewClientQuietHoursCode(generateAnnexureQuietHoursCode("", defaultEstate, "landlord"));
    setShowEnrollModal(true);
  };

  const handleEnrollRealClient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClientName.trim() || !newClientPasscode.trim() || !newClientPin.trim()) return;

    const badge =
      newClientRoleCategory === "resident"
        ? "Headless Resident"
        : newClientRoleTitle.includes("Commercial")
          ? "Grade-A Commercial Office"
          : "Residential Estate";

    const destination = newClientRoleCategory === "resident" ? "/resident" : "/landlord";

    const updated = addClientVaultInStorage({
      name: newClientName.trim(),
      roleCategory: newClientRoleCategory,
      roleTitle: newClientRoleTitle,
      estate: newClientEstate.trim(),
      location: newClientLocation.trim(),
      badge,
      phone: newClientPhone.trim(),
      email: newClientEmail.trim() || `${newClientName.toLowerCase().replace(/[^a-z]/g, "")}@estate-trust.ng`,
      metric: newClientMetric.trim(),
      securityStatus: "FIDO2 Biometric Hardware Token Synced",
      passcode: newClientPasscode.trim(),
      pinCode: newClientPin.trim(),
      annexureQuietHoursCode:
        newClientQuietHoursCode.trim() ||
        generateAnnexureQuietHoursCode(newClientName, newClientEstate, newClientRoleCategory),
      destination,
      issuedBy: "Director of Asset Protection & Security Desk",
      deliveryMethod: newClientDelivery,
    });

    setClientVaults(updated);
    setShowEnrollModal(false);

    showToast({
      title: "Real Client Principal Enrolled",
      detail: `${newClientName} registered. Annexure Quiet Hours Code: ${newClientQuietHoursCode}`,
      type: "security",
    });
  };

  const handleDeleteClient = (clientId: string, clientName: string) => {
    const updated = deleteClientVaultInStorage(clientId);
    setClientVaults(updated);
    showToast({
      title: "Client Profile Removed",
      detail: `${clientName} has been removed from the vault.`,
      type: "security",
    });
  };

  const handleCopyAccount = (acct: string, id: string) => {
    navigator.clipboard.writeText(acct);
    setCopiedBankId(id);
    showToast({
      title: "Escrow Subaccount Copied",
      detail: `Facility account ${acct} copied to clipboard.`,
      type: "finance",
    });
    setTimeout(() => setCopiedBankId(null), 2000);
  };

  const filteredCompounds = compounds.filter((c) => {
    const matchesCity =
      selectedCity === "all" ||
      c.city.toLowerCase() === selectedCity.toLowerCase();
    const matchesSearch =
      searchQuery === "" ||
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.escrowBank.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.code.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCity && matchesSearch;
  });

  // New Compound Modal state
  const [showOnboardingModal, setShowOnboardingModal] = useState(false);
  const [newCompoundName, setNewCompoundName] = useState("");
  const [newCompoundLocation, setNewCompoundLocation] = useState("");
  const [newCompoundCity, setNewCompoundCity] = useState<string>("Lagos");
  const [newCompoundEscrowBank, setNewCompoundEscrowBank] = useState("Guaranty Trust Bank (Private Banking)");
  const [newCompoundEscrowAccount, setNewCompoundEscrowAccount] = useState("");
  const [newUnitsCount, setNewUnitsCount] = useState("8");
  const [newCompoundImages, setNewCompoundImages] = useState<string[]>([]);
  const [newCustomImageUrl, setNewCustomImageUrl] = useState("");
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const ARCHITECTURAL_PRESETS = [
    {
      title: "Main Facade",
      url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
    },
    {
      title: "Private Courtyard",
      url: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80",
    },
    {
      title: "Power & Utilities",
      url: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80",
    },
    {
      title: "Gate & Access",
      url: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80",
    },
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setIsUploadingImage(true);

    const fileList = Array.from(files);
    let loadedCount = 0;
    const newImages: string[] = [];

    fileList.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (result) {
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement("canvas");
            const maxDimension = 1200;
            let width = img.width;
            let height = img.height;

            if (width > height && width > maxDimension) {
              height = Math.round((height * maxDimension) / width);
              width = maxDimension;
            } else if (height > maxDimension) {
              width = Math.round((width * maxDimension) / height);
              height = maxDimension;
            }

            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext("2d");
            ctx?.drawImage(img, 0, 0, width, height);
            const compressed = canvas.toDataURL("image/jpeg", 0.82);
            newImages.push(compressed);

            loadedCount++;
            if (loadedCount === fileList.length) {
              setNewCompoundImages((prev) => [...prev, ...newImages]);
              setIsUploadingImage(false);
              if (fileInputRef.current) fileInputRef.current.value = "";
            }
          };
          img.src = result;
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleAddCustomImageUrl = () => {
    if (!newCustomImageUrl.trim()) return;
    setNewCompoundImages((prev) => [...prev, newCustomImageUrl.trim()]);
    setNewCustomImageUrl("");
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setNewCompoundImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSelectPreset = (url: string) => {
    if (!newCompoundImages.includes(url)) {
      setNewCompoundImages((prev) => [...prev, url]);
    }
  };

  // Calculate platform financials (Clean Live Registry)
  const platformTotalGross = 0;
  const platformLandlordDisbursements = 0;
  const platformElevationRevenue = 0;
  const totalEscrowHeld = compounds.reduce((a, b) => a + b.escrowBalance, 0);

  const handleOnboardCompound = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCompoundName || !newCompoundLocation) return;

    const stateMap: Record<string, string> = {
      Lagos: "Lagos State",
      Abuja: "FCT Abuja",
      "Port Harcourt": "Rivers State",
      Enugu: "Enugu State",
      Ibadan: "Oyo State",
    };
    const compoundState = stateMap[newCompoundCity] || "Lagos State";

    const defaultCover =
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80";
    const finalImages = newCompoundImages.length > 0 ? newCompoundImages : [defaultCover];

    const code = newCompoundName.slice(0, 3).toUpperCase() + "-" + newCompoundCity.slice(0, 3).toUpperCase();
    const newCmp: Compound = {
      id: `cmp-live-${Date.now()}`,
      name: newCompoundName.trim(),
      code,
      location: newCompoundLocation.trim(),
      neighborhood: newCompoundLocation.split(",")[0] || "Prime Area",
      city: newCompoundCity,
      state: compoundState,
      totalUnits: parseInt(newUnitsCount) || 8,
      occupiedUnits: 0,
      escrowBalance: 0,
      escrowAccountNumber:
        newCompoundEscrowAccount.trim() || `019283${Math.floor(1000 + Math.random() * 9000)}`,
      escrowBank: newCompoundEscrowBank,
      imageUrl: finalImages[0],
      images: finalImages,
      quietHours: "22:00 – 07:00 WAT",
    };

    const updated = addLiveCompound(newCmp);
    setCompounds(updated);
    setShowOnboardingModal(false);
    setNewCompoundName("");
    setNewCompoundLocation("");
    setNewCompoundEscrowAccount("");
    setNewCompoundImages([]);
    setNewCustomImageUrl("");

    showToast({
      title: "Live Compound Activated",
      detail: `${newCmp.name} (${newCmp.city}) onboarded with ${finalImages.length} building photo slides.`,
      type: "security",
    });
  };

  const handleDeleteCompound = (compoundId: string) => {
    const updated = deleteLiveCompound(compoundId);
    setCompounds(updated);
    showToast({
      title: "Estate Deregistered",
      detail: "Compound has been removed from active management.",
      type: "info",
    });
  };

  const handleClearDemoCompounds = () => {
    if (confirm("Clear all registered compound assets? You can onboard new live estates anytime.")) {
      const empty = resetToCleanLiveRegistry();
      setCompounds(empty);
      showToast({
        title: "Compound Registry Cleared",
        detail: "Live registry is clean. Ready for live estate onboarding.",
        type: "info",
      });
    }
  };

  const handleDispatchContractor = (ticketId: string) => {
    setTickets((prev) =>
      prev.map((t) =>
        t.id === ticketId
          ? {
            ...t,
            status: "contractor_dispatched",
            contractorName: "Carrier & Daikin Certified Nigeria Ltd",
            contractorNotes: "Contractor mobilized on-site. Security pass auto-whitelisted.",
          }
          : t
      )
    );

    showToast({
      title: "Contractor Dispatched",
      detail: "Carrier & Daikin Certified Nigeria Ltd dispatched. Compound gate pass auto-whitelisted.",
      type: "maintenance",
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0A0D12] text-[#F3F4F6]">
      <Navbar />

      {!isAdminAuthed ? (
        /* MASTER OPERATIONS CRYPTOGRAPHIC CLEARANCE GATE */
        <main className="flex-1 max-w-xl w-full mx-auto px-4 py-16 sm:py-24 flex items-center justify-center">
          <div className="w-full p-8 sm:p-10 rounded-3xl bg-[#0F1420] border border-[#D4AF37]/35 shadow-2xl text-left space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-white/[0.08]">
              <div className="p-3 rounded-2xl bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[#DFCA9E]">
                <Lock className="w-6 h-6 text-[#D4AF37]" />
              </div>
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono tracking-wider bg-[#D4AF37]/15 text-[#DFCA9E] border border-[#D4AF37]/30 uppercase font-bold">
                  OPERATIONS DIRECTORATE
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-1">
                  Master Cryptographic Clearance
                </h2>
              </div>
            </div>

            <p className="text-xs text-neutral-300 leading-relaxed font-mono">
              This terminal is restricted strictly to Elevated Stay partners and licensed quantity surveyors. Authentication with your studio Master Key or PIN is required to decrypt operations telemetry.
            </p>

            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div>
                <label className="text-[11px] font-mono text-neutral-400 block mb-1.5 uppercase">
                  Studio Master Passkey or PIN
                </label>
                <div className="relative">
                  <input
                    type={showAdminKeyText ? "text" : "password"}
                    value={adminInputKey}
                    onChange={(e) => {
                      setAdminInputKey(e.target.value);
                      setAdminAuthError(false);
                    }}
                    placeholder="Enter Master Passcode or PIN"
                    className="w-full py-3 pl-4 pr-12 rounded-xl bg-black/60 border border-white/15 text-white font-mono text-sm focus:border-[#D4AF37] focus:outline-none transition"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowAdminKeyText(!showAdminKeyText)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white"
                  >
                    {showAdminKeyText ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {adminAuthError && (
                  <span className="text-red-400 text-[11px] font-mono mt-1.5 block">
                    Invalid master key. Clearance denied.
                  </span>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-4 rounded-xl bg-[#D4AF37] hover:bg-[#E5C158] text-[#0A0D12] font-bold text-xs shadow-lg shadow-[#D4AF37]/20 flex items-center justify-center gap-2 transition active:scale-98"
              >
                <Key className="w-4 h-4 text-[#0A0D12]" />
                <span>Unlock Operations Terminal</span>
              </button>
            </form>

            <div className="pt-2 border-t border-white/[0.08] flex items-center justify-between text-[11px] font-mono text-neutral-400">
              <span>Elevated Stay Security Protocol</span>
              <Link href="/" className="text-[#DFCA9E] hover:underline">
                Return to Vision
              </Link>
            </div>
          </div>
        </main>
      ) : (
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono tracking-wide bg-[#D4AF37]/15 text-[#DFCA9E] border border-[#D4AF37]/30 uppercase font-semibold">
                  MASTER OPERATIONS
                </span>
                <span className="text-xs text-neutral-400 font-mono">Elevation Studio Desk</span>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-mono bg-white/[0.04] text-white/80 border border-white/10">
                  Multi-Tenant Isolation Active
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Platform-Wide Yields & Asset Control
              </h1>
              <p className="text-xs text-neutral-400 mt-1">
                Multi-tenant compound routing, contractor ticket authorization, and Paystack Subaccount health monitoring.
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                onClick={handleAdminSignOut}
                className="py-2.5 px-4 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/25 font-bold text-xs flex items-center justify-center gap-2 transition active:scale-98"
                title="Lock Master Operations Terminal"
              >
                <Power className="w-4 h-4" />
                <span>Lock Terminal</span>
              </button>
              <button
                onClick={() => setShowOnboardingModal(true)}
                className="py-2.5 px-5 rounded-xl bg-[#D4AF37] hover:bg-[#E5C158] text-[#0A0D12] font-bold text-xs shadow-md shadow-[#D4AF37]/20 flex items-center justify-center gap-2 transition active:scale-98"
              >
                <Plus className="w-4 h-4 text-[#0A0D12]" />
                <span>Onboard Compound Asset</span>
              </button>
            </div>
          </div>

        {/* 4 Financial Health Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-[#121722] border border-white/[0.08]">
            <div className="text-neutral-400 text-xs mb-1 font-mono uppercase">Gross Inflows Settled</div>
            <div className="text-2xl font-bold font-mono text-white">
              {formatNaira(platformTotalGross)}
            </div>
            <div className="mt-2 text-[11px] text-neutral-400 font-mono">
              {platformTotalGross > 0 ? "Across Managed Estates & Compounds" : "Awaiting First Client Settlement"}
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[#121722] border border-white/[0.08]">
            <div className="text-neutral-400 text-xs mb-1 font-mono uppercase">Disbursed to Landlords</div>
            <div className="text-2xl font-bold font-mono text-[#DFCA9E]">
              {formatNaira(platformLandlordDisbursements)}
            </div>
            <div className="mt-2 text-[11px] text-[#DFCA9E] flex items-center gap-1 font-mono">
              <CheckCircle2 className="w-3 h-3 text-[#D4AF37]" /> 92.5% Direct Wire on Inflow
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[#121722] border border-white/[0.08]">
            <div className="text-neutral-400 text-xs mb-1 font-mono uppercase">Compound Escrow Reserves</div>
            <div className="text-2xl font-bold font-mono text-white">
              {formatNaira(totalEscrowHeld)}
            </div>
            <div className="mt-2 text-[11px] text-neutral-400 font-mono">
              {totalEscrowHeld > 0 ? "100% Ringfenced in SCB & GTB" : "Escrow Accounts Provisioned · ₦0 Balance"}
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[#121722] border border-white/[0.08]">
            <div className="text-neutral-400 text-xs mb-1 font-mono uppercase">Elevation Retainer</div>
            <div className="text-2xl font-bold font-mono text-[#DFCA9E]">
              {formatNaira(platformElevationRevenue)}
            </div>
            <div className="mt-2 text-[11px] text-neutral-400 font-mono">7.5% Management Margin on Settlements</div>
          </div>
        </div>

        {/* 1. Managed Compounds Portfolio */}
        <section className="space-y-5">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 pb-2 border-b border-white/[0.06]">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono tracking-wider uppercase font-semibold bg-[#D4AF37]/15 text-[#DFCA9E] border border-[#D4AF37]/30 flex items-center gap-1.5 shadow-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-pulse" />
                  LIVE COMPOUND ASSETS
                </span>
                <span className="text-xs text-neutral-400 font-mono hidden sm:inline">
                  {compounds.length} {compounds.length === 1 ? "Active Estate" : "Active Estates"} Enrolled
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2 tracking-tight">
                <Building className="w-5 h-5 text-[#D4AF37]" />
                Managed High-Value Compounds
              </h2>
              <p className="text-xs text-neutral-400 max-w-2xl leading-relaxed">
                Every compound has a designated facility escrow subaccount for power generation, reverse osmosis, and structural security.
              </p>
            </div>

            {/* Controls: Search & Onboard Button */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
              {compounds.length > 0 && (
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search estates, cities..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8 pr-3 py-2 text-xs rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder-neutral-500 focus:outline-none focus:border-[#D4AF37] w-full sm:w-56 font-mono"
                  />
                </div>
              )}

              <button
                onClick={() => setShowOnboardingModal(true)}
                className="py-2 px-3.5 rounded-xl bg-[#D4AF37] hover:bg-[#E5C158] text-[#0A0D12] font-bold text-xs shadow-md shadow-[#D4AF37]/20 flex items-center justify-center gap-1.5 transition active:scale-98 whitespace-nowrap"
              >
                <Plus className="w-3.5 h-3.5 text-[#0A0D12]" />
                <span>Onboard Estate</span>
              </button>

              {compounds.length > 0 && (
                <button
                  onClick={handleClearDemoCompounds}
                  className="py-2 px-3 rounded-xl bg-white/[0.04] hover:bg-red-500/10 text-neutral-400 hover:text-red-400 border border-white/10 text-xs font-mono transition flex items-center gap-1.5 whitespace-nowrap"
                  title="Clear registered compounds to reset registry"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Clear Registry</span>
                </button>
              )}
            </div>
          </div>

          {/* Regional Hub Filter Tabs - rendered only if compounds exist */}
          {compounds.length > 0 && (
            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1 text-xs">
              {["all", ...Array.from(new Set(compounds.map((c) => c.city)))].map((city) => {
                const count =
                  city === "all"
                    ? compounds.length
                    : compounds.filter((c) => c.city.toLowerCase() === city.toLowerCase()).length;
                const isSelected = selectedCity.toLowerCase() === city.toLowerCase();

                return (
                  <button
                    key={city}
                    onClick={() => setSelectedCity(city)}
                    className={`py-2 px-3.5 rounded-xl font-mono text-xs font-bold transition whitespace-nowrap flex items-center gap-2 border ${
                      isSelected
                        ? "bg-[#D4AF37] text-[#0A0D12] border-[#D4AF37] shadow-sm"
                        : "bg-slate-100 dark:bg-white/[0.08] hover:bg-slate-200 dark:hover:bg-white/[0.14] text-[#0F172A] dark:text-white border-slate-300 dark:border-white/15"
                    }`}
                  >
                    <span>{city === "all" ? "All Locations" : city}</span>
                    <span
                      className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                        isSelected
                          ? "bg-black/20 text-[#0A0D12]"
                          : "bg-black/10 dark:bg-white/15 text-[#0F172A] dark:text-white"
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Clean Live Production empty state or Compound Cards */}
          {compounds.length === 0 ? (
            <div className="py-14 px-6 text-center rounded-3xl bg-[#0D111A] border border-dashed border-[#D4AF37]/35 space-y-4 max-w-2xl mx-auto shadow-2xl my-2">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-[#D4AF37]/10 border border-[#D4AF37]/25 flex items-center justify-center text-[#DFCA9E]">
                <Building className="w-7 h-7 text-[#D4AF37]" />
              </div>
              <div className="space-y-1.5">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-bold mb-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Live Production Registry
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                  No Compounds Currently Enrolled
                </h3>
                <p className="text-xs text-neutral-400 max-w-md mx-auto leading-relaxed">
                  All demo records have been cleared. Onboard your live estate properties to activate automated facility escrow routing, quiet hours enforcement, and contractor dispatch.
                </p>
              </div>
              <div className="pt-2">
                <button
                  onClick={() => setShowOnboardingModal(true)}
                  className="py-3 px-6 rounded-xl bg-[#D4AF37] hover:bg-[#E5C158] text-[#0A0D12] font-bold text-xs shadow-lg shadow-[#D4AF37]/20 inline-flex items-center gap-2 transition active:scale-95"
                >
                  <Plus className="w-4 h-4 text-[#0A0D12]" />
                  <span>+ Onboard First Compound Asset</span>
                </button>
              </div>
            </div>
          ) : filteredCompounds.length === 0 ? (
            <div className="py-12 text-center rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
              <Building className="w-8 h-8 text-neutral-500 mx-auto" />
              <p className="text-sm text-neutral-400 font-mono">No compounds matching "{searchQuery}"</p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCity("all");
                }}
                className="text-xs text-[#DFCA9E] hover:underline font-mono"
              >
                Clear search filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCompounds.map((c) => (
              <div
                key={c.id}
                className="rounded-3xl bg-[#121722] border border-white/[0.08] hover:border-[#D4AF37]/40 transition-all flex flex-col justify-between overflow-hidden group shadow-xl"
              >
                {/* Image Carousel with Interactive Slide Deck & Badges */}
                <CompoundImageCarousel
                  images={c.images || [c.imageUrl]}
                  fallbackImage={c.imageUrl}
                  compoundName={c.name}
                  className="h-48 relative overflow-hidden select-none"
                >
                  {/* Top-left code and city pills */}
                  <div className="absolute top-3 inset-x-3 flex items-center justify-between z-20 pointer-events-auto">
                    <span className="px-2.5 py-1 rounded-lg bg-black/75 backdrop-blur-md text-[10px] font-mono font-bold text-[#DFCA9E] border border-[#D4AF37]/35 shadow-md">
                      {c.code}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className="px-2.5 py-1 rounded-lg bg-black/75 backdrop-blur-md text-[10px] font-mono text-white/90 border border-white/15">
                        {c.city}
                      </span>
                      <button
                        onClick={() => handleDeleteCompound(c.id)}
                        className="p-1 rounded-lg bg-black/75 hover:bg-red-500/25 text-neutral-400 hover:text-red-400 border border-white/15 transition backdrop-blur-md cursor-pointer"
                        title="Deregister this estate"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Bottom occupancy status strip */}
                  <div className="absolute bottom-3 inset-x-3 flex items-center justify-between pointer-events-none text-[11px] font-mono z-20">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 backdrop-blur-md text-emerald-400 border border-emerald-500/30 font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      {c.occupiedUnits || c.totalUnits} / {c.totalUnits} Units Leased
                    </span>
                    <span className="text-[10px] text-neutral-300 bg-black/60 px-2 py-0.5 rounded backdrop-blur-sm border border-white/10">
                      Escrow Active
                    </span>
                  </div>
                </CompoundImageCarousel>

                {/* Card Content */}
                <div className="p-5 sm:p-6 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-1">
                    <h3 className="text-base sm:text-lg font-bold text-white tracking-tight group-hover:text-[#DFCA9E] transition-colors">
                      {c.name}
                    </h3>
                    <p className="text-xs text-neutral-400 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                      <span className="truncate">{c.location}</span>
                    </p>
                  </div>

                  {/* Dedicated Escrow Subaccount Box */}
                  <div className="p-3.5 rounded-2xl bg-[#0A0D12] border border-white/[0.06] space-y-2 text-xs font-mono">
                    <div className="flex items-center justify-between pb-1.5 border-b border-white/[0.06]">
                      <span className="text-[10px] text-neutral-400 uppercase tracking-wider">
                        Facility Escrow Pool
                      </span>
                      <span className="text-[10px] text-[#DFCA9E] font-semibold">
                        100% Ringfenced
                      </span>
                    </div>

                    <div className="flex items-baseline justify-between">
                      <span className="text-base sm:text-lg font-bold text-white font-mono">
                        {formatNaira(c.escrowBalance)}
                      </span>
                      <span className="text-[10px] text-neutral-400">
                        {c.totalUnits} Units Reserving
                      </span>
                    </div>

                    {/* Dedicated Escrow Bank & Account with 1-Click Copy */}
                    <div className="pt-1 flex items-center justify-between text-[11px] text-neutral-400">
                      <span className="truncate max-w-[170px]">{c.escrowBank}</span>
                      <button
                        onClick={() => handleCopyAccount(c.escrowAccountNumber, c.id)}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-white/[0.05] hover:bg-[#D4AF37]/20 hover:text-[#DFCA9E] border border-white/10 transition text-[10px]"
                        title="Copy Escrow Account Number"
                      >
                        {copiedBankId === c.id ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span className="text-emerald-400">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>{c.escrowAccountNumber}</span>
                          </>
                        )}
                      </button>
                    </div>

                    <div className="pt-1 flex items-center justify-between text-[10px] text-neutral-500 border-t border-white/[0.05]">
                      <span>Contractual Quiet Hours:</span>
                      <span className="text-[#DFCA9E] font-medium">{c.quietHours}</span>
                    </div>
                  </div>

                  {/* Action Buttons with High-Contrast Bold Typography */}
                  <div className="pt-1 grid grid-cols-2 gap-2 text-xs">
                    <button
                      onClick={() =>
                        showToast({
                          title: `Escrow Audit: ${c.name}`,
                          detail: `${c.escrowBank} pool: ${formatNaira(
                            c.escrowBalance
                          )} ringfenced for power generation, reverse osmosis & structural security.`,
                          type: "finance",
                        })
                      }
                      className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/[0.08] dark:hover:bg-white/[0.15] border border-slate-300 dark:border-white/20 text-[#0F172A] dark:text-white font-mono text-xs font-bold transition text-center shadow-sm"
                    >
                      Audit Escrow
                    </button>
                    <button
                      onClick={() =>
                        showToast({
                          title: `Rent Roll: ${c.name}`,
                          detail: `${c.totalUnits} executive residences active. Automated 92.5% landlord wires synced.`,
                          type: "info",
                        })
                      }
                      className="py-2.5 px-3 rounded-xl bg-[#D4AF37] hover:bg-[#E5C158] text-[#0A0D12] font-mono text-xs font-bold shadow-md shadow-[#D4AF37]/20 border border-[#D4AF37] transition text-center"
                    >
                      Rent Roll ({c.totalUnits})
                    </button>
                  </div>
                </div>
              </div>
              ))}
            </div>
          )}
        </section>

        {/* 2. Contractor Ticket Dispatch & Escrow Approvals */}
        <section className="space-y-4">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Wrench className="w-5 h-5 text-[#D4AF37]" />
              Contractor Ticket Dispatch & Escrow Release
            </h2>
            <p className="text-xs text-neutral-400 mt-0.5">
              Review resident incidents, assign certified specialist contractors, and verify photo proof before authorizing escrow release.
            </p>
          </div>

          <div className="border border-white/[0.08] rounded-2xl bg-[#121722] overflow-hidden">
            {tickets.length === 0 ? (
              <div className="py-12 px-6 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-white/[0.04] border border-white/[0.08] flex items-center justify-center mx-auto text-neutral-400">
                  <Wrench className="w-5 h-5 text-[#D4AF37]" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-white">No Active Contractor Tickets</p>
                  <p className="text-xs text-neutral-400 max-w-md mx-auto">
                    All enrolled estate infrastructure is operating at 100% nominal telemetry. When maintenance or diagnostic tickets are logged by resident principals, instant dispatch controls will appear here.
                  </p>
                </div>
              </div>
            ) : (
              <table className="w-full text-left text-xs">
                <thead className="bg-[#151C28] text-neutral-400 border-b border-white/[0.08]">
                  <tr>
                    <th className="py-3 px-4 font-medium">Ticket ID & Unit</th>
                    <th className="py-3 px-4 font-medium">Category & Issue</th>
                    <th className="py-3 px-4 font-medium">Priority</th>
                    <th className="py-3 px-4 font-medium">Contractor / Status</th>
                    <th className="py-3 px-4 font-medium text-right">Escrow Cost</th>
                    <th className="py-3 px-4 font-medium text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.06] text-neutral-300">
                  {tickets.map((t) => (
                    <tr key={t.id} className="hover:bg-white/[0.02] transition">
                      <td className="py-3.5 px-4 font-mono">
                        <span className="text-white font-medium block">{t.id}</span>
                        <span className="text-[11px] text-neutral-400">{t.unitName}</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-white block">{t.title}</span>
                        <span className="text-[11px] text-neutral-400 line-clamp-1">{t.description}</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase ${t.priority === "emergency"
                            ? "bg-[#D4AF37]/20 text-[#DFCA9E] border border-[#D4AF37]/40 font-bold"
                            : "bg-white/5 text-white/80 border border-white/10"
                            }`}
                        >
                          {t.priority}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="text-white block font-medium">{t.contractorName || "Pending Assignment"}</span>
                        <span className="text-[10px] font-mono text-[#DFCA9E] uppercase">{t.status.replace("_", " ")}</span>
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono font-medium text-white">
                        {t.invoiceAmount ? formatNaira(t.invoiceAmount) : "Pending Est."}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        {t.status === "reported" ? (
                          <button
                            onClick={() => handleDispatchContractor(t.id)}
                            className="py-1 px-3 rounded-lg bg-[#D4AF37] hover:bg-[#E5C158] text-[#0A0D12] font-bold text-[11px] shadow-sm transition"
                          >
                            Dispatch Contractor
                          </button>
                        ) : (
                          <span className="text-[11px] text-[#DFCA9E] font-mono flex items-center justify-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#D4AF37]" /> Authorized
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>

        {/* SECTION 4: CLIENT PASSKEY & SECURITY VAULT CONSOLE (PRODUCTION CREDENTIAL ISSUANCE) */}
        <section className="p-6 sm:p-8 rounded-3xl bg-[#0D111A] border border-white/[0.08] shadow-2xl space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider bg-[#D4AF37]/15 text-[#DFCA9E] border border-[#D4AF37]/30 font-bold">
                  Zero-Knowledge Access Infrastructure
                </span>
                <span className="flex items-center gap-1.5 text-xs font-mono text-emerald-400 font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  100% Live Production ({clientVaults.length} Real Clients)
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Client Passkey & Security Vault Console
              </h2>
              <p className="text-xs text-neutral-400 max-w-2xl">
                Every real landlord, institutional compound owner, and resident tenant has personal, isolated credentials. Manage, re-key, and personally dispatch access keys via encrypted WhatsApp or physical Tamper-Evident Welcome Folios.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={handleOpenEnrollModal}
                className="py-2.5 px-4 rounded-xl bg-[#D4AF37] hover:bg-[#E5C158] text-[#0A0D12] font-bold text-xs shadow-md shadow-[#D4AF37]/20 flex items-center gap-2 transition active:scale-95"
              >
                <UserPlus className="w-4 h-4 text-[#0A0D12]" />
                <span>+ Enroll Real Client Principal</span>
              </button>

              {clientVaults.length > 0 && (
                <button
                  onClick={() => {
                    const empty = clearAllRealClients();
                    setClientVaults(empty);
                    showToast({
                      title: "Vault Cleared",
                      detail: "All enrolled client records have been cleared.",
                      type: "security",
                    });
                  }}
                  className="py-2.5 px-3.5 rounded-xl bg-white/[0.05] hover:bg-rose-500/20 text-neutral-400 hover:text-rose-300 text-xs font-mono font-bold border border-white/10 hover:border-rose-500/30 transition flex items-center gap-1.5"
                  title="Clear all enrolled real clients"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear Vault</span>
                </button>
              )}
            </div>
          </div>

          {/* Client Vaults Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="text-[11px] uppercase tracking-wider text-neutral-400 border-b border-white/[0.08] bg-white/[0.01]">
                <tr>
                  <th className="py-3.5 px-4 font-semibold">Client Principal & Role</th>
                  <th className="py-3.5 px-4 font-semibold">Assigned Estate / Asset</th>
                  <th className="py-3.5 px-4 font-semibold">Verified Contact</th>
                  <th className="py-3.5 px-4 font-semibold">Security Protocol & Issuance</th>
                  <th className="py-3.5 px-4 font-semibold">Confidential Passkey / PIN</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Personal Dispatch Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.05]">
                {clientVaults.map((client) => {
                  const isRevealed = !!showSecretsMap[client.id];
                  return (
                    <tr key={client.id} className="hover:bg-white/[0.02] transition">
                      <td className="py-4 px-4">
                        <div className="font-bold text-sm text-white flex items-center gap-1.5">
                          <span>{client.name}</span>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        </div>
                        <div className="text-[11px] text-[#DFCA9E] font-medium">
                          {client.roleTitle}
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[10px] text-neutral-400">ID: {client.id}</span>
                          <span className="px-1.5 py-0.2 rounded text-[9px] bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                            LIVE
                          </span>
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        <div className="text-white font-medium">{client.estate}</div>
                        <div className="text-[11px] text-neutral-400">{client.location}</div>
                        <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                          <span className="inline-block px-2 py-0.5 rounded text-[10px] bg-white/[0.05] text-neutral-300 border border-white/10">
                            {client.badge}
                          </span>
                          {client.annexureQuietHoursCode && (
                            <span
                              className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#D4AF37]/10 text-[#DFCA9E] border border-[#D4AF37]/25 flex items-center gap-1 cursor-pointer hover:bg-[#D4AF37]/20 transition"
                              onClick={() => {
                                navigator.clipboard.writeText(client.annexureQuietHoursCode || "");
                                showToast({
                                  title: "Annexure Code Copied",
                                  detail: `${client.annexureQuietHoursCode} copied to clipboard.`,
                                  type: "info",
                                });
                              }}
                              title="Click to copy Annexure Quiet Hours Code"
                            >
                              <Clock className="w-2.5 h-2.5 text-[#D4AF37]" />
                              <span>{client.annexureQuietHoursCode}</span>
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        <div className="text-white flex items-center gap-1.5">
                          <Smartphone className="w-3.5 h-3.5 text-[#D4AF37]" />
                          <span>{client.phone}</span>
                        </div>
                        <div className="text-[11px] text-neutral-400 truncate max-w-[160px]">
                          {client.email}
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        <div className="text-emerald-400 font-semibold text-[11px]">
                          ● {client.securityStatus.split("·")[0]}
                        </div>
                        <div className="text-[10px] text-neutral-400">
                          Issued: {client.issuedAt}
                        </div>
                        <div className="text-[10px] text-[#DFCA9E]">
                          Channel: {client.deliveryMethod}
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <div className="p-2 rounded-xl bg-black/60 border border-white/10 font-mono text-xs">
                            {isRevealed ? (
                              <div className="space-y-0.5">
                                <div className="text-[#D4AF37] font-bold">
                                  Key: {client.passcode}
                                </div>
                                <div className="text-white text-[11px]">
                                  PIN: {client.pinCode}
                                </div>
                              </div>
                            ) : (
                              <div className="space-y-0.5 text-neutral-500">
                                <div>Key: •••••••••••</div>
                                <div className="text-[11px]">PIN: ••••</div>
                              </div>
                            )}
                          </div>
                          <button
                            onClick={() => toggleShowSecret(client.id)}
                            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-neutral-400 hover:text-white transition"
                            title={isRevealed ? "Mask Secret" : "Reveal Secret"}
                          >
                            {isRevealed ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </td>

                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenEditModal(client)}
                            className="py-1.5 px-3 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-white font-bold text-xs border border-white/10 transition flex items-center gap-1.5"
                            title="Change or re-key passkey"
                          >
                            <KeyRound className="w-3.5 h-3.5 text-[#D4AF37]" />
                            <span>Re-Key</span>
                          </button>

                          <button
                            onClick={() => setWhatsappDispatchClient(client)}
                            className="py-1.5 px-3 rounded-xl bg-[#25D366]/20 hover:bg-[#25D366] text-emerald-300 hover:text-black font-bold text-xs border border-[#25D366]/30 transition flex items-center gap-1.5"
                            title="Send WhatsApp VIP dispatch"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                            <span>WhatsApp</span>
                          </button>

                          <button
                            onClick={() => setFolioModalClient(client)}
                            className="py-1.5 px-3 rounded-xl bg-[#D4AF37]/15 hover:bg-[#D4AF37] text-[#DFCA9E] hover:text-[#0A0D12] font-bold text-xs border border-[#D4AF37]/30 transition flex items-center gap-1.5"
                            title="Generate physical wax-sealed folio"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            <span>Folio</span>
                          </button>

                          <button
                            onClick={() => handleDeleteClient(client.id, client.name)}
                            className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/25 text-rose-400 hover:text-rose-300 border border-rose-500/20 transition"
                            title="Delete & archive client vault"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {clientVaults.length === 0 && (
            <div className="p-8 text-center rounded-2xl bg-white/[0.02] border border-dashed border-white/10 space-y-3">
              <UserPlus className="w-9 h-9 text-[#D4AF37] mx-auto opacity-80" />
              <h3 className="text-base font-bold text-white">No Live Property Principals Enrolled</h3>
              <p className="text-xs text-neutral-400 max-w-md mx-auto">
                No client principals are currently enrolled. Register property owners or executive residents below to generate cryptographic passkeys and live settlement subaccounts.
              </p>
              <button
                onClick={handleOpenEnrollModal}
                className="py-2.5 px-5 rounded-xl bg-[#D4AF37] hover:bg-[#E5C158] text-[#0A0D12] font-bold text-xs shadow-md transition inline-flex items-center gap-2"
              >
                <Plus className="w-4 h-4 text-[#0A0D12]" />
                <span>+ Enroll First Live Client Principal</span>
              </button>
            </div>
          )}
        </section>
      </main>
      )}

      {/* MODAL 1: RE-KEY CLIENT CREDENTIALS */}
      {editingClient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-lg bg-[#111722] border border-[#D4AF37]/40 rounded-3xl p-6 sm:p-7 shadow-2xl text-left space-y-5">
            <div className="mb-2">
              <Logo size="sm" href="" />
            </div>
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#D4AF37]/15 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37]">
                  <KeyRound className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Re-Key Client Security Vault</h3>
                  <p className="text-xs text-neutral-400 font-mono">
                    {editingClient.name} · {editingClient.estate}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setEditingClient(null)}
                className="text-neutral-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveClientCredentials} className="space-y-4 text-xs font-mono">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-neutral-300 font-bold">Confidential Passkey:</label>
                  <button
                    type="button"
                    onClick={handleGenerateRandom}
                    className="text-[#DFCA9E] hover:text-white flex items-center gap-1 font-bold underline text-[11px]"
                  >
                    <RefreshCw className="w-3 h-3" />
                    Auto-Generate Random
                  </button>
                </div>
                <input
                  type="text"
                  required
                  value={customPasscode}
                  onChange={(e) => setCustomPasscode(e.target.value.toUpperCase())}
                  placeholder="e.g. ESTATE-8821"
                  className="w-full px-3.5 py-2.5 bg-[#080B10] border border-white/15 rounded-xl text-white font-bold placeholder-neutral-500 focus:outline-none focus:border-[#D4AF37] transition uppercase"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-neutral-300 font-bold block">4-Digit Security PIN:</label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={customPin}
                  onChange={(e) => setCustomPin(e.target.value)}
                  placeholder="e.g. 8821"
                  className="w-full px-3.5 py-2.5 bg-[#080B10] border border-white/15 rounded-xl text-white font-bold placeholder-neutral-500 focus:outline-none focus:border-[#D4AF37] transition"
                />
              </div>

              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 space-y-1 text-[11px] text-neutral-400">
                <div className="text-white font-semibold">Immediate System Synchronization:</div>
                <p>
                  Saving will instantly update the client vault across all web sessions and invalidate previous access tokens. The client will use this new credential to log in immediately.
                </p>
              </div>

              <div className="pt-2 flex items-center gap-3">
                <button
                  type="submit"
                  className="flex-1 py-3 px-4 bg-[#D4AF37] hover:bg-[#E5C158] text-[#0A0D12] font-bold text-xs rounded-xl shadow-md transition"
                >
                  Save & Apply New Passkey
                </button>
                <button
                  type="button"
                  onClick={() => setEditingClient(null)}
                  className="py-3 px-4 bg-white/[0.05] hover:bg-white/[0.1] text-neutral-300 text-xs font-bold rounded-xl transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: VIP ENCRYPTED WHATSAPP DISPATCH PREVIEW */}
      {whatsappDispatchClient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-lg bg-[#0e161f] border border-[#25D366]/40 rounded-3xl p-6 sm:p-7 shadow-2xl text-left space-y-4">
            <div className="mb-2">
              <Logo size="sm" href="" />
            </div>
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#25D366]/20 border border-[#25D366]/40 flex items-center justify-center text-[#25D366]">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">VIP WhatsApp Dispatch</h3>
                  <p className="text-xs text-neutral-400 font-mono">
                    Recipient: {whatsappDispatchClient.name} ({whatsappDispatchClient.phone})
                  </p>
                </div>
              </div>
              <button
                onClick={() => setWhatsappDispatchClient(null)}
                className="text-neutral-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Simulated WhatsApp Chat Bubble */}
            <div className="p-4 rounded-2xl bg-[#0b141b] border border-white/5 space-y-3 font-mono text-xs text-neutral-200">
              <div className="flex items-center justify-between text-[10px] text-neutral-400 pb-2 border-b border-white/5">
                <span className="text-[#25D366] font-bold">ELEVATED STAY VIP CONCIERGE</span>
                <span>Encrypted 256-Bit</span>
              </div>
              <div className="space-y-2 whitespace-pre-line text-[11px] leading-relaxed">
                {`CONFIDENTIAL ASSET PROTECTION ADVISORY
Dear ${whatsappDispatchClient.name},

Your private vault access for ${whatsappDispatchClient.estate} has been authorized:

• Personal Passkey: *${whatsappDispatchClient.passcode}*
• 4-Digit Security PIN: *${whatsappDispatchClient.pinCode}*
• Contractual Annexure Quiet Hours: *${whatsappDispatchClient.annexureQuietHoursCode || "ANX-QH-ENFORCED"}*
• Designated Escrow Hub: Standard Chartered Bank Nigeria
• Access Portal: https://stay.com.ng${whatsappDispatchClient.destination}

*Important:* Never disclose these credentials to facility managers or third parties. They are ringfenced to your authorized identity.`}
              </div>
              <div className="text-[10px] text-neutral-400 text-right">
                Delivered · Just now ✓✓
              </div>
            </div>

            <div className="pt-2 flex items-center gap-3 font-mono">
              <button
                onClick={() => {
                  const messageText = `CONFIDENTIAL ASSET PROTECTION ADVISORY\nDear ${whatsappDispatchClient.name},\nYour private vault access for ${whatsappDispatchClient.estate} has been authorized:\n• Personal Passkey: ${whatsappDispatchClient.passcode}\n• 4-Digit Security PIN: ${whatsappDispatchClient.pinCode}\n• Contractual Annexure Quiet Hours: ${whatsappDispatchClient.annexureQuietHoursCode || "ANX-QH-ENFORCED"}\n• Access Portal: https://stay.com.ng${whatsappDispatchClient.destination}`;
                  navigator.clipboard.writeText(messageText);
                  showToast({
                    title: "WhatsApp Dispatch Copied",
                    detail: `Message copied. Dispatched to verified number ${whatsappDispatchClient.phone}.`,
                    type: "security",
                  });
                  setWhatsappDispatchClient(null);
                }}
                className="flex-1 py-3 px-4 bg-[#25D366] hover:bg-[#20ba59] text-black font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4 text-black" />
                <span>Simulate Dispatch & Copy Text</span>
              </button>
              <button
                onClick={() => setWhatsappDispatchClient(null)}
                className="py-3 px-4 bg-white/[0.05] hover:bg-white/[0.1] text-neutral-300 text-xs font-bold rounded-xl transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: WAX-SEALED TAMPER-EVIDENT FOLIO PREVIEW */}
      {folioModalClient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="relative w-full max-w-2xl bg-[#0f131a] border border-[#D4AF37]/50 rounded-3xl p-7 sm:p-8 shadow-2xl text-left space-y-5">
            <div className="mb-1">
              <Logo size="sm" href="" />
            </div>
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37]">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Physical Tamper-Evident Welcome Folio</h3>
                  <p className="text-xs text-neutral-400 font-mono">
                    Executive Document Courier · Sealed Delivery
                  </p>
                </div>
              </div>
              <button
                onClick={() => setFolioModalClient(null)}
                className="text-neutral-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Formal Certificate/Letter Layout */}
            <div className="p-6 rounded-2xl bg-[#090C12] border border-[#D4AF37]/30 space-y-4 font-mono text-xs text-neutral-300 relative overflow-hidden">
              <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[#DFCA9E] font-bold text-[10px]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>CONFIDENTIAL SEAL</span>
              </div>

              <div className="border-b border-white/10 pb-3 space-y-1">
                <Logo size="sm" href="" className="mb-2" />
                <span className="text-[10px] text-[#D4AF37] uppercase tracking-wider block font-bold">
                  ELEVATED STAY ASSET PROTECTION & ESTATE MANAGEMENT
                </span>
                <h4 className="text-base font-bold text-white font-sans">
                  Private Enclave Vault Certificate
                </h4>
                <p className="text-[11px] text-neutral-400">
                  Issued to: <strong className="text-white">{folioModalClient.name}</strong> ({folioModalClient.roleTitle})
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-[11px]">
                <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
                  <span className="text-neutral-400 block text-[10px]">Managed Asset:</span>
                  <span className="text-white font-semibold">{folioModalClient.estate}</span>
                  <span className="block text-neutral-400 text-[10px]">{folioModalClient.location}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
                  <span className="text-neutral-400 block text-[10px]">Delivery Channel:</span>
                  <span className="text-[#DFCA9E] font-semibold">{folioModalClient.deliveryMethod}</span>
                  <span className="block text-neutral-400 text-[10px]">Issued: {folioModalClient.issuedAt}</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-black/70 border border-[#D4AF37]/40 space-y-2">
                <div className="text-[11px] text-[#DFCA9E] font-bold uppercase tracking-wider">
                  Personal Vault Access & Covenants:
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <span className="text-[10px] text-neutral-400 block">Master Passkey:</span>
                    <span className="text-base font-bold text-[#D4AF37] font-mono">{folioModalClient.passcode}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-neutral-400 block">4-Digit Security PIN:</span>
                    <span className="text-base font-bold text-white font-mono">{folioModalClient.pinCode}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-neutral-400 block">Annexure Quiet Hours:</span>
                    <span className="text-xs font-bold text-[#DFCA9E] font-mono block mt-1">
                      {folioModalClient.annexureQuietHoursCode || "ANX-QH-ENFORCED"}
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-[11px] text-neutral-400 font-sans leading-relaxed">
                This document contains confidential cryptographic access credentials. The bearer is contractually bound to the Quiet Hours covenant under Annexure <strong className="text-[#DFCA9E] font-mono">{folioModalClient.annexureQuietHoursCode || "ANX-QH-ENFORCED"}</strong> (22:00 – 07:00 WAT). Enter credentials at <strong className="text-white">stay.com.ng</strong> to review yield and authorize operations.
              </p>
            </div>

            <div className="pt-2 flex items-center justify-between gap-3 font-mono">
              <button
                onClick={() => {
                  window.print();
                }}
                className="py-3 px-5 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] text-white font-bold text-xs border border-white/15 transition flex items-center gap-2"
              >
                <Printer className="w-4 h-4 text-[#D4AF37]" />
                <span>Print Folio Certificate</span>
              </button>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    const folioText = `ELEVATED STAY CONFIDENTIAL ASSET VAULT CERTIFICATE\nIssued to: ${folioModalClient.name}\nCompound: ${folioModalClient.estate}\nMaster Passkey: ${folioModalClient.passcode}\n4-Digit PIN: ${folioModalClient.pinCode}\nAnnexure Quiet Hours Code: ${folioModalClient.annexureQuietHoursCode || "ANX-QH-ENFORCED"}\nIssued via: ${folioModalClient.deliveryMethod}`;
                    navigator.clipboard.writeText(folioText);
                    showToast({
                      title: "Folio Text Copied",
                      detail: "Formal onboarding credential copied to clipboard.",
                      type: "security",
                    });
                    setFolioModalClient(null);
                  }}
                  className="py-3 px-5 rounded-xl bg-[#D4AF37] hover:bg-[#E5C158] text-[#0A0D12] font-bold text-xs shadow-md transition"
                >
                  Copy Document Text
                </button>
                <button
                  onClick={() => setFolioModalClient(null)}
                  className="py-3 px-4 bg-white/[0.05] hover:bg-white/[0.1] text-neutral-300 text-xs font-bold rounded-xl transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: ENROLL REAL CLIENT PRINCIPAL */}
      {showEnrollModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="relative w-full max-w-xl bg-[#111722] border border-[#D4AF37]/50 rounded-3xl p-6 sm:p-8 shadow-2xl text-left space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="mb-2">
              <Logo size="sm" href="" />
            </div>
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37]">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Enroll Real Client Principal</h3>
                  <p className="text-xs text-neutral-400 font-mono">
                    Enclave Vault Onboarding · Direct Credential Generation
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowEnrollModal(false)}
                className="text-neutral-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleEnrollRealClient} className="space-y-4 text-xs font-mono">
              <div>
                <label className="block text-neutral-300 font-bold mb-1">
                  Client Principal Full Name / Family Trust:
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Horizon Asset Trust / Belgrove Holdings"
                  value={newClientName}
                  onChange={(e) => setNewClientName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#080B10] border border-white/15 rounded-xl text-white font-bold placeholder-neutral-500 focus:outline-none focus:border-[#D4AF37] transition"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-300 font-bold mb-1">Portal Access Level:</label>
                  <select
                    value={newClientRoleCategory}
                    onChange={(e) => {
                      const val = e.target.value as "landlord" | "resident";
                      setNewClientRoleCategory(val);
                      if (val === "resident") {
                        setNewClientRoleTitle("Resident Tenant (Executive)");
                        setNewClientMetric("");
                      } else {
                        setNewClientRoleTitle("Family Compound Principal");
                        setNewClientMetric("");
                      }
                    }}
                    className="w-full px-3 py-2.5 bg-[#080B10] border border-white/15 rounded-xl text-white focus:outline-none focus:border-[#D4AF37] transition"
                  >
                    <option value="landlord">Property Owner / Landlord Portal</option>
                    <option value="resident">Executive Resident Tenant Portal</option>
                  </select>
                </div>

                <div>
                  <label className="block text-neutral-300 font-bold mb-1">Principal Classification:</label>
                  <input
                    type="text"
                    required
                    value={newClientRoleTitle}
                    onChange={(e) => setNewClientRoleTitle(e.target.value)}
                    placeholder="e.g. Institutional Owner or Family Compound"
                    className="w-full px-3 py-2.5 bg-[#080B10] border border-white/15 rounded-xl text-white focus:outline-none focus:border-[#D4AF37] transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-300 font-bold mb-1">Managed Estate / Compound:</label>
                  <input
                    type="text"
                    required
                    value={newClientEstate}
                    onChange={(e) => setNewClientEstate(e.target.value)}
                    placeholder="e.g. Coral Shore Waterfront Residences"
                    className="w-full px-3 py-2.5 bg-[#080B10] border border-white/15 rounded-xl text-white focus:outline-none focus:border-[#D4AF37] transition"
                  />
                </div>

                <div>
                  <label className="block text-neutral-300 font-bold mb-1">Physical Location:</label>
                  <input
                    type="text"
                    required
                    value={newClientLocation}
                    onChange={(e) => setNewClientLocation(e.target.value)}
                    placeholder="e.g. Prime Residential Enclave, Lagos"
                    className="w-full px-3 py-2.5 bg-[#080B10] border border-white/15 rounded-xl text-white focus:outline-none focus:border-[#D4AF37] transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-300 font-bold mb-1">Verified WhatsApp / Phone:</label>
                  <input
                    type="text"
                    required
                    value={newClientPhone}
                    onChange={(e) => setNewClientPhone(e.target.value)}
                    placeholder="+234 803 000 0000"
                    className="w-full px-3 py-2.5 bg-[#080B10] border border-white/15 rounded-xl text-white font-bold placeholder-neutral-500 focus:outline-none focus:border-[#D4AF37] transition"
                  />
                </div>

                <div>
                  <label className="block text-neutral-300 font-bold mb-1">Family Office / Direct Email:</label>
                  <input
                    type="email"
                    value={newClientEmail}
                    onChange={(e) => setNewClientEmail(e.target.value)}
                    placeholder="principal@familyoffice.ng"
                    className="w-full px-3 py-2.5 bg-[#080B10] border border-white/15 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:border-[#D4AF37] transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-300 font-bold mb-1">Financial Metric / Yield Summary:</label>
                <input
                  type="text"
                  required
                  value={newClientMetric}
                  onChange={(e) => setNewClientMetric(e.target.value)}
                  placeholder="e.g. ₦180,000,000 Annual Yield · 12 Units"
                  className="w-full px-3.5 py-2.5 bg-[#080B10] border border-white/15 rounded-xl text-white focus:outline-none focus:border-[#D4AF37] transition"
                />
              </div>

              {/* Password & PIN Generation */}
              <div className="p-4 rounded-2xl bg-black/50 border border-[#D4AF37]/30 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-white font-bold text-xs flex items-center gap-1.5">
                    <KeyRound className="w-3.5 h-3.5 text-[#D4AF37]" />
                    Confidential Client Credentials:
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const surname = newClientName.split(" ").slice(-1)[0] || "KEY";
                      setNewClientPasscode(generateRandomPasskey(surname));
                      setNewClientPin(generateRandomPin());
                    }}
                    className="text-[#DFCA9E] hover:text-white flex items-center gap-1 text-[11px] underline"
                  >
                    <RefreshCw className="w-3 h-3" />
                    Regenerate Credentials
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-neutral-400 text-[10px] uppercase mb-1">Master Passkey:</label>
                    <input
                      type="text"
                      required
                      value={newClientPasscode}
                      onChange={(e) => setNewClientPasscode(e.target.value.toUpperCase())}
                      className="w-full px-3 py-2 bg-[#080B10] border border-white/15 rounded-xl text-[#D4AF37] font-bold uppercase focus:outline-none focus:border-[#D4AF37] transition"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-400 text-[10px] uppercase mb-1">4-Digit Security PIN:</label>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      value={newClientPin}
                      onChange={(e) => setNewClientPin(e.target.value)}
                      className="w-full px-3 py-2 bg-[#080B10] border border-white/15 rounded-xl text-white font-bold focus:outline-none focus:border-[#D4AF37] transition"
                    />
                  </div>
                </div>
              </div>

              {/* Automated Contractual Annexure Quiet Hours Code */}
              <div className="p-4 rounded-2xl bg-black/60 border border-[#D4AF37]/35 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-[#D4AF37]/15 text-[#DFCA9E]">
                      <Clock className="w-4 h-4 text-[#D4AF37]" />
                    </div>
                    <div>
                      <span className="text-white font-bold text-xs block">
                        Annexure Quiet Hours Code (Auto-Generated)
                      </span>
                      <span className="text-[10px] text-neutral-400">
                        Derived from client identity & compound covenant
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setNewClientQuietHoursCode(
                        generateAnnexureQuietHoursCode(newClientName, newClientEstate, newClientRoleCategory)
                      );
                    }}
                    className="text-[#DFCA9E] hover:text-white flex items-center gap-1 text-[11px] underline"
                    title="Regenerate Annexure Code"
                  >
                    <RefreshCw className="w-3 h-3" />
                    Regenerate
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    required
                    value={newClientQuietHoursCode}
                    onChange={(e) => setNewClientQuietHoursCode(e.target.value.toUpperCase())}
                    className="flex-1 px-3.5 py-2.5 bg-[#080B10] border border-white/15 rounded-xl text-[#DFCA9E] font-mono font-bold text-xs uppercase focus:outline-none focus:border-[#D4AF37] transition tracking-wide"
                  />
                  <div className="px-3 py-2.5 rounded-xl bg-white/[0.05] border border-white/10 text-[10px] font-mono text-neutral-300 whitespace-nowrap">
                    22:00 – 07:00 WAT
                  </div>
                </div>

                <p className="text-[10px] text-neutral-400 leading-relaxed font-mono">
                  This code binds the client to estate quiet hours decibel covenants (&le;45dB), automated generator cutoff protocols, and resident gatepass clearance.
                </p>
              </div>

              <div>
                <label className="block text-neutral-300 font-bold mb-1">Delivery Protocol:</label>
                <select
                  value={newClientDelivery}
                  onChange={(e) =>
                    setNewClientDelivery(
                      e.target.value as "Tamper-Evident Physical Folio" | "VIP WhatsApp Concierge Dispatch" | "Executive Courier"
                    )
                  }
                  className="w-full px-3 py-2.5 bg-[#080B10] border border-white/15 rounded-xl text-white focus:outline-none focus:border-[#D4AF37] transition"
                >
                  <option value="VIP WhatsApp Concierge Dispatch">VIP WhatsApp Concierge Dispatch</option>
                  <option value="Tamper-Evident Physical Folio">Tamper-Evident Physical Folio</option>
                  <option value="Executive Courier">Executive Courier</option>
                </select>
              </div>

              <div className="pt-2 flex items-center gap-3">
                <button
                  type="submit"
                  className="flex-1 py-3.5 px-5 bg-[#D4AF37] hover:bg-[#E5C158] text-[#0A0D12] font-bold text-xs rounded-xl shadow-md transition"
                >
                  Confirm & Enroll Real Client Principal
                </button>
                <button
                  type="button"
                  onClick={() => setShowEnrollModal(false)}
                  className="py-3.5 px-5 bg-white/[0.05] hover:bg-white/[0.1] text-neutral-300 text-xs font-bold rounded-xl transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Onboarding Modal */}
      {showOnboardingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto scrollbar-thin bg-[#121722] border border-[#C2A774]/30 rounded-2xl p-6 sm:p-7 shadow-2xl text-left">
            <div className="mb-4">
              <Logo size="sm" href="" />
            </div>
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.08] mb-5">
              <div className="flex items-center gap-2">
                <Building className="w-5 h-5 text-[#C2A774]" />
                <div>
                  <h3 className="text-base font-semibold text-white">Onboard Compound & Escrow</h3>
                  <p className="text-[11px] text-neutral-400">Instantiate ringfenced escrow & client visual telemetry deck</p>
                </div>
              </div>
              <button
                onClick={() => setShowOnboardingModal(false)}
                className="text-neutral-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleOnboardCompound} className="space-y-4 text-xs">
              <div>
                <label className="block text-neutral-300 font-medium mb-1">Estate / Compound Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Coral Shore Waterfront Residences"
                  value={newCompoundName}
                  onChange={(e) => setNewCompoundName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#0C1017] border border-white/10 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:border-[#C2A774] transition"
                />
              </div>

              <div>
                <label className="block text-neutral-300 font-medium mb-1">Physical Address</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Prime Residential Enclave"
                  value={newCompoundLocation}
                  onChange={(e) => setNewCompoundLocation(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#0C1017] border border-white/10 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:border-[#C2A774] transition"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-300 font-medium mb-1">State & City Hub</label>
                  <select
                    value={newCompoundCity}
                    onChange={(e) => setNewCompoundCity(e.target.value)}
                    className="w-full px-3 py-2 bg-[#0C1017] border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#C2A774] transition"
                  >
                    <option value="Lagos">Lagos State</option>
                    <option value="Abuja">Abuja FCT</option>
                    <option value="Port Harcourt">Rivers State (Port Harcourt)</option>
                    <option value="Enugu">Enugu State</option>
                    <option value="Ibadan">Oyo State (Ibadan)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-neutral-300 font-medium mb-1">Total Unit Count</label>
                  <input
                    type="number"
                    min={1}
                    max={50}
                    value={newUnitsCount}
                    onChange={(e) => setNewUnitsCount(e.target.value)}
                    className="w-full px-3 py-2 bg-[#0C1017] border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#C2A774] transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-300 font-medium mb-1">Dedicated Escrow Banking Partner</label>
                <select
                  value={newCompoundEscrowBank}
                  onChange={(e) => setNewCompoundEscrowBank(e.target.value)}
                  className="w-full px-3 py-2 bg-[#0C1017] border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#C2A774] transition"
                >
                  <option value="Standard Chartered Bank Nigeria">Standard Chartered Bank Nigeria (Private)</option>
                  <option value="Guaranty Trust Bank (Private Banking)">Guaranty Trust Bank (Private Banking)</option>
                  <option value="Zenith Bank (Prestige)">Zenith Bank (Prestige)</option>
                </select>
              </div>

              <div>
                <label className="block text-neutral-300 font-medium mb-1">
                  Dedicated Escrow NUBAN Account (Optional)
                </label>
                <input
                  type="text"
                  maxLength={10}
                  placeholder="e.g. 0123984711 (leave blank to auto-generate)"
                  value={newCompoundEscrowAccount}
                  onChange={(e) => setNewCompoundEscrowAccount(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#0C1017] border border-white/10 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:border-[#C2A774] transition font-mono"
                />
              </div>

              {/* Architectural Imagery & Building Slide Deck */}
              <div className="space-y-3 pt-3 border-t border-white/[0.08]">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="block text-neutral-200 font-medium text-xs">
                      Estate Architectural Imagery & Slide Deck
                    </label>
                    <span className="text-[11px] text-neutral-400 block">
                      Upload true photos of the building facade, generator bay, gatehouse, or RO plant.
                    </span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.06] text-[#DFCA9E] border border-white/10 font-bold">
                    {newCompoundImages.length} {newCompoundImages.length === 1 ? "Slide" : "Slides"}
                  </span>
                </div>

                {/* Upload Buttons & URL Input */}
                <div className="space-y-2">
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      multiple
                      accept="image/*"
                      className="hidden"
                      id="compound-image-upload"
                    />
                    <label
                      htmlFor="compound-image-upload"
                      className="flex-1 py-2.5 px-3 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-white border border-white/15 cursor-pointer flex items-center justify-center gap-2 transition text-xs font-medium"
                    >
                      <Upload className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>{isUploadingImage ? "Processing Photos..." : "Upload Photos from Device"}</span>
                    </label>

                    <div className="flex-[1.2] flex gap-1.5">
                      <input
                        type="url"
                        placeholder="Or paste photo URL..."
                        value={newCustomImageUrl}
                        onChange={(e) => setNewCustomImageUrl(e.target.value)}
                        className="flex-1 px-3 py-2 bg-[#0C1017] border border-white/10 rounded-xl text-white placeholder-neutral-500 text-xs focus:outline-none focus:border-[#C2A774]"
                      />
                      <button
                        type="button"
                        onClick={handleAddCustomImageUrl}
                        className="py-2 px-3 bg-[#D4AF37]/20 hover:bg-[#D4AF37]/30 text-[#DFCA9E] border border-[#D4AF37]/40 rounded-xl text-xs font-bold transition whitespace-nowrap"
                      >
                        Add URL
                      </button>
                    </div>
                  </div>

                  {/* Architectural Presets */}
                  <div className="pt-1">
                    <span className="text-[10px] text-neutral-400 font-mono uppercase block mb-1.5">
                      Quick Architectural Presets:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {ARCHITECTURAL_PRESETS.map((preset) => {
                        const isAdded = newCompoundImages.includes(preset.url);
                        return (
                          <button
                            key={preset.title}
                            type="button"
                            onClick={() => handleSelectPreset(preset.url)}
                            className={`px-2.5 py-1 rounded-lg text-[10px] font-mono border transition flex items-center gap-1.5 ${
                              isAdded
                                ? "bg-[#D4AF37]/20 border-[#D4AF37] text-[#DFCA9E]"
                                : "bg-white/[0.03] border-white/10 text-neutral-400 hover:text-white hover:border-white/20"
                            }`}
                          >
                            <span>+ {preset.title}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Thumbnail Deck Preview */}
                  {newCompoundImages.length > 0 && (
                    <div className="pt-2">
                      <span className="text-[10px] text-neutral-400 font-mono uppercase block mb-1.5">
                        Active Slide Deck ({newCompoundImages.length} building views):
                      </span>
                      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                        {newCompoundImages.map((imgUrl, idx) => (
                          <div
                            key={idx}
                            className="relative group rounded-xl overflow-hidden border border-white/15 bg-black/40 h-20"
                          >
                            <img
                              src={imgUrl}
                              alt={`Building slide ${idx + 1}`}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                              <button
                                type="button"
                                onClick={() => handleRemoveImage(idx)}
                                className="p-1 rounded-md bg-red-600/80 hover:bg-red-600 text-white transition cursor-pointer"
                                title="Remove photo"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                            <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded text-[8px] font-mono bg-black/85 text-white border border-white/15">
                              {idx === 0 ? "Cover" : `#${idx + 1}`}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#090C12] border border-white/[0.06] text-[11px] text-neutral-400">
                A dedicated Paystack subaccount and facility escrow bank account will be automatically instantiated with visual slide telemetry.
              </div>

              <div className="pt-2 flex items-center gap-3">
                <button
                  type="submit"
                  className="flex-1 py-3 px-4 bg-gradient-to-r from-[#C2A774] to-[#B39661] hover:from-[#DFCA9E] hover:to-[#C2A774] text-[#0A0D12] font-bold text-xs rounded-xl shadow-md transition"
                >
                  Complete Onboarding
                </button>
                <button
                  type="button"
                  onClick={() => setShowOnboardingModal(false)}
                  className="py-3 px-4 bg-white/[0.05] hover:bg-white/[0.08] text-neutral-300 text-xs font-medium rounded-xl transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

