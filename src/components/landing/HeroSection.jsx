import { useEffect, useMemo, useRef, useState } from "react";
import useDocumentVisibility from "../../hooks/useDocumentVisibility";
import HeroBackground from "./HeroBackground";
import ProductPreview3D from "./ProductPreview3D";
import ScrollIndicator from "./ScrollIndicator";

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
      <HeroBackground variant="particles" />
      <div className="page-hero__inner">
        <div className="page-hero__content">
          <span className="page-hero__eyebrow">⚡ The Future of AI Automation</span>
          <h1 id="hero-headline" className="page-hero__headline">
            Deploy Enterprise AI <GradientText>Automations</GradientText> in Minutes
          </h1>
          <p className="page-hero__subheadline">
            Transform operations with battle-tested automations. No setup hell. No vendor lock-in. Just results.
          </p>
          <div className="cta-group">
            <button type="button" className="cta-primary" onClick={onPrimary}>
              Start Free Trial
            </button>
            <button type="button" className="cta-secondary" onClick={onSecondary}>
              Watch Demo → <VideoBadge duration="2 min" />
            </button>
          </div>
          <HeroStats stats={heroStats} />
          <LogoTicker logos={defaultLogos} gradientId={gradientId} />
        </div>
        <div className="page-hero__preview" id="product-preview">
          <article className="preview-card">
            <span className="preview-card__chip">Live product preview</span>
            <div className="preview-card__stage">
              <ProductPreview3D label="3D preview of automation workflow" />
            </div>
            <p className="preview-card__annotation">
              "We launched our global support automation in under 2 hours. Artifically handled auth, routing, and reporting out of the box."
              <span style={{ fontSize: "0.85rem", opacity: 0.75 }}>— Elena Ruiz, VP Operations</span>
            </p>
          </article>
        </div>
      </div>
      <ScrollIndicator targetId="problem-solution" />
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
  const nodeRef = useRef(null);
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const isDocumentVisible = useDocumentVisibility();
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
      return false;
    }
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });
  const hasAnimatedRef = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
      return undefined;
    }

    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handleChange = (event) => setPrefersReducedMotion(event.matches);
    if (typeof media.addEventListener === "function") {
      media.addEventListener("change", handleChange);
      return () => media.removeEventListener("change", handleChange);
    }

    media.addListener(handleChange);
    return () => media.removeListener(handleChange);
  }, []);

  useEffect(() => {
    const node = nodeRef.current;
    if (!node || typeof IntersectionObserver === "undefined") {
      setShouldAnimate(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.target === node) {
            setShouldAnimate(entry.isIntersecting);
          }
        });
      },
      { threshold: 0.35 },
    );

    observer.observe(node);

    return () => {
      observer.unobserve(node);
      observer.disconnect();
    };
  }, []);

  const canAnimate = shouldAnimate && isDocumentVisible;

  useEffect(() => {
    if (prefersReducedMotion) {
      setDisplay(value);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      return () => {};
    }

    if (!canAnimate) {
      if (!hasAnimatedRef.current) {
        setDisplay(0);
      }
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      return () => {};
    }

    let isMounted = true;
    const start = performance.now();
    const duration = 1800;
    hasAnimatedRef.current = true;

    const animate = (now) => {
      if (!isMounted) return;
      const progress = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(value * eased);
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      }
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      isMounted = false;
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [canAnimate, prefersReducedMotion, value]);

  useEffect(() => {
    if (!canAnimate) {
      hasAnimatedRef.current = false;
    }
  }, [canAnimate, value]);

  const formatted = useMemo(() => {
    if (value >= 1000) {
      return `${Math.round(display).toLocaleString()}${suffix}`;
    }
    return `${display.toFixed(value % 1 === 0 ? 0 : 1)}${suffix}`;
  }, [display, suffix, value]);

  return (
    <div ref={nodeRef} className="hero-stat">
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

function VideoBadge({ duration }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.35rem",
        padding: "0.15rem 0.65rem",
        borderRadius: "0.6rem",
        background: "color-mix(in oklch, var(--brand-glow) 45%, transparent)",
        color: "color-mix(in oklch, white 85%, var(--gray-50))",
        fontSize: "0.75rem",
        fontWeight: 600,
        letterSpacing: "0.06em",
        textTransform: "uppercase",
      }}
    >
      <span aria-hidden="true" style={{ display: "grid", placeItems: "center" }}>
        ▶
      </span>
      {duration}
    </span>
  );
}

function GradientText({ children }) {
  return <span className="gradient-text">{children}</span>;
}