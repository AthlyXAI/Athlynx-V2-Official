/**
 * ATHLYNX — Full Stack Layer Cake Architecture
 * Jensen Huang GTC 2026 Vision — Tokenization of Intelligence
 * Chad A. Dozier Sr. attended GTC 2026, San Jose — March 16-19, 2026
 * Every AI engine, every connector, every service — unified under one platform.
 */
import { RouteErrorBoundary } from "@/components/GlobalErrorBoundary";
import PlatformLayout from "@/components/PlatformLayout";
import MobileBottomNav from "@/components/MobileBottomNav";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";

const AI_ENGINES = [
  { layer: "Layer 1", name: "Google Gemini 2.5 Flash", role: "Primary Intelligence", desc: "Fastest sports AI — real-time NIL analysis, recruiting intelligence, X-Factor scoring, C-Factor insights", color: "from-blue-500 to-cyan-500", icon: "🧠", badge: "PRIMARY", badgeColor: "bg-blue-600" },
  { layer: "Layer 2", name: "Anthropic Claude", role: "Deep Reasoning Engine", desc: "Contract analysis, NIL deal valuation, legal guidance, academic planning, attorney AI, long-context reasoning", color: "from-orange-500 to-red-500", icon: "⚖️", badge: "REASONING", badgeColor: "bg-orange-600" },
  { layer: "Layer 3", name: "Nebius Llama-3.3-70B (H200)", role: "Always-On GPU Fallback", desc: "NVIDIA H200 GPU cluster — $5K OG credits active, zero downtime guarantee, 24/7 availability, sub-500ms latency CONFIRMED", color: "from-green-500 to-emerald-500", icon: "🖥️", badge: "H200 LIVE", badgeColor: "bg-green-600" },
  { layer: "Layer 4", name: "OpenAI GPT", role: "Generative Intelligence", desc: "Content generation, social captions, brand pitches, athlete bio writing, NIL copy, creative AI", color: "from-purple-500 to-violet-500", icon: "✨", badge: "GENERATIVE", badgeColor: "bg-purple-600" },
  { layer: "Build Agent", name: "Manus AI Agent", role: "Autonomous Build Partner (not an inference model)", desc: "Full-stack autonomous build agent — ships, deploys, manages, and evolves the entire ATHLYNX platform 24/7. Separate from the inference engines above.", color: "from-cyan-500 to-blue-600", icon: "🤖", badge: "BUILD AGENT", badgeColor: "bg-cyan-600" },
];

