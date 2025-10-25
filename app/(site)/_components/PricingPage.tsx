"use client";

import { useEffect, useMemo, useState } from "react";
import BillingToggle from "@/components/pricing/BillingToggle";
import PersonaSelector from "@/components/pricing/PersonaSelector";
import PlanCard from "@/components/pricing/PlanCard";
import IncludedAllPlans from "@/components/pricing/IncludedAllPlans";
import ValueCalculator from "@/components/pricing/ValueCalculator";
import TrustStrip from "@/components/pricing/TrustStrip";
import FAQAccordion from "@/components/pricing/FAQAccordion";
import FinalDecisionPanel from "@/components/pricing/FinalDecisionPanel";
import type { BillingCadence, Plan, Persona } from "@/components/pricing/types";

export default function PricingPage() {
  // Direction awareness for RTL
  const [dir, setDir] = useState<"ltr" | "rtl">("ltr");
  useEffect(() => {
    if (typeof document !== "undefined") {
      const d = document?.dir;
      setDir(d === "rtl" ? "rtl" : "ltr");
    }
  }, []);

  const [billing, setBilling] = useState<BillingCadence>("annual");
  const [persona, setPersona] = useState<Persona["id"] | null>(null);

  const plans: Plan[] = useMemo(
    () => [
      {
        id: "starter",
        name: "Starter",
        whoFor: "For first automation workflows",
        tagline: "Start automated operations today. Live in under 10 minutes.",
        priceMonthly: 249,
        priceAnnual: Math.round(249 * 12 * 0.8),
        deployment: "Live in under 10 minutes",
        support: "Email support, knowledge base",
        capabilities: [
          { label: "AI receptionist for calls & WhatsApp" },
          { label: "Lead capture & qualification" },
          { label: "Workflow analytics & reporting" },
        ],
        limits: "Covers ~1,000 inbound events per month (calls, WhatsApp leads, follow‑ups).",
        ctaLabel: "Start Free Trial",
      },
      {
        id: "professional",
        name: "Professional",
        whoFor: "For scaling teams with guardrails",
        tagline: "Scale with analytics, governance, and priority support.",
        priceMonthly: 549,
        priceAnnual: Math.round(549 * 12 * 0.8),
        mostPopular: true,
        deployment: "Live this week with a success architect",
        support: "Priority support, dedicated success architect",
        capabilities: [
          { label: "AI copilots & advanced workflows" },
          { label: "Governance & change review" },
          { label: "Custom integrations" },
        ],
        limits: "Covers ~10,000+ monthly events with usage‑based growth.",
        ctaLabel: "Start Free Trial",
      },
      {
        id: "enterprise",
        name: "Enterprise",
        whoFor: "For global operations & compliance",
        tagline: "Private deployment, security review, and SLAs.",
        deployment: "White‑glove onboarding & security alignment",
        support: "24/7 hotline, deployment partner, on‑prem/onsite if needed",
        capabilities: [
          { label: "Private deployment / data isolation" },
          { label: "Security review & custom SLAs" },
          { label: "Custom integrations at scale" },
        ],
        limits: "Unlimited events, enterprise support model.",
        ctaLabel: "Talk to Deployment Lead",
        ctaTo: "/contact",
      },
    ],
    []
  );

  const personas: Persona[] = [
    {
      id: "smb",
      title: "I’m just getting started",
      description: "I need AI to handle basic workflows and inbound.",
      recommendedPlanId: "starter",
    },
    {
      id: "scale",
      title: "We’re scaling operations",
      description: "I need guardrails, analytics, and priority support.",
      recommendedPlanId: "professional",
    },
    {
      id: "enterprise",
      title: "We’re enterprise",
      description: "We need compliance, security review, and SLAs.",
      recommendedPlanId: "enterprise",
    },
  ];

  return (
    <main className="pricing-page" dir={dir}>
      {/* Section A. Instant clarity / Hero */}
      <section className="hero" aria-labelledby="hero-title">
        <header className="hero-inner">
          <h1 id="hero-title">Start automated operations today. Scale into enterprise governance tomorrow.</h1>
          <p className="sub">Live in minutes, not months. 24/7 support. De‑risked adoption with transparent pricing and cost recovery.</p>
          <div className="hero-controls">
            <BillingToggle value={billing} onChange={setBilling} annualSavingsPercent={20} />
            <span className="deploy-note" aria-live="polite">Deployment timeline: minutes → days depending on plan.</span>
          </div>
        </header>
      </section>

      {/* Section B. Plan selector and plan cards */}
      <section className="selector" aria-labelledby="selector-title">
        <h2 id="selector-title" className="sr-only">Plan finder</h2>
        <PersonaSelector personas={personas} value={persona} onChange={setPersona} />
      </section>

      <section id="plans" className="plans" aria-labelledby="plans-title">
        <h2 id="plans-title" className="section-title">Plans & pricing</h2>
        <div className="plan-grid">
          {plans.map((p) => {
            const emphasize = persona ? personas.find(x => x.id === persona)?.recommendedPlanId === p.id : false;
            return (
              <PlanCard key={p.id} plan={p} billing={billing} dir={dir} emphasize={!!emphasize} />
            );
          })}
        </div>
      </section>

      {/* Section: Included in every plan */}
      <IncludedAllPlans />

      {/* Section C. ROI calculator */}
      <ValueCalculator onRecommendPlan={() => { /* visual recommendation */ }} />

      {/* Section D. Proof & guarantees */}
      <TrustStrip />

      {/* Section E. FAQ */}
      <FAQAccordion />

      {/* Section F. Final conversion block */}
      <FinalDecisionPanel />

      <style jsx>{`
        .sr-only { position: absolute; width:1px; height:1px; padding:0; margin:-1px; overflow:hidden; clip:rect(0,0,0,0); white-space:nowrap; border:0; }
        .pricing-page { display:flex; flex-direction: column; gap: 1.25rem; }
        .section-title { margin:0; font-size: clamp(1.25rem, 1.6vw, 1.75rem); }

        .hero { border: 1px solid var(--border-strong); border-radius: 16px; background: var(--bg-secondary); }
        .hero-inner { padding: 1.25rem; display:flex; flex-direction: column; gap: 0.75rem; }
        .hero h1 { margin:0; font-size: clamp(1.6rem, 2.8vw, 2.6rem); letter-spacing: -0.015em; }
        .hero .sub { margin:0; color: var(--text-secondary); }
        .hero-controls { display:flex; gap: 1rem; align-items: center; flex-wrap: wrap; }
        .deploy-note { color: var(--text-secondary); font-size: 0.95rem; }

        .selector { }
        .plans { }
        .plan-grid { display:grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap: 1rem; }
        @media (max-width: 1100px) { .plan-grid { grid-template-columns: 1fr; } }
      `}</style>
    </main>
  );
}
