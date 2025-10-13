import { Link, useNavigate, useLocation } from "react-router-dom";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import LogoLight from "../assets/logos/1_Primary.svg";
import LogoDark from "../assets/logos/3_Dark_Mode.svg";
import ThemeToggle from "./ThemeToggle";
import { useTheme } from "../context/ThemeContext";
import useMicroInteractions from "../hooks/useMicroInteractions";
import { space } from "../styles/spacing";
import MagneticButton from "./animation/MagneticButton";
import { StaggeredContainer, StaggeredItem } from "./animation/StaggeredList";

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
  const isServer = typeof window === "undefined";
  const [headerReady, setHeaderReady] = useState(isServer);

  const syncHeaderOffset = useCallback(() => {
    const header = document.querySelector(".site-header");
    if (!header) return;
    const height = Math.round(header.getBoundingClientRect().height);
    document.documentElement.style.setProperty("--header-offset", `${height}px`);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 1);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isServer) return undefined;

    const timer = window.setTimeout(() => setHeaderReady(true), 0);
    return () => window.clearTimeout(timer);
  }, [isServer]);

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
        padding: `${space("sm")} 0`,
        transition: "background 280ms ease, box-shadow 280ms ease, opacity 360ms ease, transform 360ms ease",
        opacity: headerReady ? 1 : 0,
        transform: headerReady ? "translateY(0)" : "translateY(-24px)",
        ...headerBackground,
      }}
      data-ready={headerReady ? "true" : "false"}
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
          className="brand brand--interactive"
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
            width={375}
            height={375}
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
            position: "relative",
            zIndex: 1,
          }}
        >
          <StaggeredContainer
            className="nav-items"
            style={{
              display: "flex",
              alignItems: "center",
              gap: space("md"),
            }}
          >
            {navItems.map(({ path, label }, index) => {
              const isActive = pathname === path;
              const isPredicted = !isActive && predictedNav === path;
              return (
                <StaggeredItem
                  key={path}
                  index={index}
                  style={{ display: "flex" }}
                >
                  <Link
                    to={path}
                    data-prefetch-route={path}
                    className="nav-item"
                    transition={{ type: "spring", stiffness: 320, damping: 24 }}
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
                      "--nav-translate": isPredicted ? "-2px" : "0px",
                      transition:
                        "transform 180ms cubic-bezier(0.33, 1, 0.68, 1), box-shadow 220ms ease, background 220ms ease, color 180ms ease",
                      willChange: "transform",
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
                </StaggeredItem>
              );
            })}
          </StaggeredContainer>
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
              <MagneticButton
                type="button"
                size="sm"
                variant="secondary"
                data-prefetch-route="/dashboard"
                glowOnHover={false}
                onClick={(event) => {
                  dispatchInteraction("cta-secondary", { event });
                  navigate("/dashboard");
                }}
              >
                Dashboard
              </MagneticButton>
              <MagneticButton
                type="button"
                size="sm"
                variant="primary"
                data-prefetch-route="/signout"
                onClick={(event) => {
                  dispatchInteraction("cta-ghost", { event });
                  onSignOut?.(event);
                }}
              >
                <span>Sign out</span>
              </MagneticButton>
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: space("xs", 1.5),
              }}
            >
              <MagneticButton
                type="button"
                size="sm"
                variant="secondary"
                data-prefetch-route="/signin"
                glowOnHover={false}
                onClick={(event) => {
                  dispatchInteraction("cta-secondary", { event });
                  onSignIn?.(event);
                }}
              >
                Sign in
              </MagneticButton>
              <MagneticButton
                type="button"
                size="sm"
                variant="primary"
                data-prefetch-route="/signup"
                onClick={(event) => {
                  dispatchInteraction("cta-primary", { event });
                  onSignUp?.(event);
                }}
              >
                <span>Get started</span>
              </MagneticButton>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}