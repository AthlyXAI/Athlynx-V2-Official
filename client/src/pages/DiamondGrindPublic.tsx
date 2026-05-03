import MobileBottomNav from '@/components/MobileBottomNav'
import { useState } from "react";
import { Link } from "wouter";

const stats = [
  { icon: "⚾", value: "620K+", label: "Players" },
  { icon: "🏆", value: "4,800+", label: "Showcases" },
  { icon: "🎓", value: "310+", label: "College Programs" },
  { icon: "💰", value: "$240M+", label: "NIL Deals" },
];

const features = [
  { icon: "⚾", title: "Elite Showcases", desc: "Perfect Game, WWBA, Area Code Games — the events that get you seen by D1 coaches and pro scouts. We track every one." },
  { icon: "🎯", title: "Recruiting Intelligence", desc: "Know which coaches are watching. Get notified when a program fits your profile. Stop guessing, start connecting." },
  { icon: "📊", title: "Player Rankings", desc: "National, regional, and state rankings updated weekly. Know your standing among the top prospects in your class." },
  { icon: "📅", title: "Recruiting Calendar", desc: "Track every NCAA dead period, evaluation period, and contact window. Never miss a critical recruiting moment." },
  { icon: "💰", title: "NIL Marketplace", desc: "Baseball's fastest-growing NIL platform. Connect with equipment brands, local businesses, and national sponsors." },
  { icon: "🎬", title: "Highlight Reel Hub", desc: "Upload, share, and distribute your game film to coaches nationwide. Your tape is your resume — make it count." },
];

const TOURNAMENTS = [
  { name: "Perfect Game WWBA World Championship", location: "Jupiter, FL", date: "Oct 10-17, 2026", level: "Elite", division: "17U / 18U", scouts: true },
  { name: "Perfect Game National Showcase", location: "Fort Myers, FL", date: "Jun 14-18, 2026", level: "Elite", division: "2027 / 2028", scouts: true },
  { name: "Area Code Games", location: "Long Beach, CA", date: "Aug 5-9, 2026", level: "Elite", division: "HS Seniors", scouts: true },
  { name: "East Cobb World Series", location: "Marietta, GA", date: "Jul 18-24, 2026", level: "Tier I", division: "16U / 17U", scouts: true },
  { name: "Perfect Game Southeast Championship", location: "Hoover, AL", date: "Jul 4-7, 2026", level: "Tier II", division: "All Ages", scouts: false },
  { name: "WWBA Underclass World Championship", location: "Jupiter, FL", date: "Oct 1-6, 2026", level: "Elite", division: "14U / 15U / 16U", scouts: true },
];

const TOP_PROSPECTS = [
  { name: "Marcus Rivera", pos: "RHP", age: "17", team: "East Cobb Yankees", gpa: "3.8", committed: "Vanderbilt", xScore: 97 },
  { name: "Deon Williams", pos: "SS", age: "16", team: "Texas Stix", gpa: "3.5", committed: "Uncommitted", xScore: 94 },
  { name: "Jake Thornton", pos: "C", age: "17", team: "Georgia Impact", gpa: "3.9", committed: "Georgia", xScore: 92 },
  { name: "Carlos Mendez", pos: "CF", age: "16", team: "Evoshield Canes", gpa: "3.6", committed: "Uncommitted", xScore: 91 },
];

const NIL_DEALS = [
  { icon: "⚾", brand: "Rawlings", type: "Equipment Sponsor", value: "$2,500–$8,000", req: "Top 500 Prospect" },
  { icon: "👟", brand: "New Balance Baseball", type: "Footwear Deal", value: "$1,500–$5,000", req: "Varsity Starter" },
  { icon: "📱", brand: "Diamond Kinetics", type: "Tech Ambassador", value: "$800–$3,000", req: "5K+ Followers" },
  { icon: "🏋️", brand: "Driveline Baseball", type: "Training Partner", value: "$1,200–$4,000", req: "Ranked Prospect" },
];

