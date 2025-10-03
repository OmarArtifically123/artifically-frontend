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
      background: darkMode ? "var(--glass-gradient-primary)" : "var(--glass-gradient-primary-light)",
      borderBottom: `1px solid ${darkMode ? "var(--glass-border-primary)" : "var(--glass-border-primary-light)"}`,
      boxShadow: scrolled
        ? darkMode
          ? "var(--shadow-ambient), var(--shadow-glow)"
          : "var(--shadow-md)"
        : "inset 0 1px 0 0 var(--glass-highlight)",
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
        backdropFilter: "blur(40px) saturate(180%)",
        WebkitBackdropFilter: "blur(40px) saturate(180%)",
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
              ? "radial-gradient(circle at 20% 20%, color-mix(in oklch, var(--brand-energy) 30%, transparent), transparent 55%), radial-gradient(circle at 80% 30%, color-mix(in oklch, var(--brand-glow) 35%, transparent), transparent 55%)"
              : "radial-gradient(circle at 20% 20%, color-mix(in oklch, var(--brand-energy) 24%, transparent), transparent 55%), radial-gradient(circle at 80% 30%, color-mix(in oklch, var(--brand-glow) 28%, transparent), transparent 55%)",
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
                ? "drop-shadow(0 0 16px color-mix(in oklch, var(--brand-glow) 55%, transparent))"
                : "drop-shadow(0 0 10px color-mix(in oklch, var(--brand-primary) 45%, transparent))",
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
                    ? "var(--text-primary)"
                    : isPredicted
                    ? "color-mix(in oklch, var(--brand-glow) 60%, var(--text-primary))"
                    : "color-mix(in oklch, var(--text-secondary) 85%, transparent)",
                  background: isActive
                    ? "color-mix(in oklch, var(--brand-primary) 22%, transparent)"
                    : isPredicted
                    ? "color-mix(in oklch, var(--brand-glow) 18%, transparent)"
                    : "color-mix(in oklch, var(--glass-2) 40%, transparent)",
                  boxShadow: isPredicted
                    ? "0 12px 28px color-mix(in srgb, var(--brand-primary) 55%, transparent)"
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
                      ? "linear-gradient(90deg, var(--brand-primary) 0%, var(--brand-glow) 50%, var(--brand-energy) 100%)"
                      : isPredicted
                        ? "linear-gradient(90deg, color-mix(in oklch, var(--brand-primary) 70%, transparent) 0%, color-mix(in oklch, var(--brand-glow) 75%, transparent) 100%)"
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
                data-micro-manual="true"
                onClick={(event) => {
                  dispatchInteraction("cta-secondary", { event });
                  navigate("/dashboard");
                }}
                style={{
                  padding: `${space("xs")} ${space("sm", 1.15)}`,
                  borderRadius: "0.85rem",
                  border: `1px solid ${darkMode
                    ? "color-mix(in oklch, var(--text-secondary) 45%, transparent)"
                    : "color-mix(in oklch, var(--brand-primary) 35%, transparent)"}`,
                  background: darkMode
                    ? "color-mix(in oklch, var(--glass-2) 65%, transparent)"
                    : "color-mix(in oklch, var(--brand-primary) 22%, transparent)",
                  color: darkMode
                    ? "color-mix(in oklch, var(--text-primary) 95%, transparent)"
                    : "color-mix(in oklch, var(--brand-depth) 85%, transparent)",
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
                data-micro-manual="true"
                onClick={(event) => {
                  dispatchInteraction("cta-ghost", { event });
                  onSignOut?.(event);
                }}
                style={{
                  padding: `${space("xs")} ${space("fluid-sm")}`,
                  borderRadius: "0.85rem",
                  boxShadow: darkMode
                    ? "0 18px 30px color-mix(in srgb, var(--brand-glow) 45%, transparent)"
                    : "0 18px 30px color-mix(in srgb, var(--brand-primary) 35%, transparent)",
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
                data-micro-manual="true"
                onClick={(event) => {
                  dispatchInteraction("cta-secondary", { event });
                  onSignIn?.(event);
                }}
                style={{
                  padding: `${space("xs")} ${space("sm", 1.1)}`,
                  borderRadius: "0.85rem",
                  border: `1px solid ${darkMode
                    ? "color-mix(in oklch, var(--text-secondary) 45%, transparent)"
                    : "color-mix(in oklch, var(--brand-primary) 35%, transparent)"}`,
                  background: darkMode
                    ? "color-mix(in oklch, var(--glass-2) 65%, transparent)"
                    : "color-mix(in oklch, var(--brand-primary) 22%, transparent)",
                  color: darkMode
                    ? "color-mix(in oklch, var(--text-primary) 95%, transparent)"
                    : "color-mix(in oklch, var(--brand-depth) 85%, transparent)",
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
                data-micro-manual="true"
                onClick={(event) => {
                  dispatchInteraction("cta-primary", { event });
                  onSignUp?.(event);
                }}
                style={{
                  padding: `${space("xs")} ${space("fluid-sm")}`,
                  borderRadius: "0.85rem",
                  boxShadow: darkMode
                    ? "0 18px 30px color-mix(in srgb, var(--brand-glow) 45%, transparent)"
                    : "0 18px 30px color-mix(in srgb, var(--brand-primary) 35%, transparent)",
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