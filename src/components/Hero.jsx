import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";
import { useTheme } from "../context/ThemeContext";
import { motion } from "../lib/motion";

const MORPH_VALUES = [
  "M24 6c6.627 0 12 5.373 12 12s-5.373 12-12 12-12-5.373-12-12S17.373 6 24 6z",
  "M12 12c4-6 20-6 24 0s4 20-4 24-20 4-24-4-4-20 4-24z",
  "M24 6l14 8v16l-14 8-14-8V14l14-8z",
].join("; ");

function MorphingIcon() {
  const [hue, setHue] = useState(210);

  useEffect(() => {
    let rafId;
    const update = () => {
      setHue((current) => (current + 0.35) % 360);
      rafId = requestAnimationFrame(update);
    };
    rafId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <svg width="56" height="56" viewBox="0 0 48 48" aria-hidden="true">
      <defs>
        <linearGradient id="heroMorphGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={`hsla(${hue}, 92%, 65%, 0.95)`} />
          <stop offset="100%" stopColor={`hsla(${(hue + 60) % 360}, 92%, 55%, 0.85)`} />
        </linearGradient>
      </defs>
      <path fill="url(#heroMorphGradient)" d="M24 6c6.627 0 12 5.373 12 12s-5.373 12-12 12-12-5.373-12-12S17.373 6 24 6z">
        <animate attributeName="d" dur="12s" repeatCount="indefinite" values={MORPH_VALUES} keyTimes="0;0.5;1" />
      </path>
    </svg>
  );
}

export default function Hero() {
  const { darkMode } = useTheme();
  const [magneticStrength] = useState(1.2);

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
            {["⚡ Deploy in minutes", "🔒 Enterprise security", "📊 Transparent pricing", "🚀 Scale infinitely"].map((label, idx) => (
              <motion.span
                key={label}
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
                <MorphingIcon />
                {label}
              </motion.span>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.section>
  );
}