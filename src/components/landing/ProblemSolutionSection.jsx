const painPoints = [
  {
    icon: "😓",
    title: "Weeks of Setup",
    description: "Complex integrations and endless configuration grind teams to a halt.",
  },
  {
    icon: "🧩",
    title: "Disconnected Tools",
    description: "Data lives in silos, so every workflow requires manual stitching.",
  },
  {
    icon: "📉",
    title: "Unclear ROI",
    description: "Stakeholders lose confidence without live impact metrics to point to.",
  },
];

const solutions = [
  {
    icon: "⚡",
    title: "Deploy in Minutes",
    description: "Spin up pre-built, enterprise-ready automations with zero guesswork.",
  },
  {
    icon: "🔄",
    title: "Connected Stack",
    description: "Native integrations and secure data orchestration from day one.",
  },
  {
    icon: "📈",
    title: "Proof of Impact",
    description: "Real-time dashboards show ROI, time saved, and adoption automatically.",
  },
];

export default function ProblemSolutionSection() {
  return (
    <section className="section-shell" aria-labelledby="problem-solution-title">
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
          {painPoints.map((pain) => (
            <article key={pain.title} className="pain-card">
              <span style={{ fontSize: "1.8rem" }}>{pain.icon}</span>
              <strong>{pain.title}</strong>
              <p>{pain.description}</p>
            </article>
          ))}
        </div>
        <div className="transform-arrow" aria-hidden="true" />
        <div className="solution-column" aria-label="How Artifically solves automation">
          {solutions.map((solution) => (
            <article key={solution.title} className="solution-card">
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