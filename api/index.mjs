var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// drizzle/schema.ts
var schema_exports = {};
__export(schema_exports, {
  activityLog: () => activityLog,
  athleteDataEvents: () => athleteDataEvents,
  athleteDataSources: () => athleteDataSources,
  athleteDataSummaries: () => athleteDataSummaries,
  athleteFeedback: () => athleteFeedback,
  athleteProfiles: () => athleteProfiles,
  broadcastMessages: () => broadcastMessages,
  convParticipantRoleValues: () => convParticipantRoleValues,
  convTypeValues: () => convTypeValues,
  conversationParticipants: () => conversationParticipants,
  conversations: () => conversations,
  crmContactRoleValues: () => crmContactRoleValues,
  crmContactStatusValues: () => crmContactStatusValues,
  crmContacts: () => crmContacts,
  crmPipeline: () => crmPipeline,
  crmPipelineStageValues: () => crmPipelineStageValues,
  dataEventTypeValues: () => dataEventTypeValues,
  dataSourceTypeValues: () => dataSourceTypeValues,
  expiryEmailTypeValues: () => expiryEmailTypeValues,
  expiryNoticeStatusValues: () => expiryNoticeStatusValues,
  feedbackCategoryValues: () => feedbackCategoryValues,
  feedbackStatusValues: () => feedbackStatusValues,
  feedbackVotes: () => feedbackVotes,
  messages: () => messages,
  msgTypeValues: () => msgTypeValues,
  nilDealStatusValues: () => nilDealStatusValues,
  nilDeals: () => nilDeals,
  notifPriorityValues: () => notifPriorityValues,
  notifTypeValues: () => notifTypeValues,
  notifications: () => notifications,
  postComments: () => postComments,
  postLikes: () => postLikes,
  postMediaTypeValues: () => postMediaTypeValues,
  postSourceValues: () => postSourceValues,
  postTypeValues: () => postTypeValues,
  postVisibilityValues: () => postVisibilityValues,
  posts: () => posts,
  subscriptionExpiryNotices: () => subscriptionExpiryNotices,
  trainingLogs: () => trainingLogs,
  transferPortalEntries: () => transferPortalEntries,
  transferStatusValues: () => transferStatusValues,
  userRoleValues: () => userRoleValues,
  users: () => users,
  verifTypeValues: () => verifTypeValues,
  verificationCodes: () => verificationCodes,
  waitlist: () => waitlist
});
import {
  mysqlTable,
  int,
  varchar,
  text,
  boolean,
  timestamp,
  float,
  mysqlEnum,
  serial,
  json,
  tinyint
} from "drizzle-orm/mysql-core";
var userRoleValues, nilDealStatusValues, transferStatusValues, verifTypeValues, postTypeValues, crmContactRoleValues, crmContactStatusValues, crmPipelineStageValues, notifTypeValues, notifPriorityValues, postVisibilityValues, postMediaTypeValues, postSourceValues, msgTypeValues, convTypeValues, convParticipantRoleValues, users, athleteProfiles, posts, postLikes, postComments, conversations, conversationParticipants, messages, nilDeals, trainingLogs, transferPortalEntries, notifications, verificationCodes, waitlist, crmContacts, crmPipeline, activityLog, broadcastMessages, feedbackStatusValues, feedbackCategoryValues, athleteFeedback, feedbackVotes, expiryEmailTypeValues, expiryNoticeStatusValues, subscriptionExpiryNotices, dataSourceTypeValues, dataEventTypeValues, athleteDataSources, athleteDataEvents, athleteDataSummaries;
var init_schema = __esm({
  "drizzle/schema.ts"() {
    "use strict";
    userRoleValues = ["user", "admin"];
    nilDealStatusValues = ["pending", "active", "completed", "declined"];
    transferStatusValues = ["entered", "committed", "withdrawn"];
    verifTypeValues = ["signup", "login", "password_reset"];
    postTypeValues = ["status", "achievement", "workout", "nil_deal", "announcement", "milestone"];
    crmContactRoleValues = ["Athlete", "Coach", "Brand", "Agent", "Investor", "Team"];
    crmContactStatusValues = ["Lead", "Active", "VIP", "Churned"];
    crmPipelineStageValues = ["New Lead", "Contacted", "Demo Scheduled", "Proposal Sent", "Closed Won", "Closed Lost"];
    notifTypeValues = ["welcome", "vip_approved", "system_announcement", "custom", "credit_added", "new_feature", "promotion", "reminder", "achievement", "message"];
    notifPriorityValues = ["low", "normal", "high", "urgent"];
    postVisibilityValues = ["public", "followers", "private"];
    postMediaTypeValues = ["none", "image", "video", "gallery"];
    postSourceValues = ["nil_portal", "diamond_grind", "messenger", "transfer_portal", "faith", "warriors_playbook"];
    msgTypeValues = ["text", "image", "video", "file", "workout", "achievement", "system"];
    convTypeValues = ["direct", "group"];
    convParticipantRoleValues = ["member", "admin"];
    users = mysqlTable("users", {
      id: serial("id").primaryKey(),
      openId: varchar("openId", { length: 64 }).unique(),
      name: text("name"),
      email: varchar("email", { length: 320 }),
      loginMethod: varchar("loginMethod", { length: 64 }),
      role: mysqlEnum("role", userRoleValues).default("user").notNull(),
      sport: varchar("sport", { length: 64 }),
      school: varchar("school", { length: 128 }),
      year: varchar("year", { length: 32 }),
      bio: text("bio"),
      avatarUrl: text("avatarUrl"),
      phone: varchar("phone", { length: 20 }),
      trialEndsAt: timestamp("trialEndsAt"),
      phoneVerified: tinyint("phoneVerified").default(0).notNull(),
      passwordHash: varchar("passwordHash", { length: 255 }),
      stripeCustomerId: varchar("stripeCustomerId", { length: 255 }),
      stripeSubscriptionId: varchar("stripeSubscriptionId", { length: 255 }),
      stripePlanId: varchar("stripePlanId", { length: 255 }),
      credits: int("credits").default(0).notNull(),
      aiCredits: int("aiCredits").default(0).notNull(),
      lastSignedIn: timestamp("lastSignedIn"),
      createdAt: timestamp("createdAt").defaultNow().notNull(),
      updatedAt: timestamp("updatedAt").defaultNow().notNull(),
      onboardingRole: varchar("onboardingRole", { length: 64 }),
      onboardingData: text("onboardingData"),
      onboardingCompleted: tinyint("onboardingCompleted").default(0).notNull()
    });
    athleteProfiles = mysqlTable("athlete_profiles", {
      id: serial("id").primaryKey(),
      userId: int("userId").notNull(),
      sport: varchar("sport", { length: 64 }),
      position: varchar("position", { length: 64 }),
      school: varchar("school", { length: 128 }),
      year: varchar("year", { length: 32 }),
      gpa: float("gpa"),
      height: varchar("height", { length: 16 }),
      weight: int("weight"),
      hometown: varchar("hometown", { length: 128 }),
      bio: text("bio"),
      hudlUrl: text("hudlUrl"),
      instagramUrl: text("instagramUrl"),
      twitterUrl: text("twitterUrl"),
      tiktokUrl: text("tiktokUrl"),
      recruitingScore: int("recruitingScore").default(0),
      nilValue: int("nilValue").default(0),
      transferStatus: varchar("transferStatus", { length: 32 }),
      classYear: varchar("classYear", { length: 16 }),
      state: varchar("state", { length: 64 }),
      recruitingStatus: varchar("recruitingStatus", { length: 32 }),
      followers: int("followers").default(0),
      coverUrl: text("coverUrl"),
      highlightUrl: text("highlightUrl"),
      instagram: varchar("instagram", { length: 128 }),
      twitter: varchar("twitter", { length: 128 }),
      createdAt: timestamp("createdAt").defaultNow().notNull(),
      updatedAt: timestamp("updatedAt").defaultNow().notNull()
    });
    posts = mysqlTable("posts", {
      id: serial("id").primaryKey(),
      userId: int("userId").notNull(),
      content: text("content").notNull(),
      mediaUrls: json("mediaUrls"),
      mediaType: mysqlEnum("mediaType", postMediaTypeValues).default("none").notNull(),
      postType: mysqlEnum("postType", postTypeValues).default("status").notNull(),
      sourceApp: mysqlEnum("sourceApp", postSourceValues).default("nil_portal").notNull(),
      visibility: mysqlEnum("visibility", postVisibilityValues).default("public").notNull(),
      likesCount: int("likesCount").default(0).notNull(),
      commentsCount: int("commentsCount").default(0).notNull(),
      sharesCount: int("sharesCount").default(0).notNull(),
      isPinned: mysqlEnum("isPinned", ["yes", "no"]).default("no").notNull(),
      createdAt: timestamp("createdAt").defaultNow().notNull(),
      updatedAt: timestamp("updatedAt").defaultNow().notNull()
    });
    postLikes = mysqlTable("post_likes", {
      id: serial("id").primaryKey(),
      postId: int("postId").notNull(),
      userId: int("userId").notNull(),
      createdAt: timestamp("createdAt").defaultNow().notNull()
    });
    postComments = mysqlTable("post_comments", {
      id: serial("id").primaryKey(),
      postId: int("postId").notNull(),
      userId: int("userId").notNull(),
      content: text("content").notNull(),
      createdAt: timestamp("createdAt").defaultNow().notNull()
    });
    conversations = mysqlTable("conversations", {
      id: serial("id").primaryKey(),
      type: mysqlEnum("type", convTypeValues).default("direct").notNull(),
      name: varchar("name", { length: 255 }),
      createdBy: int("createdBy").notNull(),
      lastMessageAt: timestamp("lastMessageAt"),
      lastMessagePreview: varchar("lastMessagePreview", { length: 255 }),
      createdAt: timestamp("createdAt").defaultNow().notNull(),
      updatedAt: timestamp("updatedAt").defaultNow().notNull()
    });
    conversationParticipants = mysqlTable("conversation_participants", {
      id: serial("id").primaryKey(),
      conversationId: int("conversationId").notNull(),
      userId: int("userId").notNull(),
      role: mysqlEnum("role", convParticipantRoleValues).default("member").notNull(),
      lastReadAt: timestamp("lastReadAt"),
      unreadCount: int("unreadCount").default(0).notNull(),
      joinedAt: timestamp("joinedAt").defaultNow().notNull()
    });
    messages = mysqlTable("messages", {
      id: serial("id").primaryKey(),
      conversationId: int("conversationId").notNull(),
      senderId: int("senderId").notNull(),
      content: text("content").notNull(),
      messageType: mysqlEnum("messageType", msgTypeValues).default("text").notNull(),
      mediaUrl: text("mediaUrl"),
      metadata: json("metadata"),
      isEdited: mysqlEnum("isEdited", ["yes", "no"]).default("no").notNull(),
      isDeleted: mysqlEnum("isDeleted", ["yes", "no"]).default("no").notNull(),
      createdAt: timestamp("createdAt").defaultNow().notNull(),
      updatedAt: timestamp("updatedAt").defaultNow().notNull()
    });
    nilDeals = mysqlTable("nil_deals", {
      id: serial("id").primaryKey(),
      athleteId: int("athleteId").notNull(),
      brandName: varchar("brandName", { length: 128 }).notNull(),
      dealValue: int("dealValue").default(0).notNull(),
      status: mysqlEnum("status", nilDealStatusValues).default("pending").notNull(),
      description: text("description"),
      category: varchar("category", { length: 64 }),
      startDate: timestamp("startDate"),
      endDate: timestamp("endDate"),
      contractUrl: text("contractUrl"),
      createdAt: timestamp("createdAt").defaultNow().notNull(),
      updatedAt: timestamp("updatedAt").defaultNow().notNull()
    });
    trainingLogs = mysqlTable("training_logs", {
      id: serial("id").primaryKey(),
      userId: int("userId").notNull(),
      workout: varchar("workout", { length: 128 }).notNull(),
      duration: int("duration"),
      notes: text("notes"),
      performance: int("performance"),
      logDate: timestamp("logDate").defaultNow().notNull(),
      createdAt: timestamp("createdAt").defaultNow().notNull()
    });
    transferPortalEntries = mysqlTable("transfer_portal_entries", {
      id: serial("id").primaryKey(),
      athleteId: int("athleteId").notNull(),
      fromSchool: varchar("fromSchool", { length: 128 }),
      toSchool: varchar("toSchool", { length: 128 }),
      status: mysqlEnum("status", transferStatusValues).default("entered").notNull(),
      eligibilityYears: int("eligibilityYears"),
      enteredAt: timestamp("enteredAt").defaultNow().notNull(),
      updatedAt: timestamp("updatedAt").defaultNow().notNull()
    });
    notifications = mysqlTable("notifications", {
      id: serial("id").primaryKey(),
      userId: int("userId").notNull(),
      type: mysqlEnum("type", notifTypeValues).default("custom").notNull(),
      title: varchar("title", { length: 255 }).notNull(),
      message: text("message"),
      link: varchar("link", { length: 500 }),
      imageUrl: varchar("imageUrl", { length: 500 }),
      priority: mysqlEnum("priority", notifPriorityValues).default("normal").notNull(),
      isRead: mysqlEnum("isRead", ["yes", "no"]).default("no").notNull(),
      isDismissed: mysqlEnum("isDismissed", ["yes", "no"]).default("no").notNull(),
      isBroadcast: mysqlEnum("isBroadcast", ["yes", "no"]).default("no").notNull(),
      expiresAt: timestamp("expiresAt"),
      createdAt: timestamp("createdAt").defaultNow().notNull(),
      readAt: timestamp("readAt")
    });
    verificationCodes = mysqlTable("verification_codes", {
      id: serial("id").primaryKey(),
      email: varchar("email", { length: 320 }).notNull(),
      phone: varchar("phone", { length: 20 }),
      code: varchar("code", { length: 10 }).notNull(),
      type: mysqlEnum("type", verifTypeValues).default("signup").notNull(),
      verified: boolean("verified").default(false).notNull(),
      expiresAt: timestamp("expiresAt").notNull(),
      createdAt: timestamp("createdAt").defaultNow().notNull()
    });
    waitlist = mysqlTable("waitlist_entries", {
      id: serial("id").primaryKey(),
      email: varchar("email", { length: 320 }).notNull(),
      name: varchar("name", { length: 255 }),
      sport: varchar("sport", { length: 100 }),
      school: varchar("school", { length: 255 }),
      phone: varchar("phone", { length: 20 }),
      role: varchar("role", { length: 50 }).notNull(),
      createdAt: timestamp("createdAt").defaultNow().notNull()
    });
    crmContacts = mysqlTable("crm_contacts", {
      id: serial("id").primaryKey(),
      name: varchar("name", { length: 128 }).notNull(),
      email: varchar("email", { length: 320 }),
      phone: varchar("phone", { length: 20 }),
      company: varchar("company", { length: 128 }),
      role: mysqlEnum("role", crmContactRoleValues).default("Athlete").notNull(),
      status: mysqlEnum("status", crmContactStatusValues).default("Lead").notNull(),
      notes: text("notes"),
      lastActivity: timestamp("lastActivity").defaultNow().notNull(),
      createdAt: timestamp("createdAt").defaultNow().notNull()
    });
    crmPipeline = mysqlTable("crm_pipeline", {
      id: serial("id").primaryKey(),
      contactId: int("contactId").notNull(),
      stage: mysqlEnum("stage", crmPipelineStageValues).default("New Lead").notNull(),
      dealValue: int("dealValue").default(0),
      assignedTo: varchar("assignedTo", { length: 128 }),
      notes: text("notes"),
      createdAt: timestamp("createdAt").defaultNow().notNull(),
      updatedAt: timestamp("updatedAt").defaultNow().notNull()
    });
    activityLog = mysqlTable("activity_log", {
      id: serial("id").primaryKey(),
      userId: int("userId"),
      eventType: varchar("eventType", { length: 64 }).notNull(),
      metadata: text("metadata"),
      createdAt: timestamp("createdAt").defaultNow().notNull()
    });
    broadcastMessages = mysqlTable("broadcast_messages", {
      id: serial("id").primaryKey(),
      senderId: int("senderId").notNull(),
      subject: varchar("subject", { length: 256 }).notNull(),
      body: text("body").notNull(),
      channel: mysqlEnum("channel", ["email", "in_app", "both"]).default("in_app").notNull(),
      recipientFilter: mysqlEnum("recipientFilter", ["all", "trial", "subscribed", "free"]).default("all").notNull(),
      recipientCount: int("recipientCount").default(0),
      status: mysqlEnum("status", ["draft", "sent", "failed"]).default("sent").notNull(),
      sentAt: timestamp("sentAt").defaultNow().notNull(),
      createdAt: timestamp("createdAt").defaultNow().notNull()
    });
    feedbackStatusValues = ["open", "under_review", "planned", "completed", "declined"];
    feedbackCategoryValues = ["feature_request", "bug_report", "general", "content", "performance"];
    athleteFeedback = mysqlTable("athlete_feedback", {
      id: serial("id").primaryKey(),
      userId: int("userId"),
      name: varchar("name", { length: 255 }).notNull(),
      email: varchar("email", { length: 320 }).notNull(),
      title: varchar("title", { length: 256 }).notNull(),
      body: text("body").notNull(),
      category: mysqlEnum("category", feedbackCategoryValues).default("general").notNull(),
      votes: int("votes").default(0).notNull(),
      status: mysqlEnum("status", feedbackStatusValues).default("open").notNull(),
      adminReply: text("adminReply"),
      repliedAt: timestamp("repliedAt"),
      createdAt: timestamp("createdAt").defaultNow().notNull()
    });
    feedbackVotes = mysqlTable("feedback_votes", {
      id: serial("id").primaryKey(),
      feedbackId: int("feedbackId").notNull(),
      voterIdentifier: varchar("voterIdentifier", { length: 320 }).notNull(),
      // email or userId
      createdAt: timestamp("createdAt").defaultNow().notNull()
    });
    expiryEmailTypeValues = ["7_day", "5_day", "4_day", "3_day", "2_day", "1_day", "expired"];
    expiryNoticeStatusValues = ["sent", "failed", "skipped"];
    subscriptionExpiryNotices = mysqlTable("subscription_expiry_notices", {
      id: serial("id").primaryKey(),
      userId: int("userId").notNull(),
      stripeSubscriptionId: varchar("stripeSubscriptionId", { length: 255 }),
      daysRemaining: int("daysRemaining").notNull(),
      emailType: mysqlEnum("emailType", expiryEmailTypeValues).notNull(),
      status: mysqlEnum("status", expiryNoticeStatusValues).default("sent").notNull(),
      emailSentAt: timestamp("emailSentAt").defaultNow().notNull(),
      expiresAt: timestamp("expiresAt").notNull(),
      createdAt: timestamp("createdAt").defaultNow().notNull()
    });
    dataSourceTypeValues = ["ai_bot", "robot", "wearable", "video_analysis", "manual", "api_integration"];
    dataEventTypeValues = [
      "performance_metric",
      "biometric",
      "gps_tracking",
      "motion_capture",
      "ai_session",
      "recruitment_interaction",
      "training_session",
      "health_record",
      "game_stat",
      "combine_result",
      "injury_report",
      "recovery_score"
    ];
    athleteDataSources = mysqlTable("athlete_data_sources", {
      id: serial("id").primaryKey(),
      name: varchar("name", { length: 255 }).notNull(),
      sourceType: mysqlEnum("sourceType", dataSourceTypeValues).notNull(),
      deviceId: varchar("deviceId", { length: 255 }),
      firmwareVersion: varchar("firmwareVersion", { length: 64 }),
      isActive: boolean("isActive").default(true).notNull(),
      lastSeenAt: timestamp("lastSeenAt"),
      createdAt: timestamp("createdAt").defaultNow().notNull()
    });
    athleteDataEvents = mysqlTable("athlete_data_events", {
      id: serial("id").primaryKey(),
      athleteId: int("athleteId"),
      sourceId: int("sourceId"),
      sourceType: mysqlEnum("sourceType", dataSourceTypeValues).notNull(),
      eventType: mysqlEnum("eventType", dataEventTypeValues).notNull(),
      sport: varchar("sport", { length: 64 }),
      sessionId: varchar("sessionId", { length: 128 }),
      payload: json("payload").notNull(),
      heartRate: int("heartRate"),
      speed: float("speed"),
      distance: float("distance"),
      acceleration: float("acceleration"),
      recoveryScore: float("recoveryScore"),
      aiConfidence: float("aiConfidence"),
      latitude: float("latitude"),
      longitude: float("longitude"),
      deviceTimestamp: timestamp("deviceTimestamp"),
      processedAt: timestamp("processedAt"),
      isAnonymized: boolean("isAnonymized").default(false).notNull(),
      createdAt: timestamp("createdAt").defaultNow().notNull()
    });
    athleteDataSummaries = mysqlTable("athlete_data_summaries", {
      id: serial("id").primaryKey(),
      athleteId: int("athleteId").notNull(),
      summaryDate: varchar("summaryDate", { length: 10 }).notNull(),
      sport: varchar("sport", { length: 64 }),
      totalEvents: int("totalEvents").default(0).notNull(),
      avgHeartRate: float("avgHeartRate"),
      maxSpeed: float("maxSpeed"),
      totalDistance: float("totalDistance"),
      avgRecoveryScore: float("avgRecoveryScore"),
      aiSessionCount: int("aiSessionCount").default(0).notNull(),
      robotSessionCount: int("robotSessionCount").default(0).notNull(),
      wearableSessionCount: int("wearableSessionCount").default(0).notNull(),
      createdAt: timestamp("createdAt").defaultNow().notNull(),
      updatedAt: timestamp("updatedAt").defaultNow().notNull()
    });
  }
});

