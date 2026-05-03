import {
  pgTable,
  integer,
  varchar,
  text,
  boolean,
  timestamp,
  real,
  pgEnum,
  serial,
  json,
  smallint,
} from "drizzle-orm/pg-core";

// ─── Enums ────────────────────────────────────────────────────────────────────
export const userRoleValues = ["user", "admin"] as const;
export const nilDealStatusValues = ["pending", "active", "completed", "declined"] as const;
export const transferStatusValues = ["entered", "committed", "withdrawn"] as const;
export const verifTypeValues = ["signup", "login", "password_reset"] as const;
export const postTypeValues = ["status", "achievement", "workout", "nil_deal", "announcement", "milestone"] as const;
export const crmContactRoleValues = ["Athlete", "Coach", "Brand", "Agent", "Investor", "Team"] as const;
export const crmContactStatusValues = ["Lead", "Active", "VIP", "Churned"] as const;
export const crmPipelineStageValues = ["New Lead", "Contacted", "Demo Scheduled", "Proposal Sent", "Closed Won", "Closed Lost"] as const;
export const notifTypeValues = ["welcome", "vip_approved", "system_announcement", "custom", "credit_added", "new_feature", "promotion", "reminder", "achievement", "message"] as const;
export const notifPriorityValues = ["low", "normal", "high", "urgent"] as const;
export const postVisibilityValues = ["public", "followers", "private"] as const;
export const postMediaTypeValues = ["none", "image", "video", "gallery"] as const;
export const postSourceValues = ["nil_portal", "diamond_grind", "messenger", "transfer_portal", "faith", "warriors_playbook"] as const;
export const msgTypeValues = ["text", "image", "video", "file", "workout", "achievement", "system"] as const;
export const convTypeValues = ["direct", "group"] as const;
export const convParticipantRoleValues = ["member", "admin"] as const;

// PG Enums
export const userRoleEnum = pgEnum("user_role", userRoleValues);
export const nilDealStatusEnum = pgEnum("nil_deal_status", nilDealStatusValues);
export const transferStatusEnum = pgEnum("transfer_status", transferStatusValues);
export const verifTypeEnum = pgEnum("verif_type", verifTypeValues);
export const postTypeEnum = pgEnum("post_type", postTypeValues);
export const crmContactRoleEnum = pgEnum("crm_contact_role", crmContactRoleValues);
export const crmContactStatusEnum = pgEnum("crm_contact_status", crmContactStatusValues);
export const crmPipelineStageEnum = pgEnum("crm_pipeline_stage", crmPipelineStageValues);
export const notifTypeEnum = pgEnum("notif_type", notifTypeValues);
export const notifPriorityEnum = pgEnum("notif_priority", notifPriorityValues);
export const postVisibilityEnum = pgEnum("post_visibility", postVisibilityValues);
export const postMediaTypeEnum = pgEnum("post_media_type", postMediaTypeValues);
export const postSourceEnum = pgEnum("post_source", postSourceValues);
export const msgTypeEnum = pgEnum("msg_type", msgTypeValues);
export const convTypeEnum = pgEnum("conv_type", convTypeValues);
export const convParticipantRoleEnum = pgEnum("conv_participant_role", convParticipantRoleValues);

