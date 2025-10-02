import { useMemo, useState } from "react";
import { space } from "../styles/spacing";

const faqs = [
  {
    question: "How do I request a new automation?",
    answer:
      "Submit a solution brief from the Marketplace or contact your customer success partner. We'll scope the workflow, design guardrails, and deliver a deployment plan within 48 hours.",
  },
  {
    question: "Where can I monitor automation performance?",
    answer:
      "Navigate to Dashboard → Analytics for throughput, savings, and reliability metrics. Export daily telemetry to your data warehouse with one click.",
  },
  {
    question: "How do approvals and human-in-the-loop reviews work?",
    answer:
      "Each automation supports configurable approvals. Assign reviewers, set escalation timers, and capture feedback that feeds future runs.",
  },
];

export default function HelpCenter() {
  const [activeIndex, setActiveIndex] = useState(0);
  const contactOptions = useMemo(
    () => [
      { label: "Email support", value: "support@artifically.com" },
      { label: "Status & uptime", value: "status.artifically.com" },
    ],
    []
  );

  return (
    <main className="container" style={{ padding: `${space("2xl")} 0`, minHeight: "80vh" }}>
      <header style={{ maxWidth: "720px", margin: `0 auto ${space("xl")}`, textAlign: "center" }}>
        <h1 style={{ fontSize: "2.75rem", fontWeight: 800, marginBottom: space("sm") }}>Help Center</h1>
        <p style={{ color: "var(--gray-400)", fontSize: "1.1rem", lineHeight: 1.7 }}>
          Self-serve resources and quick answers for operators, developers, and security teams.
        </p>
      </header>

      <section className="glass" style={{ padding: space("lg"), borderRadius: "16px", marginBottom: space("lg") }}>
        <h2 style={{ marginBottom: space("sm") }}>Popular questions</h2>
        <div style={{ display: "grid", gap: space("sm") }}>
          {faqs.map((faq, index) => (
            <button
              key={faq.question}
              type="button"
              onClick={() => setActiveIndex(index === activeIndex ? -1 : index)}
              style={{
                textAlign: "left",
                padding: space("fluid-sm"),
                borderRadius: "14px",
                border: "1px solid rgba(148, 163, 184, 0.28)",
                background: "rgba(15, 23, 42, 0.6)",
                cursor: "pointer",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontWeight: 600 }}>{faq.question}</span>
                <span aria-hidden="true">{activeIndex === index ? "−" : "+"}</span>
              </div>
              {activeIndex === index && (
                <p style={{ color: "var(--gray-300)", marginTop: space("xs", 1.5), lineHeight: 1.6 }}>
                  {faq.answer}
                </p>
              )}
            </button>
          ))}
        </div>
      </section>

      <section className="glass" style={{ padding: space("lg"), borderRadius: "16px" }}>
        <h2 style={{ marginBottom: space("xs", 1.5) }}>Need more help?</h2>
        <p style={{ color: "var(--gray-400)", marginBottom: space("sm") }}>
          Our support team is available 24/7 with a dedicated escalation path for enterprise customers.
        </p>
        <ul style={{ display: "grid", gap: space("xs", 1.5), listStyle: "none", padding: 0 }}>
          {contactOptions.map((option) => (
            <li
              key={option.label}
              style={{
                padding: space("sm", 1.125),
                borderRadius: "12px",
                background: "rgba(15, 23, 42, 0.55)",
                border: "1px solid rgba(148, 163, 184, 0.26)",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <span>{option.label}</span>
              <span style={{ color: "var(--gray-300)" }}>{option.value}</span>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