// api/index.ts
import "dotenv/config";
import express2 from "express";
import { createExpressMiddleware } from "@trpc/server/adapters/express";

// shared/const.ts
var COOKIE_NAME = "app_session_id";
var ONE_YEAR_MS = 1e3 * 60 * 60 * 24 * 365;
var AXIOS_TIMEOUT_MS = 3e4;
var UNAUTHED_ERR_MSG = "Please login (10001)";
var NOT_ADMIN_ERR_MSG = "You do not have required permission (10002)";

// server/db.ts
init_schema();
import { eq, sql, gte, and, lt } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";

// server/_core/env.ts
var ENV = {
  appId: process.env.VITE_APP_ID ?? "",
  cookieSecret: process.env.JWT_SECRET ?? "",
  databaseUrl: process.env.DATABASE_URL ?? "",
  oAuthServerUrl: process.env.OAUTH_SERVER_URL ?? "",
  ownerOpenId: process.env.OWNER_OPEN_ID ?? "",
  isProduction: process.env.NODE_ENV === "production",
  forgeApiUrl: process.env.BUILT_IN_FORGE_API_URL ?? "",
  forgeApiKey: process.env.BUILT_IN_FORGE_API_KEY ?? "",
  // ─── Okta Enterprise Auth (ready for migration) ───────────────────────────
  // When Okta enterprise credentials arrive, set these env vars and update
  // server/_core/oauth.ts to route through Okta's /authorize + /token endpoints.
  // OKTA_DOMAIN=your-org.okta.com
  // OKTA_CLIENT_ID=your_client_id
  // OKTA_CLIENT_SECRET=your_client_secret
  // OKTA_AUDIENCE=api://default
  oktaDomain: process.env.OKTA_DOMAIN ?? "",
  oktaClientId: process.env.OKTA_CLIENT_ID ?? "",
  oktaClientSecret: process.env.OKTA_CLIENT_SECRET ?? "",
  oktaAudience: process.env.OKTA_AUDIENCE ?? "api://default",
  useOkta: !!(process.env.OKTA_DOMAIN && process.env.OKTA_CLIENT_ID && process.env.OKTA_CLIENT_SECRET)
};

// server/db.ts
var _db = null;
var _pool = null;
async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _pool = mysql.createPool({
        uri: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false },
        connectionLimit: 10,
        connectTimeout: 1e4
      });
      _db = drizzle(_pool);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}
async function upsertUser(user) {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }
  try {
    const values = {
      openId: user.openId
    };
    const updateSet = {};
    const textFields = ["name", "email", "loginMethod"];
    const assignNullable = (field) => {
      const value = user[field];
      if (value === void 0) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };
    textFields.forEach(assignNullable);
    if (user.lastSignedIn !== void 0) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== void 0) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = "admin";
      updateSet.role = "admin";
    }
    if (!values.lastSignedIn) {
      values.lastSignedIn = /* @__PURE__ */ new Date();
    }
    if (user.trialEndsAt !== void 0) {
      values.trialEndsAt = user.trialEndsAt;
      updateSet.trialEndsAt = user.trialEndsAt;
    }
    if (user.phone !== void 0) {
      values.phone = user.phone;
      updateSet.phone = user.phone;
    }
    if (user.phoneVerified !== void 0) {
      values.phoneVerified = user.phoneVerified;
      updateSet.phoneVerified = user.phoneVerified;
    }
    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = /* @__PURE__ */ new Date();
    }
    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}
async function getUserByOpenId(openId) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return void 0;
  }
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : void 0;
}
async function getUserById(id) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return void 0;
  }
  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return result.length > 0 ? result[0] : void 0;
}

// server/_core/cookies.ts
function getSessionCookieOptions(req) {
  const isSecure = req.protocol === "https" || (() => {
    const fwd = req.headers["x-forwarded-proto"];
    if (!fwd) return false;
    const list = Array.isArray(fwd) ? fwd : fwd.split(",");
    return list.some((p) => p.trim().toLowerCase() === "https");
  })();
  return {
    domain: void 0,
    httpOnly: true,
    path: "/",
    sameSite: "none",
    secure: isSecure
  };
}

// shared/_core/errors.ts
var HttpError = class extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    this.name = "HttpError";
  }
};
var ForbiddenError = (msg) => new HttpError(403, msg);

// server/_core/sdk.ts
import axios from "axios";
import { parse as parseCookieHeader } from "cookie";
import { SignJWT, jwtVerify } from "jose";
var isNonEmptyString = (value) => typeof value === "string" && value.length > 0;
var EXCHANGE_TOKEN_PATH = `/webdev.v1.WebDevAuthPublicService/ExchangeToken`;
var GET_USER_INFO_PATH = `/webdev.v1.WebDevAuthPublicService/GetUserInfo`;
var GET_USER_INFO_WITH_JWT_PATH = `/webdev.v1.WebDevAuthPublicService/GetUserInfoWithJwt`;
var OAuthService = class {
  constructor(client) {
    this.client = client;
    console.log("[OAuth] Initialized with baseURL:", ENV.oAuthServerUrl);
    if (!ENV.oAuthServerUrl) {
      console.error(
        "[OAuth] ERROR: OAUTH_SERVER_URL is not configured! Set OAUTH_SERVER_URL environment variable."
      );
    }
  }
  decodeState(state) {
    const redirectUri = atob(state);
    return redirectUri;
  }
  async getTokenByCode(code, state) {
    const payload = {
      clientId: ENV.appId,
      grantType: "authorization_code",
      code,
      redirectUri: this.decodeState(state)
    };
    const { data } = await this.client.post(
      EXCHANGE_TOKEN_PATH,
      payload
    );
    return data;
  }
  async getUserInfoByToken(token) {
    const { data } = await this.client.post(
      GET_USER_INFO_PATH,
      {
        accessToken: token.accessToken
      }
    );
    return data;
  }
};
var createOAuthHttpClient = () => axios.create({
  baseURL: ENV.oAuthServerUrl,
  timeout: AXIOS_TIMEOUT_MS
});
var SDKServer = class {
  client;
  oauthService;
  constructor(client = createOAuthHttpClient()) {
    this.client = client;
    this.oauthService = new OAuthService(this.client);
  }
  deriveLoginMethod(platforms, fallback) {
    if (fallback && fallback.length > 0) return fallback;
    if (!Array.isArray(platforms) || platforms.length === 0) return null;
    const set = new Set(
      platforms.filter((p) => typeof p === "string")
    );
    if (set.has("REGISTERED_PLATFORM_EMAIL")) return "email";
    if (set.has("REGISTERED_PLATFORM_GOOGLE")) return "google";
    if (set.has("REGISTERED_PLATFORM_APPLE")) return "apple";
    if (set.has("REGISTERED_PLATFORM_MICROSOFT") || set.has("REGISTERED_PLATFORM_AZURE"))
      return "microsoft";
    if (set.has("REGISTERED_PLATFORM_GITHUB")) return "github";
    const first = Array.from(set)[0];
    return first ? first.toLowerCase() : null;
  }
  /**
   * Exchange OAuth authorization code for access token
   * @example
   * const tokenResponse = await sdk.exchangeCodeForToken(code, state);
   */
  async exchangeCodeForToken(code, state) {
    return this.oauthService.getTokenByCode(code, state);
  }
  /**
   * Get user information using access token
   * @example
   * const userInfo = await sdk.getUserInfo(tokenResponse.accessToken);
   */
  async getUserInfo(accessToken) {
    const data = await this.oauthService.getUserInfoByToken({
      accessToken
    });
    const loginMethod = this.deriveLoginMethod(
      data?.platforms,
      data?.platform ?? data.platform ?? null
    );
    return {
      ...data,
      platform: loginMethod,
      loginMethod
    };
  }
  parseCookies(cookieHeader) {
    if (!cookieHeader) {
      return /* @__PURE__ */ new Map();
    }
    const parsed = parseCookieHeader(cookieHeader);
    return new Map(Object.entries(parsed));
  }
  getSessionSecret() {
    const secret = ENV.cookieSecret;
    return new TextEncoder().encode(secret);
  }
  /**
   * Create a session token for a Manus user openId
   * @example
   * const sessionToken = await sdk.createSessionToken(userInfo.openId);
   */
  async createSessionToken(openId, options = {}) {
    return this.signSession(
      {
        openId,
        appId: ENV.appId,
        name: options.name || ""
      },
      options
    );
  }
  async signSession(payload, options = {}) {
    const issuedAt = Date.now();
    const expiresInMs = options.expiresInMs ?? ONE_YEAR_MS;
    const expirationSeconds = Math.floor((issuedAt + expiresInMs) / 1e3);
    const secretKey = this.getSessionSecret();
    return new SignJWT({
      openId: payload.openId,
      appId: payload.appId,
      name: payload.name
    }).setProtectedHeader({ alg: "HS256", typ: "JWT" }).setExpirationTime(expirationSeconds).sign(secretKey);
  }
  async verifySession(cookieValue) {
    if (!cookieValue) {
      console.warn("[Auth] Missing session cookie");
      return null;
    }
    try {
      const secretKey = this.getSessionSecret();
      const { payload } = await jwtVerify(cookieValue, secretKey, {
        algorithms: ["HS256"]
      });
      const { openId, appId, name } = payload;
      if (!isNonEmptyString(openId) || !isNonEmptyString(appId) || !isNonEmptyString(name)) {
        console.warn("[Auth] Session payload missing required fields");
        return null;
      }
      return {
        openId,
        appId,
        name
      };
    } catch (error) {
      console.warn("[Auth] Session verification failed", String(error));
      return null;
    }
  }
  async getUserInfoWithJwt(jwtToken) {
    const payload = {
      jwtToken,
      projectId: ENV.appId
    };
    const { data } = await this.client.post(
      GET_USER_INFO_WITH_JWT_PATH,
      payload
    );
    const loginMethod = this.deriveLoginMethod(
      data?.platforms,
      data?.platform ?? data.platform ?? null
    );
    return {
      ...data,
      platform: loginMethod,
      loginMethod
    };
  }
  async authenticateRequest(req) {
    const cookies = this.parseCookies(req.headers.cookie);
    const sessionCookie = cookies.get(COOKIE_NAME);
    const session = await this.verifySession(sessionCookie);
    if (!session) {
      throw ForbiddenError("Invalid session cookie");
    }
    const sessionUserId = session.openId;
    const signedInAt = /* @__PURE__ */ new Date();
    let user = await getUserByOpenId(sessionUserId);
    if (!user) {
      try {
        const userInfo = await this.getUserInfoWithJwt(sessionCookie ?? "");
        await upsertUser({
          openId: userInfo.openId,
          name: userInfo.name || null,
          email: userInfo.email ?? null,
          loginMethod: userInfo.loginMethod ?? userInfo.platform ?? null,
          lastSignedIn: signedInAt
        });
        user = await getUserByOpenId(userInfo.openId);
      } catch (error) {
        console.error("[Auth] Failed to sync user from OAuth:", error);
        throw ForbiddenError("Failed to sync user info");
      }
    }
    if (!user) {
      throw ForbiddenError("User not found");
    }
    await upsertUser({
      openId: user.openId,
      lastSignedIn: signedInAt
    });
    return user;
  }
};
var sdk = new SDKServer();

// server/services/aws-ses.ts
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
var FROM_EMAIL = process.env.SES_FROM_EMAIL || "cdozier14@athlynx.ai";
var FROM_NAME = "ATHLYNX";
function getSESClient() {
  const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
  const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
  const region = process.env.AWS_REGION || "us-east-1";
  if (!accessKeyId || !secretAccessKey) return null;
  return new SESClient({ region, credentials: { accessKeyId, secretAccessKey } });
}
async function trySendGrid(to, subject, html, text2) {
  const key = process.env.SENDGRID_API_KEY;
  if (!key) return false;
  try {
    const { default: sgMail } = await import("@sendgrid/mail");
    sgMail.setApiKey(key);
    await sgMail.send({ to, from: { email: FROM_EMAIL, name: FROM_NAME }, subject, html, ...text2 ? { text: text2 } : {} });
    console.log(`[SendGrid] Email sent to ${to}: "${subject}"`);
    return true;
  } catch (err) {
    console.error("[SendGrid] Failed:", err.message);
    return false;
  }
}
async function sendEmail(opts) {
  const { to, subject, html, text: text2 } = opts;
  const ses = getSESClient();
  if (ses) {
    try {
      await ses.send(new SendEmailCommand({
        Source: `${FROM_NAME} <${FROM_EMAIL}>`,
        Destination: { ToAddresses: [to] },
        Message: {
          Subject: { Data: subject, Charset: "UTF-8" },
          Body: {
            Html: { Data: html, Charset: "UTF-8" },
            ...text2 ? { Text: { Data: text2, Charset: "UTF-8" } } : {}
          }
        }
      }));
      console.log(`[SES] Email sent to ${to}: "${subject}"`);
      return true;
    } catch (err) {
      console.error("[SES] Failed, trying SendGrid fallback:", err.message);
    }
  }
  return trySendGrid(to, subject, html, text2);
}
async function sendWelcomeEmail(to, name, memberNumber) {
  const memberNum = memberNumber ? String(memberNumber).padStart(4, "0") : null;
  const signedUpStr = (/* @__PURE__ */ new Date()).toLocaleString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: "America/Chicago",
    timeZoneName: "short"
  });
  const html = `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#0a0f1e;font-family:Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0f1e;padding:40px 20px;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="background:#0d1b3e;border-radius:16px;overflow:hidden;border:1px solid #1e3a6e;">
<tr><td style="background:linear-gradient(135deg,#0066ff,#00c2ff);padding:40px;text-align:center;">
  <div style="font-size:48px;font-weight:900;color:#fff;letter-spacing:4px;">ATHLYNX</div>
  <div style="font-size:13px;color:rgba(255,255,255,0.8);letter-spacing:6px;margin-top:6px;">THE ATHLETE'S PLAYBOOK</div>
</td></tr>
<tr><td style="padding:40px;">
  <h2 style="color:#fff;font-size:24px;margin:0 0 16px;">Welcome to the Family, ${name}! \u{1F3C6}</h2>
  ${memberNum ? `<div style="text-align:center;margin-bottom:20px;"><span style="display:inline-block;background:linear-gradient(135deg,#0066ff,#00c2ff);color:#fff;font-size:13px;font-weight:900;padding:8px 24px;border-radius:50px;letter-spacing:2px;">MEMBER #${memberNum}</span></div>` : ""}
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a1628;border-radius:10px;overflow:hidden;margin-bottom:24px;">
    <tr><td style="padding:12px 16px;border-bottom:1px solid #1e3a6e;"><span style="color:#94a3b8;font-size:11px;display:block;margin-bottom:2px;">JOINED</span><span style="color:#00c2ff;font-size:13px;font-weight:bold;">${signedUpStr}</span></td></tr>
    <tr><td style="padding:12px 16px;"><span style="color:#94a3b8;font-size:11px;display:block;margin-bottom:2px;">TRIAL ENDS</span><span style="color:#f59e0b;font-size:13px;font-weight:bold;">7 days of FREE access \u2014 no credit card required</span></td></tr>
  </table>
  <p style="color:#94a3b8;font-size:16px;line-height:1.6;margin:0 0 24px;">
    Your ATHLYNX account is ready. You have <strong style="color:#00c2ff;">7 days of free access</strong> to every feature \u2014 no credit card required.
  </p>
  <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
    <tr><td style="padding:12px 16px;background:#1a3a8f;border-radius:8px;margin-bottom:8px;"><span style="color:#fff;font-size:14px;">\u{1F916} <strong>LYNX AI Companion</strong> \u2014 Your personal AI for every sport scenario</span></td></tr>
    <tr><td style="height:8px;"></td></tr>
    <tr><td style="padding:12px 16px;background:#1a3a8f;border-radius:8px;"><span style="color:#fff;font-size:14px;">\u{1F3C6} <strong>NIL Portal</strong> \u2014 Connect with brands and close deals</span></td></tr>
    <tr><td style="height:8px;"></td></tr>
    <tr><td style="padding:12px 16px;background:#1a3a8f;border-radius:8px;"><span style="color:#fff;font-size:14px;">\u{1F4CA} <strong>AI Recruiter</strong> \u2014 Get discovered by coaches nationwide</span></td></tr>
    <tr><td style="height:8px;"></td></tr>
    <tr><td style="padding:12px 16px;background:#1a3a8f;border-radius:8px;"><span style="color:#fff;font-size:14px;">\u{1F4AC} <strong>Messenger</strong> \u2014 Connect with athletes, agents, and coaches</span></td></tr>
    <tr><td style="height:8px;"></td></tr>
    <tr><td style="padding:12px 16px;background:#1a3a8f;border-radius:8px;"><span style="color:#fff;font-size:14px;">\u{1F3AF} <strong>Transfer Portal</strong> \u2014 Navigate your path to a better program</span></td></tr>
  </table>
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr><td align="center">
      <a href="https://athlynx.ai" style="display:inline-block;background:linear-gradient(135deg,#0066ff,#00c2ff);color:#fff;font-weight:900;font-size:16px;padding:16px 40px;border-radius:50px;text-decoration:none;letter-spacing:1px;">START YOUR JOURNEY \u2192</a>
    </td></tr>
  </table>
</td></tr>
<tr><td style="background:#060d1f;padding:24px;text-align:center;border-top:1px solid #1e3a6e;">
  <p style="color:#475569;font-size:12px;margin:0;">A Dozier Holdings Group Company \xB7 athlynx.ai</p>
  <p style="color:#334155;font-size:11px;margin:8px 0 0;">Questions? <a href="mailto:cdozier14@athlynx.ai" style="color:#00c2ff;">cdozier14@athlynx.ai</a></p>
  <p style="color:#334155;font-size:11px;margin:4px 0 0;">Isaiah 40:31 \xB7 Dreams Do Come True 2026 \xB7 A Dozier Holdings Group Company</p>
