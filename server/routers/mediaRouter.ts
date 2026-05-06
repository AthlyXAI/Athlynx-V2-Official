/**
 * Media Router — AthlynXAI
 * Athlete video and media upload via AWS S3 presigned URLs
 * Supports: highlight reels, recruiting videos, profile photos, game film
 */
import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { athleteProfiles, users } from "../../drizzle/schema";
import { eq } from "drizzle-orm";
import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import crypto from "crypto";

function getS3(): S3Client | null {
  const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
  const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
  const region = process.env.AWS_REGION || "us-east-1";
  if (!accessKeyId || !secretAccessKey) return null;
  return new S3Client({ region, credentials: { accessKeyId, secretAccessKey } });
}

const BUCKET = process.env.AWS_S3_BUCKET || "";
const CDN_BASE = process.env.AWS_CLOUDFRONT_URL || `https://${BUCKET}.s3.amazonaws.com`;

function generateKey(userId: number, type: string, filename: string): string {
  const hash = crypto.randomBytes(8).toString("hex");
  const ext = filename.split(".").pop()?.toLowerCase() || "mp4";
  return `athletes/${userId}/${type}/${hash}.${ext}`;
}

export const mediaRouter = router({
  /**
   * Get a presigned PUT URL for direct browser → S3 upload
   * Returns: { uploadUrl, key, publicUrl }
   */
  getUploadUrl: protectedProcedure
    .input(z.object({
      filename: z.string(),
      contentType: z.string(),
      mediaType: z.enum(["highlight", "game_film", "training", "profile_photo", "cover_photo", "other"]),
      fileSizeBytes: z.number().max(500 * 1024 * 1024), // 500MB max
    }))
    .mutation(async ({ ctx, input }) => {
      const s3 = getS3();
      if (!s3 || !BUCKET) {
        // Fallback: return a mock URL for development
        const mockKey = generateKey(ctx.user.id, input.mediaType, input.filename);
        return {
          uploadUrl: null,
          key: mockKey,
          publicUrl: `https://athlynx.ai/placeholder-video.mp4`,
          fallback: true,
        };
      }

      const key = generateKey(ctx.user.id, input.mediaType, input.filename);

      const command = new PutObjectCommand({
        Bucket: BUCKET,
        Key: key,
        ContentType: input.contentType,
        Metadata: {
          userId: String(ctx.user.id),
          mediaType: input.mediaType,
          uploadedAt: new Date().toISOString(),
        },
      });

      const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 3600 }); // 1 hour to upload
      const publicUrl = `${CDN_BASE}/${key}`;

      return { uploadUrl, key, publicUrl, fallback: false };
    }),

  /**
   * Save uploaded media to athlete profile
   * Called after successful S3 upload
   */
  saveMedia: protectedProcedure
    .input(z.object({
      key: z.string(),
      publicUrl: z.string(),
      mediaType: z.enum(["highlight", "game_film", "training", "profile_photo", "cover_photo", "other"]),
      title: z.string().optional(),
      description: z.string().optional(),
      sport: z.string().optional(),
      isHighlightReel: z.boolean().default(false),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database unavailable");

      // Get current profile
      const [profile] = await db.select().from(athleteProfiles)
        .where(eq(athleteProfiles.userId, ctx.user.id)).limit(1);

      const currentVideos: any[] = (profile as any)?.recruitingVideos ?? [];

      const newVideo = {
        id: crypto.randomUUID(),
        key: input.key,
        url: input.publicUrl,
        type: input.mediaType,
        title: input.title || `${input.mediaType.replace("_", " ")} video`,
        description: input.description || "",
        sport: input.sport || profile?.sport || "",
        isHighlightReel: input.isHighlightReel,
        uploadedAt: new Date().toISOString(),
        views: 0,
        likes: 0,
      };

      const updatedVideos = [...currentVideos, newVideo];

      // Update profile
      if (profile) {
        await db.update(athleteProfiles)
          .set({
            // @ts-ignore — recruitingVideos is a JSON column we're adding
            recruitingVideos: updatedVideos,
            // If this is the highlight reel, also update highlightUrl
            ...(input.isHighlightReel ? { highlightUrl: input.publicUrl } : {}),
            updatedAt: new Date(),
          })
          .where(eq(athleteProfiles.userId, ctx.user.id));
      } else {
        await db.insert(athleteProfiles).values({
          userId: ctx.user.id,
          // @ts-ignore
          recruitingVideos: updatedVideos,
          ...(input.isHighlightReel ? { highlightUrl: input.publicUrl } : {}),
        });
      }

      return { success: true, video: newVideo };
    }),

  /**
   * Get all recruiting videos for an athlete
   */
  getAthleteVideos: publicProcedure
    .input(z.object({ userId: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];
      const [profile] = await db.select().from(athleteProfiles)
        .where(eq(athleteProfiles.userId, input.userId)).limit(1);
      return (profile as any)?.recruitingVideos ?? [];
    }),

  /**
   * Get my own recruiting videos
   */
  getMyVideos: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return [];
    const [profile] = await db.select().from(athleteProfiles)
      .where(eq(athleteProfiles.userId, ctx.user.id)).limit(1);
    return (profile as any)?.recruitingVideos ?? [];
  }),

  /**
   * Delete a video
   */
  deleteVideo: protectedProcedure
    .input(z.object({ videoId: z.string(), key: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database unavailable");

      // Remove from S3
      const s3 = getS3();
      if (s3 && BUCKET) {
        try {
          await s3.send(new DeleteObjectCommand({ Bucket: BUCKET, Key: input.key }));
        } catch (e) {
          console.warn("[Media] S3 delete failed:", e);
        }
      }

      // Remove from profile
      const [profile] = await db.select().from(athleteProfiles)
        .where(eq(athleteProfiles.userId, ctx.user.id)).limit(1);
      const currentVideos: any[] = (profile as any)?.recruitingVideos ?? [];
      const updatedVideos = currentVideos.filter((v: any) => v.id !== input.videoId);

      await db.update(athleteProfiles)
        .set({ recruitingVideos: updatedVideos as any, updatedAt: new Date() } as any)
        .where(eq(athleteProfiles.userId, ctx.user.id));

      return { success: true };
    }),

  /**
   * Increment video view count
   */
  recordView: publicProcedure
    .input(z.object({ userId: z.number(), videoId: z.string() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) return { success: false };
      const [profile] = await db.select().from(athleteProfiles)
        .where(eq(athleteProfiles.userId, input.userId)).limit(1);
      const videos: any[] = (profile as any)?.recruitingVideos ?? [];
      const updated = videos.map((v: any) =>
        v.id === input.videoId ? { ...v, views: (v.views || 0) + 1 } : v
      );
      await db.update(athleteProfiles)
        .set({ recruitingVideos: updated as any, updatedAt: new Date() } as any)
        .where(eq(athleteProfiles.userId, input.userId));
      return { success: true };
    }),
});
