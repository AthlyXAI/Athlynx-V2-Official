/**
 * ATHLYNX FEED — Facebook/Instagram-style athlete social feed
 * Stories bar at top + real profile photos + like/comment/share
 */
import PlatformLayout from "@/components/PlatformLayout";
import { useState, useRef } from "react";
import { RouteErrorBoundary } from "@/components/GlobalErrorBoundary";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { toast } from "sonner";

const BADGE_COLORS: Record<string, string> = {
  ACHIEVEMENT: "bg-yellow-600", WORKOUT: "bg-green-600",
  NIL_DEAL: "bg-purple-600", STATUS: "bg-blue-600",
  ANNOUNCEMENT: "bg-red-600", MILESTONE: "bg-yellow-500",
};

const STORY_TYPES = [
  { type: "update", label: "Update", icon: "📢", color: "#3b82f6" },
  { type: "highlight", label: "Highlight", icon: "🏆", color: "#f59e0b" },
  { type: "nil", label: "NIL", icon: "💰", color: "#10b981" },
  { type: "game", label: "Game", icon: "🎮", color: "#ef4444" },
  { type: "training", label: "Training", icon: "⚡", color: "#06b6d4" },
  { type: "life", label: "Life", icon: "🌟", color: "#8b5cf6" },
];

function Avatar({ src, name, size = "md" }: { src?: string | null; name?: string | null; size?: "sm" | "md" | "lg" }) {
  const initials = (name || "AT").split(" ").map((w: string) => w[0]).join("").slice(0, 2).toUpperCase();
  const sizeClass = size === "sm" ? "w-8 h-8 text-xs" : size === "lg" ? "w-14 h-14 text-lg" : "w-11 h-11 text-sm";
  return (
    <div className={`${sizeClass} rounded-full bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center font-black shrink-0 text-white overflow-hidden`}>
      {src ? (
        <img src={src} alt={name || "Athlete"} className="w-full h-full object-cover"
          onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
      ) : <span>{initials}</span>}
    </div>
  );
}

