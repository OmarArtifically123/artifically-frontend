"use client";

import { trackPricingEvent } from "@/lib/pricing-analytics";
import { AUTOMATIONS } from "./pricing-data";

type Props = {
  onScrollToBundleBuilder: () => void;
};

export default function RevenuePricingHero({ onScrollToBundleBuilder }: Props) {
  const topAutomations = AUTOMATIONS.slice(0, 3);

  return (
    <section className="revenue-pricing-hero" aria-labelledby="hero-title">
      <div className="hero-container">
        {/* Left Column: Main Content */}
        <div className="hero-main">
          {/* Headline */}
          <h1 id="hero-title" className="hero-headline">
            Go live with revenue-saving AI automations in 24–72 hours
            <br />
            <span className="hero-headline-accent">— without hiring engineers.</span>
          </h1>

          {/* Subheadline */}
          <p className="hero-subheadline">
            Pick only the automations you need. Add governance, security, and support as you scale.
          </p>

          {/* Stats Row */}
          <div className="hero-stats">
            <div className="stat-pill">
              <strong>12.4K+</strong>
              <span>automations deployed</span>
            </div>
            <div className="stat-pill">
              <strong>99.9%</strong>
              <span>uptime SLA</span>
            </div>
            <div className="stat-pill">
              <strong>Arabic + English</strong>
              <span>human support</span>
            </div>
            <div className="stat-pill">
              <strong>SOC2 in progress</strong>
              <span>GDPR-ready</span>
            </div>
          </div>

          {/* Social Proof Logos */}
          <div className="hero-logos">
            <div className="logo-row">
              <div className="logo-item">🏥 Healthcare</div>
              <div className="logo-item">🏢 Real Estate</div>
              <div className="logo-item">✨ Beauty</div>
              <div className="logo-item">🛡️ Government</div>
              <div className="logo-item">🚚 Logistics</div>
              <div className="logo-item">🛍️ Retail</div>
            </div>
            <p className="logo-microcopy">3,200+ companies didn't wait to automate ops.</p>
          </div>

          {/* CTAs */}
          <div className="hero-ctas">
            <button
              className="hero-cta hero-cta-primary"
              onClick={() => {
                trackPricingEvent("hero_cta_build_bundle_click", {});
                onScrollToBundleBuilder();
              }}
              type="button"
            >
              Build your bundle
            </button>
            <a
              className="hero-cta hero-cta-secondary"
              href="/signup?pilot=true"
              onClick={() => trackPricingEvent("hero_cta_pilot_click", {})}
            >
              Start a 3-day pilot
            </a>
          </div>
          <p className="hero-cta-microcopy">Limited pilot capacity (20 slots/month).</p>
        </div>

        {/* Right Column: Mini Configurator (Desktop Only) */}
        <div className="hero-configurator">
          <h3 className="configurator-title">Step 1. Pick your automations</h3>
          <div className="configurator-pills">
            {topAutomations.map((automation) => (
              <div key={automation.id} className="automation-pill">
                <div className="pill-header">
                  <strong className="pill-name">{automation.name}</strong>
                  <span className="pill-price">from ${automation.priceMonthly}/mo</span>
                </div>
                <p className="pill-roi">{automation.roiStatement}</p>
              </div>
            ))}
          </div>
          <button
            className="configurator-cta"
            onClick={() => {
              trackPricingEvent("hero_configurator_see_all_click", {});
              onScrollToBundleBuilder();
            }}
            type="button"
          >
            See all automations →
          </button>
          <p className="configurator-microcopy">Add or remove any time. No setup fees.</p>
        </div>
      </div>

      <style jsx>{`
        .revenue-pricing-hero {
          padding: clamp(3rem, 6vw, 5rem) clamp(1.5rem, 4vw, 3rem);
          background: linear-gradient(
            135deg,
            #0B1220 0%,
            #121829 50%,
            #0B1220 100%
          );
          border-radius: 24px;
          border: 2px solid rgba(91, 107, 255, 0.2);
          position: relative;
          overflow: hidden;
        }

        .revenue-pricing-hero::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(
            circle at 30% 50%,
            rgba(59, 130, 246, 0.1) 0%,
            transparent 50%
          );
          pointer-events: none;
        }

        .hero-container {
          position: relative;
          z-index: 1;
          display: grid;
          grid-template-columns: 1fr;
          gap: 3rem;
          max-width: 1400px;
          margin: 0 auto;
        }

        @media (min-width: 1024px) {
          .hero-container {
            grid-template-columns: 1.5fr 1fr;
            align-items: start;
          }
        }

        .hero-main {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .hero-headline {
          margin: 0;
          font-size: clamp(2rem, 4vw, 3.5rem);
          font-weight: 900;
          letter-spacing: -0.02em;
          line-height: 1.15;
          color: #E5E7EB;
        }

        .hero-headline-accent {
          color: #9CA3AF;
          font-weight: 800;
        }

        .hero-subheadline {
          margin: 0;
          font-size: clamp(1.1rem, 2vw, 1.35rem);
          line-height: 1.6;
          color: #9CA3AF;
          max-width: 600px;
        }

        .hero-stats {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .stat-pill {
          display: inline-flex;
          flex-direction: column;
          gap: 0.25rem;
          padding: 0.75rem 1.25rem;
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          transition: all 0.3s ease;
        }

        .stat-pill:hover {
          background: rgba(255, 255, 255, 0.08);
          border-color: rgba(91, 107, 255, 0.4);
          transform: translateY(-2px);
        }

        .stat-pill strong {
          font-size: 0.95rem;
          font-weight: 800;
          color: #3B82F6;
        }

        .stat-pill span {
          font-size: 0.8rem;
          color: #9CA3AF;
        }

        .hero-logos {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .logo-row {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .logo-item {
          padding: 0.5rem 1rem;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 8px;
          font-size: 0.9rem;
          color: #9CA3AF;
          transition: all 0.2s ease;
        }

        .logo-item:hover {
          background: rgba(255, 255, 255, 0.06);
          color: #E5E7EB;
        }

        .logo-microcopy {
          margin: 0;
          font-size: 0.9rem;
          color: #6B7280;
          font-style: italic;
        }

        .hero-ctas {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .hero-cta {
          padding: 1rem 2rem;
          border-radius: 12px;
          font-weight: 800;
          font-size: 1rem;
          text-decoration: none;
          border: 2px solid transparent;
          transition: all 0.3s ease;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }

        .hero-cta-primary {
          background: #3B82F6;
          color: white;
          border-color: #3B82F6;
          box-shadow: 0 4px 20px rgba(59, 130, 246, 0.4);
        }

        .hero-cta-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(59, 130, 246, 0.5);
        }

        .hero-cta-secondary {
          background: transparent;
          color: #E5E7EB;
          border-color: rgba(255, 255, 255, 0.2);
        }

        .hero-cta-secondary:hover {
          background: rgba(255, 255, 255, 0.05);
          border-color: #3B82F6;
          transform: translateY(-2px);
        }

        .hero-cta:focus-visible {
          outline: 3px solid #3B82F6;
          outline-offset: 3px;
        }

        .hero-cta-microcopy {
          margin: -0.5rem 0 0;
          font-size: 0.85rem;
          color: #6B7280;
        }

        /* Right Side Configurator */
        .hero-configurator {
          display: none;
          flex-direction: column;
          gap: 1.5rem;
          padding: 2rem;
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 20px;
        }

        @media (min-width: 1024px) {
          .hero-configurator {
            display: flex;
          }
        }

        .configurator-title {
          margin: 0;
          font-size: 1.25rem;
          font-weight: 800;
          color: #E5E7EB;
        }

        .configurator-pills {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .automation-pill {
          padding: 1rem;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          transition: all 0.3s ease;
        }

        .automation-pill:hover {
          background: rgba(255, 255, 255, 0.08);
          border-color: rgba(59, 130, 246, 0.4);
          transform: scale(1.02);
        }

        .pill-header {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          margin-bottom: 0.5rem;
        }

        .pill-name {
          font-size: 1rem;
          font-weight: 700;
          color: #E5E7EB;
        }

        .pill-price {
          font-size: 0.85rem;
          color: #9CA3AF;
        }

        .pill-roi {
          margin: 0;
          font-size: 0.85rem;
          font-style: italic;
          color: #6B7280;
          line-height: 1.4;
        }

        .configurator-cta {
          padding: 0.85rem 1.5rem;
          background: transparent;
          border: 2px solid rgba(59, 130, 246, 0.4);
          border-radius: 12px;
          color: #3B82F6;
          font-weight: 800;
          font-size: 0.95rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .configurator-cta:hover {
          background: rgba(59, 130, 246, 0.1);
          border-color: #3B82F6;
          transform: translateY(-2px);
        }

        .configurator-cta:focus-visible {
          outline: 3px solid #3B82F6;
          outline-offset: 2px;
        }

        .configurator-microcopy {
          margin: 0;
          font-size: 0.85rem;
          color: #6B7280;
          text-align: center;
        }

        @media (prefers-reduced-motion: reduce) {
          .stat-pill:hover,
          .automation-pill:hover,
          .hero-cta:hover,
          .configurator-cta:hover {
            transform: none;
          }
        }
      `}</style>
    </section>
  );
}
