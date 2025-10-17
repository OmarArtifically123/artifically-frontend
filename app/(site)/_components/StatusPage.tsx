// @ts-nocheck
"use client";

import { useMemo } from "react";
import { space } from "@/styles/spacing";

export default function StatusPage() {
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
    <main className="container" style={{ padding: `${space("2xl")} 0`, minHeight: "80vh" }}>
      <header style={{ maxWidth: "720px", margin: `0 auto ${space("lg", 1.25)}`, textAlign: "center" }}>
        <h1 style={{ fontSize: "2.75rem", fontWeight: 800, marginBottom: space("xs", 1.5) }}>Status</h1>
        <p style={{ color: "var(--gray-400)", fontSize: "1.05rem", lineHeight: 1.7 }}>
          Real-time view of Artifically system availability. Subscribe to updates from the dashboard or via
          webhook callbacks.
        </p>
      </header>

      <section className="glass" style={{ padding: space("lg"), borderRadius: "16px", marginBottom: space("lg") }}>
        <h2 style={{ marginBottom: space("sm") }}>Current status</h2>
        <div style={{ display: "grid", gap: space("sm") }}>
          {systems.map((system) => (
            <div
              key={system.name}
              style={{
                padding: space("fluid-sm"),
                borderRadius: "14px",
                border: "1px solid rgba(148, 163, 184, 0.28)",
                background: "rgba(15, 23, 42, 0.58)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: space("sm"),
                flexWrap: "wrap",
              }}
            >
              <div>
                <strong>{system.name}</strong>
                <p style={{ color: "var(--gray-300)", marginTop: space("2xs", 1.5) }}>{system.description}</p>
              </div>
              <span
                style={{
                  color: system.color,
                  fontWeight: 700,
                  background: "rgba(15, 23, 42, 0.6)",
                  padding: `${space("xs")} ${space("xs", 1.75)}`,
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

      <section className="glass" style={{ padding: space("lg"), borderRadius: "16px" }}>
        <h2 style={{ marginBottom: space("sm") }}>Active incidents</h2>
        {incidents.length === 0 ? (
          <p style={{ color: "var(--gray-400)" }}>No active incidents reported.</p>
        ) : (
          <div style={{ display: "grid", gap: space("md") }}>
            {incidents.map((incident) => (
              <article
                key={incident.title}
                style={{
                  padding: space("md"),
                  borderRadius: "14px",
                  border: "1px solid rgba(148, 163, 184, 0.28)",
                  background: "rgba(15, 23, 42, 0.58)",
                }}
              >
                <header style={{ marginBottom: space("xs", 1.5) }}>
                  <h3 style={{ marginBottom: space("2xs") }}>{incident.title}</h3>
                  <div style={{ color: "var(--gray-400)", fontSize: "0.9rem" }}>
                    Started {incident.startedAt} • {incident.status}
                  </div>
                </header>
                <ul style={{ margin: 0, paddingLeft: space("fluid-sm"), color: "var(--gray-300)", lineHeight: 1.6 }}>
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