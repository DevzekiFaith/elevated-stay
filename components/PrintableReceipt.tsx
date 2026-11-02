"use client";

import { Transaction } from "@/lib/types";
import { formatNaira } from "@/lib/payment-split";
import { Printer, Download, CheckCircle2, ShieldCheck, X } from "lucide-react";
import { useToast } from "./ToastProvider";

interface PrintableReceiptProps {
  transaction: Transaction;
  onClose: () => void;
}

export function PrintableReceipt({ transaction, onClose }: PrintableReceiptProps) {
  const { showToast } = useToast();

  const handlePrint = () => {
    showToast({
      title: "Receipt Voucher Exported",
      detail: `Official transaction record for ${transaction.reference} sent to printer / PDF.`,
      type: "finance",
    });
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-2xl bg-[#121722] border border-[#C2A774]/40 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Modal Controls (No print) */}
        <div className="no-print p-4 border-b border-white/[0.08] flex items-center justify-between bg-[#151C27]">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#C2A774]" />
            <span className="text-sm font-semibold text-white">Official Elevated Stay Transaction Receipt</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#C2A774] text-[#0A0D12] text-xs font-semibold hover:bg-[#DFCA9E] transition"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Download PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-white/[0.08]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* The Printable Document */}
        <div className="p-8 sm:p-10 overflow-y-auto bg-gradient-to-b from-[#0E131C] to-[#121824] text-white space-y-6">
          {/* Header */}
          <div className="flex justify-between items-start pb-6 border-b border-white/10">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <div className="w-9 h-9 rounded-xl overflow-hidden border border-[#D4AF37]/50 bg-[#0A0D12] p-1 flex items-center justify-center">
                  <img src="/logo-mark-transparent.png" alt="Elevated Stay Insignia" className="w-full h-full object-contain" />
                </div>
                <span className="text-lg font-bold tracking-wider text-white">ELEVATION <span className="text-[#E2C792]">STAY</span></span>
              </div>
              <p className="text-xs text-[#DFCA9E] font-medium">Residential & Hospitality · stay.com.ng</p>
              <p className="text-[11px] text-neutral-400 mt-1">Private Client Asset Operations · Lagos & Multi-Territory</p>
            </div>
            <div className="text-right">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                <CheckCircle2 className="w-3.5 h-3.5" />
                SETTLED & DISPATCHED
              </span>
              <p className="text-xs text-neutral-400 font-mono mt-2">Ref: {transaction.reference}</p>
              <p className="text-[11px] text-neutral-400 mt-0.5">{transaction.createdAt}</p>
            </div>
          </div>

          {/* Resident & Property Meta */}
          <div className="grid grid-cols-2 gap-6 p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] text-xs">
            <div>
              <span className="text-neutral-400 text-[11px] uppercase tracking-wider block mb-1">Billed To (Resident)</span>
              <p className="text-sm font-semibold text-white">{transaction.tenantName}</p>
              <p className="text-neutral-300 mt-0.5">Unit: {transaction.unitName}</p>
              <p className="text-neutral-400 text-[11px]">Compound ID: {transaction.compoundId}</p>
            </div>
            <div>
              <span className="text-neutral-400 text-[11px] uppercase tracking-wider block mb-1">Payment Method & Routing</span>
              <p className="text-neutral-300">Gateway: Paystack Automated Split</p>
              <p className="text-neutral-300">Channel: Direct NIP Bank Wire</p>
              <p className="text-neutral-400 font-mono text-[11px]">Audit Hash: SHA256-{(transaction.reference + "ES_SECURE").slice(0, 16)}</p>
            </div>
          </div>

          {/* Itemized Line Table */}
          <div className="border border-white/10 rounded-xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-white/[0.04] text-neutral-300 border-b border-white/10">
                <tr>
                  <th className="py-2.5 px-4 font-medium">Description</th>
                  <th className="py-2.5 px-4 font-medium">Designated Destination</th>
                  <th className="py-2.5 px-4 font-medium text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.05] text-neutral-200">
                {transaction.type === "base_rent" && (
                  <>
                    <tr>
                      <td className="py-3 px-4">
                        <span className="font-semibold text-white block">Annual Base Rent (Gross)</span>
                        <span className="text-[11px] text-neutral-400">Lease period 2026/2027</span>
                      </td>
                      <td className="py-3 px-4 text-neutral-300">
                        Direct Subaccount Payout (92.5%) + Mgmt Fee (7.5%)
                      </td>
                      <td className="py-3 px-4 text-right font-medium text-white">
                        {formatNaira(transaction.totalAmount)}
                      </td>
                    </tr>
                    <tr className="bg-white/[0.01] text-[11px] text-neutral-400">
                      <td className="py-2 px-4 pl-8">↳ Landlord Net Payout</td>
                      <td className="py-2 px-4 font-mono">{transaction.landlordSubaccount}</td>
                      <td className="py-2 px-4 text-right">{formatNaira(transaction.landlordSplitAmount)}</td>
                    </tr>
                    <tr className="bg-white/[0.01] text-[11px] text-neutral-400">
                      <td className="py-2 px-4 pl-8">↳ Elevated Stay Management Retainer</td>
                      <td className="py-2 px-4 font-mono">Elevation Treasury</td>
                      <td className="py-2 px-4 text-right">{formatNaira(transaction.managementSplitAmount)}</td>
                    </tr>
                  </>
                )}

                {transaction.type === "service_charge" && (
                  <tr>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-white block">Compound Annual Service Charge</span>
                      <span className="text-[11px] text-neutral-400">
                        100% Ring-fenced: Diesel generator, solar array, water treatment, communal security
                      </span>
                    </td>
                    <td className="py-3 px-4 text-[#DFCA9E] font-medium">
                      Compound Facility Escrow Account ({transaction.escrowAccount})
                    </td>
                    <td className="py-3 px-4 text-right font-medium text-white">
                      {formatNaira(transaction.totalAmount)}
                    </td>
                  </tr>
                )}
              </tbody>
              <tfoot className="bg-white/[0.05] border-t border-white/10 font-semibold text-white">
                <tr>
                  <td colSpan={2} className="py-3 px-4 text-right">Total Remittance Settled</td>
                  <td className="py-3 px-4 text-right text-base text-[#DFCA9E]">
                    {formatNaira(transaction.totalAmount)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Security & Verification Stamp */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/[0.08] text-[11px] text-neutral-400">
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 border-2 border-dashed border-[#C2A774]/50 rounded-lg flex flex-col items-center justify-center p-1 bg-[#C2A774]/5 text-center">
                <span className="text-[8px] font-mono text-[#DFCA9E]">SECURE QR</span>
                <span className="text-[9px] font-bold text-white mt-1">EST-VERIFIED</span>
              </div>
              <div>
                <p className="font-medium text-white">Cryptographically Signed & Timestamped</p>
                <p>Elevation Studio Asset Protection Protocol v2.4</p>
                <p className="text-neutral-400">All escrow disbursals audit-verified by independent quantity surveyors.</p>
              </div>
            </div>
            <div className="text-right font-mono text-[10px] text-neutral-400">
              <p>DOCUMENT ID: ES-DOC-{transaction.id.toUpperCase()}</p>
              <p>VERIFIED AT: STAY.COM.NG/VERIFY</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