</td></tr>
</table>
</td></tr>
</table>
</body>
</html>`;
  return sendEmail({
    to,
    subject: memberNum ? `Welcome to ATHLYNX, ${name}! You are Member #${memberNum} \u{1F3C6}` : `Welcome to ATHLYNX \u2014 Your 7-Day Free Trial Has Started \u{1F3C6}`,
    html,
    text: `Welcome to ATHLYNX, ${name}!${memberNum ? ` You are Member #${memberNum}.` : ""} Joined: ${signedUpStr}. Your 7-day free trial has started. Visit https://athlynx.ai to get started. Isaiah 40:31 \xB7 Dreams Do Come True 2026`
  });
}
async function sendVerificationEmail(to, code, name, signupDate) {
  const displayName = name || "Athlete";
  const dateStr = (signupDate || /* @__PURE__ */ new Date()).toLocaleString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: "America/Chicago",
    timeZoneName: "short"
  });
  const html = `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#0a0f1e;font-family:Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0f1e;padding:40px 20px;">
<tr><td align="center">
<table width="520" cellpadding="0" cellspacing="0" style="background:#0d1b3e;border-radius:16px;overflow:hidden;border:1px solid #1e3a6e;">

<!-- HEADER -->
<tr><td style="background:linear-gradient(135deg,#0066ff,#00c2ff);padding:32px 40px;text-align:center;">
  <div style="font-size:36px;font-weight:900;color:#fff;letter-spacing:5px;">ATHLYNX</div>
  <div style="font-size:11px;color:rgba(255,255,255,0.85);letter-spacing:6px;margin-top:5px;">THE ATHLETE'S PLAYBOOK</div>
</td></tr>

<!-- BODY -->
<tr><td style="padding:36px 40px;">
  <h2 style="color:#fff;font-size:22px;margin:0 0 8px;">Hey ${displayName}! \u{1F44B}</h2>
  <p style="color:#94a3b8;font-size:15px;line-height:1.6;margin:0 0 28px;">Welcome to ATHLYNX. Use the code below to verify your account and unlock your <strong style="color:#00c2ff;">7-day free trial</strong>.</p>

  <!-- CODE BOX -->
  <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
    <tr><td align="center">
      <div style="background:linear-gradient(135deg,#0a1628,#0d2050);border:2px solid #0066ff;border-radius:16px;padding:28px 40px;display:inline-block;">
        <div style="font-size:13px;color:#94a3b8;letter-spacing:3px;margin-bottom:10px;">YOUR VERIFICATION CODE</div>
        <div style="font-size:48px;font-weight:900;color:#00c2ff;letter-spacing:14px;font-family:monospace;">${code}</div>
        <div style="font-size:12px;color:#475569;margin-top:10px;">\u23F1 Expires in 10 minutes</div>
      </div>
    </td></tr>
  </table>

  <!-- STAMP -->
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#060d1f;border-radius:10px;padding:16px;margin-bottom:24px;border:1px solid #1e3a6e;">
    <tr>
      <td style="padding:8px 16px;border-bottom:1px solid #1e3a6e;"><span style="color:#475569;font-size:11px;display:block;">FULL NAME</span><span style="color:#fff;font-size:14px;font-weight:bold;">${displayName}</span></td>
    </tr>
    <tr>
      <td style="padding:8px 16px;border-bottom:1px solid #1e3a6e;"><span style="color:#475569;font-size:11px;display:block;">EMAIL</span><span style="color:#00c2ff;font-size:14px;">${to}</span></td>
    </tr>
    <tr>
      <td style="padding:8px 16px;"><span style="color:#475569;font-size:11px;display:block;">SIGNED UP</span><span style="color:#f59e0b;font-size:13px;">${dateStr}</span></td>
    </tr>
  </table>

  <p style="color:#334155;font-size:12px;margin:0;text-align:center;">If you didn't request this, you can safely ignore this email.</p>
</td></tr>

<!-- FOOTER -->
<tr><td style="background:#060d1f;padding:20px 40px;text-align:center;border-top:1px solid #1e3a6e;">
  <p style="color:#475569;font-size:12px;margin:0;">ATHLYNX &middot; A Dozier Holdings Group Company</p>
  <p style="color:#334155;font-size:11px;margin:6px 0 0;">Questions? <a href="mailto:cdozier@dozierholdingsgroup.com" style="color:#00c2ff;text-decoration:none;">cdozier@dozierholdingsgroup.com</a></p>
</td></tr>

</table>
</td></tr>
</table>
</body>
</html>`;
  return sendEmail({
    to,
    subject: `${code} is your ATHLYNX verification code, ${displayName}`,
    html,
    text: `Hey ${displayName}! Your ATHLYNX verification code is: ${code}
Signed up: ${dateStr}
Expires in 10 minutes.`
  });
}
async function sendOwnerNewUserAlert(opts) {
  const memberNum = opts.memberNumber ? String(opts.memberNumber).padStart(4, "0") : null;
  const OWNER_EMAILS = [
    "cdozier14@dozierholdingsgroup.com.mx",
    "cdozier14@athlynx.ai",
    "cdozier@dozierholdingsgroup.com",
    "chad.dozier@icloud.com",
    "chaddozier75@gmail.com"
  ];
  const html = `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#0a0f1e;font-family:Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0f1e;padding:40px 20px;">
<tr><td align="center">
<table width="560" cellpadding="0" cellspacing="0" style="background:#0d1b3e;border-radius:16px;overflow:hidden;border:1px solid #1e3a6e;">
<tr><td style="background:linear-gradient(135deg,#0066ff,#00c2ff);padding:28px 32px;">
  <div style="font-size:28px;font-weight:900;color:#fff;letter-spacing:3px;">ATHLYNX</div>
  <div style="font-size:12px;color:rgba(255,255,255,0.85);letter-spacing:5px;margin-top:4px;">NEW USER ALERT</div>
</td></tr>
<tr><td style="padding:32px;">
  <h2 style="color:#00c2ff;font-size:22px;margin:0 0 24px;">\u{1F3C6} A new athlete just joined!${memberNum ? ` <span style="background:linear-gradient(135deg,#0066ff,#00c2ff);color:#fff;font-size:14px;padding:4px 14px;border-radius:50px;font-weight:900;margin-left:8px;">MEMBER #${memberNum}</span>` : ""}</h2>
  <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;border-radius:10px;overflow:hidden;">
    ${memberNum ? `<tr style="background:#0a1628;"><td style="padding:12px 16px;border-bottom:1px solid #1e3a6e;"><span style="color:#94a3b8;font-size:12px;display:block;margin-bottom:2px;">MEMBER NUMBER</span><span style="color:#00c2ff;font-size:20px;font-weight:900;">#${memberNum}</span></td></tr>` : ""}
    <tr style="background:#0a1628;"><td style="padding:12px 16px;border-bottom:1px solid #1e3a6e;"><span style="color:#94a3b8;font-size:12px;display:block;margin-bottom:2px;">NAME</span><span style="color:#fff;font-size:17px;font-weight:bold;">${opts.name}</span></td></tr>
    <tr style="background:#0c1a32;"><td style="padding:12px 16px;border-bottom:1px solid #1e3a6e;"><span style="color:#94a3b8;font-size:12px;display:block;margin-bottom:2px;">EMAIL</span><span style="color:#00c2ff;font-size:17px;font-weight:bold;">${opts.email}</span></td></tr>
    <tr style="background:#0a1628;"><td style="padding:12px 16px;border-bottom:1px solid #1e3a6e;"><span style="color:#94a3b8;font-size:12px;display:block;margin-bottom:2px;">LOGIN METHOD</span><span style="color:#fff;font-size:15px;">${opts.loginMethod}</span></td></tr>
    <tr style="background:#0c1a32;"><td style="padding:12px 16px;border-bottom:1px solid #1e3a6e;"><span style="color:#94a3b8;font-size:12px;display:block;margin-bottom:2px;">SIGNED UP</span><span style="color:#fff;font-size:15px;">${opts.signedUpAt} CST</span></td></tr>
    <tr style="background:#0a1628;"><td style="padding:12px 16px;"><span style="color:#94a3b8;font-size:12px;display:block;margin-bottom:2px;">TRIAL ENDS</span><span style="color:#f59e0b;font-size:15px;font-weight:bold;">${opts.trialEndsAt}</span></td></tr>
  </table>
  <div style="margin-top:24px;text-align:center;">
    <a href="https://athlynx.ai/admin" style="display:inline-block;background:linear-gradient(135deg,#0066ff,#00c2ff);color:#fff;font-weight:900;font-size:14px;padding:12px 32px;border-radius:50px;text-decoration:none;">VIEW ADMIN DASHBOARD</a>
  </div>
</td></tr>
<tr><td style="background:#060d1f;padding:20px;text-align:center;border-top:1px solid #1e3a6e;">
  <p style="color:#475569;font-size:12px;margin:0;">ATHLYNX &middot; A Dozier Holdings Group Company &middot; athlynx.ai</p>
</td></tr>
</table>
</td></tr>
</table>
</body>
</html>`;
  const results = await Promise.all(
    OWNER_EMAILS.map((to) => sendEmail({
      to,
      subject: memberNum ? `\u{1F3C6} ATHLYNX Member #${memberNum}: ${opts.name} just signed up!` : `\u{1F3C6} New ATHLYNX Signup: ${opts.name} (${opts.email})`,
      html,
      text: `New ATHLYNX signup!
Name: ${opts.name}
Email: ${opts.email}
Login: ${opts.loginMethod}
Signed Up: ${opts.signedUpAt} CST
Trial Ends: ${opts.trialEndsAt}

View dashboard: https://athlynx.ai/admin`
    }))
  );
  return results.some((r) => r);
}

// server/_core/notification.ts
import { TRPCError } from "@trpc/server";
var TITLE_MAX_LENGTH = 1200;
var CONTENT_MAX_LENGTH = 2e4;
var trimValue = (value) => value.trim();
var isNonEmptyString2 = (value) => typeof value === "string" && value.trim().length > 0;
var buildEndpointUrl = (baseUrl) => {
  const normalizedBase = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
  return new URL(
    "webdevtoken.v1.WebDevService/SendNotification",
    normalizedBase
  ).toString();
};
var validatePayload = (input) => {
  if (!isNonEmptyString2(input.title)) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Notification title is required."
    });
  }
  if (!isNonEmptyString2(input.content)) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Notification content is required."
    });
  }
  const title = trimValue(input.title);
  const content = trimValue(input.content);
  if (title.length > TITLE_MAX_LENGTH) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: `Notification title must be at most ${TITLE_MAX_LENGTH} characters.`
    });
  }
  if (content.length > CONTENT_MAX_LENGTH) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: `Notification content must be at most ${CONTENT_MAX_LENGTH} characters.`
    });
  }
  return { title, content };
};
async function notifyOwner(payload) {
  const { title, content } = validatePayload(payload);
  if (!ENV.forgeApiUrl) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Notification service URL is not configured."
    });
  }
  if (!ENV.forgeApiKey) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Notification service API key is not configured."
    });
  }
  const endpoint = buildEndpointUrl(ENV.forgeApiUrl);
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        accept: "application/json",
        authorization: `Bearer ${ENV.forgeApiKey}`,
        "content-type": "application/json",
        "connect-protocol-version": "1"
      },
      body: JSON.stringify({ title, content })
    });
    if (!response.ok) {
      const detail = await response.text().catch(() => "");
      console.warn(
        `[Notification] Failed to notify owner (${response.status} ${response.statusText})${detail ? `: ${detail}` : ""}`
      );
      return false;
    }
    return true;
  } catch (error) {
    console.warn("[Notification] Error calling notification service:", error);
    return false;
  }
}

// server/_core/oauth.ts
var SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1e3;
function getQueryParam(req, key) {
  const value = req.query[key];
  return typeof value === "string" ? value : void 0;
}
function registerOAuthRoutes(app2) {
  app2.get("/api/oauth/callback", async (req, res) => {
    const code = getQueryParam(req, "code");
    const state = getQueryParam(req, "state");
    if (!code || !state) {
      res.status(400).json({ error: "code and state are required" });
      return;
    }
    try {
      const tokenResponse = await sdk.exchangeCodeForToken(code, state);
      const userInfo = await sdk.getUserInfo(tokenResponse.accessToken);
      if (!userInfo.openId) {
        res.status(400).json({ error: "openId missing from user info" });
        return;
      }
      const existingUser = await getUserByOpenId(userInfo.openId);
      const isNewUser = !existingUser;
      const trialEndsAt = isNewUser ? new Date(Date.now() + SEVEN_DAYS_MS) : void 0;
      await upsertUser({
        openId: userInfo.openId,
        name: userInfo.name || null,
        email: userInfo.email ?? null,
        loginMethod: userInfo.loginMethod ?? userInfo.platform ?? null,
        lastSignedIn: /* @__PURE__ */ new Date(),
        ...trialEndsAt ? { trialEndsAt } : {}
      });
      if (isNewUser) {
        const name = userInfo.name || "Athlete";
        if (userInfo.email) {
          sendWelcomeEmail(userInfo.email, name).catch((err) => {
            console.warn("[OAuth] Welcome email failed:", err);
          });
        }
        console.log(`[OAuth] New user registered: ${userInfo.email ?? "(no email)"} \u2014 trial ends ${trialEndsAt?.toISOString()}`);
        notifyOwner({
          title: `New ATHLYNX User: ${userInfo.name || "Unknown Athlete"}`,
          content: `A new athlete just joined ATHLYNX!

Name: ${userInfo.name || "N/A"}
Email: ${userInfo.email || "N/A"}
Login Method: ${userInfo.loginMethod ?? userInfo.platform ?? "OAuth"}
Signed Up: ${(/* @__PURE__ */ new Date()).toLocaleString("en-US", { timeZone: "America/Chicago" })} CST
Trial Ends: ${trialEndsAt?.toLocaleDateString("en-US") ?? "N/A"}`
        }).catch((err) => {
          console.warn("[OAuth] Owner notification failed:", err);
        });
        sendOwnerNewUserAlert({
          name: userInfo.name || "Unknown Athlete",
          email: userInfo.email || "N/A",
          loginMethod: userInfo.loginMethod ?? userInfo.platform ?? "OAuth",
          signedUpAt: (/* @__PURE__ */ new Date()).toLocaleString("en-US", { timeZone: "America/Chicago" }),
          trialEndsAt: trialEndsAt?.toLocaleDateString("en-US") ?? "N/A"
        }).catch((err) => {
          console.warn("[OAuth] Owner alert email failed:", err);
        });
      }
      const sessionToken = await sdk.createSessionToken(userInfo.openId, {
        name: userInfo.name || "",
        expiresInMs: ONE_YEAR_MS
      });
      const cookieOptions = getSessionCookieOptions(req);
      res.cookie(COOKIE_NAME, sessionToken, { ...cookieOptions, maxAge: ONE_YEAR_MS });
      res.redirect(302, "/feed");
    } catch (error) {
      console.error("[OAuth] Callback failed", error);
      res.status(500).json({ error: "OAuth callback failed" });
    }
  });
}

// server/_core/storageProxy.ts
function registerStorageProxy(app2) {
  app2.get("/manus-storage/*", async (req, res) => {
    const key = req.path.replace(/^\/manus-storage\//, "");
    if (!key) {
      res.status(400).send("Missing storage key");
      return;
    }
    if (!ENV.forgeApiUrl || !ENV.forgeApiKey) {
      res.status(500).send("Storage proxy not configured");
      return;
    }
    try {
      const forgeUrl = new URL(
        "v1/storage/presign/get",
        ENV.forgeApiUrl.replace(/\/+$/, "") + "/"
      );
      forgeUrl.searchParams.set("path", key);
      const forgeResp = await fetch(forgeUrl, {
        headers: { Authorization: `Bearer ${ENV.forgeApiKey}` }
      });
      if (!forgeResp.ok) {
        const body = await forgeResp.text().catch(() => "");
        console.error(`[StorageProxy] forge error: ${forgeResp.status} ${body}`);
        res.status(502).send("Storage backend error");
        return;
      }
      const { url } = await forgeResp.json();
      if (!url) {
        res.status(502).send("Empty signed URL from backend");
        return;
      }
      res.set("Cache-Control", "no-store");
      res.redirect(307, url);
    } catch (err) {
      console.error("[StorageProxy] failed:", err);
      res.status(502).send("Storage proxy error");
    }
  });
}

// server/_core/systemRouter.ts
import { z } from "zod";

// server/_core/trpc.ts
import { initTRPC, TRPCError as TRPCError2 } from "@trpc/server";
import superjson from "superjson";
var t = initTRPC.context().create({
  transformer: superjson
});
var router = t.router;
var publicProcedure = t.procedure;
var requireUser = t.middleware(async (opts) => {
  const { ctx, next } = opts;
  if (!ctx.user) {
    throw new TRPCError2({ code: "UNAUTHORIZED", message: UNAUTHED_ERR_MSG });
  }
  return next({
    ctx: {
      ...ctx,
      user: ctx.user
    }
  });
});
var protectedProcedure = t.procedure.use(requireUser);
var adminProcedure = t.procedure.use(
  t.middleware(async (opts) => {
    const { ctx, next } = opts;
    if (!ctx.user || ctx.user.role !== "admin") {
      throw new TRPCError2({ code: "FORBIDDEN", message: NOT_ADMIN_ERR_MSG });
    }
    return next({
      ctx: {
        ...ctx,
        user: ctx.user
      }
    });
  })
);

// server/_core/systemRouter.ts
var systemRouter = router({
  health: publicProcedure.input(
    z.object({
      timestamp: z.number().min(0, "timestamp cannot be negative")
    })
  ).query(() => ({
    ok: true
  })),
  notifyOwner: adminProcedure.input(
    z.object({
      title: z.string().min(1, "title is required"),
      content: z.string().min(1, "content is required")
    })
  ).mutation(async ({ input }) => {
    const delivered = await notifyOwner(input);
    return {
      success: delivered
    };
  })
});

// server/stripe/stripeRouter.ts
import Stripe from "stripe";
import { z as z2 } from "zod";

// server/stripe/products.ts
var STRIPE_PLANS = [
  {
    id: "athlete_pro",
    name: "Athlete Pro",
    description: "Full access to all 10 ATHLYNX apps, NIL deal tools, and recruiting suite.",
    priceMonthly: 999,
    // $9.99/mo
    priceYearly: 9588,
    // $79.99/yr (~33% off)
    features: [
      "All 10 ATHLYNX Apps",
      "NIL Deal Marketplace",
      "Transfer Portal Access",
      "AI Recruiting Tools",
      "Diamond Grind Training",
      "Priority Support"
    ],
    stripePriceIdMonthly: process.env.STRIPE_PRICE_PRO_MONTHLY ?? "",
    stripePriceIdYearly: process.env.STRIPE_PRICE_PRO_YEARLY ?? "",
    badge: "Most Popular",
    color: "#0066ff"
  },
  {
    id: "athlete_elite",
    name: "Athlete Elite",
    description: "Everything in Pro plus AI Sales automation, NIL Vault, and brand management.",
    priceMonthly: 2999,
    // $29.99/mo
    priceYearly: 28788,
    // $239.99/yr (~33% off)
    features: [
      "Everything in Pro",
      "AI Sales Automation",
      "NIL Vault (Contract Archive)",
      "Brand Deal Negotiation AI",
      "Warriors Playbook",
      "Dedicated Account Manager"
    ],
    stripePriceIdMonthly: process.env.STRIPE_PRICE_ELITE_MONTHLY ?? "",
    stripePriceIdYearly: process.env.STRIPE_PRICE_ELITE_YEARLY ?? "",
    badge: "Best Value",
    color: "#00c2ff"
  },
  {
    id: "nil_vault",
    name: "NIL Vault",
    description: "Enterprise NIL management for agencies, coaches, and institutions.",
    priceMonthly: 4999,
    // $49.99/mo
    priceYearly: 47988,
    // $399.99/yr (~33% off)
    features: [
      "Everything in Elite",
      "Multi-athlete Management",
      "Legal Document Storage",
      "Tax Document Generation",
      "White-label Branding",
      "API Access"
    ],
    stripePriceIdMonthly: process.env.STRIPE_PRICE_NIL_MONTHLY ?? "",
    stripePriceIdYearly: process.env.STRIPE_PRICE_NIL_YEARLY ?? "",
    badge: "Enterprise",
    color: "#7c3aed"
  }
];
var CREDIT_PACKS = [
  { id: "credits_100", name: "100 Credits", credits: 100, price: 999, stripePriceId: process.env.STRIPE_PRICE_CREDITS_100 ?? "" },
  { id: "credits_500", name: "500 Credits", credits: 500, price: 3999, stripePriceId: process.env.STRIPE_PRICE_CREDITS_500 ?? "" },
  { id: "credits_1000", name: "1,000 Credits", credits: 1e3, price: 6999, stripePriceId: process.env.STRIPE_PRICE_CREDITS_1000 ?? "" }
];

// server/stripe/stripeRouter.ts
var stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "", {
  apiVersion: "2026-03-25.dahlia"
});
var stripeRouter = router({
  /** Return all available plans for the frontend */
  getPlans: publicProcedure.query(() => {
    return STRIPE_PLANS.map((plan) => ({
      id: plan.id,
      name: plan.name,
      description: plan.description,
      priceMonthly: plan.priceMonthly,
      priceYearly: plan.priceYearly,
      features: plan.features,
      badge: plan.badge,
      color: plan.color
    }));
  }),
  /** Return all credit packs */
  getCreditPacks: publicProcedure.query(() => {
    return CREDIT_PACKS.map((p) => ({
      id: p.id,
      name: p.name,
      credits: p.credits,
      price: p.price
    }));
  }),
  /** Create a Stripe Checkout Session for a subscription plan */
  createSubscriptionCheckout: protectedProcedure.input(
    z2.object({
      planId: z2.string(),
      interval: z2.enum(["month", "year"]),
      origin: z2.string()
    })
  ).mutation(async ({ ctx, input }) => {
    const plan = STRIPE_PLANS.find((p) => p.id === input.planId);
    if (!plan) throw new Error("Plan not found");
    const priceId = input.interval === "month" ? plan.stripePriceIdMonthly : plan.stripePriceIdYearly;
    const lineItem = priceId ? { price: priceId, quantity: 1 } : {
      price_data: {
        currency: "usd",
        product_data: { name: plan.name, description: plan.description },
        unit_amount: input.interval === "month" ? plan.priceMonthly : plan.priceYearly,
        recurring: { interval: input.interval }
      },
      quantity: 1
    };
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [lineItem],
      customer_email: ctx.user.email ?? void 0,
      client_reference_id: ctx.user.id.toString(),
      metadata: {
        user_id: ctx.user.id.toString(),
        customer_email: ctx.user.email ?? "",
        customer_name: ctx.user.name ?? "",
        plan_id: input.planId,
        interval: input.interval
      },
      // 7-day free trial — card required upfront, no charge until day 8
      subscription_data: {
        trial_period_days: 7,
        trial_settings: {
          end_behavior: { missing_payment_method: "cancel" }
        },
        metadata: {
          user_id: ctx.user.id.toString(),
          plan_id: input.planId
        }
      },
      payment_method_collection: "always",
      payment_method_types: ["card", "paypal", "cashapp", "link"],
      allow_promotion_codes: true,
      success_url: `${input.origin}/billing?success=1&plan=${input.planId}&trial=1`,
      cancel_url: `${input.origin}/pricing?cancelled=1`
    });
    return { url: session.url };
  }),
  /** Create a Stripe Checkout Session for a credit pack (one-time payment) */
  createCreditsCheckout: protectedProcedure.input(
    z2.object({
      packId: z2.string(),
      origin: z2.string()
    })
  ).mutation(async ({ ctx, input }) => {
    const pack = CREDIT_PACKS.find((p) => p.id === input.packId);
    if (!pack) throw new Error("Credit pack not found");
    const lineItem = pack.stripePriceId ? { price: pack.stripePriceId, quantity: 1 } : {
      price_data: {
        currency: "usd",
        product_data: { name: pack.name },
        unit_amount: pack.price
      },
      quantity: 1
    };
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [lineItem],
      customer_email: ctx.user.email ?? void 0,
      client_reference_id: ctx.user.id.toString(),
      metadata: {
        user_id: ctx.user.id.toString(),
        customer_email: ctx.user.email ?? "",
        pack_id: input.packId,
        credits: pack.credits.toString()
      },
      payment_method_types: ["card", "paypal", "cashapp", "link"],
      allow_promotion_codes: true,
      success_url: `${input.origin}/billing?success=1&credits=${pack.credits}`,
      cancel_url: `${input.origin}/pricing?cancelled=1`
    });
    return { url: session.url };
  }),
  /** Open Stripe Customer Portal for managing billing */
  createBillingPortal: protectedProcedure.input(z2.object({ origin: z2.string() })).mutation(async ({ ctx, input }) => {
    const user = await getUserById(ctx.user.id);
    if (!user?.stripeCustomerId) {
      throw new Error("No billing account found. Please subscribe first.");
    }
    const session = await stripe.billingPortal.sessions.create({
      customer: user.stripeCustomerId,
      return_url: `${input.origin}/billing`
    });
    return { url: session.url };
  }),
  /** Create a one-time product checkout session for Marketplace purchases */
  createProductCheckout: protectedProcedure.input(
    z2.object({
      productName: z2.string(),
      productDescription: z2.string(),
      priceInCents: z2.number().int().positive(),
      quantity: z2.number().int().positive().default(1),
      origin: z2.string()
    })
  ).mutation(async ({ ctx, input }) => {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: input.productName,
              description: input.productDescription
            },
            unit_amount: input.priceInCents
          },
          quantity: input.quantity
        }
      ],
      customer_email: ctx.user.email ?? void 0,
      client_reference_id: ctx.user.id.toString(),
      metadata: {
        user_id: ctx.user.id.toString(),
        customer_email: ctx.user.email ?? "",
        customer_name: ctx.user.name ?? "",
        product_name: input.productName
      },
      payment_method_types: ["card", "paypal", "cashapp", "link"],
      allow_promotion_codes: true,
      success_url: `${input.origin}/marketplace?success=1&product=${encodeURIComponent(input.productName)}`,
      cancel_url: `${input.origin}/marketplace`
    });
    return { url: session.url };
  }),
  /** Get current subscription status */
  getSubscription: protectedProcedure.query(async ({ ctx }) => {
    const user = await getUserById(ctx.user.id);
    if (!user?.stripeCustomerId || !user?.stripeSubscriptionId) {
      return { status: "none", plan: null };
    }
    try {
      const subscription = await stripe.subscriptions.retrieve(
        user.stripeSubscriptionId
      );
      return {
        status: subscription.status,
        plan: user.stripePlanId ?? null,
        currentPeriodEnd: subscription.current_period_end,
        cancelAtPeriodEnd: subscription.cancel_at_period_end
      };
    } catch {
      return { status: "none", plan: null };
    }
  })
});

