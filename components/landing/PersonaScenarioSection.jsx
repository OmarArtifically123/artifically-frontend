"use client";

import { useEffect, useMemo, useRef, useState } from "react";

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
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = sectionRef.current;
    if (!element) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.3 },
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="persona-scenarios" aria-labelledby="persona-scenarios-heading">
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
            <article
              key={persona.id}
              className={`persona-scenarios__card${isVisible ? " is-visible" : ""}`}
              style={isVisible ? { animationDelay: `${index * 150}ms` } : undefined}
            >
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
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}