// ─── STORIES BAR ─────────────────────────────────────────────────────────────
function StoriesBar({ user }: { user: any }) {
  const [showAddStory, setShowAddStory] = useState(false);
  const [viewingStory, setViewingStory] = useState<any>(null);
  const [storyProgress, setStoryProgress] = useState(0);
  const [newStory, setNewStory] = useState({ caption: "", storyType: "update" });
  const progressRef = useRef<NodeJS.Timeout | null>(null);
  const utils = trpc.useUtils();

  const { data: stories = [] } = trpc.stories.getActiveStories.useQuery(undefined, {
    refetchInterval: 30000,
  });

  const createStory = trpc.stories.createStory.useMutation({
    onSuccess: () => {
      utils.stories.getActiveStories.invalidate();
      setShowAddStory(false);
      setNewStory({ caption: "", storyType: "update" });
      toast.success("Story posted! Visible for 24 hours.");
    },
    onError: (e) => toast.error(e.message),
  });

  const viewStory = trpc.stories.viewStory.useMutation();

  const openStory = (story: any) => {
    setViewingStory(story);
    setStoryProgress(0);
    viewStory.mutate({ storyId: story.id });
    // Auto-progress bar
    if (progressRef.current) clearInterval(progressRef.current);
    progressRef.current = setInterval(() => {
      setStoryProgress(p => {
        if (p >= 100) {
          clearInterval(progressRef.current!);
          setViewingStory(null);
          return 0;
        }
        return p + 2;
      });
    }, 100);
  };

  const closeStory = () => {
    setViewingStory(null);
    setStoryProgress(0);
    if (progressRef.current) clearInterval(progressRef.current);
  };

  // Group stories by user
  const storyUsers = (stories as any[]).reduce((acc: any[], story: any) => {
    const existing = acc.find((u: any) => u.userId === story.userId);
    if (existing) {
      existing.stories.push(story);
    } else {
      acc.push({ userId: story.userId, name: story.authorName, avatar: story.authorAvatar, stories: [story] });
    }
    return acc;
  }, []);

  return (
    <>
      <div className="bg-[#1a3a8f] border border-blue-900 rounded-xl p-3">
        <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide">
          {/* Add Story button */}
          {user && (
            <button onClick={() => setShowAddStory(true)}
              className="flex flex-col items-center gap-1.5 shrink-0">
              <div className="w-14 h-14 rounded-full bg-[#0d1f3c] border-2 border-dashed border-blue-500 flex items-center justify-center text-blue-400 hover:border-blue-300 hover:text-blue-300 transition-colors relative">
                <Avatar src={user.avatarUrl} name={user.name} size="lg" />
                <div className="absolute bottom-0 right-0 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center border-2 border-[#1a3a8f]">
                  <span className="text-white text-xs font-black">+</span>
                </div>
              </div>
              <span className="text-blue-300 text-[10px] font-semibold whitespace-nowrap">Your Story</span>
            </button>
          )}

          {/* Other users' stories */}
          {storyUsers.map((storyUser: any) => (
            <button key={storyUser.userId} onClick={() => openStory(storyUser.stories[0])}
              className="flex flex-col items-center gap-1.5 shrink-0">
              <div className="w-14 h-14 rounded-full p-0.5 bg-gradient-to-tr from-blue-500 via-cyan-400 to-blue-600">
                <div className="w-full h-full rounded-full overflow-hidden bg-[#0d1f3c] border-2 border-[#1a3a8f]">
                  <Avatar src={storyUser.avatar} name={storyUser.name} size="lg" />
                </div>
              </div>
              <span className="text-white text-[10px] font-semibold whitespace-nowrap max-w-14 truncate">
                {storyUser.name?.split(" ")[0] || "Athlete"}
              </span>
            </button>
          ))}

          {/* Placeholder stories for visual richness */}
          {storyUsers.length === 0 && [
            { name: "Marcus J.", icon: "🏈", color: "from-red-500 to-red-700" },
            { name: "Jordan D.", icon: "🏀", color: "from-orange-500 to-orange-700" },
            { name: "Aaliyah T.", icon: "🏃", color: "from-green-500 to-green-700" },
            { name: "Deon W.", icon: "⚾", color: "from-blue-500 to-blue-700" },
          ].map((p, i) => (
            <div key={i} className="flex flex-col items-center gap-1.5 shrink-0 opacity-40">
              <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${p.color} flex items-center justify-center text-2xl border-2 border-blue-500`}>
                {p.icon}
              </div>
              <span className="text-blue-400 text-[10px] font-semibold">{p.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Add Story Modal */}
      {showAddStory && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[#0d1b3e] border border-blue-700 rounded-2xl w-full max-w-sm p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-white font-black text-lg">Add to Your Story</h3>
              <button onClick={() => setShowAddStory(false)} className="w-8 h-8 bg-blue-900 rounded-full flex items-center justify-center text-white hover:bg-blue-700">✕</button>
            </div>
            <div className="flex items-center gap-3">
              <Avatar src={user?.avatarUrl} name={user?.name} />
              <div>
                <div className="text-white font-bold text-sm">{user?.name}</div>
                <div className="text-blue-400 text-xs">Visible for 24 hours</div>
              </div>
            </div>
            <div>
              <label className="text-blue-400 text-xs mb-1 block">Story Type</label>
              <div className="grid grid-cols-3 gap-2">
                {STORY_TYPES.map(t => (
                  <button key={t.type} onClick={() => setNewStory(p => ({ ...p, storyType: t.type }))}
                    className={`flex flex-col items-center gap-1 py-2 rounded-xl text-xs font-bold border transition-colors ${newStory.storyType === t.type ? "border-blue-500 bg-blue-900/50 text-white" : "border-blue-900 text-blue-400 hover:border-blue-600"}`}>
                    <span className="text-lg">{t.icon}</span>
                    <span>{t.label}</span>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-blue-400 text-xs mb-1 block">Caption</label>
              <textarea value={newStory.caption} onChange={e => setNewStory(p => ({ ...p, caption: e.target.value }))}
                placeholder="What's your story? Share a highlight, update, or NIL news..."
                rows={3} className="w-full bg-[#1a3a8f] border border-blue-800 text-white text-sm rounded-xl px-3 py-2.5 focus:outline-none focus:border-blue-500 placeholder-blue-600 resize-none" />
            </div>
            <div className="flex gap-3">
              <button onClick={() => createStory.mutate({ caption: newStory.caption, storyType: newStory.storyType as any, mediaType: "text" })}
                disabled={createStory.isPending || !newStory.caption.trim()}
                className="flex-1 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-colors">
                {createStory.isPending ? "Posting..." : "Post Story"}
              </button>
              <button onClick={() => setShowAddStory(false)} className="flex-1 border border-blue-700 text-blue-300 font-bold py-3 rounded-xl hover:bg-blue-900">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Story Viewer */}
      {viewingStory && (
        <div className="fixed inset-0 z-50 bg-black flex items-center justify-center" onClick={closeStory}>
          {/* Progress bar */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-white/20">
            <div className="h-full bg-white transition-all duration-100" style={{ width: `${storyProgress}%` }} />
          </div>
          {/* Author */}
          <div className="absolute top-4 left-4 flex items-center gap-3 z-10">
            <Avatar src={viewingStory.authorAvatar} name={viewingStory.authorName} />
            <div>
              <div className="text-white font-bold text-sm">{viewingStory.authorName}</div>
              <div className="text-white/60 text-xs">{new Date(viewingStory.createdAt).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}</div>
            </div>
          </div>
          {/* Close */}
          <button onClick={closeStory} className="absolute top-4 right-4 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-white text-lg z-10">✕</button>
          {/* Content */}
          <div className="max-w-sm w-full mx-4 text-center" onClick={e => e.stopPropagation()}>
            {viewingStory.mediaUrl && viewingStory.mediaType === "image" && (
              <img src={viewingStory.mediaUrl} alt="" className="w-full rounded-2xl mb-4 max-h-96 object-cover" />
            )}
            {viewingStory.caption && (
              <div className="bg-black/60 backdrop-blur rounded-2xl p-4">
                <p className="text-white text-lg font-semibold leading-relaxed">{viewingStory.caption}</p>
              </div>
            )}
            {!viewingStory.mediaUrl && !viewingStory.caption && (
              <div className="bg-gradient-to-br from-blue-600 to-cyan-600 rounded-2xl p-12 text-6xl">🏆</div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

// ─── POST CARD ────────────────────────────────────────────────────────────────
function PostCard({ post, currentUserId, currentUserAvatar, currentUserName }: {
  post: any; currentUserId?: number; currentUserAvatar?: string | null; currentUserName?: string | null;
}) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likesCount ?? 0);
  const [showComments, setShowComments] = useState(false);
  const [comment, setComment] = useState("");
  const utils = trpc.useUtils();

  const likeMutation = trpc.feed.likePost.useMutation({
    onMutate: () => { setLiked(l => !l); setLikeCount((c: number) => liked ? c - 1 : c + 1); },
    onSettled: () => utils.feed.getFeed.invalidate(),
  });
  const addCommentMutation = trpc.feed.addComment.useMutation({
    onSuccess: () => { setComment(""); utils.feed.getComments.invalidate({ postId: post.id }); },
  });
  const { data: comments = [] } = trpc.feed.getComments.useQuery({ postId: post.id }, { enabled: showComments });

  const timeAgo = (date: Date) => {
    const s = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
    if (s < 60) return `${s}s`; if (s < 3600) return `${Math.floor(s / 60)}m`;
    if (s < 86400) return `${Math.floor(s / 3600)}h`; return `${Math.floor(s / 86400)}d`;
  };

  return (
    <div className="bg-[#1a3a8f] border border-blue-900 rounded-xl overflow-hidden">
      <div className="flex items-start gap-3 p-4 pb-2">
        <Avatar src={post.authorAvatar} name={post.authorName} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="font-bold text-white text-sm">{post.authorName || "Athlete"}</span>
            <svg className="w-3.5 h-3.5 text-blue-400 shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/></svg>
          </div>
          <div className="text-blue-400 text-xs mt-0.5">{timeAgo(post.createdAt)} · 🌐</div>
        </div>
        <span className={`text-[9px] font-black px-2 py-1 rounded-full text-white shrink-0 ${BADGE_COLORS[post.postType?.toUpperCase()] ?? "bg-blue-600"}`}>
          {post.postType?.toUpperCase() || "POST"}
        </span>
      </div>
      <div className="px-4 pb-3"><p className="text-blue-100 text-sm leading-relaxed">{post.content}</p></div>
      {post.mediaUrl && post.mediaType === "video" && (
        <video className="w-full max-h-72 object-cover" muted loop playsInline controls><source src={post.mediaUrl} /></video>
      )}
      {post.mediaUrl && post.mediaType === "image" && (
        <img src={post.mediaUrl} className="w-full max-h-72 object-cover" alt="" />
      )}
      <div className="px-4 py-2 flex items-center justify-between text-xs text-blue-400 border-t border-blue-900/50">
        <div className="flex items-center gap-1">
          {likeCount > 0 && (
            <><span className="w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center text-[8px]">👍</span><span>{likeCount.toLocaleString()}</span></>
          )}
        </div>
        <div className="flex items-center gap-3">
          {(post.commentsCount ?? 0) > 0 && <span>{post.commentsCount} comments</span>}
        </div>
      </div>
      <div className="px-2 py-1 flex items-center border-t border-blue-900">
        <button onClick={() => currentUserId && likeMutation.mutate({ postId: post.id })}
          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-semibold transition-colors ${liked ? "text-blue-400 bg-blue-900/50" : "text-blue-400 hover:bg-blue-900/30"}`}>
          <svg className="w-5 h-5" fill={liked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"/>
          </svg>
          Like
        </button>
        <button onClick={() => setShowComments(!showComments)}
          className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-semibold text-blue-400 hover:bg-blue-900/30 transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
          </svg>
          Comment
        </button>
        <button onClick={() => navigator.share?.({ title: `${post.authorName} on ATHLYNX`, text: post.content, url: window.location.href })}
          className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-semibold text-blue-400 hover:bg-blue-900/30 transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/>
          </svg>
          Share
        </button>
      </div>
      {showComments && (
        <div className="px-4 pb-4 border-t border-blue-900 pt-3 space-y-3">
          {currentUserId ? (
            <div className="flex gap-2">
              <Avatar src={currentUserAvatar} name={currentUserName} size="sm" />
              <div className="flex-1 flex gap-2">
                <input value={comment} onChange={e => setComment(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && comment.trim() && addCommentMutation.mutate({ postId: post.id, content: comment })}
                  placeholder="Write a comment..." className="flex-1 bg-[#0d1f3c] border border-blue-800 text-white text-sm rounded-full px-4 py-1.5 focus:outline-none focus:border-blue-500 placeholder-blue-500" />
                <button onClick={() => comment.trim() && addCommentMutation.mutate({ postId: post.id, content: comment })}
                  disabled={addCommentMutation.isPending || !comment.trim()} className="text-blue-400 hover:text-blue-300 text-sm font-bold px-2 disabled:opacity-50">Post</button>
              </div>
            </div>
          ) : (
            <div className="text-center py-2"><a href="/signup" className="text-blue-400 text-sm hover:text-blue-300">Sign in to comment</a></div>
          )}
          {(comments as any[]).length === 0 && <div className="text-xs text-blue-500 text-center py-1">Be the first to comment</div>}
          {(comments as any[]).map((c: any) => (
            <div key={c.id} className="flex gap-2">
              <Avatar src={c.authorAvatar} name={c.authorName} size="sm" />
              <div className="bg-[#0d1f3c] rounded-2xl px-3 py-2 flex-1">
                <div className="text-xs font-bold text-blue-300">{c.authorName || "Athlete"}</div>
                <div className="text-xs text-blue-100 mt-0.5">{c.content}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── MAIN FEED ────────────────────────────────────────────────────────────────
function FeedInner() {
  const { user } = useAuth();
  const [postText, setPostText] = useState("");
  const [postType, setPostType] = useState<"status" | "achievement" | "workout" | "nil_deal" | "announcement" | "milestone">("status");
  const utils = trpc.useUtils();
  const { data: feedData, isLoading } = trpc.feed.getFeed.useQuery({ limit: 30 });
  const posts = feedData ?? [];

  const createPostMutation = trpc.feed.createPost.useMutation({
    onSuccess: () => { setPostText(""); utils.feed.getFeed.invalidate(); },
  });

  return (
    <PlatformLayout>
      <div className="space-y-3 pb-24 lg:pb-4">

        {/* Stories bar — Instagram/Facebook style */}
        <StoriesBar user={user} />

        {/* Create post */}
        <div className="bg-[#1a3a8f] border border-blue-900 rounded-xl overflow-hidden">
          {user ? (
            <>
              <div className="flex gap-3 p-4 pb-2">
                <Avatar src={user.avatarUrl} name={user.name} />
                <textarea value={postText} onChange={e => setPostText(e.target.value)}
                  placeholder={`What's on your mind, ${user.name?.split(" ")[0] || "Athlete"}? Share your highlight, training update, or NIL news...`}
                  rows={2} className="flex-1 bg-[#0d1f3c] border border-blue-800 text-white text-sm rounded-2xl px-4 py-2.5 focus:outline-none focus:border-blue-500 placeholder-blue-500 resize-none" />
              </div>
              <div className="flex items-center gap-1 px-4 pb-3 pt-1 border-t border-blue-900/50">
                {[
                  { label: "📸 Photo", value: "achievement", color: "text-green-400" },
                  { label: "🎬 Video", value: "workout", color: "text-red-400" },
                  { label: "💰 NIL Deal", value: "nil_deal", color: "text-yellow-400" },
                  { label: "🏆 Highlight", value: "status", color: "text-blue-400" },
                ].map(btn => (
                  <button key={btn.value} onClick={() => setPostType(btn.value as any)}
                    className={`text-xs font-semibold px-2 py-1.5 rounded-lg transition-colors ${postType === btn.value ? `${btn.color} bg-blue-900/60` : `${btn.color} hover:bg-blue-900/30`}`}>
                    {btn.label}
                  </button>
                ))}
                <button onClick={() => postText.trim() && createPostMutation.mutate({ content: postText, postType })}
                  disabled={createPostMutation.isPending || !postText.trim()}
                  className="ml-auto bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-sm font-bold px-5 py-1.5 rounded-full transition-colors">
                  {createPostMutation.isPending ? "Posting..." : "Post"}
                </button>
              </div>
            </>
          ) : (
            <div className="p-4 text-center">
              <a href="/signup" className="inline-block bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-2.5 rounded-xl transition-colors">Sign In to Post</a>
            </div>
          )}
        </div>

        {/* Loading skeleton */}
        {isLoading && [1, 2, 3].map(i => (
          <div key={i} className="bg-[#1a3a8f] border border-blue-900 rounded-xl p-4 animate-pulse">
            <div className="flex gap-3 mb-3"><div className="w-11 h-11 rounded-full bg-blue-800" /><div className="flex-1 space-y-2"><div className="h-4 bg-blue-800 rounded w-1/3" /><div className="h-3 bg-blue-800 rounded w-1/4" /></div></div>
            <div className="space-y-2"><div className="h-3 bg-blue-800 rounded" /><div className="h-3 bg-blue-800 rounded w-5/6" /></div>
          </div>
        ))}

        {/* Empty state */}
        {!isLoading && (posts as any[]).length === 0 && (
          <div className="bg-[#1a3a8f] border border-blue-900 rounded-xl p-8 text-center">
            <div className="text-5xl mb-4">🏆</div>
            <div className="text-white font-bold text-lg mb-2">The Feed is Live — Be First</div>
            <div className="text-blue-400 text-sm mb-4">Share your highlight, training update, or NIL news.</div>
            {!user && <a href="/signup" className="inline-block bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-2.5 rounded-xl transition-colors">Sign In to Post</a>}
          </div>
        )}

        {/* Posts */}
        {(posts as any[]).map((post: any) => (
          <PostCard key={post.id} post={post}
            currentUserId={user?.id ? Number(user.id) : undefined}
            currentUserAvatar={user?.avatarUrl}
            currentUserName={user?.name}
          />
        ))}
      </div>
    </PlatformLayout>
  );
}

export default function Feed() {
  return <RouteErrorBoundary><FeedInner /></RouteErrorBoundary>;
}