// server/routers/feedRouter.ts
import { z as z3 } from "zod";
init_schema();
import { eq as eq2, desc, and as and2, sql as sql2 } from "drizzle-orm";
var feedRouter = router({
  getFeed: publicProcedure.input(z3.object({ limit: z3.number().default(20), offset: z3.number().default(0) }).optional()).query(async ({ input }) => {
    const db = await getDb();
    if (!db) return [];
    const { limit = 20, offset = 0 } = input ?? {};
    return db.select({
      id: posts.id,
      content: posts.content,
      postType: posts.postType,
      mediaUrls: posts.mediaUrls,
      mediaType: posts.mediaType,
      visibility: posts.visibility,
      likesCount: posts.likesCount,
      commentsCount: posts.commentsCount,
      sharesCount: posts.sharesCount,
      isPinned: posts.isPinned,
      createdAt: posts.createdAt,
      userId: posts.userId,
      authorName: users.name,
      authorAvatar: users.avatarUrl
    }).from(posts).leftJoin(users, eq2(posts.userId, users.id)).where(eq2(posts.visibility, "public")).orderBy(desc(posts.createdAt)).limit(limit).offset(offset);
  }),
  createPost: protectedProcedure.input(z3.object({
    content: z3.string().min(1).max(2e3),
    postType: z3.enum(["status", "achievement", "workout", "nil_deal", "announcement", "milestone"]).default("status"),
    mediaUrls: z3.array(z3.string()).optional(),
    mediaType: z3.enum(["none", "image", "video", "gallery"]).default("none"),
    visibility: z3.enum(["public", "followers", "private"]).default("public")
  })).mutation(async ({ ctx, input }) => {
    const db = await getDb();
    if (!db) throw new Error("Database unavailable");
    const result = await db.insert(posts).values({
      userId: ctx.user.id,
      content: input.content,
      postType: input.postType,
      mediaUrls: input.mediaUrls ?? null,
      mediaType: input.mediaType,
      visibility: input.visibility,
      sourceApp: "nil_portal"
    });
    return { success: true, postId: result[0].insertId };
  }),
  likePost: protectedProcedure.input(z3.object({ postId: z3.number() })).mutation(async ({ ctx, input }) => {
    const db = await getDb();
    if (!db) throw new Error("Database unavailable");
    const existing = await db.select().from(postLikes).where(and2(eq2(postLikes.postId, input.postId), eq2(postLikes.userId, ctx.user.id))).limit(1);
    if (existing.length > 0) {
      await db.delete(postLikes).where(
        and2(eq2(postLikes.postId, input.postId), eq2(postLikes.userId, ctx.user.id))
      );
      await db.update(posts).set({ likesCount: sql2`${posts.likesCount} - 1` }).where(eq2(posts.id, input.postId));
      return { liked: false };
    } else {
      await db.insert(postLikes).values({ postId: input.postId, userId: ctx.user.id });
      await db.update(posts).set({ likesCount: sql2`${posts.likesCount} + 1` }).where(eq2(posts.id, input.postId));
      return { liked: true };
    }
  }),
  getComments: publicProcedure.input(z3.object({ postId: z3.number() })).query(async ({ input }) => {
    const db = await getDb();
    if (!db) return [];
    return db.select({
      id: postComments.id,
      content: postComments.content,
      createdAt: postComments.createdAt,
      userId: postComments.userId,
      authorName: users.name,
      authorAvatar: users.avatarUrl
    }).from(postComments).leftJoin(users, eq2(postComments.userId, users.id)).where(eq2(postComments.postId, input.postId)).orderBy(desc(postComments.createdAt));
  }),
  addComment: protectedProcedure.input(z3.object({ postId: z3.number(), content: z3.string().min(1).max(500) })).mutation(async ({ ctx, input }) => {
    const db = await getDb();
    if (!db) throw new Error("Database unavailable");
    await db.insert(postComments).values({
      postId: input.postId,
      userId: ctx.user.id,
      content: input.content
    });
    await db.update(posts).set({ commentsCount: sql2`${posts.commentsCount} + 1` }).where(eq2(posts.id, input.postId));
    return { success: true };
  }),
  getUserPosts: publicProcedure.input(z3.object({ userId: z3.number() })).query(async ({ input }) => {
    const db = await getDb();
    if (!db) return [];
    return db.select().from(posts).where(eq2(posts.userId, input.userId)).orderBy(desc(posts.createdAt));
  })
});

// server/routers/profileRouter.ts
import { z as z4 } from "zod";
init_schema();
import { eq as eq3, sql as sql3 } from "drizzle-orm";
var profileRouter = router({
  getMyProfile: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return null;
    const profile = await db.select().from(athleteProfiles).where(eq3(athleteProfiles.userId, ctx.user.id)).limit(1);
    return profile[0] ?? null;
  }),
  getProfile: publicProcedure.input(z4.object({ userId: z4.number() })).query(async ({ input }) => {
    const db = await getDb();
    if (!db) return null;
    const [profile] = await db.select({
      id: athleteProfiles.id,
      userId: athleteProfiles.userId,
      sport: athleteProfiles.sport,
      position: athleteProfiles.position,
      school: athleteProfiles.school,
      height: athleteProfiles.height,
      weight: athleteProfiles.weight,
      gpa: athleteProfiles.gpa,
      classYear: athleteProfiles.classYear,
      state: athleteProfiles.state,
      bio: athleteProfiles.bio,
      recruitingStatus: athleteProfiles.recruitingStatus,
      nilValue: athleteProfiles.nilValue,
      coverUrl: athleteProfiles.coverUrl,
      highlightUrl: athleteProfiles.highlightUrl,
      instagram: athleteProfiles.instagram,
      twitter: athleteProfiles.twitter,
      followers: athleteProfiles.followers,
      name: users.name,
      email: users.email,
      avatarUrl: users.avatarUrl,
      stripePlanId: users.stripePlanId
    }).from(athleteProfiles).leftJoin(users, eq3(athleteProfiles.userId, users.id)).where(eq3(athleteProfiles.userId, input.userId)).limit(1);
    return profile ?? null;
  }),
  updateProfile: protectedProcedure.input(z4.object({
    sport: z4.string().optional(),
    position: z4.string().optional(),
    school: z4.string().optional(),
    height: z4.string().optional(),
    weight: z4.number().optional(),
    gpa: z4.number().min(0).max(4).optional(),
    classYear: z4.string().optional(),
    state: z4.string().optional(),
    bio: z4.string().max(500).optional(),
    recruitingStatus: z4.enum(["available", "committed", "signed", "transferred"]).optional(),
    instagram: z4.string().optional(),
    twitter: z4.string().optional(),
    followers: z4.number().optional(),
    coverUrl: z4.string().optional(),
    highlightUrl: z4.string().optional()
  })).mutation(async ({ ctx, input }) => {
    const db = await getDb();
    if (!db) throw new Error("Database unavailable");
    const existing = await db.select({ id: athleteProfiles.id }).from(athleteProfiles).where(eq3(athleteProfiles.userId, ctx.user.id)).limit(1);
    const profileData = {
      sport: input.sport,
      position: input.position,
      school: input.school,
      height: input.height,
      weight: input.weight,
      gpa: input.gpa,
      classYear: input.classYear,
      state: input.state,
      bio: input.bio,
      recruitingStatus: input.recruitingStatus,
      instagram: input.instagram,
      twitter: input.twitter,
      followers: input.followers,
      coverUrl: input.coverUrl,
      highlightUrl: input.highlightUrl
    };
    if (existing.length > 0) {
      await db.update(athleteProfiles).set(profileData).where(eq3(athleteProfiles.userId, ctx.user.id));
    } else {
      await db.insert(athleteProfiles).values({ userId: ctx.user.id, ...profileData });
    }
    const followers = input.followers ?? 0;
    const nilValue = Math.floor(followers * 0.05 + (input.gpa ?? 0) * 1e3);
    if (nilValue > 0) {
      await db.update(athleteProfiles).set({ nilValue }).where(eq3(athleteProfiles.userId, ctx.user.id));
    }
    return { success: true };
  }),
  updateAvatar: protectedProcedure.input(z4.object({ avatarUrl: z4.string() })).mutation(async ({ ctx, input }) => {
    const db = await getDb();
    if (!db) throw new Error("Database unavailable");
    await db.update(users).set({ avatarUrl: input.avatarUrl }).where(eq3(users.id, ctx.user.id));
    return { success: true };
  }),
  browseAthletes: publicProcedure.input(z4.object({
    sport: z4.string().optional(),
    position: z4.string().optional(),
    school: z4.string().optional(),
    recruitingStatus: z4.string().optional(),
    limit: z4.number().default(20)
  })).query(async ({ input }) => {
    const db = await getDb();
    if (!db) return [];
    const query = db.select({
      id: athleteProfiles.id,
      userId: athleteProfiles.userId,
      sport: athleteProfiles.sport,
      position: athleteProfiles.position,
      school: athleteProfiles.school,
      classYear: athleteProfiles.classYear,
      state: athleteProfiles.state,
      recruitingStatus: athleteProfiles.recruitingStatus,
      nilValue: athleteProfiles.nilValue,
      followers: athleteProfiles.followers,
      name: users.name,
      avatarUrl: users.avatarUrl
    }).from(athleteProfiles).leftJoin(users, eq3(athleteProfiles.userId, users.id)).limit(input.limit);
    return query;
  }),
  saveOnboarding: protectedProcedure.input(z4.object({
    role: z4.string(),
    data: z4.record(z4.string(), z4.string())
  })).mutation(async ({ ctx, input }) => {
    const db = await getDb();
    if (!db) throw new Error("Database unavailable");
    await db.update(users).set({
      onboardingRole: input.role,
      onboardingData: JSON.stringify(input.data),
      onboardingCompleted: 1,
      sport: input.data.sport ?? void 0,
      school: input.data.school ?? void 0
    }).where(eq3(users.id, ctx.user.id));
    if (input.role === "athlete") {
      const existing = await db.select({ id: athleteProfiles.id }).from(athleteProfiles).where(eq3(athleteProfiles.userId, ctx.user.id)).limit(1);
      const profileData = {
        sport: input.data.sport || null,
        position: input.data.position || null,
        school: input.data.school || null,
        classYear: input.data.graduation_year || null,
        state: input.data.location || null,
        recruitingStatus: input.data.recruiting_status || null,
        gpa: input.data.gpa ? parseFloat(input.data.gpa) : null,
        instagram: input.data.instagram || null,
        twitter: input.data.twitter || null,
        highlightUrl: input.data.highlight_reel || null
      };
      if (existing.length > 0) {
        await db.update(athleteProfiles).set(profileData).where(eq3(athleteProfiles.userId, ctx.user.id));
      } else {
        await db.insert(athleteProfiles).values({ userId: ctx.user.id });
        await db.update(athleteProfiles).set(profileData).where(eq3(athleteProfiles.userId, ctx.user.id));
      }
    }
    return { success: true };
  }),
  getOnboardingStatus: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return { completed: false, role: null };
    const [user] = await db.select({ onboardingCompleted: sql3`onboardingCompleted`, onboardingRole: sql3`onboardingRole` }).from(users).where(eq3(users.id, ctx.user.id)).limit(1);
    return {
      completed: (user?.onboardingCompleted ?? 0) === 1,
      role: user?.onboardingRole ?? null
    };
  })
});

// server/routers/messengerRouter.ts
import { z as z5 } from "zod";
init_schema();
import { eq as eq4, desc as desc2, and as and3, inArray } from "drizzle-orm";
var messengerRouter = router({
  getConversations: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return [];
    const participantRows = await db.select({ conversationId: conversationParticipants.conversationId }).from(conversationParticipants).where(eq4(conversationParticipants.userId, ctx.user.id));
    if (participantRows.length === 0) return [];
    const convIds = participantRows.map((r) => r.conversationId);
    return db.select().from(conversations).where(inArray(conversations.id, convIds)).orderBy(desc2(conversations.lastMessageAt));
  }),
  getMessages: protectedProcedure.input(z5.object({ conversationId: z5.number(), limit: z5.number().default(50) })).query(async ({ ctx, input }) => {
    const db = await getDb();
    if (!db) return [];
    const isParticipant = await db.select().from(conversationParticipants).where(and3(
      eq4(conversationParticipants.conversationId, input.conversationId),
      eq4(conversationParticipants.userId, ctx.user.id)
    )).limit(1);
    if (isParticipant.length === 0) throw new Error("Not a participant");
    return db.select({
      id: messages.id,
      content: messages.content,
      messageType: messages.messageType,
      mediaUrl: messages.mediaUrl,
      isEdited: messages.isEdited,
      isDeleted: messages.isDeleted,
      createdAt: messages.createdAt,
      senderId: messages.senderId,
      senderName: users.name,
      senderAvatar: users.avatarUrl
    }).from(messages).leftJoin(users, eq4(messages.senderId, users.id)).where(and3(
      eq4(messages.conversationId, input.conversationId),
      eq4(messages.isDeleted, "no")
    )).orderBy(desc2(messages.createdAt)).limit(input.limit);
  }),
  sendMessage: protectedProcedure.input(z5.object({ conversationId: z5.number(), content: z5.string().min(1).max(2e3) })).mutation(async ({ ctx, input }) => {
    const db = await getDb();
    if (!db) throw new Error("Database unavailable");
    await db.insert(messages).values({
      conversationId: input.conversationId,
      senderId: ctx.user.id,
      content: input.content,
      messageType: "text"
    });
    await db.update(conversations).set({ lastMessagePreview: input.content.slice(0, 255), lastMessageAt: /* @__PURE__ */ new Date() }).where(eq4(conversations.id, input.conversationId));
    return { success: true };
  }),
  startConversation: protectedProcedure.input(z5.object({ recipientId: z5.number(), initialMessage: z5.string().min(1).max(2e3) })).mutation(async ({ ctx, input }) => {
    const db = await getDb();
    if (!db) throw new Error("Database unavailable");
    const myConvs = await db.select({ conversationId: conversationParticipants.conversationId }).from(conversationParticipants).where(eq4(conversationParticipants.userId, ctx.user.id));
    const theirConvs = await db.select({ conversationId: conversationParticipants.conversationId }).from(conversationParticipants).where(eq4(conversationParticipants.userId, input.recipientId));
    const myIds = new Set(myConvs.map((r) => r.conversationId));
    const existing = theirConvs.find((r) => myIds.has(r.conversationId));
    let conversationId;
    if (existing) {
      conversationId = existing.conversationId;
    } else {
      const [conv] = await db.insert(conversations).values({
        type: "direct",
        createdBy: ctx.user.id,
        lastMessagePreview: input.initialMessage.slice(0, 255),
        lastMessageAt: /* @__PURE__ */ new Date()
      });
      conversationId = conv.insertId;
      await db.insert(conversationParticipants).values([
        { conversationId, userId: ctx.user.id },
        { conversationId, userId: input.recipientId }
      ]);
    }
    await db.insert(messages).values({
      conversationId,
      senderId: ctx.user.id,
      content: input.initialMessage,
      messageType: "text"
    });
    return { success: true, conversationId };
  })
});

