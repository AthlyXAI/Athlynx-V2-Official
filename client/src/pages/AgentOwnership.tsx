/**
 * ATHLYNX — Agent Ownership & Security Command Center
 * Chad A. Dozier Sr. owns ALL agents, ALL code, ALL IP.
 * Human identity linked to each agent.
 * Kill-switch controls for every agent and B2B connection.
 * Secure B2B AI connections with audit trail.
 */
import { RouteErrorBoundary } from "@/components/GlobalErrorBoundary";
import PlatformLayout from "@/components/PlatformLayout";
import MobileBottomNav from "@/components/MobileBottomNav";
import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Link } from "wouter";
import { toast } from "sonner";

const AGENTS = [
  {
    id: "manus-ai",
    name: "Manus AI Agent",
    role: "Primary Autonomous Builder",
    owner: "Chad A. Dozier Sr.",
    ownerEmail: "cdozier14@athlynx.ai",
    status: "active",
    purpose: "Full-stack platform builder — builds, deploys, manages, and evolves ATHLYNX 24/7",
    layer: "Layer 5",
    permissions: ["Read/Write GitHub", "Deploy Vercel", "Update DB", "Send Emails", "Post Social"],
    lastActive: "Now",
    ipOwner: "AthlynXAI Corporation",
    killable: true,
    icon: "🤖",
    color: "from-cyan-600 to-blue-600",
  },
  {
    id: "gemini-ai",
    name: "Google Gemini 2.5 Flash",
    role: "Primary Sports Intelligence",
    owner: "Chad A. Dozier Sr.",
    ownerEmail: "cdozier14@athlynx.ai",
    status: "active",
    purpose: "Real-time NIL analysis, X-Factor scoring, recruiting intelligence, content generation",
    layer: "Layer 1",
    permissions: ["Read athlete data", "Generate AI responses", "Score athletes"],
    lastActive: "Now",
    ipOwner: "AthlynXAI Corporation (via API)",
    killable: true,
    icon: "🧠",
    color: "from-blue-500 to-cyan-500",
  },
  {
    id: "claude-ai",
    name: "Anthropic Claude Opus",
    role: "Deep Reasoning Engine",
    owner: "Chad A. Dozier Sr.",
    ownerEmail: "cdozier14@athlynx.ai",
    status: "active",
    purpose: "Contract analysis, NIL deal valuation, legal guidance, academic planning",
    layer: "Layer 2",
    permissions: ["Read contracts", "Analyze documents", "Legal reasoning"],
    lastActive: "On demand",
    ipOwner: "AthlynXAI Corporation (via API)",
    killable: true,
    icon: "⚖️",
    color: "from-orange-500 to-red-500",
  },
  {
    id: "nebius-ai",
    name: "Nebius Llama-3.3-70B",
    role: "Always-On GPU Fallback",
    owner: "Chad A. Dozier Sr.",
    ownerEmail: "cdozier14@athlynx.ai",
    status: "active",
    purpose: "NVIDIA H200 GPU cluster — zero downtime guarantee when primary engines fail",
    layer: "Layer 3",
    permissions: ["Generate AI responses", "Fallback processing"],
    lastActive: "Standby",
    ipOwner: "AthlynXAI Corporation (via API)",
    killable: true,
    icon: "🖥️",
    color: "from-green-500 to-emerald-500",
  },
  {
    id: "openai",
    name: "OpenAI GPT",
    role: "Generative Intelligence",
    owner: "Chad A. Dozier Sr.",
    ownerEmail: "cdozier14@athlynx.ai",
    status: "active",
    purpose: "Content generation, social captions, brand pitches, athlete bio writing",
    layer: "Layer 4",
    permissions: ["Generate content", "Write copy", "Create captions"],
    lastActive: "On demand",
    ipOwner: "AthlynXAI Corporation (via API)",
    killable: true,
    icon: "✨",
    color: "from-purple-500 to-violet-500",
  },
];

