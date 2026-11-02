"use client";

import { useState } from "react";
import { MaintenanceTicket } from "@/lib/types";
import { Wrench, Camera, AlertTriangle, Upload, Check, X } from "lucide-react";
import { useToast } from "./ToastProvider";

interface MaintenanceTicketModalProps {
  onClose: () => void;
  onTicketCreated: (ticket: MaintenanceTicket) => void;
  unitName: string;
  compoundName: string;
  residentName: string;
}

export function MaintenanceTicketModal({
  onClose,
  onTicketCreated,
  unitName,
  compoundName,
  residentName,
}: MaintenanceTicketModalProps) {
  const { showToast } = useToast();
  const [category, setCategory] = useState<MaintenanceTicket["category"]>("HVAC & AC");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<MaintenanceTicket["priority"]>("routine");
  const [photoSelected, setPhotoSelected] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const newTicket: MaintenanceTicket = {
        id: `mnt-${Date.now()}`,
        unitId: "unt-01",
        unitName,
        compoundId: "cmp-01",
        compoundName,
        residentId: "res-01",
        residentName,
        category,
        title,
        description,
        priority,
        status: "reported",
        beforePhotoUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80",
        contractorPaidFromEscrow: true,
        reportedAt: new Date().toLocaleString("en-GB", { timeZone: "Africa/Lagos" }) + " WAT",
      };

      onTicketCreated(newTicket);
      setIsSubmitting(false);
      showToast({
        title: "Maintenance Work Order Dispatched",
        detail: `Ticket logged for ${category}. Certified contractor mobilized from escrow reserves.`,
        type: "maintenance",
        actionUrl: "/resident",
      });
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-lg bg-[#121722] border border-[#C2A774]/30 rounded-2xl p-6 sm:p-7 shadow-2xl text-left">
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.08] mb-5">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-[#C2A774]/10 text-[#C2A774] border border-[#C2A774]/20">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">Log Asset Maintenance Ticket</h3>
              <p className="text-[11px] text-neutral-400 font-mono">Contractor Dispatch · Compound Escrow</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-white p-1 rounded-lg hover:bg-white/[0.05]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-neutral-300 font-medium mb-1">Infrastructure System</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-3 py-2 bg-[#0C1017] border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#C2A774] transition"
              >
                <option value="HVAC & AC">HVAC & VRV Chiller Systems</option>
                <option value="Electrical & Inverter">Solar, Inverter & BMS</option>
                <option value="Plumbing & Borehole">Reverse Osmosis & Plumbing</option>
                <option value="Structural / Carpentry">Structural & Architectural</option>
                <option value="Access Control">Keycard, CCTV & Gate Pass</option>
              </select>
            </div>

            <div>
              <label className="block text-neutral-300 font-medium mb-1">Operational Urgency</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="w-full px-3 py-2 bg-[#0C1017] border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#C2A774] transition"
              >
                <option value="routine">Routine (Next 24h window)</option>
                <option value="high">High (Within 6 hours)</option>
                <option value="emergency">Emergency (Immediate dispatch)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-neutral-300 font-medium mb-1">Issue Summary</label>
            <input
              type="text"
              required
              placeholder="e.g. Living room AC condensation line dripping into tray"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#0C1017] border border-white/10 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:border-[#C2A774] transition"
            />
          </div>

          <div>
            <label className="block text-neutral-300 font-medium mb-1">Detailed Description</label>
            <textarea
              required
              rows={3}
              placeholder="Describe symptoms, noise, warning lights or affected zones..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#0C1017] border border-white/10 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:border-[#C2A774] transition"
            />
          </div>

          {/* Photo/Video Diagnostic Evidence Attachment */}
          <div>
            <label className="block text-neutral-300 font-medium mb-1 flex items-center gap-1.5">
              <Camera className="w-3.5 h-3.5 text-[#C2A774]" /> Diagnostic Evidence (Photo / Short Clip)
            </label>
            <div
              onClick={() => setPhotoSelected(!photoSelected)}
              className={`p-4 border-2 border-dashed rounded-xl cursor-pointer text-center transition ${
                photoSelected
                  ? "border-[#D4AF37]/50 bg-[#D4AF37]/15 text-[#DFCA9E]"
                  : "border-white/10 bg-[#0C1017] text-neutral-400 hover:border-[#D4AF37]/50"
              }`}
            >
              {photoSelected ? (
                <div className="flex items-center justify-center gap-2 text-xs">
                  <Check className="w-4 h-4 text-[#D4AF37]" />
                  <span>IMG_20261101_HVAC_Sensor.jpg attached (1.8MB)</span>
                </div>
              ) : (
                <div className="space-y-1">
                  <Upload className="w-5 h-5 mx-auto text-neutral-500" />
                  <p className="text-xs">Click to attach photo or camera snap</p>
                  <p className="text-[10px] text-neutral-500">Supports JPG, PNG, HEIC up to 25MB</p>
                </div>
              )}
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center gap-2.5">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:flex-1 py-3 px-4 bg-[#D4AF37] hover:bg-[#E5C158] text-[#0A0D12] font-bold text-xs rounded-xl shadow-md shadow-[#D4AF37]/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 active:scale-98"
            >
              {isSubmitting ? "Dispatching..." : "Submit Ticket"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto py-3 px-4 bg-white/[0.04] hover:bg-white/[0.08] text-neutral-300 text-xs font-medium rounded-xl border border-white/10 transition text-center"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