// ─── Core user table ─────────────────────────────────────────────────────────
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  openId: varchar("openId", { length: 64 }).unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: userRoleEnum("role").default("user").notNull(),
  sport: varchar("sport", { length: 64 }),
  school: varchar("school", { length: 128 }),
  year: varchar("year", { length: 32 }),
  bio: text("bio"),
  avatarUrl: text("avatarUrl"),
  phone: varchar("phone", { length: 20 }),
  trialEndsAt: timestamp("trialEndsAt"),
  phoneVerified: smallint("phoneVerified").default(0).notNull(),
  passwordHash: varchar("passwordHash", { length: 255 }),
  stripeCustomerId: varchar("stripeCustomerId", { length: 255 }),
  stripeSubscriptionId: varchar("stripeSubscriptionId", { length: 255 }),
  stripePlanId: varchar("stripePlanId", { length: 255 }),
  credits: integer("credits").default(0).notNull(),
  aiCredits: integer("aiCredits").default(0).notNull(),
  lastSignedIn: timestamp("lastSignedIn"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
  onboardingRole: varchar("onboardingRole", { length: 64 }),
  onboardingData: text("onboardingData"),
  onboardingCompleted: smallint("onboardingCompleted").default(0).notNull(),
});
export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// ─── Athlete profiles ─────────────────────────────────────────────────────────
export const athleteProfiles = pgTable("athlete_profiles", {
  id: serial("id").primaryKey(),
  userId: integer("userId").notNull(),
  sport: varchar("sport", { length: 64 }),
  position: varchar("position", { length: 64 }),
  school: varchar("school", { length: 128 }),
  year: varchar("year", { length: 32 }),
  gpa: real("gpa"),
  height: varchar("height", { length: 16 }),
  weight: integer("weight"),
  hometown: varchar("hometown", { length: 128 }),
  bio: text("bio"),
  hudlUrl: text("hudlUrl"),
  instagramUrl: text("instagramUrl"),
  twitterUrl: text("twitterUrl"),
  tiktokUrl: text("tiktokUrl"),
  recruitingScore: integer("recruitingScore").default(0),
  nilValue: integer("nilValue").default(0),
  transferStatus: varchar("transferStatus", { length: 32 }),
  classYear: varchar("classYear", { length: 16 }),
  state: varchar("state", { length: 64 }),
  recruitingStatus: varchar("recruitingStatus", { length: 32 }),
  followers: integer("followers").default(0),
  coverUrl: text("coverUrl"),
  highlightUrl: text("highlightUrl"),
  instagram: varchar("instagram", { length: 128 }),
  twitter: varchar("twitter", { length: 128 }),
  // ─── Sport-specific stats (JSON) — 40-yd dash, QB rating, GPA, etc.
  sportStats: json("sportStats"),
  // ─── Recruiting intelligence
  coachViews: integer("coachViews").default(0),
  collegesInterested: json("collegesInterested"),
  nilVerified: boolean("nilVerified").default(false),
  // ─── Full social URLs for reverse funnel
  facebookUrl: text("facebookUrl"),
  youtubeUrl: text("youtubeUrl"),
  linkedinUrl: text("linkedinUrl"),
  tiktokHandle: varchar("tiktokHandle", { length: 128 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});
export type AthleteProfile = typeof athleteProfiles.$inferSelect;

// ─── Posts / Feed ─────────────────────────────────────────────────────────────
export const posts = pgTable("posts", {
  id: serial("id").primaryKey(),
  userId: integer("userId").notNull(),
  content: text("content").notNull(),
  mediaUrls: json("mediaUrls"),
  mediaType: postMediaTypeEnum("mediaType").default("none").notNull(),
  postType: postTypeEnum("postType").default("status").notNull(),
  sourceApp: postSourceEnum("sourceApp").default("nil_portal").notNull(),
  visibility: postVisibilityEnum("visibility").default("public").notNull(),
  likesCount: integer("likesCount").default(0).notNull(),
  commentsCount: integer("commentsCount").default(0).notNull(),
  sharesCount: integer("sharesCount").default(0).notNull(),
  isPinned: boolean("isPinned").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});
export type Post = typeof posts.$inferSelect;

export const postLikes = pgTable("post_likes", {
  id: serial("id").primaryKey(),
  postId: integer("postId").notNull(),
  userId: integer("userId").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const postComments = pgTable("post_comments", {
  id: serial("id").primaryKey(),
  postId: integer("postId").notNull(),
  userId: integer("userId").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// ─── Messaging ────────────────────────────────────────────────────────────────
export const conversations = pgTable("conversations", {
  id: serial("id").primaryKey(),
  type: convTypeEnum("type").default("direct").notNull(),
  name: varchar("name", { length: 255 }),
  createdBy: integer("createdBy").notNull(),
  lastMessageAt: timestamp("lastMessageAt"),
  lastMessagePreview: varchar("lastMessagePreview", { length: 255 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export const conversationParticipants = pgTable("conversation_participants", {
  id: serial("id").primaryKey(),
  conversationId: integer("conversationId").notNull(),
  userId: integer("userId").notNull(),
  role: convParticipantRoleEnum("role").default("member").notNull(),
  lastReadAt: timestamp("lastReadAt"),
  unreadCount: integer("unreadCount").default(0).notNull(),
  joinedAt: timestamp("joinedAt").defaultNow().notNull(),
});

export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  conversationId: integer("conversationId").notNull(),
  senderId: integer("senderId").notNull(),
  content: text("content").notNull(),
  messageType: msgTypeEnum("messageType").default("text").notNull(),
  mediaUrl: text("mediaUrl"),
  metadata: json("metadata"),
  isEdited: boolean("isEdited").default(false).notNull(),
  isDeleted: boolean("isDeleted").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});
export type Message = typeof messages.$inferSelect;

// ─── NIL Deals ────────────────────────────────────────────────────────────────
export const nilDeals = pgTable("nil_deals", {
  id: serial("id").primaryKey(),
  athleteId: integer("athleteId").notNull(),
  brandName: varchar("brandName", { length: 128 }).notNull(),
  dealValue: integer("dealValue").default(0).notNull(),
  status: nilDealStatusEnum("status").default("pending").notNull(),
  description: text("description"),
  category: varchar("category", { length: 64 }),
  startDate: timestamp("startDate"),
  endDate: timestamp("endDate"),
  contractUrl: text("contractUrl"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});
export type NilDeal = typeof nilDeals.$inferSelect;

// ─── Training Logs ────────────────────────────────────────────────────────────
export const trainingLogs = pgTable("training_logs", {
  id: serial("id").primaryKey(),
  userId: integer("userId").notNull(),
  workout: varchar("workout", { length: 128 }).notNull(),
  duration: integer("duration"),
  notes: text("notes"),
  performance: integer("performance"),
  logDate: timestamp("logDate").defaultNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// ─── Transfer Portal ──────────────────────────────────────────────────────────
export const transferPortalEntries = pgTable("transfer_portal_entries", {
  id: serial("id").primaryKey(),
  athleteId: integer("athleteId").notNull(),
  fromSchool: varchar("fromSchool", { length: 128 }),
  toSchool: varchar("toSchool", { length: 128 }),
  status: transferStatusEnum("status").default("entered").notNull(),
  eligibilityYears: integer("eligibilityYears"),
  enteredAt: timestamp("enteredAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

// ─── Notifications ────────────────────────────────────────────────────────────
export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  userId: integer("userId").notNull(),
  type: notifTypeEnum("type").default("custom").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  message: text("message"),
  link: varchar("link", { length: 500 }),
  imageUrl: varchar("imageUrl", { length: 500 }),
  priority: notifPriorityEnum("priority").default("normal").notNull(),
  isRead: boolean("isRead").default(false).notNull(),
  isDismissed: boolean("isDismissed").default(false).notNull(),
  isBroadcast: boolean("isBroadcast").default(false).notNull(),
  expiresAt: timestamp("expiresAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  readAt: timestamp("readAt"),
});

// ─── Verification Codes ───────────────────────────────────────────────────────
export const verificationCodes = pgTable("verification_codes", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 320 }).notNull(),
  phone: varchar("phone", { length: 20 }),
  code: varchar("code", { length: 10 }).notNull(),
  type: verifTypeEnum("type").default("signup").notNull(),
  verified: boolean("verified").default(false).notNull(),
  expiresAt: timestamp("expiresAt").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
export type VerificationCode = typeof verificationCodes.$inferSelect;
export type InsertVerificationCode = typeof verificationCodes.$inferInsert;

// ─── Waitlist ─────────────────────────────────────────────────────────────────
export const waitlist = pgTable("waitlist_entries", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 320 }).notNull(),
  name: varchar("name", { length: 255 }),
  sport: varchar("sport", { length: 100 }),
  school: varchar("school", { length: 255 }),
  phone: varchar("phone", { length: 20 }),
  role: varchar("role", { length: 50 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
export type Waitlist = typeof waitlist.$inferSelect;

// ─── CRM Contacts ─────────────────────────────────────────────────────────────
export const crmContacts = pgTable("crm_contacts", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 128 }).notNull(),
  email: varchar("email", { length: 320 }),
  phone: varchar("phone", { length: 20 }),
  company: varchar("company", { length: 128 }),
  role: crmContactRoleEnum("role").default("Athlete").notNull(),
  status: crmContactStatusEnum("status").default("Lead").notNull(),
  notes: text("notes"),
  lastActivity: timestamp("lastActivity").defaultNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
export type CrmContact = typeof crmContacts.$inferSelect;

// ─── CRM Pipeline ─────────────────────────────────────────────────────────────
export const crmPipeline = pgTable("crm_pipeline", {
  id: serial("id").primaryKey(),
  contactId: integer("contactId").notNull(),
  stage: crmPipelineStageEnum("stage").default("New Lead").notNull(),
  dealValue: integer("dealValue").default(0),
  assignedTo: varchar("assignedTo", { length: 128 }),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});
export type CrmPipeline = typeof crmPipeline.$inferSelect;

// ─── Activity Log ─────────────────────────────────────────────────────────────
export const activityLog = pgTable("activity_log", {
  id: serial("id").primaryKey(),
  userId: integer("userId"),
  eventType: varchar("eventType", { length: 64 }).notNull(),
  metadata: text("metadata"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
export type ActivityLog = typeof activityLog.$inferSelect;

// ─── Broadcast Messages ───────────────────────────────────────────────────────
export const broadcastChannelEnum = pgEnum("broadcast_channel", ["email", "in_app", "both"]);
export const broadcastRecipientEnum = pgEnum("broadcast_recipient", ["all", "trial", "subscribed", "free"]);
export const broadcastStatusEnum = pgEnum("broadcast_status", ["draft", "sent", "failed"]);

export const broadcastMessages = pgTable("broadcast_messages", {
  id: serial("id").primaryKey(),
  senderId: integer("senderId").notNull(),
  subject: varchar("subject", { length: 256 }).notNull(),
  body: text("body").notNull(),
  channel: broadcastChannelEnum("channel").default("in_app").notNull(),
  recipientFilter: broadcastRecipientEnum("recipientFilter").default("all").notNull(),
  recipientCount: integer("recipientCount").default(0),
  status: broadcastStatusEnum("status").default("sent").notNull(),
  sentAt: timestamp("sentAt").defaultNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
export type BroadcastMessage = typeof broadcastMessages.$inferSelect;

// ─── Athlete Feedback ─────────────────────────────────────────────────────────
export const feedbackStatusValues = ["open", "under_review", "planned", "completed", "declined"] as const;
export const feedbackCategoryValues = ["feature_request", "bug_report", "general", "content", "performance"] as const;

export const feedbackStatusEnum = pgEnum("feedback_status", feedbackStatusValues);
export const feedbackCategoryEnum = pgEnum("feedback_category", feedbackCategoryValues);

export const athleteFeedback = pgTable("athlete_feedback", {
  id: serial("id").primaryKey(),
  userId: integer("userId"),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  title: varchar("title", { length: 256 }).notNull(),
  body: text("body").notNull(),
  category: feedbackCategoryEnum("category").default("general").notNull(),
  votes: integer("votes").default(0).notNull(),
  status: feedbackStatusEnum("status").default("open").notNull(),
  adminReply: text("adminReply"),
  repliedAt: timestamp("repliedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
export type AthleteFeedback = typeof athleteFeedback.$inferSelect;
export type InsertAthleteFeedback = typeof athleteFeedback.$inferInsert;

// ─── Feedback Votes ───────────────────────────────────────────────────────────
export const feedbackVotes = pgTable("feedback_votes", {
  id: serial("id").primaryKey(),
  feedbackId: integer("feedbackId").notNull(),
  voterIdentifier: varchar("voterIdentifier", { length: 320 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
export type FeedbackVote = typeof feedbackVotes.$inferSelect;

// ─── Subscription Expiry Notices ─────────────────────────────────────────────
export const expiryEmailTypeValues = ["7_day", "5_day", "4_day", "3_day", "2_day", "1_day", "expired"] as const;
export const expiryNoticeStatusValues = ["sent", "failed", "skipped"] as const;

export const expiryEmailTypeEnum = pgEnum("expiry_email_type", expiryEmailTypeValues);
export const expiryNoticeStatusEnum = pgEnum("expiry_notice_status", expiryNoticeStatusValues);

export const subscriptionExpiryNotices = pgTable("subscription_expiry_notices", {
  id: serial("id").primaryKey(),
  userId: integer("userId").notNull(),
  stripeSubscriptionId: varchar("stripeSubscriptionId", { length: 255 }),
  daysRemaining: integer("daysRemaining").notNull(),
  emailType: expiryEmailTypeEnum("emailType").notNull(),
  status: expiryNoticeStatusEnum("status").default("sent").notNull(),
  emailSentAt: timestamp("emailSentAt").defaultNow().notNull(),
  expiresAt: timestamp("expiresAt").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
export type SubscriptionExpiryNotice = typeof subscriptionExpiryNotices.$inferSelect;
export type InsertSubscriptionExpiryNotice = typeof subscriptionExpiryNotices.$inferInsert;

// ─── AI Bot + Robot Data Collection ──────────────────────────────────────────
export const dataSourceTypeValues = ["ai_bot", "robot", "wearable", "video_analysis", "manual", "api_integration"] as const;
export const dataEventTypeValues = [
  "performance_metric", "biometric", "gps_tracking", "motion_capture",
  "ai_session", "recruitment_interaction", "training_session", "health_record",
  "game_stat", "combine_result", "injury_report", "recovery_score"
] as const;

export const dataSourceTypeEnum = pgEnum("data_source_type", dataSourceTypeValues);
export const dataEventTypeEnum = pgEnum("data_event_type", dataEventTypeValues);

export const athleteDataSources = pgTable("athlete_data_sources", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  sourceType: dataSourceTypeEnum("sourceType").notNull(),
  deviceId: varchar("deviceId", { length: 255 }),
  firmwareVersion: varchar("firmwareVersion", { length: 64 }),
  isActive: boolean("isActive").default(true).notNull(),
  lastSeenAt: timestamp("lastSeenAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
export type AthleteDataSource = typeof athleteDataSources.$inferSelect;

export const athleteDataEvents = pgTable("athlete_data_events", {
  id: serial("id").primaryKey(),
  athleteId: integer("athleteId"),
  sourceId: integer("sourceId"),
  sourceType: dataSourceTypeEnum("sourceType").notNull(),
  eventType: dataEventTypeEnum("eventType").notNull(),
  sport: varchar("sport", { length: 64 }),
  sessionId: varchar("sessionId", { length: 128 }),
  payload: json("payload").notNull(),
  heartRate: integer("heartRate"),
  speed: real("speed"),
  distance: real("distance"),
  acceleration: real("acceleration"),
  recoveryScore: real("recoveryScore"),
  aiConfidence: real("aiConfidence"),
  latitude: real("latitude"),
  longitude: real("longitude"),
  deviceTimestamp: timestamp("deviceTimestamp"),
  processedAt: timestamp("processedAt"),
  isAnonymized: boolean("isAnonymized").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
export type AthleteDataEvent = typeof athleteDataEvents.$inferSelect;
export type InsertAthleteDataEvent = typeof athleteDataEvents.$inferInsert;

export const athleteDataSummaries = pgTable("athlete_data_summaries", {
  id: serial("id").primaryKey(),
  athleteId: integer("athleteId").notNull(),
  summaryDate: varchar("summaryDate", { length: 10 }).notNull(),
  sport: varchar("sport", { length: 64 }),
  totalEvents: integer("totalEvents").default(0).notNull(),
  avgHeartRate: real("avgHeartRate"),
  maxSpeed: real("maxSpeed"),
  totalDistance: real("totalDistance"),
  avgRecoveryScore: real("avgRecoveryScore"),
  aiSessionCount: integer("aiSessionCount").default(0).notNull(),
  robotSessionCount: integer("robotSessionCount").default(0).notNull(),
  wearableSessionCount: integer("wearableSessionCount").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});
export type AthleteDataSummary = typeof athleteDataSummaries.$inferSelect;

// ─── Credit System ────────────────────────────────────────────────────────────
export const creditTxTypeValues = ["purchase", "deduction", "refund", "bonus", "admin_grant"] as const;
export type CreditTxType = (typeof creditTxTypeValues)[number];

export const creditTxTypeEnum = pgEnum("credit_tx_type", creditTxTypeValues);

export const creditTransactions = pgTable("credit_transactions", {
  id: serial("id").primaryKey(),
  userId: integer("userId").notNull(),
  type: creditTxTypeEnum("type").notNull(),
  amount: integer("amount").notNull(),
  balanceAfter: integer("balanceAfter").notNull(),
  description: varchar("description", { length: 255 }),
  stripeSessionId: varchar("stripeSessionId", { length: 128 }),
  aiAction: varchar("aiAction", { length: 64 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
export type CreditTransaction = typeof creditTransactions.$inferSelect;
export type InsertCreditTransaction = typeof creditTransactions.$inferInsert;

export const creditPackagePurchases = pgTable("credit_package_purchases", {
  id: serial("id").primaryKey(),
  userId: integer("userId").notNull(),
  packId: varchar("packId", { length: 64 }).notNull(),
  packName: varchar("packName", { length: 128 }).notNull(),
  credits: integer("credits").notNull(),
  amountCents: integer("amountCents").notNull(),
  stripeSessionId: varchar("stripeSessionId", { length: 128 }).notNull(),
  stripeCustomerId: varchar("stripeCustomerId", { length: 128 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
export type CreditPackagePurchase = typeof creditPackagePurchases.$inferSelect;
export type InsertCreditPackagePurchase = typeof creditPackagePurchases.$inferInsert;

// ─── AI Trainer Bot ───────────────────────────────────────────────────────────
export const aiTrainerRoleValues = ["user", "assistant"] as const;
export type AiTrainerRole = (typeof aiTrainerRoleValues)[number];

export const aiTrainerRoleEnum = pgEnum("ai_trainer_role", aiTrainerRoleValues);

export const aiTrainerSessions = pgTable("ai_trainer_sessions", {
  id: serial("id").primaryKey(),
  userId: integer("userId").notNull(),
  role: aiTrainerRoleEnum("role").notNull(),
  content: text("content").notNull(),
  sessionTag: varchar("sessionTag", { length: 64 }),
  tokensUsed: integer("tokensUsed").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
export type AiTrainerSession = typeof aiTrainerSessions.$inferSelect;
export type InsertAiTrainerSession = typeof aiTrainerSessions.$inferInsert;

// ─── Athlete Calendar Events ──────────────────────────────────────────────────
export const calendarEventTypeValues = ["game", "practice", "nil", "recruiting", "team", "personal", "training", "media"] as const;
export type CalendarEventType = (typeof calendarEventTypeValues)[number];
export const calendarEventTypeEnum = pgEnum("calendar_event_type", calendarEventTypeValues);

export const athleteCalendarEvents = pgTable("athlete_calendar_events", {
  id: serial("id").primaryKey(),
  userId: integer("userId").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  date: varchar("date", { length: 10 }).notNull(), // YYYY-MM-DD
  time: varchar("time", { length: 10 }),
  type: calendarEventTypeEnum("type").default("personal").notNull(),
  location: varchar("location", { length: 255 }),
  description: text("description"),
  priority: varchar("priority", { length: 16 }).default("medium"),
  isPublic: boolean("isPublic").default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});
export type AthleteCalendarEvent = typeof athleteCalendarEvents.$inferSelect;
export type InsertAthleteCalendarEvent = typeof athleteCalendarEvents.$inferInsert;
