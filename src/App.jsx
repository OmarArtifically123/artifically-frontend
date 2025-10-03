import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Header from "./components/Header";
import Footer from "./components/Footer";
import RouteShell from "./components/skeletons/RouteShell";
import { ToastHost, toast } from "./components/Toast";
import api, { pick } from "./api";
import usePredictivePrefetch from "./hooks/usePredictivePrefetch";
import "./styles/global.css";
import ExperienceLayer from "./components/ExperienceLayer";
import PageTransition from "./components/animation/PageTransition";

const Home = lazy(() => import("./pages/Home"));
const Pricing = lazy(() => import("./pages/Pricing"));
const Docs = lazy(() => import("./pages/Docs"));
const ApiReference = lazy(() => import("./pages/ApiReference"));
const Blog = lazy(() => import("./pages/Blog"));
const CaseStudies = lazy(() => import("./pages/CaseStudies"));
const Changelog = lazy(() => import("./pages/Changelog"));
const HelpCenter = lazy(() => import("./pages/HelpCenter"));
const StatusPage = lazy(() => import("./pages/Status"));
const Security = lazy(() => import("./pages/Security"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Terms = lazy(() => import("./pages/Terms"));
const Contact = lazy(() => import("./pages/Contact"));
const Marketplace = lazy(() => import("./components/Marketplace"));
const Dashboard = lazy(() => import("./components/Dashboard"));
const AuthModal = lazy(() => import("./components/AuthModal"));
const Verify = lazy(() => import("./components/Verify"));

// Utility functions - moved outside component to prevent recreation
const requestIdle =
  typeof window !== "undefined" && typeof window.requestIdleCallback === "function"
    ? (cb) => window.requestIdleCallback(cb)
    : (cb) => setTimeout(() => cb({ didTimeout: false, timeRemaining: () => 0 }), 1);

const cancelIdle =
  typeof window !== "undefined" && typeof window.cancelIdleCallback === "function"
    ? (id) => window.cancelIdleCallback(id)
    : (id) => clearTimeout(id);

function SuspenseBoundary({ children, rows = 3 }) {
  return <Suspense fallback={<RouteShell rows={rows} />}>{children}</Suspense>;
}

export default function App() {
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState("signin");
  const [user, setUser] = useState(null);
  const [authChecking, setAuthChecking] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { pathname } = location;
  const experienceRoutes = useMemo(
    () =>
      new Set([
        "/",
        "/case-studies",
        "/customers",
        "/blog",
        "/changelog",
      ]),
    [],
  );
  const enableExperience = experienceRoutes.has(pathname);

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
  const routeLoaders = useMemo(
    () => ({
      "/": () => import("./pages/Home"),
      "/pricing": () => import("./pages/Pricing"),
      "/docs": () => import("./pages/Docs"),
      "/documentation": () => import("./pages/Docs"),
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
      "/marketplace": () => import("./components/Marketplace"),
      "/products/marketplace": () => import("./components/Marketplace"),
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
    const token = window.localStorage.getItem("token");

    if (!token) {
      return;
    }

    setAuthChecking(true);

    api
      .get("/auth/me")
      .then(pick("user"))
      .then((u) => {
        if (mounted) {
          setUser(u);
        }
      })
      .catch(() => {
        if (typeof window !== "undefined") {
          window.localStorage.removeItem("token");
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

  const openAuth = (mode = "signin") => {
    setAuthMode(mode);
    setAuthOpen(true);
  };

  const signOut = () => {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem("token");
    }
    setUser(null);
    setAuthChecking(false);
    toast("Successfully signed out", { type: "info" });
    if (pathname.startsWith("/dashboard")) {
      navigate("/");
    }
  };

  const onAuthenticated = ({ token, user: u, notice }) => {
    if (token && typeof window !== "undefined") {
      window.localStorage.setItem("token", token);
    }
    if (u) {
      setUser(u);
    }
    if (notice) {
      toast(notice, { type: u?.verified ? "success" : "info" });
    }
    setAuthChecking(false);
    setAuthOpen(false);
  };

  return (
    <ExperienceLayer enableExperience={enableExperience}>
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
            <button
              className="btn btn-small"
              style={{ marginLeft: 12 }}
              onClick={async () => {
                try {
                  await api.post("/auth/resend-verification");
                  toast("Verification email sent. Check your inbox.", {
                    type: "success",
                  });
                } catch (e) {
                  toast(e.message || "Could not resend verification", {
                    type: "error",
                  });
                }
              }}
            >
              Resend link
            </button>
          </div>
        </div>
      )}

      <main className="app-shell">
        <AnimatePresence mode="wait" initial={false}>
          <Routes location={location} key={pathname}>
            <Route
              path="/"
              element={
                <SuspenseBoundary rows={6}>
                  <PageTransition>
                    <Home openAuth={openAuth} user={user} />
                  </PageTransition>
                </SuspenseBoundary>
              }
            />
            <Route
              path="/pricing"
              element={
                <SuspenseBoundary rows={4}>
                  <PageTransition>
                    <Pricing />
                  </PageTransition>
                </SuspenseBoundary>
              }
            />
            <Route
              path="/docs"
              element={
                <SuspenseBoundary rows={5}>
                  <PageTransition>
                    <Docs />
                  </PageTransition>
                </SuspenseBoundary>
              }
            />
            <Route
              path="/documentation"
              element={
                <SuspenseBoundary rows={5}>
                  <PageTransition>
                    <Docs />
                  </PageTransition>
                </SuspenseBoundary>
              }
            />
            <Route
              path="/api"
              element={
                <SuspenseBoundary rows={5}>
                  <PageTransition>
                    <ApiReference />
                  </PageTransition>
                </SuspenseBoundary>
              }
            />
            <Route
              path="/docs/api"
              element={
                <SuspenseBoundary rows={5}>
                  <PageTransition>
                    <ApiReference />
                  </PageTransition>
                </SuspenseBoundary>
              }
            />
            <Route
              path="/blog"
              element={
                <SuspenseBoundary rows={6}>
                  <PageTransition>
                    <Blog />
                  </PageTransition>
                </SuspenseBoundary>
              }
            />
            <Route
              path="/case-studies"
              element={
                <SuspenseBoundary rows={6}>
                  <PageTransition>
                    <CaseStudies />
                  </PageTransition>
                </SuspenseBoundary>
              }
            />
            <Route
              path="/customers"
              element={
                <SuspenseBoundary rows={6}>
                  <PageTransition>
                    <CaseStudies />
                  </PageTransition>
                </SuspenseBoundary>
              }
            />
            <Route
              path="/changelog"
              element={
                <SuspenseBoundary rows={4}>
                  <PageTransition>
                    <Changelog />
                  </PageTransition>
                </SuspenseBoundary>
              }
            />
            <Route
              path="/updates"
              element={
                <SuspenseBoundary rows={4}>
                  <PageTransition>
                    <Changelog />
                  </PageTransition>
                </SuspenseBoundary>
              }
            />
            <Route
              path="/help"
              element={
                <SuspenseBoundary rows={4}>
                  <PageTransition>
                    <HelpCenter />
                  </PageTransition>
                </SuspenseBoundary>
              }
            />
            <Route
              path="/support"
              element={
                <SuspenseBoundary rows={4}>
                  <PageTransition>
                    <HelpCenter />
                  </PageTransition>
                </SuspenseBoundary>
              }
            />
            <Route
              path="/status"
              element={
                <SuspenseBoundary rows={3}>
                  <PageTransition>
                    <StatusPage />
                  </PageTransition>
                </SuspenseBoundary>
              }
            />
            <Route
              path="/security"
              element={
                <SuspenseBoundary rows={3}>
                  <PageTransition>
                    <Security />
                  </PageTransition>
                </SuspenseBoundary>
              }
            />
            <Route
              path="/privacy"
              element={
                <SuspenseBoundary rows={3}>
                  <PageTransition>
                    <Privacy />
                  </PageTransition>
                </SuspenseBoundary>
              }
            />
            <Route
              path="/terms"
              element={
                <SuspenseBoundary rows={3}>
                  <PageTransition>
                    <Terms />
                  </PageTransition>
                </SuspenseBoundary>
              }
            />
            <Route
              path="/contact"
              element={
                <SuspenseBoundary rows={3}>
                  <PageTransition>
                    <Contact />
                  </PageTransition>
                </SuspenseBoundary>
              }
            />
            <Route
              path="/marketplace"
              element={
                <SuspenseBoundary rows={6}>
                  <PageTransition>
                    <Marketplace openAuth={openAuth} user={user} />
                  </PageTransition>
                </SuspenseBoundary>
              }
            />
            <Route
              path="/products/marketplace"
              element={
                <SuspenseBoundary rows={6}>
                  <PageTransition>
                    <Marketplace openAuth={openAuth} user={user} />
                  </PageTransition>
                </SuspenseBoundary>
              }
            />
            <Route
              path="/dashboard"
              element={
                <SuspenseBoundary rows={6}>
                  <PageTransition>
                    {authChecking ? (
                      <RouteShell rows={6} />
                    ) : user ? (
                      <Dashboard user={user} openAuth={openAuth} />
                    ) : (
                      <Home openAuth={openAuth} user={null} />
                    )}
                  </PageTransition>
                </SuspenseBoundary>
              }
            />
            <Route
              path="/verify"
              element={
                <SuspenseBoundary rows={3}>
                  <PageTransition>
                    <Verify onVerified={(u) => setUser(u)} />
                  </PageTransition>
                </SuspenseBoundary>
              }
            />
            <Route
              path="*"
              element={
                <SuspenseBoundary rows={6}>
                  <PageTransition>
                    <Home openAuth={openAuth} user={user} />
                  </PageTransition>
                </SuspenseBoundary>
              }
            />
          </Routes>
        </AnimatePresence>
      </main>

      <Footer />

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
    </ExperienceLayer>
  );
}