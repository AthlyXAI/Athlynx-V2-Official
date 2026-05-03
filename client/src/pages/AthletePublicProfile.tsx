/**
 * AthletePublicProfile — /athlete/:id
 * Public-facing profile page for every athlete on ATHLYNX.
 * Visible to scouts, coaches, brands, and other athletes.
 * Clean, Instagram/Twitter-style layout.
 */
import { useState } from "react";
import PlatformLayout from "@/components/PlatformLayout";
import MobileBottomNav from '@/components/MobileBottomNav'
import { Link, useRoute } from "wouter";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";

const SPORT_ICONS: Record<string, string> = {
  Football: "🏈", Basketball: "🏀", Baseball: "⚾", Soccer: "⚽",
  "Track & Field": "🏃", Swimming: "🏊", Tennis: "🎾", Volleyball: "🏐",
  Wrestling: "🤼", Golf: "⛳", Lacrosse: "🥍", Hockey: "🏒",
  Softball: "🥎", "Cross Country": "🏃", Gymnastics: "🤸", "Multi-Sport": "🏆",
};

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  available: { label: "Available for Recruiting", color: "text-green-400", bg: "bg-green-500/10 border-green-500/30" },
  committed: { label: "Committed", color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/30" },
  signed: { label: "Signed", color: "text-purple-400", bg: "bg-purple-500/10 border-purple-500/30" },
  transferred: { label: "Transfer Portal", color: "text-yellow-400", bg: "bg-yellow-500/10 border-yellow-500/30" },
};

