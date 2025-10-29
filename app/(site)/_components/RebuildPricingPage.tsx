"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import BillingToggle from "@/components/pricing/BillingToggle";
import StunningHero from "@/components/pricing/StunningHero";
import ModernPricingCard from "@/components/pricing/ModernPricingCard";
import InteractiveComparison from "@/components/pricing/InteractiveComparison";
import type { BillingCadence, Plan } from "@/components/pricing/types";

export default function RebuildPricingPage() {
  const [billing, setBilling] = useState<BillingCadence>("annual");
  const plansRef = useRef<HTMLElement | null>(null);

  const plans: Plan[] = useMemo(
    () => [
      {
        id: "starter",
        name: "Starter",
        whoFor: "Perfect for small teams getting started with AI automation",
        tagline: "Everything you need to launch",
        priceMonthly: 299,
        priceAnnual: Math.round(299 * 12 * 0.8),
        deployment: "Live in under 10 minutes",
        support: "Email support with same-day response",
        capabilities: [
          { label: "AI receptionist (Arabic + English)" },
          { label: "WhatsApp & voice automation" },
          { label: "1,000 events/month included" },
          { label: "Basic analytics dashboard" },
        ],
        ctaLabel: "Start free trial",
        ctaTo: "/signup",
      },
      {
        id: "professional",
        name: "Professional",
        whoFor: "For growing teams that need advanced features and priority support",
        tagline: "Best for scaling operations",
        priceMonthly: 699,
        priceAnnual: Math.round(699 * 12 * 0.8),
        mostPopular: true,
        deployment: "Live this week with onboarding",
        support: "Priority support + success architect",
        capabilities: [
          { label: "Everything in Starter, plus:" },
          { label: "12,000 events/month included" },
          { label: "Advanced routing & approvals" },
          { label: "Custom integrations" },
          { label: "Advanced analytics & reporting" },
        ],
        ctaLabel: "Start free trial",
        ctaTo: "/signup",
      },
      {
        id: "enterprise",
        name: "Enterprise",
        whoFor: "For organizations requiring custom deployment and dedicated support",
        tagline: "Ultimate control and security",
        deployment: "Custom deployment timeline",
        support: "24/7 dedicated support team",
        capabilities: [
          { label: "Everything in Professional, plus:" },
          { label: "Unlimited events" },
          { label: "Private/VPC deployment" },
          { label: "Custom SLAs & contracts" },
          { label: "Security review & compliance" },
        ],
        ctaLabel: "Contact sales",
        ctaTo: "/contact",
      },
    ],
    []
  );

  const scrollToPlans = () => {
    plansRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="rebuild-pricing">
      {/* Hero Section */}
      <StunningHero onScrollToPlans={scrollToPlans} />

      {/* Billing Toggle Section */}
      <section className="billing-section">
        <div className="billing-container">
          <BillingToggle value={billing} onChange={setBilling} annualSavingsPercent={20} />
          <p className="billing-note">
            Switch anytime • No contracts • Cancel anytime
          </p>
        </div>
      </section>

      {/* Plans Grid */}
      <section ref={plansRef} className="plans-section" id="pricing-plans">
        <div className="plans-grid">
          {plans.map((plan) => (
            <ModernPricingCard
              key={plan.id}
              plan={plan}
              billing={billing}
              featured={plan.mostPopular}
            />
          ))}
        </div>
      </section>

      {/* Interactive Comparison */}
      <InteractiveComparison />

      {/* Stats Section */}
      <section className="stats-section">
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-value">99.9%</div>
            <div className="stat-label">Uptime SLA</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">&lt; 2min</div>
            <div className="stat-label">Avg response time</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">24/7</div>
            <div className="stat-label">Support available</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">500+</div>
            <div className="stat-label">Teams worldwide</div>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="trust-section">
        <h2 className="trust-title">Enterprise-grade security</h2>
        <div className="trust-grid">
          <div className="trust-card">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <path
                d="M16 4L18 10L24 11L19 16L20 22L16 19L12 22L13 16L8 11L14 10L16 4Z"
                fill="#6366f1"
              />
            </svg>
            <div className="trust-name">SOC 2 Type II</div>
            <div className="trust-desc">Certified</div>
          </div>
          <div className="trust-card">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <rect x="8" y="12" width="16" height="12" rx="2" stroke="#6366f1" strokeWidth="2" fill="none" />
              <path d="M12 12V9C12 6.8 13.8 5 16 5C18.2 5 20 6.8 20 9V12" stroke="#6366f1" strokeWidth="2" />
            </svg>
            <div className="trust-name">GDPR</div>
            <div className="trust-desc">Compliant</div>
          </div>
          <div className="trust-card">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <path
                d="M16 4L4 9V15C4 22 10 27 16 28C22 27 28 22 28 15V9L16 4Z"
                stroke="#6366f1"
                strokeWidth="2"
                fill="none"
              />
              <path d="M12 16L15 19L21 13" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <div className="trust-name">ISO 27001</div>
            <div className="trust-desc">Certified</div>
          </div>
          <div className="trust-card">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <rect x="6" y="10" width="20" height="16" rx="2" stroke="#6366f1" strokeWidth="2" fill="none" />
              <path d="M10 14H22M10 18H18M10 22H22" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <div className="trust-name">HIPAA</div>
            <div className="trust-desc">Ready</div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="faq-section">
        <h2 className="faq-title">Frequently asked questions</h2>
        <div className="faq-grid">
          <div className="faq-item">
            <h3>Can I change plans later?</h3>
            <p>Yes, you can upgrade or downgrade at any time. Changes take effect immediately.</p>
          </div>
          <div className="faq-item">
            <h3>What happens after the trial?</h3>
            <p>Your account stays active. You choose when to upgrade with no pressure.</p>
          </div>
          <div className="faq-item">
            <h3>Do you offer refunds?</h3>
            <p>Yes, full refund within 30 days if you're not satisfied. No questions asked.</p>
          </div>
          <div className="faq-item">
            <h3>How secure is my data?</h3>
            <p>Enterprise-grade security with SOC 2, GDPR compliance, and optional VPC deployment.</p>
          </div>
          <div className="faq-item">
            <h3>What support do you provide?</h3>
            <p>Email support for Starter, priority for Professional, 24/7 dedicated team for Enterprise.</p>
          </div>
          <div className="faq-item">
            <h3>Can I cancel anytime?</h3>
            <p>Absolutely. Cancel with one click, no penalties, and keep your data.</p>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="final-cta">
        <h2 className="final-title">Ready to get started?</h2>
        <p className="final-subtitle">
          Join 500+ teams automating their operations with Artifically
        </p>
        <div className="final-actions">
          <a href="/signup" className="final-btn final-btn--primary">
            Start your free trial
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M5 10H15M15 10L11 6M15 10L11 14"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
          <a href="/contact" className="final-btn final-btn--secondary">
            Talk to sales
          </a>
        </div>
      </section>

      <style jsx>{`
        .rebuild-pricing {
          min-height: 100vh;
          background: linear-gradient(180deg, #ffffff 0%, #fafafa 100%);
        }

        /* Billing Section */
        .billing-section {
          padding: 3rem 0 2rem;
          display: flex;
          justify-content: center;
        }

        .billing-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
        }

        .billing-note {
          margin: 0;
          font-size: 0.875rem;
          color: #6b7280;
          font-weight: 500;
        }

        /* Plans Section */
        .plans-section {
          padding: 2rem 0 4rem;
          max-width: 1400px;
          margin: 0 auto;
          padding-left: 2rem;
          padding-right: 2rem;
        }

        .plans-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2rem;
          align-items: start;
        }

        @media (max-width: 1200px) {
          .plans-grid {
            grid-template-columns: 1fr;
            max-width: 500px;
            margin: 0 auto;
          }
        }

        /* Stats Section */
        .stats-section {
          padding: 4rem 2rem;
          background: white;
          border-top: 1px solid #e5e7eb;
          border-bottom: 1px solid #e5e7eb;
        }

        .stats-grid {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 3rem;
        }

        @media (max-width: 1024px) {
          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 2rem;
          }
        }

        @media (max-width: 640px) {
          .stats-grid {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }
        }

        .stat-card {
          text-align: center;
        }

        .stat-value {
          font-size: 3rem;
          font-weight: 800;
          color: #111827;
          letter-spacing: -0.02em;
          margin-bottom: 0.5rem;
        }

        .stat-label {
          font-size: 1rem;
          color: #6b7280;
          font-weight: 500;
        }

        /* Trust Section */
        .trust-section {
          padding: 4rem 2rem;
          max-width: 1200px;
          margin: 0 auto;
        }

        .trust-title {
          text-align: center;
          font-size: 2rem;
          font-weight: 800;
          color: #111827;
          margin: 0 0 3rem;
          letter-spacing: -0.02em;
        }

        .trust-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 2rem;
        }

        @media (max-width: 1024px) {
          .trust-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 640px) {
          .trust-grid {
            grid-template-columns: 1fr;
          }
        }

        .trust-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 1rem;
          padding: 2rem 1.5rem;
          background: white;
          border: 2px solid #e5e7eb;
          border-radius: 16px;
          transition: all 0.2s ease;
        }

        .trust-card:hover {
          border-color: #6366f1;
          box-shadow: 0 8px 16px rgba(99, 102, 241, 0.1);
          transform: translateY(-2px);
        }

        .trust-name {
          font-size: 1.125rem;
          font-weight: 700;
          color: #111827;
        }

        .trust-desc {
          font-size: 0.875rem;
          color: #6b7280;
          font-weight: 500;
        }

        /* FAQ Section */
        .faq-section {
          padding: 4rem 2rem;
          max-width: 1000px;
          margin: 0 auto;
        }

        .faq-title {
          text-align: center;
          font-size: 2rem;
          font-weight: 800;
          color: #111827;
          margin: 0 0 3rem;
          letter-spacing: -0.02em;
        }

        .faq-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 2rem;
        }

        @media (max-width: 768px) {
          .faq-grid {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }
        }

        .faq-item {
          padding: 2rem;
          background: white;
          border: 2px solid #e5e7eb;
          border-radius: 16px;
          transition: all 0.2s ease;
        }

        .faq-item:hover {
          border-color: #d1d5db;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        }

        .faq-item h3 {
          margin: 0 0 0.75rem;
          font-size: 1.125rem;
          font-weight: 700;
          color: #111827;
        }

        .faq-item p {
          margin: 0;
          font-size: 0.9375rem;
          color: #6b7280;
          line-height: 1.6;
        }

        /* Final CTA */
        .final-cta {
          padding: 5rem 2rem;
          text-align: center;
          background: linear-gradient(180deg, transparent 0%, rgba(99, 102, 241, 0.05) 100%);
        }

        .final-title {
          margin: 0 0 0.75rem;
          font-size: 2.5rem;
          font-weight: 800;
          color: #111827;
          letter-spacing: -0.02em;
        }

        .final-subtitle {
          margin: 0 0 2.5rem;
          font-size: 1.25rem;
          color: #6b7280;
          font-weight: 500;
        }

        .final-actions {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .final-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 1.125rem 2.5rem;
          border-radius: 12px;
          font-weight: 700;
          font-size: 1.0625rem;
          text-decoration: none;
          transition: all 0.2s ease;
        }

        .final-btn--primary {
          background: #6366f1;
          color: white;
          box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
        }

        .final-btn--primary:hover {
          background: #5558e3;
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(99, 102, 241, 0.4);
        }

        .final-btn--secondary {
          background: white;
          color: #111827;
          border: 2px solid #e5e7eb;
        }

        .final-btn--secondary:hover {
          background: #f9fafb;
          border-color: #d1d5db;
        }

        @media (max-width: 640px) {
          .final-actions {
            width: 100%;
            flex-direction: column;
          }

          .final-btn {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}

