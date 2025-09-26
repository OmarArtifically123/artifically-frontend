import { useMemo } from "react";

export default function Changelog() {
  const entries = useMemo(
    () => [
      {
        version: "2024.06",
        date: "June 7, 2024",
        highlights: [
          "Introduced autonomous remediation playbooks with approval checkpoints",
          "Expanded analytics exports with real-time warehouse sync",
          "Improved SOC 2 evidence collection with automatic weekly rollups",
        ],
      },
      {
        version: "2024.05",
        date: "May 15, 2024",
        highlights: [
          "Released workspace roles with fine-grained automation entitlements",
          "Added proactive incident detection with root-cause timelines",
        ],
      },
      {
        version: "2024.04",
        date: "April 2, 2024",
        highlights: [
          "Launched AI receptionist marketplace bundle",
          "Delivered red/blue team simulation tooling for security workflows",
        ],
      },
    ],
    []
  );

  return (
    <main className="container" style={{ padding: "64px 0", minHeight: "80vh" }}>
      <header style={{ maxWidth: "700px", margin: "0 auto 40px", textAlign: "center" }}>
        <h1 style={{ fontSize: "2.75rem", fontWeight: 800, marginBottom: "16px" }}>Changelog</h1>
        <p style={{ color: "var(--gray-400)", fontSize: "1.05rem", lineHeight: 1.7 }}>
          Follow the latest platform improvements, from infrastructure resilience to new automation
          templates and compliance capabilities.
        </p>
      </header>

      <section className="glass" style={{ padding: "32px", borderRadius: "16px" }}>
        <div style={{ display: "grid", gap: "32px" }}>
          {entries.map((entry) => (
            <article
              key={entry.version}
              style={{
                borderRadius: "14px",
                padding: "24px",
                border: "1px solid rgba(148, 163, 184, 0.28)",
                background: "rgba(15, 23, 42, 0.58)",
              }}
            >
              <header style={{ marginBottom: "16px" }}>
                <h2 style={{ marginBottom: "4px" }}>{entry.version}</h2>
                <div style={{ color: "var(--gray-400)", fontSize: "0.9rem" }}>{entry.date}</div>
              </header>
              <ul style={{ margin: 0, paddingLeft: "20px", color: "var(--gray-300)", lineHeight: 1.6 }}>
                {entry.highlights.map((highlight) => (
                  <li key={highlight}>{highlight}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}