import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const heroStats = [
  { label: "Automations", value: 12500, suffix: "+" },
  { label: "Uptime", value: 98.6, suffix: "%" },
  { label: "ROI", value: 4.8, suffix: "x" },
];

const defaultLogos = [
  "Northwind", "Aurora", "Nimbus", "Atlas", "Velocity", "Zenith", "Skyline", "Lumen",
];

export default function HeroSection({ onPrimary, onSecondary }) {
  const gradientId = useMemo(() => `heroGradient-${Math.random().toString(36).slice(2)}`, []);

  return (
    <section className="page-hero" aria-labelledby="hero-headline">
      <div className="page-hero__inner">
        <div className="page-hero__content">
          <span className="page-hero__eyebrow">⚡ The Future of AI Automation</span>
          <h1 id="hero-headline" className="page-hero__headline">
            Deploy Enterprise AI <span>Automations</span> in Minutes
          </h1>
          <p className="page-hero__subheadline">
            Transform operations with battle-tested automations. No setup hell. No vendor lock-in. Just results.
          </p>
          <div className="cta-group">
            <button type="button" className="cta-primary" onClick={onPrimary}>
              Start Free Trial
            </button>
            <button type="button" className="cta-secondary" onClick={onSecondary}>
              Watch Demo → <Badge>2 min</Badge>
            </button>
          </div>
          <HeroStats stats={heroStats} />
          <LogoTicker logos={defaultLogos} gradientId={gradientId} />
        </div>
        <div className="page-hero__preview" id="product-preview">
          <article className="preview-card">
            <span className="preview-card__chip">Live product preview</span>
            <div className="preview-card__stage" role="img" aria-label="3D preview of automation workflow">
              <PreviewScene />
            </div>
            <p className="preview-card__annotation">
              "We launched our global support automation in under 2 hours. Artifically handled auth, routing, and reporting out of the box."
              <span style={{ fontSize: "0.85rem", opacity: 0.75 }}>— Elena Ruiz, VP Operations</span>
            </p>
          </article>
        </div>
        <ScrollIndicator targetId="problem-solution" />
      </div>
    </section>
  );
}

function HeroStats({ stats }) {
  return (
    <div className="hero-stats" aria-label="Key platform metrics">
      {stats.map((stat) => (
        <StatCounter key={stat.label} {...stat} />
      ))}
    </div>
  );
}

function StatCounter({ value, suffix = "", label }) {
  const [display, setDisplay] = useState(0);
  const rafRef = useRef();

  useEffect(() => {
    const start = performance.now();
    const duration = 1800;

    const animate = (now) => {
      const progress = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(value * eased);
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      }
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(rafRef.current);
  }, [value]);

  const formatted = useMemo(() => {
    if (value >= 1000) {
      return `${Math.round(display).toLocaleString()}${suffix}`;
    }
    return `${display.toFixed(value % 1 === 0 ? 0 : 1)}${suffix}`;
  }, [display, suffix, value]);

  return (
    <div className="hero-stat">
      <span className="hero-stat__value">{formatted}</span>
      <span className="hero-stat__label">{label}</span>
    </div>
  );
}

function LogoTicker({ logos, gradientId }) {
  return (
    <div aria-label="Trusted by leading teams" style={{ display: "grid", gap: "0.75rem" }}>
      <span style={{ fontSize: "0.85rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "color-mix(in oklch, white 72%, var(--gray-400))" }}>
        Trusted by teams shipping AI in production
      </span>
      <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap", alignItems: "center" }}>
        {logos.map((logo) => (
          <span
            key={logo}
            style={{
              padding: "0.65rem 1rem",
              borderRadius: "999px",
              border: "1px solid color-mix(in oklch, white 12%, transparent)",
              background: "color-mix(in oklch, var(--glass-2) 70%, transparent)",
              fontSize: "0.85rem",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "color-mix(in oklch, white 70%, var(--gray-300))",
            }}
          >
            {logo}
          </span>
        ))}
      </div>
      <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="var(--brand-glow)" />
          <stop offset="100%" stopColor="var(--brand-energy)" />
        </linearGradient>
      </svg>
    </div>
  );
}

function PreviewScene() {
  return (
    <div style={{ display: "grid", justifyItems: "center", gap: "1rem", color: "color-mix(in oklch, white 82%, var(--gray-200))" }}>
      <div
        style={{
          width: "68%",
          aspectRatio: "1 / 1",
          borderRadius: "24px",
          border: "1px solid color-mix(in oklch, white 12%, transparent)",
          background:
            "radial-gradient(circle at 30% 30%, color-mix(in oklch, var(--brand-glow) 35%, transparent) 0%, transparent 60%)," +
            "radial-gradient(circle at 70% 70%, color-mix(in oklch, var(--brand-energy) 30%, transparent) 0%, transparent 65%)",
          boxShadow: "0 30px 65px color-mix(in oklch, var(--brand-glow) 28%, transparent)",
          display: "grid",
          placeItems: "center",
        }}
      >
        <span style={{ fontSize: "2.5rem" }}>🛠️</span>
      </div>
      <div style={{ fontSize: "0.9rem", textAlign: "center", maxWidth: "28ch" }}>
        Interactive workflow nodes update in real-time as data flows through your automation.
      </div>
    </div>
  );
}

function Badge({ children }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "0.15rem 0.5rem",
        borderRadius: "0.6rem",
        background: "color-mix(in oklch, var(--brand-glow) 45%, transparent)",
        color: "color-mix(in oklch, white 85%, var(--gray-50))",
        fontSize: "0.75rem",
        fontWeight: 600,
        letterSpacing: "0.06em",
        textTransform: "uppercase",
      }}
    >
      {children}
    </span>
  );
}

function ScrollIndicator({ targetId }) {
  const handleScroll = useCallback(() => {
    if (!targetId) return;
    const target = document.getElementById(targetId);
    target?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [targetId]);

  return (
    <button
      type="button"
      className="hero-scroll-indicator hero__scroll"
      onClick={handleScroll}
      aria-label="Scroll to explore more content"
    >
      <span className="hero-scroll-indicator__track">
        <span className="hero-scroll-indicator__dot" />
      </span>
      <span className="hero-scroll-indicator__label">Scroll</span>
    </button>
  );
}