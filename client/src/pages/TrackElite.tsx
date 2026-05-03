import { useState } from "react";
import MobileBottomNav from '@/components/MobileBottomNav'
import { Link } from "wouter";

const stats = [
  { icon: "🏃", value: "2.1M+", label: "Athletes" },
  { icon: "🏆", value: "8,500+", label: "Meets" },
  { icon: "🎓", value: "1,100+", label: "College Programs" },
  { icon: "💰", value: "$310M+", label: "NIL Deals" },
];

const features = [
  { icon: "🏃", title: "Meet Finder", desc: "Find track meets, cross country races, and field competitions nationwide. Filter by event, age group, and level." },
  { icon: "⭐", title: "Elite Invitationals", desc: "Penn Relays, Drake Relays, New Balance Nationals — the stages that define careers. Get registered and get seen." },
  { icon: "📊", title: "Performance Rankings", desc: "National, regional, and state rankings by event. See where your times and distances stack up against the best." },
  { icon: "📅", title: "Recruiting Calendar", desc: "NCAA contact periods, official visit windows, and signing deadlines — all tracked in one place." },
  { icon: "🤝", title: "NIL Marketplace", desc: "Shoe deals, apparel sponsors, energy drink partnerships. Track athletes are among the most marketable in college sports." },
  { icon: "⏱️", title: "PR Tracker", desc: "Log every PR, track your progression, and share your best marks directly with college coaches." },
];

const MEETS = [
  { name: "Penn Relays", location: "Philadelphia, PA", date: "Apr 23-26, 2026", level: "National", events: "All Events", scouts: true },
  { name: "New Balance Nationals Indoor", location: "New York, NY", date: "Mar 13-15, 2026", level: "Elite", events: "All Events", scouts: true },
  { name: "New Balance Nationals Outdoor", location: "Greensboro, NC", date: "Jun 19-21, 2026", level: "Elite", events: "All Events", scouts: true },
  { name: "Drake Relays", location: "Des Moines, IA", date: "Apr 23-25, 2026", level: "National", events: "All Events", scouts: true },
  { name: "Arcadia Invitational", location: "Arcadia, CA", date: "Apr 11-12, 2026", level: "Elite", events: "All Events", scouts: true },
  { name: "Texas Relays", location: "Austin, TX", date: "Mar 26-28, 2026", level: "Regional", events: "All Events", scouts: false },
];

const TOP_PROSPECTS = [
  { name: "Jordan Miles", event: "100m / 200m", mark: "10.32 / 20.87", school: "Centennial HS", committed: null, xScore: 96 },
  { name: "Destiny Washington", event: "400m Hurdles", mark: "54.21", school: "Oak Ridge HS", committed: "LSU", xScore: 94 },
  { name: "Marcus Thompson", event: "High Jump", mark: "7'1\"", school: "IMG Academy", committed: "Texas A&M", xScore: 92 },
  { name: "Aaliyah Foster", event: "Long Jump / Triple Jump", mark: "21'8\" / 44'3\"", school: "Westlake HS", committed: null, xScore: 91 },
];