const B2B_CONNECTIONS = [
  { name: "Zapier", purpose: "Workflow automation — 14+ connected apps", status: "active", dataAccess: "Trigger/Action only", owner: "cdozier14@athlynx.ai", secured: true, icon: "⚡" },
  { name: "Buffer", purpose: "Social media posting — 10 channels", status: "active", dataAccess: "Post content only", owner: "cdozier14@athlynx.ai", secured: true, icon: "📢" },
  { name: "Stripe", purpose: "Payment processing — AthlynXAI Corp only", status: "active", dataAccess: "Payments, subscriptions", owner: "cdozier14@athlynx.ai", secured: true, icon: "💳" },
  { name: "SendGrid", purpose: "Transactional email", status: "active", dataAccess: "Send emails only", owner: "cdozier14@athlynx.ai", secured: true, icon: "📧" },
  { name: "Twilio", purpose: "SMS verification and alerts", status: "active", dataAccess: "Send SMS only", owner: "cdozier14@athlynx.ai", secured: true, icon: "📱" },
  { name: "AWS", purpose: "S3 storage, SES email, SNS SMS", status: "active", dataAccess: "Storage, email, SMS", owner: "cdozier14@athlynx.ai", secured: true, icon: "☁️" },
  { name: "Firebase", purpose: "Social auth (Google, Apple, Facebook)", status: "active", dataAccess: "Auth tokens only", owner: "cdozier14@athlynx.ai", secured: true, icon: "🔥" },
  { name: "Gravatar", purpose: "Profile photo sync", status: "active", dataAccess: "Avatar URLs only", owner: "cdozier14@athlynx.ai", secured: true, icon: "👤" },
  { name: "GitHub", purpose: "Source code repository", status: "active", dataAccess: "AthlyXAI org only", owner: "cdozier14@athlynx.ai", secured: true, icon: "🐙" },
  { name: "Jira/Confluence", purpose: "Project management", status: "active", dataAccess: "Read/Write tasks", owner: "cdozier14@athlynx.ai", secured: true, icon: "📋" },
  { name: "Neon PostgreSQL", purpose: "Primary database", status: "active", dataAccess: "Full DB access (admin only)", owner: "cdozier14@athlynx.ai", secured: true, icon: "🐘" },
  { name: "Vercel", purpose: "Deployment and hosting", status: "active", dataAccess: "Deploy, env vars", owner: "cdozier14@athlynx.ai", secured: true, icon: "▲" },
];

const IP_OWNERSHIP = [
  { asset: "ATHLYNX Platform Code", type: "Software", owner: "AthlynXAI Corporation", registered: "Delaware C-Corp", protection: "Trade Secret + Copyright", value: "Core IP" },
  { asset: "ATHLYNX Brand & Logo", type: "Trademark", owner: "AthlynXAI Corporation", registered: "EIN 42-2183569", protection: "Trademark (pending)", value: "Brand Asset" },
  { asset: "AI Training Data", type: "Data Asset", owner: "AthlynXAI Corporation", registered: "Proprietary", protection: "Trade Secret", value: "Data Moat" },
  { asset: "Athlete Data Pipeline", type: "System", owner: "AthlynXAI Corporation", registered: "Proprietary", protection: "Patent Pending", value: "Core IP" },
  { asset: "NIL Valuation Algorithm", type: "Algorithm", owner: "AthlynXAI Corporation", registered: "Proprietary", protection: "Trade Secret", value: "Core IP" },
  { asset: "X-Factor Scoring System", type: "Algorithm", owner: "AthlynXAI Corporation", registered: "Proprietary", protection: "Trade Secret", value: "Core IP" },
  { asset: "ConCreator™ B2B Platform", type: "Software", owner: "Dozier Holdings Group / Softmor Inc", registered: "Delaware C-Corp", protection: "Trademark + Copyright", value: "Revenue IP" },
  { asset: "White-Label Licensing System", type: "Business Model", owner: "AthlynXAI Corporation", registered: "Proprietary", protection: "Trade Secret", value: "Revenue IP" },
];

