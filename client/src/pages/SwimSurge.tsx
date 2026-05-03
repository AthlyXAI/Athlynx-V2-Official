import { useState } from "react";
import PlatformLayout from "@/components/PlatformLayout";
import MobileBottomNav from '@/components/MobileBottomNav'
import { Link } from "wouter";

const stats = [
  { icon: "🏊", value: "900K+", label: "Swimmers" },
  { icon: "🏆", value: "6,000+", label: "Meets" },
  { icon: "🎓", value: "500+", label: "College Programs" },
  { icon: "💰", value: "$120M+", label: "NIL Deals" },
];

const features = [
  { icon: "🏊", title: "Meet Finder", desc: "Find USA Swimming, YMCA, and club meets nationwide. Filter by event, age group, and qualifying standard." },
  { icon: "⭐", title: "Elite Invitationals", desc: "Speedo Sectionals, Winter Juniors, Summer Nationals — the qualifying meets that open doors to the next level." },
  { icon: "📊", title: "Time Rankings", desc: "National, regional, and state rankings by event and age group. Know exactly where your times rank." },
  { icon: "📅", title: "Recruiting Calendar", desc: "NCAA contact windows, official visit scheduling, and commitment tracking — all in one place." },
  { icon: "🤝", title: "NIL Marketplace", desc: "Swimwear deals, equipment sponsors, and brand partnerships for college and elite club swimmers." },
  { icon: "⏱️", title: "Time Progression Tracker", desc: "Log every time drop, track your progression by event, and share your best times with college coaches." },
];

const MEETS = [
  { name: "USA Swimming Winter Junior Nationals", location: "Greensboro, NC", date: "Dec 4-7, 2026", level: "National", events: "All Events", scouts: true },
  { name: "Speedo Junior Championships", location: "Multiple Sites", date: "Aug 1-8, 2026", level: "National", events: "All Events", scouts: true },
  { name: "USA Swimming Summer Nationals", location: "Irvine, CA", date: "Jul 28-Aug 2, 2026", level: "Elite", events: "All Events", scouts: true },
  { name: "YMCA National Championships", location: "Greensboro, NC", date: "May 14-17, 2026", level: "National", events: "All Events", scouts: false },
  { name: "Speedo Sectionals", location: "Multiple Sites", date: "Mar-Apr 2026", level: "Regional", events: "All Events", scouts: true },
  { name: "Futures Championships", location: "Multiple Sites", date: "Jun-Jul 2026", level: "Elite", events: "All Events", scouts: true },
];

const TOP_PROSPECTS = [
  { name: "Tyler Nguyen", event: "100/200 Freestyle", time: "44.21 / 1:36.87", team: "Palo Alto Stanford Aquatics", committed: "Stanford", xScore: 97 },
  { name: "Emma Hartley", event: "200/400 IM", time: "1:58.34 / 4:08.21", team: "Longhorn Aquatics", committed: "Texas", xScore: 95 },
  { name: "Caleb Johnson", event: "100/200 Backstroke", time: "47.89 / 1:44.23", team: "SwimMAC Carolina", committed: null, xScore: 93 },
  { name: "Sophia Park", event: "100/200 Butterfly", time: "52.34 / 1:54.67", team: "Phoenix Swim Club", committed: "Arizona", xScore: 91 },
];

