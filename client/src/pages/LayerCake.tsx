/**
 * ATHLYNX — Full Stack Layer Cake Architecture
 * Jensen Huang GTC 2026 Vision — Tokenization of Intelligence
 * Every AI engine, every connector, every service — unified under one platform.
 */
import { RouteErrorBoundary } from "@/components/GlobalErrorBoundary";
import PlatformLayout from "@/components/PlatformLayout";
import MobileBottomNav from "@/components/MobileBottomNav";
import { Link } from "wouter";

const AI_ENGINES = [
  {
    layer: "Layer 1",
    name: "Google Gemini 2.5 Flash",
    role: "Primary Intelligence",
    desc: "Fastest sports AI — real-time NIL analysis, recruiting intelligence, X-Factor scoring",
    status: "LIVE",
    color: "from-blue-500 to-cyan-500",
    icon: "🧠",
    badge: "PRIMARY",
    badgeColor: "bg-blue-600",
  },
  {
    layer: "Layer 2",
    name: "Anthropic Claude Opus",
    role: "Deep Reasoning Engine",
    desc: "Contract analysis, NIL deal valuation, legal guidance, academic planning, attorney AI",
    status: "LIVE",
    color: "from-orange-500 to-red-500",
    icon: "⚖️",
    badge: "REASONING",
    badgeColor: "bg-orange-600",
  },
  {
    layer: "Layer 3",
    name: "Nebius Llama-3.3-70B",
    role: "Always-On GPU Fallback",
    desc: "NVIDIA H200 GPU cluster — zero downtime guarantee, $5K GPU credits, 24/7 availability",
    status: "LIVE",
    color: "from-green-500 to-emerald-500",
    icon: "🖥️",
    badge: "FALLBACK",
    badgeColor: "bg-green-600",
  },
  {
    layer: "Layer 4",
    name: "OpenAI GPT",
    role: "Generative Intelligence",
    desc: "Content generation, social captions, brand pitches, athlete bio writing, NIL copy",
    status: "LIVE",
    color: "from-purple-500 to-violet-500",
    icon: "✨",
    badge: "GENERATIVE",
    badgeColor: "bg-purple-600",
  },
  {
    layer: "Layer 5",
    name: "Manus AI Agent",
    role: "Autonomous Builder",
    desc: "Full-stack autonomous agent — builds, deploys, manages, and evolves the platform 24/7",
    status: "LIVE",
    color: "from-cyan-500 to-blue-600",
    icon: "🤖",
    badge: "AUTONOMOUS",
    badgeColor: "bg-cyan-600",
  },
];

