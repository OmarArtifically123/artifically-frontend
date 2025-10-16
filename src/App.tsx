import { SpeedInsights } from "@vercel/speed-insights/react";
import {
  lazy,
  Suspense,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";

import apiClient, { pick } from "./api";
import ExperienceLayer from "./components/ExperienceLayer";
import GlobalProgressBar from "./components/GlobalProgressBar";
import Header from "./components/Header";
import RouteShell from "./components/skeletons/RouteShell";
import { ToastHost, toast } from "./components/Toast";
import Button from "./components/ui/Button";
import usePredictivePrefetch from "./hooks/usePredictivePrefetch";
import { applyDesignTokens } from "./styles/applyDesignTokens";
import "./styles/global.css";
import "./styles/landing.css";

type AuthMode = "signin" | "signup";

type AuthUser = {
  verified?: boolean;
  [key: string]: unknown;
} | null;

type AuthenticatedPayload = {
  user?: AuthUser;
  notice?: string | null;
  sessionEstablished?: boolean;
};

type RouteLoaders = Record<string, () => Promise<unknown>>;

declare global {
  interface Window {
    __SSR_SUCCESS__?: boolean;
  }
}

const Home = lazy(() => import(/* webpackChunkName: "home", webpackPrefetch: true */ "./pages/Home"));
const Pricing = lazy(() => import(/* webpackChunkName: "pricing", webpackPrefetch: true */ "./pages/Pricing"));
const Docs = lazy(() => import(/* webpackChunkName: "docs", webpackPrefetch: true */ "./pages/Docs"));
const ApiReference = lazy(() =>
  import(/* webpackChunkName: "api-reference", webpackPrefetch: true */ "./pages/ApiReference")
);
const Blog = lazy(() => import(/* webpackChunkName: "blog", webpackPrefetch: true */ "./pages/Blog"));
const CaseStudies = lazy(() =>
  import(/* webpackChunkName: "case-studies", webpackPrefetch: true */ "./pages/CaseStudies")
);
const Changelog = lazy(() => import(/* webpackChunkName: "changelog" */ "./pages/Changelog"));
const HelpCenter = lazy(() => import(/* webpackChunkName: "help-center" */ "./pages/HelpCenter"));
const DesignSystem = lazy(() => import(/* webpackChunkName: "design-system" */ "./pages/DesignSystem"));
const StatusPage = lazy(() => import(/* webpackChunkName: "status" */ "./pages/Status"));
const Security = lazy(() => import(/* webpackChunkName: "security" */ "./pages/Security"));
const Privacy = lazy(() => import(/* webpackChunkName: "privacy" */ "./pages/Privacy"));
const Terms = lazy(() => import(/* webpackChunkName: "terms" */ "./pages/Terms"));
const Contact = lazy(() => import(/* webpackChunkName: "contact" */ "./pages/Contact"));
const Marketplace = lazy(() =>
  import(/* webpackChunkName: "marketplace", webpackPrefetch: true */ "./pages/Marketplace")
);
const Dashboard = lazy(() => import(/* webpackChunkName: "dashboard", webpackPrefetch: true */ "./components/Dashboard"));
const AuthModal = lazy(() => import(/* webpackChunkName: "auth-modal" */ "./components/AuthModal"));
const Verify = lazy(() => import(/* webpackChunkName: "verify" */ "./components/Verify"));
const Footer = lazy(() => import(/* webpackChunkName: "footer" */ "./components/Footer"));

// Utility functions - moved outside component to prevent recreation
type IdleHandle = number | ReturnType<typeof setTimeout>;

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

function SuspenseBoundary({ children, rows = 3 }: { children: ReactNode; rows?: number }) {
  return <Suspense fallback={<RouteShell rows={rows} />}>{children}</Suspense>;
}

export default function App() {
  const [authOpen, setAuthOpen] = useState<boolean>(false);
  const [authMode, setAuthMode] = useState<AuthMode>("signin");
  const [user, setUser] = useState<AuthUser>(null);
  const [authChecking, setAuthChecking] = useState<boolean>(false);
  const [isHydrated, setIsHydrated] = useState<boolean>(false);
  const [isNavigating, setIsNavigating] = useState<boolean>(false);
  const navigationTimeoutRef = useRef<number | null>(null);

  const navigate = useNavigate();
  const location = useLocation();
  const { pathname } = location;
  const experienceRoutes = useMemo(
    () =>
      new Set<string>([
        "/",
        "/case-studies",
        "/customers",
        "/blog",
        "/changelog",
      ]),
    [],
  );
  const enableExperience = experienceRoutes.has(pathname);

  useEffect(() => {
    applyDesignTokens();
  }, []);

  // Mark as hydrated after initial mount
  useEffect(() => {
    setIsHydrated(true);
    
    // Log SSR status in development
    if (process.env.NODE_ENV === 'development') {
      const ssrSuccess = typeof window !== 'undefined' && window.__SSR_SUCCESS__;
      console.log(`App mounted with ${ssrSuccess ? 'SSR' : 'client-only'} rendering`);
    }
  }, []);

  // Static route loaders - memoized to prevent recreation
  const routeLoaders = useMemo<RouteLoaders>(
    () => ({
      "/": () => import("./pages/Home"),
      "/pricing": () => import("./pages/Pricing"),
      "/docs": () => import("./pages/Docs"),
      "/documentation": () => import("./pages/Docs"),
      "/design-system": () => import("./pages/DesignSystem"),
      "/api": () => import("./pages/ApiReference"),
      "/docs/api": () => import("./pages/ApiReference"),
      "/blog": () => import("./pages/Blog"),
      "/case-studies": () => import("./pages/CaseStudies"),
      "/customers": () => import("./pages/CaseStudies"),
      "/changelog": () => import("./pages/Changelog"),
      "/updates": () => import("./pages/Changelog"),
      "/help": () => import("./pages/HelpCenter"),
      "/support": () => import("./pages/HelpCenter"),
      "/status": () => import("./pages/Status"),
      "/security": () => import("./pages/Security"),
      "/privacy": () => import("./pages/Privacy"),
      "/terms": () => import("./pages/Terms"),
      "/contact": () => import("./pages/Contact"),
      "/marketplace": () => import("./pages/Marketplace"),
      "/products/marketplace": () => import("./pages/Marketplace"),
      "/dashboard": () => import("./components/Dashboard"),
      "/verify": () => import("./components/Verify"),
    }),
    []
  );

  usePredictivePrefetch(routeLoaders, pathname);

  // Auth check effect - only runs on client after hydration
  useEffect(() => {
    if (typeof window === "undefined" || !isHydrated) {
      return;
    }

    let mounted = true;
    setAuthChecking(true);

    apiClient
      .get("/auth/me")
      .then(pick("user"))
      .then((u) => {
        if (mounted) {
          setUser((u as AuthUser) ?? null);
        }
      })
      .catch((error) => {
        if (import.meta.env.DEV) {
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

  // Route history effect - only runs on client after hydration
  useEffect(() => {
    if (!isHydrated || typeof window === "undefined") {
      return;
    }

    const idleId = requestIdle(() => {
      try {
        const history = JSON.parse(localStorage.getItem("route-history") || "[]");
        history.unshift({ path: pathname, ts: Date.now() });
        localStorage.setItem("route-history", JSON.stringify(history.slice(0, 10)));
      } catch (error) {
        console.warn("Failed to update route history:", error);
      }
    });

    return () => cancelIdle(idleId);
  }, [pathname, isHydrated]);

  // Scroll behavior - only on client after hydration
  useEffect(() => {
    if (!isHydrated || typeof window === "undefined") {
      return;
    }

    const timeoutId = setTimeout(() => {
      window.requestAnimationFrame(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [pathname, isHydrated]);

  useEffect(() => {
    if (!isHydrated || typeof window === "undefined") {
      return;
    }

    setIsNavigating(true);
    if (navigationTimeoutRef.current) {
      clearTimeout(navigationTimeoutRef.current);
    }

    const settle = () => setIsNavigating(false);
    navigationTimeoutRef.current = window.setTimeout(settle, 1200);
    const idleId = requestIdle(() => {
      settle();
    });

    return () => {
      if (navigationTimeoutRef.current) {
        clearTimeout(navigationTimeoutRef.current);
      }
      cancelIdle(idleId);
    };
  }, [pathname, isHydrated]);

  const openAuth = (mode: AuthMode = "signin") => {
    setAuthMode(mode);
    setAuthOpen(true);
  };

  const signOut = async () => {
    setAuthChecking(true);
    try {
      await apiClient.post("/auth/signout");
    } catch (error) {
      if (import.meta.env.DEV) {
        console.warn("Failed to end session", error);
      }
    } finally {
      setUser(null);
      setAuthChecking(false);
      toast("Successfully signed out", { type: "info" });
      if (pathname.startsWith("/dashboard")) {
        navigate("/");
      }
    }
  };

  const onAuthenticated = ({ user: nextUser, notice }: AuthenticatedPayload) => {
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
          if (import.meta.env.DEV) {
            console.warn("Post-auth user fetch failed", error);
          }
        });
    }
    if (notice) {
      toast(notice, { type: nextUser && nextUser.verified ? "success" : "info" });
    }
    setAuthChecking(false);
    setAuthOpen(false);
  };

  return (
    <ExperienceLayer enableExperience={enableExperience}>
      <GlobalProgressBar active={isNavigating || authChecking} />
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <Header
        user={user}
        onSignIn={() => openAuth("signin")}
        onSignUp={() => openAuth("signup")}
        onSignOut={signOut}
      />

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

      <main
        id="main-content"
        className="app-shell"
        data-route-ready={isHydrated ? "true" : "false"}
        tabIndex={-1}
      >
        <Suspense fallback={<RouteShell rows={6} />}>
          <Routes location={location}>
            <Route
              path="/"
              element={
                <SuspenseBoundary rows={6}>
                  <Home openAuth={openAuth} />
                </SuspenseBoundary>
              }
            />
            <Route
              path="/pricing"
              element={
                <SuspenseBoundary rows={4}>
                  <Pricing />
                </SuspenseBoundary>
              }
            />
            <Route
              path="/docs"
              element={
                <SuspenseBoundary rows={5}>
                  <Docs />
                </SuspenseBoundary>
              }
            />
            <Route
              path="/documentation"
              element={
                <SuspenseBoundary rows={5}>
                  <Docs />
                </SuspenseBoundary>
              }
            />
            <Route
              path="/design-system"
              element={
                <SuspenseBoundary rows={4}>
                  <DesignSystem />
                </SuspenseBoundary>
              }
            />
            <Route
              path="/api"
              element={
                <SuspenseBoundary rows={5}>
                  <ApiReference />
                </SuspenseBoundary>
              }
            />
            <Route
              path="/docs/api"
              element={
                <SuspenseBoundary rows={5}>
                  <ApiReference />
                </SuspenseBoundary>
              }
            />
            <Route
              path="/blog"
              element={
                <SuspenseBoundary rows={6}>
                  <Blog />
                </SuspenseBoundary>
              }
            />
            <Route
              path="/case-studies"
              element={
                <SuspenseBoundary rows={6}>
                  <CaseStudies />
                </SuspenseBoundary>
              }
            />
            <Route
              path="/customers"
              element={
                <SuspenseBoundary rows={6}>
                  <CaseStudies />
                </SuspenseBoundary>
              }
            />
            <Route
              path="/changelog"
              element={
                <SuspenseBoundary rows={4}>
                  <Changelog />
                </SuspenseBoundary>
              }
            />
            <Route
              path="/updates"
              element={
                <SuspenseBoundary rows={4}>
                  <Changelog />
                </SuspenseBoundary>
              }
            />
            <Route
              path="/help"
              element={
                <SuspenseBoundary rows={4}>
                  <HelpCenter />
                </SuspenseBoundary>
              }
            />
            <Route
              path="/support"
              element={
                <SuspenseBoundary rows={4}>
                  <HelpCenter />
                </SuspenseBoundary>
              }
            />
            <Route
              path="/status"
              element={
                <SuspenseBoundary rows={3}>
                  <StatusPage />
                </SuspenseBoundary>
              }
            />
            <Route
              path="/security"
              element={
                <SuspenseBoundary rows={3}>
                    <Security />
                </SuspenseBoundary>
              }
            />
            <Route
              path="/privacy"
              element={
                <SuspenseBoundary rows={3}>
                    <Privacy />
                </SuspenseBoundary>
              }
            />
            <Route
              path="/terms"
              element={
                <SuspenseBoundary rows={3}>
                    <Terms />
                </SuspenseBoundary>
              }
            />
            <Route
              path="/contact"
              element={
                <SuspenseBoundary rows={3}>
                    <Contact />
                </SuspenseBoundary>
              }
            />
            <Route
              path="/marketplace"
              element={
                <SuspenseBoundary rows={6}>
                  <Marketplace />
                </SuspenseBoundary>
              }
            />
            <Route
              path="/products/marketplace"
              element={
                <SuspenseBoundary rows={6}>
                  <Marketplace />
                </SuspenseBoundary>
              }
            />
            <Route
              path="/dashboard"
              element={
                <SuspenseBoundary rows={6}>
                  {authChecking ? (
                    <RouteShell rows={6} />
                  ) : user ? (
                    <Dashboard user={user} openAuth={openAuth} />
                  ) : (
                    <Home openAuth={openAuth} />
                  )}
                </SuspenseBoundary>
              }
            />
            <Route
              path="/verify"
              element={
                <SuspenseBoundary rows={3}>
                  <Verify onVerified={(verifiedUser: AuthUser) => setUser(verifiedUser ?? null)} />
                </SuspenseBoundary>
              }
            />
            <Route
              path="*"
              element={
                <SuspenseBoundary rows={6}>
                    <Home openAuth={openAuth} />
                </SuspenseBoundary>
              }
            />
          </Routes>
          </Suspense>
      </main>

      <Suspense fallback={<FooterSkeleton />}>
        <Footer />
      </Suspense>

      {authOpen && (
        <Suspense fallback={<RouteShell rows={4} />}>
          <AuthModal
            onClose={() => setAuthOpen(false)}
            onAuthenticated={onAuthenticated}
            initialMode={authMode}
          />
        </Suspense>
      )}

      <ToastHost />
      <SpeedInsights />
    </ExperienceLayer>
  );
}

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