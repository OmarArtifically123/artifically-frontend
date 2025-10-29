"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "@/hooks/useInView";

type Props = {
  onScrollToPlans: () => void;
};

export default function PricingHero({ onScrollToPlans }: Props) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const heroRef = useRef<HTMLElement>(null);
  const { ref: inViewRef, inView } = useInView({ threshold: 0.3, triggerOnce: true });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        setMousePosition({ x, y });
      }
    };

    const hero = heroRef.current;
    if (hero) {
      hero.addEventListener("mousemove", handleMouseMove);
      return () => hero.removeEventListener("mousemove", handleMouseMove);
    }
  }, []);

  return (
    <section
      ref={(node) => {
        // Assign to both refs properly
        if (heroRef && typeof heroRef !== 'function') {
          (heroRef as React.MutableRefObject<HTMLElement | null>).current = node;
        }
        inViewRef(node);
      }}
      className={`pricing-hero ${inView ? "pricing-hero--visible" : ""}`}
      aria-labelledby="pricing-hero-title"
    >
      {/* Animated gradient background */}
      <div
        className="pricing-hero__gradient"
        style={{
          transform: `translate(${mousePosition.x * 20}px, ${mousePosition.y * 20}px)`,
        }}
      />

      {/* Floating particles */}
      <div className="pricing-hero__particles">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: `${(i * 8.33) % 100}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${15 + i * 2}s`,
            }}
          />
        ))}
      </div>

      <div className="pricing-hero__content">
        {/* Badge */}
        <div className="pricing-hero__badge">
          <span className="badge-icon">✨</span>
          <span>Transparent pricing, no hidden fees</span>
          <span className="badge-pulse" />
        </div>

        {/* Main heading */}
        <h1 id="pricing-hero-title" className="pricing-hero__title">
          Launch automated operations today.
          <br />
          Scale into enterprise governance anytime.
        </h1>

        {/* Subheading */}
        <p className="pricing-hero__subtitle">
          Live in minutes, not months. 24/7 human support. Transparent pricing with zero
          setup fees and zero surprises. Built for Arabic & English operations.
        </p>

        {/* Stats bar */}
        <div className="pricing-hero__stats">
          <div className="stat">
            <div className="stat__value">10min</div>
            <div className="stat__label">Average setup time</div>
          </div>
          <div className="stat__divider" />
          <div className="stat">
            <div className="stat__value">24/7</div>
            <div className="stat__label">Human support</div>
          </div>
          <div className="stat__divider" />
          <div className="stat">
            <div className="stat__value">99.9%</div>
            <div className="stat__label">Uptime SLA</div>
          </div>
          <div className="stat__divider" />
          <div className="stat">
            <div className="stat__value">$0</div>
            <div className="stat__label">Setup fees</div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="pricing-hero__actions">
          <button
            onClick={onScrollToPlans}
            className="hero-cta hero-cta--primary"
            type="button"
          >
            <span>View pricing plans</span>
            <svg
              className="hero-cta__icon"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M10 4L10 16M10 16L16 10M10 16L4 10"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <a href="/contact" className="hero-cta hero-cta--secondary">
            <span>Talk to sales</span>
            <svg
              className="hero-cta__icon"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M4 10H16M16 10L10 4M16 10L10 16"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        </div>

        {/* Premium badges */}
        <div className="pricing-hero__badges">
          <div className="hero-badge">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M8 1L10 6L15 7L11 11L12 16L8 13L4 16L5 11L1 7L6 6L8 1Z" fill="currentColor" />
            </svg>
            <span>No credit card required</span>
          </div>
          <div className="hero-badge">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M8 2C4.7 2 2 4.7 2 8C2 11.3 4.7 14 8 14C11.3 14 14 11.3 14 8C14 4.7 11.3 2 8 2ZM6.5 10.5L4 8L5.4 6.6L6.5 7.7L10.6 3.6L12 5L6.5 10.5Z" fill="currentColor" />
            </svg>
            <span>14-day free trial</span>
          </div>
          <div className="hero-badge">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M8 1L8.7 3.5L11 4L9 6L9.5 8.5L8 7.5L6.5 8.5L7 6L5 4L7.3 3.5L8 1Z" fill="currentColor" />
            </svg>
            <span>Cancel anytime</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        .pricing-hero {
          position: relative;
          overflow: hidden;
          border-radius: 24px;
          background: linear-gradient(
            135deg,
            color-mix(in srgb, var(--bg-secondary) 70%, var(--accent-primary) 30%),
            var(--bg-secondary) 50%,
            color-mix(in srgb, var(--bg-secondary) 80%, var(--accent-secondary) 20%)
          );
          border: 2px solid var(--border-strong);
          padding: clamp(3rem, 6vw, 5rem) clamp(2rem, 4vw, 3rem);
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1),
                      transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .pricing-hero--visible {
          opacity: 1;
          transform: translateY(0);
        }

        .pricing-hero__gradient {
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(
            circle at center,
            color-mix(in srgb, var(--accent-primary) 15%, transparent) 0%,
            transparent 50%
          );
          pointer-events: none;
          transition: transform 0.3s ease-out;
        }

        .pricing-hero__particles {
          position: absolute;
          inset: 0;
          overflow: hidden;
          pointer-events: none;
        }

        .particle {
          position: absolute;
          width: 4px;
          height: 4px;
          background: var(--accent-primary);
          border-radius: 50%;
          opacity: 0.3;
          animation: float infinite ease-in-out;
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0) scale(1);
            opacity: 0.3;
          }
          50% {
            transform: translateY(-100px) scale(1.2);
            opacity: 0.6;
          }
        }

        .pricing-hero__content {
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 2rem;
          max-width: 900px;
          margin: 0 auto;
        }

        .pricing-hero__badge {
          position: relative;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.6rem 1.2rem;
          background: color-mix(in srgb, var(--bg-card) 90%, transparent);
          border: 1px solid var(--border-default);
          border-radius: 999px;
          font-size: 0.9rem;
          font-weight: 600;
          backdrop-filter: blur(10px);
          animation: badge-entrance 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.2s both;
        }

        @keyframes badge-entrance {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .badge-icon {
          font-size: 1.1rem;
          animation: icon-bounce 2s ease-in-out infinite;
        }

        @keyframes icon-bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-3px);
          }
        }

        .badge-pulse {
          position: absolute;
          inset: -2px;
          border-radius: 999px;
          border: 2px solid var(--accent-primary);
          opacity: 0;
          animation: pulse 2s ease-out infinite;
        }

        @keyframes pulse {
          0% {
            opacity: 0.6;
            transform: scale(1);
          }
          100% {
            opacity: 0;
            transform: scale(1.2);
          }
        }

        .pricing-hero__title {
          margin: 0;
          font-size: clamp(2.5rem, 5vw, 4rem);
          font-weight: 900;
          letter-spacing: -0.02em;
          line-height: 1.2;
          max-width: 1000px;
          animation: title-entrance 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.3s both;
        }

        @keyframes title-entrance {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .pricing-hero__subtitle {
          margin: 0;
          font-size: clamp(1.1rem, 2vw, 1.35rem);
          line-height: 1.6;
          color: var(--text-secondary);
          max-width: 700px;
          animation: subtitle-entrance 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.7s both;
        }

        @keyframes subtitle-entrance {
          from {
            opacity: 0;
            transform: translateY(15px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .pricing-hero__stats {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-wrap: wrap;
          gap: clamp(1rem, 3vw, 2rem);
          padding: 1.5rem 2rem;
          background: color-mix(in srgb, var(--bg-card) 80%, transparent);
          border: 1px solid var(--border-default);
          border-radius: 20px;
          backdrop-filter: blur(10px);
          animation: stats-entrance 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.8s both;
        }

        @keyframes stats-entrance {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .stat {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          align-items: center;
        }

        .stat__value {
          font-size: clamp(1.5rem, 3vw, 2rem);
          font-weight: 900;
          color: var(--text-primary);
        }

        .stat__label {
          font-size: 0.85rem;
          color: var(--text-secondary);
          font-weight: 600;
        }

        .stat__divider {
          width: 1px;
          height: 40px;
          background: var(--border-default);
        }

        @media (max-width: 768px) {
          .stat__divider {
            display: none;
          }
        }

        .pricing-hero__actions {
          display: flex;
          align-items: center;
          gap: 1rem;
          flex-wrap: wrap;
          justify-content: center;
          animation: actions-entrance 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.9s both;
        }

        @keyframes actions-entrance {
          from {
            opacity: 0;
            transform: translateY(15px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .hero-cta {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 1rem 2rem;
          border-radius: 14px;
          font-weight: 800;
          font-size: 1rem;
          text-decoration: none;
          border: 2px solid transparent;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          position: relative;
          overflow: hidden;
        }

        .hero-cta::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(
            120deg,
            transparent 0%,
            color-mix(in srgb, white 20%, transparent) 50%,
            transparent 100%
          );
          transform: translateX(-100%);
          transition: transform 0.6s ease;
        }

        .hero-cta:hover::before {
          transform: translateX(100%);
        }

        .hero-cta--primary {
          background: var(--accent-primary);
          color: var(--text-inverse);
          border-color: var(--accent-primary);
          box-shadow: 0 4px 20px color-mix(in srgb, var(--accent-primary) 40%, transparent);
        }

        .hero-cta--primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 30px color-mix(in srgb, var(--accent-primary) 50%, transparent);
        }

        .hero-cta--secondary {
          background: transparent;
          color: var(--text-primary);
          border-color: var(--border-strong);
          backdrop-filter: blur(10px);
        }

        .hero-cta--secondary:hover {
          background: var(--bg-card);
          border-color: var(--accent-primary);
          transform: translateY(-2px);
        }

        .hero-cta:active {
          transform: translateY(0);
        }

        .hero-cta:focus-visible {
          outline: 3px solid var(--border-focus);
          outline-offset: 3px;
        }

        .hero-cta__icon {
          transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .hero-cta:hover .hero-cta__icon {
          transform: translateY(2px);
        }

        .hero-cta--secondary:hover .hero-cta__icon {
          transform: translateX(2px) translateY(0);
        }

        .pricing-hero__badges {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1.5rem;
          flex-wrap: wrap;
          animation: badges-entrance 0.8s cubic-bezier(0.16, 1, 0.3, 1) 1s both;
        }

        @keyframes badges-entrance {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.65rem 1.25rem;
          background: linear-gradient(
            135deg,
            color-mix(in srgb, var(--bg-card) 90%, transparent),
            color-mix(in srgb, var(--bg-card) 70%, transparent)
          );
          backdrop-filter: blur(10px);
          border: 1px solid color-mix(in srgb, var(--border-default) 50%, transparent);
          border-radius: 999px;
          font-size: 0.9rem;
          font-weight: 700;
          color: var(--text-secondary);
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .hero-badge svg {
          color: var(--accent-primary);
          transition: transform 0.3s ease;
        }

        .hero-badge:hover {
          background: color-mix(in srgb, var(--bg-card) 95%, transparent);
          border-color: var(--accent-primary);
          color: var(--text-primary);
          transform: translateY(-2px);
        }

        .hero-badge:hover svg {
          transform: scale(1.1);
        }

        @media (prefers-reduced-motion: reduce) {
          .pricing-hero,
          .pricing-hero__badge,
          .pricing-hero__title,
          .pricing-hero__subtitle,
          .pricing-hero__stats,
          .pricing-hero__actions,
          .pricing-hero__badges,
          .hero-cta,
          .particle {
            animation: none !important;
            transition: none !important;
          }

          .hero-cta:hover,
          .hero-cta--primary:hover,
          .hero-cta--secondary:hover {
            transform: none;
          }
        }
      `}</style>
    </section>
  );
}

