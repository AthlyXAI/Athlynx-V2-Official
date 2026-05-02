import PlatformLayout from "@/components/PlatformLayout";
import { useState, useRef, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Link } from "wouter";
import { toast } from "sonner";

const PLAN_LABELS: Record<string, { label: string; color: string }> = {
  athlete_pro: { label: "PRO", color: "#0066ff" },
  athlete_elite: { label: "ELITE", color: "#00c2ff" },
  nil_vault: { label: "NIL VAULT", color: "#1e3a8a" },
};

function SubscriptionBadge() {
  const { user } = useAuth();
  const { data: sub } = trpc.stripe.getSubscription.useQuery(undefined, { enabled: !!user });
  if (!sub?.plan || !sub.status || (sub.status as string) === "none") return null;
  const info = PLAN_LABELS[sub.plan];
  if (!info) return null;
  return (
    <Link href="/billing">
      <span className="text-xs font-black px-2 py-0.5 rounded-full cursor-pointer"
        style={{ backgroundColor: info.color + "22", color: info.color, border: `1px solid ${info.color}44` }}>
        {info.label}
      </span>
    </Link>
  );
}

// ─── AI TRAINER TAB ──────────────────────────────────────────────────────────
function AITrainerTab({ user }: { user: any }) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; content: string }[]>([]);
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const historyQuery = trpc.ai.trainerHistory.useQuery(undefined, { retry: false });
  const chatMutation = trpc.ai.trainerChat.useMutation({
    onSuccess: (data) => { setTyping(false); setMessages(p => [...p, { role: "assistant", content: data.reply }]); },
    onError: (e) => { setTyping(false); toast.error(e.message || "Trainer unavailable"); },
  });
  const clearMutation = trpc.ai.trainerClear.useMutation({ onSuccess: () => setMessages([]) });

  useEffect(() => {
    if (historyQuery.data?.messages?.length) {
      setMessages(historyQuery.data.messages.map((m: any) => ({ role: m.role, content: m.content })));
    }
  }, [historyQuery.data]);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, typing]);

  const send = () => {
    const msg = input.trim();
    if (!msg) return;
    setInput("");
    setMessages(p => [...p, { role: "user", content: msg }]);
    setTyping(true);
    chatMutation.mutate({ message: msg });
  };

  const QUICK = [
    "Build me a 4-week training plan", "What should I eat before a game?",
    "Help me write an email to a coach", "Review my NIL deal offer",
    "How do I enter the transfer portal?", "Create a social media plan for this week",
    "I'm feeling burned out. What do I do?", "How do I improve my 40-yard dash?",
  ];

  return (
    <div className="bg-[#1a3a8f] border border-blue-900 rounded-xl overflow-hidden flex flex-col" style={{ height: "70vh" }}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-blue-900 bg-gradient-to-r from-blue-900 to-indigo-900">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-xl">🤖</div>
          <div>
            <div className="text-white font-black text-sm">ATHLYNX AI Trainer</div>
            <div className="text-cyan-400 text-xs flex items-center gap-1"><span className="w-2 h-2 bg-green-400 rounded-full inline-block"></span> Powered by Gemini AI · Always On</div>
          </div>
        </div>
        <button onClick={() => clearMutation.mutate()} className="text-blue-400 text-xs hover:text-white transition-colors">Clear Chat</button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 && (
          <div className="text-center py-6">
            <div className="text-4xl mb-3">🏆</div>
            <div className="text-white font-bold mb-1">Your Personal AI Trainer</div>
            <div className="text-blue-400 text-sm mb-4">Ask me anything — training, NIL, recruiting, mindset, nutrition, transfer portal.</div>
            <div className="grid grid-cols-2 gap-2">
              {QUICK.map((q, i) => (
                <button key={i} onClick={() => { setInput(q); }} className="text-left text-xs bg-blue-900/60 hover:bg-blue-800 text-blue-300 px-3 py-2 rounded-lg transition-colors border border-blue-800">
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            {m.role === "assistant" && (
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-sm mr-2 mt-1 shrink-0">🤖</div>
            )}
            <div className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
              m.role === "user"
                ? "bg-blue-600 text-white rounded-br-sm"
                : "bg-[#1530a0] text-blue-100 rounded-bl-sm border border-blue-800"
            }`}>
              {m.content}
            </div>
          </div>
        ))}
        {typing && (
          <div className="flex justify-start">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-sm mr-2 shrink-0">🤖</div>
            <div className="bg-[#1530a0] border border-blue-800 px-4 py-3 rounded-2xl rounded-bl-sm flex gap-1 items-center">
              <span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
              <span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
              <span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="p-3 border-t border-blue-900 bg-[#0d1b3e]">
        <div className="flex gap-2">
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
            placeholder="Ask your AI Trainer anything..."
            rows={1}
            className="flex-1 bg-[#1530a0] border border-blue-800 text-white text-sm rounded-xl px-3 py-2.5 focus:outline-none focus:border-cyan-500 placeholder-blue-500 resize-none"
          />
          <button
            onClick={send}
            disabled={!input.trim() || chatMutation.isPending}
            className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold px-4 py-2 rounded-xl disabled:opacity-50 transition-all hover:scale-105 active:scale-95 shrink-0"
          >
            {chatMutation.isPending ? "..." : "Send"}
          </button>
        </div>
        <div className="text-blue-600 text-xs mt-1.5 text-center">Powered by Google Gemini AI · Each message uses 1 AI credit</div>
      </div>
    </div>
  );
}

// ─── WIZARDS TAB ─────────────────────────────────────────────────────────────
const WIZARDS = [
  { name: "Scout Wizard", emoji: "🔭", desc: "AI scouting reports & talent analysis", href: "/wizards/scout", color: "from-green-600 to-teal-600" },
  { name: "Transfer Wizard", emoji: "🚀", desc: "Navigate the transfer portal with AI", href: "/wizards/transfer", color: "from-blue-600 to-indigo-600" },
  { name: "Agent Wizard", emoji: "🤝", desc: "Find & evaluate sports agents", href: "/wizards/agent", color: "from-purple-600 to-violet-600" },
  { name: "Career Wizard", emoji: "🧭", desc: "Plan your career path & life after sports", href: "/wizards/career", color: "from-cyan-600 to-blue-600" },
  { name: "Financial Wizard", emoji: "💰", desc: "Wealth management & NIL finances", href: "/wizards/financial", color: "from-yellow-600 to-orange-600" },
  { name: "Lawyer Wizard", emoji: "⚖️", desc: "Legal guidance for athletes", href: "/wizards/lawyer", color: "from-slate-600 to-gray-700" },
  { name: "Scholarship Wizard", emoji: "🎓", desc: "Find & apply for scholarships", href: "/wizards/scholarship", color: "from-emerald-600 to-green-700" },
  { name: "Life Wizard", emoji: "🌟", desc: "Life skills, mindset & personal growth", href: "/wizards/life", color: "from-pink-600 to-rose-600" },
];

const BOTS = [
  { name: "AI Trainer Bot", emoji: "🏋️", desc: "Your personal AI training coach", href: "/ai-training-bot", color: "from-blue-600 to-cyan-600" },
  { name: "Fuel Bots", emoji: "⚡", desc: "Nutrition, recovery & supplement AI", href: "/fuel-bots", color: "from-yellow-600 to-orange-600" },
  { name: "Team Bots", emoji: "👥", desc: "Team management & coordination AI", href: "/team-bots", color: "from-green-600 to-teal-600" },
  { name: "TrainerBot Roles", emoji: "🤖", desc: "Full AI trainer role system", href: "/trainerbot", color: "from-purple-600 to-violet-600" },
  { name: "AI Recruiter", emoji: "🎯", desc: "AI-powered recruiting engine", href: "/ai-recruiter", color: "from-red-600 to-rose-600" },
  { name: "AI Content", emoji: "✨", desc: "Generate athlete content & captions", href: "/ai-content", color: "from-fuchsia-600 to-pink-600" },
  { name: "AI Sales", emoji: "📣", desc: "Automate your NIL sales outreach", href: "/ai-sales", color: "from-indigo-600 to-blue-700" },
  { name: "Wizard Hub", emoji: "🪄", desc: "All AI wizards in one place", href: "/wizards", color: "from-violet-600 to-purple-700" },
];

function WizardsTab() {
  return (
    <div className="space-y-4">
      {/* Wizards */}
      <div className="bg-[#1a3a8f] border border-blue-900 rounded-xl p-4">
        <h3 className="text-white font-black text-base mb-3 flex items-center gap-2"><span>🪄</span> AI Wizards</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {WIZARDS.map(w => (
            <Link key={w.href} href={w.href}>
              <div className="group flex flex-col items-center p-3 rounded-2xl bg-slate-800/80 border border-blue-800/40 hover:bg-slate-700 hover:scale-105 transition-all cursor-pointer text-center">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${w.color} flex items-center justify-center mb-2 shadow-lg text-2xl`}>
                  {w.emoji}
                </div>
                <span className="text-white text-xs font-bold leading-tight">{w.name}</span>
                <span className="text-slate-400 text-xs mt-0.5 hidden group-hover:block leading-tight">{w.desc}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Bots */}
      <div className="bg-[#1a3a8f] border border-blue-900 rounded-xl p-4">
        <h3 className="text-white font-black text-base mb-3 flex items-center gap-2"><span>🤖</span> AI Bots</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {BOTS.map(b => (
            <Link key={b.href} href={b.href}>
              <div className="group flex flex-col items-center p-3 rounded-2xl bg-slate-800/80 border border-blue-800/40 hover:bg-slate-700 hover:scale-105 transition-all cursor-pointer text-center">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${b.color} flex items-center justify-center mb-2 shadow-lg text-2xl`}>
                  {b.emoji}
                </div>
                <span className="text-white text-xs font-bold leading-tight">{b.name}</span>
                <span className="text-slate-400 text-xs mt-0.5 hidden group-hover:block leading-tight">{b.desc}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── SOCIAL COMMAND CENTER TAB ────────────────────────────────────────────────
const PLATFORMS = [
  { id: "linkedin", label: "LinkedIn", emoji: "💼", color: "bg-blue-700" },
  { id: "instagram", label: "Instagram", emoji: "📸", color: "bg-pink-600" },
  { id: "twitter", label: "X / Twitter", emoji: "🐦", color: "bg-slate-700" },
  { id: "facebook", label: "Facebook", emoji: "👥", color: "bg-blue-600" },
  { id: "tiktok", label: "TikTok", emoji: "🎵", color: "bg-black" },
];

function SocialTab() {
  const [topic, setTopic] = useState("");
  const [tone, setTone] = useState<"professional" | "casual" | "hype" | "inspirational" | "educational">("professional");
  const [selectedPlatform, setSelectedPlatform] = useState("linkedin");
  const [generatedPosts, setGeneratedPosts] = useState<Record<string, string>>({});
  const [editedPost, setEditedPost] = useState("");
  const [publishChannels, setPublishChannels] = useState<string[]>(["twitter", "instagram"]);
  const [publishStatus, setPublishStatus] = useState<string>("");

  const generateMutation = trpc.social.generatePost.useMutation({
    onSuccess: (data) => {
      setGeneratedPosts(data.posts);
      setEditedPost(data.posts[selectedPlatform] || Object.values(data.posts)[0] || "");
      toast.success("Posts generated!");
    },
    onError: (e) => toast.error(e.message || "Generation failed"),
  });

  const bufferMutation = trpc.social.publishToBuffer.useMutation({
    onSuccess: (data) => {
      setPublishStatus(`✅ Posted to ${data.posted} channel(s) via Buffer`);
      toast.success(`Posted to ${data.posted} channel(s)!`);
    },
    onError: (e) => toast.error(e.message || "Buffer post failed"),
  });

  const linkedinMutation = trpc.social.publishToLinkedIn.useMutation({
    onSuccess: () => {
      setPublishStatus("✅ Posted to LinkedIn!");
      toast.success("Posted to LinkedIn!");
    },
    onError: (e) => toast.error(e.message || "LinkedIn post failed"),
  });

  const gravatarMutation = trpc.social.syncGravatar.useMutation({
    onSuccess: (data) => {
      if (data.synced) toast.success("Gravatar synced! Refresh to see your photo.");
      else toast.info(data.message);
    },
    onError: (e) => toast.error(e.message),
  });

  const toggleChannel = (ch: string) => {
    setPublishChannels(p => p.includes(ch) ? p.filter(c => c !== ch) : [...p, ch]);
  };

  const handleGenerate = () => {
    if (!topic.trim()) { toast.error("Enter a topic first"); return; }
    generateMutation.mutate({ topic, platform: selectedPlatform as any, tone });
  };

  const handlePublish = () => {
    if (!editedPost.trim()) { toast.error("Generate a post first"); return; }
    if (selectedPlatform === "linkedin") {
      linkedinMutation.mutate({ text: editedPost, url: "https://athlynx.ai", title: "ATHLYNX — The Athlete's Playbook" });
    } else {
      const bufferChannels = publishChannels.filter(c => ["twitter", "facebook", "instagram", "tiktok"].includes(c));
      if (bufferChannels.length === 0) { toast.error("Select at least one channel"); return; }
      bufferMutation.mutate({ text: editedPost, channels: bufferChannels as any[] });
    }
  };

  return (
    <div className="space-y-4">
      {/* Gravatar Sync */}
      <div className="bg-[#1a3a8f] border border-blue-900 rounded-xl p-4 flex items-center justify-between">
        <div>
          <div className="text-white font-bold text-sm">Gravatar Profile Photo</div>
          <div className="text-blue-400 text-xs">Sync your Gravatar photo across the platform</div>
        </div>
        <button
          onClick={() => gravatarMutation.mutate()}
          disabled={gravatarMutation.isPending}
          className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
        >
          {gravatarMutation.isPending ? "Syncing..." : "Sync Gravatar"}
        </button>
      </div>

      {/* Post Generator */}
      <div className="bg-[#1a3a8f] border border-blue-900 rounded-xl p-4 space-y-4">
        <h3 className="text-white font-black text-base flex items-center gap-2">✨ Gemini AI Post Generator</h3>

        {/* Platform selector */}
        <div>
          <label className="text-blue-400 text-xs mb-2 block">Platform</label>
          <div className="flex flex-wrap gap-2">
            {PLATFORMS.map(p => (
              <button
                key={p.id}
                onClick={() => setSelectedPlatform(p.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  selectedPlatform === p.id ? `${p.color} text-white scale-105` : "bg-blue-900/50 text-blue-300 hover:bg-blue-800"
                }`}
              >
                <span>{p.emoji}</span>{p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Topic + Tone */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-blue-400 text-xs mb-1 block">Topic / What to post about</label>
            <input
              value={topic}
              onChange={e => setTopic(e.target.value)}
              placeholder="e.g. ATHLYNX is live, Pre-Seed round open..."
              className="w-full bg-[#0d1f3c] border border-blue-800 text-white text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:border-cyan-500 placeholder-blue-600"
            />
          </div>
          <div>
            <label className="text-blue-400 text-xs mb-1 block">Tone</label>
            <select
              value={tone}
              onChange={e => setTone(e.target.value as any)}
              className="w-full bg-[#0d1f3c] border border-blue-800 text-white text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:border-cyan-500"
            >
              <option value="professional">Professional</option>
              <option value="casual">Casual</option>
              <option value="hype">Hype</option>
              <option value="inspirational">Inspirational</option>
              <option value="educational">Educational</option>
            </select>
          </div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={generateMutation.isPending || !topic.trim()}
          className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-black py-3 rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {generateMutation.isPending ? (
            <><span className="animate-spin">⚡</span> Gemini is writing...</>
          ) : (
            <><span>✨</span> Generate with Gemini AI</>
          )}
        </button>

        {/* Generated post editor */}
        {(editedPost || Object.keys(generatedPosts).length > 0) && (
          <div className="space-y-3">
            {/* Platform tabs for generated posts */}
            {Object.keys(generatedPosts).length > 1 && (
              <div className="flex flex-wrap gap-1">
                {Object.keys(generatedPosts).map(p => (
                  <button
                    key={p}
                    onClick={() => { setSelectedPlatform(p); setEditedPost(generatedPosts[p]); }}
                    className={`text-xs px-2 py-1 rounded-lg font-bold transition-colors ${selectedPlatform === p ? "bg-blue-600 text-white" : "bg-blue-900 text-blue-300"}`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            )}

            <div>
              <label className="text-blue-400 text-xs mb-1 block">Edit before posting</label>
              <textarea
                value={editedPost}
                onChange={e => setEditedPost(e.target.value)}
                rows={6}
                className="w-full bg-[#0d1f3c] border border-blue-800 text-white text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:border-cyan-500 resize-none"
              />
              <div className="text-blue-500 text-xs mt-1">{editedPost.length} characters</div>
            </div>

            {/* Channel selector for Buffer */}
            {selectedPlatform !== "linkedin" && (
              <div>
                <label className="text-blue-400 text-xs mb-2 block">Publish to (Buffer)</label>
                <div className="flex flex-wrap gap-2">
                  {["twitter", "instagram", "facebook", "tiktok"].map(ch => (
                    <button
                      key={ch}
                      onClick={() => toggleChannel(ch)}
                      className={`text-xs px-3 py-1.5 rounded-lg font-bold transition-all ${publishChannels.includes(ch) ? "bg-blue-600 text-white" : "bg-blue-900/50 text-blue-400"}`}
                    >
                      {ch === "twitter" ? "X/Twitter" : ch.charAt(0).toUpperCase() + ch.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={handlePublish}
              disabled={bufferMutation.isPending || linkedinMutation.isPending}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-black py-3 rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {(bufferMutation.isPending || linkedinMutation.isPending) ? (
                <><span className="animate-spin">📡</span> Publishing...</>
              ) : (
                <><span>🚀</span> Publish to {selectedPlatform === "linkedin" ? "LinkedIn" : "Selected Channels"}</>
              )}
            </button>

            {publishStatus && (
              <div className="bg-green-900/40 border border-green-700 text-green-400 text-sm px-4 py-3 rounded-xl font-bold">
                {publishStatus}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Quick links to social platforms */}
      <div className="bg-[#1a3a8f] border border-blue-900 rounded-xl p-4">
        <h3 className="text-white font-bold text-sm mb-3">Quick Links</h3>
        <div className="grid grid-cols-2 gap-2">
          {[
            { label: "AI Content Generator", href: "/ai-content", emoji: "✨" },
            { label: "Social Hub", href: "/social-hub", emoji: "🌐" },
            { label: "X-Factor Feed", href: "/x-factor", emoji: "⚡" },
            { label: "Reel Masters", href: "/reel-masters", emoji: "🎬" },
          ].map(l => (
            <Link key={l.href} href={l.href}>
              <div className="flex items-center gap-2 bg-blue-900/50 hover:bg-blue-800 text-blue-300 text-xs font-bold px-3 py-2.5 rounded-lg transition-colors cursor-pointer">
                <span>{l.emoji}</span>{l.label}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── MAIN PROFILE COMPONENT ───────────────────────────────────────────────────
export default function Profile() {
  const { user, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState("posts");
  const [editMode, setEditMode] = useState(false);
  const [editForm, setEditForm] = useState({ sport: "", position: "", school: "", bio: "", height: "", weight: "", gpa: "" });
  const utils = trpc.useUtils();

  const { data: profile } = trpc.profile.getMyProfile.useQuery(undefined, { enabled: !!user });
  const { data: userPosts = [] } = trpc.feed.getUserPosts.useQuery({ userId: Number(user?.id ?? 0) }, { enabled: !!user });
  const { data: nilDeals = [] } = trpc.nil.getMyDeals.useQuery(undefined, { enabled: !!user, retry: false, refetchOnWindowFocus: false });

  const updateProfileMutation = trpc.profile.updateProfile.useMutation({
    onSuccess: () => { setEditMode(false); utils.profile.getMyProfile.invalidate(); },
  });

  const displayName = user?.name || "Athlete";
  const initials = displayName.split(" ").map((w: string) => w[0]).join("").slice(0, 2).toUpperCase();
  const sport = profile?.sport || "—";
  const position = profile?.position || "—";
  const school = profile?.school || "—";
  const height = profile?.height || "—";
  const gpa = profile?.gpa ? Number(profile.gpa).toFixed(1) : "—";
  const bio = profile?.bio || "Building my legacy one play at a time. #ATHLYNX #NIL";
  const nilValue = profile?.nilValue ? `$${Number(profile.nilValue).toLocaleString()}` : "—";
  const recruitingStatus = profile?.recruitingStatus || "available";
  const followers = profile?.followers ?? 0;
  const totalNilEarnings = nilDeals
    .filter((d: any) => d.status === "active" || d.status === "completed")
    .reduce((sum: number, d: any) => sum + Number(d.dealValue || 0), 0);

  const openEdit = () => {
    setEditForm({
      sport: profile?.sport || "", position: profile?.position || "",
      school: profile?.school || "", bio: profile?.bio || "",
      height: profile?.height || "",
      weight: profile?.weight != null ? String(profile.weight) : "",
      gpa: profile?.gpa != null ? String(profile.gpa) : "",
    });
    setEditMode(true);
  };

  const handleEditSave = () => {
    updateProfileMutation.mutate({
      sport: editForm.sport || undefined, position: editForm.position || undefined,
      school: editForm.school || undefined, bio: editForm.bio || undefined,
      height: editForm.height || undefined,
      weight: editForm.weight ? Number(editForm.weight) : undefined,
      gpa: editForm.gpa ? Number(editForm.gpa) : undefined,
    });
  };

  const TABS = [
    { id: "posts", label: "Posts" },
    { id: "stats", label: "Stats" },
    { id: "nil", label: "NIL" },
    { id: "trainer", label: "🤖 AI Trainer" },
    { id: "wizards", label: "🪄 Wizards" },
    { id: "social", label: "📱 Social" },
    { id: "recruiting", label: "Recruiting" },
  ];

  if (authLoading) {
    return (
      <PlatformLayout>
        <div className="animate-pulse space-y-4">
          <div className="bg-[#1a3a8f] border border-blue-900 rounded-xl overflow-hidden">
            <div className="h-36 bg-blue-900/50"></div>
            <div className="px-4 pb-4 pt-2">
              <div className="w-20 h-20 rounded-full bg-blue-800/50 -mt-10 mb-3"></div>
              <div className="h-5 bg-blue-800/50 rounded w-48 mb-2"></div>
            </div>
          </div>
        </div>
      </PlatformLayout>
    );
  }

  if (!user) {
    return (
      <PlatformLayout>
        <div className="bg-[#1a3a8f] border border-blue-900 rounded-xl p-8 text-center">
          <div className="text-4xl mb-4">🏆</div>
          <h2 className="text-xl font-black text-white mb-2">Sign In to View Your Profile</h2>
          <p className="text-blue-300 text-sm mb-4">Your athlete profile, NIL deals, and recruiting activity are all here.</p>
          <a href="/signin" className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-2.5 rounded-lg inline-block">Sign In</a>
        </div>
      </PlatformLayout>
    );
  }

  return (
    <PlatformLayout>
      <div className="space-y-4 pb-20 lg:pb-4">
        {/* Cover + Profile Header */}
        <div className="bg-[#1a3a8f] border border-blue-900 rounded-xl overflow-hidden">
          <div className="h-36 bg-gradient-to-r from-blue-900 via-blue-700 to-indigo-900 relative">
            {profile?.coverUrl && <img src={profile.coverUrl} alt="Cover" className="w-full h-full object-cover absolute inset-0" />}
            {!editMode && (
              <button onClick={openEdit} className="absolute top-3 right-3 bg-black/50 text-white text-xs px-3 py-1.5 rounded-lg hover:bg-black/70 transition-colors">
                Edit Profile
              </button>
            )}
          </div>
          <div className="px-4 pb-4">
            <div className="flex items-end justify-between -mt-10 mb-3">
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-600 to-blue-800 border-4 border-[#0d1b3e] flex items-center justify-center text-2xl font-black overflow-hidden">
                  {user.avatarUrl ? (
                    <img src={user.avatarUrl} alt={displayName} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-white">{initials}</span>
                  )}
                </div>
                <div className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-[#0d1b3e]"></div>
              </div>
              <div className="flex gap-2 mb-1">
                {editMode ? (
                  <>
                    <button onClick={handleEditSave} disabled={updateProfileMutation.isPending}
                      className="bg-green-600 hover:bg-green-500 text-white text-xs font-bold px-4 py-2 rounded-lg disabled:opacity-50">
                      {updateProfileMutation.isPending ? "Saving..." : "Save"}
                    </button>
                    <button onClick={() => setEditMode(false)} className="border border-blue-700 text-blue-300 text-xs font-bold px-3 py-2 rounded-lg hover:bg-blue-900">Cancel</button>
                  </>
                ) : (
                  <>
                    <button onClick={openEdit} className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 py-2 rounded-lg">Edit Profile</button>
                    <Link href={`/athlete/${user.id}`}>
                      <button className="border border-blue-700 text-blue-300 text-xs font-bold px-3 py-2 rounded-lg hover:bg-blue-900">Public View</button>
                    </Link>
                  </>
                )}
              </div>
            </div>

            {editMode ? (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: "Sport", key: "sport", placeholder: "Football" },
                    { label: "Position", key: "position", placeholder: "QB" },
                    { label: "School", key: "school", placeholder: "University of Alabama" },
                    { label: "Height", key: "height", placeholder: "6'3\"" },
                    { label: "Weight (lbs)", key: "weight", placeholder: "215" },
                    { label: "GPA", key: "gpa", placeholder: "3.6" },
                  ].map(f => (
                    <div key={f.key}>
                      <label className="text-blue-400 text-xs mb-1 block">{f.label}</label>
                      <input value={(editForm as any)[f.key]} onChange={e => setEditForm(p => ({ ...p, [f.key]: e.target.value }))}
                        placeholder={f.placeholder}
                        className="w-full bg-[#0d1f3c] border border-blue-800 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 placeholder-blue-600" />
                    </div>
                  ))}
                </div>
                <div>
                  <label className="text-blue-400 text-xs mb-1 block">Bio</label>
                  <textarea value={editForm.bio} onChange={e => setEditForm(p => ({ ...p, bio: e.target.value }))}
                    placeholder="Tell your story..." rows={2}
                    className="w-full bg-[#0d1f3c] border border-blue-800 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 placeholder-blue-600 resize-none" />
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-xl font-black text-white">{displayName}</h2>
                  <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/></svg>
                  {totalNilEarnings > 0 && <span className="text-xs bg-green-900 text-green-400 px-2 py-0.5 rounded-full font-bold">${totalNilEarnings.toLocaleString()} NIL</span>}
                  <SubscriptionBadge />
                </div>
                <div className="text-blue-400 text-sm">{position} • {school}</div>
                <div className="text-blue-300 text-sm mt-1">{bio}</div>
                <div className="grid grid-cols-4 gap-3 mt-4 bg-[#1530a0] rounded-xl p-3">
                  {[{ label: "Sport", value: sport }, { label: "Position", value: position }, { label: "Height", value: height }, { label: "GPA", value: gpa }].map((s, i) => (
                    <div key={i} className="text-center">
                      <div className="text-white font-bold text-sm truncate">{s.value}</div>
                      <div className="text-blue-500 text-xs">{s.label}</div>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2 mt-3 flex-wrap">
                  <span className={`text-xs px-3 py-1.5 rounded-full font-bold ${recruitingStatus === "committed" ? "bg-green-900 text-green-400" : recruitingStatus === "signed" ? "bg-blue-950 text-blue-300" : "bg-blue-900 text-blue-300"}`}>
                    {recruitingStatus === "available" ? "Available for Transfer" : recruitingStatus === "committed" ? "Committed" : recruitingStatus === "signed" ? "Signed" : "Recruiting Active"}
                  </span>
                  {nilDeals.length > 0 && <span className="text-xs bg-green-900 text-green-400 px-3 py-1.5 rounded-full font-bold">NIL Active</span>}
                  <span className="text-xs bg-blue-950 text-blue-300 px-3 py-1.5 rounded-full font-bold">Verified Athlete</span>
                </div>
                <div className="flex gap-6 mt-3 text-sm">
                  <div><span className="font-bold text-white">{followers.toLocaleString()}</span> <span className="text-blue-400">Followers</span></div>
                  <div><span className="font-bold text-white">{userPosts.length}</span> <span className="text-blue-400">Posts</span></div>
                  <div><span className="font-bold text-white">{nilDeals.length}</span> <span className="text-blue-400">NIL Deals</span></div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-[#1a3a8f] border border-blue-900 rounded-xl p-1 overflow-x-auto">
          {TABS.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex-shrink-0 px-3 py-2 text-xs font-bold rounded-lg transition-colors whitespace-nowrap ${activeTab === tab.id ? "bg-blue-600 text-white" : "text-blue-400 hover:text-white"}`}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Posts Tab */}
        {activeTab === "posts" && (
          <div className="bg-[#1a3a8f] border border-blue-900 rounded-xl p-4">
            <h3 className="text-white font-bold mb-3">Posts ({userPosts.length})</h3>
            {userPosts.length === 0 ? (
              <div className="text-center py-6">
                <div className="text-blue-400 text-sm mb-3">No posts yet. Share your journey!</div>
                <Link href="/feed"><button className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold px-6 py-2 rounded-lg">Go to Feed</button></Link>
              </div>
            ) : (
              <div className="space-y-3">
                {userPosts.map((post: any) => (
                  <div key={post.id} className="bg-[#1530a0] rounded-xl p-3">
                    <p className="text-white text-sm">{post.content}</p>
                    <div className="text-blue-500 text-xs mt-2">{new Date(post.createdAt).toLocaleDateString()}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Stats Tab */}
        {activeTab === "stats" && (
          <div className="bg-[#1a3a8f] border border-blue-900 rounded-xl p-4">
            <h3 className="text-white font-bold mb-3">Athlete Stats</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { label: "Sport", value: sport }, { label: "Position", value: position },
                { label: "School", value: school }, { label: "Height", value: height },
                { label: "Weight", value: profile?.weight ? `${profile.weight} lbs` : "—" },
                { label: "GPA", value: gpa }, { label: "NIL Value", value: nilValue },
                { label: "Followers", value: followers.toLocaleString() }, { label: "Posts", value: userPosts.length.toString() },
              ].map((stat, i) => (
                <div key={i} className="bg-[#1530a0] rounded-xl p-3 text-center">
                  <div className="text-xl font-black text-blue-400 truncate">{stat.value}</div>
                  <div className="text-blue-500 text-xs mt-0.5">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* NIL Tab */}
        {activeTab === "nil" && (
          <div className="bg-[#1a3a8f] border border-blue-900 rounded-xl p-4">
            <h3 className="text-white font-bold mb-3">NIL Portfolio</h3>
            {totalNilEarnings > 0 && (
              <div className="bg-[#1530a0] rounded-xl p-4 text-center mb-3">
                <div className="text-blue-400 text-xs mb-1">Total NIL Earnings</div>
                <div className="text-4xl font-black text-green-400">${totalNilEarnings.toLocaleString()}</div>
              </div>
            )}
            {nilDeals.length === 0 ? (
              <div className="text-center py-4">
                <div className="text-blue-400 text-sm mb-3">No NIL deals yet. Start building!</div>
                <Link href="/nil-portal"><button className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold px-6 py-2 rounded-lg">Browse NIL Deals</button></Link>
              </div>
            ) : (
              <div className="space-y-2">
                {nilDeals.map((deal: any) => (
                  <div key={deal.id} className="flex items-center justify-between bg-[#1530a0] rounded-xl p-3">
                    <div>
                      <div className="font-semibold text-white text-sm">{deal.brandName}</div>
                      <div className="text-blue-400 text-xs">{deal.description || "NIL Deal"}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-green-400 font-bold">${Number(deal.dealValue).toLocaleString()}</div>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${deal.status === "active" ? "bg-green-900 text-green-400" : deal.status === "completed" ? "bg-blue-900 text-blue-400" : "bg-gray-800 text-gray-400"}`}>{deal.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* AI Trainer Tab */}
        {activeTab === "trainer" && <AITrainerTab user={user} />}

        {/* Wizards Tab */}
        {activeTab === "wizards" && <WizardsTab />}

        {/* Social Command Center Tab */}
        {activeTab === "social" && <SocialTab />}

        {/* Recruiting Tab */}
        {activeTab === "recruiting" && (
          <div className="bg-[#1a3a8f] border border-blue-900 rounded-xl p-4">
            <h3 className="text-white font-bold mb-3">Recruiting Status</h3>
            <div className="bg-[#1530a0] rounded-xl p-4 mb-4">
              <div className="text-blue-400 text-xs mb-1">Current Status</div>
              <div className={`text-xl font-black ${recruitingStatus === "committed" ? "text-green-400" : recruitingStatus === "signed" ? "text-blue-500" : "text-blue-300"}`}>
                {recruitingStatus === "available" ? "Available for Transfer" : recruitingStatus === "committed" ? "Committed" : recruitingStatus === "signed" ? "Signed" : "Recruiting Active"}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Link href="/transfer-portal"><button className="w-full bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold px-4 py-3 rounded-lg">Transfer Portal</button></Link>
              <Link href="/ai-recruiter"><button className="w-full bg-purple-600 hover:bg-purple-500 text-white text-sm font-bold px-4 py-3 rounded-lg">AI Recruiter</button></Link>
              <Link href="/athlete-playbook"><button className="w-full bg-teal-600 hover:bg-teal-500 text-white text-sm font-bold px-4 py-3 rounded-lg">Athlete Playbook</button></Link>
              <Link href="/signing-day"><button className="w-full bg-green-600 hover:bg-green-500 text-white text-sm font-bold px-4 py-3 rounded-lg">Signing Day</button></Link>
            </div>
          </div>
        )}
      </div>
    </PlatformLayout>
  );
}
