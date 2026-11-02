import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0A0D12] text-white flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md w-full p-8 rounded-2xl bg-[#121722] border border-white/10 shadow-2xl space-y-4">
        <div className="w-10 h-10 rounded-xl bg-[#C2A774]/20 border border-[#C2A774]/40 flex items-center justify-center mx-auto text-[#DFCA9E] font-bold">
          404
        </div>
        <h2 className="text-xl font-bold tracking-tight text-white">Residence Record Not Found</h2>
        <p className="text-xs text-neutral-400 leading-relaxed">
          The requested asset endpoint does not exist or has been privatized under Elevated Stay confidential protocol.
        </p>
        <Link
          href="/"
          className="inline-block py-2.5 px-6 rounded-xl bg-[#C2A774] text-[#0A0D12] font-semibold text-xs hover:bg-[#DFCA9E] transition"
        >
          Return to Public Vision
        </Link>
      </div>
    </div>
  );
}