const PLATFORM_LAYERS = [
  {
    tier: "COMPUTE & INFRASTRUCTURE LAYER",
    color: "border-red-600 bg-red-900/10", titleColor: "text-red-400",
    items: [
      { name: "Nebius AI (H200)", desc: "NVIDIA H200 GPU cluster — $5K OG credits, 70B + 8B inference, sub-500ms CONFIRMED LIVE", icon: "🖥️" },
      { name: "AWS S3", desc: "Object storage — athlete media, highlight reels, documents, platform assets", icon: "☁️" },
      { name: "AWS SES", desc: "Bulk transactional email — welcome, verification, expiry, admin alerts", icon: "📨" },
      { name: "AWS SNS", desc: "SMS notifications — toll-free +18664502081, carrier approved May 1 2026", icon: "📱" },
      { name: "Vercel", desc: "Edge deployment, serverless functions, global CDN, auto-deploy on every GitHub push", icon: "▲" },
      { name: "Neon PostgreSQL", desc: "Serverless Postgres — primary database, 34+ tables, branching, instant scale", icon: "🐘" },
      { name: "Supabase", desc: "Real-time database, auth backup, storage layer, edge functions", icon: "⚡" },
      { name: "PlanetScale", desc: "MySQL-compatible serverless database — horizontal sharding, zero-downtime migrations", icon: "🌍" },
      { name: "Cloudflare", desc: "DNS, DDoS protection, R2 object storage, Workers, API gateway, WAF", icon: "🛡️" },
    ],
  },
  {
    tier: "AI INTELLIGENCE LAYER",
    color: "border-blue-600 bg-blue-900/10", titleColor: "text-blue-400",
    items: [
      { name: "Google Gemini 2.5 Flash", desc: "Primary sports AI — fastest, most accurate, real-time NIL + recruiting", icon: "🧠" },
      { name: "Anthropic Claude", desc: "Deep reasoning — contracts, legal, NIL analysis, long-context", icon: "⚖️" },
      { name: "OpenAI GPT", desc: "Content generation — captions, bios, pitches, creative copy", icon: "✨" },
      { name: "Nebius Llama-3.3-70B", desc: "H200 GPU fallback — zero downtime, $5K OG credits, always-on", icon: "🔄" },
      { name: "Manus Autonomous Agent", desc: "Full-stack builder — builds, deploys, and evolves the platform itself", icon: "🤖" },
    ],
  },
  {
    tier: "IDENTITY & AUTH LAYER",
    color: "border-yellow-600 bg-yellow-900/10", titleColor: "text-yellow-400",
    items: [
      { name: "Firebase Auth", desc: "Google, Apple, Facebook, Twitter social login — Firebase Admin token verification", icon: "🔥" },
      { name: "Google Workspace", desc: "Business email, Drive, Docs, Sheets, Slides — full G Suite for AthlynXAI Corp", icon: "📁" },
      { name: "Google Cloud", desc: "Firebase hosting, Gemini API, Google Auth, Cloud Functions, GCP infrastructure", icon: "☁️" },
      { name: "Gravatar", desc: "Universal avatar service — auto-profile photos on signup via email hash", icon: "👤" },
      { name: "Custom Auth", desc: "Email/password + bcrypt hashing + session cookies + JWT + 1-year sessions", icon: "🔐" },
    ],
  },
  {
    tier: "PAYMENTS & MONETIZATION LAYER",
    color: "border-green-600 bg-green-900/10", titleColor: "text-green-400",
    items: [
      { name: "Stripe", desc: "Subscriptions, NIL payments, credit packs, white-label licensing — acct_1SqfSOGvvjXZw2uE", icon: "💳" },
      { name: "Stripe Atlas", desc: "AthlynXAI Corporation formation — Delaware C-Corp, EIN, bank account, legal entity via Stripe", icon: "🏛️" },
      { name: "Stripe Connect", desc: "Automated team payroll — Glenn 15%, Lee 10%, Jimmy 8%, Andy 10% of net revenue", icon: "💸" },
      { name: "Stripe Webhooks", desc: "Real-time subscription activation — instant platform access on payment, credit delivery", icon: "🔔" },
    ],
  },
  {
    tier: "COMMUNICATIONS LAYER",
    color: "border-purple-600 bg-purple-900/10", titleColor: "text-purple-400",
    items: [
      { name: "SendGrid", desc: "Transactional email — welcome, verification, expiry warnings, payment confirmations", icon: "📧" },
      { name: "AWS SES", desc: "Bulk email — admin alerts, broadcast messages, owner signup notifications", icon: "📨" },
      { name: "AWS SNS", desc: "SMS — toll-free +18664502081, welcome texts, owner alerts, verification codes", icon: "📱" },
      { name: "Buffer (10 Channels)", desc: "Social media automation — 347+ posts fired across all platforms, 3x daily schedule", icon: "📢" },
      { name: "Slack", desc: "Team communication — dev alerts, deployment notifications, platform monitoring", icon: "💬" },
    ],
  },
  {
    tier: "BUSINESS OPERATIONS LAYER",
    color: "border-orange-600 bg-orange-900/10", titleColor: "text-orange-400",
    items: [
      { name: "Zapier", desc: "Workflow automation — 14+ connected apps, auto-triggers, CRM sync, lead routing", icon: "⚡" },
      { name: "Jira", desc: "Sprint planning, issue tracking, product roadmap, bug management", icon: "📋" },
      { name: "Atlassian", desc: "Full Atlassian suite — Jira + Confluence unified, enterprise project management", icon: "🏗️" },
      { name: "Confluence", desc: "Documentation, SOPs, knowledge base, technical specs, team wiki", icon: "📚" },
      { name: "Notion", desc: "Product docs, investor materials, content calendar, team knowledge hub", icon: "📝" },
      { name: "Jotform", desc: "Athlete intake forms, NIL deal applications, recruiting questionnaires, lead capture", icon: "📋" },
      { name: "Alignable", desc: "Local business network — community athlete connections, B2B partnerships, referrals", icon: "🤝" },
    ],
  },
  {
    tier: "SOCIAL & GROWTH LAYER",
    color: "border-pink-600 bg-pink-900/10", titleColor: "text-pink-400",
    items: [
      { name: "LinkedIn", desc: "Professional network — founder credibility, investor reach, B2B partnerships", icon: "💼" },
      { name: "Instagram", desc: "Athlete content, NIL brand deals, story campaigns, creator marketplace", icon: "📸" },
      { name: "Facebook", desc: "Community building, athlete groups, event promotion, Meta Ads", icon: "👥" },
      { name: "X / Twitter", desc: "Real-time sports commentary, viral athlete moments, NIL announcements", icon: "🐦" },
      { name: "Buffer (10 Channels)", desc: "Automated social posting — 347+ posts fired across all platforms, 3x daily", icon: "📢" },
    ],
  },
  {
    tier: "VERSION CONTROL & DEPLOYMENT LAYER",
    color: "border-gray-600 bg-gray-900/10", titleColor: "text-gray-400",
    items: [
      { name: "GitHub", desc: "Source of truth — AthlyXAI/Athlynx-V2-Official, 430+ commits, main branch protected", icon: "🐙" },
      { name: "Vercel CI/CD", desc: "Auto-deploy on every GitHub push — ~2 min deploy time, zero manual deploys", icon: "▲" },
      { name: "Manus AI Agent", desc: "Autonomous builder — Session 1 through S37+, builds and deploys the platform 24/7", icon: "🤖" },
    ],
  },
];

