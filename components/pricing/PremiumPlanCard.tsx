"use client";

import { useId, useMemo, useState, useRef, useEffect } from "react";
import { useInView } from "@/hooks/useInView";
import { Icon } from "@/components/icons";
import type { BillingCadence, Plan } from "@/components/pricing/types";

type Props = {
  plan: Plan;
  billing: BillingCadence;
  dir?: "ltr" | "rtl";
  index?: number;
  onCompare?: (planId: string) => void;
};

export default function PremiumPlanCard({ plan, billing, dir, index = 0, onCompare }: Props) {
  const headingId = useId();
  const badgeId = useId();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLElement>(null);
  const { ref, inView } = useInView({ threshold: 0.2, triggerOnce: true });

  const isEnterprise = plan.priceMonthly == null && plan.priceAnnual == null;
  const annualTotal = plan.priceAnnual != null ? Math.round(plan.priceAnnual) : null;
  const monthlyPrice = plan.priceMonthly != null ? Math.round(plan.priceMonthly) : null;
  const annualPerMonth = annualTotal != null ? Math.round(annualTotal / 12) : null;

  const savings = useMemo(() => {
    if (billing === "annual" && monthlyPrice && annualTotal) {
      const monthlyTotal = monthlyPrice * 12;
      const saved = monthlyTotal - annualTotal;
      const percent = Math.round((saved / monthlyTotal) * 100);
      return { amount: saved, percent };
    }
    return null;
  }, [billing, monthlyPrice, annualTotal]);

  const featureItems = useMemo(() => {
    const trimmed = plan.capabilities.slice(0, 3);
    if (!plan.support) {
      return trimmed.slice(0, 4);
    }
    return [...trimmed, { label: `Support: ${plan.support}` }];
  }, [plan.capabilities, plan.support]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!cardRef.current || !isHovered) return;
      const rect = cardRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      setMousePosition({ x, y });
    };

    if (isHovered) {
      window.addEventListener('mousemove', handleMouseMove);
      return () => window.removeEventListener('mousemove', handleMouseMove);
    }
  }, [isHovered]);

  return (
    <article
      ref={(node) => {
        // Assign to both refs properly
        if (cardRef && typeof cardRef !== 'function') {
          (cardRef as React.MutableRefObject<HTMLElement | null>).current = node;
        }
        ref(node);
      }}
      className={`
        premium-plan-card
        ${plan.mostPopular ? "premium-plan-card--popular" : ""}
        ${inView ? "premium-plan-card--visible" : ""}
      `}
      aria-labelledby={`${headingId}${plan.mostPopular ? ` ${badgeId}` : ""}`}
      dir={dir}
      style={{
        animationDelay: `${index * 0.15}s`,
        '--mouse-x': mousePosition.x,
        '--mouse-y': mousePosition.y,
      } as React.CSSProperties}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Magnetic glow effect */}
      <div className="magnetic-glow" style={{
        transform: `translate(${(mousePosition.x - 0.5) * 40}px, ${(mousePosition.y - 0.5) * 40}px)`,
      }} />

      {/* Glass morphism overlay */}
      <div className="glass-overlay" />

      {/* Animated border */}
      <div className="animated-border" />

      {/* Popular badge with premium effect */}
      {plan.mostPopular && (
        <div className="popular-badge-wrapper">
          <span id={badgeId} className="popular-badge">
            <span className="popular-badge__glow" />
            <Icon name="star" size={14} aria-hidden className="popular-badge__icon" />
            <span>Most Popular</span>
            <div className="popular-badge__shimmer" />
          </span>
        </div>
      )}

      <header className="premium-plan-card__header">
        <h3 id={headingId} className="plan-name">
          {plan.name}
          {plan.mostPopular && <span className="sr-only"> - Most popular</span>}
        </h3>
        <p className="plan-who">{plan.whoFor}</p>
        {plan.tagline && (
          <div className="plan-tagline">
            <div className="tagline-glow" />
            <Icon name="check-circle" size={16} aria-hidden className="tagline-icon" />
            <span>{plan.tagline}</span>
          </div>
        )}
      </header>

      {/* Premium price display */}
      <div className="premium-plan-card__price" aria-live="polite">
        {isEnterprise ? (
          <div className="price-custom">
            <div className="price-custom__icon-bg">
              <Icon name="sparkles" size={48} aria-hidden className="price-custom__icon" />
            </div>
            <span className="price-custom__label">Custom Pricing</span>
            <span className="price-custom__desc">
              Tailored to your volume and compliance needs
            </span>
          </div>
        ) : billing === "monthly" && monthlyPrice != null ? (
          <div className="price-stack">
            {savings && (
              <div className="savings-badge savings-badge--alt">
                <Icon name="zap" size={12} aria-hidden />
                Save {savings.percent}% with annual
              </div>
            )}
            <div className="price-line" aria-label="Price per month, billed monthly">
              <span className="price-line__currency">$</span>
              <span className="price-line__amount">{monthlyPrice.toLocaleString()}</span>
              <span className="price-line__period">/mo</span>
            </div>
            <div className="price-note">Billed monthly</div>
          </div>
        ) : annualTotal != null ? (
          <div className="price-stack">
            {savings && (
              <div className="savings-badge savings-badge--active">
                <div className="savings-badge__glow" />
                <Icon name="zap" size={14} aria-hidden />
                <span>Save ${savings.amount.toLocaleString()} ({savings.percent}%)</span>
              </div>
            )}
            <div className="price-line" aria-label="Total per year, billed annually">
              <span className="price-line__currency">$</span>
              <span className="price-line__amount">{annualTotal.toLocaleString()}</span>
              <span className="price-line__period">/year</span>
            </div>
            {annualPerMonth != null && (
              <div className="price-note">
                Just ${annualPerMonth.toLocaleString()}/mo when paid annually
              </div>
            )}
          </div>
        ) : null}
      </div>

      {/* Premium features list */}
      <ul className="premium-plan-card__features" aria-label="Key inclusions">
        {featureItems.map((capability, idx) => (
          <li
            key={capability.label}
            className="feature-item"
            style={{ animationDelay: `${index * 0.1 + idx * 0.05}s` }}
          >
            <div className="feature-icon-wrapper">
              <div className="feature-icon-bg" />
              <Icon name="check" size={16} aria-hidden className="feature-icon" />
            </div>
            <span className="feature-text">{capability.label}</span>
          </li>
        ))}
      </ul>

      {/* Deployment badge */}
      {plan.deployment && (
        <div className="deployment-badge">
          <Icon name="clock" size={16} aria-hidden />
          <div>
            <div className="deployment-label">Go Live</div>
            <div className="deployment-value">{plan.deployment}</div>
          </div>
        </div>
      )}

      {/* Premium CTA */}
      <div className="premium-plan-card__actions">
        <a
          href={plan.ctaTo ?? "#"}
          className={`plan-cta ${isEnterprise ? "plan-cta--outline" : "plan-cta--primary"}`}
          aria-label={`${plan.name} plan - ${plan.ctaLabel}`}
        >
          <span className="plan-cta__bg" />
          <span className="plan-cta__text">{plan.ctaLabel}</span>
          <Icon
            name="arrow-right"
            size={18}
            aria-hidden
            className="plan-cta__icon"
          />
        </a>
      </div>

      <style jsx>{`
        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border: 0;
        }

        .premium-plan-card {
          position: relative;
          display: flex;
          flex-direction: column;
          gap: 2rem;
          background: linear-gradient(
            135deg,
            color-mix(in srgb, var(--bg-card) 98%, var(--accent-primary) 2%),
            var(--bg-card)
          );
          backdrop-filter: blur(20px);
          border-radius: 32px;
          padding: 2.5rem;
          min-height: 100%;
          overflow: hidden;
          opacity: 0;
          transform: translateY(40px) scale(0.95);
          transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .premium-plan-card--visible {
          opacity: 1;
          transform: translateY(0) scale(1);
        }

        .premium-plan-card:hover {
          transform: translateY(-12px) scale(1.02);
          box-shadow: 
            0 30px 80px color-mix(in srgb, var(--accent-primary) 25%, transparent),
            0 0 0 1px color-mix(in srgb, var(--accent-primary) 50%, transparent);
        }

        .premium-plan-card--popular {
          background: linear-gradient(
            135deg,
            color-mix(in srgb, var(--bg-card) 95%, var(--accent-primary) 5%),
            var(--bg-card)
          );
        }

        .magnetic-glow {
          position: absolute;
          width: 300px;
          height: 300px;
          border-radius: 50%;
          background: radial-gradient(
            circle,
            color-mix(in srgb, var(--accent-primary) 20%, transparent) 0%,
            transparent 70%
          );
          pointer-events: none;
          transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          z-index: 0;
        }

        .glass-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            135deg,
            color-mix(in srgb, white 3%, transparent) 0%,
            transparent 100%
          );
          border-radius: 32px;
          pointer-events: none;
        }

        .animated-border {
          position: absolute;
          inset: 0;
          border-radius: 32px;
          padding: 2px;
          background: linear-gradient(
            135deg,
            color-mix(in srgb, var(--accent-primary) 30%, transparent),
            color-mix(in srgb, var(--accent-secondary) 20%, transparent)
          );
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          opacity: 0;
          transition: opacity 0.4s ease;
        }

        .premium-plan-card:hover .animated-border {
          opacity: 1;
        }

        .popular-badge-wrapper {
          position: absolute;
          top: -18px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 10;
        }

        .popular-badge {
          position: relative;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.65rem 1.5rem;
          background: linear-gradient(
            135deg,
            var(--accent-primary) 0%,
            var(--accent-secondary) 100%
          );
          color: white;
          border-radius: 999px;
          font-size: 0.85rem;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          box-shadow: 
            0 8px 32px color-mix(in srgb, var(--accent-primary) 50%, transparent),
            inset 0 0 0 1px color-mix(in srgb, white 20%, transparent);
          overflow: hidden;
        }

        .popular-badge__glow {
          position: absolute;
          inset: -50%;
          background: radial-gradient(
            circle,
            color-mix(in srgb, white 40%, transparent) 0%,
            transparent 70%
          );
          animation: glow-pulse 3s ease-in-out infinite;
        }

        @keyframes glow-pulse {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.2); }
        }

        .popular-badge__icon {
          animation: star-twinkle 2s ease-in-out infinite;
        }

        @keyframes star-twinkle {
          0%, 100% { transform: scale(1) rotate(0deg); }
          50% { transform: scale(1.2) rotate(180deg); }
        }

        .popular-badge__shimmer {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            90deg,
            transparent 0%,
            color-mix(in srgb, white 40%, transparent) 50%,
            transparent 100%
          );
          transform: translateX(-100%);
          animation: shimmer 3s ease-in-out infinite;
        }

        @keyframes shimmer {
          0%, 60% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }

        .premium-plan-card__header {
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .plan-name {
          margin: 0;
          font-size: 2rem;
          font-weight: 900;
          letter-spacing: -0.02em;
          color: var(--text-primary);
        }

        .plan-who {
          margin: 0;
          color: var(--text-secondary);
          line-height: 1.6;
          font-size: 1.05rem;
        }

        .plan-tagline {
          position: relative;
          display: flex;
          align-items: center;
          gap: 0.65rem;
          padding: 0.85rem 1.25rem;
          background: linear-gradient(
            135deg,
            color-mix(in srgb, var(--accent-success) 15%, transparent),
            color-mix(in srgb, var(--accent-success) 8%, transparent)
          );
          border: 1px solid color-mix(in srgb, var(--accent-success) 30%, transparent);
          border-radius: 16px;
          color: var(--accent-success);
          font-weight: 700;
          overflow: hidden;
        }

        .tagline-glow {
          position: absolute;
          inset: -50%;
          background: radial-gradient(
            circle at center,
            color-mix(in srgb, var(--accent-success) 20%, transparent) 0%,
            transparent 70%
          );
          animation: subtle-pulse 4s ease-in-out infinite;
        }

        @keyframes subtle-pulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }

        .tagline-icon {
          position: relative;
          z-index: 1;
        }

        .premium-plan-card__price {
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          padding: 2rem;
          background: linear-gradient(
            135deg,
            color-mix(in srgb, var(--bg-secondary) 80%, transparent),
            color-mix(in srgb, var(--bg-secondary) 60%, transparent)
          );
          backdrop-filter: blur(10px);
          border-radius: 24px;
          border: 1px solid color-mix(in srgb, var(--border-default) 30%, transparent);
        }

        .price-stack {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .savings-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          align-self: flex-start;
          padding: 0.5rem 1rem;
          border-radius: 12px;
          font-size: 0.9rem;
          font-weight: 800;
          transition: all 0.3s ease;
        }

        .savings-badge--alt {
          background: color-mix(in srgb, var(--accent-primary) 10%, transparent);
          border: 1px solid color-mix(in srgb, var(--accent-primary) 30%, transparent);
          color: var(--accent-primary);
        }

        .savings-badge--active {
          position: relative;
          background: linear-gradient(
            135deg,
            color-mix(in srgb, var(--accent-success) 20%, transparent),
            color-mix(in srgb, var(--accent-success) 10%, transparent)
          );
          border: 1px solid color-mix(in srgb, var(--accent-success) 40%, transparent);
          color: var(--accent-success);
          overflow: hidden;
        }

        .savings-badge__glow {
          position: absolute;
          inset: -100%;
          background: radial-gradient(
            circle,
            color-mix(in srgb, var(--accent-success) 30%, transparent) 0%,
            transparent 70%
          );
          animation: glow-rotate 3s linear infinite;
        }

        @keyframes glow-rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .price-line {
          display: flex;
          align-items: baseline;
          gap: 0.5rem;
        }

        .price-line__currency {
          font-size: 2rem;
          font-weight: 800;
          color: var(--text-secondary);
        }

        .price-line__amount {
          font-size: 3.5rem;
          font-weight: 900;
          letter-spacing: -0.03em;
          color: var(--text-primary);
          line-height: 1;
        }

        .price-line__period {
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--text-secondary);
        }

        .price-note {
          font-size: 0.95rem;
          color: var(--text-secondary);
          font-weight: 600;
        }

        .price-custom {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.25rem;
          text-align: center;
        }

        .price-custom__icon-bg {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 96px;
          height: 96px;
          background: linear-gradient(
            135deg,
            var(--accent-primary),
            var(--accent-secondary)
          );
          border-radius: 28px;
          box-shadow: 
            0 12px 40px color-mix(in srgb, var(--accent-primary) 40%, transparent),
            inset 0 0 0 1px color-mix(in srgb, white 20%, transparent);
        }

        .price-custom__icon {
          color: white;
          animation: float-gentle 3s ease-in-out infinite;
        }

        @keyframes float-gentle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }

        .price-custom__label {
          font-size: 2rem;
          font-weight: 900;
          color: var(--text-primary);
        }

        .price-custom__desc {
          color: var(--text-secondary);
          line-height: 1.6;
          max-width: 280px;
        }

        .premium-plan-card__features {
          position: relative;
          z-index: 1;
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .feature-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0.85rem;
          border-radius: 14px;
          background: color-mix(in srgb, var(--bg-secondary) 40%, transparent);
          backdrop-filter: blur(10px);
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          opacity: 0;
          animation: feature-slide-in 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        @keyframes feature-slide-in {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .feature-item:hover {
          background: color-mix(in srgb, var(--bg-secondary) 60%, transparent);
          transform: translateX(4px);
        }

        .feature-icon-wrapper {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          flex-shrink: 0;
        }

        .feature-icon-bg {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            135deg,
            color-mix(in srgb, var(--accent-success) 20%, transparent),
            color-mix(in srgb, var(--accent-success) 10%, transparent)
          );
          border-radius: 8px;
          transition: all 0.3s ease;
        }

        .feature-item:hover .feature-icon-bg {
          transform: scale(1.1);
          background: linear-gradient(
            135deg,
            color-mix(in srgb, var(--accent-success) 30%, transparent),
            color-mix(in srgb, var(--accent-success) 15%, transparent)
          );
        }

        .feature-icon {
          position: relative;
          z-index: 1;
          color: var(--accent-success);
        }

        .feature-text {
          flex: 1;
          line-height: 1.5;
          font-weight: 600;
        }

        .deployment-badge {
          position: relative;
          z-index: 1;
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1.25rem;
          background: linear-gradient(
            135deg,
            color-mix(in srgb, var(--accent-primary) 10%, transparent),
            color-mix(in srgb, var(--accent-primary) 5%, transparent)
          );
          border: 1px solid color-mix(in srgb, var(--accent-primary) 20%, transparent);
          border-radius: 16px;
          color: var(--accent-primary);
        }

        .deployment-label {
          font-size: 0.75rem;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          opacity: 0.8;
        }

        .deployment-value {
          font-size: 0.95rem;
          font-weight: 800;
        }

        .premium-plan-card__actions {
          position: relative;
          z-index: 1;
          margin-top: auto;
        }

        .plan-cta {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          padding: 1.25rem 2rem;
          border-radius: 16px;
          font-weight: 900;
          font-size: 1.05rem;
          text-decoration: none;
          overflow: hidden;
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .plan-cta__bg {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            135deg,
            var(--accent-primary) 0%,
            var(--accent-secondary) 100%
          );
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .plan-cta--primary {
          color: white;
          box-shadow: 
            0 8px 32px color-mix(in srgb, var(--accent-primary) 40%, transparent),
            inset 0 0 0 1px color-mix(in srgb, white 20%, transparent);
        }

        .plan-cta--primary:hover {
          transform: translateY(-3px);
          box-shadow: 
            0 12px 48px color-mix(in srgb, var(--accent-primary) 50%, transparent),
            inset 0 0 0 1px color-mix(in srgb, white 30%, transparent);
        }

        .plan-cta--primary:hover .plan-cta__bg {
          transform: scale(1.05);
        }

        .plan-cta--outline .plan-cta__bg {
          background: transparent;
        }

        .plan-cta--outline {
          color: var(--text-primary);
          border: 2px solid var(--border-strong);
          background: color-mix(in srgb, var(--bg-secondary) 40%, transparent);
          backdrop-filter: blur(10px);
        }

        .plan-cta--outline:hover {
          border-color: var(--accent-primary);
          color: var(--accent-primary);
          transform: translateY(-3px);
        }

        .plan-cta__text,
        .plan-cta__icon {
          position: relative;
          z-index: 1;
        }

        .plan-cta__icon {
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .plan-cta:hover .plan-cta__icon {
          transform: translateX(4px);
        }

        .plan-cta:focus-visible {
          outline: 3px solid var(--border-focus);
          outline-offset: 3px;
        }

        @media (max-width: 768px) {
          .premium-plan-card {
            padding: 2rem;
          }

          .plan-name {
            font-size: 1.75rem;
          }

          .price-line__amount {
            font-size: 3rem;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .premium-plan-card,
          .magnetic-glow,
          .animated-border,
          .popular-badge__glow,
          .popular-badge__icon,
          .popular-badge__shimmer,
          .tagline-glow,
          .savings-badge__glow,
          .price-custom__icon,
          .feature-item,
          .plan-cta,
          .plan-cta__bg {
            animation: none !important;
            transition: none !important;
          }

          .premium-plan-card:hover,
          .feature-item:hover,
          .plan-cta:hover {
            transform: none;
          }
        }
      `}</style>
    </article>
  );
}

