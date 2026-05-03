import { useState } from "react";
import MobileBottomNav from '@/components/MobileBottomNav'
import { Link } from "wouter";

const stats = [
  { icon: "🤼", value: "280K+", label: "Wrestlers" },
  { icon: "🏆", value: "4,500+", label: "Tournaments" },
  { icon: "🎓", value: "350+", label: "College Programs" },
  { icon: "💰", value: "$65M+", label: "NIL Deals" },
];

const features = [
  { icon: "🤼", title: "Tournament Finder", desc: "NHSCA, Fargo Nationals, state championships — find every tournament on your path to a college scholarship." },
  { icon: "⭐", title: "Elite Showcases", desc: "Cadet and Junior Nationals, Super 32, Who's Number One — the events where college coaches make their decisions." },
  { icon: "📊", title: "Rankings", desc: "National and state rankings by weight class and style. Know exactly where you rank among the best in the country." },
  { icon: "📅", title: "Recruiting Calendar", desc: "NCAA contact periods, official visits, and signing windows — all tracked so you never miss a recruiting opportunity." },
  { icon: "🤝", title: "NIL Marketplace", desc: "Wrestling gear sponsors, apparel deals, and brand partnerships for college and elite club wrestlers." },
  { icon: "🎬", title: "Match Film", desc: "Share your match film and highlight clips directly with college coaches. Your wrestling speaks for itself." },
];

const TOURNAMENTS = [
  { name: "NHSCA National Duals", location: "Virginia Beach, VA", date: "Mar 14-15, 2026", level: "National", div: "HS", scouts: true },
  { name: "Fargo Nationals", location: "Fargo, ND", date: "Jul 13-19, 2026", level: "National", div: "Cadet/Junior", scouts: true },
  { name: "Super 32 Challenge", location: "Greensboro, NC", date: "Oct 24-25, 2026", level: "Elite", div: "HS", scouts: true },
  { name: "Who's Number One", location: "Bethlehem, PA", date: "Sep 26, 2026", level: "Elite", div: "HS", scouts: true },
  { name: "Beast of the East", location: "Bethlehem, PA", date: "Dec 26-27, 2026", level: "National", div: "HS", scouts: false },
  { name: "FloNationals", location: "Cedar Falls, IA", date: "Jun 14-16, 2026", level: "National", div: "HS", scouts: true },
];

const TOP_PROSPECTS = [
  { name: "Cael Thompson", wt: "157", style: "Freestyle", school: "Blair Academy", record: "42-0", committed: "Penn State", xScore: 98 },
  { name: "Marcus Rivera", wt: "133", style: "Both", school: "St. Edward HS", record: "38-1", committed: null, xScore: 95 },
  { name: "Tyler Hawkins", wt: "184", style: "Greco-Roman", school: "Lehigh Valley WC", record: "35-2", committed: "Ohio State", xScore: 93 },
  { name: "Darius Cole", wt: "125", style: "Freestyle", school: "Blair Academy", record: "40-0", committed: null, xScore: 91 },
];