export default function AthletePublicProfile() {
  const [, params] = useRoute("/athlete/:id");
  const athleteId = params?.id ? parseInt(params.id) : 0;
  const { user } = useAuth();
  const isOwnProfile = user?.id === athleteId;
  const [activeTab, setActiveTab] = useState<"posts" | "stats" | "highlights" | "nil">("posts");

  const { data: profile, isLoading } = trpc.profile.getProfile.useQuery(
    { userId: athleteId },
    { enabled: !!athleteId }
  );
  const { data: userPosts = [] } = trpc.feed.getUserPosts.useQuery(
    { userId: athleteId },
    { enabled: !!athleteId }
  );

  const displayName = profile?.name || "Athlete";
  const initials = displayName.split(" ").map((w: string) => w[0]).join("").slice(0, 2).toUpperCase();
  const sportIcon = SPORT_ICONS[profile?.sport || ""] || "🏆";
  const statusInfo = STATUS_CONFIG[profile?.recruitingStatus || "available"];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#040c1a] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#00c2ff]/30 border-t-[#00c2ff] rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white/40 text-sm">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-[#040c1a] flex items-center justify-center">
        <div className="text-center max-w-sm">
          <div className="text-6xl mb-4">🏆</div>
          <h2 className="text-2xl font-black text-white mb-2">Profile Not Found</h2>
          <p className="text-white/40 text-sm mb-6">This athlete hasn't set up their profile yet.</p>
          <Link href="/x-factor">
            <button className="bg-[#00c2ff] text-black font-black px-6 py-3 rounded-xl">
              Browse Athletes
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#040c1a] text-white">
      {/* Top nav */}
      <div className="sticky top-0 z-50 bg-[#040c1a]/95 backdrop-blur border-b border-white/10">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/x-factor">
            <button className="text-white/50 hover:text-white transition-colors flex items-center gap-2 text-sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </button>
          </Link>
          <div className="flex items-center gap-2">
            <img src="/img-athlete-multisport.jpg" alt="ATHLYNX" className="w-7 h-7 rounded-lg" />
            <span className="text-white font-black text-sm">ATHLYNX</span>
          </div>
          {isOwnProfile ? (
            <Link href="/profile">
              <button className="text-xs bg-[#00c2ff]/10 border border-[#00c2ff]/30 text-[#00c2ff] font-bold px-3 py-1.5 rounded-full">
                Edit Profile
              </button>
            </Link>
          ) : (
            <button className="text-xs bg-white/10 border border-white/20 text-white font-bold px-3 py-1.5 rounded-full hover:bg-white/20 transition-all">
              Follow
            </button>
          )}
        </div>
      </div>

      <div className="max-w-3xl mx-auto">
        {/* Cover photo */}
        <div className="h-40 sm:h-52 bg-gradient-to-r from-blue-900 via-[#0d1b3e] to-blue-900 relative overflow-hidden">
          {profile.coverUrl && (
            <img src={profile.coverUrl} alt="Cover" className="w-full h-full object-cover" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#040c1a] via-transparent to-transparent" />
          {/* Sport badge overlay */}
          <div className="absolute top-4 right-4 bg-black/50 backdrop-blur rounded-full px-3 py-1.5 flex items-center gap-1.5">
            <span className="text-lg">{sportIcon}</span>
            <span className="text-white text-xs font-bold">{profile.sport || "Athlete"}</span>
          </div>
        </div>

        {/* Profile header */}
        <div className="px-4 pb-0 -mt-14 relative">
          <div className="flex items-end justify-between mb-4">
            {/* Avatar */}
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-[#040c1a] overflow-hidden bg-gradient-to-br from-[#00c2ff] to-blue-700 flex items-center justify-center shrink-0 shadow-xl">
              {profile.avatarUrl ? (
                <img src={profile.avatarUrl} alt={displayName} className="w-full h-full object-cover" />
              ) : (
                <span className="text-white font-black text-3xl">{initials}</span>
              )}
            </div>
            {/* Action buttons */}
            <div className="flex gap-2 pb-1">
              {isOwnProfile ? (
                <Link href="/profile">
                  <button className="bg-white/10 hover:bg-white/20 border border-white/20 text-white text-sm font-bold px-5 py-2 rounded-full transition-all">
                    Edit Profile
                  </button>
                </Link>
              ) : (
                <>
                  <button className="bg-[#00c2ff] hover:bg-[#00a8e0] text-black text-sm font-black px-5 py-2 rounded-full transition-all">
                    Follow
                  </button>
                  <Link href="/messenger">
                    <button className="bg-white/10 hover:bg-white/20 border border-white/20 text-white text-sm font-bold px-4 py-2 rounded-full transition-all">
                      Message
                    </button>
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Name + verification */}
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h1 className="text-2xl font-black text-white">{displayName}</h1>
            <svg className="w-5 h-5 text-[#00c2ff]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
            </svg>
            {profile.stripePlanId && profile.stripePlanId !== "athlete_free" && (
              <span className="text-[10px] font-black bg-[#00c2ff]/20 text-[#00c2ff] border border-[#00c2ff]/30 px-2 py-0.5 rounded-full uppercase tracking-wider">
                {profile.stripePlanId.replace("athlete_", "").toUpperCase()}
              </span>
            )}
          </div>

          {/* Position • School */}
          <div className="text-white/50 text-sm mb-2">
            {[profile.position, profile.school, profile.classYear ? `Class of ${profile.classYear}` : null, profile.state]
              .filter(Boolean).join(" · ")}
          </div>

          {/* Bio */}
          {profile.bio && (
            <p className="text-white/80 text-sm leading-relaxed mb-3 max-w-xl">{profile.bio}</p>
          )}

          {/* Social links */}
          <div className="flex flex-wrap gap-2 mb-4">
            {profile.instagram && (
              <a href={`https://instagram.com/${profile.instagram}`} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs text-pink-400 hover:text-pink-300 bg-pink-500/10 border border-pink-500/20 px-3 py-1.5 rounded-full transition-all">
                📸 @{profile.instagram}
              </a>
            )}
            {profile.twitter && (
              <a href={`https://twitter.com/${profile.twitter}`} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs text-sky-400 hover:text-sky-300 bg-sky-500/10 border border-sky-500/20 px-3 py-1.5 rounded-full transition-all">
                🐦 @{profile.twitter}
              </a>
            )}
            {profile.highlightUrl && (
              <a href={profile.highlightUrl} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300 bg-red-500/10 border border-red-500/20 px-3 py-1.5 rounded-full transition-all">
                🎬 Highlight Reel
              </a>
            )}
          </div>

          {/* Recruiting status badge */}
          <div className="flex flex-wrap gap-2 mb-5">
            <span className={`text-xs font-bold px-3 py-1.5 rounded-full border ${statusInfo.bg} ${statusInfo.color}`}>
              {statusInfo.label}
            </span>
            {profile.nilValue && Number(profile.nilValue) > 0 && (
              <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/30 text-green-400">
                NIL Value: ${Number(profile.nilValue).toLocaleString()}
              </span>
            )}
            <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-[#00c2ff]/10 border border-[#00c2ff]/30 text-[#00c2ff]">
              Verified Athlete
            </span>
          </div>

          {/* Stats bar */}
          <div className="grid grid-cols-4 gap-3 mb-5">
            {[
              { label: "Posts", value: userPosts.length || "0" },
              { label: "Followers", value: profile.followers ? Number(profile.followers).toLocaleString() : "0" },
              { label: "NIL Value", value: profile.nilValue ? `$${Number(profile.nilValue).toLocaleString()}` : "—" },
              { label: "Score", value: profile.recruitingScore ? `${profile.recruitingScore}` : "—" },
            ].map((s) => (
              <div key={s.label} className="bg-white/5 border border-white/10 rounded-2xl p-3 text-center">
                <div className="text-white font-black text-lg">{s.value}</div>
                <div className="text-white/40 text-xs mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Key stats grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-5">
            {[
              { label: "Sport", value: profile.sport },
              { label: "Position", value: profile.position },
              { label: "Height", value: profile.height },
              { label: "GPA", value: profile.gpa ? Number(profile.gpa).toFixed(1) : null },
            ].filter(s => s.value).map((s) => (
              <div key={s.label} className="bg-[#0d1b3e] border border-white/10 rounded-xl p-3 text-center">
                <div className="text-white font-bold text-sm">{s.value}</div>
                <div className="text-white/40 text-xs mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-white/10 px-4">
          <div className="flex gap-0">
            {[
              { id: "posts", label: "Posts" },
              { id: "highlights", label: "Highlights" },
              { id: "stats", label: "Stats" },
              { id: "nil", label: "NIL" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-5 py-3 text-sm font-bold border-b-2 transition-all ${
                  activeTab === tab.id
                    ? "border-[#00c2ff] text-[#00c2ff]"
                    : "border-transparent text-white/40 hover:text-white/70"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab content */}
        <div className="px-4 py-4 pb-20">
          {/* Posts tab */}
          {activeTab === "posts" && (
            <div className="space-y-4">
              {userPosts.length === 0 ? (
                <div className="text-center py-16">
                  <div className="text-5xl mb-3">📝</div>
                  <p className="text-white/40 text-sm">No posts yet.</p>
                  {isOwnProfile && (
                    <Link href="/x-factor">
                      <button className="mt-4 bg-[#00c2ff]/10 border border-[#00c2ff]/30 text-[#00c2ff] text-sm font-bold px-5 py-2.5 rounded-full">
                        Create Your First Post
                      </button>
                    </Link>
                  )}
                </div>
              ) : (
                userPosts.map((post: any) => (
                  <div key={post.id} className="bg-[#0d1b3e] border border-white/10 rounded-2xl p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-9 h-9 rounded-full overflow-hidden bg-gradient-to-br from-[#00c2ff] to-blue-700 flex items-center justify-center shrink-0">
                        {profile.avatarUrl ? (
                          <img src={profile.avatarUrl} alt={displayName} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-white font-black text-sm">{initials}</span>
                        )}
                      </div>
                      <div>
                        <div className="text-white font-bold text-sm">{displayName}</div>
                        <div className="text-white/30 text-xs">
                          {new Date(post.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                        </div>
                      </div>
                      {post.postType && post.postType !== "status" && (
                        <span className="ml-auto text-[10px] bg-[#00c2ff]/10 text-[#00c2ff] border border-[#00c2ff]/20 px-2 py-0.5 rounded-full font-bold uppercase">
                          {post.postType.replace("_", " ")}
                        </span>
                      )}
                    </div>
                    <p className="text-white/80 text-sm leading-relaxed whitespace-pre-line">{post.content}</p>
                    {post.mediaUrls && Array.isArray(post.mediaUrls) && post.mediaUrls.length > 0 && (
                      <div className={`mt-3 grid gap-2 ${post.mediaUrls.length > 1 ? "grid-cols-2" : "grid-cols-1"}`}>
                        {post.mediaUrls.slice(0, 4).map((url: string, i: number) => (
                          <img key={i} src={url} alt="" className="w-full rounded-xl object-cover aspect-square" loading="lazy" />
                        ))}
                      </div>
                    )}
                    <div className="flex items-center gap-4 mt-3 pt-3 border-t border-white/5">
                      <button className="flex items-center gap-1.5 text-white/40 hover:text-red-400 transition-colors text-xs">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        {post.likesCount || 0}
                      </button>
                      <button className="flex items-center gap-1.5 text-white/40 hover:text-[#00c2ff] transition-colors text-xs">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        {post.commentsCount || 0}
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Highlights tab */}
          {activeTab === "highlights" && (
            <div className="text-center py-10">
              {profile.highlightUrl ? (
                <div>
                  <div className="rounded-2xl overflow-hidden mb-4 aspect-video bg-black">
                    <video src={profile.highlightUrl} controls className="w-full h-full object-cover" />
                  </div>
                  <p className="text-white/40 text-sm">Highlight Reel</p>
                </div>
              ) : (
                <div>
                  <div className="text-5xl mb-3">🎬</div>
                  <p className="text-white/40 text-sm">No highlight reel yet.</p>
                  {isOwnProfile && (
                    <Link href="/profile">
                      <button className="mt-4 bg-[#00c2ff]/10 border border-[#00c2ff]/30 text-[#00c2ff] text-sm font-bold px-5 py-2.5 rounded-full">
                        Add Highlight Reel URL
                      </button>
                    </Link>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Stats tab */}
          {activeTab === "stats" && (
            <div className="space-y-3">
              {[
                { label: "Sport", value: profile.sport },
                { label: "Position", value: profile.position },
                { label: "School", value: profile.school },
                { label: "Class Year", value: profile.classYear },
                { label: "State", value: profile.state },
                { label: "Height", value: profile.height },
                { label: "Weight", value: profile.weight ? `${profile.weight} lbs` : null },
                { label: "GPA", value: profile.gpa ? Number(profile.gpa).toFixed(2) : null },
                { label: "Recruiting Score", value: profile.recruitingScore ? `${profile.recruitingScore}/100` : null },
                { label: "NIL Value", value: profile.nilValue ? `$${Number(profile.nilValue).toLocaleString()}` : null },
                { label: "Followers", value: profile.followers ? Number(profile.followers).toLocaleString() : null },
              ].filter(s => s.value).map((s) => (
                <div key={s.label} className="flex items-center justify-between bg-[#0d1b3e] border border-white/10 rounded-xl px-4 py-3">
                  <span className="text-white/50 text-sm">{s.label}</span>
                  <span className="text-white font-bold text-sm">{s.value}</span>
                </div>
              ))}
              {isOwnProfile && (
                <Link href="/profile">
                  <button className="w-full mt-2 bg-[#00c2ff]/10 border border-[#00c2ff]/30 text-[#00c2ff] text-sm font-bold py-3 rounded-xl">
                    Update Stats
                  </button>
                </Link>
              )}
            </div>
          )}

          {/* NIL tab */}
          {activeTab === "nil" && (
            <div className="text-center py-10">
              <div className="text-5xl mb-3">💰</div>
              <h3 className="text-white font-black text-lg mb-2">NIL Opportunities</h3>
              <p className="text-white/40 text-sm mb-6">
                {isOwnProfile
                  ? "Manage your NIL deals and discover new opportunities."
                  : `Connect with ${displayName} for NIL partnership opportunities.`}
              </p>
              <div className="flex flex-wrap gap-3 justify-center">
                {isOwnProfile ? (
                  <Link href="/nil-portal">
                    <button className="bg-[#00c2ff] text-black font-black px-6 py-3 rounded-xl">
                      Open NIL Portal
                    </button>
                  </Link>
                ) : (
                  <Link href="/messenger">
                    <button className="bg-[#00c2ff] text-black font-black px-6 py-3 rounded-xl">
                      Contact for NIL Deal
                    </button>
                  </Link>
                )}
                <Link href="/nil-portal">
                  <button className="bg-white/10 border border-white/20 text-white font-bold px-6 py-3 rounded-xl">
                    Browse NIL Deals
                  </button>
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* ATHLYNX footer CTA */}
        <div className="fixed bottom-0 left-0 right-0 bg-[#040c1a]/95 backdrop-blur border-t border-white/10 px-4 py-3">
          <div className="max-w-3xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img src="/img-athlete-multisport.jpg" alt="ATHLYNX" className="w-7 h-7 rounded-lg" />
              <div>
                <div className="text-white font-black text-xs leading-none">ATHLYNX</div>
                <div className="text-white/30 text-[10px]">The Athlete's Platform</div>
              </div>
            </div>
            <Link href="/signup">
              <button className="bg-[#00c2ff] text-black font-black text-xs px-4 py-2 rounded-full">
                Join Free — 7 Days
              </button>
            </Link>
          </div>
        </div>
      </div>
      <MobileBottomNav />
    </div>
  );
}