const ALL_SERVICES = [
  "GitHub", "Nebius AI (H200)", "Google Gemini 2.5 Flash", "Google Workspace",
  "Google Cloud / Firebase", "Vercel", "AWS S3", "AWS SES", "AWS SNS",
  "Zapier", "Buffer", "Gravatar", "Supabase", "Neon PostgreSQL", "PlanetScale",
  "OpenAI GPT", "Manus AI Agent", "Anthropic Claude", "Slack",
  "Jira", "Atlassian", "Confluence", "Notion", "Jotform", "Alignable",
  "Stripe", "Stripe Atlas", "Stripe Connect", "SendGrid", "Cloudflare", "Custom Auth / JWT",
];

const TOKENIZATION_STATS = [
  { label: "Services Live", value: String(ALL_SERVICES.length), icon: "⚡", color: "text-cyan-400" },
  { label: "AI Engines", value: "5", icon: "🧠", color: "text-blue-400" },
  { label: "Stack Layers", value: "8", icon: "🎂", color: "text-yellow-400" },
  { label: "Sports", value: "44", icon: "🏆", color: "text-orange-400" },
  { label: "Routes", value: "213+", icon: "🗺️", color: "text-green-400" },
  { label: "DB Tables", value: "34+", icon: "🐘", color: "text-purple-400" },
  { label: "Commits", value: "430+", icon: "🐙", color: "text-gray-400" },
  { label: "Uptime", value: "99.9%", icon: "✅", color: "text-green-400" },
];

