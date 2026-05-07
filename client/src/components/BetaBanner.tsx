import { useState } from "react";

export default function BetaBanner() {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="relative z-50 w-full bg-gradient-to-r from-[#0066ff] via-[#0052cc] to-[#00c2ff] text-white text-center py-2.5 px-4 flex items-center justify-center gap-3 shadow-lg">
      {/* Pulse dot */}
      <span className="relative flex h-2.5 w-2.5 flex-shrink-0">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white"></span>
      </span>

      <p className="text-sm font-semibold tracking-wide">
        <span className="font-black uppercase tracking-widest mr-2">⚡ BETA</span>
        AthlynXAI is in Beta — updated daily. Full launch{" "}
        <span className="font-black underline decoration-white/60">July 1, 2026</span>.
        {" "}Features may change. Your feedback shapes the platform.
      </p>

      {/* Dismiss */}
      <button
        onClick={() => setDismissed(true)}
        aria-label="Dismiss banner"
        className="ml-2 flex-shrink-0 text-white/70 hover:text-white transition-colors text-xl leading-none font-bold"
      >
        ×
      </button>
    </div>
  );
}
