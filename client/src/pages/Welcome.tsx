/**
 * Welcome — /welcome
 * Public teaser page. Same dark blue look as the platform.
 * Cookie crumb of what's inside. No fluff.
 * Unauthenticated visitors from LinkedIn land here.
 */
import { Link } from "wouter";

const FEATURES = [
  { icon: "🏆", label: "NIL Deals" },
  { icon: "🎓", label: "AI Recruiting" },
  { icon: "🔄", label: "Transfer Portal" },
  { icon: "🏋️", label: "AI Training" },
  { icon: "💰", label: "Brand Deals" },
  { icon: "📊", label: "Athlete Profile" },
];

const STATS = [
  { value: "$2.5B+", label: "NIL Market" },
  { value: "520K+", label: "NCAA Athletes" },
  { value: "50+", label: "Platform Apps" },
  { value: "FREE", label: "7-Day Trial" },
];

export default function Welcome() {
  return (
    <div className="min-h-screen bg-[#040c1a] text-white flex flex-col">

      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <img src="/athlynx-icon.png" alt="ATHLYNX" className="w-9 h-9 rounded-xl" />
          <div>
            <div className="text-white font-black text-lg leading-none">ATHLYNX</div>
            <div className="text-[#00c2ff] text-[10px] tracking-widest leading-none">THE ATHLETE'S PLAYBOOK</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/signin">
            <button className="text-white/60 hover:text-white text-sm font-semibold transition-colors">
              Sign In
            </button>
          </Link>
          <Link href="/signup">
            <button className="bg-[#00c2ff] hover:bg-[#00a8e0] text-black font-black text-sm px-5 py-2 rounded-full transition-all">
              Join Free
            </button>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-16 text-center max-w-2xl mx-auto w-full">

        {/* Live badge */}
        <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/30 rounded-full px-4 py-1.5 mb-8">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-green-400 text-xs font-black tracking-widest uppercase">Now Live — athlynx.ai</span>
        </div>

        {/* Headline */}
        <h1 className="text-5xl sm:text-6xl font-black text-white mb-4 leading-tight">
          The Platform<br />
          <span className="text-[#00c2ff]">Built For You.</span>
        </h1>

        <p className="text-white/50 text-lg mb-10 max-w-md">
          Every sport. Every level. Youth to Pro to Retired.<br />
          One platform. Everything you need.
        </p>

        {/* Feature grid — cookie crumb */}
        <div className="grid grid-cols-3 gap-3 mb-10 w-full max-w-sm">
          {FEATURES.map((f) => (
            <div key={f.label} className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
              <div className="text-2xl mb-1">{f.icon}</div>
              <div className="text-white text-xs font-bold">{f.label}</div>
            </div>
          ))}
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-4 gap-3 mb-10 w-full max-w-sm">
          {STATS.map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-[#00c2ff] font-black text-lg leading-none">{s.value}</div>
              <div className="text-white/40 text-[10px] mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-3 w-full max-w-sm">
          <Link href="/signup" className="flex-1">
            <button className="w-full bg-[#00c2ff] hover:bg-[#00a8e0] text-black font-black py-4 rounded-2xl text-base transition-all shadow-lg shadow-[#00c2ff]/20">
              Join Free — 7 Days
            </button>
          </Link>
          <a href="mailto:cdozier14@athlynx.ai?subject=Investor Deck Request" className="flex-1">
            <button className="w-full bg-white/5 hover:bg-white/10 border border-white/20 text-white font-bold py-4 rounded-2xl text-base transition-all">
              Request Investor Deck
            </button>
          </a>
        </div>

        <p className="text-white/20 text-xs mt-6">
          No credit card required · cdozier14@athlynx.ai · Houston, TX
        </p>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 px-6 py-4 flex items-center justify-between">
        <span className="text-white/30 text-xs">© 2026 Dozier Holdings Group · ATHLYNX AI</span>
        <span className="text-white/30 text-xs">Iron Sharpens Iron — Proverbs 27:17</span>
      </footer>

    </div>
  );
}
