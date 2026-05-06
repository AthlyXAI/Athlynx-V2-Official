/**
 * VideoUploadHub — AthlynXAI
 * Athlete video upload and gallery — like Hudl but better
 * Drag-and-drop upload, multi-video gallery, share links, view counts
 * Supports: highlight reels, game film, training videos, recruiting videos
 */
import { useState, useRef, useCallback } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Upload, Video, Trash2, Eye, Star, Share2, Play, Film, Plus, X } from "lucide-react";
import { toast } from "sonner";

const VIDEO_TYPES = [
  { id: "highlight", label: "🏆 Highlight Reel", desc: "Your best plays" },
  { id: "game_film", label: "🎬 Game Film", desc: "Full game footage" },
  { id: "training", label: "💪 Training", desc: "Practice & drills" },
  { id: "other", label: "📹 Other", desc: "Any other video" },
];

interface VideoUploadHubProps {
  userId?: number;
  readOnly?: boolean;
}

export default function VideoUploadHub({ userId, readOnly = false }: VideoUploadHubProps) {
  const { user } = useAuth();
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedType, setSelectedType] = useState<"highlight" | "game_film" | "training" | "other">("highlight");
  const [videoTitle, setVideoTitle] = useState("");
  const [videoDesc, setVideoDesc] = useState("");
  const [isHighlightReel, setIsHighlightReel] = useState(false);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const targetUserId = userId ?? Number(user?.id ?? 0);

  const { data: videos = [], refetch } = trpc.media.getAthleteVideos.useQuery(
    { userId: targetUserId },
    { enabled: targetUserId > 0, retry: false }
  );

  const getUploadUrl = trpc.media.getUploadUrl.useMutation();
  const saveMedia = trpc.media.saveMedia.useMutation({
    onSuccess: () => {
      refetch();
      setShowUploadForm(false);
      setSelectedFile(null);
      setVideoTitle("");
      setVideoDesc("");
      setIsHighlightReel(false);
      toast.success("Video uploaded successfully!");
    },,
    onError: (err: any) => { toast.error(err?.message || "Something went wrong. Please try again."); }
  });
  const deleteVideo = trpc.media.deleteVideo.useMutation({
    onSuccess: () => { refetch(); toast.success("Video deleted"); },,
    onError: (err: any) => { toast.error(err?.message || "Something went wrong. Please try again."); }
  });
  const recordView = trpc.media.recordView.useMutation();

  const handleFileSelect = useCallback((file: File) => {
    if (!file.type.startsWith("video/")) {
      toast.error("Please select a video file");
      return;
    }
    if (file.size > 500 * 1024 * 1024) {
      toast.error("File too large. Max 500MB.");
      return;
    }
    setSelectedFile(file);
    setVideoTitle(file.name.replace(/\.[^.]+$/, "").replace(/[-_]/g, " "));
    setShowUploadForm(true);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  }, [handleFileSelect]);

  const handleUpload = async () => {
    if (!selectedFile || !user) return;
    setUploading(true);
    setUploadProgress(10);

    try {
      // Get presigned URL
      const { uploadUrl, key, publicUrl, fallback } = await getUploadUrl.mutateAsync({
        filename: selectedFile.name,
        contentType: selectedFile.type,
        mediaType: selectedType,
        fileSizeBytes: selectedFile.size,
      });

      setUploadProgress(30);

      let finalUrl = publicUrl;

      if (uploadUrl && !fallback) {
        // Upload directly to S3
        const xhr = new XMLHttpRequest();
        await new Promise<void>((resolve, reject) => {
          xhr.upload.onprogress = (e) => {
            if (e.lengthComputable) {
              setUploadProgress(30 + Math.round((e.loaded / e.total) * 60));
            }
          };
          xhr.onload = () => {
            if (xhr.status === 200) resolve();
            else reject(new Error(`Upload failed: ${xhr.status}`));
          };
          xhr.onerror = () => reject(new Error("Upload failed"));
          xhr.open("PUT", uploadUrl);
          xhr.setRequestHeader("Content-Type", selectedFile.type);
          xhr.send(selectedFile);
        });
      } else {
        // Fallback: create object URL for demo
        finalUrl = URL.createObjectURL(selectedFile);
        setUploadProgress(90);
      }

      setUploadProgress(95);

      // Save to profile
      await saveMedia.mutateAsync({
        key,
        publicUrl: finalUrl,
        mediaType: selectedType,
        title: videoTitle || selectedFile.name,
        description: videoDesc,
        sport: (user as any)?.sport || "",
        isHighlightReel,
      });

      setUploadProgress(100);
    } catch (err: any) {
      toast.error(err.message || "Upload failed");
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleShare = (video: any) => {
    const url = `${window.location.origin}/athlete/${targetUserId}`;
    navigator.clipboard.writeText(url);
    toast.success("Profile link copied to clipboard!");
  };

  const typeEmoji: Record<string, string> = {
    highlight: "🏆", game_film: "🎬", training: "💪", other: "📹",
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-white font-black text-base flex items-center gap-2">
          <Film className="w-5 h-5 text-blue-400" />
          Recruiting Videos
          {videos.length > 0 && (
            <span className="text-xs bg-blue-900/60 text-blue-400 px-2 py-0.5 rounded-full">{videos.length}</span>
          )}
        </h3>
        {!readOnly && !showUploadForm && (
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-black px-3 py-2 rounded-full transition-colors"
          >
            <Plus className="w-3 h-3" /> Add Video
          </button>
        )}
      </div>

      {/* Upload Zone */}
      {!readOnly && !showUploadForm && (
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
            isDragging
              ? "border-blue-400 bg-blue-900/30"
              : "border-blue-800/50 hover:border-blue-600/70 hover:bg-blue-900/20"
          }`}
        >
          <Upload className="w-8 h-8 text-blue-500 mx-auto mb-2" />
          <div className="text-white font-bold text-sm">Drop your video here or click to upload</div>
          <div className="text-blue-500 text-xs mt-1">MP4, MOV, AVI · Max 500MB · Highlight reels, game film, training</div>
          <input
            ref={fileInputRef}
            type="file"
            accept="video/*"
            className="hidden"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFileSelect(f); }}
          />
        </div>
      )}

      {/* Upload Form */}
      {showUploadForm && selectedFile && (
        <div className="bg-[#0d1f3c] border border-blue-700 rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="text-white font-black text-sm">📹 {selectedFile.name}</div>
            <button onClick={() => { setShowUploadForm(false); setSelectedFile(null); }} className="text-slate-500 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Video type */}
          <div>
            <label className="text-blue-400 text-xs font-bold uppercase tracking-wider block mb-2">Video Type</label>
            <div className="grid grid-cols-2 gap-2">
              {VIDEO_TYPES.map(t => (
                <button
                  key={t.id}
                  onClick={() => setSelectedType(t.id as any)}
                  className={`text-left p-2.5 rounded-xl border text-xs transition-all ${
                    selectedType === t.id
                      ? "border-blue-500 bg-blue-900/60 text-white"
                      : "border-slate-700 text-slate-400 hover:border-slate-600"
                  }`}
                >
                  <div className="font-bold">{t.label}</div>
                  <div className="text-slate-500 text-[10px]">{t.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="text-blue-400 text-xs font-bold uppercase tracking-wider block mb-1">Title</label>
            <input
              value={videoTitle}
              onChange={e => setVideoTitle(e.target.value)}
              placeholder="e.g. Senior Season Highlights 2026"
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white text-sm outline-none focus:border-blue-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-blue-400 text-xs font-bold uppercase tracking-wider block mb-1">Description (optional)</label>
            <textarea
              value={videoDesc}
              onChange={e => setVideoDesc(e.target.value)}
              placeholder="Describe what scouts will see..."
              rows={2}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white text-sm outline-none focus:border-blue-500 resize-none"
            />
          </div>

          {/* Highlight reel toggle */}
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={isHighlightReel}
              onChange={e => setIsHighlightReel(e.target.checked)}
              className="w-4 h-4 rounded accent-blue-500"
            />
            <span className="text-white text-sm font-bold">Set as my primary Highlight Reel</span>
          </label>

          {/* Upload progress */}
          {uploading && (
            <div>
              <div className="flex justify-between text-xs text-slate-400 mb-1">
                <span>Uploading...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          <div className="flex gap-2">
            <button
              onClick={handleUpload}
              disabled={uploading || !videoTitle}
              className="flex-1 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-black py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <Upload className="w-4 h-4" />
              {uploading ? "Uploading..." : "Upload Video"}
            </button>
            <button
              onClick={() => { setShowUploadForm(false); setSelectedFile(null); }}
              className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-3 rounded-xl transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Video Gallery */}
      {videos.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {videos.map((video: any) => (
            <div key={video.id} className="bg-[#0d1f3c] border border-blue-800/50 rounded-2xl overflow-hidden group hover:border-blue-600/70 transition-all">
              {/* Video Player */}
              <div className="relative aspect-video bg-black">
                {playingId === video.id ? (
                  <video
                    src={video.url}
                    controls
                    autoPlay
                    className="w-full h-full object-cover"
                    onEnded={() => setPlayingId(null)}
                  />
                ) : (
                  <div
                    className="w-full h-full flex items-center justify-center cursor-pointer bg-gradient-to-br from-blue-950 to-slate-900"
                    onClick={() => {
                      setPlayingId(video.id);
                      if (targetUserId > 0) recordView.mutate({ userId: targetUserId, videoId: video.id });
                    }}
                  >
                    <div className="w-14 h-14 rounded-full bg-blue-600/80 flex items-center justify-center hover:bg-blue-500 transition-colors">
                      <Play className="w-6 h-6 text-white ml-1" />
                    </div>
                    {video.isHighlightReel && (
                      <div className="absolute top-2 left-2 bg-yellow-500 text-black text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Star className="w-3 h-3" /> Highlight Reel
                      </div>
                    )}
                    <div className="absolute bottom-2 right-2 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded-full">
                      {typeEmoji[video.type] || "📹"} {video.type?.replace("_", " ")}
                    </div>
                  </div>
                )}
              </div>

              {/* Video Info */}
              <div className="p-3">
                <div className="text-white font-bold text-sm truncate">{video.title}</div>
                {video.description && (
                  <div className="text-slate-500 text-xs mt-0.5 truncate">{video.description}</div>
                )}
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> {video.views || 0}</span>
                    <span>{new Date(video.uploadedAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleShare(video)}
                      className="text-slate-500 hover:text-blue-400 transition-colors p-1"
                      title="Share"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                    </button>
                    {!readOnly && (
                      <button
                        onClick={() => deleteVideo.mutate({ videoId: video.id, key: video.key })}
                        className="text-slate-600 hover:text-red-400 transition-colors p-1"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-slate-600">
          <Video className="w-10 h-10 mx-auto mb-2 text-slate-700" />
          <div className="text-sm font-bold text-slate-500">
            {readOnly ? "No videos uploaded yet" : "Upload your first video to get noticed by scouts"}
          </div>
          {!readOnly && (
            <div className="text-xs text-slate-600 mt-1">Highlight reels get 3x more coach views</div>
          )}
        </div>
      )}
    </div>
  );
}
