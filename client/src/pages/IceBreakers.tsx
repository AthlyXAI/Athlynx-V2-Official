import { useState } from "react";
import { Link } from "wouter";

const stats = [
  { icon: "🏒", value: "450K+", label: "Players" },
  { icon: "🏆", value: "3,200+", label: "Tournaments" },
  { icon: "🎓", value: "260+", label: "College Programs" },
  { icon: "💰", value: "$180M+", label: "NIL Deals" },
];

const features = [
  { icon: "🏒", title: "Showcase Tournaments", desc: "USHL, NAHL, Tier I & II showcases nationwide. Get in front of college coaches and pro scouts at the events that matter." },
  { icon: "⭐", title: "Elite Camps", desc: "NHL-affiliated development camps, goalie academies, and position-specific skill sessions. Train with the best." },
  { icon: "📊", title: "Player Rankings", desc: "National, regional, and state rankings updated weekly. Know where you stand among the top prospects in your class." },
  { icon: "📅", title: "Recruiting Calendar", desc: "Track every NCAA contact period, campus visit, and commitment deadline. Never miss a recruiting window." },
  { icon: "🤝", title: "NIL Marketplace", desc: "Hockey's fastest-growing NIL platform. Connect with brands, equipment sponsors, and regional businesses." },
  { icon: "🎬", title: "Highlight Reel Hub", desc: "Upload, share, and distribute your game film to coaches nationwide. Your tape is your resume." },
];

const TOURNAMENTS = [
  { name: "USA Hockey Nationals", location: "Buffalo, NY", date: "Apr 5-13, 2026", level: "Tier I", division: "16U / 18U", scouts: true },
  { name: "CCM/USA Hockey Select 15 Festival", location: "Lake Placid, NY", date: "Jul 20-26, 2026", level: "Elite", division: "15U", scouts: true },
  { name: "NAPHL Elite Showcase", location: "Blaine, MN", date: "Sep 12-14, 2026", level: "Tier II", division: "16U / 18U", scouts: true },
  { name: "Brick Invitational", location: "Marlton, NJ", date: "Jun 28-Jul 4, 2026", level: "Tier I", division: "14U", scouts: false },
  { name: "World Selects Invitational", location: "Rochester, NY", date: "Aug 1-7, 2026", level: "Elite", division: "15U / 16U", scouts: true },
  { name: "Midwest Elite Showcase", location: "Chicago, IL", date: "Oct 3-5, 2026", level: "Tier II", division: "All Ages", scouts: false },
];

const TOP_PROSPECTS = [
  { name: "Connor MacLeod", pos: "C", age: "17", team: "Chicago Steel (USHL)", gpa: "3.7", committed: "Michigan", xScore: 96 },
  { name: "Dmitri Volkov", pos: "D", age: "16", team: "Tri-City Storm (USHL)", gpa: "3.4", committed: null, xScore: 93 },
  { name: "Tyler Frost", pos: "LW", age: "17", team: "Sioux Falls Stampede", gpa: "3.8", committed: "Boston University", xScore: 91 },
  { name: "Jake Hartley", pos: "G", age: "16", team: "Indiana Ice (USHL)", gpa: "3.6", committed: null, xScore: 89 },
];