const PLATFORM_LAYERS = [
  {
    tier: "COMPUTE LAYER",
    color: "border-red-600 bg-red-900/10",
    titleColor: "text-red-400",
    items: [
      { name: "Nebius AI", desc: "NVIDIA H200 GPU cluster — 70B parameter inference", icon: "🖥️", status: "LIVE" },
      { name: "AWS", desc: "S3 storage, SES email, SNS SMS, IAM security", icon: "☁️", status: "LIVE" },
      { name: "Vercel", desc: "Edge deployment, serverless functions, global CDN", icon: "▲", status: "LIVE" },
      { name: "Neon PostgreSQL", desc: "Serverless Postgres — primary database", icon: "🐘", status: "LIVE" },
      { name: "Supabase", desc: "Real-time database, auth, storage backup layer", icon: "⚡", status: "LIVE" },
    ],
  },
  {
    tier: "AI INTELLIGENCE LAYER",
    color: "border-blue-600 bg-blue-900/10",
    titleColor: "text-blue-400",
    items: [
      { name: "Google Gemini 2.5 Flash", desc: "Primary sports AI — fastest, most accurate", icon: "🧠", status: "LIVE" },
      { name: "Anthropic Claude Opus", desc: "Deep reasoning — contracts, legal, NIL analysis", icon: "⚖️", status: "LIVE" },
      { name: "OpenAI GPT", desc: "Content generation — captions, bios, pitches", icon: "✨", status: "LIVE" },
      { name: "Nebius Llama-3.3-70B", desc: "Always-on fallback — zero downtime", icon: "🔄", status: "LIVE" },
      { name: "Manus Autonomous Agent", desc: "Full-stack builder — builds the platform itself", icon: "🤖", status: "LIVE" },
    ],
  },
  {
    tier: "IDENTITY & AUTH LAYER",
    color: "border-yellow-600 bg-yellow-900/10",
    titleColor: "text-yellow-400",
    items: [
      { name: "Firebase Auth", desc: "Google, Apple, Facebook, Twitter social login", icon: "🔥", status: "LIVE" },
      { name: "Gravatar", desc: "Universal avatar service — auto-profile photos", icon: "👤", status: "LIVE" },
      { name: "Custom Auth", desc: "Email/password + session cookies + JWT", icon: "🔐", status: "LIVE" },
    ],
  },
  {
    tier: "PAYMENTS & MONETIZATION LAYER",
    color: "border-green-600 bg-green-900/10",
    titleColor: "text-green-400",
    items: [
      { name: "Stripe", desc: "Subscriptions, NIL payments, white-label licensing, payroll", icon: "💳", status: "LIVE" },
      { name: "Stripe Connect", desc: "Team payroll — Glenn 15%, Lee 10%, Jimmy 8%, Andy 10%", icon: "💸", status: "LIVE" },
      { name: "Stripe Webhooks", desc: "Real-time subscription activation — instant access on payment", icon: "🔔", status: "LIVE" },
    ],
  },
  {
    tier: "COMMUNICATIONS LAYER",
    color: "border-purple-600 bg-purple-900/10",
    titleColor: "text-purple-400",
    items: [
      { name: "SendGrid", desc: "Transactional email — welcome, verification, expiry warnings", icon: "📧", status: "LIVE" },
      { name: "AWS SES", desc: "Bulk email — admin alerts, broadcast messages", icon: "📨", status: "LIVE" },
      { name: "Twilio", desc: "SMS verification, WhatsApp athlete alerts", icon: "📱", status: "LIVE" },
      { name: "Buffer", desc: "Social media automation — 10 channels, 3x daily posts", icon: "📢", status: "LIVE" },
    ],
  },
  {
    tier: "BUSINESS OPERATIONS LAYER",
    color: "border-orange-600 bg-orange-900/10",
    titleColor: "text-orange-400",
    items: [
      { name: "Zapier", desc: "Workflow automation — connects 14+ apps, auto-triggers", icon: "⚡", status: "LIVE" },
      { name: "Jira", desc: "Sprint planning, issue tracking, product roadmap", icon: "📋", status: "LIVE" },
      { name: "Confluence", desc: "Documentation, SOPs, knowledge base", icon: "📚", status: "LIVE" },
      { name: "Trello", desc: "Visual project boards, team task management", icon: "📌", status: "LIVE" },
      { name: "Atlassian", desc: "Full Atlassian suite — Jira + Confluence + Trello unified", icon: "🏗️", status: "LIVE" },
    ],
  },
  {
    tier: "SOCIAL & GROWTH LAYER",
    color: "border-pink-600 bg-pink-900/10",
    titleColor: "text-pink-400",
    items: [
      { name: "LinkedIn", desc: "Professional network — founder credibility, investor reach", icon: "💼", status: "LIVE" },
      { name: "Instagram", desc: "Athlete content, NIL brand deals, story campaigns", icon: "📸", status: "LIVE" },
      { name: "Facebook", desc: "Community building, athlete groups, event promotion", icon: "👥", status: "LIVE" },
      { name: "X / Twitter", desc: "Real-time sports commentary, viral athlete moments", icon: "🐦", status: "LIVE" },
      { name: "Alignable", desc: "Local business network — community athlete connections", icon: "🤝", status: "LIVE" },
    ],
  },
  {
    tier: "VERSION CONTROL & DEPLOYMENT LAYER",
    color: "border-gray-600 bg-gray-900/10",
    titleColor: "text-gray-400",
    items: [
      { name: "GitHub", desc: "Source of truth — AthlyXAI/Athlynx-V2-Official, 430+ commits", icon: "🐙", status: "LIVE" },
      { name: "Vercel CI/CD", desc: "Auto-deploy on every GitHub push — zero manual deploys", icon: "▲", status: "LIVE" },
      { name: "Cloudflare", desc: "DNS, DDoS protection, R2 storage, API gateway", icon: "🛡️", status: "LIVE" },
    ],
  },
];

