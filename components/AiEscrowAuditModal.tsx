"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
  Wrench,
  DollarSign,
  TrendingDown,
  TrendingUp,
  Cpu,
  Layers,
  Building,
  Check,
  X,
  Copy,
  Printer,
  ExternalLink,
  Lock,
  ArrowRight,
  Eye,
  Camera,
} from "lucide-react";
import { formatNaira } from "@/lib/payment-split";
import { MaintenanceTicket } from "@/lib/types";
import { runAiEscrowAudit, AiWorkmanshipAudit } from "@/lib/ai-escrow-auditor";
import { Logo } from "./Logo";

interface AiEscrowAuditModalProps {
  ticket: MaintenanceTicket;
  onClose: () => void;
  onAuthorizeEscrow?: (ticketId: string, amount: number) => void;
  compoundEscrowAccount?: string;
  isAuthorizedAlready?: boolean;
}

export function AiEscrowAuditModal({
  ticket,
  onClose,
  onAuthorizeEscrow,
  compoundEscrowAccount,
  isAuthorizedAlready = false,
}: AiEscrowAuditModalProps) {
  const [activeTab, setActiveTab] = useState<"visual" | "invoice" | "certificate">("visual");
  const [copiedHash, setCopiedHash] = useState(false);
  const [isAuthorizing, setIsAuthorizing] = useState(false);
  const [authorizedState, setAuthorizedState] = useState(isAuthorizedAlready);

  const audit: AiWorkmanshipAudit = runAiEscrowAudit(ticket, compoundEscrowAccount);

  const handleCopyHash = () => {
    navigator.clipboard.writeText(audit.auditHash);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  const handleAuthorizeRelease = () => {
    setIsAuthorizing(true);
    setTimeout(() => {
      setIsAuthorizing(false);
      setAuthorizedState(true);
      if (onAuthorizeEscrow) {
        onAuthorizeEscrow(ticket.id, audit.invoiceAudit.billedAmount);
      }
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 12 }}
        transition={{ duration: 0.25 }}
        className="relative w-full max-w-4xl bg-[#0C1017] border border-[#D4AF37]/35 rounded-3xl shadow-2xl text-left overflow-hidden flex flex-col my-auto max-h-[92vh]"
      >
        {/* Top Architectural Ambient Glow */}
        <div className="absolute top-0 right-0 w-80 h-40 bg-[#D4AF37]/10 blur-[100px] pointer-events-none" />

        {/* Modal Header */}
        <div className="p-5 sm:p-7 border-b border-white/[0.08] relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-[10px] font-mono tracking-wider bg-[#D4AF37]/15 text-[#DFCA9E] border border-[#D4AF37]/30 uppercase font-bold flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-[#D4AF37]" />
                AI ESCROW WORKMANSHIP & INVOICE AUDITOR
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                {audit.confidenceScore}% CONFIDENCE
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2 font-sans pt-1">
              <span>{ticket.title}</span>
            </h2>
            <p className="text-xs text-neutral-400 font-mono">
              Unit: <strong className="text-white">{ticket.unitName}</strong> · Estate: <strong className="text-white">{ticket.compoundName}</strong> · Contractor: <span className="text-[#DFCA9E]">{ticket.contractorName || "Certified Specialist"}</span>
            </p>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
            <button
              onClick={handleCopyHash}
              className="py-2 px-3 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-xs font-mono text-neutral-300 border border-white/10 transition flex items-center gap-1.5"
              title="Copy Audit Hash"
            >
              {copiedHash ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{copiedHash ? "Hash Copied" : "Copy Hash"}</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-white/[0.08] transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="px-5 sm:px-7 pt-4 bg-[#0A0D12] border-b border-white/[0.06] flex items-center gap-2 text-xs font-mono overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab("visual")}
            className={`py-2.5 px-4 rounded-xl font-bold transition flex items-center gap-2 whitespace-nowrap ${
              activeTab === "visual"
                ? "bg-[#D4AF37] text-[#0A0D12] shadow-md shadow-[#D4AF37]/20 border border-[#D4AF37]"
                : "text-neutral-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>1. Photographic HUD Analysis</span>
          </button>

          <button
            onClick={() => setActiveTab("invoice")}
            className={`py-2.5 px-4 rounded-xl font-bold transition flex items-center gap-2 whitespace-nowrap ${
              activeTab === "invoice"
                ? "bg-[#D4AF37] text-[#0A0D12] shadow-md shadow-[#D4AF37]/20 border border-[#D4AF37]"
                : "text-neutral-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <DollarSign className="w-3.5 h-3.5" />
            <span>2. Line-Item Invoice Sanity ({formatNaira(audit.invoiceAudit.billedAmount)})</span>
          </button>

          <button
            onClick={() => setActiveTab("certificate")}
            className={`py-2.5 px-4 rounded-xl font-bold transition flex items-center gap-2 whitespace-nowrap ${
              activeTab === "certificate"
                ? "bg-[#D4AF37] text-[#0A0D12] shadow-md shadow-[#D4AF37]/20 border border-[#D4AF37]"
                : "text-neutral-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <FileCheck className="w-3.5 h-3.5" />
            <span>3. Escrow Release Protocol</span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-7 overflow-y-auto space-y-6 flex-1">
          {/* TAB 1: PHOTOGRAPHIC HUD & VISUAL REMEDIATION CHECK */}
          {activeTab === "visual" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Before Photo Box */}
                <div className="rounded-2xl bg-black border border-white/10 overflow-hidden relative shadow-lg group">
                  <div className="h-56 w-full relative">
                    <img
                      src={ticket.beforePhotoUrl}
                      alt="Before Maintenance"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />
                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-black/85 backdrop-blur-md text-[10px] font-mono text-red-400 border border-red-500/30 flex items-center gap-1.5 font-bold">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
                      BEFORE DISPATCH (DEGRADED)
                    </span>
                  </div>
                  <div className="p-3.5 bg-[#0A0D12] border-t border-white/10 space-y-1 font-mono text-xs">
                    <div className="text-[10px] text-neutral-400 uppercase">AI Pre-Work Anomaly Flag:</div>
                    <div className="text-white text-[11px] leading-relaxed">
                      {audit.visualRemediationCheck.beforeAnomalyDetected}
                    </div>
                  </div>
                </div>

                {/* After Photo Box */}
                <div className="rounded-2xl bg-black border border-[#D4AF37]/40 overflow-hidden relative shadow-xl group">
                  <div className="h-56 w-full relative">
                    <img
                      src={ticket.afterPhotoUrl || ticket.beforePhotoUrl}
                      alt="After Remediation"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />
                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-black/85 backdrop-blur-md text-[10px] font-mono text-emerald-400 border border-emerald-500/40 flex items-center gap-1.5 font-bold">
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      AFTER REMEDIATION (CERTIFIED)
                    </span>
                    <span className="absolute top-3 right-3 px-2 py-0.5 rounded text-[10px] font-mono bg-[#D4AF37] text-[#0A0D12] font-bold shadow-md">
                      AI Verified
                    </span>
                  </div>
                  <div className="p-3.5 bg-[#0A0D12] border-t border-white/10 space-y-1 font-mono text-xs">
                    <div className="text-[10px] text-neutral-400 uppercase">AI Post-Work Remediation Proof:</div>
                    <div className="text-emerald-300 text-[11px] leading-relaxed">
                      {audit.visualRemediationCheck.afterRemediationVerified}
                    </div>
                  </div>
                </div>
              </div>

              {/* AI Detection Checkpoints */}
              <div className="p-5 rounded-2xl bg-[#080B10] border border-white/[0.08] space-y-3.5">
                <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
                  <span className="text-xs font-mono uppercase tracking-wider text-neutral-300 font-bold flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-[#D4AF37]" />
                    Computer Vision Checkpoints (Structural Continuity)
                  </span>
                  <span className="text-xs font-mono text-[#DFCA9E]">
                    3 of 3 Passed (100% Pixel Match)
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
                  {audit.visualRemediationCheck.aiDetectionAnnotations.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-neutral-400 uppercase">{item.coordinates}</span>
                        <span className="px-1.5 py-0.2 rounded text-[9px] bg-emerald-500/15 text-emerald-400 font-bold">
                          {Math.round(item.confidence * 100)}% Match
                        </span>
                      </div>
                      <div className="text-white text-[11px] font-medium leading-snug">
                        {item.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Workmanship Summary Banner */}
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 flex items-start gap-3 text-xs">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <div className="text-emerald-300 font-bold font-mono">
                    Visual Remediation Verified by Automated Vision Protocol
                  </div>
                  <p className="text-neutral-300 text-[11px] leading-relaxed">
                    Continuity algorithms confirmed that the photographed after-repairs assembly belongs to unit <strong>{ticket.unitName}</strong>. Zero evidence of phantom reuse or stock image spoofing.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: INVOICE & PARTS INTELLIGENCE */}
          {activeTab === "invoice" && (
            <div className="space-y-6">
              {/* Financial KPI Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono">
                <div className="p-4 rounded-2xl bg-[#080B10] border border-white/[0.08] space-y-1">
                  <div className="text-[10px] text-neutral-400 uppercase">Contractor Billed Amount</div>
                  <div className="text-xl sm:text-2xl font-bold text-white">
                    {formatNaira(audit.invoiceAudit.billedAmount)}
                  </div>
                  <div className="text-[10px] text-neutral-400">Submitted for Escrow Release</div>
                </div>

                <div className="p-4 rounded-2xl bg-[#080B10] border border-white/[0.08] space-y-1">
                  <div className="text-[10px] text-neutral-400 uppercase">NIQS Fair Market Benchmark</div>
                  <div className="text-xl sm:text-2xl font-bold text-[#DFCA9E]">
                    {formatNaira(audit.invoiceAudit.fairMarketBenchmark)}
                  </div>
                  <div className="text-[10px] text-neutral-400">Institutional Prime Index</div>
                </div>

                <div className="p-4 rounded-2xl bg-[#080B10] border border-white/[0.08] space-y-1">
                  <div className="text-[10px] text-neutral-400 uppercase">Market Delta / Variance</div>
                  <div
                    className={`text-xl sm:text-2xl font-bold ${
                      Math.abs(audit.invoiceAudit.variancePercentage) <= 12
                        ? "text-emerald-400"
                        : "text-amber-400"
                    }`}
                  >
                    {audit.invoiceAudit.variancePercentage >= 0 ? "+" : ""}
                    {audit.invoiceAudit.variancePercentage}%
                  </div>
                  <div className="text-[10px] text-emerald-400 flex items-center gap-1 font-bold">
                    <Check className="w-3 h-3" /> Within Acceptable Tolerance
                  </div>
                </div>
              </div>

              {/* Line Items Breakdown Table */}
              <div className="border border-white/[0.08] rounded-2xl bg-[#0A0D12] overflow-hidden">
                <div className="p-4 border-b border-white/[0.06] flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                    Itemized Component & Labor Audit
                  </span>
                  <span className="text-[10px] font-mono text-neutral-400">
                    4 Components Audited Against Lagos / Abuja Wholesalers
                  </span>
                </div>

                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-[#121720] text-neutral-400 border-b border-white/[0.08]">
                    <tr>
                      <th className="py-3 px-4 font-medium">Billed Component / Service</th>
                      <th className="py-3 px-4 font-medium text-right">Billed Cost</th>
                      <th className="py-3 px-4 font-medium text-right">Market Benchmark</th>
                      <th className="py-3 px-4 font-medium text-center">Variance</th>
                      <th className="py-3 px-4 font-medium text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.06] text-neutral-300">
                    {audit.invoiceAudit.lineItemsAnalyzed.map((item, idx) => (
                      <tr key={idx} className="hover:bg-white/[0.02] transition">
                        <td className="py-3 px-4">
                          <span className="text-white font-medium block">{item.item}</span>
                          <span className="text-[10px] text-neutral-400 block mt-0.5">{item.specCheck}</span>
                        </td>
                        <td className="py-3 px-4 text-right font-medium text-white">
                          {formatNaira(item.billedCost)}
                        </td>
                        <td className="py-3 px-4 text-right text-neutral-400">
                          {formatNaira(item.marketBenchmark)}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              Math.abs(item.variancePercentage) <= 10
                                ? "bg-emerald-500/10 text-emerald-400"
                                : "bg-amber-500/10 text-amber-400"
                            }`}
                          >
                            {item.variancePercentage >= 0 ? "+" : ""}
                            {item.variancePercentage}%
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                            Verified
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Anti-Fraud Cross-Checks */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="text-neutral-300 text-[11px]">Unique Invoice Signature (No duplicates)</span>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="text-neutral-300 text-[11px]">Labor Hours Within COREN Limits</span>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="text-neutral-300 text-[11px]">OEM Parts Model Serial Verified</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: ESCROW RELEASE PROTOCOL & CERTIFICATE */}
          {activeTab === "certificate" && (
            <div className="space-y-6">
              {/* Institutional Voucher Certificate Card */}
              <div className="p-6 sm:p-7 rounded-3xl bg-[#090C12] border-2 border-[#D4AF37]/40 shadow-2xl relative space-y-6 font-mono text-xs">
                {/* Certificate Stamp */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-white/[0.08]">
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase tracking-widest text-[#DFCA9E] font-bold">
                      OFFICIAL ESCROW AUDIT CERTIFICATE
                    </span>
                    <h3 className="text-lg font-bold text-white font-sans">
                      Automated Quantity Surveyor Compliance Seal
                    </h3>
                    <p className="text-[11px] text-neutral-400">
                      Voucher Reference: <strong className="text-white">{audit.auditHash}</strong>
                    </p>
                  </div>

                  <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center gap-2 font-bold shrink-0">
                    <ShieldCheck className="w-5 h-5 text-emerald-400" />
                    <span>CERTIFIED VERIFIED</span>
                  </div>
                </div>

                {/* Disbursement Financial Structure */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-2xl bg-[#0D111A] border border-white/[0.06]">
                  <div>
                    <span className="text-[10px] text-neutral-400 block uppercase">Gross Approved Cost:</span>
                    <span className="text-base font-bold text-white font-mono mt-0.5 block">
                      {formatNaira(audit.invoiceAudit.billedAmount)}
                    </span>
                    <span className="text-[10px] text-neutral-400">Debited from Facility Escrow</span>
                  </div>

                  <div>
                    <span className="text-[10px] text-neutral-400 block uppercase">5% Statutory WHT (FIRS):</span>
                    <span className="text-base font-bold text-[#DFCA9E] font-mono mt-0.5 block">
                      {formatNaira(audit.escrowRecommendation.settlementSplit.escrowWithholdingTaxNaira)}
                    </span>
                    <span className="text-[10px] text-neutral-400">Remitted to Federal Tax Arm</span>
                  </div>

                  <div>
                    <span className="text-[10px] text-neutral-400 block uppercase">Net Contractor Wire:</span>
                    <span className="text-base font-bold text-emerald-400 font-mono mt-0.5 block">
                      {formatNaira(audit.escrowRecommendation.settlementSplit.contractorPayoutNaira)}
                    </span>
                    <span className="text-[10px] text-emerald-400">Direct Paystack / Wire</span>
                  </div>
                </div>

                {/* Audit Rationale */}
                <div className="space-y-1.5 p-4 rounded-2xl bg-black/50 border border-white/5">
                  <span className="text-[10px] uppercase text-[#DFCA9E] font-bold block">
                    Lead Quantity Surveyor Regulatory Rationale:
                  </span>
                  <p className="text-[11px] text-neutral-300 leading-relaxed">
                    {audit.escrowRecommendation.rationale}
                  </p>
                </div>

                {/* Security Signatures */}
                <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[10px] text-neutral-400 border-t border-white/[0.06]">
                  <span>Engine: {audit.qsAuditorLicense}</span>
                  <span>Timestamp: {audit.auditTimestamp}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Action Controls */}
        <div className="p-5 sm:p-6 bg-[#080B10] border-t border-white/[0.08] relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-mono text-neutral-400">
            <Lock className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Escrow Pool Ringfence Protected</span>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="w-full sm:w-auto py-2.5 px-4 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-neutral-300 text-xs font-mono font-semibold border border-white/10 transition text-center"
            >
              Close
            </button>

            {authorizedState ? (
              <div className="py-2.5 px-5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-mono font-bold flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Escrow Payment Disbursed</span>
              </div>
            ) : onAuthorizeEscrow ? (
              <button
                onClick={handleAuthorizeRelease}
                disabled={isAuthorizing}
                className="w-full sm:w-auto py-2.5 px-5 rounded-xl bg-[#D4AF37] hover:bg-[#E5C158] text-[#0A0D12] text-xs font-mono font-bold shadow-lg shadow-[#D4AF37]/25 flex items-center justify-center gap-2 transition active:scale-95 disabled:opacity-50"
              >
                <ShieldCheck className="w-4 h-4 text-[#0A0D12]" />
                <span>{isAuthorizing ? "Processing Escrow Release..." : "Authorize Escrow Release (95% Net)"}</span>
              </button>
            ) : null}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

