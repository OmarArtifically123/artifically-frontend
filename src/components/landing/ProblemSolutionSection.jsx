import useIntersectionLazy from "../../hooks/useIntersectionLazy";

const painPoints = [
  {
    icon: "⏳",
    title: "Weeks of Setup",
    description: "Legacy tooling demands endless configuration, testing environments, and custom scripts.",
  },
  {
    icon: "🧩",
    title: "Fragmented Data",
    description: "Information sits in silos so teams manually reconcile spreadsheets and APIs nightly.",
  },
  {
    icon: "🛎️",
    title: "Manual Monitoring",
    description: "Ops teams babysit automations with pager duty rotations and brittle alerting.",
  },
  {
    icon: "💸",
    title: "Hidden Costs",
    description: "Surprise overages and consulting retainers keep ROI perpetually out of reach.",
  },
];

const solutions = [
  {
    icon: "⚡",
    title: "Deploy in Minutes",
    description: "Launch proven playbooks with guided setup flows and instant environment provisioning.",
  },
  {
    icon: "🗂️",
    title: "Unified Data Layer",
    description: "Sync every system through a governed data fabric that keeps context in lockstep.",
  },
  {
    icon: "🤖",
    title: "Autonomous Monitoring",
    description: "Adaptive guardrails self-heal issues, notify owners, and surface post-run insights.",
  },
  {
    icon: "📊",
    title: "Predictable Pricing",
    description: "Transparent usage tiers and flat-rate infrastructure remove the guesswork from planning.",
  },
];

export default function ProblemSolutionSection() {
  const { ref, isIntersecting } = useIntersectionLazy();

  return (
    <section
      id="problem-solution"
      ref={ref}
      className="section-shell"
      aria-labelledby="problem-solution-title"
    >
      <header className="section-header">
        <span className="section-eyebrow">The Old Way vs. The Artifically Way</span>
        <h2 id="problem-solution-title" className="section-title">
          Stop Wrestling with Automation
        </h2>
        <p className="section-subtitle">
          Old-school automation stacks demand months of integration work. We designed Artifically for teams who need impact now, not next quarter.
        </p>
      </header>
      <div className="problem-grid">
        <div className="problem-column" aria-label="Legacy automation pain points">
          {painPoints.map((pain, index) => (
            <article
              key={pain.title}
              className="pain-card"
              data-visible={isIntersecting}
              style={{ transitionDelay: `${index * 90}ms` }}
            >
              <span style={{ fontSize: "1.8rem" }}>{pain.icon}</span>
              <strong>{pain.title}</strong>
              <p>{pain.description}</p>
            </article>
          ))}
        </div>
        <div className="transform-arrow" aria-hidden="true" />
        <div className="solution-column" aria-label="How Artifically solves automation">
          {solutions.map((solution, index) => (
            <article
              key={solution.title}
              className="solution-card"
              data-visible={isIntersecting}
              style={{ transitionDelay: `${index * 90}ms` }}
            >
              <span style={{ fontSize: "1.8rem" }}>{solution.icon}</span>
              <strong>{solution.title}</strong>
              <p>{solution.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}