export default function SwimSurge() {
  const [activeTab, setActiveTab] = useState<"overview" | "meets" | "prospects" | "nil">("overview");

  return (
    <div className="min-h-screen bg-[#000a1a]">
      <header className="sticky top-0 z-50 bg-[#000a1a]/95 backdrop-blur border-b border-blue-950/30">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-gray-400 hover:text-white text-sm">← ATHLYNX</Link>
            <span className="text-gray-600">|</span>
            <div className="flex items-center gap-2">
              <span className="text-2xl">🏊</span>
              <div>
                <div className="text-xs text-blue-300 font-bold tracking-widest">SWIM SURGE</div>
                <div className="text-xs text-cyan-400 tracking-wider">POWERED BY ATHLYNX</div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/signin" className="text-sm text-gray-300 hover:text-white">Log In</Link>
            <Link href="/signup" className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold px-4 py-2 rounded-lg transition-colors">Sign Up Free</Link>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src="/img-swimming-hero.jpg" alt="Swimming" className="w-full h-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#000a1a]/60 via-[#000a1a]/70 to-[#000a1a]" />
        </div>
        <div className="relative max-w-4xl mx-auto text-center py-24 px-4">
          <div className="inline-flex items-center gap-2 bg-blue-950/60 border border-blue-800/50 rounded-full px-4 py-1.5 mb-6">
            <span className="text-blue-300 text-xs font-bold tracking-widest">SWIM SURGE</span>
            <span className="bg-blue-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">POWERED BY ATHLYNX</span>
          </div>
          <h1 className="text-6xl md:text-7xl font-black text-white mb-4 leading-none">MAKE<br /><span className="text-blue-400">WAVES</span></h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">Meets. Time Rankings. Recruiting. NIL. The complete swimming platform for athletes chasing time drops and college scholarships.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signin" className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-lg px-8 py-4 rounded-xl transition-all hover:scale-105">🏊 Find Meets</Link>
            <button className="flex items-center justify-center gap-2 border border-blue-400 text-blue-300 hover:bg-blue-500/10 font-bold text-lg px-8 py-4 rounded-xl transition-all">⏱️ Log My Times</button>
          </div>
        </div>
      </section>

      <section className="py-10 px-4 border-y border-blue-950/30 bg-black/30">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-3xl mb-1">{s.icon}</div>
              <div className="text-3xl font-black text-blue-400">{s.value}</div>
              <div className="text-gray-400 text-sm">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      <div className="sticky top-[57px] z-40 bg-[#000a1a]/95 backdrop-blur border-b border-blue-950/30">
        <div className="max-w-6xl mx-auto px-4 flex gap-1 py-2 overflow-x-auto">
          {[{ id: "overview", label: "🏊 Overview" }, { id: "meets", label: "🏆 Meets" }, { id: "prospects", label: "⭐ Top Prospects" }, { id: "nil", label: "💰 NIL Deals" }].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`shrink-0 px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === tab.id ? "bg-blue-600 text-white" : "text-gray-400 hover:text-white hover:bg-white/5"}`}>
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
                <div key={f.title} className="bg-blue-950/20 border border-blue-900/40 rounded-2xl p-5 hover:border-blue-600/50 transition-all">
                  <div className="text-3xl mb-3">{f.icon}</div>
                  <h3 className="text-white font-black text-lg mb-2">{f.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
            <div className="bg-gradient-to-r from-blue-900/30 to-cyan-900/20 border border-blue-800/40 rounded-2xl p-8 text-center">
              <h2 className="text-3xl font-black text-white mb-3">Every Tenth of a Second Matters</h2>
              <p className="text-gray-300 mb-6 max-w-2xl mx-auto">From your first swim meet to the Olympic Trials — ATHLYNX Swim Surge tracks every time drop, every qualifying standard, and every recruiting contact. Your times open doors. We make sure coaches see them.</p>
              <Link href="/signup" className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-black px-8 py-4 rounded-xl text-lg transition-all hover:scale-105">🏊 Create Your Swim Profile Free</Link>
            </div>
          </div>
        )}

        {activeTab === "meets" && (
          <div className="space-y-4">
            <h2 className="text-2xl font-black text-white mb-6">🏆 2026 Meet Calendar</h2>
            {MEETS.map((m, i) => (
              <div key={i} className="bg-blue-950/20 border border-blue-900/40 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center gap-4 hover:border-blue-600/40 transition-all">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-white font-black">{m.name}</h3>
                    {m.scouts && <span className="text-xs bg-green-700/40 text-green-400 border border-green-700/40 px-2 py-0.5 rounded-full font-bold">SCOUTS ATTENDING</span>}
                  </div>
                  <div className="flex flex-wrap gap-3 text-sm text-gray-400">
                    <span>📍 {m.location}</span><span>📅 {m.date}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${m.level === "Elite" ? "bg-yellow-700/40 text-yellow-400 border border-yellow-700/40" : m.level === "National" ? "bg-blue-700/40 text-blue-400 border border-blue-700/40" : "bg-gray-700/40 text-gray-400 border border-gray-700/40"}`}>{m.level}</span>
                  <Link href="/signin" className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold px-4 py-2 rounded-lg transition-colors">Register →</Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "prospects" && (
          <div className="space-y-4">
            <h2 className="text-2xl font-black text-white mb-6">⭐ Top Swimming Prospects — Class of 2027</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {TOP_PROSPECTS.map((p, i) => (
                <div key={i} className="bg-blue-950/20 border border-blue-900/40 rounded-2xl p-5 hover:border-blue-600/40 transition-all">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-white font-black text-lg">{p.name}</h3>
                      <p className="text-gray-400 text-sm">{p.event} · {p.team}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-blue-400 font-black text-2xl">{p.xScore}</div>
                      <div className="text-gray-500 text-xs">X-Score</div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className="text-xs bg-blue-900/40 text-blue-300 border border-blue-800/40 px-2 py-1 rounded-lg">Best: {p.time}</span>
                    {p.committed ? <span className="text-xs bg-green-900/40 text-green-400 border border-green-800/40 px-2 py-1 rounded-lg">✅ {p.committed}</span> : <span className="text-xs bg-yellow-900/40 text-yellow-400 border border-yellow-800/40 px-2 py-1 rounded-lg">Available</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "nil" && (
          <div className="space-y-5">
            <h2 className="text-2xl font-black text-white mb-6">💰 Swimming NIL Deals</h2>
            {[
              { brand: "Speedo", type: "Swimwear Sponsor", value: "$3K–$30K/yr", req: "College or elite club swimmer", icon: "🏊" },
              { brand: "TYR Sport", type: "Brand Ambassador", value: "$2K–$20K/yr", req: "Any college level", icon: "💧" },
              { brand: "Arena", type: "Equipment Deal", value: "$1K–$15K/yr", req: "Club or college swimmer", icon: "🥽" },
              { brand: "Finis", type: "Training Partner", value: "$500–$5K/yr", req: "Any level", icon: "⏱️" },
              { brand: "Gatorade / Liquid IV", type: "Hydration Partner", value: "$1K–$8K/yr", req: "Any college level", icon: "💦" },
            ].map((deal, i) => (
              <div key={i} className="bg-blue-950/20 border border-blue-900/40 rounded-2xl p-5 flex items-center gap-4 hover:border-blue-600/40 transition-all">
                <div className="text-3xl w-12 text-center shrink-0">{deal.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-white font-black">{deal.brand}</div>
                  <div className="text-gray-400 text-sm">{deal.type} · {deal.req}</div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-blue-400 font-black">{deal.value}</div>
                  <Link href="/signin" className="text-xs text-blue-400 hover:text-white transition-colors">Apply →</Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <footer className="border-t border-blue-950/30 py-8 text-center">
        <p className="text-gray-600 text-sm">Swim Surge · Powered by ATHLYNX AI · athlynx.ai/swimming · Iron Sharpens Iron — Proverbs 27:17</p>
      </footer>
      <MobileBottomNav />
    </div>
  );
}
