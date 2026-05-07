/**
 * ATHLYNXAI — Official Landing Page
 * Version: S36 — May 6, 2026
 * Author: Chad A. Dozier Sr. — Founder & CEO, AthlynXAI Corporation
 *
 * Design System:
 * - Background: #050d1a (deep navy black)
 * - Primary: #0066ff (AthlynXAI blue)
 * - Accent: #00c2ff (electric cyan)
 * - Text: #ffffff (white) / #8ba3c7 (muted blue-grey)
 * - NO yellow. NO generic. 100% original AthlynXAI.
 *
 * Flow: athlynx.ai/landing → athlynx.ai (full platform)
 */

import { RouteErrorBoundary } from "@/components/GlobalErrorBoundary";
import { Link } from "wouter";
import { useState, useEffect, useRef } from "react";

// ─── Hero Video (CDN) ─────────────────────────────────────────────────────────
const HERO_VIDEO = "https://pub-e4ffb4c8e08a4770a064090220a8e31d.r2.dev/videos/SyHtmDgqKAycRzBN.mp4";

// ─── Platform Screenshots (real athlynx.ai UI) ───────────────────────────────
const SCREENS = {
  feed:       "/landing/IMG_7176.PNG",
  diamond:    "/landing/IMG_7148.PNG",
  messenger:  "/landing/IMG_7147.PNG",
  xfactor:    "/landing/IMG_7120.PNG",
  cfactor:    "/landing/IMG_7134.PNG",
  calendar:   "/landing/IMG_7136.PNG",
  rankings:   "/landing/IMG_7135.PNG",
  nilportal:  "/landing/IMG_7115.PNG",
  transfer:   "/landing/IMG_7116.PNG",
  warriors:   "/landing/IMG_7119.PNG",
  profile:    "/landing/IMG_7178.PNG",
  recruiting: "/landing/IMG_7118.PNG",
  screen1:    "/landing/IMG_7153.PNG",
  screen2:    "/landing/IMG_7177.PNG",
};

