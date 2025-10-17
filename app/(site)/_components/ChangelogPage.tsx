// @ts-nocheck
"use client";

import { useMemo } from "react";
import { space } from "@/styles/spacing";

export default function ChangelogPage() {
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
    <main className="container" style={{ padding: `${space("2xl")} 0`, minHeight: "80vh" }}>
      <header style={{ maxWidth: "700px", margin: `0 auto ${space("lg", 1.25)}`, textAlign: "center" }}>
        <h1 style={{ fontSize: "2.75rem", fontWeight: 800, marginBottom: space("sm") }}>Changelog</h1>
        <p style={{ color: "var(--gray-400)", fontSize: "1.05rem", lineHeight: 1.7 }}>
          Follow the latest platform improvements, from infrastructure resilience to new automation
          templates and compliance capabilities.
        </p>
      </header>

      <section className="glass" style={{ padding: space("lg"), borderRadius: "16px" }}>
        <div style={{ display: "grid", gap: space("lg") }}>
          {entries.map((entry) => (
            <article
              key={entry.version}
              style={{
                borderRadius: "14px",
                padding: space("md"),
                border: "1px solid rgba(148, 163, 184, 0.28)",
                background: "rgba(15, 23, 42, 0.58)",
              }}
            >
              <header style={{ marginBottom: space("sm") }}>
                <h2 style={{ marginBottom: space("2xs") }}>{entry.version}</h2>
                <div style={{ color: "var(--gray-400)", fontSize: "0.9rem" }}>{entry.date}</div>
              </header>
              <ul style={{ margin: 0, paddingLeft: space("fluid-sm"), color: "var(--gray-300)", lineHeight: 1.6 }}>
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