import { useState } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

// ─── ALL ATHLYNX APPS — ORGANIZED BY CATEGORY ───────────────────────────────
const appCategories = [
  {
    category: "Core Platform",
    color: "from-cyan-500 to-blue-600",
    borderColor: "border-cyan-500/40",
    apps: [
      { name: "Portal", icon: "/nil-portal-app-logo.jpeg", href: "/portal", desc: "Your athlete command center" },
      { name: "Messenger", icon: "/messenger.png", href: "/messenger", desc: "Real-time messaging & chat" },
      { name: "Dashboard", icon: "/athlynx-icon.png", href: "/dashboard", desc: "Stats, goals & overview" },
      { name: "Feed", icon: "/athlynx-sports-brand.png", href: "/feed", desc: "Live athlete feed" },
      { name: "Profile", icon: "/athlynx-app-icon.png", href: "/profile", desc: "Your public athlete profile" },
      { name: "Social Hub", icon: "/athlynx-icon.png", href: "/social-hub", desc: "Connect with athletes globally" },
      { name: "Comms Hub", icon: "/messenger.png", href: "/comms-hub", desc: "All communications in one place" },
      { name: "Notifications", icon: "/athlynx-icon.png", href: "/notifications", desc: "Alerts & updates" },
    ],
  },
  {
    category: "NIL & Business",
    color: "from-yellow-500 to-orange-500",
    borderColor: "border-yellow-500/40",
    apps: [
      { name: "NIL Portal", icon: "/nil-portal-logo.jpeg", href: "/nil-portal", desc: "Name, Image & Likeness deals" },
      { name: "NIL Vault", icon: "/nil-vault-icon.png", href: "/nil-vault", desc: "Secure NIL deal storage" },
      { name: "NIL Marketplace", icon: "/nil-vault.png", href: "/nil-marketplace", desc: "Buy, sell & negotiate deals" },
      { name: "NIL Calculator", icon: "/nil-vault-icon.png", href: "/nil-calculator", desc: "Calculate your NIL value" },
      { name: "Contracts", icon: "/contracts-logo.png", href: "/contracts", desc: "Smart contract management" },
      { name: "Athlete Legal Hub", icon: "/contracts-logo.png", href: "/athlete-legal-hub", desc: "Legal tools for athletes" },
      { name: "Store", icon: "/athlynx-sports-brand.png", href: "/store", desc: "Merch & branded products" },
      { name: "Marketplace", icon: "/deals-logo.png", href: "/marketplace", desc: "Equipment & services" },
    ],
  },
  {
    category: "AI Tools",
    color: "from-purple-500 to-violet-600",
    borderColor: "border-purple-500/40",
    apps: [
      { name: "AI Recruiter", icon: "/ai-recruiter.png", href: "/ai-recruiter", desc: "AI-powered recruiting engine" },
      { name: "AI Training Bot", icon: "/fuelbots-icon.png", href: "/ai-training-bot", desc: "Personalized AI workouts" },
      { name: "AI Content", icon: "/ai-content.png", href: "/ai-content", desc: "Generate athlete content" },
      { name: "AI Sales", icon: "/ai-sales.png", href: "/ai-sales", desc: "Automate your NIL sales" },
      { name: "Fuel Bots", icon: "/fuelbots-icon.png", href: "/fuel-bots", desc: "Nutrition & recovery AI" },
      { name: "Team Bots", icon: "/fuelbots-icon.png", href: "/team-bots", desc: "Team management AI" },
      { name: "Wizards Hub", icon: "/athlynx-icon.png", href: "/wizards", desc: "AI-powered career wizards" },
      { name: "CRM Command", icon: "/analytics-logo.png", href: "/crm-command", desc: "Athlete relationship manager" },
    ],
  },
  {
    category: "Recruiting & Transfer",
    color: "from-green-500 to-emerald-600",
    borderColor: "border-green-500/40",
    apps: [
      { name: "Transfer Portal", icon: "/transfer-portal-icon.png", href: "/transfer-portal", desc: "Find your next school" },
      { name: "Transfer Intelligence", icon: "/transfer-portal.png", href: "/transfer-intelligence", desc: "AI transfer analytics" },
      { name: "Signing Day", icon: "/transfer-portal-icon.png", href: "/signing-day", desc: "Signing day tracker" },
      { name: "Athlete Playbook", icon: "/athlynx-app-icon.png", href: "/athlete-playbook", desc: "Recruiting playbook" },
      { name: "School Branding", icon: "/athlynx-sports-brand.png", href: "/school-branding", desc: "School NIL licensing" },
      { name: "Athlete Website", icon: "/website-logo.png", href: "/athlete-website-builder", desc: "Build your recruiting site" },
      { name: "Scout Wizard", icon: "/ai-recruiter.png", href: "/wizards/scout", desc: "AI scouting assistant" },
      { name: "Career Wizard", icon: "/athlynx-icon.png", href: "/wizards/career", desc: "Career path planning" },
    ],
  },
  {
    category: "Sports Apps",
    color: "from-red-500 to-rose-600",
    borderColor: "border-red-500/40",
    apps: [
      { name: "Diamond Grind", icon: "/diamond-grind-icon.png", href: "/diamond-grind", desc: "Elite baseball platform" },
      { name: "Warriors Playbook", icon: "/warriors-playbook-icon.png", href: "/warriors-playbook", desc: "Basketball dominance" },
      { name: "Court Kings", icon: "/court-kings-icon.png", href: "/court-kings", desc: "Basketball recruiting" },
      { name: "Gridiron Nexus", icon: "/gridiron-nexus-icon.png", href: "/gridiron-nexus", desc: "Football excellence" },
      { name: "Pitch Pulse", icon: "/pitch-pulse-icon.png", href: "/pitch-pulse", desc: "Soccer intelligence" },
      { name: "Fairway Elite", icon: "/athlynx-sports-brand.png", href: "/fairway-elite", desc: "Golf recruiting" },
      { name: "Hunt Pro", icon: "/athlynx-sports-brand.png", href: "/hunt-pro", desc: "Hunting & outdoors" },
      { name: "Reel Masters", icon: "/reel-masters-icon.png", href: "/reel-masters", desc: "Fishing & outdoors" },
    ],
  },
  {
    category: "Media & Content",
    color: "from-pink-500 to-fuchsia-600",
    borderColor: "border-pink-500/40",
    apps: [
      { name: "Studio", icon: "/athlynx-sports-brand.png", href: "/studio", desc: "Content creation studio" },
      { name: "Music", icon: "/athlynx-icon.png", href: "/music", desc: "Athlete music platform" },
      { name: "Podcast", icon: "/athlynx-icon.png", href: "/podcast", desc: "Athlete podcast network" },
      { name: "Media Showcase", icon: "/athlynx-sports-brand.png", href: "/media-showcase", desc: "Highlight reels & media" },
      { name: "Athlynx Browser", icon: "/athlynx-icon.png", href: "/athlynx-browser", desc: "Sports content browser" },
      { name: "Social Hub", icon: "/athlynx-sports-brand.png", href: "/social-hub", desc: "All social in one place" },
    ],
  },
  {
    category: "Health & Wellness",
    color: "from-teal-500 to-cyan-600",
    borderColor: "border-teal-500/40",
    apps: [
      { name: "Training", icon: "/athlynx-sports-brand.png", href: "/training", desc: "Elite training programs" },
      { name: "Medical", icon: "/wellness-logo-final.png", href: "/medical", desc: "Sports medicine & rehab" },
      { name: "Wellness Portal", icon: "/wellness-logo-final.png", href: "/wellness", desc: "Mental & physical wellness" },
      { name: "Mindset", icon: "/wellness-logo-v2.png", href: "/mindset", desc: "Mental performance coaching" },
      { name: "Nutrition", icon: "/fuelbots-icon.png", href: "/fuel-bots", desc: "Nutrition & recovery" },
      { name: "Faith", icon: "/faith-icon.png", href: "/faith", desc: "Faith & motivation" },
    ],
  },
  {
    category: "DHG Empire",
    color: "from-slate-500 to-blue-700",
    borderColor: "border-slate-500/40",
    apps: [
      { name: "DHG Home", icon: "/dhg-logo.png", href: "/dhg-home", desc: "Dozier Holdings Group" },
      { name: "Investor Hub", icon: "/dhg-crab-shield.png", href: "/investor-hub", desc: "Investor relations" },
      { name: "Military Division", icon: "/military-division-icon.png", href: "/military-division", desc: "Veteran athlete pipeline" },
      { name: "White Label", icon: "/athlynx-sports-brand.png", href: "/white-label", desc: "License the platform" },
      { name: "Partners", icon: "/dhg-logo.png", href: "/partners", desc: "Strategic partnerships" },
      { name: "Softmor", icon: "/dhg-logo.png", href: "/softmor", desc: "Construction & infrastructure" },
      { name: "Bitcoin Mining", icon: "/athlynx-icon.png", href: "/bitcoin-mining", desc: "Crypto & digital assets" },
      { name: "Robotics", icon: "/athlynx-icon.png", href: "/robotics", desc: "AI robotics division" },
    ],
  },
];