export default function TrackElite() {
  const [activeTab, setActiveTab] = useState<"overview" | "meets" | "prospects" | "nil">("overview");

  return (
    <div className="min-h-screen bg-[#0a0a00]">
      <header className="sticky top-0 z-50 bg-[#0a0a00]/95 backdrop-blur border-b border-yellow-950/30">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-gray-400 hover:text-white text-sm">← ATHLYNX</Link>
            <span className="text-gray-600">|</span>
            <div className="flex items-center gap-2">
              <span className="text-2xl">🏃</span>
              <div>
                <div className="text-xs text-yellow-400 font-bold tracking-widest">TRACK ELITE</div>
                <div className="text-xs text-orange-400 tracking-wider">POWERED BY ATHLYNX</div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/signin" className="text-sm text-gray-300 hover:text-white">Log In</Link>
            <Link href="/signup" className="bg-yellow-700 hover:bg-yellow-600 text-white text-sm font-bold px-4 py-2 rounded-lg transition-colors">Sign Up Free</Link>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src="/img-track-hero.jpg" alt="Track" className="w-full h-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a00]/60 via-[#0a0a00]/70 to-[#0a0a00]" />
        </div>
        <div className="relative max-w-4xl mx-auto text-center py-24 px-4">
          <div className="inline-flex items-center gap-2 bg-yellow-950/60 border border-yellow-800/50 rounded-full px-4 py-1.5 mb-6">
            <span className="text-yellow-400 text-xs font-bold tracking-widest">TRACK ELITE</span>
            <span className="bg-yellow-500 text-black text-xs font-bold px-2 py-0.5 rounded-full">POWERED BY ATHLYNX</span>
          </div>
          <h1 className="text-6xl md:text-7xl font-black text-white mb-4 leading-none">CHASE<br /><span className="text-yellow-400">GREATNESS</span></h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">Meets. Rankings. Recruiting. NIL. The complete track & field platform for athletes chasing PRs and scholarships.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signin" className="flex items-center justify-center gap-2 bg-yellow-700 hover:bg-yellow-600 text-white font-bold text-lg px-8 py-4 rounded-xl transition-all hover:scale-105">🏃 Find Meets</Link>
            <button className="flex items-center justify-center gap-2 border border-yellow-500 text-yellow-400 hover:bg-yellow-500/10 font-bold text-lg px-8 py-4 rounded-xl transition-all">⏱️ Log My PR</button>
          </div>
        </div>
      </section>

      <section className="py-10 px-4 border-y border-yellow-950/30 bg-black/30">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-3xl mb-1">{s.icon}</div>
              <div className="text-3xl font-black text-yellow-400">{s.value}</div>
              <div className="text-gray-400 text-sm">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      <div className="sticky top-[57px] z-40 bg-[#0a0a00]/95 backdrop-blur border-b border-yellow-950/30">
        <div className="max-w-6xl mx-auto px-4 flex gap-1 py-2 overflow-x-auto">
          {[{ id: "overview", label: "🏃 Overview" }, { id: "meets", label: "🏆 Meets" }, { id: "prospects", label: "⭐ Top Prospects" }, { id: "nil", label: "💰 NIL Deals" }].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`shrink-0 px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === tab.id ? "bg-yellow-700 text-white" : "text-gray-400 hover:text-white hover:bg-white/5"}`}>
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
                <div key={f.title} className="bg-yellow-950/20 border border-yellow-900/40 rounded-2xl p-5 hover:border-yellow-700/50 transition-all">
                  <div className="text-3xl mb-3">{f.icon}</div>
                  <h3 className="text-white font-black text-lg mb-2">{f.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
            <div className="bg-gradient-to-r from-yellow-900/30 to-orange-900/20 border border-yellow-800/40 rounded-2xl p-8 text-center">
              <h2 className="text-3xl font-black text-white mb-3">Every Second Counts</h2>
              <p className="text-gray-300 mb-6 max-w-2xl mx-auto">From your first 5K to the Olympic Trials — ATHLYNX Track Elite tracks every PR, every meet, and every recruiting contact. Your times tell the story. We make sure coaches hear it.</p>
              <Link href="/signup" className="inline-flex items-center gap-2 bg-yellow-600 hover:bg-yellow-500 text-black font-black px-8 py-4 rounded-xl text-lg transition-all hover:scale-105">🏃 Create Your Track Profile Free</Link>
            </div>
          </div>
        )}

        {activeTab === "meets" && (
          <div className="space-y-4">
            <h2 className="text-2xl font-black text-white mb-6">🏆 2026 Meet Calendar</h2>
            {MEETS.map((m, i) => (
              <div key={i} className="bg-yellow-950/20 border border-yellow-900/40 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center gap-4 hover:border-yellow-700/40 transition-all">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-white font-black">{m.name}</h3>
                    {m.scouts && <span className="text-xs bg-green-700/40 text-green-400 border border-green-700/40 px-2 py-0.5 rounded-full font-bold">SCOUTS ATTENDING</span>}
                  </div>
                  <div className="flex flex-wrap gap-3 text-sm text-gray-400">
                    <span>📍 {m.location}</span><span>📅 {m.date}</span><span>🏃 {m.events}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${m.level === "Elite" ? "bg-yellow-700/40 text-yellow-400 border border-yellow-700/40" : m.level === "National" ? "bg-orange-700/40 text-orange-400 border border-orange-700/40" : "bg-blue-700/40 text-blue-400 border border-blue-700/40"}`}>{m.level}</span>
                  <Link href="/signin" className="bg-yellow-700 hover:bg-yellow-600 text-white text-sm font-bold px-4 py-2 rounded-lg transition-colors">Register →</Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "prospects" && (
          <div className="space-y-4">
            <h2 className="text-2xl font-black text-white mb-6">⭐ Top Track Prospects — Class of 2027</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {TOP_PROSPECTS.map((p, i) => (
                <div key={i} className="bg-yellow-950/20 border border-yellow-900/40 rounded-2xl p-5 hover:border-yellow-700/40 transition-all">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-white font-black text-lg">{p.name}</h3>
                      <p className="text-gray-400 text-sm">{p.event} · {p.school}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-yellow-400 font-black text-2xl">{p.xScore}</div>
                      <div className="text-gray-500 text-xs">X-Score</div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className="text-xs bg-yellow-900/40 text-yellow-300 border border-yellow-800/40 px-2 py-1 rounded-lg">PR: {p.mark}</span>
                    {p.committed ? <span className="text-xs bg-green-900/40 text-green-400 border border-green-800/40 px-2 py-1 rounded-lg">✅ {p.committed}</span> : <span className="text-xs bg-orange-900/40 text-orange-400 border border-orange-800/40 px-2 py-1 rounded-lg">Available</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "nil" && (
          <div className="space-y-5">
            <h2 className="text-2xl font-black text-white mb-6">💰 Track & Field NIL Deals</h2>
            {[
              { brand: "Nike Running", type: "Shoe/Apparel Deal", value: "$5K–$50K/yr", req: "D1 athlete or national-level competitor", icon: "✔️" },
              { brand: "New Balance", type: "Brand Ambassador", value: "$3K–$25K/yr", req: "College or elite club athlete", icon: "👟" },
              { brand: "Brooks Running", type: "Athlete Sponsor", value: "$2K–$15K/yr", req: "Distance runner, any college level", icon: "🏃" },
              { brand: "Hoka", type: "Running Partner", value: "$1K–$10K/yr", req: "Distance/cross country athlete", icon: "💨" },
              { brand: "Gatorade / Powerade", type: "Hydration Partner", value: "$1K–$8K/yr", req: "Any college level", icon: "💧" },
            ].map((deal, i) => (
              <div key={i} className="bg-yellow-950/20 border border-yellow-900/40 rounded-2xl p-5 flex items-center gap-4 hover:border-yellow-700/40 transition-all">
                <div className="text-3xl w-12 text-center shrink-0">{deal.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-white font-black">{deal.brand}</div>
                  <div className="text-gray-400 text-sm">{deal.type} · {deal.req}</div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-yellow-400 font-black">{deal.value}</div>
                  <Link href="/signin" className="text-xs text-yellow-500 hover:text-white transition-colors">Apply →</Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <footer className="border-t border-yellow-950/30 py-8 text-center">
        <p className="text-gray-600 text-sm">Track Elite · Powered by ATHLYNX AI · athlynx.ai/track · Iron Sharpens Iron — Proverbs 27:17</p>
      </footer>
      <MobileBottomNav />
    </div>
  );
}
