import { useState } from "react";
import { Link } from "wouter";

const stats = [
  { icon: "🎾", value: "650K+", label: "Players" },
  { icon: "🏆", value: "7,000+", label: "Tournaments" },
  { icon: "🎓", value: "900+", label: "College Programs" },
  { icon: "💰", value: "$95M+", label: "NIL Deals" },
];

const features = [
  { icon: "🎾", title: "Tournament Finder", desc: "USTA, ITF, and college prep tournaments nationwide. Find the events that build your ranking and your recruiting profile." },
  { icon: "⭐", title: "Elite Showcases", desc: "USTA Nationals, Easter Bowl, Kalamazoo — the tournaments where college coaches make their top recruiting decisions." },
  { icon: "📊", title: "Rankings", desc: "USTA national and sectional rankings updated weekly. Know exactly where you stand in your age group and section." },
  { icon: "📅", title: "Recruiting Calendar", desc: "NCAA contact periods, official visit windows, and signing deadlines — all tracked in one place." },
  { icon: "🤝", title: "NIL Marketplace", desc: "Racket deals, apparel sponsors, and brand partnerships for college and elite junior tennis players." },
  { icon: "🎬", title: "Match Film", desc: "Share your match footage and highlight clips directly with college coaches. Your game tells the story." },
];

const TOURNAMENTS = [
  { name: "USTA Boys 18 & 16 Nationals", location: "Kalamazoo, MI", date: "Aug 8-16, 2026", level: "National", div: "Boys 16/18", scouts: true },
  { name: "Easter Bowl", location: "Indian Wells, CA", date: "Mar 28-Apr 5, 2026", level: "National", div: "All Ages", scouts: true },
  { name: "USTA Girls 18 & 16 Nationals", location: "San Diego, CA", date: "Aug 1-9, 2026", level: "National", div: "Girls 16/18", scouts: true },
  { name: "Orange Bowl", location: "Plantation, FL", date: "Dec 5-13, 2026", level: "International", div: "All Ages", scouts: true },
  { name: "USTA Spring Nationals", location: "Surprise, AZ", date: "Apr 18-26, 2026", level: "National", div: "All Ages", scouts: false },
  { name: "USTA National Clay Courts", location: "Tulsa, OK", date: "Jul 11-19, 2026", level: "National", div: "All Ages", scouts: true },
];

const TOP_PROSPECTS = [
  { name: "Alex Petrov", rank: "USTA #3", style: "Baseline", school: "Saddlebrook Academy", committed: "Stanford", xScore: 97 },
  { name: "Isabella Santos", rank: "USTA #5", style: "All-Court", school: "IMG Academy", committed: null, xScore: 95 },
  { name: "Ryan Park", rank: "USTA #8", style: "Serve & Volley", school: "Evert Tennis Academy", committed: "USC", xScore: 92 },
  { name: "Chloe Martin", rank: "USTA #11", style: "Baseline", school: "Bollettieri Academy", committed: null, xScore: 90 },
];