export default function Portal() {
  const { user, isAuthenticated, loading: isLoading } = useAuth();
  const [newPostContent, setNewPostContent] = useState("");
  const [activeTab, setActiveTab] = useState<"feed" | "profile" | "apps">("feed");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const { data: feedPosts, refetch: refetchFeed } = trpc.feed.getFeed.useQuery(
    { limit: 20, offset: 0 },
    { enabled: isAuthenticated }
  );

  const createPost = trpc.feed.createPost.useMutation({
    onSuccess: () => {
      toast.success("Post created!");
      setNewPostContent("");
      refetchFeed();
    },
    onError: (error: { message?: string }) => {
      toast.error(error.message || "Failed to create post");
    },
  });

  const handleCreatePost = () => {
    if (!newPostContent.trim()) {
      toast.error("Please enter some content");
      return;
    }
    createPost.mutate({ content: newPostContent, postType: "status" });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-cyan-400 border-t-transparent"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-blue-950 to-slate-900 flex flex-col items-center justify-start p-4 pt-8">
        <div className="relative group w-full max-w-sm">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-blue-500 to-cyan-500 rounded-2xl blur-2xl opacity-20 group-hover:opacity-50 transition-all duration-500"></div>
          <Card className="relative bg-gradient-to-b from-slate-800 to-slate-900 border-2 border-cyan-500/30 group-hover:border-cyan-400/50 rounded-2xl shadow-2xl transition-all duration-300">
            <CardHeader className="text-center pt-6 pb-2">
              <div className="flex justify-center mb-3">
                <img src="/athlynx-icon.png" alt="ATHLYNX" className="h-16 rounded-xl shadow-2xl" />
              </div>
              <div className="inline-block bg-cyan-400 text-slate-900 font-bold text-xs tracking-widest px-3 py-1 rounded-full mb-3 shadow-lg">
                THE ATHLETE'S PLAYBOOK
              </div>
              <CardTitle className="text-xl text-white font-black">ATHLYNX Portal</CardTitle>
              <p className="text-slate-400 mt-1 text-sm">Log in to access the platform</p>
            </CardHeader>
            <CardContent className="space-y-3 pb-6 px-4">
              <a href="/signin" className="block">
                <Button className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold py-3 rounded-xl shadow-lg">
                  Sign In to ATHLYNX
                </Button>
              </a>
              <Link href="/">
                <Button variant="outline" className="w-full border-slate-600 text-slate-300 hover:bg-slate-700 py-3 rounded-xl text-sm">
                  Back to Home
                </Button>
              </Link>
              <p className="text-cyan-400 text-xs text-center font-semibold pt-2">Building champions, training winners, and creating empires.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-blue-900 to-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-gradient-to-r from-slate-900 to-blue-900 backdrop-blur border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/">
            <div className="relative cursor-pointer group">
              <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-500 rounded-xl px-4 py-2 flex items-center gap-3 shadow-xl hover:shadow-cyan-500/30 transition-all border border-cyan-400/30">
                <img src="/athlynx-icon.png" alt="ATHLYNX" className="h-10 md:h-12 rounded-lg shadow-lg group-hover:scale-105 transition-all duration-300" />
              </div>
              <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-400 rounded-full border-2 border-slate-900 animate-pulse"></div>
            </div>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-slate-300 text-sm hidden md:block">Welcome, {user?.name || "Athlete"}</span>
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold">
              {user?.name?.charAt(0)?.toUpperCase() || "A"}
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-slate-800 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 flex gap-1">
          {[
            { id: "feed", label: "Feed" },
            { id: "profile", label: "My Profile" },
            { id: "apps", label: "All Apps" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-6 py-3 font-medium transition-colors ${
                activeTab === tab.id
                  ? "text-cyan-400 border-b-2 border-cyan-400"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">

        {/* ── FEED TAB ── */}
        {activeTab === "feed" && (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Card className="bg-slate-800 border-slate-700">
                <CardContent className="p-4">
                  <Textarea
                    value={newPostContent}
                    onChange={(e) => setNewPostContent(e.target.value)}
                    placeholder="What's on your mind? Share your training updates, NIL deals, or achievements..."
                    className="bg-slate-900 border-slate-600 text-white placeholder:text-slate-500 min-h-[100px]"
                  />
                  <div className="flex justify-between items-center mt-4">
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">Photo</Button>
                      <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">Video</Button>
                      <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">Highlight</Button>
                    </div>
                    <Button
                      onClick={handleCreatePost}
                      disabled={createPost.isPending}
                      className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400"
                    >
                      {createPost.isPending ? "Posting..." : "Post"}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {feedPosts && feedPosts.length > 0 ? (
                feedPosts.map((post: any) => (
                  <Card key={post.id} className="bg-slate-800 border-slate-700">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold">
                          {user?.name?.charAt(0)?.toUpperCase() || "A"}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-white font-medium">{user?.name || "Athlete"}</span>
                            <span className="text-slate-500 text-sm">{new Date(post.createdAt).toLocaleDateString()}</span>
                          </div>
                          <p className="text-slate-300">{post.content}</p>
                          <div className="flex gap-4 mt-4 text-slate-500">
                            <button className="hover:text-cyan-400 transition-colors">Like {post.likesCount}</button>
                            <button className="hover:text-cyan-400 transition-colors">Comment {post.commentsCount}</button>
                            <button className="hover:text-cyan-400 transition-colors">Share {post.sharesCount}</button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card className="bg-slate-800 border-slate-700">
                  <CardContent className="p-8 text-center">
                    <p className="text-slate-400 mb-4">No posts yet. Be the first to share your journey!</p>
                    <Button onClick={() => setNewPostContent("Just started my training journey on ATHLYNX!")} className="bg-gradient-to-r from-blue-600 to-cyan-500">
                      Create Your First Post
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader><CardTitle className="text-white text-lg">Quick Access</CardTitle></CardHeader>
                <CardContent className="space-y-2">
                  {[
                    { label: "NIL Portal", href: "/nil-portal", color: "text-yellow-400" },
                    { label: "Transfer Portal", href: "/transfer-portal", color: "text-green-400" },
                    { label: "AI Recruiter", href: "/ai-recruiter", color: "text-purple-400" },
                    { label: "Messenger", href: "/messenger", color: "text-cyan-400" },
                    { label: "Training", href: "/training", color: "text-red-400" },
                    { label: "NIL Calculator", href: "/nil-calculator", color: "text-orange-400" },
                  ].map((item) => (
                    <Link key={item.href} href={item.href}>
                      <div className={`flex items-center justify-between p-2 rounded-lg hover:bg-slate-700 cursor-pointer transition-colors`}>
                        <span className={`font-medium ${item.color}`}>{item.label}</span>
                        <span className="text-slate-500 text-sm">Open</span>
                      </div>
                    </Link>
                  ))}
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-blue-900 to-slate-800 border-cyan-500/30">
                <CardContent className="p-4 text-center">
                  <p className="text-cyan-400 font-bold text-sm mb-2">ATHLYNX VIP</p>
                  <p className="text-white font-black text-lg mb-2">Unlock All Features</p>
                  <p className="text-slate-400 text-xs mb-4">NIL deals, AI coaching, recruiting tools & more</p>
                  <Link href="/pricing">
                    <Button className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold">
                      Upgrade Now
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* ── PROFILE TAB ── */}
        {activeTab === "profile" && (
          <div className="max-w-2xl mx-auto">
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-8 text-center">
                <div className="w-24 h-24 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full flex items-center justify-center text-white text-4xl font-black mx-auto mb-4">
                  {user?.name?.charAt(0)?.toUpperCase() || "A"}
                </div>
                <h2 className="text-2xl font-black text-white mb-1">{user?.name || "Athlete"}</h2>
                <p className="text-cyan-400 text-sm mb-6">{user?.email || ""}</p>
                <div className="grid grid-cols-3 gap-4 mb-6">
                  {[
                    { label: "Posts", value: "0" },
                    { label: "Followers", value: "0" },
                    { label: "NIL Deals", value: "0" },
                  ].map((stat) => (
                    <div key={stat.label} className="bg-slate-900 rounded-xl p-3">
                      <div className="text-2xl font-black text-white">{stat.value}</div>
                      <div className="text-slate-400 text-xs">{stat.label}</div>
                    </div>
                  ))}
                </div>
                <div className="flex gap-3 justify-center">
                  <Link href="/profile">
                    <Button className="bg-gradient-to-r from-blue-600 to-cyan-500">View Full Profile</Button>
                  </Link>
                  <Link href="/settings">
                    <Button variant="outline" className="border-slate-600 text-slate-300">Settings</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* ── APPS TAB ── */}
        {activeTab === "apps" && (
          <div className="space-y-10">
            {/* Header */}
            <div className="text-center mb-2">
              <h2 className="text-3xl md:text-4xl font-black text-white mb-2">ATHLYNX Apps</h2>
              <p className="text-cyan-400 font-semibold">50+ Powerful Apps. One Platform. Unlimited Potential.</p>
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2 justify-center">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
                  selectedCategory === null
                    ? "bg-cyan-500 text-slate-900"
                    : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                }`}
              >
                All Apps
              </button>
              {appCategories.map((cat) => (
                <button
                  key={cat.category}
                  onClick={() => setSelectedCategory(selectedCategory === cat.category ? null : cat.category)}
                  className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
                    selectedCategory === cat.category
                      ? `bg-gradient-to-r ${cat.color} text-white`
                      : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                  }`}
                >
                  {cat.category}
                </button>
              ))}
            </div>

            {/* App Categories */}
            {appCategories
              .filter((cat) => selectedCategory === null || selectedCategory === cat.category)
              .map((cat) => (
                <div key={cat.category}>
                  {/* Category Header */}
                  <div className={`flex items-center gap-3 mb-4`}>
                    <div className={`h-1 w-8 rounded-full bg-gradient-to-r ${cat.color}`}></div>
                    <h3 className={`text-xl font-black bg-gradient-to-r ${cat.color} bg-clip-text text-transparent`}>
                      {cat.category}
                    </h3>
                    <div className={`h-1 flex-1 rounded-full bg-gradient-to-r ${cat.color} opacity-20`}></div>
                  </div>

                  {/* Apps Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3">
                    {cat.apps.map((app) => (
                      <Link key={app.href} href={app.href}>
                        <div className={`group flex flex-col items-center p-3 rounded-2xl bg-slate-800/80 border ${cat.borderColor} hover:bg-slate-700 hover:border-opacity-80 hover:scale-105 transition-all duration-200 cursor-pointer text-center`}>
                          <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${cat.color} flex items-center justify-center mb-2 shadow-lg overflow-hidden`}>
                            <img
                              src={app.icon}
                              alt={app.name}
                              className="w-full h-full object-cover rounded-2xl"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = "none";
                                target.parentElement!.innerHTML = `<span class="text-2xl font-black text-white">${app.name.charAt(0)}</span>`;
                              }}
                            />
                          </div>
                          <span className="text-white text-xs font-bold leading-tight">{app.name}</span>
                          <span className="text-slate-400 text-xs mt-0.5 hidden group-hover:block leading-tight">{app.desc}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}

            {/* Bottom CTA */}
            <div className="text-center py-8 border-t border-slate-700">
              <p className="text-slate-400 mb-4">More apps launching soon. The empire is growing.</p>
              <div className="flex gap-4 justify-center flex-wrap">
                <Link href="/early-access">
                  <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 font-bold">Get Early Access</Button>
                </Link>
                <Link href="/community-feedback">
                  <Button variant="outline" className="border-slate-600 text-slate-300">Request a Feature</Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
