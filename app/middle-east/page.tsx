import { space } from "@/styles/spacing";

export default function MiddleEastPage() {
  return (
    <div className="container" style={{ padding: `${space("2xl")} 0`, minHeight: "80vh" }}>
      <header style={{ maxWidth: "720px", margin: `0 auto ${space("xl")}`, textAlign: "center" }}>
        <h1 style={{ fontSize: "2.75rem", fontWeight: 800, marginBottom: space("xs", 1.5) }}>
          Artifically in the Middle East
        </h1>
        <p style={{ color: "var(--gray-400)", fontSize: "1.05rem", lineHeight: 1.7 }}>
          Serving enterprises across the GCC with Arabic language support, regional compliance, and local data residency.
        </p>
      </header>

      <section className="glass" style={{ padding: space("lg"), borderRadius: "16px" }}>
        <div style={{ display: "grid", gap: space("lg"), maxWidth: "800px", margin: "0 auto" }}>
          <article>
            <h2 style={{ marginBottom: space("xs", 1.5) }}>🇸🇦 Regional Presence</h2>
            <p style={{ color: "var(--gray-300)", lineHeight: 1.6 }}>
              We maintain data centers in the UAE and Saudi Arabia with full Arabic language support,
              ensuring compliance with local data sovereignty requirements and providing sub-50ms latency
              across the Gulf region.
            </p>
          </article>

          <article>
            <h2 style={{ marginBottom: space("xs", 1.5) }}>🗣️ Arabic + English</h2>
            <p style={{ color: "var(--gray-300)", lineHeight: 1.6 }}>
              All automations support both Arabic and English with dialect detection, cultural context
              awareness, and proper handling of right-to-left text formatting.
            </p>
          </article>

          <article>
            <h2 style={{ marginBottom: space("xs", 1.5) }}>📋 Regional Compliance</h2>
            <p style={{ color: "var(--gray-300)", lineHeight: 1.6 }}>
              Certified for Saudi PDPL, UAE GDPR equivalents, and financial sector regulations including
              SAMA cybersecurity framework and DFSA standards.
            </p>
          </article>

          <article>
            <h2 style={{ marginBottom: space("xs", 1.5) }}>Get Started</h2>
            <p style={{ color: "var(--gray-300)", lineHeight: 1.6, marginBottom: space("md") }}>
              Schedule a consultation with our regional team to discuss your automation requirements
              and compliance needs.
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
              Contact Regional Team
            </a>
          </article>
        </div>
      </section>
    </div>
  );
}