// ─── Sports — Men's & Women's ─────────────────────────────────────────────────
const SPORTS = [
  // Men's
  { gender:"Men's", sport:"Football",     img:"/landing/IMG_4072.PNG", href:"/gridiron-nexus",   badge:"LIVE" },
  { gender:"Men's", sport:"Basketball",   img:"/landing/IMG_4073.PNG", href:"/court-kings",      badge:"LIVE" },
  { gender:"Men's", sport:"Baseball",     img:"/landing/IMG_4074.PNG", href:"/diamond-grind",    badge:"NEW"  },
  { gender:"Men's", sport:"Soccer",       img:"/landing/IMG_4075.PNG", href:"/pitch-pulse",      badge:"LIVE" },
  { gender:"Men's", sport:"Track & Field",img:"/landing/IMG_4077.PNG", href:"/x-factor",         badge:"HOT"  },
  { gender:"Men's", sport:"Wrestling",    img:"/landing/IMG_4079.PNG", href:"/warriors-playbook",badge:"HOT"  },
  { gender:"Men's", sport:"Swimming",     img:"/landing/IMG_4080.PNG", href:"/swim-surge",       badge:"LIVE" },
  { gender:"Men's", sport:"Tennis",       img:"/landing/IMG_4081.PNG", href:"/racket-kings",     badge:"LIVE" },
  { gender:"Men's", sport:"Golf",         img:"/landing/IMG_4084.PNG", href:"/fairway-elite",    badge:"LIVE" },
  { gender:"Men's", sport:"Volleyball",   img:"/landing/IMG_4088.PNG", href:"/net-setters",      badge:"LIVE" },
  { gender:"Men's", sport:"Gymnastics",   img:"/landing/IMG_4089.PNG", href:"/gymnastics",       badge:"LIVE" },
  { gender:"Men's", sport:"Rugby",        img:"/landing/IMG_4090.PNG", href:"/rugby-elite",      badge:"LIVE" },
  { gender:"Men's", sport:"Lacrosse",     img:"/landing/IMG_4091.PNG", href:"/lacrosse",         badge:"LIVE" },
  { gender:"Men's", sport:"Hockey",       img:"/landing/IMG_4092.PNG", href:"/hockey",           badge:"LIVE" },
  { gender:"Men's", sport:"Softball",     img:"/landing/IMG_4093.PNG", href:"/softball-nation",  badge:"LIVE" },
  { gender:"Men's", sport:"Rowing",       img:"/landing/IMG_4094.PNG", href:"/rowing-elite",     badge:"LIVE" },
  { gender:"Men's", sport:"Cycling",      img:"/landing/IMG_4095.PNG", href:"/cycling",          badge:"LIVE" },
  { gender:"Men's", sport:"Boxing",       img:"/landing/IMG_4098.PNG", href:"/boxing",           badge:"LIVE" },
  { gender:"Men's", sport:"MMA",          img:"/landing/IMG_4099.PNG", href:"/mma",              badge:"LIVE" },
  // Women's
  { gender:"Women's", sport:"Basketball",   img:"/landing/IMG_4073.PNG", href:"/court-kings",      badge:"LIVE" },
  { gender:"Women's", sport:"Soccer",       img:"/landing/IMG_4075.PNG", href:"/pitch-pulse",      badge:"LIVE" },
  { gender:"Women's", sport:"Volleyball",   img:"/landing/IMG_4088.PNG", href:"/net-setters",      badge:"LIVE" },
  { gender:"Women's", sport:"Softball",     img:"/landing/IMG_4093.PNG", href:"/softball-nation",  badge:"LIVE" },
  { gender:"Women's", sport:"Gymnastics",   img:"/landing/IMG_4089.PNG", href:"/gymnastics",       badge:"LIVE" },
  { gender:"Women's", sport:"Track & Field",img:"/landing/IMG_4077.PNG", href:"/x-factor",         badge:"HOT"  },
  { gender:"Women's", sport:"Swimming",     img:"/landing/IMG_4080.PNG", href:"/swim-surge",       badge:"LIVE" },
  { gender:"Women's", sport:"Tennis",       img:"/landing/IMG_4081.PNG", href:"/racket-kings",     badge:"LIVE" },
  { gender:"Women's", sport:"Lacrosse",     img:"/landing/IMG_4091.PNG", href:"/lacrosse",         badge:"LIVE" },
  { gender:"Women's", sport:"Rowing",       img:"/landing/IMG_4094.PNG", href:"/rowing-elite",     badge:"LIVE" },
  { gender:"Women's", sport:"Golf",         img:"/landing/IMG_4084.PNG", href:"/fairway-elite",    badge:"LIVE" },
  { gender:"Women's", sport:"Hockey",       img:"/landing/IMG_4092.PNG", href:"/hockey",           badge:"LIVE" },
  { gender:"Women's", sport:"Rugby",        img:"/landing/IMG_4090.PNG", href:"/rugby-elite",      badge:"LIVE" },
  { gender:"Women's", sport:"Wrestling",    img:"/landing/IMG_4079.PNG", href:"/warriors-playbook",badge:"HOT"  },
  { gender:"Women's", sport:"Boxing",       img:"/landing/IMG_4098.PNG", href:"/boxing",           badge:"LIVE" },
  { gender:"Women's", sport:"MMA",          img:"/landing/IMG_4099.PNG", href:"/mma",              badge:"LIVE" },
  { gender:"Women's", sport:"Football",     img:"/landing/IMG_4072.PNG", href:"/gridiron-nexus",   badge:"LIVE" },
  { gender:"Women's", sport:"Baseball",     img:"/landing/IMG_4074.PNG", href:"/diamond-grind",    badge:"NEW"  },
  { gender:"Women's", sport:"Cycling",      img:"/landing/IMG_4095.PNG", href:"/cycling",          badge:"LIVE" },
];

