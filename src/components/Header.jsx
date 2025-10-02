import { Link, useNavigate, useLocation } from "react-router-dom";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import LogoLight from "../assets/logos/1_Primary.svg";
import LogoDark from "../assets/logos/3_Dark_Mode.svg";
import ThemeToggle from "./ThemeToggle";
import { useTheme } from "../context/ThemeContext";
import useMicroInteractions from "../hooks/useMicroInteractions";
import { space } from "../styles/spacing";

export default function Header({ user, onSignIn, onSignUp, onSignOut }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { darkMode } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [predictedNav, setPredictedNav] = useState(null);
  const predictionTimerRef = useRef(null);
  const scrollIntentRef = useRef({
    y: typeof window !== "undefined" ? window.scrollY : 0,
    time: typeof performance !== "undefined" ? performance.now() : Date.now(),
  });
  const observerRef = useRef(null);
  const { dispatchInteraction } = useMicroInteractions();

  const syncHeaderOffset = useCallback(() => {
    const header = document.querySelector(".site-header");
    if (!header) return;
    const height = Math.round(header.getBoundingClientRect().height);
    document.documentElement.style.setProperty("--header-offset", `${height}px`);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const commitPrediction = useCallback(
    (path, ttl = 1600) => {
      if (!path || path === pathname) {
        setPredictedNav(null);
        return;
      }
      setPredictedNav(path);
      if (predictionTimerRef.current && typeof window !== "undefined") {
        window.clearTimeout(predictionTimerRef.current);
      }
      if (typeof window !== "undefined") {
        predictionTimerRef.current = window.setTimeout(() => {
          setPredictedNav((current) => (current === path ? null : current));
        }, ttl);
      }
    },
    [pathname],
  );

  useEffect(() => {
    if (typeof window === "undefined") return undefined;
    const handleScroll = () => {
      const doc = document.documentElement;
      const maxScroll = doc.scrollHeight - doc.clientHeight;
      if (maxScroll <= 0) return;

      const position = window.scrollY;
      const ratio = Math.min(1, Math.max(0, position / maxScroll));
      const now = typeof performance !== "undefined" ? performance.now() : Date.now();
      const { y, time } = scrollIntentRef.current;
      const deltaY = position - y;
      const deltaTime = Math.max(now - time, 16);
      const velocity = deltaY / deltaTime;
      scrollIntentRef.current = { y: position, time: now };

      let target = null;
      if (velocity > 0.3 && ratio > 0.55) {
        target = "/pricing";
      } else if (velocity > 0.18 && ratio > 0.25) {
        target = "/marketplace";
      } else if (velocity < -0.25 && ratio < 0.12) {
        target = "/docs";
      } else if (ratio > 0.85) {
        target = "/docs";
      }

      if (target && target !== pathname) {
        commitPrediction(target, 1400);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname, commitPrediction]);

  useEffect(() => {
    if (
      typeof window === "undefined" ||
      typeof IntersectionObserver === "undefined"
    ) {
      return undefined;
    }
    const elements = Array.from(document.querySelectorAll("[data-intent-route]"));
    if (!elements.length) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const route = entry.target.dataset.intentRoute;
          if (!route || route === pathname) return;
          const threshold = Number(entry.target.dataset.intentThreshold || 0.4);
          if (entry.isIntersecting && entry.intersectionRatio >= threshold) {
            commitPrediction(route, 1800);
          }
        });
      },
      { threshold: [0.25, 0.4, 0.6] },
    );

    elements.forEach((element) => observer.observe(element));
    observerRef.current = observer;

    return () => {
      observer.disconnect();
      observerRef.current = null;
    };
  }, [pathname, commitPrediction]);

  useEffect(() => {
    return () => {
      if (predictionTimerRef.current && typeof window !== "undefined") {
        window.clearTimeout(predictionTimerRef.current);
      }
      observerRef.current?.disconnect();
    };
  }, []);

  useEffect(() => {
    setPredictedNav(null);
  }, [pathname]);

  useEffect(() => {
    syncHeaderOffset();
    window.addEventListener("resize", syncHeaderOffset, { passive: true });
    return () => window.removeEventListener("resize", syncHeaderOffset);
    }, [syncHeaderOffset]);

    useEffect(() => {
    const frame = window.requestAnimationFrame(syncHeaderOffset);
    return () => window.cancelAnimationFrame(frame);
  }, [scrolled, syncHeaderOffset]);

  const navItems = useMemo(
    () => [
      { path: "/marketplace", label: "Marketplace" },
      { path: "/pricing", label: "Pricing" },
      { path: "/docs", label: "Docs" },
    ],
    []
  );

  const headerBackground = useMemo(
    () => ({
      background: darkMode
        ? "linear-gradient(120deg, rgba(15, 23, 42, 0.96), rgba(30, 41, 59, 0.9))"
        : "linear-gradient(120deg, rgba(255, 255, 255, 0.95), rgba(226, 232, 240, 0.9))",
      borderBottom: `1px solid ${darkMode ? "rgba(148, 163, 184, 0.28)" : "rgba(148, 163, 184, 0.35)"}`,
      boxShadow: scrolled
        ? darkMode
          ? "0 20px 45px rgba(8, 15, 34, 0.65)"
          : "0 20px 45px rgba(148, 163, 184, 0.45)"
        : "none",
    }),
    [darkMode, scrolled]
  );

  return (
    <header
      className={`site-header ${scrolled ? "scrolled" : ""}`}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        padding: scrolled ? `${space("xs", 1.3)} 0` : `${space("sm")} 0`,
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        transition: "all var(--transition-normal)",
        ...headerBackground,
      }}
    >
      <div
        className="header-inner"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          maxWidth: "1200px",
          margin: "0 auto",
          padding: `0 ${space("md", 1.1667)}`,
          position: "relative",
        }}
      >
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "1.5rem",
            background: darkMode
              ? "radial-gradient(circle at 20% 20%, rgba(99,102,241,0.18), transparent 55%), radial-gradient(circle at 80% 30%, rgba(6,182,212,0.18), transparent 55%)"
              : "radial-gradient(circle at 20% 20%, rgba(99,102,241,0.12), transparent 55%), radial-gradient(circle at 80% 30%, rgba(6,182,212,0.12), transparent 55%)",
            opacity: scrolled ? 1 : 0.65,
            transition: "opacity var(--transition-normal)",
            pointerEvents: "none",
          }}
        />

        <div
          className="brand"
          onClick={() => navigate("/")}
          role="button"
          tabIndex={0}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              navigate("/");
            }
          }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: space("xs", 1.5),
            cursor: "pointer",
            position: "relative",
            zIndex: 1,
            padding: `${space("2xs", 1.4)} ${space("xs")}`,
            borderRadius: "0.9rem",
            transition: "transform var(--transition-fast)",
          }}
        >
          <img
            src={darkMode ? LogoDark : LogoLight}
            alt="Artifically"
            style={{
              height: "56px",
              width: "auto",
              display: "block",
              filter: darkMode
                ? "drop-shadow(0 0 10px rgba(99, 102, 241, 0.55))"
                : "drop-shadow(0 0 6px rgba(99, 102, 241, 0.35))",
              transition: "filter var(--transition-normal)",
            }}
          />
        </div>

        <nav
          className="nav"
          style={{
            display: "flex",
            alignItems: "center",
            gap: space("md"),
            position: "relative",
            zIndex: 1,
          }}
        >
          {navItems.map(({ path, label }) => {
            const isActive = pathname === path;
            const isPredicted = !isActive && predictedNav === path;
            return (
              <Link
                key={path}
                to={path}
                data-prefetch-route={path}
                className="nav-item"
                data-predicted={isPredicted}
                style={{
                  position: "relative",
                  padding: `${space("xs", 1.1)} ${space("sm", 1.15)}`,
                  borderRadius: "0.85rem",
                  textDecoration: "none",
                  fontWeight: 600,
                  letterSpacing: "0.01em",
                  color: isActive
                    ? darkMode
                      ? "#ffffff"
                      : "#0f172a"
                      : isPredicted
                    ? darkMode
                      ? "#f8fafc"
                      : "#0f172a"
                    : darkMode
                    ? "#cbd5e1"
                    : "#475569",
                  background: isActive
                    ? darkMode
                      ? "rgba(148, 163, 184, 0.16)"
                      : "rgba(99, 102, 241, 0.15)"
                      : isPredicted
                      ? darkMode
                        ? "rgba(99, 102, 241, 0.18)"
                        : "rgba(99, 102, 241, 0.12)"
                    : "transparent",
                    boxShadow: isPredicted
                      ? "0 12px 28px rgba(99, 102, 241, 0.35)"
                      : "none",
                    transform: isPredicted ? "translateY(-2px)" : "none",
                  transition: "all var(--transition-fast)",
                }}
              >
                {label}
                <span
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    inset: "auto 15% -6px 15%",
                    height: "2px",
                    borderRadius: "999px",
                    background: isActive
                      ? "linear-gradient(90deg, #6366f1 0%, #06b6d4 100%)"
                      : isPredicted
                        ? "linear-gradient(90deg, rgba(99, 102, 241, 0.8) 0%, rgba(14, 165, 233, 0.6) 100%)"
                      : "transparent",
                    transition: "opacity var(--transition-fast)",
                  }}
                />
              </Link>
            );
          })}
        </nav>

        <div
          className="header-actions"
          style={{
            display: "flex",
            alignItems: "center",
            gap: space("sm"),
            position: "relative",
            zIndex: 1,
          }}
        >
          <ThemeToggle />

          {user ? (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: space("xs", 1.5),
              }}
            >
              <button
                type="button"
                className="btn btn-ghost"
                data-prefetch-route="/dashboard"
                data-magnetic="true"
                data-magnetic-strength="0.75"
                onClick={(event) => {
                  dispatchInteraction("cta-secondary", { event });
                  navigate("/dashboard");
                }}
                style={{
                  padding: `${space("xs")} ${space("sm", 1.15)}`,
                  borderRadius: "0.85rem",
                  border: `1px solid ${darkMode ? "rgba(148, 163, 184, 0.35)" : "rgba(148, 163, 184, 0.45)"}`,
                  background: darkMode
                    ? "rgba(148, 163, 184, 0.18)"
                    : "rgba(99, 102, 241, 0.12)",
                  color: darkMode ? "#e2e8f0" : "#1f2937",
                  transition: "all var(--transition-fast)",
                }}
              >
                Dashboard
              </button>
              <button
                type="button"
                className="btn btn-primary"
                data-prefetch-route="/signout"
                data-magnetic="true"
                data-ripple="true"
                onClick={(event) => {
                  dispatchInteraction("cta-ghost", { event });
                  onSignOut?.(event);
                }}
                style={{
                  padding: `${space("xs")} ${space("fluid-sm")}`,
                  borderRadius: "0.85rem",
                  boxShadow: darkMode
                    ? "0 18px 30px rgba(99, 102, 241, 0.35)"
                    : "0 18px 30px rgba(99, 102, 241, 0.25)",
                }}
              >
                Sign out
              </button>
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: space("xs", 1.5),
              }}
            >
              <button
                type="button"
                className="btn btn-ghost"
                data-prefetch-route="/signin"
                data-magnetic="true"
                data-magnetic-strength="0.75"
                onClick={(event) => {
                  dispatchInteraction("cta-secondary", { event });
                  onSignIn?.(event);
                }}
                style={{
                  padding: `${space("xs")} ${space("sm", 1.1)}`,
                  borderRadius: "0.85rem",
                  border: `1px solid ${darkMode ? "rgba(148, 163, 184, 0.35)" : "rgba(148, 163, 184, 0.45)"}`,
                  background: darkMode
                    ? "rgba(148, 163, 184, 0.18)"
                    : "rgba(99, 102, 241, 0.12)",
                  color: darkMode ? "#e2e8f0" : "#1f2937",
                  transition: "all var(--transition-fast)",
                }}
              >
                Sign in
              </button>
              <button
                type="button"
                className="btn btn-primary"
                data-prefetch-route="/signup"
                data-magnetic="true"
                data-ripple="true"
                onClick={(event) => {
                  dispatchInteraction("cta-primary", { event });
                  onSignUp?.(event);
                }}
                style={{
                  padding: `${space("xs")} ${space("fluid-sm")}`,
                  borderRadius: "0.85rem",
                  boxShadow: darkMode
                    ? "0 18px 30px rgba(99, 102, 241, 0.35)"
                    : "0 18px 30px rgba(99, 102, 241, 0.25)",
                }}
              >
                Get started
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}