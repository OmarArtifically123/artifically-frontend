"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useInView } from "react-intersection-observer";

const customerLogos = [
  "Mercury Labs",
  "Nova Retail",
  "Atlas Finance",
  "Helios Health",
  "Vantage Ops",
  "Artemis Cloud",
  "Northwind AI",
  "Titan Manufacturing",
  "Quantum Freight",
  "Evergreen CX",
];

const testimonials = [
  {
    id: "atlas",
    quote: "Our revops team finally has an automation stack they can trust. Deployment windows dropped from weeks to minutes.",
    name: "Jared Collins",
    title: "VP Revenue Operations",
    company: "Atlas Finance",
    roi: 5.1,
    timeSaved: 38,
  },
  {
    id: "nova",
    quote: "We replaced seven internal tools and automated global merchandising within a quarter.",
    name: "Mei Chen",
    title: "Director of Automation",
    company: "Nova Retail",
    roi: 4.4,
    timeSaved: 52,
  },
  {
    id: "helio",
    quote: "Compliance audits used to hijack entire sprints. Now the guardrails generate evidence for us while automations run.",
    name: "Priya Menon",
    title: "Chief Operating Officer",
    company: "Helios Health",
    roi: 6.2,
    timeSaved: 44,
  },
];

export default function SocialProofSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const isPausedRef = useRef(false);
  const autoplayRef = useRef();
  const { ref: logosRef, inView: logosVisible } = useInView({
    threshold: 0.8,
    triggerOnce: true,
  });

  const logoSkeletons = useMemo(() => Array.from({ length: customerLogos.length }), []);

  const total = testimonials.length;
  const activeTestimonial = useMemo(() => testimonials[activeIndex % total], [activeIndex, total]);
  const touchStateRef = useRef({ startX: 0, startY: 0, active: false, handled: false });

  useEffect(() => {
    if (isPausedRef.current) {
      return undefined;
    }

    autoplayRef.current = setTimeout(() => {
      setActiveIndex((index) => (index + 1) % total);
    }, 7000);

    return () => clearTimeout(autoplayRef.current);
  }, [activeIndex, total]);

  const handleNavigate = (direction) => {
    if (!isPausedRef.current && autoplayRef.current) {
      clearTimeout(autoplayRef.current);
    }
    setActiveIndex((index) => (index + direction + total) % total);
  };

  const pauseAutoplay = () => {
    isPausedRef.current = true;
    if (autoplayRef.current) {
      clearTimeout(autoplayRef.current);
    }
  };

  const resumeAutoplay = () => {
    if (!isPausedRef.current) return;
    isPausedRef.current = false;
    autoplayRef.current = setTimeout(() => {
      setActiveIndex((index) => (index + 1) % total);
    }, 7000);
  };

  const handleTouchStart = (event) => {
    const touch = event.touches[0];
    if (!touch) {
      return;
    }
    pauseAutoplay();
    touchStateRef.current = {
      startX: touch.clientX,
      startY: touch.clientY,
      active: true,
      handled: false,
    };
  };

  const handleTouchMove = (event) => {
    const state = touchStateRef.current;
    if (!state.active || state.handled) {
      return;
    }

    const touch = event.touches[0];
    if (!touch) {
      return;
    }

    const deltaX = touch.clientX - state.startX;
    const deltaY = touch.clientY - state.startY;

    if (Math.abs(deltaX) <= Math.abs(deltaY) || Math.abs(deltaX) < 24) {
      return;
    }

    event.preventDefault();
    state.handled = true;
    handleNavigate(deltaX > 0 ? -1 : 1);
  };

  const resetTouchState = () => {
    touchStateRef.current = { startX: 0, startY: 0, active: false, handled: false };
  };

  const handleTouchEnd = () => {
    resetTouchState();
    resumeAutoplay();
  };

  const handleTouchCancel = () => {
    resetTouchState();
    resumeAutoplay();
  };

  useEffect(() => () => clearTimeout(autoplayRef.current), []);

  return (
    <section className="section-shell" aria-labelledby="social-proof-title">
      <header className="section-header">
        <span className="section-eyebrow">Trusted by Industry Leaders</span>
        <h2 id="social-proof-title" className="section-title">
          Join 12,500+ Companies
        </h2>
      </header>
      <div ref={logosRef} className="logo-wall" aria-label="Customer logos" aria-busy={!logosVisible}>
        {logosVisible
          ? customerLogos.map((logo) => (
              <span
                key={logo}
                style={{
                  padding: "1rem 1.5rem",
                  borderRadius: "0.85rem",
                  border: "1px solid color-mix(in oklch, white 10%, transparent)",
                  background: "color-mix(in oklch, var(--glass-2) 70%, transparent)",
                  fontSize: "0.9rem",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "color-mix(in oklch, white 75%, var(--gray-200))",
                }}
              >
                {logo}
              </span>
            ))
          : logoSkeletons.map((_, index) => (
              <span
                key={`logo-skeleton-${index}`}
                aria-hidden="true"
                style={{
                  padding: "1rem 1.5rem",
                  borderRadius: "0.85rem",
                  border: "1px solid color-mix(in oklch, white 6%, transparent)",
                  background: "linear-gradient(135deg, rgba(148,163,184,0.18), rgba(148,163,184,0.08))",
                  minWidth: "8rem",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  opacity: 0.8,
                  color: "transparent",
                  animation: "pulse 1.6s ease-in-out infinite",
                }}
              >
                •
              </span>
            ))}
      </div>
      <div
        className="testimonial-carousel"
        onMouseEnter={pauseAutoplay}
        onMouseLeave={resumeAutoplay}
        onFocus={pauseAutoplay}
        onBlur={resumeAutoplay}
      >
        <div
          className="testimonial-carousel__slides"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onTouchCancel={handleTouchCancel}
        >
          <article key={activeTestimonial.id} className="testimonial-card" aria-live="polite">
            <blockquote>“{activeTestimonial.quote}”</blockquote>
            <footer style={{ display: "flex", flexWrap: "wrap", gap: "0.85rem", alignItems: "center" }}>
              <div>
                <strong style={{ color: "white" }}>{activeTestimonial.name}</strong>
                <div style={{ fontSize: "0.95rem", color: "color-mix(in oklch, white 75%, var(--gray-300))" }}>
                  {activeTestimonial.title} at {activeTestimonial.company}
                </div>
              </div>
            </footer>
            <div className="metric-grid">
              <Metric value={`${activeTestimonial.roi}x`} label="ROI Increase" />
              <Metric value={`${activeTestimonial.timeSaved} hrs`} label="Saved per Week" />
            </div>
          </article>
        </div>
        <div className="testimonial-carousel__controls" role="toolbar" aria-label="Testimonial carousel controls">
          <button type="button" onClick={() => handleNavigate(-1)} aria-label="View previous testimonial">
            ←
          </button>
          <span className="testimonial-carousel__index" aria-hidden="true">
            {activeIndex + 1} / {total}
          </span>
          <button type="button" onClick={() => handleNavigate(1)} aria-label="View next testimonial">
            →
          </button>
        </div>
      </div>
    </section>
  );
}

function Metric({ value, label }) {
  return (
    <div className="metric">
      <strong>{value}</strong>
      <span>{label}</span>
    </div>
  );
}