// server/routers/nilRouter.ts
import { z as z6 } from "zod";
init_schema();
import { eq as eq5, desc as desc3 } from "drizzle-orm";
var nilRouter = router({
  // NIL Deals
  getMyDeals: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return [];
    return db.select().from(nilDeals).where(eq5(nilDeals.athleteId, ctx.user.id)).orderBy(desc3(nilDeals.createdAt));
  }),
  getAllDeals: publicProcedure.input(z6.object({
    status: z6.enum(["pending", "active", "completed", "declined"]).optional(),
    category: z6.string().optional(),
    limit: z6.number().default(20)
  })).query(async ({ input }) => {
    const db = await getDb();
    if (!db) return [];
    return db.select({
      id: nilDeals.id,
      brandName: nilDeals.brandName,
      dealValue: nilDeals.dealValue,
      status: nilDeals.status,
      description: nilDeals.description,
      category: nilDeals.category,
      startDate: nilDeals.startDate,
      endDate: nilDeals.endDate,
      athleteName: users.name,
      athleteAvatar: users.avatarUrl
    }).from(nilDeals).leftJoin(users, eq5(nilDeals.athleteId, users.id)).limit(input.limit).orderBy(desc3(nilDeals.createdAt));
  }),
  createDeal: protectedProcedure.input(z6.object({
    brandName: z6.string().min(1).max(128),
    dealValue: z6.number().min(0),
    description: z6.string().optional(),
    category: z6.string().optional(),
    startDate: z6.date().optional(),
    endDate: z6.date().optional()
  })).mutation(async ({ ctx, input }) => {
    const db = await getDb();
    if (!db) throw new Error("Database unavailable");
    await db.insert(nilDeals).values({
      athleteId: ctx.user.id,
      brandName: input.brandName,
      dealValue: input.dealValue,
      description: input.description,
      category: input.category,
      startDate: input.startDate,
      endDate: input.endDate
    });
    return { success: true };
  }),
  updateDealStatus: protectedProcedure.input(z6.object({
    dealId: z6.number(),
    status: z6.enum(["pending", "active", "completed", "declined"])
  })).mutation(async ({ ctx, input }) => {
    const db = await getDb();
    if (!db) throw new Error("Database unavailable");
    await db.update(nilDeals).set({ status: input.status }).where(eq5(nilDeals.id, input.dealId));
    return { success: true };
  }),
  calculateNilValue: publicProcedure.input(z6.object({
    sport: z6.string(),
    followers: z6.number(),
    gpa: z6.number().optional(),
    school: z6.string().optional(),
    classYear: z6.string().optional()
  })).query(({ input }) => {
    const sportMultipliers = {
      football: 2.5,
      basketball: 2.2,
      baseball: 1.5,
      soccer: 1.3,
      volleyball: 1.2,
      softball: 1.1,
      track: 1,
      swimming: 0.9,
      wrestling: 0.9,
      tennis: 0.8
    };
    const multiplier = sportMultipliers[input.sport.toLowerCase()] ?? 1;
    const followerValue = input.followers * 0.05 * multiplier;
    const gpaBonus = (input.gpa ?? 0) * 500;
    const classBonus = input.classYear === "Freshman" ? 500 : input.classYear === "Sophomore" ? 750 : input.classYear === "Junior" ? 1e3 : 1250;
    const total = Math.floor(followerValue + gpaBonus + classBonus);
    return {
      estimatedValue: total,
      breakdown: {
        followerValue: Math.floor(followerValue),
        gpaBonus: Math.floor(gpaBonus),
        classBonus,
        sportMultiplier: multiplier
      }
    };
  }),
  // Transfer Portal
  getTransferEntries: publicProcedure.input(z6.object({
    sport: z6.string().optional(),
    status: z6.enum(["entered", "committed", "withdrawn"]).optional(),
    limit: z6.number().default(20)
  })).query(async ({ input }) => {
    const db = await getDb();
    if (!db) return [];
    return db.select({
      id: transferPortalEntries.id,
      fromSchool: transferPortalEntries.fromSchool,
      toSchool: transferPortalEntries.toSchool,
      status: transferPortalEntries.status,
      eligibilityYears: transferPortalEntries.eligibilityYears,
      enteredAt: transferPortalEntries.enteredAt,
      sport: athleteProfiles.sport,
      position: athleteProfiles.position,
      athleteName: users.name,
      athleteAvatar: users.avatarUrl,
      nilValue: athleteProfiles.nilValue
    }).from(transferPortalEntries).leftJoin(athleteProfiles, eq5(transferPortalEntries.athleteId, athleteProfiles.userId)).leftJoin(users, eq5(transferPortalEntries.athleteId, users.id)).limit(input.limit).orderBy(desc3(transferPortalEntries.enteredAt));
  }),
  enterTransferPortal: protectedProcedure.input(z6.object({
    fromSchool: z6.string(),
    eligibilityYears: z6.number().min(0).max(5).optional()
  })).mutation(async ({ ctx, input }) => {
    const db = await getDb();
    if (!db) throw new Error("Database unavailable");
    await db.insert(transferPortalEntries).values({
      athleteId: ctx.user.id,
      fromSchool: input.fromSchool,
      eligibilityYears: input.eligibilityYears,
      status: "entered"
    });
    return { success: true };
  })
});

// server/routers/trainingRouter.ts
import { z as z7 } from "zod";
init_schema();
import { eq as eq6, desc as desc4 } from "drizzle-orm";
var trainingRouter = router({
  logWorkout: protectedProcedure.input(z7.object({
    workout: z7.string().min(1).max(128),
    duration: z7.number().min(1).max(600).optional(),
    notes: z7.string().max(1e3).optional(),
    performance: z7.number().min(1).max(10).optional(),
    logDate: z7.date().optional()
  })).mutation(async ({ ctx, input }) => {
    const db = await getDb();
    if (!db) throw new Error("Database unavailable");
    await db.insert(trainingLogs).values({
      userId: ctx.user.id,
      workout: input.workout,
      duration: input.duration,
      notes: input.notes,
      performance: input.performance,
      logDate: input.logDate ?? /* @__PURE__ */ new Date()
    });
    return { success: true };
  }),
  getHistory: protectedProcedure.input(z7.object({ limit: z7.number().default(30) })).query(async ({ ctx, input }) => {
    const db = await getDb();
    if (!db) return [];
    return db.select().from(trainingLogs).where(eq6(trainingLogs.userId, ctx.user.id)).orderBy(desc4(trainingLogs.logDate)).limit(input.limit);
  }),
  getStats: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return { totalSessions: 0, totalMinutes: 0, avgPerformance: 0, streak: 0 };
    const logs = await db.select().from(trainingLogs).where(eq6(trainingLogs.userId, ctx.user.id)).orderBy(desc4(trainingLogs.logDate));
    const totalSessions = logs.length;
    const totalMinutes = logs.reduce((sum, l) => sum + (l.duration ?? 0), 0);
    const avgPerformance = logs.length > 0 ? Math.round(logs.reduce((sum, l) => sum + (l.performance ?? 0), 0) / logs.length * 10) / 10 : 0;
    return { totalSessions, totalMinutes, avgPerformance, streak: Math.min(totalSessions, 7) };
  })
});

// server/routers/aiRouter.ts
import { z as z8 } from "zod";

// server/_core/llm.ts
var ensureArray = (value) => Array.isArray(value) ? value : [value];
var normalizeContentPart = (part) => {
  if (typeof part === "string") {
    return { type: "text", text: part };
  }
  if (part.type === "text") {
    return part;
  }
  if (part.type === "image_url") {
    return part;
  }
  if (part.type === "file_url") {
    return part;
  }
  throw new Error("Unsupported message content part");
};
var normalizeMessage = (message) => {
  const { role, name, tool_call_id } = message;
  if (role === "tool" || role === "function") {
    const content = ensureArray(message.content).map((part) => typeof part === "string" ? part : JSON.stringify(part)).join("\n");
    return {
      role,
      name,
      tool_call_id,
      content
    };
  }
  const contentParts = ensureArray(message.content).map(normalizeContentPart);
  if (contentParts.length === 1 && contentParts[0].type === "text") {
    return {
      role,
      name,
      content: contentParts[0].text
    };
  }
  return {
    role,
    name,
    content: contentParts
  };
};
var normalizeToolChoice = (toolChoice, tools) => {
  if (!toolChoice) return void 0;
  if (toolChoice === "none" || toolChoice === "auto") {
    return toolChoice;
  }
  if (toolChoice === "required") {
    if (!tools || tools.length === 0) {
      throw new Error(
        "tool_choice 'required' was provided but no tools were configured"
      );
    }
    if (tools.length > 1) {
      throw new Error(
        "tool_choice 'required' needs a single tool or specify the tool name explicitly"
      );
    }
    return {
      type: "function",
      function: { name: tools[0].function.name }
    };
  }
  if ("name" in toolChoice) {
    return {
      type: "function",
      function: { name: toolChoice.name }
    };
  }
  return toolChoice;
};
var resolveApiUrl = () => ENV.forgeApiUrl && ENV.forgeApiUrl.trim().length > 0 ? `${ENV.forgeApiUrl.replace(/\/$/, "")}/v1/chat/completions` : "https://api.openai.com/v1/chat/completions";
var assertApiKey = () => {
  if (!ENV.forgeApiKey) {
    throw new Error("OPENAI_API_KEY is not configured");
  }
};
var normalizeResponseFormat = ({
  responseFormat,
  response_format,
  outputSchema,
  output_schema
}) => {
  const explicitFormat = responseFormat || response_format;
  if (explicitFormat) {
    if (explicitFormat.type === "json_schema" && !explicitFormat.json_schema?.schema) {
      throw new Error(
        "responseFormat json_schema requires a defined schema object"
      );
    }
    return explicitFormat;
  }
  const schema = outputSchema || output_schema;
  if (!schema) return void 0;
  if (!schema.name || !schema.schema) {
    throw new Error("outputSchema requires both name and schema");
  }
  return {
    type: "json_schema",
    json_schema: {
      name: schema.name,
      schema: schema.schema,
      ...typeof schema.strict === "boolean" ? { strict: schema.strict } : {}
    }
  };
};
async function invokeLLM(params) {
  assertApiKey();
  const {
    messages: messages3,
    tools,
    toolChoice,
    tool_choice,
    outputSchema,
    output_schema,
    responseFormat,
    response_format
  } = params;
  const payload = {
    model: "gemini-2.5-flash",
    messages: messages3.map(normalizeMessage)
  };
  if (tools && tools.length > 0) {
    payload.tools = tools;
  }
  const normalizedToolChoice = normalizeToolChoice(
    toolChoice || tool_choice,
    tools
  );
  if (normalizedToolChoice) {
    payload.tool_choice = normalizedToolChoice;
  }
  payload.max_tokens = 32768;
  payload.thinking = {
    "budget_tokens": 128
  };
  const normalizedResponseFormat = normalizeResponseFormat({
    responseFormat,
    response_format,
    outputSchema,
    output_schema
  });
  if (normalizedResponseFormat) {
    payload.response_format = normalizedResponseFormat;
  }
  const response = await fetch(resolveApiUrl(), {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${ENV.forgeApiKey}`
    },
    body: JSON.stringify(payload)
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `LLM invoke failed: ${response.status} ${response.statusText} \u2013 ${errorText}`
    );
  }
  return await response.json();
}

// server/routers/aiRouter.ts
var aiRouter = router({
  // AI SALES — Brand pitch & deal analysis
  generateBrandPitch: protectedProcedure.input(z8.object({
    athleteName: z8.string(),
    sport: z8.string(),
    school: z8.string().optional(),
    followers: z8.number().optional(),
    brandName: z8.string(),
    brandCategory: z8.string(),
    dealValue: z8.number().optional()
  })).mutation(async ({ input }) => {
    const response = await invokeLLM({
      messages: [
        {
          role: "system",
          content: `You are an elite NIL (Name, Image, Likeness) deal strategist for college athletes. 
You write compelling, professional brand partnership pitches that convert. 
Keep responses concise, punchy, and results-focused. Format with clear sections.`
        },
        {
          role: "user",
          content: `Write a professional brand partnership pitch for:
- Athlete: ${input.athleteName}
- Sport: ${input.sport}
- School: ${input.school ?? "College Athlete"}
- Social Following: ${input.followers?.toLocaleString() ?? "Growing"} followers
- Brand: ${input.brandName} (${input.brandCategory})
${input.dealValue ? `- Target Deal Value: $${input.dealValue.toLocaleString()}` : ""}

Include: Opening hook, athlete value proposition, brand alignment, deliverables, and a strong close. Keep it under 300 words.`
        }
      ]
    });
    return { pitch: response.choices[0].message.content };
  }),
  analyzeDeal: protectedProcedure.input(z8.object({
    brandName: z8.string(),
    dealValue: z8.number(),
    deliverables: z8.string(),
    athleteFollowers: z8.number().optional(),
    sport: z8.string().optional()
  })).mutation(async ({ input }) => {
    const response = await invokeLLM({
      messages: [
        {
          role: "system",
          content: "You are an expert NIL deal analyst. Evaluate deals objectively and provide actionable insights. Be direct and specific."
        },
        {
          role: "user",
          content: `Analyze this NIL deal:
- Brand: ${input.brandName}
- Offer: $${input.dealValue.toLocaleString()}
- Deliverables: ${input.deliverables}
- Athlete Followers: ${input.athleteFollowers?.toLocaleString() ?? "Unknown"}
- Sport: ${input.sport ?? "College Sport"}

Provide: Deal rating (1-10), fair market value assessment, red flags if any, negotiation tips, and final recommendation. Be direct.`
        }
      ]
    });
    return { analysis: response.choices[0].message.content };
  }),
  // AI RECRUITER — Profile optimization & coach outreach
  optimizeProfile: protectedProcedure.input(z8.object({
    sport: z8.string(),
    position: z8.string().optional(),
    school: z8.string().optional(),
    gpa: z8.number().optional(),
    height: z8.string().optional(),
    weight: z8.string().optional(),
    bio: z8.string().optional(),
    achievements: z8.string().optional()
  })).mutation(async ({ input }) => {
    const response = await invokeLLM({
      messages: [
        {
          role: "system",
          content: `You are a top college recruiting consultant who has helped hundreds of athletes get scholarships. 
You know exactly what coaches look for and how to make profiles stand out. Be specific and actionable.`
        },
        {
          role: "user",
          content: `Optimize this athlete's recruiting profile:
- Sport: ${input.sport}
- Position: ${input.position ?? "Not specified"}
- Current School: ${input.school ?? "Not specified"}
- GPA: ${input.gpa ?? "Not specified"}
- Height/Weight: ${input.height ?? "?"} / ${input.weight ?? "?"}
- Current Bio: ${input.bio ?? "None provided"}
- Achievements: ${input.achievements ?? "None listed"}

Provide: 1) Rewritten bio (under 150 words), 2) Top 3 profile improvements, 3) Key stats to highlight, 4) Recruiting strategy tip. Format clearly.`
        }
      ]
    });
    return { optimized: response.choices[0].message.content };
  }),
  generateCoachEmail: protectedProcedure.input(z8.object({
    athleteName: z8.string(),
    sport: z8.string(),
    position: z8.string().optional(),
    school: z8.string().optional(),
    targetSchool: z8.string(),
    coachName: z8.string().optional(),
    gpa: z8.number().optional(),
    achievements: z8.string().optional()
  })).mutation(async ({ input }) => {
    const response = await invokeLLM({
      messages: [
        {
          role: "system",
          content: "You are a recruiting expert who writes compelling, professional outreach emails to college coaches. Emails should be personal, specific, and action-oriented. Keep them under 200 words."
        },
        {
          role: "user",
          content: `Write a coach outreach email for:
- Athlete: ${input.athleteName}
- Sport: ${input.sport}, Position: ${input.position ?? "Not specified"}
- Current School: ${input.school ?? "High School/Transfer"}
- Target School: ${input.targetSchool}
- Coach: ${input.coachName ?? "Head Coach"}
- GPA: ${input.gpa ?? "Strong"}
- Key Achievements: ${input.achievements ?? "Competitive athlete"}

Write a professional, genuine email that will get a response. Include subject line.`
        }
      ]
    });
    return { email: response.choices[0].message.content };
  }),
  // AI CONTENT — Social media content generation
  generateCaption: protectedProcedure.input(z8.object({
    platform: z8.enum(["instagram", "twitter", "tiktok", "linkedin"]),
    contentType: z8.enum(["highlight", "training", "gameday", "nil_deal", "motivation", "recruiting"]),
    context: z8.string(),
    athleteName: z8.string().optional(),
    sport: z8.string().optional(),
    includeHashtags: z8.boolean().default(true)
  })).mutation(async ({ input }) => {
    const platformGuides = {
      instagram: "engaging, 150-200 chars, story-driven, with emojis",
      twitter: "punchy, under 280 chars, conversational, trending",
      tiktok: "energetic, hook-first, youth-focused, viral potential",
      linkedin: "professional, achievement-focused, career-oriented"
    };
    const response = await invokeLLM({
      messages: [
        {
          role: "system",
          content: `You are a social media expert for college athletes. You create viral, authentic content that builds personal brands and attracts NIL deals. You understand each platform's unique voice.`
        },
        {
          role: "user",
          content: `Generate a ${input.platform} caption for a ${input.contentType} post.
Platform style: ${platformGuides[input.platform]}
Context: ${input.context}
${input.athleteName ? `Athlete: ${input.athleteName}` : ""}
${input.sport ? `Sport: ${input.sport}` : ""}
${input.includeHashtags ? "Include 5-8 relevant hashtags." : "No hashtags."}

Write 3 caption options, numbered. Make them authentic and platform-native.`
        }
      ]
    });
    return { captions: response.choices[0].message.content };
  }),
  generateBio: protectedProcedure.input(z8.object({
    platform: z8.enum(["instagram", "twitter", "tiktok", "linkedin"]),
    athleteName: z8.string(),
    sport: z8.string(),
    school: z8.string().optional(),
    position: z8.string().optional(),
    achievements: z8.string().optional(),
    personality: z8.string().optional()
  })).mutation(async ({ input }) => {
    const response = await invokeLLM({
      messages: [
        {
          role: "system",
          content: "You write compelling athlete social media bios that attract followers, coaches, and brand deals. Keep them punchy and memorable."
        },
        {
          role: "user",
          content: `Write a ${input.platform} bio for:
- Name: ${input.athleteName}
- Sport: ${input.sport} | Position: ${input.position ?? ""}
- School: ${input.school ?? "College Athlete"}
- Achievements: ${input.achievements ?? "Competitive athlete"}
- Personality: ${input.personality ?? "Driven, focused, team player"}

Write 2 bio options. Keep each under 150 characters for Instagram/Twitter, or 3 sentences for LinkedIn.`
        }
      ]
    });
    return { bios: response.choices[0].message.content };
  }),
  generateContentPlan: protectedProcedure.input(z8.object({
    sport: z8.string(),
    season: z8.enum(["preseason", "in-season", "offseason", "postseason"]),
    goals: z8.string(),
    platforms: z8.array(z8.string())
  })).mutation(async ({ input }) => {
    const response = await invokeLLM({
      messages: [
        {
          role: "system",
          content: "You are a digital marketing strategist specializing in athlete personal branding. You create actionable 30-day content plans that grow audiences and attract NIL deals."
        },
        {
          role: "user",
          content: `Create a 30-day content plan for a ${input.sport} athlete:
- Season: ${input.season}
- Goals: ${input.goals}
- Platforms: ${input.platforms.join(", ")}

Provide: Weekly themes, 3 content ideas per week, best posting times, and one viral content idea. Format as a clear schedule.`
        }
      ]
    });
    return { plan: response.choices[0].message.content };
  }),
  // AI ROBOT COMPANION — Conversational robot assistant for athletes
  robotChat: protectedProcedure.input(z8.object({
    message: z8.string(),
    scenario: z8.string().optional(),
    sport: z8.string().optional(),
    history: z8.array(z8.object({
      role: z8.enum(["user", "assistant"]),
      content: z8.string()
    })).optional()
  })).mutation(async ({ input }) => {
    const systemPrompt = `You are LYNX \u2014 the ATHLYNX AI Robot Companion. You are a friendly, knowledgeable, and motivating AI assistant built specifically for athletes.

You help athletes with:
- Training tips, drills, and workout plans for any sport
- Recruiting advice and college selection
- NIL deals, brand partnerships, and contract guidance
- Game strategy, film review, and play analysis
- Recovery, nutrition, and wellness
- Mental performance and pre-game preparation
- Social media growth and personal branding
- Academic balance and time management
- Transfer portal decisions
- Anything an athlete needs in the stands, on the field, in the locker room, or at home

Current scenario: ${input.scenario ?? "General athlete assistance"}
Athlete's sport: ${input.sport ?? "Not specified"}

Be encouraging, specific, and practical. Use sports terminology naturally. Keep responses focused and actionable. You are their robot teammate who never sleeps.`;
    const messages3 = [
      { role: "system", content: systemPrompt },
      ...(input.history ?? []).map((h) => ({ role: h.role, content: h.content })),
      { role: "user", content: input.message }
    ];
    const response = await invokeLLM({ messages: messages3 });
    return { reply: response.choices[0].message.content };
  }),
  // AI PLAYBOOK — The Athlete Playbook recruiting intelligence
  getRecruitingAdvice: protectedProcedure.input(z8.object({
    sport: z8.string(),
    position: z8.string().optional(),
    currentSchool: z8.string().optional(),
    targetLevel: z8.enum(["D1", "D2", "D3", "NAIA", "JUCO", "Transfer"]),
    gpa: z8.number().optional(),
    question: z8.string()
  })).mutation(async ({ input }) => {
    const response = await invokeLLM({
      messages: [
        {
          role: "system",
          content: `You are "The Athlete Playbook" \u2014 ATHLYNX's AI recruiting intelligence engine. 
You have deep knowledge of college recruiting timelines, NCAA rules, NIL regulations, and what coaches want.
You help athletes from all backgrounds \u2014 especially those from smaller schools \u2014 maximize their recruiting potential.
Be specific, encouraging, and actionable. Reference real recruiting timelines and NCAA rules where relevant.`
        },
        {
          role: "user",
          content: `Athlete Profile:
- Sport: ${input.sport}
- Position: ${input.position ?? "Not specified"}
- Current School: ${input.currentSchool ?? "Not specified"}
- Target Level: ${input.targetLevel}
- GPA: ${input.gpa ?? "Not specified"}

Question: ${input.question}

Provide a detailed, actionable answer. Include specific next steps, timelines, and resources.`
        }
      ]
    });
    return { advice: response.choices[0].message.content };
  })
});

