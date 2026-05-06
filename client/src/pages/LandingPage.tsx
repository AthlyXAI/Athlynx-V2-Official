// S36 — Premium Landing Page — May 6, 2026 — Full Platform Showcase
import { RouteErrorBoundary } from "@/components/GlobalErrorBoundary";
import { Link } from "wouter";
import { useState, useEffect } from "react";

const TICKER = ["20+ PLATFORMS BUILT","$47B MARKET","FREE 7-DAY TRIAL","1M+ ATHLETES SERVED","NIL DEALS","TRANSFER PORTAL","AI TRAINING","DIAMOND GRIND","X-FACTOR FEED","C-FACTOR HUB","WARRIORS PLAYBOOK","COURT KINGS","PITCH PULSE","POWERED BY NEBIUS + GEMINI"];

const SPORT_CARDS = [
  { sport:"Football", badge:"Transfer Portal", color:"#c8a84b", img:"https://images.unsplash.com/photo-1566577739112-5180d4bf9390?w=800&q=80", href:"/gridiron-nexus" },
  { sport:"Basketball", badge:"NIL Deals", color:"#c8a84b", img:"https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&q=80", href:"/court-kings" },
  { sport:"Baseball", badge:"Diamond Grind", color:"#3b82f6", img:"https://images.unsplash.com/photo-1529768167801-9173d94c2a42?w=800&q=80", href:"/diamond-grind" },
  { sport:"Soccer", badge:"Pitch Pulse", color:"#22c55e", img:"https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=800&q=80", href:"/pitch-pulse" },
  { sport:"Track & Field", badge:"X-Factor", color:"#f97316", img:"https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=800&q=80", href:"/x-factor" },
  { sport:"Wrestling", badge:"Warriors Playbook", color:"#ef4444", img:"https://images.unsplash.com/photo-1544717305-2782549b5136?w=800&q=80", href:"/warriors-playbook" },
];

const ALL_44_SPORTS = [
  {emoji:"🏈",name:"Football",href:"/gridiron-nexus"},{emoji:"🏀",name:"Basketball",href:"/court-kings"},
  {emoji:"⚾",name:"Baseball",href:"/diamond-grind"},{emoji:"⚽",name:"Soccer",href:"/pitch-pulse"},
  {emoji:"🏃",name:"Track & Field",href:"/x-factor"},{emoji:"🏊",name:"Swimming",href:"/swim-surge"},
  {emoji:"🤼",name:"Wrestling",href:"/warriors-playbook"},{emoji:"🎾",name:"Tennis",href:"/racket-kings"},
  {emoji:"🏐",name:"Volleyball",href:"/net-setters"},{emoji:"🏒",name:"Hockey",href:"/hockey"},
  {emoji:"🥍",name:"Lacrosse",href:"/lacrosse"},{emoji:"🥎",name:"Softball",href:"/softball-nation"},
  {emoji:"🤸",name:"Gymnastics",href:"/gymnastics"},{emoji:"⛳",name:"Golf",href:"/fairway-elite"},
  {emoji:"🏉",name:"Rugby",href:"/rugby-elite"},{emoji:"🏏",name:"Cricket",href:"/cricket"},
  {emoji:"🏃",name:"Cross Country",href:"/track-elite"},{emoji:"🚣",name:"Rowing",href:"/rowing-elite"},
  {emoji:"🤽",name:"Water Polo",href:"/water-polo-elite"},{emoji:"🏑",name:"Field Hockey",href:"/field-hockey"},
  {emoji:"📣",name:"Cheerleading",href:"/cheer"},{emoji:"🥊",name:"Boxing",href:"/boxing"},
  {emoji:"🥋",name:"MMA",href:"/mma"},{emoji:"🏸",name:"Badminton",href:"/badminton"},
  {emoji:"🏓",name:"Table Tennis",href:"/table-tennis"},{emoji:"🏹",name:"Archery",href:"/archery"},
  {emoji:"🤺",name:"Fencing",href:"/fencing"},{emoji:"🏋️",name:"Weightlifting",href:"/weightlifting"},
  {emoji:"🚴",name:"Cycling",href:"/cycling"},{emoji:"🏇",name:"Equestrian",href:"/equestrian"},
  {emoji:"⛷️",name:"Skiing",href:"/skiing"},{emoji:"🏂",name:"Snowboarding",href:"/snowboarding"},
  {emoji:"🏊",name:"Triathlon",href:"/triathlon"},{emoji:"🏖️",name:"Beach Volleyball",href:"/beach-volleyball"},
  {emoji:"💃",name:"Dance",href:"/dance"},{emoji:"🎮",name:"Esports",href:"/esports"},
  {emoji:"🏓",name:"Pickleball",href:"/pickleball"},{emoji:"🎾",name:"Paddle Tennis",href:"/paddle-tennis"},
  {emoji:"🏄",name:"Surfing",href:"/surfing"},{emoji:"🛹",name:"Skateboarding",href:"/skateboarding"},
  {emoji:"🧗",name:"Rock Climbing",href:"/climbing"},{emoji:"🎾",name:"Racquetball",href:"/racquetball"},
  {emoji:"🏊",name:"Diving",href:"/diving"},{emoji:"🥅",name:"Futsal",href:"/futsal"},
];

