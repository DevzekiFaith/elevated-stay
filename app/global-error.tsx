"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body className="bg-[#0A0D12] text-white flex min-h-screen items-center justify-center p-6">
        <div className="max-w-md w-full bg-[#151B24] border border-white/10 rounded-2xl p-8 text-center shadow-2xl">
          <h2 className="text-xl font-medium tracking-tight mb-3 text-white">System Notice</h2>
          <p className="text-sm text-neutral-400 mb-6">
            An unexpected architectural state occurred. The session has been securely logged.
          </p>
          <button
            onClick={() => reset()}
            className="w-full py-2.5 px-4 bg-[#C2A774] hover:bg-[#B39661] text-[#0A0D12] font-semibold text-sm rounded-xl transition"
          >
            Re-authenticate & Reload
          </button>
        </div>
      </body>
    </html>
  );
}