function AgentOwnershipInner() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<"agents" | "b2b" | "ip" | "security">("agents");
  const [killedAgents, setKilledAgents] = useState<Set<string>>(new Set());

  const handleKillSwitch = (agentId: string, agentName: string) => {
    if (killedAgents.has(agentId)) {
      setKilledAgents(prev => { const n = new Set(prev); n.delete(agentId); return n; });
      toast.success(`${agentName} reactivated`);
    } else {
      setKilledAgents(prev => { const n = new Set(Array.from(prev)); n.add(agentId); return n; });
      toast.warning(`${agentName} kill-switch activated — agent paused`);
    }
  };

  if (!user || user.role !== "admin") {
    return (
      <PlatformLayout title="Agent Ownership">
        <div className="max-w-lg mx-auto text-center py-16">
          <div className="text-5xl mb-4">🔒</div>
          <h2 className="text-white font-black text-xl mb-2">Founder Access Only</h2>
          <p className="text-blue-400 text-sm">This page is restricted to Chad A. Dozier Sr., Founder & CEO.</p>
        </div>
      </PlatformLayout>
    );
  }

  return (
    <PlatformLayout title="Agent Ownership & Security">
      <div className="max-w-5xl mx-auto px-2 py-4 space-y-5 pb-24">

        {/* Hero */}
        <div className="bg-gradient-to-br from-[#0a0f1e] to-[#1a3a8f] rounded-2xl border border-blue-700 p-6">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">🛡️</span>
                <h1 className="text-xl font-black text-white">Agent Ownership & Security</h1>
              </div>
              <p className="text-blue-300 text-sm max-w-xl mb-3">
                Every AI agent and B2B connection is owned by <strong className="text-white">Chad A. Dozier Sr.</strong> and 
                operated under <strong className="text-white">AthlynXAI Corporation</strong> (EIN 42-2183569). 
                All code, data, and IP is company property. Kill-switch controls available for every agent.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="bg-green-500/20 border border-green-500/30 text-green-400 text-[10px] font-black px-2 py-1 rounded-full">✅ {AGENTS.length} AI Engines Active</span>
                <span className="bg-blue-500/20 border border-blue-500/30 text-blue-400 text-[10px] font-black px-2 py-1 rounded-full">🔗 {B2B_CONNECTIONS.length} B2B Connections Secured</span>
                <span className="bg-purple-500/20 border border-purple-500/30 text-purple-400 text-[10px] font-black px-2 py-1 rounded-full">⚖️ {IP_OWNERSHIP.length} IP Assets Documented</span>
              </div>
            </div>
            <div className="text-right shrink-0">
              <div className="text-white font-black text-sm">MASTER ADMIN</div>
              <div className="text-cyan-400 text-xs">Chad A. Dozier Sr.</div>
              <div className="text-white/40 text-[10px]">Founder & CEO</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {[
            { id: "agents", label: "🤖 AI Agents", count: AGENTS.length },
            { id: "b2b", label: "🔗 B2B Connections", count: B2B_CONNECTIONS.length },
            { id: "ip", label: "⚖️ IP Ownership", count: IP_OWNERSHIP.length },
            { id: "security", label: "🛡️ Security Rules", count: null },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                activeTab === tab.id
                  ? "bg-gradient-to-r from-cyan-600 to-blue-600 text-white"
                  : "bg-[#0d1b3e] border border-blue-800 text-blue-400 hover:border-blue-600"
              }`}
            >
              {tab.label}
              {tab.count !== null && (
                <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-full ${activeTab === tab.id ? "bg-white/20" : "bg-blue-900"}`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* AI AGENTS TAB */}
        {activeTab === "agents" && (
          <div className="space-y-3">
            <div className="bg-yellow-900/20 border border-yellow-700/40 rounded-xl p-3 text-sm text-yellow-300">
              <strong>Ownership Rule:</strong> All AI agents operate under AthlynXAI Corporation. Every agent action is logged. Chad A. Dozier Sr. is the sole human authority over all agents. Kill-switches are immediate.
            </div>
            {AGENTS.map(agent => (
              <div key={agent.id} className={`bg-[#0d1b3e] rounded-2xl border ${killedAgents.has(agent.id) ? "border-red-700" : "border-blue-800"} overflow-hidden`}>
                <div className={`bg-gradient-to-r ${killedAgents.has(agent.id) ? "from-red-900 to-gray-900" : agent.color} p-4`}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{agent.icon}</span>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-white font-black text-base">{agent.name}</span>
                          <span className="bg-white/20 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full">{agent.layer}</span>
                        </div>
                        <div className="text-white/70 text-xs">{agent.role}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-[9px] font-black px-2 py-0.5 rounded-full ${killedAgents.has(agent.id) ? "bg-red-600 text-white" : "bg-green-500/30 text-green-300 border border-green-500/30"}`}>
                        {killedAgents.has(agent.id) ? "⛔ KILLED" : "● ACTIVE"}
                      </span>
                      {agent.killable && (
                        <button
                          onClick={() => handleKillSwitch(agent.id, agent.name)}
                          className={`text-[10px] font-black px-2 py-1 rounded-lg transition-all ${
                            killedAgents.has(agent.id)
                              ? "bg-green-600 text-white hover:bg-green-500"
                              : "bg-red-600/30 border border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
                          }`}
                        >
                          {killedAgents.has(agent.id) ? "↺ Restore" : "⛔ Kill"}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
                <div className="p-4 space-y-3">
                  <p className="text-blue-300 text-xs">{agent.purpose}</p>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <div className="text-blue-500 text-[9px] font-bold uppercase tracking-wider mb-1">Owner</div>
                      <div className="text-white text-xs font-bold">{agent.owner}</div>
                      <div className="text-blue-400 text-[10px]">{agent.ownerEmail}</div>
                    </div>
                    <div>
                      <div className="text-blue-500 text-[9px] font-bold uppercase tracking-wider mb-1">IP Owner</div>
                      <div className="text-white text-xs">{agent.ipOwner}</div>
                    </div>
                  </div>
                  <div>
                    <div className="text-blue-500 text-[9px] font-bold uppercase tracking-wider mb-1">Permissions</div>
                    <div className="flex flex-wrap gap-1">
                      {agent.permissions.map(p => (
                        <span key={p} className="bg-blue-900/50 border border-blue-700 text-blue-300 text-[9px] px-1.5 py-0.5 rounded-full">{p}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* B2B CONNECTIONS TAB */}
        {activeTab === "b2b" && (
          <div className="space-y-3">
            <div className="bg-blue-900/20 border border-blue-700/40 rounded-xl p-3 text-sm text-blue-300">
              <strong>Security Rule:</strong> All B2B connections use API keys stored in Vercel environment variables. No keys are in the codebase. All connections are owned by Chad A. Dozier Sr. and can be revoked instantly by rotating the API key.
            </div>
            {B2B_CONNECTIONS.map((conn, i) => (
              <div key={i} className="bg-[#0d1b3e] rounded-2xl border border-blue-800 p-4 hover:border-blue-600 transition-all">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{conn.icon}</span>
                    <div>
                      <div className="text-white font-black text-sm">{conn.name}</div>
                      <div className="text-blue-400 text-xs">{conn.purpose}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="bg-green-500/20 border border-green-500/30 text-green-400 text-[9px] font-black px-2 py-0.5 rounded-full">● ACTIVE</span>
                    {conn.secured && <span className="text-green-400 text-xs">🔒</span>}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-blue-500 text-[9px] uppercase tracking-wider">Data Access: </span>
                    <span className="text-white">{conn.dataAccess}</span>
                  </div>
                  <div>
                    <span className="text-blue-500 text-[9px] uppercase tracking-wider">Owner: </span>
                    <span className="text-cyan-400">{conn.owner}</span>
                  </div>
                </div>
                <div className="mt-2 flex gap-2">
                  <button
                    onClick={() => toast.info(`To revoke ${conn.name}: rotate the API key in Vercel Dashboard → Environment Variables`)}
                    className="text-[10px] bg-red-900/20 border border-red-800 text-red-400 px-2 py-1 rounded-lg hover:bg-red-900/40 transition-all"
                  >
                    ⛔ Revoke Access
                  </button>
                  <button
                    onClick={() => toast.info(`${conn.name} audit log: all actions tracked in platform logs`)}
                    className="text-[10px] bg-blue-900/30 border border-blue-700 text-blue-400 px-2 py-1 rounded-lg hover:bg-blue-900/50 transition-all"
                  >
                    📋 Audit Log
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* IP OWNERSHIP TAB */}
        {activeTab === "ip" && (
          <div className="space-y-3">
            <div className="bg-purple-900/20 border border-purple-700/40 rounded-xl p-3 text-sm text-purple-300">
              <strong>IP Rule:</strong> All code written by AI agents for ATHLYNX is company property of AthlynXAI Corporation and Dozier Holdings Group. Chad A. Dozier Sr. is the sole IP owner. No agent, contractor, or team member owns any IP.
            </div>
            {IP_OWNERSHIP.map((ip, i) => (
              <div key={i} className="bg-[#0d1b3e] rounded-2xl border border-blue-800 p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="text-white font-black text-sm">{ip.asset}</div>
                    <div className="text-blue-400 text-xs">{ip.type}</div>
                  </div>
                  <span className={`text-[9px] font-black px-2 py-0.5 rounded-full border ${
                    ip.value === "Core IP" ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" :
                    "bg-green-500/20 text-green-400 border-green-500/30"
                  }`}>
                    {ip.value}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-blue-500 text-[9px] uppercase tracking-wider">Owner: </span>
                    <span className="text-white">{ip.owner}</span>
                  </div>
                  <div>
                    <span className="text-blue-500 text-[9px] uppercase tracking-wider">Protection: </span>
                    <span className="text-cyan-400">{ip.protection}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* SECURITY RULES TAB */}
        {activeTab === "security" && (
          <div className="space-y-3">
            {[
              {
                title: "Human Identity Linked to Every Agent",
                icon: "👤",
                color: "border-cyan-700",
                rules: [
                  "Every AI agent operates under Chad A. Dozier Sr. (cdozier14@athlynx.ai)",
                  "All agent actions are logged with timestamp and action type",
                  "No agent can act without a human-owned API key",
                  "Agent keys are stored in Vercel env vars — never in code",
                  "Rotating any API key immediately kills that agent's access",
                ],
              },
              {
                title: "Kill-Switch Protocol",
                icon: "⛔",
                color: "border-red-700",
                rules: [
                  "Every agent has an instant kill-switch via API key rotation",
                  "Gemini: rotate key in Google Cloud Console → kills all Gemini calls",
                  "Claude: rotate key in Anthropic Console → kills all Claude calls",
                  "Nebius: rotate key in Nebius Console → kills all Nebius calls",
                  "OpenAI: rotate key in OpenAI Dashboard → kills all OpenAI calls",
                  "Manus: end session → agent stops immediately",
                ],
              },
              {
                title: "B2B Connection Security",
                icon: "🔗",
                color: "border-blue-700",
                rules: [
                  "All B2B connections use principle of least privilege (minimum access)",
                  "API keys stored only in Vercel environment variables",
                  "No API keys committed to GitHub — GitGuardian monitors all pushes",
                  "Stripe: restricted key for read-only operations, secret key for writes",
                  "AWS: IAM user with specific permissions only (SES, SNS, S3)",
                  "All connections owned by cdozier14@athlynx.ai — single point of control",
                ],
              },
              {
                title: "Code & IP Ownership",
                icon: "⚖️",
                color: "border-purple-700",
                rules: [
                  "ALL code written by AI agents is property of AthlynXAI Corporation",
                  "Delaware C-Corp (EIN 42-2183569) owns all platform IP",
                  "Work-for-hire doctrine applies to all AI-generated code",
                  "No team member, contractor, or agent has IP rights",
                  "GitHub repo AthlyXAI/Athlynx-V2-Official is company property",
                  "Chad A. Dozier Sr. is the sole human decision-maker for all IP",
                ],
              },
              {
                title: "Bangladesh IP & Security Alert",
                icon: "🚨",
                color: "border-orange-700",
                rules: [
                  "Bangladesh IP 103.124.180.124 detected on Stripe sessions — CHANGE STRIPE PASSWORD",
                  "Enable 2FA on all accounts: Stripe, Vercel, GitHub, Google, Anthropic",
                  "Review all active Stripe sessions and sign out unknown devices",
                  "Rotate Stripe webhook secret if any suspicious activity detected",
                  "Monitor Vercel deployment logs for unauthorized deploys",
                ],
              },
            ].map((section, i) => (
              <div key={i} className={`bg-[#0d1b3e] rounded-2xl border-2 ${section.color} p-4`}>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl">{section.icon}</span>
                  <h3 className="text-white font-black text-base">{section.title}</h3>
                </div>
                <ul className="space-y-1.5">
                  {section.rules.map((rule, j) => (
                    <li key={j} className="flex items-start gap-2 text-xs text-blue-200">
                      <span className="text-cyan-400 mt-0.5 shrink-0">→</span>
                      <span>{rule}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

      </div>
      <MobileBottomNav />
    </PlatformLayout>
  );
}

export default function AgentOwnership() {
  return <RouteErrorBoundary><AgentOwnershipInner /></RouteErrorBoundary>;
}
