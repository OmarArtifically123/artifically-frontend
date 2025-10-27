import { space } from "@/styles/spacing";

export default function EuropePage() {
  return (
    <div className="container" style={{ padding: `${space("2xl")} 0`, minHeight: "80vh" }}>
      <header style={{ maxWidth: "720px", margin: `0 auto ${space("xl")}`, textAlign: "center" }}>
        <h1 style={{ fontSize: "2.75rem", fontWeight: 800, marginBottom: space("xs", 1.5) }}>
          Artifically in Europe
        </h1>
        <p style={{ color: "var(--gray-400)", fontSize: "1.05rem", lineHeight: 1.7 }}>
          Serving European enterprises with GDPR-native architecture, EU data centers, and multilingual support.
        </p>
      </header>

      <section className="glass" style={{ padding: space("lg"), borderRadius: "16px" }}>
        <div style={{ display: "grid", gap: space("lg"), maxWidth: "800px", margin: "0 auto" }}>
          <article>
            <h2 style={{ marginBottom: space("xs", 1.5) }}>🇪🇺 EU-First Infrastructure</h2>
            <p style={{ color: "var(--gray-300)", lineHeight: 1.6 }}>
              Data centers in Frankfurt, Amsterdam, and Ireland with full GDPR compliance, Standard
              Contractual Clauses, and data residency guarantees. No data ever leaves the EU.
            </p>
          </article>

          <article>
            <h2 style={{ marginBottom: space("xs", 1.5) }}>🌍 Multilingual Support</h2>
            <p style={{ color: "var(--gray-300)", lineHeight: 1.6 }}>
              Native support for English, German, French, Spanish, Italian, Dutch, and more. All
              automations handle European languages with proper cultural context and formatting.
            </p>
          </article>

          <article>
            <h2 style={{ marginBottom: space("xs", 1.5) }}>✅ GDPR & Privacy by Design</h2>
            <p style={{ color: "var(--gray-300)", lineHeight: 1.6 }}>
              Built with privacy-first architecture including data minimization, purpose limitation,
              automated DSAR workflows, and full audit trails for supervisory authority reviews.
            </p>
          </article>

          <article>
            <h2 style={{ marginBottom: space("xs", 1.5) }}>Get Started</h2>
            <p style={{ color: "var(--gray-300)", lineHeight: 1.6, marginBottom: space("md") }}>
              Connect with our European team to discuss GDPR compliance, data protection impact
              assessments, and enterprise deployments.
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
              Contact EU Team
            </a>
          </article>
        </div>
      </section>
    </div>
  );
}

