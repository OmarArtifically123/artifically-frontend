import { useMemo } from "react";
import { space } from "../styles/spacing";

export default function CaseStudies() {
  const studies = useMemo(
    () => [
      {
        company: "Northwind Logistics",
        industry: "Global Freight",
        outcome: "Automated customs documentation with 99.7% accuracy.",
        impact: "Saved 18,000 operator hours annually and unlocked 24/7 shipment coverage.",
      },
      {
        company: "Helios Health",
        industry: "Healthcare",
        outcome: "Deployed AI receptionists across 220 clinics in three weeks.",
        impact: "Reduced abandoned calls by 63% while surfacing critical triage issues to clinicians.",
      },
      {
        company: "Stride Financial",
        industry: "Financial Services",
        outcome: "Implemented risk-aware lead routing with human-in-the-loop review.",
        impact: "Improved conversion by 28% with full audit trails for compliance and operations.",
      },
    ],
    []
  );

  return (
    <main className="container" style={{ padding: `${space("2xl")} 0`, minHeight: "80vh" }}>
      <header style={{ maxWidth: "700px", margin: `0 auto ${space("lg", 1.25)}`, textAlign: "center" }}>
        <h1 style={{ fontSize: "2.75rem", fontWeight: 800, marginBottom: space("sm") }}>Case Studies</h1>
        <p style={{ color: "var(--gray-400)", fontSize: "1.1rem", lineHeight: 1.7 }}>
          Explore how industry leaders design resilient automations with Artifically. Every engagement is
          crafted with compliance, observability, and measurable ROI in mind.
        </p>
      </header>

      <section
        className="glass"
        style={{
          display: "grid",
          gap: space("md"),
          padding: space("lg"),
          borderRadius: "16px",
        }}
      >
        {studies.map((study) => (
          <article
            key={study.company}
            style={{
              padding: space("md", 1.1667),
              borderRadius: "16px",
              background: "rgba(15, 23, 42, 0.62)",
              border: "1px solid rgba(148, 163, 184, 0.28)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: space("xs") }}>
              <h2 style={{ margin: 0 }}>{study.company}</h2>
              <span style={{ color: "var(--gray-400)", fontSize: "0.9rem" }}>{study.industry}</span>
            </div>
            <p style={{ color: "var(--gray-200)", marginBottom: space("xs") }}>
              <strong>Outcome:</strong> {study.outcome}
            </p>
            <p style={{ color: "var(--gray-300)", lineHeight: 1.6 }}>
              <strong>Impact:</strong> {study.impact}
            </p>
          </article>
        ))}
      </section>
    </main>
  );
}