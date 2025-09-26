import { useMemo } from "react";

export default function Status() {
  const systems = useMemo(
    () => [
      {
        name: "Automation runtime",
        status: "Operational",
        description: "All regions processing workflows within SLA",
        color: "#34d399",
      },
      {
        name: "Dashboard & APIs",
        status: "Operational",
        description: "API latency < 220ms p95 across all regions",
        color: "#38bdf8",
      },
      {
        name: "Analytics pipeline",
        status: "Degraded",
        description: "Delays up to 6 minutes for warehouse sync in us-east",
        color: "#fbbf24",
      },
    ],
    []
  );

  const incidents = useMemo(
    () => [
      {
        title: "Incident: Analytics pipeline latency",
        startedAt: "June 6, 2024 09:12 UTC",
        status: "Monitoring",
        updates: [
          "09:12 UTC — Engineers investigating elevated processing time in us-east.",
          "09:40 UTC — Identified saturation on streaming workers, scaled additional capacity.",
          "10:05 UTC — Latency improving, monitoring for full recovery.",
        ],
      },
    ],
    []
  );

  return (
    <main className="container" style={{ padding: "64px 0", minHeight: "80vh" }}>
      <header style={{ maxWidth: "720px", margin: "0 auto 40px", textAlign: "center" }}>
        <h1 style={{ fontSize: "2.75rem", fontWeight: 800, marginBottom: "12px" }}>Status</h1>
        <p style={{ color: "var(--gray-400)", fontSize: "1.05rem", lineHeight: 1.7 }}>
          Real-time view of Artifically system availability. Subscribe to updates from the dashboard or via
          webhook callbacks.
        </p>
      </header>

      <section className="glass" style={{ padding: "32px", borderRadius: "16px", marginBottom: "32px" }}>
        <h2 style={{ marginBottom: "16px" }}>Current status</h2>
        <div style={{ display: "grid", gap: "16px" }}>
          {systems.map((system) => (
            <div
              key={system.name}
              style={{
                padding: "20px",
                borderRadius: "14px",
                border: "1px solid rgba(148, 163, 184, 0.28)",
                background: "rgba(15, 23, 42, 0.58)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "16px",
                flexWrap: "wrap",
              }}
            >
              <div>
                <strong>{system.name}</strong>
                <p style={{ color: "var(--gray-300)", marginTop: "6px" }}>{system.description}</p>
              </div>
              <span
                style={{
                  color: system.color,
                  fontWeight: 700,
                  background: "rgba(15, 23, 42, 0.6)",
                  padding: "8px 14px",
                  borderRadius: "999px",
                  border: `1px solid ${system.color}40`,
                }}
              >
                {system.status}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="glass" style={{ padding: "32px", borderRadius: "16px" }}>
        <h2 style={{ marginBottom: "16px" }}>Active incidents</h2>
        {incidents.length === 0 ? (
          <p style={{ color: "var(--gray-400)" }}>No active incidents reported.</p>
        ) : (
          <div style={{ display: "grid", gap: "24px" }}>
            {incidents.map((incident) => (
              <article
                key={incident.title}
                style={{
                  padding: "24px",
                  borderRadius: "14px",
                  border: "1px solid rgba(148, 163, 184, 0.28)",
                  background: "rgba(15, 23, 42, 0.58)",
                }}
              >
                <header style={{ marginBottom: "12px" }}>
                  <h3 style={{ marginBottom: "4px" }}>{incident.title}</h3>
                  <div style={{ color: "var(--gray-400)", fontSize: "0.9rem" }}>
                    Started {incident.startedAt} • {incident.status}
                  </div>
                </header>
                <ul style={{ margin: 0, paddingLeft: "20px", color: "var(--gray-300)", lineHeight: 1.6 }}>
                  {incident.updates.map((update) => (
                    <li key={update}>{update}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}