import { useState } from "react";
import MobileBottomNav from '@/components/MobileBottomNav'
import { Link } from "wouter";

const stats = [
  { icon: "🏐", value: "1.2M+", label: "Players" },
  { icon: "🏆", value: "12,000+", label: "Tournaments" },
  { icon: "🎓", value: "1,000+", label: "College Programs" },
  { icon: "💰", value: "$240M+", label: "NIL Deals" },
];

const features = [
  { icon: "🏐", title: "Club Tournaments", desc: "USAV, AAU, and independent club tournaments nationwide. Beach and indoor. Find your next competition." },
  { icon: "⭐", title: "Elite Showcases", desc: "AVCA, Nike, Under Armour showcases where college coaches come to recruit. Be on their radar." },
  { icon: "📊", title: "Player Rankings", desc: "National and regional rankings for indoor and beach. Updated weekly throughout the season." },
  { icon: "📅", title: "Recruiting Calendar", desc: "NCAA contact periods, campus visits, commitment deadlines — all in one place. Stay ahead of the process." },
  { icon: "🤝", title: "NIL Marketplace", desc: "Volleyball's fastest-growing NIL platform. Equipment deals, apparel sponsors, and brand partnerships." },
  { icon: "🎬", title: "Film & Highlights", desc: "Share your match film and highlight clips directly with college coaches. Your tape does the talking." },
];

const TOURNAMENTS = [
  { name: "USAV Junior National Championships", location: "Columbus, OH", date: "Jun 24-Jul 4, 2026", level: "National", division: "14U-18U", scouts: true },
  { name: "AAU Junior National Volleyball", location: "Orlando, FL", date: "Jul 5-12, 2026", level: "National", division: "12U-18U", scouts: true },
  { name: "Nike Volleyball Festival", location: "Indianapolis, IN", date: "Apr 18-19, 2026", level: "Elite", division: "17U/18U", scouts: true },
  { name: "AVCA Collegiate Showcase", location: "Louisville, KY", date: "Dec 12-14, 2026", level: "Elite", division: "18U", scouts: true },
  { name: "Lone Star Classic", location: "Dallas, TX", date: "Mar 7-8, 2026", level: "Regional", division: "All Ages", scouts: false },
  { name: "Beach Nationals", location: "Huntington Beach, CA", date: "Jul 18-20, 2026", level: "National", division: "16U-18U", scouts: true },
];

const TOP_PROSPECTS = [
  { name: "Aaliyah Torres", pos: "OH", ht: "6'1\"", team: "Mizuno Long Beach", gpa: "3.9", committed: "Stanford", xScore: 97 },
  { name: "Madison Chen", pos: "S", ht: "5'11\"", team: "Chicago Adversity", gpa: "3.8", committed: null, xScore: 94 },
  { name: "Brianna Williams", pos: "MB", ht: "6'3\"", team: "Houston Skyline", gpa: "3.6", committed: "Texas", xScore: 92 },
  { name: "Sofia Reyes", pos: "L", ht: "5'7\"", team: "SoCal VBC", gpa: "4.0", committed: null, xScore: 90 },
];

