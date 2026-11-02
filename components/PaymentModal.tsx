"use client";

import { useState } from "react";
import { Transaction } from "@/lib/types";
import { calculateTransactionSplit, formatNaira } from "@/lib/payment-split";
import { ShieldCheck, CheckCircle2, Lock, ArrowRight, Building, Wallet, X } from "lucide-react";
import { Logo } from "./Logo";
import { useToast } from "./ToastProvider";

interface PaymentModalProps {
  onClose: () => void;
  onPaymentSuccess: (transaction: Transaction) => void;
  residentName: string;
  unitName: string;
  compoundName: string;
  baseRent: number;
  serviceCharge: number;
  landlordSubaccount: string;
  compoundEscrowAccount: string;
}

export function PaymentModal({
  onClose,
  onPaymentSuccess,
  residentName,
  unitName,
  compoundName,
  baseRent,
  serviceCharge,
  landlordSubaccount,
  compoundEscrowAccount,
}: PaymentModalProps) {
  const { showToast } = useToast();
  const [paymentType, setPaymentType] = useState<"both" | "rent" | "service_charge">("both");
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentDone, setPaymentDone] = useState(false);
  const [createdTx, setCreatedTx] = useState<Transaction | null>(null);

  const currentBaseRent = paymentType === "service_charge" ? 0 : baseRent;
  const currentServiceCharge = paymentType === "rent" ? 0 : serviceCharge;

  const splitResult = calculateTransactionSplit({
    baseRent: currentBaseRent,
    serviceCharge: currentServiceCharge,
    managementFeePercent: 7.5,
  });

  const handleProcessRemittance = () => {
    setIsProcessing(true);

    setTimeout(() => {
      const txRef = `ELV-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
      const newTx: Transaction = {
        id: `tx-${Date.now()}`,
        reference: txRef,
        tenantId: "res-01",
        tenantName: residentName,
        unitId: "unt-01",
        unitName,
        compoundId: "cmp-01",
        type: paymentType === "service_charge" ? "service_charge" : "base_rent",
        totalAmount: splitResult.totalCharge,
        landlordSplitAmount: splitResult.destinationSummary.landlordSubaccountPayout,
        managementSplitAmount: splitResult.breakdown.baseRent.elevationShare,
        escrowSplitAmount: splitResult.destinationSummary.compoundEscrowDeposit,
        provider: "paystack",
        landlordSubaccount,
        escrowAccount: compoundEscrowAccount,
        status: "success",
        createdAt: new Date().toLocaleString("en-GB", { timeZone: "Africa/Lagos" }) + " WAT",
        channel: "bank_transfer",
      };

      setCreatedTx(newTx);
      setIsProcessing(false);
      setPaymentDone(true);
      onPaymentSuccess(newTx);

      showToast({
        title: "Split Remittance Settled",
        detail: `₦${splitResult.totalCharge.toLocaleString()} routed: 92.5% to Landlord, Service Charge to SC Escrow.`,
        type: "finance",
        actionUrl: "/landlord",
      });
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-lg bg-[#121722] border border-[#C2A774]/40 rounded-2xl shadow-2xl overflow-hidden text-left">
        {/* Header */}
        <div className="p-5 border-b border-white/[0.08] flex items-start justify-between bg-[#151C27]">
          <div className="space-y-2.5">
            <Logo size="sm" href="" />
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-[#C2A774]/10 text-[#C2A774] border border-[#C2A774]/20">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-white">Automated Split Remittance</h3>
                <p className="text-[11px] text-neutral-400 font-mono">Paystack / Flutterwave Subaccount Router</p>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-white p-1 rounded-lg hover:bg-white/[0.05]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {!paymentDone ? (
          <div className="p-6 space-y-5">
            {/* Payment Type Selection */}
            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-2">
                Select Invoice Scope
              </label>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setPaymentType("both")}
                  className={`py-2 px-3 rounded-xl border transition ${
                    paymentType === "both"
                      ? "bg-[#C2A774]/15 border-[#C2A774] text-[#DFCA9E] font-semibold"
                      : "bg-[#0E131C] border-white/10 text-neutral-400 hover:text-white"
                  }`}
                >
                  Full Package (Rent + Escrow)
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentType("rent")}
                  className={`py-2 px-3 rounded-xl border transition ${
                    paymentType === "rent"
                      ? "bg-[#C2A774]/15 border-[#C2A774] text-[#DFCA9E] font-semibold"
                      : "bg-[#0E131C] border-white/10 text-neutral-400 hover:text-white"
                  }`}
                >
                  Base Rent Only
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentType("service_charge")}
                  className={`py-2 px-3 rounded-xl border transition ${
                    paymentType === "service_charge"
                      ? "bg-[#C2A774]/15 border-[#C2A774] text-[#DFCA9E] font-semibold"
                      : "bg-[#0E131C] border-white/10 text-neutral-400 hover:text-white"
                  }`}
                >
                  Service Charge Only
                </button>
              </div>
            </div>

            {/* Split Architecture Readout */}
            <div className="p-4 rounded-xl bg-[#0B0F17] border border-white/[0.08] space-y-3">
              <div className="flex items-center justify-between text-xs text-neutral-400 pb-2 border-b border-white/[0.06]">
                <span>Transaction Split Architecture</span>
                <span className="font-mono text-[#DFCA9E]">Total: {formatNaira(splitResult.totalCharge)}</span>
              </div>

              {splitResult.destinationSummary.landlordSubaccountPayout > 0 && (
                <div className="flex items-start justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <Building className="w-3.5 h-3.5 text-[#C2A774]" />
                    <div>
                      <span className="text-white font-medium block">Landlord Direct Subaccount (92.5%)</span>
                      <span className="text-[11px] text-neutral-400 font-mono">Routing: {landlordSubaccount}</span>
                    </div>
                  </div>
                  <span className="font-semibold text-white">
                    {formatNaira(splitResult.destinationSummary.landlordSubaccountPayout)}
                  </span>
                </div>
              )}

              {splitResult.destinationSummary.compoundEscrowDeposit > 0 && (
                <div className="flex items-start justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <div>
                      <span className="text-white font-medium block">Compound Facility Escrow (100%)</span>
                      <span className="text-[11px] text-neutral-400 font-mono">
                        Account: {compoundEscrowAccount} (Diesel, Solar & Purity)
                      </span>
                    </div>
                  </div>
                  <span className="font-semibold text-[#DFCA9E]">
                    {formatNaira(splitResult.destinationSummary.compoundEscrowDeposit)}
                  </span>
                </div>
              )}

              <div className="flex items-start justify-between text-xs">
                <div className="flex items-center gap-2">
                  <Wallet className="w-3.5 h-3.5 text-[#DFCA9E]" />
                  <div>
                    <span className="text-white font-medium block">Elevated Stay Management Retainer</span>
                    <span className="text-[11px] text-neutral-400 font-mono">7.5% Asset Lifecycle Oversight Fee</span>
                  </div>
                </div>
                <span className="font-medium text-[#DFCA9E]">
                  {formatNaira(splitResult.destinationSummary.elevationStudioTreasury)}
                </span>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                disabled={isProcessing}
                onClick={handleProcessRemittance}
                className="w-full py-3.5 px-4 rounded-xl bg-[#D4AF37] hover:bg-[#E5C158] text-[#0A0D12] font-bold text-xs sm:text-sm shadow-md shadow-[#D4AF37]/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50 active:scale-98"
              >
                {isProcessing ? (
                  <span>Processing Remittance...</span>
                ) : (
                  <>
                    <span>Authorize {formatNaira(splitResult.totalCharge)}</span>
                    <ArrowRight className="w-4 h-4 text-[#0A0D12]" />
                  </>
                )}
              </button>
              <p className="text-[11px] text-neutral-400 text-center mt-2 font-mono">
                256-bit SSL encrypted · Automated subaccount split
              </p>
            </div>
          </div>
        ) : (
          <div className="p-8 text-center space-y-4">
            <div className="w-14 h-14 mx-auto rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/30 flex items-center justify-center text-[#DFCA9E]">
              <CheckCircle2 className="w-8 h-8 text-[#D4AF37]" />
            </div>
            <h4 className="text-lg font-bold text-white">Remittance Successfully Routed</h4>
            <p className="text-xs text-neutral-300 leading-relaxed max-w-sm mx-auto">
              Your payment of <strong className="text-[#DFCA9E]">{formatNaira(splitResult.totalCharge)}</strong> has been settled via Paystack Subaccount Split. Funds have been atomically deposited to the Landlord and Compound Facility Escrow.
            </p>

            <div className="p-3 rounded-xl bg-[#0C1017] border border-white/[0.06] text-xs font-mono text-neutral-400">
              Transaction Ref: {createdTx?.reference}
            </div>

            <div className="pt-2 flex items-center justify-center gap-3">
              <button
                onClick={onClose}
                className="py-2.5 px-6 rounded-xl bg-[#D4AF37] hover:bg-[#E5C158] text-[#0A0D12] text-xs font-bold shadow-md shadow-[#D4AF37]/20 transition active:scale-98"
              >
                View Official Receipt
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

