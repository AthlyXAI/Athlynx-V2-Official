// S36 — Mobile-First Platform Preview Landing Page — May 6, 2026
// Mirrors the real athlynx.ai platform — every screen featured virtually
import { RouteErrorBoundary } from "@/components/GlobalErrorBoundary";
import { Link } from "wouter";
import { useState, useEffect, useRef } from "react";

// ─── All 44 Sports ───────────────────────────────────────────────────────────
const SPORTS_44 = [
  {e:"🏈",n:"Football",h:"/gridiron-nexus"},{e:"🏀",n:"Basketball",h:"/court-kings"},
  {e:"⚾",n:"Baseball",h:"/diamond-grind"},{e:"⚽",n:"Soccer",h:"/pitch-pulse"},
  {e:"🏃",n:"Track & Field",h:"/x-factor"},{e:"🏊",n:"Swimming",h:"/swim-surge"},
  {e:"🤼",n:"Wrestling",h:"/warriors-playbook"},{e:"🎾",n:"Tennis",h:"/racket-kings"},
  {e:"🏐",n:"Volleyball",h:"/net-setters"},{e:"🏒",n:"Hockey",h:"/hockey"},
  {e:"🥍",n:"Lacrosse",h:"/lacrosse"},{e:"🥎",n:"Softball",h:"/softball-nation"},
  {e:"🤸",n:"Gymnastics",h:"/gymnastics"},{e:"⛳",n:"Golf",h:"/fairway-elite"},
  {e:"🏉",n:"Rugby",h:"/rugby-elite"},{e:"🏏",n:"Cricket",h:"/cricket"},
  {e:"🏃",n:"Cross Country",h:"/track-elite"},{e:"🚣",n:"Rowing",h:"/rowing-elite"},
  {e:"🤽",n:"Water Polo",h:"/water-polo-elite"},{e:"🏑",n:"Field Hockey",h:"/field-hockey"},
  {e:"📣",n:"Cheerleading",h:"/cheer"},{e:"🥊",n:"Boxing",h:"/boxing"},
  {e:"🥋",n:"MMA",h:"/mma"},{e:"🏸",n:"Badminton",h:"/badminton"},
  {e:"🏓",n:"Table Tennis",h:"/table-tennis"},{e:"🏹",n:"Archery",h:"/archery"},
  {e:"🤺",n:"Fencing",h:"/fencing"},{e:"🏋️",n:"Weightlifting",h:"/weightlifting"},
  {e:"🚴",n:"Cycling",h:"/cycling"},{e:"🏇",n:"Equestrian",h:"/equestrian"},
  {e:"⛷️",n:"Skiing",h:"/skiing"},{e:"🏂",n:"Snowboarding",h:"/snowboarding"},
  {e:"🏊",n:"Triathlon",h:"/triathlon"},{e:"🏖️",n:"Beach Volleyball",h:"/beach-volleyball"},
  {e:"💃",n:"Dance",h:"/dance"},{e:"🎮",n:"Esports",h:"/esports"},
  {e:"🏓",n:"Pickleball",h:"/pickleball"},{e:"🎾",n:"Paddle Tennis",h:"/paddle-tennis"},
  {e:"🏄",n:"Surfing",h:"/surfing"},{e:"🛹",n:"Skateboarding",h:"/skateboarding"},
  {e:"🧗",n:"Rock Climbing",h:"/climbing"},{e:"🏊",n:"Diving",h:"/diving"},
  {e:"🥅",n:"Futsal",h:"/futsal"},{e:"🎿",n:"Nordic Skiing",h:"/nordic-skiing"},
];