export default function NetSetters() {
  const [activeTab, setActiveTab] = useState<"overview" | "tournaments" | "prospects" | "nil">("overview");

  return (
    <div className="min-h-screen bg-[#0a0020]">
      <header className="sticky top-0 z-50 bg-[#0a0020]/95 backdrop-blur border-b border-purple-950/30">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-gray-400 hover:text-white text-sm">← ATHLYNX</Link>
            <span className="text-gray-600">|</span>
            <div className="flex items-center gap-2">
              <span className="text-2xl">🏐</span>
              <div>
                <div className="text-xs text-purple-400 font-bold tracking-widest">NET SETTERS</div>
                <div className="text-xs text-pink-400 tracking-wider">POWERED BY ATHLYNX</div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/signin" className="text-sm text-gray-300 hover:text-white">Log In</Link>
            <Link href="/signup" className="bg-purple-700 hover:bg-purple-600 text-white text-sm font-bold px-4 py-2 rounded-lg transition-colors">Sign Up Free</Link>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src="/img-volleyball-hero.jpg" alt="Volleyball" className="w-full h-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0020]/60 via-[#0a0020]/70 to-[#0a0020]" />
        </div>
        <div className="relative max-w-4xl mx-auto text-center py-24 px-4">
          <div className="inline-flex items-center gap-2 bg-purple-950/60 border border-purple-800/50 rounded-full px-4 py-1.5 mb-6">
            <span className="text-purple-400 text-xs font-bold tracking-widest">NET SETTERS</span>
            <span className="bg-purple-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">POWERED BY ATHLYNX</span>
          </div>
          <h1 className="text-6xl md:text-7xl font-black text-white mb-4 leading-none">RULE<br /><span className="text-purple-400">THE NET</span></h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">Club Tournaments. Elite Showcases. Rankings. NIL. The complete volleyball platform for players chasing the next level.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signin" className="flex items-center justify-center gap-2 bg-purple-700 hover:bg-purple-600 text-white font-bold text-lg px-8 py-4 rounded-xl transition-all hover:scale-105">🏐 Find Tournaments</Link>
            <button className="flex items-center justify-center gap-2 border border-purple-500 text-purple-400 hover:bg-purple-500/10 font-bold text-lg px-8 py-4 rounded-xl transition-all">📊 View Rankings</button>
          </div>
        </div>
      </section>

      <section className="py-10 px-4 border-y border-purple-950/30 bg-black/30">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-3xl mb-1">{s.icon}</div>
              <div className="text-3xl font-black text-purple-400">{s.value}</div>
              <div className="text-gray-400 text-sm">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      <div className="sticky top-[57px] z-40 bg-[#0a0020]/95 backdrop-blur border-b border-purple-950/30">
        <div className="max-w-6xl mx-auto px-4 flex gap-1 py-2 overflow-x-auto">
          {[{ id: "overview", label: "🏐 Overview" }, { id: "tournaments", label: "🏆 Tournaments" }, { id: "prospects", label: "⭐ Top Prospects" }, { id: "nil", label: "💰 NIL Deals" }].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`shrink-0 px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === tab.id ? "bg-purple-700 text-white" : "text-gray-400 hover:text-white hover:bg-white/5"}`}>
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
                <div key={f.title} className="bg-purple-950/20 border border-purple-900/40 rounded-2xl p-5 hover:border-purple-700/50 transition-all">
                  <div className="text-3xl mb-3">{f.icon}</div>
                  <h3 className="text-white font-black text-lg mb-2">{f.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
            <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/20 border border-purple-800/40 rounded-2xl p-8 text-center">
              <h2 className="text-3xl font-black text-white mb-3">Your Volleyball Journey Starts Here</h2>
              <p className="text-gray-300 mb-6 max-w-2xl mx-auto">From 12U club to D1 scholarship — ATHLYNX Net Setters tracks your entire volleyball career and connects you with coaches, scouts, and brands that can elevate your game.</p>
              <Link href="/signup" className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white font-black px-8 py-4 rounded-xl text-lg transition-all hover:scale-105">🏐 Create Your Volleyball Profile Free</Link>
            </div>
          </div>
        )}

        {activeTab === "tournaments" && (
          <div className="space-y-4">
            <h2 className="text-2xl font-black text-white mb-6">🏆 2026 Tournament Calendar</h2>
            {TOURNAMENTS.map((t, i) => (
              <div key={i} className="bg-purple-950/20 border border-purple-900/40 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center gap-4 hover:border-purple-700/40 transition-all">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-white font-black">{t.name}</h3>
                    {t.scouts && <span className="text-xs bg-green-700/40 text-green-400 border border-green-700/40 px-2 py-0.5 rounded-full font-bold">SCOUTS ATTENDING</span>}
                  </div>
                  <div className="flex flex-wrap gap-3 text-sm text-gray-400">
                    <span>📍 {t.location}</span><span>📅 {t.date}</span><span>🏐 {t.division}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${t.level === "Elite" ? "bg-yellow-700/40 text-yellow-400 border border-yellow-700/40" : t.level === "National" ? "bg-purple-700/40 text-purple-400 border border-purple-700/40" : "bg-blue-700/40 text-blue-400 border border-blue-700/40"}`}>{t.level}</span>
                  <Link href="/signin" className="bg-purple-700 hover:bg-purple-600 text-white text-sm font-bold px-4 py-2 rounded-lg transition-colors">Register →</Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "prospects" && (
          <div className="space-y-4">
            <h2 className="text-2xl font-black text-white mb-6">⭐ Top Volleyball Prospects — Class of 2027</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {TOP_PROSPECTS.map((p, i) => (
                <div key={i} className="bg-purple-950/20 border border-purple-900/40 rounded-2xl p-5 hover:border-purple-700/40 transition-all">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-white font-black text-lg">{p.name}</h3>
                      <p className="text-gray-400 text-sm">{p.pos} · {p.ht} · {p.team}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-purple-400 font-black text-2xl">{p.xScore}</div>
                      <div className="text-gray-500 text-xs">X-Score</div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className="text-xs bg-purple-900/40 text-purple-300 border border-purple-800/40 px-2 py-1 rounded-lg">GPA {p.gpa}</span>
                    {p.committed ? <span className="text-xs bg-green-900/40 text-green-400 border border-green-800/40 px-2 py-1 rounded-lg">✅ {p.committed}</span> : <span className="text-xs bg-yellow-900/40 text-yellow-400 border border-yellow-800/40 px-2 py-1 rounded-lg">Available</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "nil" && (
          <div className="space-y-5">
            <h2 className="text-2xl font-black text-white mb-6">💰 Volleyball NIL Deals</h2>
            {[
              { brand: "Mizuno Volleyball", type: "Equipment Sponsor", value: "$3K–$20K/yr", req: "College/club player, 3K+ followers", icon: "🏐" },
              { brand: "Nike Volleyball", type: "Brand Ambassador", value: "$5K–$30K/yr", req: "D1/elite club player", icon: "✔️" },
              { brand: "Under Armour", type: "Apparel Deal", value: "$2K–$15K/yr", req: "Any college level", icon: "💪" },
              { brand: "Wilson Volleyball", type: "Ball Sponsor", value: "$1K–$8K/yr", req: "Club or college player", icon: "🏐" },
              { brand: "Local Gyms & Clubs", type: "Coaching Clinics", value: "$200–$1K/event", req: "Any level", icon: "🏋️" },
            ].map((deal, i) => (
              <div key={i} className="bg-purple-950/20 border border-purple-900/40 rounded-2xl p-5 flex items-center gap-4 hover:border-purple-700/40 transition-all">
                <div className="text-3xl w-12 text-center shrink-0">{deal.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-white font-black">{deal.brand}</div>
                  <div className="text-gray-400 text-sm">{deal.type} · {deal.req}</div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-purple-400 font-black">{deal.value}</div>
                  <Link href="/signin" className="text-xs text-purple-500 hover:text-white transition-colors">Apply →</Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <footer className="border-t border-purple-950/30 py-8 text-center">
        <p className="text-gray-600 text-sm">Net Setters · Powered by ATHLYNX AI · athlynx.ai/volleyball · Iron Sharpens Iron — Proverbs 27:17</p>
      </footer>
      <MobileBottomNav />
    </div>
  );
}