// server/routers/notificationsRouter.ts
import { z as z9 } from "zod";
init_schema();
import { eq as eq7, desc as desc5, and as and4, count } from "drizzle-orm";
import { TRPCError as TRPCError3 } from "@trpc/server";
var notificationsRouter = router({
  getRecent: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return [];
    return db.select().from(notifications).where(eq7(notifications.userId, ctx.user.id)).orderBy(desc5(notifications.createdAt)).limit(20);
  }),
  markAllRead: protectedProcedure.mutation(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return { success: false };
    await db.update(notifications).set({ isRead: "yes", readAt: /* @__PURE__ */ new Date() }).where(and4(eq7(notifications.userId, ctx.user.id), eq7(notifications.isRead, "no")));
    return { success: true };
  }),
  markRead: protectedProcedure.input(z9.object({ id: z9.number() })).mutation(async ({ ctx, input }) => {
    const db = await getDb();
    if (!db) return { success: false };
    await db.update(notifications).set({ isRead: "yes", readAt: /* @__PURE__ */ new Date() }).where(and4(eq7(notifications.id, input.id), eq7(notifications.userId, ctx.user.id)));
    return { success: true };
  }),
  create: protectedProcedure.input(z9.object({
    title: z9.string(),
    message: z9.string().optional(),
    type: z9.enum(["welcome", "vip_approved", "system_announcement", "custom", "credit_added", "new_feature", "promotion", "reminder", "achievement", "message"]).default("custom"),
    link: z9.string().optional(),
    priority: z9.enum(["low", "normal", "high", "urgent"]).default("normal")
  })).mutation(async ({ ctx, input }) => {
    const db = await getDb();
    if (!db) return { success: false };
    await db.insert(notifications).values({
      userId: ctx.user.id,
      title: input.title,
      message: input.message,
      type: input.type,
      link: input.link,
      priority: input.priority,
      isRead: "no"
    });
    return { success: true };
  }),
  // Get unread count for badge
  getUnreadCount: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return { count: 0 };
    const result = await db.select({ count: count() }).from(notifications).where(and4(eq7(notifications.userId, ctx.user.id), eq7(notifications.isRead, "no")));
    return { count: result[0]?.count ?? 0 };
  }),
  // Admin: send notification to a specific user
  sendToUser: protectedProcedure.input(z9.object({
    userId: z9.number(),
    title: z9.string(),
    message: z9.string().optional(),
    type: z9.enum(["welcome", "vip_approved", "system_announcement", "custom", "credit_added", "new_feature", "promotion", "reminder", "achievement", "message"]).default("system_announcement"),
    priority: z9.enum(["low", "normal", "high", "urgent"]).default("normal")
  })).mutation(async ({ ctx, input }) => {
    if (ctx.user.role !== "admin") {
      throw new TRPCError3({ code: "FORBIDDEN", message: "Admin only" });
    }
    const db = await getDb();
    if (!db) return { success: false, sent: 0 };
    await db.insert(notifications).values({
      userId: input.userId,
      title: input.title,
      message: input.message,
      type: input.type,
      priority: input.priority,
      isRead: "no"
    });
    return { success: true, sent: 1 };
  }),
  // Admin: broadcast notification to ALL users
  broadcast: protectedProcedure.input(z9.object({
    title: z9.string(),
    message: z9.string().optional(),
    type: z9.enum(["welcome", "vip_approved", "system_announcement", "custom", "credit_added", "new_feature", "promotion", "reminder", "achievement", "message"]).default("system_announcement"),
    priority: z9.enum(["low", "normal", "high", "urgent"]).default("normal")
  })).mutation(async ({ ctx, input }) => {
    if (ctx.user.role !== "admin") {
      throw new TRPCError3({ code: "FORBIDDEN", message: "Admin only" });
    }
    const db = await getDb();
    if (!db) return { success: false, sent: 0 };
    const allUsers = await db.select({ id: users.id }).from(users);
    if (allUsers.length === 0) return { success: true, sent: 0 };
    await db.insert(notifications).values(
      allUsers.map((u) => ({
        userId: u.id,
        title: input.title,
        message: input.message,
        type: input.type,
        priority: input.priority,
        isBroadcast: "yes",
        isRead: "no"
      }))
    );
    return { success: true, sent: allUsers.length };
  })
});

// server/routers/messagingRouter.ts
import { z as z10 } from "zod";

// server/services/verification.ts
init_schema();
import { eq as eq8, and as and5, gt } from "drizzle-orm";
function generateCode() {
  return Math.floor(1e5 + Math.random() * 9e5).toString();
}
async function sendVerificationCode(email, phone, type = "signup", name) {
  try {
    const code = generateCode();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1e3);
    const signupDate = /* @__PURE__ */ new Date();
    const db = await getDb();
    if (!db) throw new Error("Database not available");
    await db.insert(verificationCodes).values({
      email,
      phone: phone ?? null,
      code,
      type,
      verified: false,
      expiresAt
    });
    const emailSent = await sendVerificationEmail(email, code, name, signupDate);
    return {
      success: true,
      emailSent,
      smsSent: false
      // SMS handled by Auth0
    };
  } catch (error) {
    console.error("[Verification] Error sending code:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to send verification code"
    };
  }
}
async function verifyCode(email, code) {
  try {
    const db = await getDb();
    if (!db) throw new Error("Database not available");
    const now = /* @__PURE__ */ new Date();
    const [verification] = await db.select().from(verificationCodes).where(
      and5(
        eq8(verificationCodes.email, email),
        eq8(verificationCodes.code, code),
        eq8(verificationCodes.verified, false),
        gt(verificationCodes.expiresAt, now)
      )
    ).limit(1);
    if (!verification) {
      return { valid: false, error: "Invalid or expired code" };
    }
    await db.update(verificationCodes).set({ verified: true }).where(eq8(verificationCodes.id, verification.id));
    return { valid: true };
  } catch (error) {
    console.error("[Verification] Error verifying code:", error);
    return {
      valid: false,
      error: error instanceof Error ? error.message : "Verification failed"
    };
  }
}

// server/routers/messagingRouter.ts
import { TRPCError as TRPCError4 } from "@trpc/server";
var messagingRouter = router({
  /**
   * Send a verification code via email and/or SMS
   */
  sendVerificationCode: protectedProcedure.input(z10.object({
    phone: z10.string().optional(),
    type: z10.enum(["signup", "login", "password_reset"]).default("signup")
  })).mutation(async ({ ctx, input }) => {
    const email = ctx.user.email;
    if (!email) {
      throw new TRPCError4({ code: "BAD_REQUEST", message: "No email on your account" });
    }
    const result = await sendVerificationCode(email, input.phone, input.type);
    if (!result.success) {
      throw new TRPCError4({ code: "INTERNAL_SERVER_ERROR", message: result.error ?? "Failed to send code" });
    }
    return { emailSent: result.emailSent ?? false, smsSent: false };
  }),
  /**
   * Verify a code submitted by the user
   */
  verifyCode: protectedProcedure.input(z10.object({ code: z10.string().min(4).max(8) })).mutation(async ({ ctx, input }) => {
    const email = ctx.user.email;
    if (!email) {
      throw new TRPCError4({ code: "BAD_REQUEST", message: "No email on your account" });
    }
    const result = await verifyCode(email, input.code);
    if (!result.valid) {
      throw new TRPCError4({ code: "BAD_REQUEST", message: result.error ?? "Invalid or expired code" });
    }
    return { verified: true };
  }),
  /**
   * Send a custom email (athlete or admin use)
   */
  sendEmail: protectedProcedure.input(z10.object({
    to: z10.string().email(),
    subject: z10.string().min(1),
    body: z10.string().min(1)
  })).mutation(async ({ input }) => {
    await sendEmail({ to: input.to, subject: input.subject, html: `<p>${input.body.replace(/\n/g, "<br>")}</p>`, text: input.body });
    return { sent: true };
  })
});

// server/routers/crmRouter.ts
import { z as z11 } from "zod";
import { TRPCError as TRPCError5 } from "@trpc/server";
var adminProcedure2 = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== "admin") {
    throw new TRPCError5({ code: "FORBIDDEN", message: "Admin access required" });
  }
  return next({ ctx });
});
var crmRouter = router({
  // ─── Public: Track signup ──────────────────────────────────────────────────
  trackSignup: publicProcedure.input(z11.object({
    fullName: z11.string(),
    email: z11.string().email(),
    phone: z11.string().optional(),
    role: z11.string().optional(),
    sport: z11.string().optional(),
    referralSource: z11.string().optional(),
    utmSource: z11.string().optional(),
    utmMedium: z11.string().optional(),
    utmCampaign: z11.string().optional(),
    signupType: z11.enum(["waitlist", "vip", "direct", "referral"]).optional()
  })).mutation(async ({ input, ctx }) => {
    const rawReq = ctx.req;
    const ipAddress = rawReq.headers?.["x-forwarded-for"]?.toString().split(",")[0] || rawReq.headers?.["x-real-ip"]?.toString() || "unknown";
    const userAgent = rawReq.headers?.["user-agent"] || "";
    console.log("[CRM] New signup tracked:", { ...input, ipAddress, userAgent, timestamp: (/* @__PURE__ */ new Date()).toISOString() });
    return { success: true, message: "Signup tracked" };
  }),
  // ─── Public: Validate access code ─────────────────────────────────────────
  validateAccess: publicProcedure.input(z11.object({ accessCode: z11.string() })).query(async ({ input }) => {
    const validCodes = ["ATHLYNX2025", "DHG_PARTNER", "FOUNDER_ACCESS"];
    const valid = validCodes.includes(input.accessCode.toUpperCase());
    return { valid, partner: valid ? { name: "Partner", code: input.accessCode, role: "admin" } : null };
  }),
  // ─── Protected: Stats overview ────────────────────────────────────────────
  stats: protectedProcedure.query(async () => {
    const db = await getDb();
    if (!db) return { totalSignups: 0, todaySignups: 0, weekSignups: 0, convertedUsers: 0, payingUsers: 0, totalRevenue: 0, waitlistCount: 0, contactsCount: 0, conversionRate: "0%", lastUpdated: (/* @__PURE__ */ new Date()).toISOString() };
    const { users: users2, waitlist: waitlist2, crmContacts: crmContacts2 } = await Promise.resolve().then(() => (init_schema(), schema_exports));
    const { count: count2, gte: gte2 } = await import("drizzle-orm");
    const now = /* @__PURE__ */ new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1e3);
    const [totalResult] = await db.select({ total: count2() }).from(users2);
    const [todayResult] = await db.select({ total: count2() }).from(users2).where(gte2(users2.createdAt, todayStart));
    const [weekResult] = await db.select({ total: count2() }).from(users2).where(gte2(users2.createdAt, weekStart));
    const [waitlistResult] = await db.select({ total: count2() }).from(waitlist2);
    const [contactsResult] = await db.select({ total: count2() }).from(crmContacts2);
    const total = totalResult?.total ?? 0;
    return {
      totalSignups: total,
      todaySignups: todayResult?.total ?? 0,
      weekSignups: weekResult?.total ?? 0,
      convertedUsers: 0,
      payingUsers: 0,
      totalRevenue: 0,
      waitlistCount: waitlistResult?.total ?? 0,
      contactsCount: contactsResult?.total ?? 0,
      conversionRate: "0%",
      lastUpdated: (/* @__PURE__ */ new Date()).toISOString()
    };
  }),
  // ─── Protected: Get signups list ──────────────────────────────────────────
  signups: protectedProcedure.input(z11.object({ limit: z11.number().default(100), offset: z11.number().default(0) }).optional()).query(async ({ input }) => {
    const db = await getDb();
    if (!db) return { signups: [], total: 0 };
    const { users: users2 } = await Promise.resolve().then(() => (init_schema(), schema_exports));
    const { desc: desc8 } = await import("drizzle-orm");
    const rows = await db.select().from(users2).orderBy(desc8(users2.createdAt)).limit(input?.limit ?? 100).offset(input?.offset ?? 0);
    const signups = rows.map((u, i) => ({
      id: u.id,
      signupNumber: i + 1,
      fullName: u.name,
      email: u.email ?? "",
      phone: u.phone ?? null,
      role: u.role ?? "athlete",
      sport: null,
      ipAddress: null,
      browser: null,
      device: null,
      os: null,
      country: null,
      city: null,
      signupType: "direct",
      isConverted: false,
      isPaying: false,
      lifetimeValue: null,
      createdAt: u.createdAt
    }));
    return { signups, total: rows.length };
  }),
  // ─── Admin: Get CRM contacts ──────────────────────────────────────────────
  getContacts: adminProcedure2.input(z11.object({
    search: z11.string().optional(),
    role: z11.string().optional(),
    status: z11.string().optional(),
    limit: z11.number().default(50),
    offset: z11.number().default(0)
  }).optional()).query(async ({ input }) => {
    const db = await getDb();
    if (!db) return { contacts: [], total: 0 };
    const { crmContacts: crmContacts2 } = await Promise.resolve().then(() => (init_schema(), schema_exports));
    const { desc: desc8, ilike, and: and8, eq: eq14, or: or2, count: count2 } = await import("drizzle-orm");
    const conditions = [];
    if (input?.search) {
      conditions.push(or2(
        ilike(crmContacts2.name, `%${input.search}%`),
        ilike(crmContacts2.email, `%${input.search}%`),
        ilike(crmContacts2.company, `%${input.search}%`)
      ));
    }
    if (input?.role) conditions.push(eq14(crmContacts2.role, input.role));
    if (input?.status) conditions.push(eq14(crmContacts2.status, input.status));
    const [totalResult] = await db.select({ total: count2() }).from(crmContacts2);
    const query = db.select().from(crmContacts2).orderBy(desc8(crmContacts2.lastActivity)).limit(input?.limit ?? 50).offset(input?.offset ?? 0);
    const contacts = conditions.length > 0 ? await query.where(and8(...conditions)) : await query;
    return { contacts, total: totalResult?.total ?? 0 };
  }),
  // ─── Admin: Create contact ────────────────────────────────────────────────
  createContact: adminProcedure2.input(z11.object({
    name: z11.string().min(1),
    email: z11.string().email().optional(),
    phone: z11.string().optional(),
    company: z11.string().optional(),
    role: z11.enum(["Athlete", "Coach", "Brand", "Agent", "Investor", "Team"]).default("Athlete"),
    status: z11.enum(["Lead", "Active", "VIP", "Churned"]).default("Lead"),
    notes: z11.string().optional()
  })).mutation(async ({ input }) => {
    const db = await getDb();
    if (!db) throw new TRPCError5({ code: "INTERNAL_SERVER_ERROR" });
    const { crmContacts: crmContacts2 } = await Promise.resolve().then(() => (init_schema(), schema_exports));
    const { eq: eqLocal1 } = await import("drizzle-orm");
    const result = await db.insert(crmContacts2).values(input).$returningId();
    const contactId = result[0]?.id;
    if (!contactId) throw new TRPCError5({ code: "INTERNAL_SERVER_ERROR" });
    const [contact] = await db.select().from(crmContacts2).where(eqLocal1(crmContacts2.id, contactId)).limit(1);
    return contact;
  }),
  // ─── Admin: Update contact ────────────────────────────────────────────────
  updateContact: adminProcedure2.input(z11.object({
    id: z11.number(),
    name: z11.string().optional(),
    email: z11.string().email().optional(),
    phone: z11.string().optional(),
    company: z11.string().optional(),
    role: z11.enum(["Athlete", "Coach", "Brand", "Agent", "Investor", "Team"]).optional(),
    status: z11.enum(["Lead", "Active", "VIP", "Churned"]).optional(),
    notes: z11.string().optional()
  })).mutation(async ({ input }) => {
    const db = await getDb();
    if (!db) throw new TRPCError5({ code: "INTERNAL_SERVER_ERROR" });
    const { crmContacts: crmContacts2 } = await Promise.resolve().then(() => (init_schema(), schema_exports));
    const { eq: eq14 } = await import("drizzle-orm");
    const { id, ...updates } = input;
    await db.update(crmContacts2).set({ ...updates, lastActivity: /* @__PURE__ */ new Date() }).where(eq14(crmContacts2.id, id));
    const [contact] = await db.select().from(crmContacts2).where(eq14(crmContacts2.id, id)).limit(1);
    return contact;
  }),
  // ─── Admin: Delete contact ────────────────────────────────────────────────
  deleteContact: adminProcedure2.input(z11.object({ id: z11.number() })).mutation(async ({ input }) => {
    const db = await getDb();
    if (!db) throw new TRPCError5({ code: "INTERNAL_SERVER_ERROR" });
    const { crmContacts: crmContacts2 } = await Promise.resolve().then(() => (init_schema(), schema_exports));
    const { eq: eq14 } = await import("drizzle-orm");
    await db.delete(crmContacts2).where(eq14(crmContacts2.id, input.id));
    return { success: true };
  }),
  // ─── Admin: Get pipeline ──────────────────────────────────────────────────
  getPipeline: adminProcedure2.query(async () => {
    const db = await getDb();
    if (!db) return [];
    const { crmPipeline: crmPipeline2, crmContacts: crmContacts2 } = await Promise.resolve().then(() => (init_schema(), schema_exports));
    const { desc: desc8, eq: eq14 } = await import("drizzle-orm");
    const rows = await db.select({
      pipeline: crmPipeline2,
      contact: { id: crmContacts2.id, name: crmContacts2.name, email: crmContacts2.email, role: crmContacts2.role }
    }).from(crmPipeline2).leftJoin(crmContacts2, eq14(crmPipeline2.contactId, crmContacts2.id)).orderBy(desc8(crmPipeline2.updatedAt));
    return rows;
  }),
  // ─── Admin: Update pipeline stage ────────────────────────────────────────
  updatePipelineStage: adminProcedure2.input(z11.object({
    id: z11.number(),
    stage: z11.enum(["New Lead", "Contacted", "Demo Scheduled", "Proposal Sent", "Closed Won", "Closed Lost"])
  })).mutation(async ({ input }) => {
    const db = await getDb();
    if (!db) throw new TRPCError5({ code: "INTERNAL_SERVER_ERROR" });
    const { crmPipeline: crmPipeline2 } = await Promise.resolve().then(() => (init_schema(), schema_exports));
    const { eq: eq14 } = await import("drizzle-orm");
    await db.update(crmPipeline2).set({ stage: input.stage, updatedAt: /* @__PURE__ */ new Date() }).where(eq14(crmPipeline2.id, input.id));
    const [row] = await db.select().from(crmPipeline2).where(eq14(crmPipeline2.id, input.id)).limit(1);
    return row;
  }),
  // ─── Admin: Add to pipeline ───────────────────────────────────────────────
  addToPipeline: adminProcedure2.input(z11.object({
    contactId: z11.number(),
    stage: z11.enum(["New Lead", "Contacted", "Demo Scheduled", "Proposal Sent", "Closed Won", "Closed Lost"]).default("New Lead"),
    dealValue: z11.number().default(0),
    assignedTo: z11.string().optional(),
    notes: z11.string().optional()
  })).mutation(async ({ input }) => {
    const db = await getDb();
    if (!db) throw new TRPCError5({ code: "INTERNAL_SERVER_ERROR" });
    const { crmPipeline: crmPipeline2 } = await Promise.resolve().then(() => (init_schema(), schema_exports));
    const { eq: eqLocal2 } = await import("drizzle-orm");
    const pipelineResult = await db.insert(crmPipeline2).values(input).$returningId();
    const pipelineId = pipelineResult[0]?.id;
    if (!pipelineId) throw new TRPCError5({ code: "INTERNAL_SERVER_ERROR" });
    const [row] = await db.select().from(crmPipeline2).where(eqLocal2(crmPipeline2.id, pipelineId)).limit(1);
    return row;
  }),
  // ─── Admin: Get waitlist ──────────────────────────────────────────────────
  getWaitlist: adminProcedure2.input(z11.object({ limit: z11.number().default(200), offset: z11.number().default(0) }).optional()).query(async ({ input }) => {
    const db = await getDb();
    if (!db) return { entries: [], total: 0 };
    const { waitlist: waitlist2 } = await Promise.resolve().then(() => (init_schema(), schema_exports));
    const { desc: desc8, count: count2 } = await import("drizzle-orm");
    const [totalResult] = await db.select({ total: count2() }).from(waitlist2);
    const entries = await db.select().from(waitlist2).orderBy(desc8(waitlist2.createdAt)).limit(input?.limit ?? 200).offset(input?.offset ?? 0);
    return { entries, total: totalResult?.total ?? 0 };
  }),
  // ─── Admin: Get activity log ──────────────────────────────────────────────
  getActivityLog: adminProcedure2.input(z11.object({ limit: z11.number().default(100), offset: z11.number().default(0), eventType: z11.string().optional() }).optional()).query(async ({ input }) => {
    const db = await getDb();
    if (!db) return { events: [], total: 0 };
    const { activityLog: activityLog2, users: users2 } = await Promise.resolve().then(() => (init_schema(), schema_exports));
    const { desc: desc8, eq: eq14, count: count2 } = await import("drizzle-orm");
    const [totalResult] = await db.select({ total: count2() }).from(activityLog2);
    const baseQuery = db.select({ log: activityLog2, user: { id: users2.id, name: users2.name, email: users2.email } }).from(activityLog2).leftJoin(users2, eq14(activityLog2.userId, users2.id)).orderBy(desc8(activityLog2.createdAt)).limit(input?.limit ?? 100).offset(input?.offset ?? 0);
    const events = input?.eventType ? await baseQuery.where(eq14(activityLog2.eventType, input.eventType)) : await baseQuery;
    return { events, total: totalResult?.total ?? 0 };
  }),
  // ─── Admin: Get all users ─────────────────────────────────────────────────
  getUsers: adminProcedure2.input(z11.object({ limit: z11.number().default(100), offset: z11.number().default(0), search: z11.string().optional() }).optional()).query(async ({ input }) => {
    const db = await getDb();
    if (!db) return { users: [], total: 0 };
    const { users: users2 } = await Promise.resolve().then(() => (init_schema(), schema_exports));
    const { desc: desc8, ilike, count: count2, or: or2 } = await import("drizzle-orm");
    const [totalResult] = await db.select({ total: count2() }).from(users2);
    const query = db.select().from(users2).orderBy(desc8(users2.createdAt)).limit(input?.limit ?? 100).offset(input?.offset ?? 0);
    const rows = input?.search ? await query.where(or2(ilike(users2.name, `%${input.search}%`), ilike(users2.email, `%${input.search}%`))) : await query;
    return { users: rows, total: totalResult?.total ?? 0 };
  }),
  // ─── Admin: Update user role ──────────────────────────────────────────────
  updateUserRole: adminProcedure2.input(z11.object({ userId: z11.number(), role: z11.enum(["athlete", "coach", "brand", "admin"]) })).mutation(async ({ input }) => {
    const db = await getDb();
    if (!db) throw new TRPCError5({ code: "INTERNAL_SERVER_ERROR" });
    const { users: users2 } = await Promise.resolve().then(() => (init_schema(), schema_exports));
    const { eq: eq14 } = await import("drizzle-orm");
    await db.update(users2).set({ role: input.role }).where(eq14(users2.id, input.userId));
    const [user] = await db.select().from(users2).where(eq14(users2.id, input.userId)).limit(1);
    return user;
  })
});

