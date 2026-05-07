import * as SecureStore from "expo-secure-store";
import { API_URL } from "./trpc";

export interface User {
  id: number;
  name: string;
  email: string;
  avatarUrl?: string;
  role?: string;
  sport?: string;
  school?: string;
  credits?: number;
  subscriptionTier?: string;
}

export async function login(email: string, password: string): Promise<{ user: User; sessionId: string }> {
  const res = await fetch(`${API_URL}/api/trpc/auth.login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ json: { email, password } }),
    credentials: "include",
  });
  
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err?.error?.message || "Login failed");
  }
  
  const data = await res.json();
  const user = data?.result?.data?.json;
  
  // Extract session cookie
  const setCookie = res.headers.get("set-cookie");
  const sessionId = setCookie?.match(/app_session_id=([^;]+)/)?.[1];
  
  if (sessionId) {
    await SecureStore.setItemAsync("session_id", sessionId);
  }
  
  return { user, sessionId: sessionId || "" };
}

export async function register(data: {
  name: string;
  email: string;
  password: string;
  sport?: string;
  school?: string;
}): Promise<{ user: User; sessionId: string }> {
  const res = await fetch(`${API_URL}/api/trpc/auth.register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ json: data }),
    credentials: "include",
  });
  
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err?.error?.message || "Registration failed");
  }
  
  const result = await res.json();
  const user = result?.result?.data?.json;
  
  const setCookie = res.headers.get("set-cookie");
  const sessionId = setCookie?.match(/app_session_id=([^;]+)/)?.[1];
  
  if (sessionId) {
    await SecureStore.setItemAsync("session_id", sessionId);
  }
  
  return { user, sessionId: sessionId || "" };
}

export async function logout(): Promise<void> {
  const sessionId = await SecureStore.getItemAsync("session_id");
  if (sessionId) {
    await fetch(`${API_URL}/api/trpc/auth.logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: `app_session_id=${sessionId}`,
      },
      body: JSON.stringify({ json: {} }),
    });
  }
  await SecureStore.deleteItemAsync("session_id");
}

export async function getMe(): Promise<User | null> {
  const sessionId = await SecureStore.getItemAsync("session_id");
  if (!sessionId) return null;
  
  try {
    const res = await fetch(`${API_URL}/api/trpc/auth.me`, {
      headers: {
        Cookie: `app_session_id=${sessionId}`,
      },
    });
    
    if (!res.ok) return null;
    const data = await res.json();
    return data?.result?.data?.json || null;
  } catch {
    return null;
  }
}
