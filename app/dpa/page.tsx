import { space } from "@/styles/spacing";

export default function DPAPage() {
  return (
    <div className="container" style={{ padding: `${space("2xl")} 0`, minHeight: "80vh" }}>
      <header style={{ maxWidth: "720px", margin: `0 auto ${space("xl")}`, textAlign: "center" }}>
        <h1 style={{ fontSize: "2.75rem", fontWeight: 800, marginBottom: space("xs", 1.5) }}>
          Data Processing Agreement
        </h1>
        <p style={{ color: "var(--gray-400)", fontSize: "1.05rem", lineHeight: 1.7 }}>
          Our GDPR-compliant data processing agreement for enterprise customers.
        </p>
      </header>

      <section className="glass" style={{ padding: space("lg"), borderRadius: "16px" }}>
        <div style={{ display: "grid", gap: space("lg"), maxWidth: "800px", margin: "0 auto" }}>
          <article>
            <h2 style={{ marginBottom: space("xs", 1.5) }}>Standard Contractual Clauses</h2>
            <p style={{ color: "var(--gray-300)", lineHeight: 1.6 }}>
              Artifically operates under EU Standard Contractual Clauses (SCCs) to ensure GDPR compliance
              for all data processing activities. Our DPA is available for review during procurement.
            </p>
          </article>

          <article>
            <h2 style={{ marginBottom: space("xs", 1.5) }}>Data Residency Options</h2>
            <p style={{ color: "var(--gray-300)", lineHeight: 1.6 }}>
              Enterprise customers can choose from EU, US, or regional data centers with data isolation
              guarantees and compliance certifications (SOC 2, ISO 27001, GDPR).
            </p>
          </article>

          <article>
            <h2 style={{ marginBottom: space("xs", 1.5) }}>Request DPA Documentation</h2>
            <p style={{ color: "var(--gray-300)", lineHeight: 1.6, marginBottom: space("md") }}>
              Contact our legal team to receive a signed DPA template and compliance documentation
              package for your security review process.
            </p>
            <a
              href="/contact"
              style={{
                display: "inline-block",
                padding: "0.75rem 2rem",
                background: "var(--primary-500)",
                color: "white",
                textDecoration: "none",
                borderRadius: "0.75rem",
                fontWeight: 600,
              }}
            >
              Contact Legal Team
            </a>
          </article>
        </div>
      </section>
    </div>
  );
}