// ─── Platform Screens (virtual previews of real pages) ───────────────────────
const PLATFORM_SCREENS = [
  {
    title: "The Feed",
    badge: "LIVE",
    badgeColor: "#22c55e",
    href: "/portal",
    img: "/landing/IMG_7176.PNG",
    preview: (
      <div className="p-3 space-y-2 text-xs">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center text-white font-black text-xs">T</div>
          <div><p className="text-white font-bold text-xs">Test Athlete</p><p className="text-blue-400 text-xs">5/2/2026</p></div>
          <span className="ml-auto bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">LIVE</span>
        </div>
        <div className="bg-[#1a2a4a] rounded-lg p-2 border border-blue-800">
          <p className="text-white text-xs">🏆 Just dropped 34 pts, 11 assists. Film is up. Coaches — schedule is open. #Basketball #NIL</p>
          <div className="flex gap-3 mt-2 text-blue-400 text-xs"><span>❤️ 89</span><span>💬 23</span><span>↗️ 15</span></div>
        </div>
        <div className="bg-[#1a2a4a] rounded-lg p-2 border border-blue-800">
          <p className="text-white text-xs">⚾ Diamond Grind: 17U squad went 4-0 at Houston Showcase. 3 D1 offers on the spot. #Baseball</p>
          <div className="flex gap-3 mt-2 text-blue-400 text-xs"><span>❤️ 62</span><span>💬 18</span><span>↗️ 11</span></div>
        </div>
        <div className="bg-[#1a2a4a] rounded-lg p-2 border border-blue-800">
          <p className="text-white text-xs">🎓 Signed my first NIL deal with a regional sports nutrition brand. AthlynXAI made it happen. 💰</p>
          <div className="flex gap-3 mt-2 text-blue-400 text-xs"><span>❤️ 201</span><span>💬 67</span><span>↗️ 45</span></div>
        </div>
      </div>
    ),
  },
  {
    title: "Diamond Grind™",
    badge: "NEW",
    badgeColor: "#3b82f6",
    href: "/diamond-grind",
    img: "/landing/IMG_7148.PNG",
    preview: (
      <div className="p-3 text-xs">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-2xl">⚾</span>
          <div><p className="text-white font-black text-sm">DIAMOND GRIND</p><p className="text-blue-400 text-xs">Baseball Elite Platform</p></div>
        </div>
        <div className="flex gap-1 mb-3 overflow-x-auto">
          {["Programs","Stats","Tracker","Leaderboard","AI Coach"].map(t=>(
            <span key={t} className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full whitespace-nowrap">{t}</span>
          ))}
        </div>
        {[{n:"Elite Pitching Mechanics",l:"Elite · 8 weeks"},{n:"Hitting Power Development",l:"Intermediate · 6 weeks"},{n:"Speed & Baserunning",l:"All Levels · 4 weeks"}].map((p,i)=>(
          <div key={i} className="bg-[#1a2a4a] rounded-lg p-2 mb-2 border border-blue-800 flex items-center justify-between">
            <div><p className="text-white font-bold text-xs">{p.n}</p><p className="text-blue-400 text-xs">{p.l}</p></div>
            <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">Start</span>
          </div>
        ))}
      </div>
    ),
  },
  {
    title: "NIL Messenger™",
    badge: "LIVE",
    badgeColor: "#22c55e",
    href: "/messenger",
    img: "/landing/IMG_7147.PNG",
    preview: (
      <div className="p-3 text-xs">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xl">💬</span>
          <p className="text-white font-black text-sm">NIL MESSENGER</p>
          <span className="ml-auto bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">E2EE</span>
        </div>
        {[
          {n:"Coach Johnson",m:"Great film session! Let's talk scholarship...",t:"2m",unread:2},
          {n:"Nike Brand Rep",m:"We'd love to discuss a partnership deal...",t:"1h",unread:1},
          {n:"Transfer Portal",m:"3 new schools added your profile",t:"3h",unread:3},
          {n:"Lee Marshall",m:"Your NIL valuation is ready to review",t:"5h",unread:0},
        ].map((c,i)=>(
          <div key={i} className="flex items-center gap-2 bg-[#1a2a4a] rounded-lg p-2 mb-2 border border-blue-800">
            <div className="w-8 h-8 bg-blue-700 rounded-full flex items-center justify-center text-white font-black text-xs flex-shrink-0">{c.n[0]}</div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-bold text-xs">{c.n}</p>
              <p className="text-blue-400 text-xs truncate">{c.m}</p>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="text-blue-400 text-xs">{c.t}</p>
              {c.unread>0&&<span className="bg-blue-600 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center ml-auto">{c.unread}</span>}
            </div>
          </div>
        ))}
      </div>
    ),
  },
  {
    title: "X-Factor Feed™",
    badge: "HOT",
    badgeColor: "#f97316",
    href: "/x-factor",
    img: "/landing/IMG_7120.PNG",
    preview: (
      <div className="p-3 text-xs">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xl">⚡</span>
          <div><p className="text-white font-black text-sm">X-FACTOR</p><p className="text-blue-400 text-xs">Get Recruited On Your Terms</p></div>
        </div>
        <div className="bg-gradient-to-r from-blue-900 to-blue-700 rounded-xl p-3 mb-3 text-center">
          <p className="text-yellow-400 font-black text-lg">94</p>
          <p className="text-white text-xs font-bold">X-FACTOR SCORE</p>
          <p className="text-blue-300 text-xs">Top 6% Nationally</p>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {[{l:"47 Coaches",s:"Viewed Today"},{l:"12 Offers",s:"Active"},{l:"$82K",s:"NIL Value"},{l:"#4",s:"State Rank"}].map((s,i)=>(
            <div key={i} className="bg-[#1a2a4a] rounded-lg p-2 border border-blue-800 text-center">
              <p className="text-yellow-400 font-black text-sm">{s.l}</p>
              <p className="text-blue-400 text-xs">{s.s}</p>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    title: "C-Factor Hub™",
    badge: "NEW",
    badgeColor: "#8b5cf6",
    href: "/cfactor",
    img: "/landing/IMG_7134.PNG",
    preview: (
      <div className="p-3 text-xs">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xl">🎯</span>
          <div><p className="text-white font-black text-sm">C-FACTOR HUB</p><p className="text-blue-400 text-xs">Operating System of Your Sports Life</p></div>
        </div>
        <div className="bg-[#1a2a4a] rounded-xl p-3 mb-3 border border-purple-700">
          <p className="text-purple-300 text-xs mb-1">Today's Agenda</p>
          {[{t:"9:00 AM",l:"Morning Training",c:"🏋️"},{t:"11:30 AM",l:"Coach Johnson Call",c:"📞"},{t:"2:00 PM",l:"NIL Deal Review",c:"💰"},{t:"4:00 PM",l:"Film Review",c:"🎬"}].map((a,i)=>(
            <div key={i} className="flex items-center gap-2 py-1 border-b border-blue-900 last:border-0">
              <span>{a.c}</span>
              <span className="text-blue-400">{a.t}</span>
              <span className="text-white">{a.l}</span>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-2">
          {[{l:"Athletic",v:80},{l:"NIL Value",v:67},{l:"Recruiting",v:75},{l:"Social",v:60}].map((m,i)=>(
            <div key={i} className="bg-[#1a2a4a] rounded-lg p-2 border border-blue-800">
              <p className="text-blue-400 text-xs">{m.l}</p>
              <div className="flex items-center gap-1 mt-1">
                <div className="flex-1 bg-blue-900 rounded-full h-1.5"><div className="bg-blue-500 h-1.5 rounded-full" style={{width:`${m.v}%`}} /></div>
                <span className="text-white text-xs font-bold">{m.v}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    title: "Athlete Calendar™",
    badge: "LIVE",
    badgeColor: "#22c55e",
    href: "/athlete-calendar",
    img: "/landing/IMG_7136.PNG",
    preview: (
      <div className="p-3 text-xs">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xl">📅</span>
          <div><p className="text-white font-black text-sm">ATHLETE CALENDAR</p><p className="text-blue-400 text-xs">May 2026</p></div>
        </div>
        <div className="grid grid-cols-7 gap-1 mb-3">
          {["S","M","T","W","T","F","S"].map((d,i)=><div key={i} className="text-center text-blue-400 text-xs">{d}</div>)}
          {Array.from({length:31},(_,i)=>i+1).map(d=>(
            <div key={d} className={`text-center text-xs py-1 rounded ${[6,12,15,22,28].includes(d)?"bg-blue-600 text-white font-bold":"text-blue-300"}`}>{d}</div>
          ))}
        </div>
        {[{d:"May 6",e:"NIL Brand Meeting",c:"💰"},{d:"May 12",e:"Regional Showcase",c:"⚾"},{d:"May 15",e:"Nebius Finalist",c:"🏆"},{d:"May 22",e:"Campus Visit — LSU",c:"🎓"}].map((ev,i)=>(
          <div key={i} className="flex items-center gap-2 bg-[#1a2a4a] rounded-lg p-2 mb-1 border border-blue-800">
            <span>{ev.c}</span>
            <div><p className="text-white font-bold text-xs">{ev.e}</p><p className="text-blue-400 text-xs">{ev.d}</p></div>
          </div>
        ))}
      </div>
    ),
  },
  {
    title: "Rankings Hub™",
    badge: "NEW",
    badgeColor: "#c8a84b",
    href: "/rankings-hub",
    img: "/landing/IMG_7135.PNG",
    preview: (
      <div className="p-3 text-xs">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xl">📊</span>
          <div><p className="text-white font-black text-sm">RANKINGS HUB</p><p className="text-blue-400 text-xs">Top 25 · Mock Draft · Live Events</p></div>
        </div>
        <p className="text-yellow-400 font-bold text-xs mb-2">🏈 TOP 5 FOOTBALL RECRUITS 2026</p>
        {[
          {r:1,n:"Marcus Johnson",p:"QB · Houston, TX",s:99},
          {r:2,n:"DeShawn Williams",p:"WR · Atlanta, GA",s:97},
          {r:3,n:"Tyler Brooks",p:"DE · Miami, FL",s:96},
          {r:4,n:"Isaiah Carter",p:"CB · Dallas, TX",s:95},
          {r:5,n:"Jordan Smith",p:"OT · Los Angeles, CA",s:94},
        ].map((p,i)=>(
          <div key={i} className="flex items-center gap-2 bg-[#1a2a4a] rounded-lg p-2 mb-1 border border-blue-800">
            <span className="text-yellow-400 font-black text-sm w-4">#{p.r}</span>
            <div className="flex-1"><p className="text-white font-bold text-xs">{p.n}</p><p className="text-blue-400 text-xs">{p.p}</p></div>
            <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full font-bold">{p.s}</span>
          </div>
        ))}
      </div>
    ),
  },
  {
    title: "NIL Portal™",
    badge: "LIVE",
    badgeColor: "#22c55e",
    href: "/nil-portal",
    img: "/landing/IMG_7115.PNG",
    preview: (
      <div className="p-3 text-xs">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xl">💰</span>
          <div><p className="text-white font-black text-sm">NIL PORTAL</p><p className="text-blue-400 text-xs">Monetize Your Name, Image & Likeness</p></div>
        </div>
        <div className="bg-gradient-to-r from-green-900 to-green-700 rounded-xl p-3 mb-3 text-center">
          <p className="text-green-300 text-xs">Your NIL Value</p>
          <p className="text-white font-black text-2xl">$82,400</p>
          <p className="text-green-300 text-xs">↑ 23% this month</p>
        </div>
        {[{b:"Nike Regional",v:"$15,000",s:"Active"},{b:"Energy Drink Co.",v:"$8,500",s:"Pending"},{b:"Local Auto Group",v:"$3,200",s:"Negotiating"}].map((d,i)=>(
          <div key={i} className="flex items-center justify-between bg-[#1a2a4a] rounded-lg p-2 mb-1 border border-blue-800">
            <div><p className="text-white font-bold text-xs">{d.b}</p><p className="text-blue-400 text-xs">{d.s}</p></div>
            <span className="text-green-400 font-black text-xs">{d.v}</span>
          </div>
        ))}
      </div>
    ),
  },
  {
    title: "Transfer Portal™",
    badge: "LIVE",
    badgeColor: "#22c55e",
    href: "/transfer-portal",
    img: "/landing/IMG_7116.PNG",
    preview: (
      <div className="p-3 text-xs">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xl">🚪</span>
          <div><p className="text-white font-black text-sm">TRANSFER PORTAL</p><p className="text-blue-400 text-xs">Find Your Next School</p></div>
        </div>
        {[{s:"LSU",d:"D1 · Baton Rouge, LA",m:"Full Scholarship",c:"🏈"},{s:"Texas A&M",d:"D1 · College Station, TX",m:"Partial + NIL",c:"🏈"},{s:"Alabama",d:"D1 · Tuscaloosa, AL",m:"Full Scholarship",c:"🏈"},{s:"Ohio State",d:"D1 · Columbus, OH",m:"Full Scholarship",c:"🏈"}].map((s,i)=>(
          <div key={i} className="flex items-center gap-2 bg-[#1a2a4a] rounded-lg p-2 mb-2 border border-blue-800">
            <span className="text-xl">{s.c}</span>
            <div className="flex-1"><p className="text-white font-bold text-xs">{s.s}</p><p className="text-blue-400 text-xs">{s.d}</p></div>
            <span className="bg-green-700 text-green-300 text-xs px-2 py-0.5 rounded-full">{s.m}</span>
          </div>
        ))}
      </div>
    ),
  },
  {
    title: "Warriors Playbook™",
    badge: "HOT",
    badgeColor: "#ef4444",
    href: "/warriors-playbook",
    img: "/landing/IMG_7119.PNG",
    preview: (
      <div className="p-3 text-xs">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xl">🏈</span>
          <div><p className="text-white font-black text-sm">WARRIORS PLAYBOOK</p><p className="text-blue-400 text-xs">Football Elite Platform</p></div>
        </div>
        <div className="flex gap-1 mb-3 flex-wrap">
          {["Playbook","Stats","Film","Team","AI Coach"].map(t=>(
            <span key={t} className="bg-red-700 text-white text-xs px-2 py-1 rounded-full">{t}</span>
          ))}
        </div>
        {[{n:"Spread Offense Package",t:"12 plays"},{n:"Red Zone Formations",t:"8 plays"},{n:"Blitz Packages",t:"6 plays"},{n:"2-Minute Drill",t:"5 plays"}].map((p,i)=>(
          <div key={i} className="flex items-center justify-between bg-[#1a2a4a] rounded-lg p-2 mb-1 border border-blue-800">
            <p className="text-white font-bold text-xs">{p.n}</p>
            <span className="text-blue-400 text-xs">{p.t}</span>
          </div>
        ))}
      </div>
    ),
  },
  {
    title: "Athlete Profile™",
    badge: "LIVE",
    badgeColor: "#22c55e",
    href: "/profile",
    img: "/landing/IMG_7178.PNG",
    preview: (
      <div className="p-3 text-xs">
        <div className="text-center mb-3">
          <div className="w-14 h-14 bg-blue-700 rounded-full flex items-center justify-center text-white font-black text-xl mx-auto mb-2">JW</div>
          <p className="text-white font-black text-sm">Jaylen Williams</p>
          <p className="text-blue-400 text-xs">QB · Class of 2027 · Houston, TX</p>
          <div className="flex justify-center gap-2 mt-2">
            <span className="bg-green-700 text-green-300 text-xs px-2 py-0.5 rounded-full">NIL VERIFIED</span>
            <span className="bg-blue-700 text-blue-300 text-xs px-2 py-0.5 rounded-full">D1 PROSPECT</span>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2 mb-3">
          {[{l:"X-Factor",v:"94"},{l:"NIL Value",v:"$82K"},{l:"Offers",v:"12"}].map((s,i)=>(
            <div key={i} className="bg-[#1a2a4a] rounded-lg p-2 border border-blue-800 text-center">
              <p className="text-yellow-400 font-black text-sm">{s.v}</p>
              <p className="text-blue-400 text-xs">{s.l}</p>
            </div>
          ))}
        </div>
        <div className="flex gap-1 flex-wrap">
          {["Profile","Stats","Bio","Film","NIL","Recruiting"].map(t=>(
            <span key={t} className="bg-[#1a2a4a] border border-blue-700 text-blue-300 text-xs px-2 py-1 rounded-full">{t}</span>
          ))}
        </div>
      </div>
    ),
  },
  {
    title: "Recruiting Hub™",
    badge: "HOT",
    badgeColor: "#c8a84b",
    href: "/recruiting-hub",
    img: "/landing/IMG_7118.PNG",
    preview: (
      <div className="p-3 text-xs">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xl">🎓</span>
          <div><p className="text-white font-black text-sm">RECRUITING HUB</p><p className="text-blue-400 text-xs">Beats Perfect Game · Hudl · On3</p></div>
        </div>
        <div className="grid grid-cols-2 gap-2 mb-3">
          {[{l:"Coach Views",v:"247"},{l:"Offers",v:"12"},{l:"D1 Interest",v:"8"},{l:"Profile Score",v:"94"}].map((s,i)=>(
            <div key={i} className="bg-[#1a2a4a] rounded-lg p-2 border border-blue-800 text-center">
              <p className="text-yellow-400 font-black text-sm">{s.v}</p>
              <p className="text-blue-400 text-xs">{s.l}</p>
            </div>
          ))}
        </div>
        {[{s:"LSU Tigers",r:"Offer Received",c:"🏈"},{s:"Texas Longhorns",r:"Official Visit",c:"🏈"},{s:"Alabama Crimson Tide",r:"Scholarship Offer",c:"🏈"}].map((s,i)=>(
          <div key={i} className="flex items-center gap-2 bg-[#1a2a4a] rounded-lg p-2 mb-1 border border-blue-800">
            <span>{s.c}</span>
            <div className="flex-1"><p className="text-white font-bold text-xs">{s.s}</p><p className="text-green-400 text-xs">{s.r}</p></div>
          </div>
        ))}
      </div>
    ),
  },
];

// ─── Phone Mockup Wrapper ─────────────────────────────────────────────────────
function PhoneMockup({ screen, size = "md" }: { screen: typeof PLATFORM_SCREENS[0]; size?: "sm" | "md" | "lg" }) {
  const dims = size === "lg" ? "w-72 h-[560px]" : size === "sm" ? "w-44 h-[340px]" : "w-56 h-[440px]";
  return (
    <Link href={screen.href}>
      <div className={`${dims} rounded-[2.5rem] border-[3px] border-blue-700 shadow-2xl shadow-blue-900/60 overflow-hidden cursor-pointer hover:border-yellow-400 hover:scale-[1.02] transition-all duration-300 flex-shrink-0 bg-[#0a1628] relative`}>
        {/* Real platform screenshot fills the entire phone */}
        {screen.img ? (
          <img
            src={screen.img}
            alt={screen.title}
            className="w-full h-full object-cover object-top absolute inset-0"
          />
        ) : (
          <div className="w-full h-full bg-[#0a1628]">
            {/* Phone status bar */}
            <div className="bg-[#060f1e] px-4 py-2 flex items-center justify-between">
              <span className="text-white text-xs font-bold">9:41</span>
              <div className="w-16 h-4 bg-[#060f1e] rounded-full border border-blue-900" />
              <span className="text-white text-xs">●●●</span>
            </div>
            <div className="overflow-hidden flex-1">{screen.preview}</div>
          </div>
        )}
        {/* Overlay gradient + badge + title */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-3 right-3">
          <span className="text-xs font-black px-2 py-1 rounded-full shadow-lg" style={{backgroundColor: screen.badgeColor, color:'#0a1628'}}>{screen.badge}</span>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-3">
          <p className="text-white font-black text-sm drop-shadow-lg">{screen.title}</p>
          <p className="text-blue-200 text-xs">athlynx.ai →</p>
        </div>
      </div>
    </Link>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
function LandingPageInner() {
  const [headline, setHeadline] = useState(0);
  const headlines = ["NIL Deals.", "Recruiting.", "Transfer Portal.", "AI Training.", "Your Future."];
  const tickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = setInterval(() => setHeadline(h => (h + 1) % headlines.length), 2200);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="min-h-screen bg-[#0a1628] text-white overflow-x-hidden">

      {/* ── TOP NAV ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a1628]/95 backdrop-blur border-b border-blue-900/60">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/">
            <div className="flex items-center gap-2 cursor-pointer">
              <img src="/athlynx-icon.png" alt="ATHLYNX" className="w-8 h-8 rounded-lg" onError={e=>(e.currentTarget.style.display='none')} />
              <span className="font-black text-lg">ATHLYNX</span>
            </div>
          </Link>
          <div className="flex gap-3 items-center">
            <Link href="/signin"><button className="text-blue-300 hover:text-white text-sm font-semibold px-3 py-2 transition-colors">Sign In</button></Link>
            <Link href="/signup"><button className="bg-yellow-400 hover:bg-yellow-300 text-[#0a1628] font-black text-sm px-5 py-2 rounded-full transition-all hover:scale-105">Join Free</button></Link>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center pt-16 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a1628] via-[#0d1f3c] to-[#0a1628]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.08),transparent_70%)]" />

        <div className="relative z-10 text-center max-w-4xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 bg-[#1a2a4a] border border-blue-700 rounded-full px-4 py-2 mb-6">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-sm font-semibold text-blue-200">LIVE NOW · 7-Day Free Trial · No Credit Card</span>
          </div>
          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black leading-none mb-2">THE ATHLETE'S</h1>
          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black text-yellow-400 leading-none mb-6">PLAYBOOK.</h1>
          <div className="h-10 mb-6">
            <p className="text-2xl sm:text-3xl font-bold text-white">{headlines[headline]}</p>
          </div>
          <p className="text-lg text-blue-200 mb-8 max-w-2xl mx-auto">
            One platform. Every tool. Every sport. Youth to Pro. NIL deals, transfer portal, recruiting, AI training — all in one login.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/portal">
              <button className="bg-blue-600 hover:bg-blue-500 text-white font-black text-xl px-10 py-5 rounded-2xl border border-blue-400 transition-all hover:scale-105 shadow-2xl shadow-blue-900/50">
                ENTER THE PORTAL →
              </button>
            </Link>
            <Link href="/signup">
              <button className="bg-yellow-400 hover:bg-yellow-300 text-[#0a1628] font-black text-xl px-10 py-5 rounded-2xl transition-all hover:scale-105">
                JOIN FREE — 7 DAYS
              </button>
            </Link>
          </div>
        </div>

        {/* Hero phone row — 3 featured screens */}
        <div className="relative z-10 flex items-end justify-center gap-4 w-full max-w-4xl mx-auto">
          <div className="hidden sm:block opacity-80 -rotate-6 translate-y-4">
            <PhoneMockup screen={PLATFORM_SCREENS[2]} size="sm" />
          </div>
          <PhoneMockup screen={PLATFORM_SCREENS[0]} size="lg" />
          <div className="hidden sm:block opacity-80 rotate-6 translate-y-4">
            <PhoneMockup screen={PLATFORM_SCREENS[3]} size="sm" />
          </div>
        </div>
      </section>

      {/* ── TICKER ── */}
      <div className="bg-[#1a2a4a] border-y border-blue-800 overflow-hidden py-2.5">
        <div className="flex animate-[ticker_40s_linear_infinite] whitespace-nowrap">
          {[...Array(2)].flatMap(() => SPORTS_44.map((s,i)=>(
            <span key={i} className="inline-flex items-center gap-2 px-5 text-sm font-bold text-blue-200">
              <span className="text-yellow-400">{s.e}</span> {s.n}
            </span>
          )))}
        </div>
      </div>

      {/* ── ALL PLATFORM SCREENS ── */}
      <section className="py-20 px-4 bg-[#0a1628]">
        <div className="max-w-7xl mx-auto">
          <p className="text-yellow-400 text-sm font-bold uppercase tracking-widest text-center mb-2">The Full Platform</p>
          <h2 className="text-4xl lg:text-6xl font-black text-white text-center mb-4">
            EVERY SCREEN. <span className="text-yellow-400">LIVE.</span>
          </h2>
          <p className="text-blue-200 text-center text-lg mb-16 max-w-2xl mx-auto">
            This is what you get when you log in. Every tool. Every feature. All working right now.
          </p>

          {/* Featured screens — large horizontal scroll */}
          <div className="flex gap-6 overflow-x-auto pb-8 snap-x snap-mandatory scrollbar-hide justify-start lg:justify-center flex-wrap lg:flex-nowrap">
            {PLATFORM_SCREENS.map((screen, i) => (
              <div key={i} className="snap-center flex-shrink-0">
                <PhoneMockup screen={screen} size="md" />
                <p className="text-center text-blue-300 text-xs font-bold mt-3">{screen.title}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SPORT PHOTO GALLERY ── */}
      <section className="py-20 px-4 bg-[#060f1e]">
        <div className="max-w-7xl mx-auto">
          <p className="text-yellow-400 text-sm font-bold uppercase tracking-widest text-center mb-2">Every Sport. Every Level.</p>
          <h2 className="text-4xl lg:text-6xl font-black text-white text-center mb-4">
            YOUR SPORT <span className="text-yellow-400">IS HERE</span>
          </h2>
          <p className="text-blue-200 text-center text-lg mb-12 max-w-2xl mx-auto">
            44 sports. Every level. Youth to Pro. All in one platform.
          </p>

          {/* Primary sport cards — large */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
            {[
              {sport:"Football",sub:"Gridiron Nexus™",img:"/landing/IMG_4072.PNG",href:"/gridiron-nexus",badge:"LIVE"},
              {sport:"Basketball",sub:"Court Kings™",img:"/landing/IMG_4073.PNG",href:"/court-kings",badge:"LIVE"},
              {sport:"Baseball",sub:"Diamond Grind™",img:"/landing/IMG_4074.PNG",href:"/diamond-grind",badge:"NEW"},
            ].map((c,i)=>(
              <Link key={i} href={c.href}>
                <div className="relative rounded-2xl overflow-hidden cursor-pointer group h-72 hover:scale-[1.02] transition-transform duration-300">
                  <img src={c.img} alt={c.sport} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                  <div className="absolute top-3 left-3">
                    <span className="bg-yellow-400 text-[#0a1628] text-xs font-black px-3 py-1 rounded-full">{c.badge}</span>
                  </div>
                  <div className="absolute bottom-0 left-0 p-5">
                    <p className="text-white font-black text-3xl drop-shadow-lg">{c.sport}</p>
                    <p className="text-yellow-400 text-sm font-bold">{c.sub}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Secondary sport cards — medium */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            {[
              {sport:"Soccer",sub:"Pitch Pulse™",img:"/landing/IMG_4075.PNG",href:"/pitch-pulse",badge:"LIVE"},
              {sport:"Track & Field",sub:"X-Factor™",img:"/landing/IMG_4077.PNG",href:"/x-factor",badge:"HOT"},
              {sport:"Wrestling",sub:"Warriors Playbook™",img:"/landing/IMG_4079.PNG",href:"/warriors-playbook",badge:"HOT"},
              {sport:"Swimming",sub:"Swim Surge™",img:"/landing/IMG_4080.PNG",href:"/swim-surge",badge:"LIVE"},
            ].map((c,i)=>(
              <Link key={i} href={c.href}>
                <div className="relative rounded-2xl overflow-hidden cursor-pointer group h-52 hover:scale-[1.02] transition-transform duration-300">
                  <img src={c.img} alt={c.sport} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                  <div className="absolute top-2 left-2">
                    <span className="bg-blue-600 text-white text-xs font-black px-2 py-0.5 rounded-full">{c.badge}</span>
                  </div>
                  <div className="absolute bottom-0 left-0 p-4">
                    <p className="text-white font-black text-xl drop-shadow-lg">{c.sport}</p>
                    <p className="text-blue-300 text-xs font-bold">{c.sub}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Tertiary sport cards — small grid */}
          <div className="grid grid-cols-3 md:grid-cols-5 gap-3 mb-8">
            {[
              {sport:"Tennis",img:"/landing/IMG_4081.PNG",href:"/racket-kings"},
              {sport:"Golf",img:"/landing/IMG_4084.PNG",href:"/fairway-elite"},
              {sport:"Volleyball",img:"/landing/IMG_4088.PNG",href:"/net-setters"},
              {sport:"Gymnastics",img:"/landing/IMG_4089.PNG",href:"/gymnastics"},
              {sport:"Rugby",img:"/landing/IMG_4090.PNG",href:"/rugby-elite"},
              {sport:"Lacrosse",img:"/landing/IMG_4091.PNG",href:"/lacrosse"},
              {sport:"Hockey",img:"/landing/IMG_4092.PNG",href:"/hockey"},
              {sport:"Softball",img:"/landing/IMG_4093.PNG",href:"/softball-nation"},
              {sport:"Rowing",img:"/landing/IMG_4094.PNG",href:"/rowing-elite"},
              {sport:"Cycling",img:"/landing/IMG_4095.PNG",href:"/cycling"},
            ].map((c,i)=>(
              <Link key={i} href={c.href}>
                <div className="relative rounded-xl overflow-hidden cursor-pointer group h-36 hover:scale-[1.02] transition-transform duration-300">
                  <img src={c.img} alt={c.sport} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute bottom-0 left-0 p-3">
                    <p className="text-white font-black text-sm drop-shadow-lg">{c.sport}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Boxing + MMA + remaining sports */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            {[
              {sport:"Boxing",sub:"Boxing Elite™",img:"/landing/IMG_4098.PNG",href:"/boxing",badge:"LIVE"},
              {sport:"MMA",sub:"MMA Elite™",img:"/landing/IMG_4099.PNG",href:"/mma",badge:"LIVE"},
            ].map((c,i)=>(
              <Link key={i} href={c.href}>
                <div className="relative rounded-2xl overflow-hidden cursor-pointer group h-48 hover:scale-[1.02] transition-transform duration-300">
                  <img src={c.img} alt={c.sport} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                  <div className="absolute top-3 left-3">
                    <span className="bg-red-600 text-white text-xs font-black px-3 py-1 rounded-full">{c.badge}</span>
                  </div>
                  <div className="absolute bottom-0 left-0 p-5">
                    <p className="text-white font-black text-2xl drop-shadow-lg">{c.sport}</p>
                    <p className="text-red-300 text-sm font-bold">{c.sub}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* All remaining 24 sports — emoji grid */}
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3">
            {SPORTS_44.slice(10).map((s, i) => (
              <Link key={i} href={s.h}>
                <div className="bg-[#1a2a4a] border border-blue-800 rounded-xl p-3 hover:border-yellow-400 hover:bg-[#1e3055] transition-all cursor-pointer text-center group">
                  <div className="text-2xl mb-1">{s.e}</div>
                  <p className="text-blue-200 text-xs font-semibold group-hover:text-yellow-400 transition-colors leading-tight">{s.n}</p>
                </div>
              </Link>
            ))}
          </div>

          {/* CTA into full platform */}
          <div className="text-center mt-12">
            <Link href="/portal">
              <button className="bg-blue-600 hover:bg-blue-500 text-white font-black text-xl px-12 py-5 rounded-2xl border border-blue-400 transition-all hover:scale-105 shadow-2xl shadow-blue-900/50">
                ENTER THE FULL PLATFORM →
              </button>
            </Link>
            <p className="text-blue-400 text-sm mt-3">athlynx.ai · All 44 Sports · Free 7-Day Trial</p>
          </div>
        </div>
      </section>

      {/* ── LAYER CAKE ── */}
      <section className="py-20 px-4 bg-[#0d1f3c]">
        <div className="max-w-4xl mx-auto">
          <p className="text-yellow-400 text-sm font-bold uppercase tracking-widest text-center mb-2">The Infrastructure</p>
          <h2 className="text-4xl font-black text-white text-center mb-2">FULL STACK <span className="text-yellow-400">LAYER CAKE</span></h2>
          <p className="text-blue-200 text-center mb-10">The CERN of US sports tech. Every layer purpose-built and live.</p>
          <div className="space-y-3">
            {[
              {icon:"⚡",layer:"AI Layer 1",name:"Google Gemini 2.5 Flash",desc:"Primary AI — sports intelligence, real-time"},
              {icon:"🧠",layer:"AI Layer 2",name:"Anthropic Claude Opus",desc:"Deep reasoning — contract analysis, NIL evaluation"},
              {icon:"💻",layer:"AI Layer 3",name:"Nebius Llama-3.3-70B on NVIDIA H200",desc:"Always-on fallback — zero downtime"},
              {icon:"🚀",layer:"Deploy",name:"Vercel + GitHub",desc:"Auto-deploy on every push — zero config"},
              {icon:"🗄️",layer:"Database",name:"Neon PostgreSQL + PlanetScale",desc:"Dual failover — never loses connection"},
              {icon:"💳",layer:"Payments",name:"Stripe — AthlynXAI Corporation",desc:"Live payments, subscriptions, NIL transactions"},
              {icon:"📱",layer:"Social",name:"Buffer — 10 Channels",desc:"347 posts fired worldwide — automated daily"},
              {icon:"☁️",layer:"Storage",name:"AWS S3 + SNS",desc:"Video, media, file storage + SMS notifications"},
            ].map((l,i)=>(
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

      {/* ── SIGNUP ── */}
      <section className="py-20 px-4 bg-[#0a1628]">
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
                {["Athlete","Parent","Coach","Brand / Sponsor","Agent","Investor"].map(r=><option key={r}>{r}</option>)}
              </select>
            </div>
            <button type="submit" className="w-full bg-yellow-400 hover:bg-yellow-300 text-[#0a1628] font-black text-lg py-4 rounded-xl transition-all hover:scale-[1.02] shadow-lg">
              JOIN FREE — START MY 7 DAYS →
            </button>
            <p className="text-center text-blue-400 text-xs">No credit card required · Cancel anytime · 7 days free</p>
          </form>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-[#060f1e] border-t border-blue-900 py-10 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-6">
            <div className="flex items-center gap-3">
              <img src="/athlynx-icon.png" alt="ATHLYNX" className="w-10 h-10 rounded-xl" onError={e=>(e.currentTarget.style.display='none')} />
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
