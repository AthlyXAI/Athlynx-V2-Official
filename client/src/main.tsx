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
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink, TRPCClientError } from "@trpc/client";
import { createRoot } from "react-dom/client";
import superjson from "superjson";
import App from "./App";
import "./index.css";
import { GlobalErrorBoundary } from "./components/GlobalErrorBoundary";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      retryDelay: 5000,
      refetchOnWindowFocus: false,
      refetchOnReconnect: "always",
    },
  },
});

// Public/marketing routes — NEVER redirect away from these even if unauthenticated
const PUBLIC_ROUTES = [
  '/', '/signup', '/early-access', '/early-access-v2',
  '/signin', '/login', '/callback', '/auth/callback',
  '/forgot-password', '/demo', '/how-it-works',
  '/welcome', '/about', '/platform',
  '/investor-hub', '/investor-deck', '/founders',
  '/pricing', '/partners', '/nil-portal',
  '/diamond-grind', '/warriors-playbook',
  '/faith', '/ai-recruiter',
];

const redirectToLoginIfUnauthorized = (error: unknown) => {
  if (!(error instanceof TRPCClientError)) return;
  if (typeof window === 'undefined') return;
  if (error.message !== UNAUTHED_ERR_MSG) return;
  const currentPath = window.location.pathname;
  // Never redirect away from public/marketing pages — visitors must see the home page
  const isPublicRoute = PUBLIC_ROUTES.some(
    route => currentPath === route || currentPath.startsWith(route + '/')
  );
  if (isPublicRoute) return;
  // Redirect to /signin (not /signup) — session expired for existing user
  window.location.href = '/signin';
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

createRoot(document.getElementById("root")!).render(
  <GlobalErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <trpc.Provider client={trpcClient} queryClient={queryClient}>
        <App />
      </trpc.Provider>
    </QueryClientProvider>
  </GlobalErrorBoundary>
);
