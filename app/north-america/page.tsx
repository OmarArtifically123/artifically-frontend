import { space } from "@/styles/spacing";

export default function NorthAmericaPage() {
  return (
    <div className="container" style={{ padding: `${space("2xl")} 0`, minHeight: "80vh" }}>
      <header style={{ maxWidth: "720px", margin: `0 auto ${space("xl")}`, textAlign: "center" }}>
        <h1 style={{ fontSize: "2.75rem", fontWeight: 800, marginBottom: space("xs", 1.5) }}>
          Artifically in North America
        </h1>
        <p style={{ color: "var(--gray-400)", fontSize: "1.05rem", lineHeight: 1.7 }}>
          Serving US and Canadian enterprises with SOC 2 compliance, HIPAA readiness, and coast-to-coast reliability.
        </p>
      </header>

      <section className="glass" style={{ padding: space("lg"), borderRadius: "16px" }}>
        <div style={{ display: "grid", gap: space("lg"), maxWidth: "800px", margin: "0 auto" }}>
          <article>
            <h2 style={{ marginBottom: space("xs", 1.5) }}>🇺🇸 🇨🇦 Regional Infrastructure</h2>
            <p style={{ color: "var(--gray-300)", lineHeight: 1.6 }}>
              Multi-region deployment across US East, US West, and Canada Central with automatic failover
              and 99.99% uptime SLA. All data stays within North American borders.
            </p>
          </article>

          <article>
            <h2 style={{ marginBottom: space("xs", 1.5) }}>🏥 Healthcare & Finance Ready</h2>
            <p style={{ color: "var(--gray-300)", lineHeight: 1.6 }}>
              HIPAA-compliant infrastructure with BAA availability, SOC 2 Type II certified, and built
              to support financial services with PCI DSS alignment and audit-ready logging.
            </p>
          </article>

          <article>
            <h2 style={{ marginBottom: space("xs", 1.5) }}>⚡ Enterprise Support</h2>
            <p style={{ color: "var(--gray-300)", lineHeight: 1.6 }}>
              24/7 US-based support with dedicated success architects, priority response times, and
              regular security reviews. White-glove onboarding for Fortune 500 deployments.
            </p>
          </article>

          <article>
            <h2 style={{ marginBottom: space("xs", 1.5) }}>Get Started</h2>
            <p style={{ color: "var(--gray-300)", lineHeight: 1.6, marginBottom: space("md") }}>
              Talk to our North American team about enterprise deployment, compliance requirements,
              and custom SLAs.
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
              Contact US Team
            </a>
          </article>
        </div>
      </section>
    </div>
  );
}