export default function RacketKings() {
  const [activeTab, setActiveTab] = useState<"overview" | "tournaments" | "prospects" | "nil">("overview");

  return (
    <div className="min-h-screen bg-[#001a0a]">
      <header className="sticky top-0 z-50 bg-[#001a0a]/95 backdrop-blur border-b border-green-950/30">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-gray-400 hover:text-white text-sm">← ATHLYNX</Link>
            <span className="text-gray-600">|</span>
            <div className="flex items-center gap-2">
              <span className="text-2xl">🎾</span>
              <div>
                <div className="text-xs text-green-400 font-bold tracking-widest">RACKET KINGS</div>
                <div className="text-xs text-lime-400 tracking-wider">POWERED BY ATHLYNX</div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/signin" className="text-sm text-gray-300 hover:text-white">Log In</Link>
            <Link href="/signin" className="bg-green-700 hover:bg-green-600 text-white text-sm font-bold px-4 py-2 rounded-lg transition-colors">Sign Up Free</Link>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src="/img-tennis-hero.jpg" alt="Tennis" className="w-full h-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#001a0a]/60 via-[#001a0a]/70 to-[#001a0a]" />
        </div>
        <div className="relative max-w-4xl mx-auto text-center py-24 px-4">
          <div className="inline-flex items-center gap-2 bg-green-950/60 border border-green-800/50 rounded-full px-4 py-1.5 mb-6">
            <span className="text-green-400 text-xs font-bold tracking-widest">RACKET KINGS</span>
            <span className="bg-green-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">POWERED BY ATHLYNX</span>
          </div>
          <h1 className="text-6xl md:text-7xl font-black text-white mb-4 leading-none">RULE<br /><span className="text-green-400">THE COURT</span></h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">Tournaments. Rankings. Recruiting. NIL. The complete tennis platform for players chasing college scholarships and pro dreams.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signin" className="flex items-center justify-center gap-2 bg-green-700 hover:bg-green-600 text-white font-bold text-lg px-8 py-4 rounded-xl transition-all hover:scale-105">🎾 Find Tournaments</Link>
            <button className="flex items-center justify-center gap-2 border border-green-500 text-green-400 hover:bg-green-500/10 font-bold text-lg px-8 py-4 rounded-xl transition-all">📊 View Rankings</button>
          </div>
        </div>
      </section>

      <section className="py-10 px-4 border-y border-green-950/30 bg-black/30">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-3xl mb-1">{s.icon}</div>
              <div className="text-3xl font-black text-green-400">{s.value}</div>
              <div className="text-gray-400 text-sm">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      <div className="sticky top-[57px] z-40 bg-[#001a0a]/95 backdrop-blur border-b border-green-950/30">
        <div className="max-w-6xl mx-auto px-4 flex gap-1 py-2 overflow-x-auto">
          {[{ id: "overview", label: "🎾 Overview" }, { id: "tournaments", label: "🏆 Tournaments" }, { id: "prospects", label: "⭐ Top Prospects" }, { id: "nil", label: "💰 NIL Deals" }].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`shrink-0 px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === tab.id ? "bg-green-700 text-white" : "text-gray-400 hover:text-white hover:bg-white/5"}`}>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-10">
        {activeTab === "overview" && (
          <div className="space-y-10">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {features.map((f) => (
                <div key={f.title} className="bg-green-950/20 border border-green-900/40 rounded-2xl p-5 hover:border-green-700/50 transition-all">
                  <div className="text-3xl mb-3">{f.icon}</div>
                  <h3 className="text-white font-black text-lg mb-2">{f.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
            <div className="bg-gradient-to-r from-green-900/30 to-lime-900/20 border border-green-800/40 rounded-2xl p-8 text-center">
              <h2 className="text-3xl font-black text-white mb-3">Your Path to College Tennis</h2>
              <p className="text-gray-300 mb-6 max-w-2xl mx-auto">Tennis is one of the most scholarship-rich sports in college athletics. ATHLYNX Racket Kings connects you with the tournaments, rankings, and coaches that can fund your education and your future.</p>
              <Link href="/signin" className="inline-flex items-center gap-2 bg-green-700 hover:bg-green-600 text-white font-black px-8 py-4 rounded-xl text-lg transition-all hover:scale-105">🎾 Create Your Tennis Profile Free</Link>
            </div>
          </div>
        )}

        {activeTab === "tournaments" && (
          <div className="space-y-4">
            <h2 className="text-2xl font-black text-white mb-6">🏆 2026 Tournament Calendar</h2>
            {TOURNAMENTS.map((t, i) => (
              <div key={i} className="bg-green-950/20 border border-green-900/40 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center gap-4 hover:border-green-700/40 transition-all">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-white font-black">{t.name}</h3>
                    {t.scouts && <span className="text-xs bg-green-700/40 text-green-400 border border-green-700/40 px-2 py-0.5 rounded-full font-bold">SCOUTS ATTENDING</span>}
                  </div>
                  <div className="flex flex-wrap gap-3 text-sm text-gray-400">
                    <span>📍 {t.location}</span><span>📅 {t.date}</span><span>🎾 {t.div}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${t.level === "International" ? "bg-yellow-700/40 text-yellow-400 border border-yellow-700/40" : t.level === "National" ? "bg-green-700/40 text-green-400 border border-green-700/40" : "bg-blue-700/40 text-blue-400 border border-blue-700/40"}`}>{t.level}</span>
                  <Link href="/signin" className="bg-green-700 hover:bg-green-600 text-white text-sm font-bold px-4 py-2 rounded-lg transition-colors">Register →</Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "prospects" && (
          <div className="space-y-4">
            <h2 className="text-2xl font-black text-white mb-6">⭐ Top Tennis Prospects — Class of 2027</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {TOP_PROSPECTS.map((p, i) => (
                <div key={i} className="bg-green-950/20 border border-green-900/40 rounded-2xl p-5 hover:border-green-700/40 transition-all">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-white font-black text-lg">{p.name}</h3>
                      <p className="text-gray-400 text-sm">{p.style} · {p.school}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-green-400 font-black text-2xl">{p.xScore}</div>
                      <div className="text-gray-500 text-xs">X-Score</div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className="text-xs bg-green-900/40 text-green-300 border border-green-800/40 px-2 py-1 rounded-lg">{p.rank}</span>
                    {p.committed ? <span className="text-xs bg-green-900/40 text-green-400 border border-green-800/40 px-2 py-1 rounded-lg">✅ {p.committed}</span> : <span className="text-xs bg-yellow-900/40 text-yellow-400 border border-yellow-800/40 px-2 py-1 rounded-lg">Available</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "nil" && (
          <div className="space-y-5">
            <h2 className="text-2xl font-black text-white mb-6">💰 Tennis NIL Deals</h2>
            {[
              { brand: "Wilson Tennis", type: "Racket Sponsor", value: "$3K–$25K/yr", req: "College or elite junior player", icon: "🎾" },
              { brand: "Head Tennis", type: "Equipment Deal", value: "$2K–$20K/yr", req: "D1/D2 college player", icon: "🏆" },
              { brand: "Babolat", type: "String/Racket Deal", value: "$1K–$15K/yr", req: "Any college level", icon: "🎾" },
              { brand: "Nike Tennis", type: "Apparel Ambassador", value: "$3K–$30K/yr", req: "D1 or ranked junior", icon: "✔️" },
              { brand: "Tennis Warehouse", type: "Retail Partner", value: "$500–$5K/yr", req: "Any level, social media presence", icon: "🛒" },
            ].map((deal, i) => (
              <div key={i} className="bg-green-950/20 border border-green-900/40 rounded-2xl p-5 flex items-center gap-4 hover:border-green-700/40 transition-all">
                <div className="text-3xl w-12 text-center shrink-0">{deal.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-white font-black">{deal.brand}</div>
                  <div className="text-gray-400 text-sm">{deal.type} · {deal.req}</div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-green-400 font-black">{deal.value}</div>
                  <Link href="/signin" className="text-xs text-green-400 hover:text-white transition-colors">Apply →</Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <footer className="border-t border-green-950/30 py-8 text-center">
        <p className="text-gray-600 text-sm">Racket Kings · Powered by ATHLYNX AI · athlynx.ai/tennis · Iron Sharpens Iron — Proverbs 27:17</p>
      </footer>
    </div>
  );
}
