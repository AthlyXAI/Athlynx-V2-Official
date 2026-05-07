import * as SecureStore from "expo-secure-store";

export const API_URL = "https://athlynx.ai";

async function getHeaders(): Promise<Record<string, string>> {
  const sessionId = await SecureStore.getItemAsync("session_id");
  return {
    "Content-Type": "application/json",
    ...(sessionId ? { Cookie: `app_session_id=${sessionId}` } : {}),
  };
}

export async function apiQuery<T>(procedure: string, input?: any): Promise<T> {
  const headers = await getHeaders();
  const url = input !== undefined
    ? `${API_URL}/api/trpc/${procedure}?input=${encodeURIComponent(JSON.stringify({ json: input }))}`
    : `${API_URL}/api/trpc/${procedure}`;
  
  const res = await fetch(url, { headers });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message || `API error: ${res.status}`);
  }
  const data = await res.json();
  return data?.result?.data?.json as T;
}

export async function apiMutation<T>(procedure: string, input: any): Promise<T> {
  const headers = await getHeaders();
  const res = await fetch(`${API_URL}/api/trpc/${procedure}`, {
    method: "POST",
    headers,
    body: JSON.stringify({ json: input }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message || `API error: ${res.status}`);
  }
  const data = await res.json();
  return data?.result?.data?.json as T;
}

// ─── Feed ─────────────────────────────────────────────────────────────────────
export const feedApi = {
  getFeed: (limit = 20, offset = 0) =>
    apiQuery<any[]>("feed.getFeed", { limit, offset }),
  createPost: (content: string, postType?: string, mediaUrls?: string[]) =>
    apiMutation("feed.createPost", { content, postType, mediaUrls }),
  likePost: (postId: number) =>
    apiMutation("feed.likePost", { postId }),
  getComments: (postId: number) =>
    apiQuery<any[]>("feed.getComments", { postId }),
  addComment: (postId: number, content: string) =>
    apiMutation("feed.addComment", { postId, content }),
};

// ─── Profile ──────────────────────────────────────────────────────────────────
export const profileApi = {
  getMyProfile: () => apiQuery<any>("profile.getMyProfile"),
  getProfile: (userId: number) => apiQuery<any>("profile.getProfile", { userId }),
  updateProfile: (data: any) => apiMutation("profile.updateProfile", data),
  searchAthletes: (query: string, sport?: string, limit = 20) =>
    apiQuery<any[]>("profile.searchAthletes", { query, sport, limit }),
};

// ─── NIL ──────────────────────────────────────────────────────────────────────
export const nilApi = {
  getMyDeals: () => apiQuery<any[]>("nil.getMyDeals"),
  getAllDeals: (status?: string, category?: string) =>
    apiQuery<any[]>("nil.getAllDeals", { status, category, limit: 20 }),
  createDeal: (data: any) => apiMutation("nil.createDeal", data),
  updateDealStatus: (dealId: number, status: string) =>
    apiMutation("nil.updateDealStatus", { dealId, status }),
};

// ─── Notifications ────────────────────────────────────────────────────────────
export const notificationsApi = {
  getNotifications: () => apiQuery<any[]>("notifications.getNotifications"),
  markRead: (notificationId: number) =>
    apiMutation("notifications.markRead", { notificationId }),
  markAllRead: () => apiMutation("notifications.markAllRead", {}),
};

// ─── Messaging ────────────────────────────────────────────────────────────────
export const messagingApi = {
  getConversations: () => apiQuery<any[]>("messenger.getConversations"),
  getMessages: (conversationId: number) =>
    apiQuery<any[]>("messenger.getMessages", { conversationId }),
  sendMessage: (conversationId: number, content: string) =>
    apiMutation("messenger.sendMessage", { conversationId, content }),
  startConversation: (userId: number, message: string) =>
    apiMutation("messenger.startConversation", { userId, message }),
};

// ─── Training ─────────────────────────────────────────────────────────────────
export const trainingApi = {
  getMyStats: () => apiQuery<any>("training.getMyStats"),
  logWorkout: (data: any) => apiMutation("training.logWorkout", data),
};

// ─── AI ───────────────────────────────────────────────────────────────────────
export const aiApi = {
  generateCaption: (context: string) =>
    apiMutation("ai.generateCaption", { context }),
  getXFactorScore: (userId?: number) =>
    apiQuery<any>("ai.getXFactorScore", userId ? { userId } : undefined),
};
