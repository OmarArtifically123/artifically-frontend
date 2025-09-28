import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";
import { useTheme } from "../context/ThemeContext";
import { motion } from "../lib/motion";

const BADGES = [
  { icon: "⚡", label: "Deploy in minutes" },
  { icon: "🔒", label: "Enterprise security" },
  { icon: "📊", label: "Transparent pricing" },
  { icon: "🚀", label: "Scale infinitely" },
];

export default function Hero() {
  const { darkMode } = useTheme();
  const [magneticStrength] = useState(1.2);

  const badgeGradients = useMemo(() => {
    return BADGES.map((_, idx) => {
      const baseHue = (210 + idx * 36) % 360;
      const secondaryHue = (baseHue + 60) % 360;
      return {
        background: `linear-gradient(135deg, hsla(${baseHue.toFixed(1)}, 90%, ${darkMode ? 62 : 68}%, ${darkMode ? 0.38 : 0.5}), hsla(${secondaryHue.toFixed(
          1
        )}, 90%, ${darkMode ? 50 : 58}%, ${darkMode ? 0.32 : 0.45}))`,
        boxShadow: darkMode
          ? "0 18px 32px rgba(30, 64, 175, 0.35)"
          : "0 18px 36px rgba(99, 102, 241, 0.24)",
      };
    });
  }, [darkMode]);

  const scrollToMarketplace = () => {
    const el = document.getElementById("marketplace");
    if (!el) return;

    const header = document.querySelector(".site-header");
    const headerHeight = header ? header.offsetHeight : 80;
    const elementPosition = el.getBoundingClientRect().top + window.pageYOffset;
    const offsetPosition = elementPosition - headerHeight - 20;

    const startPosition = window.pageYOffset;
    const distance = offsetPosition - startPosition;
    const duration = 900;
    let start = null;

    const smoothScrollStep = (timestamp) => {
      if (!start) start = timestamp;
      const progress = timestamp - start;
      const progressPercentage = Math.min(progress / duration, 1);
      const ease =
        progressPercentage < 0.5
          ? 4 * progressPercentage * progressPercentage * progressPercentage
          : 1 - Math.pow(-2 * progressPercentage + 2, 3) / 2;

      window.scrollTo(0, startPosition + distance * ease);
      if (progress < duration) {
        requestAnimationFrame(smoothScrollStep);
      }
    };

    requestAnimationFrame(smoothScrollStep);
  };

  return (
    <motion.section
      className="hero"
      data-glass="true"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ stiffness: 210, damping: 26 }}
      style={{
        position: "relative",
        padding: "8rem 0 6rem",
        color: darkMode ? "#f8fafc" : "#0f172a",
        overflow: "hidden",
        borderRadius: "2.5rem",
        margin: "4rem auto",
        width: "min(92vw, 1120px)",
      }}
    >
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          background: darkMode
            ? "radial-gradient(circle at 20% 20%, rgba(99,102,241,0.25), transparent 55%), radial-gradient(circle at 80% 30%, rgba(6,182,212,0.2), transparent 55%)"
            : "radial-gradient(circle at 20% 20%, rgba(99,102,241,0.18), transparent 55%), radial-gradient(circle at 80% 30%, rgba(6,182,212,0.16), transparent 55%)",
          filter: "blur(0px)",
          pointerEvents: "none",
        }}
      />

      <motion.div
        className="container"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.12, stiffness: 180, damping: 20 }}
        style={{
          position: "relative",
          zIndex: 1,
          display: "grid",
          gap: "2.5rem",
        }}
      >
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            gap: "1rem",
            alignItems: "center",
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.75rem",
              padding: "0.45rem 0.85rem",
              borderRadius: "999px",
              background: darkMode ? "rgba(148,163,184,0.18)" : "rgba(99,102,241,0.12)",
              border: `1px solid ${darkMode ? "rgba(148,163,184,0.3)" : "rgba(99,102,241,0.2)"}`,
              fontSize: "0.85rem",
              fontWeight: 600,
              letterSpacing: "0.04em",
              textTransform: "uppercase",
            }}
          >
            <span aria-hidden="true">✨</span>
            Interactive experiences engineered for trust
          </div>
          <ThemeToggle />
        </div>

        <div
          style={{
            display: "grid",
            gap: "1.5rem",
            maxWidth: "760px",
          }}
        >
          <motion.h1
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, stiffness: 200, damping: 18 }}
            style={{
              fontSize: "clamp(2.8rem, 5vw, 4.2rem)",
              fontWeight: 800,
              letterSpacing: "-0.03em",
              lineHeight: 1.1,
              fontFamily: "'Inter', 'Manrope', var(--font-sans)",
            }}
          >
            Deploy Enterprise AI Automations in Minutes
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 36 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.28, stiffness: 180, damping: 22 }}
            style={{
              fontSize: "1.15rem",
              lineHeight: 1.7,
              color: darkMode ? "#cbd5e1" : "#475569",
              maxWidth: "680px",
            }}
          >
            Transform your business operations with battle-tested AI automations. Choose, configure, and deploy in under 10 minutes. No complex workflows—just measurable outcomes.
          </motion.p>

          <div
            className="hero-ctas"
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "1rem",
            }}
          >
            <motion.button
              onClick={scrollToMarketplace}
              className="btn btn-primary"
              data-magnetic="true"
              data-ripple="true"
              data-magnetic-strength={magneticStrength}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.34, stiffness: 200, damping: 20 }}
              style={{
                padding: "0.85rem 1.6rem",
                borderRadius: "0.95rem",
                fontSize: "1rem",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.65rem",
                boxShadow: darkMode
                  ? "0 25px 45px rgba(99, 102, 241, 0.35)"
                  : "0 25px 45px rgba(99, 102, 241, 0.25)",
              }}
            >
              Explore Marketplace
              <span aria-hidden="true">→</span>
            </motion.button>
            <motion.span
              initial={{ opacity: 0, y: 44 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.38, stiffness: 200, damping: 20 }}
            >
              <Link
                to="/docs"
                className="btn btn-secondary"
                data-magnetic="true"
                data-ripple="true"
                data-magnetic-strength={magneticStrength * 0.65}
                style={{
                  padding: "0.85rem 1.6rem",
                  borderRadius: "0.95rem",
                  fontSize: "1rem",
                  border: `1px solid ${darkMode ? "rgba(148,163,184,0.35)" : "rgba(99,102,241,0.25)"}`,
                  background: darkMode ? "rgba(15,23,42,0.75)" : "rgba(255,255,255,0.95)",
                  color: darkMode ? "#e2e8f0" : "#1f2937",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.65rem",
                }}
              >
                View Documentation
              </Link>
            </motion.span>
          </div>

          <div
            className="hero-badges"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "1rem",
            }}
          >
            {BADGES.map((badge, idx) => (
              <motion.span
                key={badge.label}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.42 + idx * 0.08, stiffness: 210, damping: 22 }}
                className="neumorphic"
                style={{
                  padding: "0.75rem 1rem",
                  borderRadius: "0.9rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  color: darkMode ? "#cbd5e1" : "#1f2937",
                }}
              >
                <span
                  aria-hidden="true"
                  style={{
                    width: "2.75rem",
                    height: "2.75rem",
                    borderRadius: "0.85rem",
                    display: "grid",
                    placeItems: "center",
                    fontSize: "1.35rem",
                    color: "#fff",
                    transition: "background 220ms ease, box-shadow 220ms ease",
                    ...badgeGradients[idx],
                  }}
                >
                  {badge.icon}
                </span>
                <span style={{ fontWeight: 600 }}>{badge.label}</span>
              </motion.span>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.section>
  );
}