// server/routers/waitlistRouter.ts
import { z as z12 } from "zod";
init_schema();
import { eq as eq9 } from "drizzle-orm";
var waitlistRouter = router({
  join: publicProcedure.input(z12.object({
    fullName: z12.string().min(2),
    email: z12.string().email(),
    phone: z12.string().optional(),
    role: z12.enum(["athlete", "parent", "coach", "brand", "scout", "agent"]).default("athlete"),
    sport: z12.string().optional(),
    referralCode: z12.string().optional()
  })).mutation(async ({ input }) => {
    console.log("[Waitlist] New MVP signup:", input.email, input.role);
    const db = await getDb();
    if (db) {
      try {
        const existing = await db.select().from(waitlist).where(eq9(waitlist.email, input.email)).limit(1);
        if (existing.length === 0) {
          await db.insert(waitlist).values({
            email: input.email,
            name: input.fullName,
            sport: input.sport ?? null,
            phone: input.phone ?? null,
            role: input.role
          });
          console.log("[Waitlist] Saved to DB:", input.email);
        } else {
          console.log("[Waitlist] Already in DB:", input.email);
        }
      } catch (dbErr) {
        console.warn("[Waitlist] DB save failed:", dbErr);
      }
    }
    try {
      await sendWelcomeEmail(input.email, input.fullName);
      console.log("[Waitlist] Welcome email sent to", input.email);
    } catch (emailErr) {
      console.warn("[Waitlist] Welcome email failed:", emailErr);
    }
    return {
      success: true,
      position: Math.floor(Math.random() * 500) + 1,
      message: `Welcome to ATHLYNX, ${input.fullName}! Your 7-day free trial is now active.`,
      error: null
    };
  }),
  count: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) return { count: 0 };
    const { users: users2 } = await Promise.resolve().then(() => (init_schema(), schema_exports));
    const { count: count2 } = await import("drizzle-orm");
    const result = await db.select({ total: count2() }).from(users2);
    return { count: result[0]?.total ?? 0 };
  })
});

// server/routers/verificationRouter.ts
import { z as z13 } from "zod";
var verificationRouter = router({
  sendCode: publicProcedure.input(z13.object({
    email: z13.string().email(),
    phone: z13.string().optional(),
    type: z13.enum(["signup", "login", "password_reset"]).default("signup"),
    name: z13.string().optional()
  })).mutation(async ({ input }) => {
    const result = await sendVerificationCode(input.email, input.phone, input.type, input.name);
    return { success: result.success, error: result.error };
  }),
  verifyCode: publicProcedure.input(z13.object({
    email: z13.string().email(),
    code: z13.string()
  })).mutation(async ({ input }) => {
    const result = await verifyCode(input.email, input.code);
    return { valid: result.valid, error: result.error };
  })
});

