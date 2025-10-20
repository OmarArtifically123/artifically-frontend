"use client";

import { useMemo } from "react";
import { useInView } from "react-intersection-observer";

import { Icon } from "../icons";

const personas = [
  {
    id: "finance",
    role: "Finance",
    title: "Finance Leadership",
    description:
      "Automate close prep, forecast workflows, and vendor triage with built-in controls and visibility.",
    features: ["Automated reconciliations", "Variance alerts in your inbox", "Self-serve spend approvals"],
    href: "/marketplace?persona=finance",
    icon: "dollar",
  },
  {
    id: "support",
    role: "Support",
    title: "Support Operations",
    description:
      "Coach agents in the moment, auto-summarise incidents, and protect CSAT without adding headcount.",
    features: ["Live agent co-pilot", "Autonomous deflection flows", "Sentiment heatmaps"],
    href: "/marketplace?persona=support",
    icon: "headphones",
  },
  {
    id: "operations",
    role: "Operations",
    title: "Operations Leaders",
    description:
      "Connect tooling, route escalations, and keep execs in the loop with real-time, governed automations.",
    features: ["Adaptive routing logic", "Audit-ready timelines", "Executive pulse reports"],
    href: "/marketplace?persona=operations",
    icon: "workflow",
  },
];

export default function PersonaScenarioSection() {
  const cards = useMemo(() => personas, []);

  return (
    <section className="persona-scenarios" aria-labelledby="persona-scenarios-heading">
      <div className="persona-scenarios__inner">
        <header className="persona-scenarios__header">
          <p className="persona-scenarios__eyebrow">SCENARIO-BASED NAVIGATION</p>
          <h2 id="persona-scenarios-heading">Choose the journey that matches your role</h2>
          <p className="persona-scenarios__description">
            Skip generic tours. Tell us who you are and we&apos;ll tailor automations, ROI snapshots, and recommended
            playbooks instantly.
          </p>
        </header>
        <div className="persona-scenarios__grid">
          {cards.map((persona, index) => (
            <PersonaCard key={persona.id} persona={persona} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

function PersonaCard({ persona, index }) {
  const { ref, inView } = useInView({ threshold: 0.3, triggerOnce: true });

  return (
    <article
      ref={ref}
      className={`persona-scenarios__card${inView ? " is-visible" : ""}`}
      style={inView ? { animationDelay: `${index * 150}ms` } : undefined}
    >
      {inView ? (
        <PersonaCardContent persona={persona} />
      ) : (
        <PersonaCardSkeleton />
      )}
    </article>
  );
}

function PersonaCardContent({ persona }) {
  return (
    <>
      <span className="persona-scenarios__icon" aria-hidden="true">
        <Icon name={persona.icon} size={28} />
      </span>
      <h3>{persona.title}</h3>
      <p>{persona.description}</p>
      <ul>
        {persona.features.map((feature) => (
          <li key={feature}>
            <Icon name="check" size={18} className="persona-scenarios__feature-icon" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      <a className="persona-scenarios__cta" href={persona.href}>
        <span>Start with {persona.role}</span>
        <span className="persona-scenarios__cta-arrow" aria-hidden="true">
          →
        </span>
      </a>
    </>
  );
}

function PersonaCardSkeleton() {
  const lines = useMemo(() => Array.from({ length: 3 }), []);

  return (
    <div
      aria-hidden="true"
      style={{
        display: "grid",
        gap: "0.85rem",
        minHeight: "100%",
      }}
    >
      <div
        style={{
          width: "3rem",
          height: "3rem",
          borderRadius: "50%",
          background: "linear-gradient(135deg, rgba(148,163,184,0.22), rgba(148,163,184,0.08))",
          animation: "pulse 1.6s ease-in-out infinite",
        }}
      />
      <div
        style={{
          width: "80%",
          height: "1.4rem",
          borderRadius: "0.75rem",
          background: "linear-gradient(135deg, rgba(148,163,184,0.18), rgba(148,163,184,0.08))",
          animation: "pulse 1.6s ease-in-out infinite",
        }}
      />
      <div
        style={{
          height: "0.95rem",
          borderRadius: "0.65rem",
          background: "linear-gradient(135deg, rgba(148,163,184,0.16), rgba(148,163,184,0.06))",
          animation: "pulse 1.6s ease-in-out infinite",
        }}
      />
      <div
        style={{
          display: "grid",
          gap: "0.65rem",
        }}
      >
        {lines.map((_, index) => (
          <div
            key={index}
            style={{
              height: "0.85rem",
              borderRadius: "0.65rem",
              width: `${85 - index * 10}%`,
              background: "linear-gradient(135deg, rgba(148,163,184,0.16), rgba(148,163,184,0.05))",
              animation: "pulse 1.6s ease-in-out infinite",
            }}
          />
        ))}
      </div>
      <div
        style={{
          width: "60%",
          height: "1.05rem",
          borderRadius: "999px",
          background: "linear-gradient(135deg, rgba(129,140,248,0.35), rgba(129,140,248,0.15))",
          animation: "pulse 1.6s ease-in-out infinite",
        }}
      />
    </div>
  );
}