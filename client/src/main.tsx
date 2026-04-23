import { trpc } from "@/lib/trpc";

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js', { scope: '/' })
      .then((registration) => {
        console.log('[PWA] Service worker registered:', registration.scope);
        setInterval(() => registration.update(), 60_000);
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (!newWorker) return;
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              (window as any).__swNewWorker = newWorker;
              window.dispatchEvent(new CustomEvent('swUpdateAvailable'));
            }
          });
        });
      })
      .catch((err) => console.warn('[PWA] SW registration failed:', err));
    let refreshing = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (!refreshing && (window as any).__swUserRequestedUpdate) {
        refreshing = true;
        window.location.reload();
      }
    });
  });
}

import { UNAUTHED_ERR_MSG } from '@shared/const';
import { Auth0Provider } from "@auth0/auth0-react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink, TRPCClientError } from "@trpc/client";
import { createRoot } from "react-dom/client";
import superjson from "superjson";
import App from "./App";
import "./index.css";

const queryClient = new QueryClient();

const redirectToLoginIfUnauthorized = (error: unknown) => {
  if (!(error instanceof TRPCClientError)) return;
  if (typeof window === "undefined") return;
  if (error.message === UNAUTHED_ERR_MSG) window.location.href = '/signup';
};

queryClient.getQueryCache().subscribe(event => {
  if (event.type === "updated" && event.action.type === "error") {
    redirectToLoginIfUnauthorized(event.query.state.error);
  }
});
queryClient.getMutationCache().subscribe(event => {
  if (event.type === "updated" && event.action.type === "error") {
    redirectToLoginIfUnauthorized(event.mutation.state.error);
  }
});

const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: "/api/trpc",
      transformer: superjson,
      fetch(input, init) {
        return globalThis.fetch(input, { ...(init ?? {}), credentials: "include" });
      },
    }),
  ],
});

// Auth0 config — AthlynxAI-2026-14 tenant (updated 2026-04-23)
const auth0Domain = "dev-8yqdmei0v8kc3qqy.us.auth0.com";
const auth0ClientId = "eDJT34flTy4oOq1cie6ItFubLDPHOrcI"; // production app — AthlynxAI-2026-14

createRoot(document.getElementById("root")!).render(
  <Auth0Provider
    domain={auth0Domain}
    clientId={auth0ClientId}
    authorizationParams={{
      redirect_uri: "https://athlynx.ai/callback",
      scope: "openid profile email",
    }}
    cacheLocation="localstorage"
  >
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </trpc.Provider>
  </Auth0Provider>
);
