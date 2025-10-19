"use client";

import { SpeedInsights } from "@vercel/speed-insights/react";
import {
  Suspense,
  lazy,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { usePathname, useRouter } from "next/navigation";

import apiClient, { pick } from "@/api";
import BackToTopButton from "@/components/BackToTopButton";
import CommandPalette from "@/components/CommandPalette";
import ExperienceLayer from "@/components/ExperienceLayer";
import GlobalProgressBar from "@/components/GlobalProgressBar";
import ReactQueryProvider from "@/components/providers/ReactQueryProvider";
import RouteShell from "@/components/skeletons/RouteShell";
import { ToastHost, toast } from "@/components/Toast";
import usePredictivePrefetch from "@/hooks/usePredictivePrefetch";
import { AppShellProvider, type AuthMode, type AuthUser } from "@/context/AppShellContext";
import { applyDesignTokens } from "@/styles/applyDesignTokens";

const AuthModal = lazy(() => import("@/components/AuthModal"));

const experienceRoutes = new Set<string>([
  "/",
  "/case-studies",
  "/customers",
  "/blog",
  "/changelog",
]);

const routeLoaders = {
  "/pricing": () => import("@/app/(site)/_components/PricingPage"),
  "/docs": () => import("@/app/(site)/_components/DocsPage"),
  "/documentation": () => import("@/app/(site)/_components/DocsPage"),
  "/design-system": () => import("@/app/(site)/_components/DesignSystemPage"),
  "/api": () => import("@/app/(site)/_components/ApiReferencePage"),
  "/docs/api": () => import("@/app/(site)/_components/ApiReferencePage"),
  "/blog": () => import("@/app/(site)/_components/BlogPage"),
  "/case-studies": () => import("@/app/(site)/_components/CaseStudiesPage"),
  "/customers": () => import("@/app/(site)/_components/CaseStudiesPage"),
  "/changelog": () => import("@/app/(site)/_components/ChangelogPage"),
  "/updates": () => import("@/app/(site)/_components/ChangelogPage"),
  "/help": () => import("@/app/(site)/_components/HelpCenterPage"),
  "/support": () => import("@/app/(site)/_components/HelpCenterPage"),
  "/status": () => import("@/app/(site)/_components/StatusPage"),
  "/security": () => import("@/app/(site)/_components/SecurityPage"),
  "/privacy": () => import("@/app/(site)/_components/PrivacyPage"),
  "/terms": () => import("@/app/(site)/_components/TermsPage"),
  "/contact": () => import("@/app/(site)/_components/ContactPage"),
  "/marketplace": () => import("@/app/(site)/_components/MarketplacePage"),
  "/products/marketplace": () => import("@/app/(site)/_components/MarketplacePage"),
  "/dashboard": () => import("@/components/Dashboard"),
  "/verify": () => import("@/components/Verify"),
};

const requestIdle: (cb: IdleRequestCallback) => number | ReturnType<typeof setTimeout> =
  typeof window !== "undefined" && typeof window.requestIdleCallback === "function"
    ? (cb) => window.requestIdleCallback(cb)
    : (cb) => {
        const start = Date.now();
        const timeoutId = setTimeout(() => {
          cb({
            didTimeout: false,
            timeRemaining: () => Math.max(0, 50 - (Date.now() - start)),
          });
        }, 1);
        return timeoutId;
      };

const cancelIdle = (id: number | ReturnType<typeof setTimeout>) => {
  if (typeof window !== "undefined" && typeof window.cancelIdleCallback === "function" && typeof id === "number") {
    window.cancelIdleCallback(id);
    return;
  }
  clearTimeout(id as ReturnType<typeof setTimeout>);
};

const SESSION_COOKIE_NAME = "__Host-artifically-session";

const hasBrowserSession = () => {
  if (typeof document === "undefined") {
    return false;
  }

  try {
    return document.cookie.split(";").some((cookie) => cookie.trim().startsWith(`${SESSION_COOKIE_NAME}=`));
  } catch (error) {
    console.warn("Unable to inspect session cookie", error);
    return false;
  }
};

type AuthenticatedPayload = {
  user?: AuthUser;
  notice?: string | null;
  sessionEstablished?: boolean;
};

type AppShellClientProps = {
  children: ReactNode;
};

export default function AppShellClient({ children }: AppShellClientProps) {
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>("signin");
  const [user, setUser] = useState<AuthUser>(null);
  const [authChecking, setAuthChecking] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);

  const navigationTimeoutRef = useRef<number | null>(null);

  const router = useRouter();
  const pathname = usePathname();

  const enableExperience = experienceRoutes.has(pathname ?? "");

  useEffect(() => {
    applyDesignTokens();
  }, []);

  useEffect(() => {
    setIsHydrated(true);

    if (process.env.NODE_ENV === "development") {
      const ssrSuccess = typeof window !== "undefined" && (window as typeof window & { __SSR_SUCCESS__?: boolean }).__SSR_SUCCESS__;
      console.log(`App mounted with ${ssrSuccess ? "SSR" : "client-only"} rendering`);
    }
  }, []);

  usePredictivePrefetch(routeLoaders, pathname ?? "");

  useEffect(() => {
    if (typeof window === "undefined" || !isHydrated) {
      return undefined;
    }

    if (!hasBrowserSession()) {
      setUser(null);
      setAuthChecking(false);
      return undefined;
    }
    
    let mounted = true;
    setAuthChecking(true);

    apiClient
      .get("/auth/me")
      .then(pick("user"))
      .then((resolvedUser) => {
        if (mounted) {
          setUser((resolvedUser as AuthUser) ?? null);
        }
      })
      .catch((error) => {
        if (process.env.NODE_ENV !== "production") {
          console.warn("Auth check failed", error);
        }
        if (mounted) {
          setUser(null);
        }
      })
      .finally(() => {
        if (mounted) {
          setAuthChecking(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, [isHydrated]);

  useEffect(() => {
    if (!isHydrated || typeof window === "undefined" || !pathname) {
      return undefined;
    }

    const idleId = requestIdle(() => {
      try {
        const history = JSON.parse(window.localStorage.getItem("route-history") || "[]");
        history.unshift({ path: pathname, ts: Date.now() });
        window.localStorage.setItem("route-history", JSON.stringify(history.slice(0, 10)));
      } catch (error) {
        console.warn("Failed to update route history:", error);
      }
    });

    return () => cancelIdle(idleId);
  }, [pathname, isHydrated]);

  useEffect(() => {
    if (!isHydrated || typeof window === "undefined") {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      window.requestAnimationFrame(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    }, 100);

    return () => window.clearTimeout(timeoutId);
  }, [pathname, isHydrated]);

  useEffect(() => {
    if (!isHydrated || typeof window === "undefined") {
      return undefined;
    }

    setIsNavigating(true);
    if (navigationTimeoutRef.current) {
      clearTimeout(navigationTimeoutRef.current);
    }

    const settle = () => setIsNavigating(false);
    navigationTimeoutRef.current = window.setTimeout(settle, 1200);
    const idleId = requestIdle(() => settle());

    return () => {
      if (navigationTimeoutRef.current) {
        clearTimeout(navigationTimeoutRef.current);
      }
      cancelIdle(idleId);
    };
  }, [pathname, isHydrated]);

  const openAuth = useCallback(
    (mode: AuthMode = "signin") => {
      setAuthMode(mode);
      setAuthOpen(true);
    },
    [],
  );

  const closeAuth = useCallback(() => {
    setAuthOpen(false);
  }, []);

  const signOut = useCallback(async () => {
    setAuthChecking(true);
    try {
      await apiClient.post("/auth/signout");
    } catch (error) {
      if (process.env.NODE_ENV !== "production") {
        console.warn("Failed to end session", error);
      }
    } finally {
      setUser(null);
      setAuthChecking(false);
      toast("Successfully signed out", { type: "info" });
      if (pathname?.startsWith("/dashboard")) {
        router.push("/");
      }
    }
  }, [pathname, router]);

  const onAuthenticated = useCallback(
    ({ user: nextUser, notice }: AuthenticatedPayload) => {
      if (typeof nextUser !== "undefined") {
        setUser(nextUser ?? null);
      } else {
        apiClient
          .get("/auth/me")
          .then(pick("user"))
          .then((resolvedUser) => {
            setUser((resolvedUser as AuthUser) ?? null);
          })
          .catch((error) => {
            if (process.env.NODE_ENV !== "production") {
              console.warn("Post-auth user fetch failed", error);
            }
          });
      }

      if (notice) {
        toast(notice, { type: nextUser && nextUser.verified ? "success" : "info" });
      }

      setAuthChecking(false);
      setAuthOpen(false);
    },
    [],
  );

  const contextValue = useMemo(
    () => ({
      openAuth,
      closeAuth,
      setUser,
      user,
      authChecking,
      signOut,
      isHydrated,
      isNavigating,
    }),
    [openAuth, closeAuth, user, authChecking, signOut, isHydrated, isNavigating],
  );

  return (
    <ReactQueryProvider>
      <AppShellProvider value={contextValue}>
        <ExperienceLayer enableExperience={enableExperience}>
          <GlobalProgressBar active={isNavigating || authChecking} />
          {children}
          {authOpen ? (
            <Suspense fallback={<RouteShell rows={4} />}>
              <AuthModal onClose={closeAuth} onAuthenticated={onAuthenticated} initialMode={authMode} />
            </Suspense>
          ) : null}
          <CommandPalette />
          <ToastHost />
          <BackToTopButton />
          <SpeedInsights />
        </ExperienceLayer>
      </AppShellProvider>
    </ReactQueryProvider>
  );
}