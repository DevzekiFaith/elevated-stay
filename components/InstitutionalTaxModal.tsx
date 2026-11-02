"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Download, FileText, CheckCircle2, ShieldCheck, Printer, X, Award, Building2 } from "lucide-react";
import { formatNaira } from "@/lib/payment-split";
import { MOCK_LANDLORD } from "@/lib/mock-data";
import { Landlord } from "@/lib/types";
import { Logo } from "./Logo";
import { useToast } from "./ToastProvider";

interface InstitutionalTaxModalProps {
  onClose: () => void;
  landlord?: Landlord;
}

export function InstitutionalTaxModal({ onClose, landlord = MOCK_LANDLORD }: InstitutionalTaxModalProps) {
  const { showToast } = useToast();
  const [downloading, setDownloading] = useState(false);

  const activeLandlord = landlord || MOCK_LANDLORD;
  const grossYield = activeLandlord.totalAnnualYield || 114000000;
  const netRemittance = Math.round(grossYield * 0.925);
  const mgmtRetainer = Math.round(grossYield * 0.075);

  const handleDownload = () => {
    setDownloading(true);
    showToast({
      title: "Tax Audit Pack Exported",
      detail: `256-bit signed report for ${activeLandlord.name} sent to printer / PDF.`,
      type: "finance",
    });
    setTimeout(() => {
      setDownloading(false);
      window.print();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ duration: 0.2 }}
        className="relative w-full max-w-2xl bg-[#0F141F] border border-[#D4AF37]/40 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 text-left max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-white/[0.08]">
          <div className="space-y-3">
            <Logo size="sm" href="" />
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-[#D4AF37]/10 border border-[#D4AF37]/25 text-[#DFCA9E]">
                <Award className="w-5 h-5 text-[#D4AF37]" />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#D4AF37] font-bold">
                  FAMILY OFFICE AUDIT PROTOCOL
                </span>
                <h3 className="text-lg font-bold text-white tracking-tight">
                  Annual Asset Depreciation & Tax Audit Pack
                </h3>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/[0.05] hover:bg-white/[0.1] text-neutral-400 hover:text-white flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Certificate Body */}
        <div className="p-5 rounded-2xl bg-[#080B10] border border-white/[0.06] space-y-4 font-mono text-xs">
          <div className="grid grid-cols-2 gap-4 pb-3 border-b border-white/[0.06]">
            <div>
              <span className="text-[10px] text-neutral-400 block uppercase">Client Principal</span>
              <strong className="text-white text-sm block mt-0.5">{activeLandlord.name}</strong>
              <span className="text-neutral-400 text-[11px]">{activeLandlord.organizationName || "Private Wealth Family Office"}</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-neutral-400 block uppercase">Tax Audit Period</span>
              <strong className="text-white text-sm block mt-0.5">FY 2026 / 2027</strong>
              <span className="text-[#DFCA9E] text-[11px]">FIRS & UK HMRC Format Compliant</span>
            </div>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1">
              <span className="text-neutral-300">Gross Portfolio Rent Inflows:</span>
              <strong className="text-white">{formatNaira(grossYield)}</strong>
            </div>
            <div className="flex justify-between py-1 border-t border-white/[0.05]">
              <span className="text-neutral-300">Direct Landlord Bank Remittances (92.5%):</span>
              <strong className="text-[#DFCA9E] font-bold">{formatNaira(netRemittance)}</strong>
            </div>
            <div className="flex justify-between py-1 border-t border-white/[0.05]">
              <span className="text-neutral-300">Management & Lifecycle Retainer (7.5%):</span>
              <strong className="text-neutral-400">{formatNaira(mgmtRetainer)}</strong>
            </div>
            <div className="flex justify-between py-1 border-t border-white/[0.05]">
              <span className="text-neutral-300">Audited Maintenance Capital Allowances:</span>
              <strong className="text-[#DFCA9E]">{formatNaira(Math.round(grossYield * 0.012))}</strong>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-black/40 border border-white/5 text-[11px] leading-relaxed text-neutral-400">
            <p className="text-neutral-300 font-semibold mb-1">Quantity Surveyor Verification Note:</p>
            All physical inspections (HVAC central chiller servicing, solar BMS firmware calibration, and Dow reverse osmosis hydro overhauls) are certified with photographic proof and voucher hashes. No unverified contractor expense recognized.
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="w-full sm:flex-1 py-3 px-5 rounded-xl bg-[#D4AF37] hover:bg-[#E5C158] text-[#0A0D12] font-bold text-xs shadow-md shadow-[#D4AF37]/20 flex items-center justify-center gap-2 transition active:scale-98 disabled:opacity-50"
          >
            <Download className="w-4 h-4 text-[#0A0D12]" />
            <span>{downloading ? "Preparing Tax Pack..." : "Download Official Audit Pack (PDF)"}</span>
          </button>
          <button
            onClick={onClose}
            className="w-full sm:w-auto py-3 px-5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-neutral-300 text-xs font-mono border border-white/10 transition text-center"
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
}

