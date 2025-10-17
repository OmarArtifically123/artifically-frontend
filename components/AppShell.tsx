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
import ExperienceLayer from "@/components/ExperienceLayer";
import GlobalProgressBar from "@/components/GlobalProgressBar";
import Header from "@/components/Header";
import RouteShell from "@/components/skeletons/RouteShell";
import { ToastHost, toast } from "@/components/Toast";
import Button from "@/components/ui/Button";
import usePredictivePrefetch from "@/hooks/usePredictivePrefetch";
import { AppShellProvider, type AuthMode, type AuthUser } from "@/context/AppShellContext";
import { applyDesignTokens } from "@/styles/applyDesignTokens";

const Footer = lazy(() => import("@/components/Footer"));
const AuthModal = lazy(() => import("@/components/AuthModal"));

const experienceRoutes = new Set<string>([
  "/",
  "/case-studies",
  "/customers",
  "/blog",
  "/changelog",
]);

const routeLoaders = {
  "/": () => import("@/pages/Home"),
  "/pricing": () => import("@/pages/Pricing"),
  "/docs": () => import("@/pages/Docs"),
  "/documentation": () => import("@/pages/Docs"),
  "/design-system": () => import("@/pages/DesignSystem"),
  "/api": () => import("@/pages/ApiReference"),
  "/docs/api": () => import("@/pages/ApiReference"),
  "/blog": () => import("@/pages/Blog"),
  "/case-studies": () => import("@/pages/CaseStudies"),
  "/customers": () => import("@/pages/CaseStudies"),
  "/changelog": () => import("@/pages/Changelog"),
  "/updates": () => import("@/pages/Changelog"),
  "/help": () => import("@/pages/HelpCenter"),
  "/support": () => import("@/pages/HelpCenter"),
  "/status": () => import("@/pages/Status"),
  "/security": () => import("@/pages/Security"),
  "/privacy": () => import("@/pages/Privacy"),
  "/terms": () => import("@/pages/Terms"),
  "/contact": () => import("@/pages/Contact"),
  "/marketplace": () => import("@/pages/Marketplace"),
  "/products/marketplace": () => import("@/pages/Marketplace"),
  "/dashboard": () => import("@/components/Dashboard"),
  "/verify": () => import("@/components/Verify"),
};

type AuthenticatedPayload = {
  user?: AuthUser;
  notice?: string | null;
  sessionEstablished?: boolean;
};

type IdleHandle = number | ReturnType<typeof setTimeout>;

type AppShellProps = {
  children: ReactNode;
};

const requestIdle: (cb: IdleRequestCallback) => IdleHandle =
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

const cancelIdle = (id: IdleHandle) => {
  if (typeof window !== "undefined" && typeof window.cancelIdleCallback === "function" && typeof id === "number") {
    window.cancelIdleCallback(id);
    return;
  }
  clearTimeout(id as ReturnType<typeof setTimeout>);
};

function FooterSkeleton() {
  return (
    <div
      aria-hidden="true"
      style={{
        minHeight: 320,
        padding: "4rem 1.5rem",
        background: "linear-gradient(180deg, rgba(15,23,42,0.85) 0%, rgba(15,23,42,0.65) 100%)",
        borderTop: "1px solid rgba(148, 163, 184, 0.18)",
      }}
    >
      <div
        style={{
          maxWidth: "1180px",
          margin: "0 auto",
          display: "grid",
          gap: "2.5rem",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        }}
      >
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} style={{ display: "grid", gap: "0.85rem" }}>
            <div
              style={{
                width: "60%",
                height: "1.25rem",
                borderRadius: "0.65rem",
                background: "linear-gradient(120deg, rgba(148,163,184,0.28), rgba(148,163,184,0.12))",
                animation: "pulse 1.6s ease-in-out infinite",
              }}
            />
            {Array.from({ length: 4 }).map((_, lineIndex) => (
              <div
                key={lineIndex}
                style={{
                  height: "0.85rem",
                  borderRadius: "0.65rem",
                  width: `${70 - lineIndex * 10}%`,
                  background: "linear-gradient(120deg, rgba(148,163,184,0.24), rgba(148,163,184,0.08))",
                  animation: "pulse 1.6s ease-in-out infinite",
                }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AppShell({ children }: AppShellProps) {
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
      const ssrSuccess = typeof window !== "undefined" && window.__SSR_SUCCESS__;
      console.log(`App mounted with ${ssrSuccess ? "SSR" : "client-only"} rendering`);
    }
  }, []);

  usePredictivePrefetch(routeLoaders, pathname ?? "");

  useEffect(() => {
    if (typeof window === "undefined" || !isHydrated) {
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
    }),
    [openAuth, closeAuth, user, authChecking],
  );

  return (
    <AppShellProvider value={contextValue}>
      <ExperienceLayer enableExperience={enableExperience}>
        <GlobalProgressBar active={isNavigating || authChecking} />
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <Header user={user} onSignIn={() => openAuth("signin")} onSignUp={() => openAuth("signup")} onSignOut={signOut} />
        {user && !user.verified && (
          <div className="banner warn">
            <div className="container">
              <strong>Verify your email</strong> to unlock deployments and AI features.
              <Button
                size="sm"
                variant="secondary"
                glowOnHover={false}
                style={{ marginLeft: 12 }}
                onClick={async () => {
                  try {
                    await apiClient.post("/auth/resend-verification");
                    toast("Verification email sent. Check your inbox.", {
                      type: "success",
                    });
                  } catch (error) {
                    const fallbackMessage = "Could not resend verification";
                    let message = fallbackMessage;
                    if (error instanceof Error) {
                      message = error.message || fallbackMessage;
                    } else if (typeof error === "object" && error !== null && "message" in error) {
                      message = String((error as { message?: unknown }).message ?? fallbackMessage);
                    }
                    toast(message, {
                      type: "error",
                    });
                  }
                }}
              >
                Resend link
              </Button>
            </div>
          </div>
        )}

        <main id="main-content" className="app-shell" data-route-ready={isHydrated ? "true" : "false"} tabIndex={-1}>
          <Suspense fallback={<RouteShell rows={6} />}>{children}</Suspense>
        </main>

        <Suspense fallback={<FooterSkeleton />}>
          <Footer />
        </Suspense>

        {authOpen ? (
          <Suspense fallback={<RouteShell rows={4} />}>
            <AuthModal onClose={closeAuth} onAuthenticated={onAuthenticated} initialMode={authMode} />
          </Suspense>
        ) : null}

        <ToastHost />
        <BackToTopButton />
        <SpeedInsights />
      </ExperienceLayer>
    </AppShellProvider>
  );
}