const TOKENIZATION_STATS = [
  { label: "AI Engines", value: "5", icon: "🧠", color: "text-blue-400" },
  { label: "Platform Services", value: "30+", icon: "⚡", color: "text-cyan-400" },
  { label: "Sports Supported", value: "44", icon: "🏆", color: "text-yellow-400" },
  { label: "Routes / Pages", value: "213+", icon: "🗺️", color: "text-green-400" },
  { label: "DB Tables", value: "40+", icon: "🐘", color: "text-purple-400" },
  { label: "API Endpoints", value: "100+", icon: "🔌", color: "text-orange-400" },
  { label: "GitHub Commits", value: "430+", icon: "🐙", color: "text-gray-400" },
  { label: "Uptime", value: "99.9%", icon: "✅", color: "text-green-400" },
];

function LayerCakeInner() {
  return (
    <PlatformLayout title="Full Stack Layer Cake">
      <div className="max-w-6xl mx-auto px-2 py-4 space-y-6">

        {/* Hero */}
        <div className="bg-gradient-to-br from-[#0a0f1e] via-[#0d1b3e] to-[#1a3a8f] rounded-2xl border border-blue-700 p-8 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 50% 50%, #00d4ff 0%, transparent 70%)" }} />
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 bg-cyan-500/20 border border-cyan-500/40 rounded-full px-4 py-1.5 text-cyan-400 text-xs font-black mb-4 tracking-widest">
              🏆 JENSEN HUANG GTC 2026 VISION — REALIZED
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-white mb-3 leading-tight">
              Full Stack <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Layer Cake</span>
            </h1>
            <p className="text-blue-300 text-base max-w-3xl mx-auto mb-4">
              Tokenization of intelligence across every layer. Five AI engines. Thirty platform services. 
              One unified athlete platform. Built by Chad A. Dozier — deployed at the intersection of AI and sports.
            </p>
            <div className="flex flex-wrap gap-2 justify-center text-xs">
              {["Gemini", "Claude", "Nebius", "OpenAI", "Manus"].map(e => (
                <span key={e} className="bg-blue-900/50 border border-blue-600 text-blue-300 px-3 py-1 rounded-full font-bold">
                  ✅ {e}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
          {TOKENIZATION_STATS.map(stat => (
            <div key={stat.label} className="bg-[#0d1b3e] rounded-xl border border-blue-800 p-3 text-center">
              <div className="text-xl mb-1">{stat.icon}</div>
              <div className={`text-xl font-black ${stat.color}`}>{stat.value}</div>
              <div className="text-blue-500 text-[9px] mt-0.5 leading-tight">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* AI Engine Stack */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-blue-700" />
            <h2 className="text-white font-black text-lg px-3">🧠 AI INTELLIGENCE STACK</h2>
            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-blue-700" />
          </div>
          <div className="space-y-3">
            {AI_ENGINES.map((engine, i) => (
              <div key={i} className="bg-[#0d1b3e] rounded-2xl border border-blue-800 overflow-hidden hover:border-blue-600 transition-all">
                <div className={`bg-gradient-to-r ${engine.color} p-4 flex items-center justify-between`}>
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{engine.icon}</span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-white font-black text-base">{engine.name}</span>
                        <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-full text-white ${engine.badgeColor}`}>{engine.badge}</span>
                      </div>
                      <div className="text-white/80 text-xs">{engine.role}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-white/60 text-xs font-mono">{engine.layer}</span>
                    <span className="bg-green-500/20 border border-green-500 text-green-400 text-[9px] font-black px-2 py-0.5 rounded-full">● LIVE</span>
                  </div>
                </div>
                <div className="px-4 py-2">
                  <p className="text-blue-300 text-xs">{engine.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Platform Layer Cake */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-blue-700" />
            <h2 className="text-white font-black text-lg px-3">⚡ PLATFORM LAYER CAKE</h2>
            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-blue-700" />
          </div>
          <div className="space-y-4">
            {PLATFORM_LAYERS.map((layer, i) => (
              <div key={i} className={`rounded-2xl border-2 ${layer.color} p-4`}>
                <div className={`text-xs font-black tracking-widest mb-3 ${layer.titleColor}`}>
                  {layer.tier}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                  {layer.items.map((item, j) => (
                    <div key={j} className="bg-[#0d1b3e]/80 rounded-xl border border-blue-900 p-3 flex items-start gap-2">
                      <span className="text-xl shrink-0">{item.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <span className="text-white font-bold text-xs">{item.name}</span>
                          <span className="text-green-400 text-[9px] font-black">● LIVE</span>
                        </div>
                        <p className="text-blue-400 text-[10px] leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* GTC 2026 Context */}
        <div className="bg-gradient-to-br from-[#0a0f1e] to-[#1a1a2e] rounded-2xl border border-cyan-700/50 p-6">
          <div className="flex items-start gap-4">
            <div className="text-4xl shrink-0">🎯</div>
            <div>
              <h3 className="text-white font-black text-lg mb-2">Jensen Huang's Vision — Executed</h3>
              <p className="text-blue-300 text-sm leading-relaxed mb-3">
                At NVIDIA GTC 2026 in San Jose (March 13-16), Jensen Huang described the future of AI as a 
                <strong className="text-cyan-400"> "full stack layer cake"</strong> — where every layer of the computing stack 
                is tokenized and intelligent. Chad A. Dozier was present at GTC 2026, building ATHLYNX at the 
                intersection of AI and sports.
              </p>
              <p className="text-blue-300 text-sm leading-relaxed mb-3">
                ATHLYNX has realized this vision: <strong className="text-white">5 AI engines</strong> (Gemini, Claude, Nebius, OpenAI, Manus) 
                operating in a cascading fallback architecture, with <strong className="text-white">30+ platform services</strong> unified 
                under one codebase, one database, and one deployment pipeline.
              </p>
              <div className="flex flex-wrap gap-2">
                {["Tokenized Intelligence", "Zero Downtime", "Auto-Fallback", "Multi-Modal AI", "Real-Time Data"].map(tag => (
                  <span key={tag} className="bg-cyan-900/30 border border-cyan-700/50 text-cyan-400 text-[10px] font-bold px-2 py-1 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Investor Hub", href: "/investor-hub", icon: "💼" },
            { label: "Data Dashboard", href: "/data-dashboard", icon: "📊" },
            { label: "Infrastructure", href: "/infrastructure", icon: "🏗️" },
            { label: "Partners", href: "/partners", icon: "🤝" },
          ].map(link => (
            <Link key={link.href} href={link.href}>
              <div className="bg-[#0d1b3e] rounded-xl border border-blue-800 p-3 text-center hover:border-cyan-600 hover:bg-blue-900/30 transition-all cursor-pointer">
                <div className="text-2xl mb-1">{link.icon}</div>
                <div className="text-white text-xs font-bold">{link.label}</div>
              </div>
            </Link>
          ))}
        </div>

      </div>
      <MobileBottomNav />
    </PlatformLayout>
  );
}

export default function LayerCake() {
  return <RouteErrorBoundary><LayerCakeInner /></RouteErrorBoundary>;
}
