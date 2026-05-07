import { createTRPCReact } from "@trpc/react-query";
import { httpBatchLink } from "@trpc/client";
import superjson from "superjson";
import * as SecureStore from "expo-secure-store";

// Import type from the server (type-only, not runtime)
// This gives us full type safety on the mobile app
export type AppRouter = any; // Will be replaced with actual type when building

export const trpc = createTRPCReact<AppRouter>();

export const API_URL = "https://athlynx.ai";

export function createTRPCClient() {
  return trpc.createClient({
    links: [
      httpBatchLink({
        url: `${API_URL}/api/trpc`,
        transformer: superjson,
        async headers() {
          // Include session cookie for authenticated requests
          const sessionId = await SecureStore.getItemAsync("session_id");
          return {
            "Content-Type": "application/json",
            ...(sessionId ? { Cookie: `app_session_id=${sessionId}` } : {}),
          };
        },
      }),
    ],
  });
}