const ALL_APPS = [
  { icon:"💰", title:"NIL Portal™", badge:"LIVE", desc:"Connect with brands, secure contracts, monetize your NIL.", href:"/nil-portal" },
  { icon:"💬", title:"NIL Messenger™", badge:"LIVE", desc:"Private E2EE messaging with coaches, brands & teammates.", href:"/messenger" },
  { icon:"⚾", title:"Diamond Grind™", badge:"NEW", desc:"Elite baseball training — Programs, Stats, AI Coach.", href:"/diamond-grind" },
  { icon:"🏈", title:"Warriors Playbook™", badge:"HOT", desc:"Football plays, film study, team strategy & AI Coach.", href:"/warriors-playbook" },
  { icon:"🚪", title:"Transfer Portal™", badge:"LIVE", desc:"Find your next school. Compare programs. Level up.", href:"/transfer-portal" },
  { icon:"🔒", title:"NIL Vault™", badge:"ELITE", desc:"Secure your contracts with AES-256 encryption.", href:"/nil-vault" },
  { icon:"⚡", title:"X-Factor Feed™", badge:"HOT", desc:"Get recruited on your terms. Stop waiting to be discovered.", href:"/x-factor" },
  { icon:"🎯", title:"C-Factor Hub™", badge:"NEW", desc:"The operating system of your sports life. Daily command center.", href:"/cfactor" },
  { icon:"🏀", title:"Court Kings™", badge:"LIVE", desc:"Basketball AAU, NIL deals & recruiting platform.", href:"/court-kings" },
  { icon:"⚽", title:"Pitch Pulse™", badge:"LIVE", desc:"Global soccer ecosystem — every level, every league.", href:"/pitch-pulse" },
  { icon:"🤖", title:"AI Recruiter™", badge:"AI", desc:"AI-powered recruiting optimization — get in front of coaches.", href:"/ai-recruiter" },
  { icon:"📊", title:"Rankings Hub™", badge:"NEW", desc:"Top 25, Mock Draft, Live Events, Prospect Finder.", href:"/rankings-hub" },
  { icon:"📅", title:"Athlete Calendar™", badge:"LIVE", desc:"Schedule games, recruiting visits, NIL meetings.", href:"/athlete-calendar" },
  { icon:"🎓", title:"Recruiting Hub™", badge:"HOT", desc:"Scholarship tracker, coach search, school comparison.", href:"/recruiting-hub" },
  { icon:"📱", title:"AI Content™", badge:"AI", desc:"Create viral content for your athlete brand.", href:"/ai-content" },
  { icon:"💼", title:"AI Sales™", badge:"AI", desc:"Close brand deals with AI-powered outreach.", href:"/ai-sales" },
  { icon:"📖", title:"The Athlete Playbook", badge:"CORE", desc:"Boost recruiting presence, build media profile, connect globally.", href:"/portal" },
  { icon:"📈", title:"NIL Calculator™", badge:"FREE", desc:"Calculate your NIL value instantly.", href:"/nil-calculator" },
  { icon:"🌐", title:"Social Hub™", badge:"NEW", desc:"Manage all your athlete social channels in one place.", href:"/social-hub" },
  { icon:"🎙️", title:"Podcast™", badge:"NEW", desc:"The Athlete's Playbook Podcast — every episode.", href:"/podcast" },
];

