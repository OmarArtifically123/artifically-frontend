import { Link } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";
import { useTheme } from "../context/ThemeContext";

export default function Hero() {
  const { darkMode } = useTheme();

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
    <section
      className="hero"
      style={{
        position: "relative",
        padding: "8rem 0 6rem",
        color: darkMode ? "#f8fafc" : "#0f172a",
        overflow: "hidden",
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

      <div
        className="container"
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
          <h1
            style={{
              fontSize: "clamp(2.8rem, 5vw, 4.2rem)",
              fontWeight: 800,
              letterSpacing: "-0.03em",
              lineHeight: 1.1,
            }}
          >
            Deploy Enterprise AI Automations in Minutes
          </h1>

          <p
            style={{
              fontSize: "1.15rem",
              lineHeight: 1.7,
              color: darkMode ? "#cbd5e1" : "#475569",
              maxWidth: "680px",
            }}
          >
            Transform your business operations with battle-tested AI automations. Choose, configure, and deploy in under 10 minutes. No complex workflows—just measurable outcomes.
          </p>

          <div
            className="hero-ctas"
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "1rem",
            }}
          >
            <button
              onClick={scrollToMarketplace}
              className="btn btn-primary"
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
            </button>
            <Link
              to="/docs"
              className="btn btn-secondary"
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
          </div>

          <div
            className="hero-badges"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "1rem",
            }}
          >
            {[
              "⚡ Deploy in minutes",
              "🔒 Enterprise security",
              "📊 Transparent pricing",
              "🚀 Scale infinitely",
            ].map((label) => (
              <span
                key={label}
                style={{
                  padding: "0.75rem 1rem",
                  borderRadius: "0.9rem",
                  background: darkMode ? "rgba(15,23,42,0.7)" : "rgba(255,255,255,0.9)",
                  border: `1px solid ${darkMode ? "rgba(148,163,184,0.22)" : "rgba(148,163,184,0.35)"}`,
                  fontWeight: 600,
                  color: darkMode ? "#cbd5e1" : "#1f2937",
                }}
              >
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}