export default function DiamondGrindPublic() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="min-h-screen bg-[#020c1a] text-white font-sans">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#020c1a]/95 backdrop-blur border-b border-red-950/30">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-gray-400 hover:text-white text-sm">← ATHLYNX</Link>
            <span className="text-gray-600">|</span>
            <div className="flex items-center gap-2">
              <span className="text-2xl">⚾</span>
              <div>
                <div className="text-xs text-red-400 font-bold tracking-widest">DIAMOND GRIND</div>
                <div className="text-xs text-red-500/70 tracking-wider">POWERED BY ATHLYNX</div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/signin" className="text-sm text-gray-300 hover:text-white">Log In</Link>
            <Link href="/signup" className="bg-red-700 hover:bg-red-600 text-white text-sm font-bold px-4 py-2 rounded-lg transition-colors">
              Sign Up Free
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden py-20 px-4">
        <div className="absolute inset-0 bg-gradient-to-br from-red-950 via-[#1a0808] to-[#020c1a] opacity-80" />
        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-red-900/40 border border-red-700/50 rounded-full px-4 py-1.5 mb-6">
            <span className="text-red-400 text-xs font-bold tracking-widest">DIAMOND GRIND</span>
            <span className="bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">POWERED BY ATHLYNX</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white mb-4 leading-none">
            GRIND THE<br />
            <span className="text-red-400">DIAMOND</span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Elite Showcases. Recruiting Intelligence. NIL Deals. The complete baseball platform for players who want to go further.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup" className="flex items-center justify-center gap-2 bg-red-700 hover:bg-red-600 text-white font-bold text-lg px-8 py-4 rounded-xl transition-all hover:scale-105">
              ⚾ Find Showcases
            </Link>
            <Link href="/signin" className="flex items-center justify-center gap-2 border border-red-700 text-red-400 hover:bg-red-900/20 font-bold text-lg px-8 py-4 rounded-xl transition-all">
              📊 View Rankings
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-red-950/40 bg-[#0a0505] py-8 px-4">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {stats.map((s, i) => (
            <div key={i}>
              <div className="text-3xl mb-1">{s.icon}</div>
              <div className="text-2xl font-black text-red-400">{s.value}</div>
              <div className="text-gray-400 text-sm">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Tab Nav */}
      <div className="sticky top-[57px] z-40 bg-[#020c1a]/95 backdrop-blur border-b border-red-950/30 px-4">
        <div className="max-w-6xl mx-auto flex gap-1 overflow-x-auto py-2 scrollbar-hide">
          {["overview", "tournaments", "prospects", "nil"].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-colors ${activeTab === tab ? "bg-red-700 text-white" : "text-gray-400 hover:text-white hover:bg-red-950/40"}`}
            >
              {tab === "overview" ? "⚾ Overview" : tab === "tournaments" ? "🏆 Showcases" : tab === "prospects" ? "⭐ Top Prospects" : "💰 NIL Deals"}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-8 pb-24">

        {activeTab === "overview" && (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {features.map((f, i) => (
                <div key={i} className="bg-red-950/20 border border-red-900/30 rounded-2xl p-5 hover:border-red-700/40 transition-all">
                  <div className="text-3xl mb-3">{f.icon}</div>
                  <h3 className="text-white font-black text-lg mb-2">{f.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
            <div className="bg-red-950/20 border border-red-700/40 rounded-2xl p-6 text-center">
              <h3 className="text-white font-black text-2xl mb-2">Ready to Grind the Diamond?</h3>
              <p className="text-gray-400 mb-4">Join 620K+ baseball players already on ATHLYNX. Your next level starts here.</p>
              <Link href="/signup" className="inline-block bg-red-700 hover:bg-red-600 text-white font-black px-8 py-3 rounded-xl transition-all hover:scale-105">
                ⚾ Create Your Baseball Profile Free
              </Link>
            </div>
          </div>
        )}

        {activeTab === "tournaments" && (
          <div className="space-y-4">
            {TOURNAMENTS.map((t, i) => (
              <div key={i} className="bg-red-950/20 border border-red-900/30 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-3 hover:border-red-700/40 transition-all">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-white font-black text-lg">{t.name}</span>
                    {t.scouts && <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-red-700 text-white">SCOUTS</span>}
                  </div>
                  <div className="flex flex-wrap gap-3 text-sm text-gray-400">
                    <span>📍 {t.location}</span>
                    <span>📅 {t.date}</span>
                    <span>🏷️ {t.division}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-black px-3 py-1 rounded-full ${t.level === "Elite" ? "bg-red-700 text-white" : "bg-red-950 text-red-400 border border-red-800"}`}>{t.level}</span>
                  <Link href="/signup" className="text-xs text-red-400 hover:text-white font-bold transition-colors">Register →</Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "prospects" && (
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              {TOP_PROSPECTS.map((p, i) => (
                <div key={i} className="bg-red-950/20 border border-red-900/30 rounded-2xl p-5 hover:border-red-700/40 transition-all">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="text-white font-black text-lg">{p.name}</div>
                      <div className="text-gray-400 text-sm">{p.pos} · Age {p.age} · {p.team}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-red-400 font-black text-2xl">{p.xScore}</div>
                      <div className="text-gray-500 text-xs">X-Score</div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className="text-xs bg-red-950 text-red-300 px-2 py-1 rounded-full border border-red-800">GPA {p.gpa}</span>
                    <span className={`text-xs px-2 py-1 rounded-full border ${p.committed !== "Uncommitted" ? "bg-green-900/30 text-green-400 border-green-800" : "bg-gray-900 text-gray-400 border-gray-700"}`}>
                      {p.committed !== "Uncommitted" ? `✅ ${p.committed}` : "🔓 Available"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-red-950/20 border border-red-700/40 rounded-2xl p-6 text-center">
              <p className="text-gray-300 mb-3">Get ranked and discovered by college coaches nationwide.</p>
              <Link href="/signup" className="inline-block bg-red-700 hover:bg-red-600 text-white font-black px-6 py-3 rounded-xl transition-all">
                ⚾ Get My Ranking
              </Link>
            </div>
          </div>
        )}

        {activeTab === "nil" && (
          <div className="space-y-4">
            {NIL_DEALS.map((deal, i) => (
              <div key={i} className="bg-red-950/20 border border-red-900/30 rounded-2xl p-5 flex items-center gap-4 hover:border-red-700/40 transition-all">
                <div className="text-3xl w-12 text-center shrink-0">{deal.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-white font-black">{deal.brand}</div>
                  <div className="text-gray-400 text-sm">{deal.type} · {deal.req}</div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-red-400 font-black">{deal.value}</div>
                  <Link href="/signup" className="text-xs text-red-500 hover:text-white transition-colors">Apply →</Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-red-950/30 py-8 text-center">
        <p className="text-gray-600 text-sm">Diamond Grind · Powered by ATHLYNX AI · athlynx.ai/baseball · Iron Sharpens Iron — Proverbs 27:17</p>
      </footer>

      <MobileBottomNav />
    </div>
  );
}