const LAYER_CAKE = [
  { icon:"⚡", layer:"AI Layer 1", name:"Google Gemini 2.5 Flash", desc:"Primary AI — sports intelligence, real-time" },
  { icon:"🧠", layer:"AI Layer 2", name:"Anthropic Claude Opus", desc:"Deep reasoning — contract analysis, NIL evaluation" },
  { icon:"💻", layer:"AI Layer 3", name:"Nebius Llama-3.3-70B on NVIDIA H200", desc:"Always-on fallback — zero downtime" },
  { icon:"🚀", layer:"Deploy", name:"Vercel + GitHub", desc:"Auto-deploy on every push — zero config" },
  { icon:"🗄️", layer:"Database", name:"Neon PostgreSQL + PlanetScale", desc:"Dual failover — never loses connection" },
  { icon:"💳", layer:"Payments", name:"Stripe — AthlynXAI Corporation", desc:"Live payments, subscriptions, NIL transactions" },
  { icon:"📱", layer:"Social", name:"Buffer — 10 Channels", desc:"347 posts fired worldwide — automated daily" },
  { icon:"☁️", layer:"Storage", name:"AWS S3 + SNS", desc:"Video, media, file storage + SMS notifications" },
];

function LandingPageInner() {
  const [headline, setHeadline] = useState(0);
  const headlines = ["NIL Deals.", "Recruiting.", "Transfer Portal.", "AI Training.", "Your Future."];

  useEffect(() => {
    const t = setInterval(() => setHeadline(h => (h + 1) % headlines.length), 2200);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="min-h-screen bg-[#0a1628] text-white">
      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a1628]/95 backdrop-blur border-b border-blue-900/60">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/">
            <div className="flex items-center gap-2 cursor-pointer">
              <img src="/athlynx-icon.png" alt="ATHLYNX" className="w-8 h-8 rounded-lg" onError={e => (e.currentTarget.style.display = 'none')} />
              <span className="font-black text-lg">ATHLYNX</span>
            </div>
          </Link>
          <div className="flex gap-3 items-center">
            <Link href="/signin"><button className="text-blue-300 hover:text-white text-sm font-semibold px-3 py-2 transition-colors">Sign In</button></Link>
            <Link href="/signup"><button className="bg-yellow-400 hover:bg-yellow-300 text-[#0a1628] font-black text-sm px-5 py-2 rounded-full transition-all hover:scale-105">Join Free</button></Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative min-h-screen flex items-center pt-14 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a1628] via-[#0d1f3c] to-[#0a1628]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(59,130,246,0.12),transparent_60%)]" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full">
          <div>
            <div className="inline-flex items-center gap-2 bg-[#1a2a4a] border border-blue-700 rounded-full px-4 py-2 mb-6">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-sm font-semibold text-blue-200">LIVE NOW · 7-Day Free Trial · No Credit Card</span>
            </div>
            <h1 className="text-5xl lg:text-7xl font-black leading-tight mb-1">THE ATHLETE'S</h1>
            <h1 className="text-5xl lg:text-7xl font-black text-yellow-400 leading-tight mb-4">PLAYBOOK.</h1>
            <div className="h-10 mb-6">
              <p className="text-2xl lg:text-3xl font-bold text-white">{headlines[headline]}</p>
            </div>
            <p className="text-lg text-blue-200 mb-8 max-w-lg leading-relaxed">
              One platform. Every tool. Built for athletes from youth to pro — NIL deals, transfer portal, recruiting, AI training, and 20+ platforms in one login.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <Link href="/portal">
                <button className="bg-blue-600 hover:bg-blue-500 text-white font-black text-lg px-8 py-4 rounded-xl border border-blue-400 transition-all hover:scale-105 shadow-lg shadow-blue-900/50 w-full sm:w-auto">
                  ENTER THE PORTAL →
                </button>
              </Link>
              <Link href="/how-it-works">
                <button className="bg-transparent hover:bg-white/10 text-white font-bold text-lg px-8 py-4 rounded-xl border border-white/30 transition-all w-full sm:w-auto">
                  Learn More
                </button>
              </Link>
            </div>
            <p className="text-sm text-blue-400">A Dozier Holdings Group Company · Houston, TX · Est. Nov 2024</p>
          </div>
          <div className="flex justify-center lg:justify-end">
            <div className="relative w-64 h-[520px] bg-[#0d1f3c] rounded-[3rem] border-4 border-blue-700 shadow-2xl shadow-blue-900/50 overflow-hidden">
              <div className="p-4 space-y-3">
                <div className="flex items-center gap-2 mb-2">
                  <img src="/athlynx-icon.png" alt="" className="w-7 h-7 rounded-lg" onError={e => (e.currentTarget.style.display = 'none')} />
                  <span className="font-black text-xs">ATHLYNX</span>
                  <span className="ml-auto bg-green-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">LIVE</span>
                </div>
                {[
                  { l: "NIL Value", v: "$82.4M", c: "text-yellow-400" },
                  { l: "X-Factor Score", v: "94", c: "text-blue-400" },
                  { l: "C-Factor™", v: "87 / Elite", c: "text-purple-400" },
                  { l: "Recruiting", v: "12 Offers", c: "text-green-400" },
                ].map((s, i) => (
                  <div key={i} className="bg-[#1a2a4a] rounded-xl p-3 border border-blue-800">
                    <p className="text-blue-300 text-xs mb-1">{s.l}</p>
                    <p className={`font-black text-lg ${s.c}`}>{s.v}</p>
                  </div>
                ))}
                <div className="bg-blue-600 rounded-xl p-3 text-center mt-2">
                  <p className="text-white font-black text-xs">ENTER THE PORTAL →</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TICKER */}
      <div className="bg-[#1a2a4a] border-y border-blue-800 overflow-hidden py-2">
        <div className="flex animate-[ticker_35s_linear_infinite] whitespace-nowrap">
          {[...TICKER, ...TICKER].map((item, i) => (
            <span key={i} className="inline-flex items-center gap-2 px-6 text-sm font-bold text-blue-200">
              <span className="text-yellow-400">•</span>{item}
            </span>
          ))}
        </div>
      </div>

      {/* SPORT CARDS */}
      <section className="bg-[#0d1f3c] py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <p className="text-yellow-400 text-sm font-bold uppercase tracking-widest text-center mb-2">Every Sport</p>
          <h2 className="text-4xl lg:text-6xl font-black text-white text-center mb-2">THE FULL <span className="text-yellow-400">ECOSYSTEM</span></h2>
          <p className="text-blue-200 text-center text-lg mb-12 max-w-2xl mx-auto">20 platforms. One mission. Built from 4 years of vision.</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-16">
            {SPORT_CARDS.map((card, i) => (
              <Link key={i} href={card.href}>
                <div className="relative rounded-2xl overflow-hidden cursor-pointer group h-56 hover:scale-[1.02] transition-transform duration-300">
                  <img src={card.img} alt={card.sport} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 p-4">
                    <span className="inline-block text-xs font-black px-3 py-1 rounded-full mb-2" style={{ backgroundColor: card.color, color: '#0a1628' }}>{card.badge}</span>
                    <p className="text-white font-black text-xl">{card.sport}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ALL 44 SPORTS */}
      <section className="bg-[#060f1e] py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <p className="text-yellow-400 text-sm font-bold uppercase tracking-widest text-center mb-2">Every Sport. Every Level.</p>
          <h2 className="text-3xl lg:text-5xl font-black text-white text-center mb-10">ALL <span className="text-yellow-400">44 SPORTS</span> COVERED</h2>
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-11 gap-3">
            {ALL_44_SPORTS.map((s, i) => (
              <Link key={i} href={s.href}>
                <div className="bg-[#1a2a4a] border border-blue-800 rounded-xl p-3 hover:border-yellow-400 hover:bg-[#1e3055] transition-all cursor-pointer text-center group">
                  <div className="text-2xl mb-1">{s.emoji}</div>
                  <p className="text-blue-200 text-xs font-semibold group-hover:text-yellow-400 transition-colors leading-tight">{s.name}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ALL APPS */}
      <section className="bg-[#0a1628] py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <p className="text-yellow-400 text-sm font-bold uppercase tracking-widest text-center mb-2">All 20+ Platforms</p>
          <h2 className="text-4xl font-black text-white text-center mb-12">EVERY TOOL YOU NEED</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {ALL_APPS.map((app, i) => (
              <Link key={i} href={app.href}>
                <div className="bg-[#1a2a4a] border border-blue-800 rounded-2xl p-4 hover:border-blue-500 hover:bg-[#1e3055] transition-all cursor-pointer group text-center">
                  <div className="text-3xl mb-2">{app.icon}</div>
                  <p className="text-white font-bold text-xs mb-1 group-hover:text-yellow-400 transition-colors leading-tight">{app.title}</p>
                  <span className="inline-block bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full font-bold mb-2">{app.badge}</span>
                  <p className="text-blue-400 text-xs leading-tight hidden md:block">{app.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* LAYER CAKE */}
      <section className="bg-[#0d1f3c] py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <p className="text-yellow-400 text-sm font-bold uppercase tracking-widest text-center mb-2">The Infrastructure</p>
          <h2 className="text-4xl font-black text-white text-center mb-2">FULL STACK <span className="text-yellow-400">LAYER CAKE</span></h2>
          <p className="text-blue-200 text-center mb-10">The CERN of US sports tech. Every layer purpose-built.</p>
          <div className="space-y-3">
            {LAYER_CAKE.map((l, i) => (
              <div key={i} className="flex items-center gap-4 bg-[#1a2a4a] border border-blue-800 rounded-xl p-4 hover:border-blue-500 transition-colors">
                <span className="text-2xl">{l.icon}</span>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-yellow-400 text-xs font-bold">{l.layer}</span>
                    <span className="text-white font-bold text-sm">{l.name}</span>
                  </div>
                  <p className="text-blue-300 text-xs mt-0.5">{l.desc}</p>
                </div>
                <span className="text-green-400 text-xs font-bold flex-shrink-0">● LIVE</span>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <span className="inline-flex items-center gap-2 bg-green-900/30 border border-green-700 rounded-full px-6 py-2 text-green-400 font-bold text-sm">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              ALL SYSTEMS LIVE — ZERO DOWNTIME ARCHITECTURE
            </span>
          </div>
        </div>
      </section>

      {/* SIGNUP */}
      <section className="bg-[#0a1628] py-20 px-6">
        <div className="max-w-xl mx-auto">
          <div className="flex justify-center mb-6">
            <span className="inline-flex items-center gap-2 bg-green-900/30 border border-green-700 rounded-full px-4 py-1">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-green-400 text-sm font-bold">FREE 7-DAY ACCESS — NO CREDIT CARD</span>
            </span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-black text-white text-center mb-2">GET <span className="text-yellow-400">STARTED</span></h2>
          <p className="text-blue-200 text-center mb-10">Join thousands of athletes already on the platform.</p>
          <form
            onSubmit={e => {
              e.preventDefault();
              const f = new FormData(e.currentTarget as HTMLFormElement);
              window.location.href = `/signup?email=${encodeURIComponent(f.get('email') as string)}&firstName=${encodeURIComponent(f.get('firstName') as string)}&lastName=${encodeURIComponent(f.get('lastName') as string)}`;
            }}
            className="bg-[#1a2a4a] border border-blue-800 rounded-2xl p-8 space-y-4"
          >
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-blue-300 text-xs font-bold mb-1 block">First Name *</label>
                <input name="firstName" type="text" required placeholder="Chad" className="w-full bg-[#0d1f3c] border border-blue-700 rounded-xl px-4 py-3 text-white placeholder-blue-500 focus:outline-none focus:border-blue-400" />
              </div>
              <div>
                <label className="text-blue-300 text-xs font-bold mb-1 block">Last Name *</label>
                <input name="lastName" type="text" required placeholder="Dozier" className="w-full bg-[#0d1f3c] border border-blue-700 rounded-xl px-4 py-3 text-white placeholder-blue-500 focus:outline-none focus:border-blue-400" />
              </div>
            </div>
            <div>
              <label className="text-blue-300 text-xs font-bold mb-1 block">Email *</label>
              <input name="email" type="email" required placeholder="you@email.com" className="w-full bg-[#0d1f3c] border border-blue-700 rounded-xl px-4 py-3 text-white placeholder-blue-500 focus:outline-none focus:border-blue-400" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-blue-300 text-xs font-bold mb-1 block">Sport(s)</label>
                <input name="sport" type="text" placeholder="Football, Baseball..." className="w-full bg-[#0d1f3c] border border-blue-700 rounded-xl px-4 py-3 text-white placeholder-blue-500 focus:outline-none focus:border-blue-400" />
              </div>
              <div>
                <label className="text-blue-300 text-xs font-bold mb-1 block">School / Team</label>
                <input name="school" type="text" placeholder="LSU, Houston Texans..." className="w-full bg-[#0d1f3c] border border-blue-700 rounded-xl px-4 py-3 text-white placeholder-blue-500 focus:outline-none focus:border-blue-400" />
              </div>
            </div>
            <div>
              <label className="text-blue-300 text-xs font-bold mb-1 block">I am a...</label>
              <select name="role" className="w-full bg-[#0d1f3c] border border-blue-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-400">
                {["Athlete", "Parent", "Coach", "Brand / Sponsor", "Agent", "Investor"].map(r => <option key={r}>{r}</option>)}
              </select>
            </div>
            <button type="submit" className="w-full bg-yellow-400 hover:bg-yellow-300 text-[#0a1628] font-black text-lg py-4 rounded-xl transition-all hover:scale-[1.02] shadow-lg">
              JOIN FREE — START MY 7 DAYS →
            </button>
            <p className="text-center text-blue-400 text-xs">No credit card required · Cancel anytime · 7 days free</p>
          </form>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#060f1e] border-t border-blue-900 py-10 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-6">
            <div className="flex items-center gap-3">
              <img src="/athlynx-icon.png" alt="ATHLYNX" className="w-10 h-10 rounded-xl" onError={e => (e.currentTarget.style.display = 'none')} />
              <div>
                <p className="font-black text-lg">ATHLYNX</p>
                <p className="text-blue-400 text-xs">The Athlete's Playbook</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-4 text-sm text-blue-400">
              <a href="https://athlynx.ai" className="hover:text-white">athlynx.ai</a>
              <a href="https://dozierholdingsgroup.com" className="hover:text-white">dozierholdingsgroup.com</a>
              <a href="https://nilportals.com" className="hover:text-white">nilportals.com</a>
            </div>
          </div>
          <div className="border-t border-blue-900 pt-6 text-center text-blue-500 text-xs space-y-1">
            <p>© 2026 AthlynXAI Corporation · A Dozier Holdings Group Company · Houston, TX · EIN 42-2183569</p>
            <p>Iron Sharpens Iron — Proverbs 27:17 · Founded November 2024 · Chad A. Dozier Sr. & Glenn Tse</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function LandingPage() {
  return <RouteErrorBoundary><LandingPageInner /></RouteErrorBoundary>;
}
