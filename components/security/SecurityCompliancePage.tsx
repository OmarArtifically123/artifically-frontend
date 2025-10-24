"use client";

import Link from "next/link";
import { space } from "@/styles/spacing";
import complianceData from "@/data/security/compliance.json";

export default function SecurityCompliancePage() {
  return (
    <main className="container" style={{ padding: `${space("2xl")} 0` }}>
      {/* Hero Section */}
      <header style={{ maxWidth: "900px", margin: `0 auto ${space("xl")}`, textAlign: "center" }}>
        <h1 style={{ fontSize: "3rem", fontWeight: 800, marginBottom: space("sm"), lineHeight: 1.2 }}>
          {complianceData.hero.title}
        </h1>
        <p style={{ color: "var(--gray-300)", fontSize: "1.2rem", lineHeight: 1.7 }}>
          {complianceData.hero.subtitle}
        </p>
      </header>

      {/* Trust Badges / Certifications */}
      <section style={{ marginBottom: space("xl") }}>
        <h2 style={{ textAlign: "center", marginBottom: space("md"), fontSize: "2rem" }}>
          Certifications & Compliance
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: space("md"),
            maxWidth: "1200px",
            margin: "0 auto",
          }}
        >
          {complianceData.certifications.map((cert) => (
            <div
              key={cert.name}
              className="glass"
              style={{
                padding: space("lg"),
                borderRadius: "16px",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  width: "80px",
                  height: "80px",
                  margin: `0 auto ${space("md")}`,
                  background: "rgba(59, 130, 246, 0.1)",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "2rem",
                }}
              >
                ✓
              </div>
              <h3 style={{ fontSize: "1.3rem", marginBottom: space("xs", 0.75) }}>{cert.name}</h3>
              <div
                style={{
                  display: "inline-block",
                  padding: "4px 12px",
                  borderRadius: "6px",
                  background:
                    cert.status === "Certified" || cert.status === "Compliant"
                      ? "rgba(34, 197, 94, 0.2)"
                      : "rgba(234, 179, 8, 0.2)",
                  color: cert.status === "Certified" || cert.status === "Compliant" ? "#22c55e" : "#eab308",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  marginBottom: space("sm"),
                }}
              >
                {cert.status}
              </div>
              <p style={{ color: "var(--gray-300)", lineHeight: 1.6, marginBottom: space("sm") }}>
                {cert.description}
              </p>
              {cert.lastAudit && (
                <div style={{ fontSize: "0.85rem", color: "var(--gray-400)" }}>
                  Last audit: {cert.lastAudit}
                </div>
              )}
              {cert.certificationDate && (
                <div style={{ fontSize: "0.85rem", color: "var(--gray-400)" }}>
                  Certified: {cert.certificationDate}
                </div>
              )}
              {cert.details && (
                <div style={{ fontSize: "0.9rem", color: "var(--gray-300)", marginTop: space("xs", 0.5) }}>
                  {cert.details}
                </div>
              )}
              {cert.reportAvailable && (
                <button
                  style={{
                    marginTop: space("sm"),
                    padding: `${space("xs", 0.75)} ${space("sm", 1.125)}`,
                    background: "rgba(59, 130, 246, 0.15)",
                    color: "var(--primary)",
                    border: "none",
                    borderRadius: "6px",
                    fontWeight: 600,
                    fontSize: "0.9rem",
                    cursor: "pointer",
                  }}
                >
                  Download Report
                </button>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Security Practices */}
      <section style={{ marginBottom: space("xl") }}>
        <h2 style={{ textAlign: "center", marginBottom: space("md"), fontSize: "2rem" }}>
          Security Practices
        </h2>
        <div style={{ display: "grid", gap: space("lg"), maxWidth: "1200px", margin: "0 auto" }}>
          {Object.entries(complianceData.securityPractices).map(([key, section]) => (
            <div key={key} className="glass" style={{ padding: space("lg"), borderRadius: "16px" }}>
              <h3 style={{ fontSize: "1.5rem", marginBottom: space("md") }}>{section.title}</h3>
              <div style={{ display: "grid", gap: space("md") }}>
                {section.items.map((item: any) => (
                  <div key={item.name}>
                    <h4
                      style={{
                        fontSize: "1.1rem",
                        fontWeight: 600,
                        marginBottom: space("xs", 0.5),
                        color: "var(--gray-100)",
                      }}
                    >
                      {item.name}
                    </h4>
                    <p style={{ color: "var(--gray-300)", lineHeight: 1.7 }}>{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Data Privacy */}
      <section style={{ marginBottom: space("xl") }}>
        <div className="glass" style={{ padding: space("lg"), borderRadius: "16px", maxWidth: "1000px", margin: "0 auto" }}>
          <h2 style={{ fontSize: "2rem", marginBottom: space("sm") }}>{complianceData.dataPrivacy.title}</h2>
          <p style={{ color: "var(--gray-300)", lineHeight: 1.7, marginBottom: space("lg"), fontSize: "1.05rem" }}>
            {complianceData.dataPrivacy.description}
          </p>
          <div style={{ display: "grid", gap: space("md") }}>
            {complianceData.dataPrivacy.practices.map((practice) => (
              <div
                key={practice.title}
                style={{
                  padding: space("md"),
                  background: "rgba(15, 23, 42, 0.6)",
                  borderRadius: "12px",
                  border: "1px solid rgba(148, 163, 184, 0.2)",
                }}
              >
                <h4 style={{ fontSize: "1.1rem", marginBottom: space("xs", 0.75), color: "var(--gray-100)" }}>
                  {practice.title}
                </h4>
                <p style={{ color: "var(--gray-300)", lineHeight: 1.7 }}>{practice.content}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Infrastructure & Uptime */}
      <section style={{ marginBottom: space("xl") }}>
        <div className="glass" style={{ padding: space("lg"), borderRadius: "16px", maxWidth: "1000px", margin: "0 auto" }}>
          <h2 style={{ fontSize: "2rem", marginBottom: space("md"), textAlign: "center" }}>
            {complianceData.infrastructure.title}
          </h2>
          <div style={{ display: "grid", gap: space("md") }}>
            {complianceData.infrastructure.items.map((item) => (
              <div
                key={item.label}
                style={{
                  display: "grid",
                  gridTemplateColumns: "200px 1fr",
                  gap: space("md"),
                  padding: space("md"),
                  background: "rgba(15, 23, 42, 0.6)",
                  borderRadius: "12px",
                  border: "1px solid rgba(148, 163, 184, 0.2)",
                  alignItems: "start",
                }}
              >
                <div>
                  <div style={{ fontSize: "0.85rem", color: "var(--gray-500)", marginBottom: space("xs", 0.25) }}>
                    {item.label}
                  </div>
                  <div style={{ fontSize: "1.2rem", fontWeight: 700, color: "var(--primary)" }}>{item.value}</div>
                </div>
                <div>
                  <p style={{ color: "var(--gray-300)", lineHeight: 1.7, margin: 0 }}>{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security Contact */}
      <section>
        <div
          className="glass"
          style={{
            padding: space("xl"),
            borderRadius: "16px",
            maxWidth: "800px",
            margin: "0 auto",
            textAlign: "center",
          }}
        >
          <h2 style={{ fontSize: "2rem", marginBottom: space("sm") }}>{complianceData.contact.title}</h2>
          <p style={{ color: "var(--gray-300)", lineHeight: 1.7, marginBottom: space("lg"), fontSize: "1.05rem" }}>
            {complianceData.contact.description}
          </p>

          <div
            style={{
              display: "grid",
              gap: space("md"),
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              textAlign: "left",
            }}
          >
            {/* General Security Contact */}
            <div
              style={{
                padding: space("md"),
                background: "rgba(15, 23, 42, 0.6)",
                borderRadius: "12px",
                border: "1px solid rgba(148, 163, 184, 0.2)",
              }}
            >
              <h3 style={{ fontSize: "1.1rem", marginBottom: space("xs", 0.75) }}>General Security</h3>
              <a
                href={`mailto:${complianceData.contact.email}`}
                style={{
                  color: "var(--primary)",
                  textDecoration: "none",
                  fontSize: "0.95rem",
                }}
              >
                {complianceData.contact.email}
              </a>
            </div>

            {/* Bug Bounty */}
            {complianceData.contact.bugBounty.available && (
              <div
                style={{
                  padding: space("md"),
                  background: "rgba(15, 23, 42, 0.6)",
                  borderRadius: "12px",
                  border: "1px solid rgba(148, 163, 184, 0.2)",
                }}
              >
                <h3 style={{ fontSize: "1.1rem", marginBottom: space("xs", 0.75) }}>Bug Bounty</h3>
                <p style={{ fontSize: "0.9rem", color: "var(--gray-300)", lineHeight: 1.6, marginBottom: space("xs", 0.75) }}>
                  {complianceData.contact.bugBounty.description}
                </p>
                <Link
                  href={complianceData.contact.bugBounty.link}
                  style={{
                    color: "var(--primary)",
                    textDecoration: "none",
                    fontSize: "0.95rem",
                  }}
                >
                  Learn More →
                </Link>
              </div>
            )}

            {/* DPO Contact */}
            {complianceData.contact.dpo.available && (
              <div
                style={{
                  padding: space("md"),
                  background: "rgba(15, 23, 42, 0.6)",
                  borderRadius: "12px",
                  border: "1px solid rgba(148, 163, 184, 0.2)",
                }}
              >
                <h3 style={{ fontSize: "1.1rem", marginBottom: space("xs", 0.75) }}>
                  {complianceData.contact.dpo.title}
                </h3>
                <p style={{ fontSize: "0.9rem", color: "var(--gray-300)", lineHeight: 1.6, marginBottom: space("xs", 0.75) }}>
                  {complianceData.contact.dpo.description}
                </p>
                <a
                  href={`mailto:${complianceData.contact.dpo.email}`}
                  style={{
                    color: "var(--primary)",
                    textDecoration: "none",
                    fontSize: "0.95rem",
                  }}
                >
                  {complianceData.contact.dpo.email}
                </a>
              </div>
            )}
          </div>

          {/* Additional Links */}
          <div style={{ marginTop: space("xl"), paddingTop: space("lg"), borderTop: "1px solid rgba(148, 163, 184, 0.2)" }}>
            <p style={{ color: "var(--gray-400)", marginBottom: space("md"), fontSize: "0.95rem" }}>
              For more information, review our legal documents:
            </p>
            <div style={{ display: "flex", gap: space("md"), justifyContent: "center", flexWrap: "wrap" }}>
              <Link
                href="/privacy"
                style={{
                  color: "var(--primary)",
                  textDecoration: "none",
                  fontSize: "0.95rem",
                  fontWeight: 600,
                }}
              >
                Privacy Policy
              </Link>
              <span style={{ color: "var(--gray-500)" }}>•</span>
              <Link
                href="/terms"
                style={{
                  color: "var(--primary)",
                  textDecoration: "none",
                  fontSize: "0.95rem",
                  fontWeight: 600,
                }}
              >
                Terms of Service
              </Link>
              <span style={{ color: "var(--gray-500)" }}>•</span>
              <Link
                href="/cookies"
                style={{
                  color: "var(--primary)",
                  textDecoration: "none",
                  fontSize: "0.95rem",
                  fontWeight: 600,
                }}
              >
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
