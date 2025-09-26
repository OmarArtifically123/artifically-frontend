export default function Terms() {
  const terms = [
    {
      title: "1. Agreement",
      body:
        "By accessing Artifically, your organization agrees to these terms and the acceptable use policy.",
    },
    {
      title: "2. Service availability",
      body:
        "We target 99.9% uptime backed by contractual SLAs. Scheduled maintenance notices are provided 72 hours in advance.",
    },
    {
      title: "3. Customer responsibilities",
      body:
        "Maintain the confidentiality of access tokens, follow security best practices, and ensure authorized use of automations.",
    },
    {
      title: "4. Liability",
      body:
        "Our aggregate liability is limited to fees paid in the previous twelve months except in cases of gross negligence or willful misconduct.",
    },
  ];

  return (
    <main className="container" style={{ padding: "64px 0", minHeight: "80vh" }}>
      <header style={{ maxWidth: "720px", margin: "0 auto 48px", textAlign: "center" }}>
        <h1 style={{ fontSize: "2.75rem", fontWeight: 800, marginBottom: "12px" }}>Terms of Service</h1>
        <p style={{ color: "var(--gray-400)", fontSize: "1.05rem", lineHeight: 1.7 }}>
          Please review the agreement governing your use of the Artifically platform and services.
        </p>
      </header>

      <section className="glass" style={{ padding: "32px", borderRadius: "16px" }}>
        <div style={{ display: "grid", gap: "24px" }}>
          {terms.map((section) => (
            <article
              key={section.title}
              style={{
                padding: "24px",
                borderRadius: "14px",
                border: "1px solid rgba(148, 163, 184, 0.26)",
                background: "rgba(15, 23, 42, 0.58)",
              }}
            >
              <h2 style={{ marginBottom: "12px" }}>{section.title}</h2>
              <p style={{ color: "var(--gray-300)", lineHeight: 1.6 }}>{section.body}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}