// ─── Platform Features ────────────────────────────────────────────────────────
const FEATURES = [
  {
    icon: "⚡",
    name: "X-Factor™",
    tagline: "STOP WAITING TO BE DISCOVERED.",
    desc: "Your X-Factor score (0–100) is your AI-powered athlete rating — built from combine metrics, game film, stats, recruiting interest, and intangibles. It grows as you perform. 90–100 is Elite Pro Prospect. Coaches see it. Scouts track it. Brands pay for it.",
    cta: "Get Your X-Factor Score",
    href: "/x-factor",
    color: "#0066ff",
  },
  {
    icon: "🎯",
    name: "C-Factor Hub™",
    tagline: "THE OPERATING SYSTEM OF YOUR SPORTS LIFE.",
    desc: "C-Factor is your daily command center — NIL opportunities, recruiting pulse, today's agenda, film room, podcast, vendor marketplace, and your complete athlete intelligence dashboard. Everything you need to manage your career in one place. Mobile-first. Built for champions.",
    cta: "Open C-Factor Hub",
    href: "/cfactor",
    color: "#00c2ff",
  },
  {
    icon: "💰",
    name: "NIL Portal™",
    tagline: "YOUR NAME. YOUR BRAND. YOUR MONEY.",
    desc: "Connect directly with brands, negotiate deals, sign contracts, and track your NIL income — all inside AthlynXAI. No agents required. No middlemen. From local car dealerships to national sponsorships. Your NIL value grows with your X-Factor score.",
    cta: "Open NIL Portal",
    href: "/nil-portal",
    color: "#0066ff",
  },
  {
    icon: "🚪",
    name: "Transfer Portal™",
    tagline: "FIND YOUR NEXT SCHOOL. LEVEL UP.",
    desc: "The AthlynXAI Transfer Portal guides athletes from smaller programs to bigger opportunities. Build your profile, get discovered by D1 coaches, compare scholarship offers, and make the move that maximizes your NIL value. The journey from small school to big stage starts here.",
    cta: "Enter Transfer Portal",
    href: "/transfer-portal",
    color: "#00c2ff",
  },
  {
    icon: "⚾",
    name: "Diamond Grind™",
    tagline: "ELITE BASEBALL. BUILT DIFFERENT.",
    desc: "Programs, Stats, Tracker, Leaderboard, and AI Coach — all purpose-built for baseball and softball athletes. Velocity tracking, exit velocity, fielding metrics, showcase prep for Perfect Game and Area Code. The most complete baseball platform ever built.",
    cta: "Enter Diamond Grind",
    href: "/diamond-grind",
    color: "#0066ff",
  },
  {
    icon: "🏈",
    name: "Warriors Playbook™",
    tagline: "PLAYS. FILM. STRATEGY. AI COACH.",
    desc: "The complete football intelligence platform — playbook library, film study, team management, and an AI coach that analyzes your film and gives you a personalized improvement plan. For players, coaches, and programs at every level.",
    cta: "Open Warriors Playbook",
    href: "/warriors-playbook",
    color: "#00c2ff",
  },
];

// ─── Sport Card Component ─────────────────────────────────────────────────────
function SportCard({ sport, gender, img, href, badge, size = "md" }: {
  sport: string; gender: string; img: string; href: string; badge: string; size?: "lg" | "md" | "sm";
}) {
  const h = size === "lg" ? "h-80" : size === "sm" ? "h-40" : "h-56";
  const textSize = size === "lg" ? "text-3xl" : size === "sm" ? "text-base" : "text-xl";
  return (
    <Link href={href}>
      <div className={`relative ${h} rounded-2xl overflow-hidden cursor-pointer group hover:scale-[1.02] transition-all duration-300`}>
        <img src={img} alt={`${gender} ${sport}`} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050d1a]/90 via-[#050d1a]/20 to-transparent" />
        <div className="absolute top-3 left-3 flex gap-2">
          <span className="bg-[#0066ff] text-white text-xs font-black px-2 py-1 rounded-full tracking-wider">{badge}</span>
          <span className="bg-white/10 backdrop-blur text-white text-xs font-bold px-2 py-1 rounded-full">{gender}</span>
        </div>
        <div className="absolute bottom-0 left-0 p-4">
          <p className={`text-white font-black ${textSize} leading-tight drop-shadow-lg`}>{sport}</p>
        </div>
      </div>
    </Link>
  );
}