export default function IceBreakers() {
  const [activeTab, setActiveTab] = useState<"overview" | "tournaments" | "prospects" | "nil">("overview");

  return (
    <div className="min-h-screen bg-[#020c1a]">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#020c1a]/95 backdrop-blur border-b border-blue-950/30">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-gray-400 hover:text-white text-sm">← ATHLYNX</Link>
            <span className="text-gray-600">|</span>
            <div className="flex items-center gap-2">
              <span className="text-2xl">🏒</span>
              <div>
                <div className="text-xs text-cyan-400 font-bold tracking-widest">ICE BREAKERS</div>
                <div className="text-xs text-blue-400 tracking-wider">POWERED BY ATHLYNX</div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/signin" className="text-sm text-gray-300 hover:text-white">Log In</Link>
            <Link href="/signin" className="bg-cyan-700 hover:bg-cyan-600 text-white text-sm font-bold px-4 py-2 rounded-lg transition-colors">
              Sign Up Free
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src="/img-hockey-hero.jpg" alt="Hockey" className="w-full h-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#020c1a]/60 via-[#020c1a]/70 to-[#020c1a]" />
        </div>
        <div className="relative max-w-4xl mx-auto text-center py-24 px-4">
          <div className="inline-flex items-center gap-2 bg-cyan-950/60 border border-cyan-800/50 rounded-full px-4 py-1.5 mb-6">
            <span className="text-cyan-400 text-xs font-bold tracking-widest">ICE BREAKERS</span>
            <span className="bg-cyan-500 text-black text-xs font-bold px-2 py-0.5 rounded-full">POWERED BY ATHLYNX</span>
          </div>
          <h1 className="text-6xl md:text-7xl font-black text-white mb-4 leading-none">
            OWN<br /><span className="text-cyan-400">THE ICE</span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Showcases. Rankings. Recruiting. NIL. The complete hockey platform for players who want to go further.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signin" className="flex items-center justify-center gap-2 bg-cyan-700 hover:bg-cyan-600 text-white font-bold text-lg px-8 py-4 rounded-xl transition-all hover:scale-105">
              🏒 Find Showcases
            </Link>
            <button className="flex items-center justify-center gap-2 border border-cyan-500 text-cyan-400 hover:bg-cyan-500/10 font-bold text-lg px-8 py-4 rounded-xl transition-all">
              📊 View Rankings
            </button>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-10 px-4 border-y border-blue-950/30 bg-black/30">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-3xl mb-1">{s.icon}</div>
              <div className="text-3xl font-black text-cyan-400">{s.value}</div>
              <div className="text-gray-400 text-sm">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Tabs */}
      <div className="sticky top-[57px] z-40 bg-[#020c1a]/95 backdrop-blur border-b border-blue-950/30">
        <div className="max-w-6xl mx-auto px-4 flex gap-1 py-2 overflow-x-auto">
          {[
            { id: "overview", label: "🏒 Overview" },
            { id: "tournaments", label: "🏆 Tournaments" },
            { id: "prospects", label: "⭐ Top Prospects" },
            { id: "nil", label: "💰 NIL Deals" },
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`shrink-0 px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === tab.id ? "bg-cyan-700 text-white" : "text-gray-400 hover:text-white hover:bg-white/5"}`}>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-10">
        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-10">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {features.map((f) => (
                <div key={f.title} className="bg-blue-950/30 border border-blue-900/40 rounded-2xl p-5 hover:border-cyan-700/50 transition-all">
                  <div className="text-3xl mb-3">{f.icon}</div>
                  <h3 className="text-white font-black text-lg mb-2">{f.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
            <div className="bg-gradient-to-r from-cyan-900/30 to-blue-900/30 border border-cyan-800/40 rounded-2xl p-8 text-center">
              <h2 className="text-3xl font-black text-white mb-3">The Path to College Hockey Starts Here</h2>
              <p className="text-gray-300 mb-6 max-w-2xl mx-auto">From Mite to USHL — ATHLYNX Ice Breakers tracks your entire hockey journey and connects you with the coaches, scouts, and brands that can take you to the next level.</p>
              <Link href="/signin" className="inline-flex items-center gap-2 bg-cyan-600 hover:bg-cyan-500 text-white font-black px-8 py-4 rounded-xl text-lg transition-all hover:scale-105">
                🏒 Create Your Hockey Profile Free
              </Link>
            </div>
          </div>
        )}

        {/* Tournaments Tab */}
        {activeTab === "tournaments" && (
          <div className="space-y-4">
            <h2 className="text-2xl font-black text-white mb-6">🏆 2026 Tournament Calendar</h2>
            {TOURNAMENTS.map((t, i) => (
              <div key={i} className="bg-blue-950/30 border border-blue-900/40 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center gap-4 hover:border-cyan-700/40 transition-all">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-white font-black">{t.name}</h3>
                    {t.scouts && <span className="text-xs bg-green-700/40 text-green-400 border border-green-700/40 px-2 py-0.5 rounded-full font-bold">SCOUTS ATTENDING</span>}
                  </div>
                  <div className="flex flex-wrap gap-3 text-sm text-gray-400">
                    <span>📍 {t.location}</span>
                    <span>📅 {t.date}</span>
                    <span>🏒 {t.division}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${t.level === "Elite" ? "bg-yellow-700/40 text-yellow-400 border border-yellow-700/40" : t.level === "Tier I" ? "bg-cyan-700/40 text-cyan-400 border border-cyan-700/40" : "bg-blue-700/40 text-blue-400 border border-blue-700/40"}`}>{t.level}</span>
                  <Link href="/signin" className="bg-cyan-700 hover:bg-cyan-600 text-white text-sm font-bold px-4 py-2 rounded-lg transition-colors">Register →</Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Prospects Tab */}
        {activeTab === "prospects" && (
          <div className="space-y-4">
            <h2 className="text-2xl font-black text-white mb-6">⭐ Top Hockey Prospects — Class of 2027</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {TOP_PROSPECTS.map((p, i) => (
                <div key={i} className="bg-blue-950/30 border border-blue-900/40 rounded-2xl p-5 hover:border-cyan-700/40 transition-all">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-white font-black text-lg">{p.name}</h3>
                      <p className="text-gray-400 text-sm">{p.pos} · {p.team}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-cyan-400 font-black text-2xl">{p.xScore}</div>
                      <div className="text-gray-500 text-xs">X-Score</div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className="text-xs bg-blue-900/40 text-blue-300 border border-blue-800/40 px-2 py-1 rounded-lg">Age {p.age}</span>
                    <span className="text-xs bg-blue-900/40 text-blue-300 border border-blue-800/40 px-2 py-1 rounded-lg">GPA {p.gpa}</span>
                    {p.committed ? <span className="text-xs bg-green-900/40 text-green-400 border border-green-800/40 px-2 py-1 rounded-lg">✅ {p.committed}</span> : <span className="text-xs bg-yellow-900/40 text-yellow-400 border border-yellow-800/40 px-2 py-1 rounded-lg">Available</span>}
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-blue-950/30 border border-cyan-800/40 rounded-2xl p-6 text-center">
              <h3 className="text-white font-black text-xl mb-2">Are You a Scout or Coach?</h3>
              <p className="text-gray-400 text-sm mb-4">Access the full database of 450K+ hockey players. Filter by position, class year, GPA, and location.</p>
              <Link href="/signin" className="inline-flex items-center gap-2 bg-cyan-700 hover:bg-cyan-600 text-white font-bold px-6 py-3 rounded-xl transition-colors">Get Full Access →</Link>
            </div>
          </div>
        )}

        {/* NIL Tab */}
        {activeTab === "nil" && (
          <div className="space-y-5">
            <h2 className="text-2xl font-black text-white mb-6">💰 Hockey NIL Deals</h2>
            {[
              { brand: "Bauer Hockey", type: "Equipment Sponsor", value: "$5K–$25K/yr", req: "USHL/NCAA player, 5K+ followers", icon: "🏒" },
              { brand: "CCM Hockey", type: "Brand Ambassador", value: "$3K–$15K/yr", req: "Tier I/II player, active social", icon: "🥅" },
              { brand: "Pure Hockey", type: "Retail Partner", value: "$1K–$8K/yr", req: "Any level, regional market", icon: "🛒" },
              { brand: "Warrior Sports", type: "Stick Deal", value: "$2K–$10K/yr", req: "College/pro prospect", icon: "⚡" },
              { brand: "Local Rink Sponsors", type: "Appearance Deal", value: "$500–$3K/event", req: "Any level, local market", icon: "🏟️" },
              { brand: "Hockey Canada/USA", type: "National Team Partner", value: "$10K–$50K/yr", req: "National team athlete", icon: "🇺🇸" },
            ].map((deal, i) => (
              <div key={i} className="bg-blue-950/30 border border-blue-900/40 rounded-2xl p-5 flex items-center gap-4 hover:border-cyan-700/40 transition-all">
                <div className="text-3xl w-12 text-center shrink-0">{deal.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-white font-black">{deal.brand}</div>
                  <div className="text-gray-400 text-sm">{deal.type} · {deal.req}</div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-cyan-400 font-black">{deal.value}</div>
                  <Link href="/signin" className="text-xs text-cyan-500 hover:text-white transition-colors">Apply →</Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-blue-950/30 py-8 text-center">
        <p className="text-gray-600 text-sm">Ice Breakers · Powered by ATHLYNX AI · athlynx.ai/hockey · Iron Sharpens Iron — Proverbs 27:17</p>
      </footer>
    </div>
  );
}