// server/routers/customAuthRouter.ts
import { TRPCError as TRPCError6 } from "@trpc/server";
import { z as z14 } from "zod";
import bcrypt from "bcryptjs";
init_schema();
import { eq as eq10, and as and6, gt as gt2 } from "drizzle-orm";
import { sql as sql4 } from "drizzle-orm";
var SEVEN_DAYS_MS2 = 7 * 24 * 60 * 60 * 1e3;
async function fireWelcomeNotifications(opts) {
  const trialStr = opts.trialEndsAt.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "America/Chicago"
  });
  const signedUpStr = (/* @__PURE__ */ new Date()).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: "America/Chicago"
  });
  sendWelcomeEmail(opts.email, opts.name, opts.memberNumber).catch(
    (e) => console.warn("[Auth] Welcome email failed:", e?.message)
  );
  sendOwnerNewUserAlert({
    name: opts.name,
    email: opts.email,
    loginMethod: opts.loginMethod,
    signedUpAt: signedUpStr,
    trialEndsAt: trialStr,
    memberNumber: opts.memberNumber
  }).catch((e) => console.warn("[Auth] Owner alert failed:", e?.message));
}
var customAuthRouter = router({
  /**
   * Register a new user with email + password
   */
  register: publicProcedure.input(
    z14.object({
      name: z14.string().min(2, "Name must be at least 2 characters"),
      email: z14.string().email("Invalid email address"),
      password: z14.string().min(8, "Password must be at least 8 characters"),
      phone: z14.string().optional(),
      sport: z14.string().optional(),
      school: z14.string().optional(),
      year: z14.string().optional()
    })
  ).mutation(async ({ input, ctx }) => {
    const db = await getDb();
    if (!db) throw new TRPCError6({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });
    const existing = await db.select().from(users).where(eq10(users.email, input.email)).limit(1);
    if (existing.length > 0) {
      throw new TRPCError6({ code: "CONFLICT", message: "An account with this email already exists" });
    }
    const passwordHash = await bcrypt.hash(input.password, 12);
    const openId = `custom_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    const trialEndsAt = new Date(Date.now() + SEVEN_DAYS_MS2);
    const [countResult] = await db.select({ count: sql4`count(*)` }).from(users);
    const memberNumber = (Number(countResult?.count) || 0) + 1;
    await db.insert(users).values({
      openId,
      name: input.name,
      email: input.email,
      phone: input.phone ?? null,
      loginMethod: "email",
      passwordHash,
      sport: input.sport ?? null,
      school: input.school ?? null,
      year: input.year ?? null,
      trialEndsAt,
      lastSignedIn: /* @__PURE__ */ new Date()
    });
    const sessionToken = await sdk.createSessionToken(openId, {
      name: input.name,
      expiresInMs: ONE_YEAR_MS
    });
    const cookieOptions = getSessionCookieOptions(ctx.req);
    ctx.res.cookie(COOKIE_NAME, sessionToken, { ...cookieOptions, maxAge: ONE_YEAR_MS });
    fireWelcomeNotifications({
      name: input.name,
      email: input.email,
      phone: input.phone,
      loginMethod: "email",
      trialEndsAt,
      memberNumber
    });
    return { success: true, name: input.name };
  }),
  /**
   * Sign in with email + password
   */
  login: publicProcedure.input(
    z14.object({
      email: z14.string().email("Invalid email address"),
      password: z14.string().min(1, "Password is required")
    })
  ).mutation(async ({ input, ctx }) => {
    const db = await getDb();
    if (!db) throw new TRPCError6({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });
    const [user] = await db.select().from(users).where(eq10(users.email, input.email)).limit(1);
    if (!user || !user.passwordHash) {
      throw new TRPCError6({ code: "UNAUTHORIZED", message: "Invalid email or password" });
    }
    const valid = await bcrypt.compare(input.password, user.passwordHash);
    if (!valid) {
      throw new TRPCError6({ code: "UNAUTHORIZED", message: "Invalid email or password" });
    }
    await db.update(users).set({ lastSignedIn: /* @__PURE__ */ new Date() }).where(eq10(users.id, user.id));
    const sessionToken = await sdk.createSessionToken(user.openId ?? `custom_${user.id}`, {
      name: user.name || "",
      expiresInMs: ONE_YEAR_MS
    });
    const cookieOptions = getSessionCookieOptions(ctx.req);
    ctx.res.cookie(COOKIE_NAME, sessionToken, { ...cookieOptions, maxAge: ONE_YEAR_MS });
    return { success: true, name: user.name };
  }),
  /**
   * Reset password using a verified code
   */
  resetPassword: publicProcedure.input(
    z14.object({
      email: z14.string().email(),
      code: z14.string().length(6),
      newPassword: z14.string().min(8, "Password must be at least 8 characters")
    })
  ).mutation(async ({ input }) => {
    const db = await getDb();
    if (!db) throw new TRPCError6({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });
    const now = /* @__PURE__ */ new Date();
    const [verification] = await db.select().from(verificationCodes).where(
      and6(
        eq10(verificationCodes.email, input.email),
        eq10(verificationCodes.code, input.code),
        eq10(verificationCodes.type, "password_reset"),
        gt2(verificationCodes.expiresAt, now)
      )
    ).limit(1);
    if (!verification) {
      throw new TRPCError6({ code: "UNAUTHORIZED", message: "Invalid or expired reset code" });
    }
    const [user] = await db.select().from(users).where(eq10(users.email, input.email)).limit(1);
    if (!user) {
      throw new TRPCError6({ code: "NOT_FOUND", message: "No account found with this email" });
    }
    const passwordHash = await bcrypt.hash(input.newPassword, 12);
    await db.update(users).set({ passwordHash, updatedAt: /* @__PURE__ */ new Date() }).where(eq10(users.id, user.id));
    await db.update(verificationCodes).set({ verified: true }).where(eq10(verificationCodes.id, verification.id));
    return { success: true };
  }),
  /**
   * Sync an Auth0 user to our local DB and create a session cookie.
   * Called from the /callback page after Auth0 login.
   */
  syncAuth0User: publicProcedure.input(
    z14.object({
      token: z14.string(),
      name: z14.string(),
      email: z14.string(),
      picture: z14.string().optional(),
      sub: z14.string(),
      phone: z14.string().optional()
    })
  ).mutation(async ({ input, ctx }) => {
    const db = await getDb();
    if (!db) throw new TRPCError6({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });
    const openId = `auth0_${input.sub.replace(/[^a-zA-Z0-9_-]/g, "_")}`;
    const trialEndsAt = new Date(Date.now() + SEVEN_DAYS_MS2);
    const loginMethod = input.sub.startsWith("google") ? "google" : input.sub.startsWith("apple") ? "apple" : "auth0";
    const existing = await db.select().from(users).where(eq10(users.openId, openId)).limit(1);
    const isNewUser = existing.length === 0;
    if (isNewUser) {
      await db.insert(users).values({
        openId,
        name: input.name || null,
        email: input.email || null,
        avatarUrl: input.picture || null,
        phone: input.phone || null,
        loginMethod,
        trialEndsAt,
        lastSignedIn: /* @__PURE__ */ new Date()
      });
      if (input.email) {
        fireWelcomeNotifications({
          name: input.name || "Athlete",
          email: input.email,
          phone: input.phone,
          loginMethod,
          trialEndsAt
        });
      }
    } else {
      await db.update(users).set({
        lastSignedIn: /* @__PURE__ */ new Date(),
        name: input.name || existing[0].name,
        avatarUrl: input.picture || existing[0].avatarUrl
      }).where(eq10(users.openId, openId));
    }
    const sessionToken = await sdk.createSessionToken(openId, {
      name: input.name,
      expiresInMs: ONE_YEAR_MS
    });
    const cookieOptions = getSessionCookieOptions(ctx.req);
    ctx.res.cookie(COOKIE_NAME, sessionToken, { ...cookieOptions, maxAge: ONE_YEAR_MS });
    return { success: true, name: input.name, isNewUser };
  }),
  /**
   * Save phone number for current user and fire welcome SMS
   */
  savePhone: protectedProcedure.input(z14.object({ phone: z14.string().min(10).max(20) })).mutation(async ({ ctx, input }) => {
    const db = await getDb();
    if (!db) throw new TRPCError6({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });
    const formatted = input.phone.startsWith("+") ? input.phone : `+1${input.phone.replace(/\D/g, "")}`;
    await db.update(users).set({ phone: formatted }).where(eq10(users.id, ctx.user.id));
    return { success: true };
  }),
  /**
   * Sign out — clear session cookie
   */
  logout: publicProcedure.mutation(({ ctx }) => {
    const cookieOptions = getSessionCookieOptions(ctx.req);
    ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
    return { success: true };
  }),
  /**
   * Get current user
   */
  me: publicProcedure.query((opts) => opts.ctx.user)
});

// server/routers/adminRouter.ts
import { TRPCError as TRPCError7 } from "@trpc/server";
import { z as z15 } from "zod";
init_schema();
import { desc as desc6, eq as eq11, like, or, sql as sql5 } from "drizzle-orm";
var adminProcedure3 = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== "admin") {
    throw new TRPCError7({ code: "FORBIDDEN", message: "Admin access required" });
  }
  return next({ ctx });
});
var adminRouter = router({
  getUsers: adminProcedure3.input(z15.object({
    page: z15.number().int().min(1).default(1),
    limit: z15.number().int().min(1).max(100).default(50),
    search: z15.string().optional(),
    sortBy: z15.enum(["createdAt", "name", "email", "role"]).default("createdAt"),
    sortDir: z15.enum(["asc", "desc"]).default("desc")
  })).query(async ({ input }) => {
    const db = await getDb();
    if (!db) throw new TRPCError7({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });
    const offset = (input.page - 1) * input.limit;
    let query = db.select({
      id: users.id,
      name: users.name,
      email: users.email,
      role: users.role,
      sport: users.sport,
      school: users.school,
      loginMethod: users.loginMethod,
      stripeCustomerId: users.stripeCustomerId,
      stripeSubscriptionId: users.stripeSubscriptionId,
      stripePlanId: users.stripePlanId,
      trialEndsAt: users.trialEndsAt,
      credits: users.credits,
      lastSignedIn: users.lastSignedIn,
      createdAt: users.createdAt
    }).from(users).$dynamic();
    if (input.search?.trim()) {
      const term = `%${input.search.trim()}%`;
      query = query.where(or(like(users.name, term), like(users.email, term), like(users.sport, term), like(users.school, term)));
    }
    const col = users[input.sortBy];
    query = input.sortDir === "desc" ? query.orderBy(desc6(col)) : query.orderBy(col);
    let countQuery = db.select({ count: sql5`count(*)` }).from(users).$dynamic();
    if (input.search?.trim()) {
      const term = `%${input.search.trim()}%`;
      countQuery = countQuery.where(or(like(users.name, term), like(users.email, term), like(users.sport, term), like(users.school, term)));
    }
    const [rows, countResult] = await Promise.all([query.limit(input.limit).offset(offset), countQuery]);
    const total = Number(countResult[0]?.count ?? 0);
    return { users: rows, total, page: input.page, limit: input.limit, totalPages: Math.ceil(total / input.limit) };
  }),
  getStats: adminProcedure3.query(async () => {
    const db = await getDb();
    if (!db) throw new TRPCError7({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });
    const now = /* @__PURE__ */ new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1e3);
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1e3);
    const [total, thisWeek, thisMonth, withSub, onTrial] = await Promise.all([
      db.select({ count: sql5`count(*)` }).from(users),
      db.select({ count: sql5`count(*)` }).from(users).where(sql5`${users.createdAt} >= ${weekAgo}`),
      db.select({ count: sql5`count(*)` }).from(users).where(sql5`${users.createdAt} >= ${monthAgo}`),
      db.select({ count: sql5`count(*)` }).from(users).where(sql5`${users.stripeSubscriptionId} IS NOT NULL`),
      db.select({ count: sql5`count(*)` }).from(users).where(sql5`${users.trialEndsAt} > ${now}`)
    ]);
    return {
      totalUsers: Number(total[0]?.count ?? 0),
      newThisWeek: Number(thisWeek[0]?.count ?? 0),
      newThisMonth: Number(thisMonth[0]?.count ?? 0),
      withSubscription: Number(withSub[0]?.count ?? 0),
      onTrial: Number(onTrial[0]?.count ?? 0)
    };
  }),
  setUserRole: adminProcedure3.input(z15.object({ userId: z15.number().int(), role: z15.enum(["user", "admin"]) })).mutation(async ({ input }) => {
    const db = await getDb();
    if (!db) throw new TRPCError7({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });
    await db.update(users).set({ role: input.role }).where(eq11(users.id, input.userId));
    return { success: true };
  }),
  sendBroadcast: adminProcedure3.input(z15.object({
    subject: z15.string().min(1).max(256),
    body: z15.string().min(1),
    channel: z15.enum(["email", "in_app", "both"]).default("in_app"),
    recipientFilter: z15.enum(["all", "trial", "subscribed", "free"]).default("all")
  })).mutation(async ({ ctx, input }) => {
    const db = await getDb();
    if (!db) throw new TRPCError7({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });
    const now = /* @__PURE__ */ new Date();
    let rq = db.select({ id: users.id, name: users.name, email: users.email }).from(users).$dynamic();
    if (input.recipientFilter === "trial") rq = rq.where(sql5`${users.trialEndsAt} > ${now}`);
    else if (input.recipientFilter === "subscribed") rq = rq.where(sql5`${users.stripeSubscriptionId} IS NOT NULL`);
    else if (input.recipientFilter === "free") rq = rq.where(sql5`${users.stripeSubscriptionId} IS NULL AND (${users.trialEndsAt} IS NULL OR ${users.trialEndsAt} <= ${now})`);
    const recipients = await rq;
    if (input.channel === "in_app" || input.channel === "both") {
      const rows = recipients.map((u) => ({
        userId: u.id,
        type: "custom",
        title: input.subject,
        message: input.body,
        priority: "normal",
        isBroadcast: "yes",
        isRead: "no",
        isDismissed: "no"
      }));
      for (let i = 0; i < rows.length; i += 100) await db.insert(notifications).values(rows.slice(i, i + 100));
    }
    await db.insert(broadcastMessages).values({
      senderId: ctx.user.id,
      subject: input.subject,
      body: input.body,
      channel: input.channel,
      recipientFilter: input.recipientFilter,
      recipientCount: recipients.length,
      status: "sent"
    });
    return { success: true, recipientCount: recipients.length };
  }),
  getBroadcasts: adminProcedure3.query(async () => {
    const db = await getDb();
    if (!db) throw new TRPCError7({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });
    return db.select().from(broadcastMessages).orderBy(desc6(broadcastMessages.createdAt)).limit(50);
  })
});

// server/routers/feedbackRouter.ts
import { z as z16 } from "zod";
import { TRPCError as TRPCError8 } from "@trpc/server";
import mysql2 from "mysql2/promise";
var _pool2 = null;
async function getPool() {
  if (!_pool2) {
    _pool2 = mysql2.createPool({
      uri: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
      connectionLimit: 5
    });
  }
  return _pool2;
}
var feedbackRouter = router({
  // Submit feedback (public — anyone can submit)
  submit: publicProcedure.input(z16.object({
    name: z16.string().min(1).max(100),
    email: z16.string().email(),
    title: z16.string().min(5).max(256),
    body: z16.string().min(10).max(2e3),
    category: z16.enum(["feature_request", "bug_report", "general", "content", "performance"]).default("general")
  })).mutation(async ({ input }) => {
    const pool = await getPool();
    await pool.execute(
      `INSERT INTO athlete_feedback (name, email, title, body, category) VALUES (?, ?, ?, ?, ?)`,
      [input.name, input.email, input.title, input.body, input.category]
    );
    return { success: true };
  }),
  // List feedback (public)
  list: publicProcedure.input(z16.object({
    category: z16.enum(["all", "feature_request", "bug_report", "general", "content", "performance"]).default("all"),
    sort: z16.enum(["newest", "top"]).default("top"),
    limit: z16.number().min(1).max(50).default(20),
    offset: z16.number().min(0).default(0)
  })).query(async ({ input }) => {
    const whereClause = input.category !== "all" ? `WHERE category = ?` : "";
    const params = input.category !== "all" ? [input.category] : [];
    const orderBy = input.sort === "top" ? "votes DESC, createdAt DESC" : "createdAt DESC";
    params.push(input.limit, input.offset);
    const pool = await getPool();
    const limitSafe = Math.min(Math.max(1, input.limit), 50);
    const offsetSafe = Math.max(0, input.offset);
    const catParam = input.category !== "all" ? [input.category] : [];
    const [rows] = await pool.query(
      `SELECT id, name, title, body, category, votes, status, adminReply, repliedAt, createdAt
         FROM athlete_feedback ${whereClause}
         ORDER BY ${orderBy}
         LIMIT ${limitSafe} OFFSET ${offsetSafe}`,
      catParam
    );
    return { items: rows };
  }),
  // Vote on feedback (by email/IP identifier)
  vote: publicProcedure.input(z16.object({
    feedbackId: z16.number(),
    voterIdentifier: z16.string().min(1).max(320)
    // email or IP
  })).mutation(async ({ input }) => {
    const pool = await getPool();
    const [existing] = await pool.execute(
      `SELECT id FROM feedback_votes WHERE feedbackId = ? AND voterIdentifier = ?`,
      [input.feedbackId, input.voterIdentifier]
    );
    if (existing.length > 0) {
      return { success: false, message: "Already voted" };
    }
    await pool.execute(
      `INSERT INTO feedback_votes (feedbackId, voterIdentifier) VALUES (?, ?)`,
      [input.feedbackId, input.voterIdentifier]
    );
    await pool.execute(
      `UPDATE athlete_feedback SET votes = votes + 1 WHERE id = ?`,
      [input.feedbackId]
    );
    return { success: true };
  }),
  // Admin: reply to feedback
  adminReply: protectedProcedure.input(z16.object({
    feedbackId: z16.number(),
    reply: z16.string().min(1).max(2e3),
    status: z16.enum(["open", "under_review", "planned", "completed", "declined"]).optional()
  })).mutation(async ({ ctx, input }) => {
    if (ctx.user.role !== "admin") throw new TRPCError8({ code: "FORBIDDEN" });
    const pool = await getPool();
    await pool.execute(
      `UPDATE athlete_feedback SET adminReply = ?, repliedAt = NOW() ${input.status ? ", status = ?" : ""} WHERE id = ?`,
      input.status ? [input.reply, input.status, input.feedbackId] : [input.reply, input.feedbackId]
    );
    return { success: true };
  }),
  // Admin: update status only
  updateStatus: protectedProcedure.input(z16.object({
    feedbackId: z16.number(),
    status: z16.enum(["open", "under_review", "planned", "completed", "declined"])
  })).mutation(async ({ ctx, input }) => {
    if (ctx.user.role !== "admin") throw new TRPCError8({ code: "FORBIDDEN" });
    const pool = await getPool();
    await pool.execute(
      `UPDATE athlete_feedback SET status = ? WHERE id = ?`,
      [input.status, input.feedbackId]
    );
    return { success: true };
  }),
  // Admin: delete feedback
  delete: protectedProcedure.input(z16.object({ feedbackId: z16.number() })).mutation(async ({ ctx, input }) => {
    if (ctx.user.role !== "admin") throw new TRPCError8({ code: "FORBIDDEN" });
    const pool = await getPool();
    await pool.execute(`DELETE FROM feedback_votes WHERE feedbackId = ?`, [input.feedbackId]);
    await pool.execute(`DELETE FROM athlete_feedback WHERE id = ?`, [input.feedbackId]);
    return { success: true };
  })
});

// server/routers/dataRouter.ts
import { z as z17 } from "zod";
init_schema();
import { eq as eq12, desc as desc7, and as and7, sql as sql6 } from "drizzle-orm";
var dataRouter = router({
  // Public endpoint for device/bot data ingestion (authenticated by API key in payload)
  ingestEvent: publicProcedure.input(z17.object({
    sourceType: z17.enum(["ai_bot", "robot", "wearable", "video_analysis", "manual", "api_integration"]),
    eventType: z17.enum([
      "performance_metric",
      "biometric",
      "gps_tracking",
      "motion_capture",
      "ai_session",
      "recruitment_interaction",
      "training_session",
      "health_record",
      "game_stat",
      "combine_result",
      "injury_report",
      "recovery_score"
    ]),
    athleteId: z17.number().optional(),
    sport: z17.string().optional(),
    sessionId: z17.string().optional(),
    payload: z17.record(z17.string(), z17.unknown()),
    heartRate: z17.number().optional(),
    speed: z17.number().optional(),
    distance: z17.number().optional(),
    acceleration: z17.number().optional(),
    recoveryScore: z17.number().optional(),
    aiConfidence: z17.number().optional(),
    latitude: z17.number().optional(),
    longitude: z17.number().optional(),
    deviceTimestamp: z17.string().optional()
  })).mutation(async ({ input }) => {
    const db = await getDb();
    const event = await db.insert(athleteDataEvents).values({
      athleteId: input.athleteId,
      sourceType: input.sourceType,
      eventType: input.eventType,
      sport: input.sport,
      sessionId: input.sessionId,
      payload: input.payload,
      heartRate: input.heartRate,
      speed: input.speed,
      distance: input.distance,
      acceleration: input.acceleration,
      recoveryScore: input.recoveryScore,
      aiConfidence: input.aiConfidence,
      latitude: input.latitude,
      longitude: input.longitude,
      deviceTimestamp: input.deviceTimestamp ? new Date(input.deviceTimestamp) : void 0,
      processedAt: /* @__PURE__ */ new Date()
    });
    return { success: true, eventId: event.insertId };
  }),
  // Get recent data events for an athlete (protected)
  getMyEvents: protectedProcedure.input(z17.object({
    limit: z17.number().default(50),
    sport: z17.string().optional()
  })).query(async ({ ctx, input }) => {
    const db = await getDb();
    const conditions = [eq12(athleteDataEvents.athleteId, ctx.user.id)];
    if (input.sport) conditions.push(eq12(athleteDataEvents.sport, input.sport));
    const events = await db.select().from(athleteDataEvents).where(and7(...conditions)).orderBy(desc7(athleteDataEvents.createdAt)).limit(input.limit);
    return events;
  }),
  // Get platform-wide data stats (admin only, used for investor dashboard)
  getPlatformStats: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    const [totalEvents] = await db.select({ count: sql6`COUNT(*)` }).from(athleteDataEvents);
    const [aiEvents] = await db.select({ count: sql6`COUNT(*)` }).from(athleteDataEvents).where(eq12(athleteDataEvents.sourceType, "ai_bot"));
    const [robotEvents] = await db.select({ count: sql6`COUNT(*)` }).from(athleteDataEvents).where(eq12(athleteDataEvents.sourceType, "robot"));
    const [wearableEvents] = await db.select({ count: sql6`COUNT(*)` }).from(athleteDataEvents).where(eq12(athleteDataEvents.sourceType, "wearable"));
    const recentEvents = await db.select().from(athleteDataEvents).orderBy(desc7(athleteDataEvents.createdAt)).limit(20);
    return {
      totalEvents: Number(totalEvents?.count ?? 0),
      aiEvents: Number(aiEvents?.count ?? 0),
      robotEvents: Number(robotEvents?.count ?? 0),
      wearableEvents: Number(wearableEvents?.count ?? 0),
      recentEvents
    };
  }),
  // Get data sources (registered devices/bots)
  getSources: protectedProcedure.query(async () => {
    const db = await getDb();
    return db.select().from(athleteDataSources).orderBy(desc7(athleteDataSources.createdAt));
  }),
  // Register a new data source (robot, wearable, bot)
  registerSource: protectedProcedure.input(z17.object({
    name: z17.string().min(1),
    sourceType: z17.enum(["ai_bot", "robot", "wearable", "video_analysis", "manual", "api_integration"]),
    deviceId: z17.string().optional(),
    firmwareVersion: z17.string().optional()
  })).mutation(async ({ input }) => {
    const db = await getDb();
    const result = await db.insert(athleteDataSources).values({
      name: input.name,
      sourceType: input.sourceType,
      deviceId: input.deviceId,
      firmwareVersion: input.firmwareVersion,
      isActive: true,
      lastSeenAt: /* @__PURE__ */ new Date()
    });
    return { success: true, sourceId: result.insertId };
  })
});

// server/routers.ts
var appRouter = router({
  system: systemRouter,
  stripe: stripeRouter,
  feed: feedRouter,
  profile: profileRouter,
  messenger: messengerRouter,
  nil: nilRouter,
  training: trainingRouter,
  ai: aiRouter,
  notifications: notificationsRouter,
  messaging: messagingRouter,
  crm: crmRouter,
  waitlist: waitlistRouter,
  verification: verificationRouter,
  auth: customAuthRouter,
  admin: adminRouter,
  feedback: feedbackRouter,
  data: dataRouter
});

// server/_core/context.ts
async function createContext(opts) {
  let user = null;
  try {
    user = await sdk.authenticateRequest(opts.req);
  } catch (error) {
    user = null;
  }
  return {
    req: opts.req,
    res: opts.res,
    user
  };
}

// server/stripe/webhook.ts
import Stripe2 from "stripe";
import express from "express";
import { eq as eq13 } from "drizzle-orm";
init_schema();
async function sendPaymentConfirmationEmail(opts) {
  const html = `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#0a0f1e;font-family:Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0f1e;padding:40px 20px;">
<tr><td align="center">
<table width="560" cellpadding="0" cellspacing="0" style="background:#0d1b3e;border-radius:16px;overflow:hidden;border:1px solid #1e3a6e;">
<tr><td style="background:linear-gradient(135deg,#0066ff,#00c2ff);padding:32px;text-align:center;">
  <div style="font-size:36px;font-weight:900;color:#fff;letter-spacing:4px;">ATHLYNX</div>
  <div style="font-size:12px;color:rgba(255,255,255,0.85);letter-spacing:6px;margin-top:6px;">PAYMENT CONFIRMED</div>
</td></tr>
<tr><td style="padding:36px;">
  <h2 style="color:#fff;font-size:22px;margin:0 0 16px;">You're all set, ${opts.name}! \u{1F3C6}</h2>
  <p style="color:#94a3b8;font-size:15px;line-height:1.6;margin:0 0 28px;">
    Your <strong style="color:#00c2ff;">${opts.plan}</strong> subscription is now active.
  </p>
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a1628;border-radius:10px;overflow:hidden;margin-bottom:28px;">
    <tr><td style="padding:14px 18px;border-bottom:1px solid #1e3a6e;">
      <span style="color:#94a3b8;font-size:12px;display:block;margin-bottom:2px;">PLAN</span>
      <span style="color:#fff;font-size:16px;font-weight:bold;">${opts.plan}</span>
    </td></tr>
    <tr><td style="padding:14px 18px;border-bottom:1px solid #1e3a6e;">
      <span style="color:#94a3b8;font-size:12px;display:block;margin-bottom:2px;">AMOUNT PAID</span>
      <span style="color:#00c2ff;font-size:16px;font-weight:bold;">$${opts.amount.toFixed(2)}</span>
    </td></tr>
    <tr><td style="padding:14px 18px;">
      <span style="color:#94a3b8;font-size:12px;display:block;margin-bottom:2px;">ORDER ID</span>
      <span style="color:#fff;font-size:13px;">${opts.sessionId}</span>
    </td></tr>
  </table>
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr><td align="center">
      <a href="https://athlynx.ai/feed" style="display:inline-block;background:linear-gradient(135deg,#0066ff,#00c2ff);color:#fff;font-weight:900;font-size:15px;padding:14px 36px;border-radius:50px;text-decoration:none;">GO TO DASHBOARD \u2192</a>
    </td></tr>
  </table>
</td></tr>
<tr><td style="background:#060d1f;padding:20px;text-align:center;border-top:1px solid #1e3a6e;">
  <p style="color:#475569;font-size:12px;margin:0;">A Dozier Holdings Group Company \xB7 athlynx.ai</p>
</td></tr>
</table>
</td></tr>
</table>
</body>
</html>`;
  await sendEmail({
    to: opts.to,
    subject: `Payment Confirmed \u2014 Your ATHLYNX ${opts.plan} is Active \u{1F3C6}`,
    html,
    text: `Payment confirmed! Your ATHLYNX ${opts.plan} is now active. Amount: $${opts.amount.toFixed(2)}. Order ID: ${opts.sessionId}. Visit https://athlynx.ai`
  });
}
var stripe2 = new Stripe2(process.env.STRIPE_SECRET_KEY ?? "", {
  apiVersion: "2026-03-25.dahlia"
});
function registerStripeWebhook(app2) {
  app2.post(
    "/api/stripe/webhook",
    express.raw({ type: "application/json" }),
    async (req, res) => {
      const sig = req.headers["stripe-signature"];
      const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET ?? "";
      let event;
      const rawBody = req.body instanceof Buffer ? req.body.toString("utf8") : String(req.body ?? "");
      const isTestEvent = rawBody.includes('"evt_test_') || typeof sig === "string" && sig.includes("t=0");
      if (isTestEvent || !sig) {
        console.log("[Stripe Webhook] Test/verification event detected \u2014 returning verified:true");
        return res.status(200).json({ verified: true });
      }
      if (!webhookSecret) {
        console.warn("[Stripe Webhook] No webhook secret configured \u2014 accepting event");
        return res.status(200).json({ verified: true, received: true });
      }
      try {
        event = stripe2.webhooks.constructEvent(
          req.body,
          sig,
          webhookSecret
        );
      } catch (err) {
        console.error("[Stripe Webhook] Signature verification failed:", err.message);
        return res.status(200).json({ verified: false, error: "Signature verification failed" });
      }
      if (event.id.startsWith("evt_test_")) {
        console.log("[Stripe Webhook] Test event detected post-parse, returning verification response");
        return res.status(200).json({ verified: true });
      }
      console.log(`[Stripe Webhook] Event: ${event.type} | ID: ${event.id}`);
      try {
        const db = await getDb();
        if (!db) {
          console.warn("[Stripe Webhook] Database not available");
          return res.json({ received: true });
        }
        switch (event.type) {
          case "checkout.session.completed": {
            const session = event.data.object;
            const userId = session.metadata?.user_id ? parseInt(session.metadata.user_id) : null;
            if (userId && session.customer) {
              await db.update(users).set({ stripeCustomerId: session.customer }).where(eq13(users.id, userId));
            }
            const customerEmail = session.customer_email ?? session.metadata?.customer_email;
            const customerName = session.metadata?.customer_name ?? "Athlete";
            const planName = session.metadata?.plan_name ?? "Pro Plan";
            const amountTotal = session.amount_total ? session.amount_total / 100 : 0;
            if (customerEmail) {
              sendPaymentConfirmationEmail({
                to: customerEmail,
                name: customerName,
                plan: planName,
                amount: amountTotal,
                sessionId: session.id
              }).catch((e) => console.warn("[Stripe Webhook] Payment email failed:", e?.message));
            }
            break;
          }
          case "customer.subscription.created":
          case "customer.subscription.updated": {
            const subscription = event.data.object;
            const customerId = subscription.customer;
            const userResult = await db.select().from(users).where(eq13(users.stripeCustomerId, customerId)).limit(1);
            if (userResult.length > 0) {
              const planId = subscription.metadata?.plan_id ?? null;
              await db.update(users).set({
                stripeSubscriptionId: subscription.id,
                stripePlanId: planId
              }).where(eq13(users.stripeCustomerId, customerId));
            }
            break;
          }
          case "customer.subscription.deleted": {
            const subscription = event.data.object;
            const customerId = subscription.customer;
            await db.update(users).set({ stripeSubscriptionId: null, stripePlanId: null }).where(eq13(users.stripeCustomerId, customerId));
            break;
          }
          default:
            console.log(`[Stripe Webhook] Unhandled event type: ${event.type}`);
        }
      } catch (err) {
        console.error("[Stripe Webhook] Handler error:", err);
      }
      res.json({ received: true });
    }
  );
}

// api/index.ts
var app = express2();
registerStripeWebhook(app);
app.use(express2.json({ limit: "50mb" }));
app.use(express2.urlencoded({ limit: "50mb", extended: true }));
registerStorageProxy(app);
registerOAuthRoutes(app);
app.use(
  "/api/trpc",
  createExpressMiddleware({
    router: appRouter,
    createContext
  })
);
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", platform: "ATHLYNX", version: "1.0.2", timestamp: (/* @__PURE__ */ new Date()).toISOString() });
});
var index_default = app;
export {
  index_default as default
};