// ─── Screen Mockup Component ──────────────────────────────────────────────────
function ScreenMockup({ title, badge, img, href, color }: {
  title: string; badge: string; img: string; href: string; color: string;
}) {
  return (
    <Link href={href}>
      <div className="w-56 h-[440px] rounded-[2.5rem] border-2 border-[#0066ff]/40 shadow-2xl overflow-hidden cursor-pointer hover:border-[#00c2ff] hover:scale-[1.02] transition-all duration-300 flex-shrink-0 bg-[#050d1a] relative group">
        <img src={img} alt={title} className="absolute inset-0 w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050d1a]/80 via-transparent to-transparent" />
        <div className="absolute top-3 right-3">
          <span className="text-xs font-black px-2 py-1 rounded-full" style={{ backgroundColor: color, color: '#fff' }}>{badge}</span>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <p className="text-white font-black text-sm">{title}</p>
          <p className="text-[#8ba3c7] text-xs">athlynx.ai →</p>
        </div>
      </div>
    </Link>
  );
}

// ─── Main Landing Page ────────────────────────────────────────────────────────
function LandingPageInner() {
  const [genderFilter, setGenderFilter] = useState<"All" | "Men's" | "Women's">("All");
  const [headline, setHeadline] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  const headlines = [
    "EVERY ATHLETE. EVERY SPORT.",
    "NIL DEALS. TRANSFER PORTAL.",
    "X-FACTOR. C-FACTOR.",
    "MEN'S. WOMEN'S. ALL LEVELS.",
    "YOUR CAREER. YOUR PLATFORM.",
  ];

  useEffect(() => {
    const t = setInterval(() => setHeadline(h => (h + 1) % headlines.length), 3000);
    return () => clearInterval(t);
  }, []);

  const filteredSports = SPORTS.filter(s => genderFilter === "All" || s.gender === genderFilter);

  return (
    <div className="min-h-screen bg-[#050d1a] text-white overflow-x-hidden" style={{ fontFamily: "'Inter', 'SF Pro Display', system-ui, sans-serif" }}>

      {/* ── NAV ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#050d1a]/95 backdrop-blur-xl border-b border-[#0066ff]/20">
        <div className="max-w-7xl mx-auto px-5 py-4 flex items-center justify-between">
          <Link href="/">
            <div className="flex items-center gap-3 cursor-pointer">
              <img src="/athlynx-icon.png" alt="AthlynXAI" className="w-9 h-9 rounded-xl" onError={e => (e.currentTarget.style.display = 'none')} />
              <div>
                <span className="text-white font-black text-lg tracking-tight">AthlynXAI</span>
                <span className="ml-2 text-[#0066ff] text-xs font-bold">™</span>
              </div>
            </div>
          </Link>
          <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-[#8ba3c7]">
            <Link href="/x-factor"><span className="hover:text-white transition-colors cursor-pointer">X-Factor</span></Link>
            <Link href="/cfactor"><span className="hover:text-white transition-colors cursor-pointer">C-Factor</span></Link>
            <Link href="/nil-portal"><span className="hover:text-white transition-colors cursor-pointer">NIL Portal</span></Link>
            <Link href="/diamond-grind"><span className="hover:text-white transition-colors cursor-pointer">Diamond Grind</span></Link>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/signin">
              <button className="text-[#8ba3c7] hover:text-white text-sm font-semibold px-4 py-2 transition-colors">Sign In</button>
            </Link>
            <Link href="/signup">
              <button className="bg-[#0066ff] hover:bg-[#0052cc] text-white font-black text-sm px-6 py-2.5 rounded-full transition-all hover:scale-105 shadow-lg shadow-[#0066ff]/30">
                Join Free
              </button>
            </Link>
          </div>
        </div>
      </nav>

      {/* ── HERO VIDEO BANNER ── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center pt-16 overflow-hidden">
        {/* Video background */}
        <video
          ref={videoRef}
          src={HERO_VIDEO}
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-30"
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#050d1a]/60 via-[#050d1a]/40 to-[#050d1a]" />
        {/* Blue glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,102,255,0.08),transparent_70%)]" />

        <div className="relative z-10 text-center max-w-5xl mx-auto px-5 py-20">
          {/* Live badge */}
          <div className="inline-flex items-center gap-2 bg-[#0066ff]/10 border border-[#0066ff]/30 rounded-full px-5 py-2 mb-8">
            <span className="w-2 h-2 bg-[#00c2ff] rounded-full animate-pulse" />
            <span className="text-sm font-bold text-[#00c2ff] tracking-wider">PLATFORM v1.0 · LIVE NOW · FREE 7-DAY TRIAL</span>
          </div>

          {/* Main headline */}
          <h1 className="text-6xl sm:text-8xl lg:text-9xl font-black leading-none tracking-tighter mb-4">
            <span className="text-white">ATHLYNX</span>
            <span className="text-[#0066ff]">AI</span>
          </h1>

          {/* Rotating subheadline */}
          <div className="h-12 mb-6 overflow-hidden">
            <p className="text-xl sm:text-2xl font-bold text-[#8ba3c7] tracking-wide">{headlines[headline]}</p>
          </div>

          <p className="text-lg text-[#8ba3c7] mb-10 max-w-2xl mx-auto leading-relaxed">
            The first and only complete athlete empowerment platform. NIL deals, transfer portal, AI recruiting, X-Factor scoring, C-Factor intelligence — all in one login. Built by athletes. Built for athletes.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link href="/portal">
              <button className="bg-[#0066ff] hover:bg-[#0052cc] text-white font-black text-xl px-12 py-5 rounded-2xl transition-all hover:scale-105 shadow-2xl shadow-[#0066ff]/40">
                ENTER THE PLATFORM →
              </button>
            </Link>
            <Link href="/signup">
              <button className="bg-white/5 hover:bg-white/10 text-white font-bold text-xl px-12 py-5 rounded-2xl border border-white/20 transition-all">
                START FREE — 7 DAYS
              </button>
            </Link>
          </div>

          {/* Stats bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {[
              { n: "44", l: "Sports Covered" },
              { n: "213+", l: "Platform Features" },
              { n: "4", l: "AI Engines" },
              { n: "$135B", l: "Market Opportunity" },
            ].map((s, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center backdrop-blur">
                <p className="text-white font-black text-2xl">{s.n}</p>
                <p className="text-[#8ba3c7] text-xs font-semibold mt-1">{s.l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── X-FACTOR & C-FACTOR HERO FEATURES ── */}
      <section className="py-24 px-5 bg-[#050d1a]">
        <div className="max-w-7xl mx-auto">
          <p className="text-[#0066ff] text-sm font-black uppercase tracking-[0.3em] text-center mb-3">AthlynXAI Originals</p>
          <h2 className="text-4xl lg:text-6xl font-black text-white text-center mb-4 tracking-tight">
            BUILT FOR THE <span className="text-[#00c2ff]">NEXT LEVEL</span>
          </h2>
          <p className="text-[#8ba3c7] text-center text-lg mb-16 max-w-2xl mx-auto">
            Two proprietary systems that no other platform has. Exclusively AthlynXAI.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-16">
            {FEATURES.slice(0, 2).map((f, i) => (
              <Link key={i} href={f.href}>
                <div className="bg-gradient-to-br from-[#0a1628] to-[#050d1a] border border-[#0066ff]/20 rounded-3xl p-8 hover:border-[#00c2ff]/60 transition-all cursor-pointer group">
                  <div className="flex items-start gap-4 mb-4">
                    <span className="text-4xl">{f.icon}</span>
                    <div>
                      <p className="text-[#00c2ff] text-xs font-black tracking-[0.3em] uppercase mb-1">{f.tagline}</p>
                      <h3 className="text-white font-black text-2xl group-hover:text-[#00c2ff] transition-colors">{f.name}</h3>
                    </div>
                  </div>
                  <p className="text-[#8ba3c7] text-sm leading-relaxed mb-6">{f.desc}</p>
                  <div className="flex items-center gap-2 text-[#0066ff] font-bold text-sm group-hover:gap-4 transition-all">
                    <span>{f.cta}</span>
                    <span>→</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Remaining 4 features */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {FEATURES.slice(2).map((f, i) => (
              <Link key={i} href={f.href}>
                <div className="bg-[#0a1628] border border-[#0066ff]/15 rounded-2xl p-6 hover:border-[#0066ff]/50 transition-all cursor-pointer group">
                  <span className="text-3xl mb-3 block">{f.icon}</span>
                  <h3 className="text-white font-black text-lg mb-2 group-hover:text-[#00c2ff] transition-colors">{f.name}</h3>
                  <p className="text-[#8ba3c7] text-xs leading-relaxed mb-4 line-clamp-3">{f.desc}</p>
                  <span className="text-[#0066ff] text-xs font-bold">Open →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── PLATFORM SCREENS ── */}
      <section className="py-24 px-5 bg-[#030810]">
        <div className="max-w-7xl mx-auto">
          <p className="text-[#0066ff] text-sm font-black uppercase tracking-[0.3em] text-center mb-3">The Full Platform</p>
          <h2 className="text-4xl lg:text-6xl font-black text-white text-center mb-4 tracking-tight">
            EVERY SCREEN. <span className="text-[#00c2ff]">LIVE.</span>
          </h2>
          <p className="text-[#8ba3c7] text-center text-lg mb-16 max-w-2xl mx-auto">
            This is what you get when you log in. Built from scratch. 100% original. Zero compromises.
          </p>
          <div className="flex gap-5 overflow-x-auto pb-6 snap-x snap-mandatory" style={{ scrollbarWidth: 'none' }}>
            {[
              { title:"The Feed",        badge:"LIVE",  img:SCREENS.feed,      href:"/portal",          color:"#22c55e" },
              { title:"X-Factor™",       badge:"HOT",   img:SCREENS.xfactor,   href:"/x-factor",        color:"#0066ff" },
              { title:"C-Factor Hub™",   badge:"NEW",   img:SCREENS.cfactor,   href:"/cfactor",         color:"#00c2ff" },
              { title:"Diamond Grind™",  badge:"NEW",   img:SCREENS.diamond,   href:"/diamond-grind",   color:"#0066ff" },
              { title:"NIL Messenger™",  badge:"LIVE",  img:SCREENS.messenger, href:"/messenger",       color:"#22c55e" },
              { title:"Athlete Calendar",badge:"LIVE",  img:SCREENS.calendar,  href:"/athlete-calendar",color:"#22c55e" },
              { title:"Rankings Hub™",   badge:"NEW",   img:SCREENS.rankings,  href:"/rankings-hub",    color:"#0066ff" },
              { title:"NIL Portal™",     badge:"LIVE",  img:SCREENS.nilportal, href:"/nil-portal",      color:"#22c55e" },
              { title:"Transfer Portal™",badge:"LIVE",  img:SCREENS.transfer,  href:"/transfer-portal", color:"#22c55e" },
              { title:"Warriors Playbook",badge:"HOT",  img:SCREENS.warriors,  href:"/warriors-playbook",color:"#ef4444" },
              { title:"Athlete Profile™",badge:"LIVE",  img:SCREENS.profile,   href:"/profile",         color:"#22c55e" },
              { title:"Recruiting Hub™", badge:"HOT",   img:SCREENS.recruiting,href:"/recruiting-hub",  color:"#0066ff" },
            ].map((s, i) => (
              <div key={i} className="snap-center flex-shrink-0 flex flex-col items-center gap-3">
                <ScreenMockup {...s} />
                <p className="text-[#8ba3c7] text-xs font-bold text-center">{s.title}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MEN'S & WOMEN'S SPORTS ── */}
      <section className="py-24 px-5 bg-[#050d1a]">
        <div className="max-w-7xl mx-auto">
          <p className="text-[#0066ff] text-sm font-black uppercase tracking-[0.3em] text-center mb-3">Every Sport. Every Level.</p>
          <h2 className="text-4xl lg:text-6xl font-black text-white text-center mb-4 tracking-tight">
            MEN'S <span className="text-[#00c2ff]">&</span> WOMEN'S
          </h2>
          <p className="text-[#8ba3c7] text-center text-lg mb-10 max-w-2xl mx-auto">
            44 sports. Both genders. Youth through Pro. AthlynXAI covers every athlete at every level.
          </p>

          {/* Gender filter */}
          <div className="flex justify-center gap-3 mb-12">
            {(["All", "Men's", "Women's"] as const).map(g => (
              <button
                key={g}
                onClick={() => setGenderFilter(g)}
                className={`px-8 py-3 rounded-full font-black text-sm transition-all ${
                  genderFilter === g
                    ? "bg-[#0066ff] text-white shadow-lg shadow-[#0066ff]/30"
                    : "bg-white/5 text-[#8ba3c7] border border-white/10 hover:bg-white/10 hover:text-white"
                }`}
              >
                {g}
              </button>
            ))}
          </div>

          {/* Sport grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredSports.map((s, i) => (
              <SportCard key={i} {...s} size={i < 2 ? "lg" : i < 6 ? "md" : "sm"} />
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/portal">
              <button className="bg-[#0066ff] hover:bg-[#0052cc] text-white font-black text-xl px-14 py-5 rounded-2xl transition-all hover:scale-105 shadow-2xl shadow-[#0066ff]/40">
                ENTER THE FULL PLATFORM →
              </button>
            </Link>
            <p className="text-[#8ba3c7] text-sm mt-3">athlynx.ai · All 44 Sports · Men's & Women's · Free 7-Day Trial</p>
          </div>
        </div>
      </section>

      {/* ── SIGNUP ── */}
      <section className="py-24 px-5 bg-[#030810]">
        <div className="max-w-lg mx-auto">
          <div className="flex justify-center mb-8">
            <span className="inline-flex items-center gap-2 bg-[#0066ff]/10 border border-[#0066ff]/30 rounded-full px-5 py-2">
              <span className="w-2 h-2 bg-[#00c2ff] rounded-full animate-pulse" />
              <span className="text-[#00c2ff] text-sm font-bold tracking-wider">FREE 7-DAY ACCESS — NOT CHARGED UNTIL DAY 8</span>
            </span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-black text-white text-center mb-2 tracking-tight">
            JOIN <span className="text-[#0066ff]">ATHLYNXAI</span>
          </h2>
          <p className="text-[#8ba3c7] text-center mb-10">Thousands of athletes are already building their careers here.</p>

          <form
            onSubmit={e => {
              e.preventDefault();
              const f = new FormData(e.currentTarget as HTMLFormElement);
              window.location.href = `/signup?email=${encodeURIComponent(f.get('email') as string)}&firstName=${encodeURIComponent(f.get('firstName') as string)}&lastName=${encodeURIComponent(f.get('lastName') as string)}`;
            }}
            className="bg-[#0a1628] border border-[#0066ff]/20 rounded-3xl p-8 space-y-4"
          >
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[#8ba3c7] text-xs font-bold mb-2 block uppercase tracking-wider">First Name *</label>
                <input name="firstName" type="text" required placeholder="Chad"
                  className="w-full bg-[#050d1a] border border-[#0066ff]/20 rounded-xl px-4 py-3 text-white placeholder-[#4a6080] focus:outline-none focus:border-[#0066ff] transition-colors" />
              </div>
              <div>
                <label className="text-[#8ba3c7] text-xs font-bold mb-2 block uppercase tracking-wider">Last Name *</label>
                <input name="lastName" type="text" required placeholder="Dozier"
                  className="w-full bg-[#050d1a] border border-[#0066ff]/20 rounded-xl px-4 py-3 text-white placeholder-[#4a6080] focus:outline-none focus:border-[#0066ff] transition-colors" />
              </div>
            </div>
            <div>
              <label className="text-[#8ba3c7] text-xs font-bold mb-2 block uppercase tracking-wider">Email *</label>
              <input name="email" type="email" required placeholder="you@email.com"
                className="w-full bg-[#050d1a] border border-[#0066ff]/20 rounded-xl px-4 py-3 text-white placeholder-[#4a6080] focus:outline-none focus:border-[#0066ff] transition-colors" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[#8ba3c7] text-xs font-bold mb-2 block uppercase tracking-wider">Sport(s)</label>
                <input name="sport" type="text" placeholder="Football, Baseball..."
                  className="w-full bg-[#050d1a] border border-[#0066ff]/20 rounded-xl px-4 py-3 text-white placeholder-[#4a6080] focus:outline-none focus:border-[#0066ff] transition-colors" />
              </div>
              <div>
                <label className="text-[#8ba3c7] text-xs font-bold mb-2 block uppercase tracking-wider">School / Team</label>
                <input name="school" type="text" placeholder="LSU, Houston Texans..."
                  className="w-full bg-[#050d1a] border border-[#0066ff]/20 rounded-xl px-4 py-3 text-white placeholder-[#4a6080] focus:outline-none focus:border-[#0066ff] transition-colors" />
              </div>
            </div>
            <div>
              <label className="text-[#8ba3c7] text-xs font-bold mb-2 block uppercase tracking-wider">I Am A...</label>
              <select name="role" className="w-full bg-[#050d1a] border border-[#0066ff]/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#0066ff] transition-colors">
                {["Athlete", "Parent", "Coach", "Brand / Sponsor", "Agent", "Investor"].map(r => <option key={r}>{r}</option>)}
              </select>
            </div>
            <button type="submit"
              className="w-full bg-[#0066ff] hover:bg-[#0052cc] text-white font-black text-lg py-4 rounded-xl transition-all hover:scale-[1.02] shadow-xl shadow-[#0066ff]/30">
              JOIN FREE — START MY 7 DAYS →
            </button>
            <p className="text-center text-[#4a6080] text-xs">Credit card required · Not charged until day 8 · Cancel anytime</p>
          </form>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-[#030810] border-t border-[#0066ff]/10 py-12 px-5">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
            <div className="flex items-center gap-3">
              <img src="/athlynx-icon.png" alt="AthlynXAI" className="w-10 h-10 rounded-xl" onError={e => (e.currentTarget.style.display = 'none')} />
              <div>
                <p className="font-black text-lg text-white">AthlynXAI<span className="text-[#0066ff]">™</span></p>
                <p className="text-[#4a6080] text-xs">The Athlete's Playbook</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-6 text-sm text-[#4a6080]">
              <a href="https://athlynx.ai" className="hover:text-white transition-colors">athlynx.ai</a>
              <a href="https://dozierholdingsgroup.com" className="hover:text-white transition-colors">dozierholdingsgroup.com</a>
              <a href="https://nilportals.com" className="hover:text-white transition-colors">nilportals.com</a>
            </div>
          </div>
          <div className="border-t border-[#0066ff]/10 pt-6 text-center text-[#4a6080] text-xs space-y-1">
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