export default function MatWarriors() {
  const [activeTab, setActiveTab] = useState<"overview" | "tournaments" | "prospects" | "nil">("overview");

  return (
    <div className="min-h-screen bg-[#0a0500]">
      <header className="sticky top-0 z-50 bg-[#0a0500]/95 backdrop-blur border-b border-red-950/30">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-gray-400 hover:text-white text-sm">← ATHLYNX</Link>
            <span className="text-gray-600">|</span>
            <div className="flex items-center gap-2">
              <span className="text-2xl">🤼</span>
              <div>
                <div className="text-xs text-red-400 font-bold tracking-widest">MAT WARRIORS</div>
                <div className="text-xs text-orange-400 tracking-wider">POWERED BY ATHLYNX</div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/signin" className="text-sm text-gray-300 hover:text-white">Log In</Link>
            <Link href="/signup" className="bg-red-700 hover:bg-red-600 text-white text-sm font-bold px-4 py-2 rounded-lg transition-colors">Sign Up Free</Link>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src="/img-wrestling-hero.jpg" alt="Wrestling" className="w-full h-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0500]/60 via-[#0a0500]/70 to-[#0a0500]" />
        </div>
        <div className="relative max-w-4xl mx-auto text-center py-24 px-4">
          <div className="inline-flex items-center gap-2 bg-red-950/60 border border-red-800/50 rounded-full px-4 py-1.5 mb-6">
            <span className="text-red-400 text-xs font-bold tracking-widest">MAT WARRIORS</span>
            <span className="bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">POWERED BY ATHLYNX</span>
          </div>
          <h1 className="text-6xl md:text-7xl font-black text-white mb-4 leading-none">DOMINATE<br /><span className="text-red-400">THE MAT</span></h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">Tournaments. Rankings. Recruiting. NIL. The complete wrestling platform for athletes who refuse to lose.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signin" className="flex items-center justify-center gap-2 bg-red-700 hover:bg-red-600 text-white font-bold text-lg px-8 py-4 rounded-xl transition-all hover:scale-105">🤼 Find Tournaments</Link>
            <button className="flex items-center justify-center gap-2 border border-red-500 text-red-400 hover:bg-red-500/10 font-bold text-lg px-8 py-4 rounded-xl transition-all">📊 View Rankings</button>
          </div>
        </div>
      </section>

      <section className="py-10 px-4 border-y border-red-950/30 bg-black/30">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-3xl mb-1">{s.icon}</div>
              <div className="text-3xl font-black text-red-400">{s.value}</div>
              <div className="text-gray-400 text-sm">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      <div className="sticky top-[57px] z-40 bg-[#0a0500]/95 backdrop-blur border-b border-red-950/30">
        <div className="max-w-6xl mx-auto px-4 flex gap-1 py-2 overflow-x-auto">
          {[{ id: "overview", label: "🤼 Overview" }, { id: "tournaments", label: "🏆 Tournaments" }, { id: "prospects", label: "⭐ Top Prospects" }, { id: "nil", label: "💰 NIL Deals" }].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`shrink-0 px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === tab.id ? "bg-red-700 text-white" : "text-gray-400 hover:text-white hover:bg-white/5"}`}>
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
                <div key={f.title} className="bg-red-950/20 border border-red-900/40 rounded-2xl p-5 hover:border-red-700/50 transition-all">
                  <div className="text-3xl mb-3">{f.icon}</div>
                  <h3 className="text-white font-black text-lg mb-2">{f.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
            <div className="bg-gradient-to-r from-red-900/30 to-orange-900/20 border border-red-800/40 rounded-2xl p-8 text-center">
              <h2 className="text-3xl font-black text-white mb-3">Warriors Are Made on the Mat</h2>
              <p className="text-gray-300 mb-6 max-w-2xl mx-auto">Wrestling builds champions — in sport and in life. ATHLYNX Mat Warriors connects you with the tournaments, coaches, and opportunities that take your wrestling to the next level.</p>
              <Link href="/signup" className="inline-flex items-center gap-2 bg-red-700 hover:bg-red-600 text-white font-black px-8 py-4 rounded-xl text-lg transition-all hover:scale-105">🤼 Create Your Wrestling Profile Free</Link>
            </div>
          </div>
        )}

        {activeTab === "tournaments" && (
          <div className="space-y-4">
            <h2 className="text-2xl font-black text-white mb-6">🏆 2026 Tournament Calendar</h2>
            {TOURNAMENTS.map((t, i) => (
              <div key={i} className="bg-red-950/20 border border-red-900/40 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center gap-4 hover:border-red-700/40 transition-all">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-white font-black">{t.name}</h3>
                    {t.scouts && <span className="text-xs bg-green-700/40 text-green-400 border border-green-700/40 px-2 py-0.5 rounded-full font-bold">SCOUTS ATTENDING</span>}
                  </div>
                  <div className="flex flex-wrap gap-3 text-sm text-gray-400">
                    <span>📍 {t.location}</span><span>📅 {t.date}</span><span>🤼 {t.div}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${t.level === "Elite" ? "bg-yellow-700/40 text-yellow-400 border border-yellow-700/40" : "bg-red-700/40 text-red-400 border border-red-700/40"}`}>{t.level}</span>
                  <Link href="/signin" className="bg-red-700 hover:bg-red-600 text-white text-sm font-bold px-4 py-2 rounded-lg transition-colors">Register →</Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "prospects" && (
          <div className="space-y-4">
            <h2 className="text-2xl font-black text-white mb-6">⭐ Top Wrestling Prospects — Class of 2027</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {TOP_PROSPECTS.map((p, i) => (
                <div key={i} className="bg-red-950/20 border border-red-900/40 rounded-2xl p-5 hover:border-red-700/40 transition-all">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-white font-black text-lg">{p.name}</h3>
                      <p className="text-gray-400 text-sm">{p.wt} lbs · {p.style} · {p.school}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-red-400 font-black text-2xl">{p.xScore}</div>
                      <div className="text-gray-500 text-xs">X-Score</div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className="text-xs bg-red-900/40 text-red-300 border border-red-800/40 px-2 py-1 rounded-lg">Record: {p.record}</span>
                    {p.committed ? <span className="text-xs bg-green-900/40 text-green-400 border border-green-800/40 px-2 py-1 rounded-lg">✅ {p.committed}</span> : <span className="text-xs bg-yellow-900/40 text-yellow-400 border border-yellow-800/40 px-2 py-1 rounded-lg">Available</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "nil" && (
          <div className="space-y-5">
            <h2 className="text-2xl font-black text-white mb-6">💰 Wrestling NIL Deals</h2>
            {[
              { brand: "Cliff Keen Athletics", type: "Gear Sponsor", value: "$1K–$10K/yr", req: "College wrestler", icon: "🤼" },
              { brand: "Adidas Wrestling", type: "Apparel Deal", value: "$2K–$15K/yr", req: "D1/D2 wrestler", icon: "👟" },
              { brand: "Asics Wrestling", type: "Shoe Sponsor", value: "$1K–$8K/yr", req: "Any college level", icon: "👟" },
              { brand: "FloWrestling", type: "Content Partner", value: "$500–$5K/yr", req: "Any level, social media presence", icon: "🎬" },
              { brand: "Local Gyms & Clubs", type: "Coaching Clinics", value: "$200–$2K/event", req: "Any level", icon: "🏋️" },
            ].map((deal, i) => (
              <div key={i} className="bg-red-950/20 border border-red-900/40 rounded-2xl p-5 flex items-center gap-4 hover:border-red-700/40 transition-all">
                <div className="text-3xl w-12 text-center shrink-0">{deal.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-white font-black">{deal.brand}</div>
                  <div className="text-gray-400 text-sm">{deal.type} · {deal.req}</div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-red-400 font-black">{deal.value}</div>
                  <Link href="/signin" className="text-xs text-red-400 hover:text-white transition-colors">Apply →</Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <footer className="border-t border-red-950/30 py-8 text-center">
        <p className="text-gray-600 text-sm">Mat Warriors · Powered by ATHLYNX AI · athlynx.ai/wrestling · Iron Sharpens Iron — Proverbs 27:17</p>
      </footer>
      <MobileBottomNav />
    </div>
  );
}
