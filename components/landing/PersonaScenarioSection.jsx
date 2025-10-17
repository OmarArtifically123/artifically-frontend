"use client";

import { useMemo } from "react";

const personas = [
  {
    id: "finance",
    label: "I lead Finance",
    description: "Automate close prep, forecast workflows, and vendor triage with built-in controls.",
    outcomes: ["Automated reconciliations", "Variance alerts", "Self-serve spend approvals"],
    href: "/marketplace?persona=finance",
  },
  {
    id: "support",
    label: "I run Support",
    description: "Coach agents in the moment, auto-summarise incidents, and protect CSAT at scale.",
    outcomes: ["Live agent co-pilot", "Autonomous deflection", "Sentiment heatmaps"],
    href: "/marketplace?persona=support",
  },
  {
    id: "operations",
    label: "I oversee Operations",
    description: "Connect tooling, route escalations, and keep execs in the loop without extra headcount.",
    outcomes: ["Adaptive routing", "Audit-ready timelines", "Executive pulses"],
    href: "/marketplace?persona=operations",
  },
];

export default function PersonaScenarioSection() {
  const cards = useMemo(() => personas, []);

  return (
    <section className="persona-scenarios" aria-labelledby="persona-scenarios-heading">
      <div className="persona-scenarios__inner">
        <header>
          <p className="persona-scenarios__eyebrow">Scenario-based navigation</p>
          <h2 id="persona-scenarios-heading">Choose the journey that matches your role</h2>
          <p>
            Skip generic tours. Tell us who you are and we’ll tailor automations, ROI snapshots, and recommended playbooks
            instantly.
          </p>
        </header>
        <div className="persona-scenarios__grid">
          {cards.map((persona) => (
            <article key={persona.id} className="persona-scenarios__card">
              <h3>{persona.label}</h3>
              <p>{persona.description}</p>
              <ul>
                {persona.outcomes.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <a className="persona-scenarios__cta" href={persona.href}>
                Start with {persona.label.split(" ").pop()}
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}