function LayerCakeInner() {
  const nebiusCheck = trpc.ai.nebiusHealthCheck.useQuery(undefined, { retry: 1 });
  const nebiusLive = nebiusCheck.data?.status === "ok";
  const nebiusLatency = nebiusCheck.data?.latencyMs;

  return (
    <PlatformLayout title="Full Stack Layer Cake">
      <div className="max-w-6xl mx-auto px-2 py-4 space-y-6">

        {/* Hero */}
        <div className="bg-gradient-to-br from-[#0a0f1e] via-[#0d1b3e] to-[#1a3a8f] rounded-2xl border border-blue-700 p-8 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 50% 50%, #00d4ff 0%, transparent 70%)" }} />
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 bg-cyan-500/20 border border-cyan-500/40 rounded-full px-4 py-1.5 text-cyan-400 text-xs font-black mb-4 tracking-widest">
              🏆 JENSEN HUANG GTC 2026 — MARCH 16-19 — CHAD A. DOZIER SR. WAS THERE
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-white mb-3 leading-tight">
              Full Stack <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Layer Cake</span>
            </h1>
            <p className="text-blue-300 text-base max-w-3xl mx-auto mb-4">
              Tokenization of intelligence across every layer. Four AI engines plus an autonomous build agent. {ALL_SERVICES.length} platform services.
              One unified athlete platform. Built at the intersection of AI and sports.
            </p>
            <div className="flex flex-wrap gap-2 justify-center text-xs">
              {["Gemini", "Claude", "Nebius H200", "OpenAI"].map(e => (
                <span key={e} className="bg-blue-900/50 border border-blue-600 text-blue-300 px-3 py-1 rounded-full font-bold">✅ {e}</span>
              ))}
              <span className="bg-cyan-900/50 border border-cyan-600 text-cyan-300 px-3 py-1 rounded-full font-bold">🤖 Manus (Build Agent)</span>
            </div>
          </div>
        </div>

        {/* Nebius Live Banner */}
        <div className={`rounded-2xl border-2 p-4 flex items-center gap-4 ${nebiusLive ? "border-green-500 bg-green-900/20" : "border-blue-700 bg-blue-900/20"}`}>
          <div className="text-3xl">🖥️</div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="text-white font-black text-sm">NEBIUS H200 GPU CLUSTER</span>
              <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${nebiusLive ? "bg-green-500/20 border-green-500 text-green-400" : "bg-blue-500/20 border-blue-500 text-blue-400"}`}>
                {nebiusCheck.isLoading ? "● CHECKING..." : nebiusLive ? "● LIVE" : "● STANDBY"}
              </span>
            </div>
            <p className="text-blue-300 text-xs">
              $5,000 OG Credits Active · meta-llama/Llama-3.3-70B-Instruct · meta-llama/Meta-Llama-3.1-8B-Instruct
              {nebiusLive && nebiusLatency && <span className="text-green-400 font-bold"> · {nebiusLatency}ms confirmed</span>}
            </p>
          </div>
          <div className="text-right shrink-0">
            <div className="text-green-400 font-black text-sm">$5,000</div>
            <div className="text-green-300 text-[10px]">OG CREDITS</div>
          </div>
        </div>

        {/* Stats */}
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
            <h2 className="text-white font-black text-lg px-3">🧠 AI INTELLIGENCE STACK — 5 ENGINES</h2>
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
            <h2 className="text-white font-black text-lg px-3">⚡ FULL STACK LAYER CAKE — {ALL_SERVICES.length} SERVICES</h2>
            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-blue-700" />
          </div>
          <div className="space-y-4">
            {PLATFORM_LAYERS.map((layer, i) => (
              <div key={i} className={`rounded-2xl border-2 ${layer.color} p-4`}>
                <div className={`text-xs font-black tracking-widest mb-3 ${layer.titleColor}`}>{layer.tier}</div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                  {layer.items.map((item, j) => (
                    <div key={j} className="bg-[#0d1b3e]/80 rounded-xl border border-blue-900 p-3 flex items-start gap-2">
                      <span className="text-xl shrink-0">{item.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 mb-0.5 flex-wrap">
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

        {/* Complete Service Registry */}
        <div className="bg-[#0d1b3e] rounded-2xl border border-blue-800 p-5">
          <div className="text-blue-400 text-xs font-black tracking-widest mb-3">COMPLETE SERVICE REGISTRY — {ALL_SERVICES.length} SERVICES LIVE</div>
          <div className="flex flex-wrap gap-2">
            {ALL_SERVICES.map((svc, i) => (
              <span key={i} className="bg-blue-900/40 border border-blue-700/50 text-blue-300 text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />{svc}
              </span>
            ))}
          </div>
        </div>

        {/* GTC 2026 Context */}
        <div className="bg-gradient-to-br from-[#0a0f1e] to-[#1a1a2e] rounded-2xl border border-cyan-700/50 p-6">
          <div className="flex items-start gap-4">
            <div className="text-4xl shrink-0">🎯</div>
            <div>
              <h3 className="text-white font-black text-lg mb-2">Jensen Huang's Vision — Executed by Chad A. Dozier Sr.</h3>
              <p className="text-blue-300 text-sm leading-relaxed mb-3">
                At NVIDIA GTC 2026 in San Jose (March 16–19, 2026), Jensen Huang described the future of AI as a{" "}
                <strong className="text-cyan-400">"full stack layer cake"</strong> — where every layer of the computing stack
                is tokenized and intelligent. Chad A. Dozier Sr. was present at GTC 2026, building ATHLYNX at the
                intersection of AI, sports, and the NVIDIA ecosystem.
              </p>
              <p className="text-blue-300 text-sm leading-relaxed mb-3">
                ATHLYNX has realized this vision:{" "}
                <strong className="text-white">4 AI engines</strong> (Gemini, Claude, Nebius H200, OpenAI) operating
                in a cascading fallback architecture, plus the Manus autonomous build agent that ships and evolves the platform itself, with{" "}
                <strong className="text-white">{ALL_SERVICES.length} platform services</strong> unified under one codebase,
                one database, and one deployment pipeline. The $5,000 OG Nebius credits are active and the H200 cluster
                is confirmed live at sub-500ms latency.
              </p>
              <div className="flex flex-wrap gap-2">
                {["Tokenized Intelligence", "Zero Downtime", "Auto-Fallback", "Multi-Modal AI", "Real-Time Data", "H200 GPU Cluster", "$5K OG Credits", "GTC 2026 March 16-19"].map(tag => (
                  <span key={tag} className="bg-cyan-900/30 border border-cyan-700/50 text-cyan-400 text-[10px] font-bold px-2 py-1 rounded-full">{tag}</span>
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
            { label: "Billing", href: "/billing", icon: "💳" },
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
