import { useMemo } from "react";

export default function ApiReference() {
  const endpoints = useMemo(
    () => [
      {
        name: "List Automations",
        method: "GET",
        path: "/v1/automations",
        description: "Retrieve every automation available to your workspace with pagination support.",
      },
      {
        name: "Create Automation",
        method: "POST",
        path: "/v1/automations",
        description: "Provision a new automation with configurable triggers, actions, and guardrails.",
      },
      {
        name: "Run Automation",
        method: "POST",
        path: "/v1/automations/{id}/run",
        description: "Execute an automation immediately while streaming intermediate events.",
      },
      {
        name: "Get Run",
        method: "GET",
        path: "/v1/runs/{id}",
        description: "Fetch telemetry for an automation run including token usage and outputs.",
      },
    ],
    []
  );

  return (
    <main className="container" style={{ padding: "64px 0", minHeight: "80vh" }}>
      <header style={{ maxWidth: "720px", margin: "0 auto 48px", textAlign: "center" }}>
        <h1 style={{ fontSize: "2.75rem", fontWeight: 800, marginBottom: "16px" }}>API Reference</h1>
        <p style={{ color: "var(--gray-400)", fontSize: "1.125rem", lineHeight: 1.7 }}>
          Everything you need to integrate Artifically automations into your own products. Explore
          authenticated requests, webhook payloads, and streaming responses with copy-paste samples.
        </p>
      </header>

      <section className="glass" style={{ padding: "32px", borderRadius: "16px", marginBottom: "48px" }}>
        <h2 style={{ marginBottom: "12px" }}>Getting started</h2>
        <p style={{ color: "var(--gray-400)", marginBottom: "16px" }}>
          Authenticate using a <code>Bearer</code> token generated from your dashboard. All requests must
          be made over HTTPS. Visit the <strong>Developers</strong> section in the dashboard to rotate keys,
          inspect logs, and configure webhooks.
        </p>
        <pre
          style={{
            background: "rgba(15, 23, 42, 0.65)",
            padding: "20px",
            borderRadius: "12px",
            overflowX: "auto",
            fontSize: "0.9rem",
            lineHeight: 1.6,
          }}
        >
          {`curl https://api.artifically.ai/v1/automations \\
  -H "Authorization: Bearer <API_KEY>" \\
  -H "Artifically-Org: <WORKSPACE_ID>"`}
        </pre>
      </section>

      <section
        className="glass"
        style={{
          padding: "32px",
          borderRadius: "16px",
          display: "grid",
          gap: "24px",
        }}
      >
        {endpoints.map((endpoint) => (
          <article
            key={endpoint.path}
            style={{
              border: "1px solid rgba(148, 163, 184, 0.3)",
              borderRadius: "14px",
              padding: "24px",
              background: "rgba(15, 23, 42, 0.55)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
              <h3 style={{ margin: 0 }}>{endpoint.name}</h3>
              <span
                style={{
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  color: endpoint.method === "GET" ? "#38bdf8" : "#a855f7",
                }}
              >
                {endpoint.method}
              </span>
            </div>
            <code style={{ fontSize: "0.95rem", color: "var(--gray-200)" }}>{endpoint.path}</code>
            <p style={{ color: "var(--gray-400)", marginTop: "12px", lineHeight: 1.6 }}>
              {endpoint.description}
            </p>
          </article>
        ))}
      </section>
    </main>
  );
}