import { useMemo } from "react";

export default function Security() {
  const controls = useMemo(
    () => [
      {
        title: "Compliance",
        details: "SOC 2 Type II, ISO 27001, HIPAA-ready infrastructure with quarterly pen tests.",
      },
      {
        title: "Data protection",
        details: "All data encrypted in transit (TLS 1.3) and at rest (AES-256). Regional residency available.",
      },
      {
        title: "Access controls",
        details: "SAML SSO, SCIM provisioning, mandatory MFA, and fine-grained automation permissions.",
      },
      {
        title: "Monitoring",
        details: "Real-time anomaly detection with automated incident response playbooks and on-call coverage.",
      },
    ],
    []
  );

  return (
    <main className="container" style={{ padding: "64px 0", minHeight: "80vh" }}>
      <header style={{ maxWidth: "720px", margin: "0 auto 48px", textAlign: "center" }}>
        <h1 style={{ fontSize: "2.75rem", fontWeight: 800, marginBottom: "12px" }}>Security at Artifically</h1>
        <p style={{ color: "var(--gray-400)", fontSize: "1.05rem", lineHeight: 1.7 }}>
          Built for the most demanding industries with layered defenses, verified compliance, and continuous
          monitoring.
        </p>
      </header>

      <section className="glass" style={{ padding: "32px", borderRadius: "16px", marginBottom: "32px" }}>
        <h2 style={{ marginBottom: "16px" }}>Core controls</h2>
        <div style={{ display: "grid", gap: "16px" }}>
          {controls.map((control) => (
            <article
              key={control.title}
              style={{
                padding: "24px",
                borderRadius: "14px",
                border: "1px solid rgba(148, 163, 184, 0.26)",
                background: "rgba(15, 23, 42, 0.58)",
              }}
            >
              <h3 style={{ marginBottom: "8px" }}>{control.title}</h3>
              <p style={{ color: "var(--gray-300)", lineHeight: 1.6 }}>{control.details}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="glass" style={{ padding: "32px", borderRadius: "16px" }}>
        <h2 style={{ marginBottom: "12px" }}>Report an issue</h2>
        <p style={{ color: "var(--gray-400)", lineHeight: 1.6 }}>
          We run a coordinated vulnerability disclosure program. Email <strong>support@artifically.com</strong>
        </p>
      </section>
    </main>
  );
}