// @ts-nocheck
"use client";

import { space } from "@/styles/spacing";
export default function PrivacyPage() {
  const sections = [
    {
      title: "Information we collect",
      body:
        "We collect account information, usage telemetry, and workflow metadata strictly for delivering and improving the platform.",
    },
    {
      title: "How data is used",
      body:
        "Data powers analytics, incident response, and product improvements. We never train foundation models on customer data.",
    },
    {
      title: "Your controls",
      body:
        "Admins can configure retention windows, request exports, and trigger deletion directly from the dashboard.",
    },
  ];

  return (
    <div className="container" style={{ padding: `${space("2xl")} 0`, minHeight: "80vh" }}>
      <header style={{ maxWidth: "720px", margin: `0 auto ${space("xl")}`, textAlign: "center" }}>
        <h1 style={{ fontSize: "2.75rem", fontWeight: 800, marginBottom: space("xs", 1.5) }}>Privacy Policy</h1>
        <p style={{ color: "var(--gray-400)", fontSize: "1.05rem", lineHeight: 1.7 }}>
          We are committed to protecting your data and giving you transparent controls over how it is used.
        </p>
      </header>

      <section className="glass" style={{ padding: space("lg"), borderRadius: "16px" }}>
        <div style={{ display: "grid", gap: space("md") }}>
          {sections.map((section) => (
            <article
              key={section.title}
              style={{
                padding: space("md"),
                borderRadius: "14px",
                border: "1px solid rgba(148, 163, 184, 0.26)",
                background: "rgba(15, 23, 42, 0.58)",
              }}
            >
              <h2 style={{ marginBottom: space("xs", 1.5) }}>{section.title}</h2>
              <p style={{ color: "var(--gray-300)", lineHeight: 1.6 }}>{section.body}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}