"use client";

import Link from "next/link";
import { space } from "@/styles/spacing";

type CaseStudyProps = {
  study: {
    company: string;
    industry: string;
    companySize: string;
    location: string;
    productsUsed: string[];
    challenge: {
      title: string;
      content: string;
      painPoints: string[];
      quote?: {
        text: string;
        author: string;
        title: string;
      };
    };
    solution: {
      title: string;
      content: string;
      implementationDetails: string[];
      timeline: string;
      keyFeatures: string[];
      quote?: {
        text: string;
        author: string;
        title: string;
      };
    };
    impact: {
      title: string;
      content: string;
      metrics: Array<{
        label: string;
        value: string;
        detail: string;
      }>;
      qualitativeImpacts: string[];
      quote?: {
        text: string;
        author: string;
        title: string;
      };
    };
    testimonial?: {
      quote: string;
      author: string;
      title: string;
    };
  };
};

export default function CaseStudyDetail({ study }: CaseStudyProps) {
  return (
    <main className="container" style={{ padding: `${space("2xl")} 0` }}>
      {/* Breadcrumbs */}
      <nav style={{ marginBottom: space("md"), fontSize: "0.9rem", color: "var(--gray-400)" }}>
        <Link href="/case-studies" style={{ color: "var(--primary)", textDecoration: "none" }}>
          Case Studies
        </Link>
        {" / "}
        <span>{study.company}</span>
      </nav>

      {/* Hero Section */}
      <header style={{ marginBottom: space("xl") }}>
        <h1 style={{ fontSize: "3rem", fontWeight: 800, marginBottom: space("sm"), lineHeight: 1.2 }}>
          {study.company}
        </h1>
        <p style={{ fontSize: "1.3rem", color: "var(--gray-300)", marginBottom: space("md"), lineHeight: 1.6 }}>
          {study.impact.title}
        </p>

        {/* Fast Facts Sidebar */}
        <div
          className="glass"
          style={{
            padding: space("md"),
            borderRadius: "16px",
            display: "inline-block",
          }}
        >
          <h3 style={{ fontSize: "1rem", marginBottom: space("sm"), color: "var(--gray-400)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Fast Facts
          </h3>
          <div style={{ display: "grid", gap: space("sm") }}>
            <div>
              <div style={{ fontSize: "0.85rem", color: "var(--gray-500)", marginBottom: space("xs", 0.25) }}>
                Industry
              </div>
              <div style={{ color: "var(--gray-200)" }}>{study.industry}</div>
            </div>
            <div>
              <div style={{ fontSize: "0.85rem", color: "var(--gray-500)", marginBottom: space("xs", 0.25) }}>
                Company Size
              </div>
              <div style={{ color: "var(--gray-200)" }}>{study.companySize}</div>
            </div>
            <div>
              <div style={{ fontSize: "0.85rem", color: "var(--gray-500)", marginBottom: space("xs", 0.25) }}>
                Location
              </div>
              <div style={{ color: "var(--gray-200)" }}>{study.location}</div>
            </div>
            <div>
              <div style={{ fontSize: "0.85rem", color: "var(--gray-500)", marginBottom: space("xs", 0.25) }}>
                Products Used
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: space("xs", 0.5) }}>
                {study.productsUsed.map((product) => (
                  <span key={product} style={{ color: "var(--gray-200)", fontSize: "0.95rem" }}>
                    • {product}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Key Results/Metrics Grid */}
      <section style={{ marginBottom: space("xl") }}>
        <h2 style={{ fontSize: "1.75rem", marginBottom: space("md"), textAlign: "center" }}>Key Results</h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: space("md"),
          }}
        >
          {study.impact.metrics.map((metric) => (
            <div
              key={metric.label}
              className="glass"
              style={{
                padding: space("md"),
                borderRadius: "14px",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: "2.5rem", fontWeight: 800, color: "var(--primary)", lineHeight: 1 }}>
                {metric.value}
              </div>
              <div style={{ fontSize: "1.05rem", fontWeight: 600, color: "var(--gray-200)", marginTop: space("xs", 0.75) }}>
                {metric.label}
              </div>
              <div style={{ fontSize: "0.9rem", color: "var(--gray-400)", marginTop: space("xs", 0.5) }}>
                {metric.detail}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Challenge Section */}
      <section style={{ marginBottom: space("xl") }}>
        <div className="glass" style={{ padding: space("lg"), borderRadius: "16px" }}>
          <span style={{ fontSize: "0.9rem", color: "var(--primary)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>
            The Challenge
          </span>
          <h2 style={{ fontSize: "2rem", marginTop: space("xs", 0.5), marginBottom: space("md") }}>
            {study.challenge.title}
          </h2>
          <div style={{ color: "var(--gray-200)", lineHeight: 1.8, fontSize: "1.05rem", marginBottom: space("md"), whiteSpace: "pre-line" }}>
            {study.challenge.content}
          </div>

          {study.challenge.painPoints && study.challenge.painPoints.length > 0 && (
            <div
              style={{
                background: "rgba(239, 68, 68, 0.1)",
                border: "1px solid rgba(239, 68, 68, 0.3)",
                borderRadius: "12px",
                padding: space("md"),
                marginBottom: space("md"),
              }}
            >
              <h3 style={{ fontSize: "1.2rem", marginBottom: space("sm"), color: "var(--gray-100)" }}>
                Key Pain Points
              </h3>
              <ul style={{ listStyle: "none", padding: 0, display: "grid", gap: space("xs", 1) }}>
                {study.challenge.painPoints.map((point, idx) => (
                  <li key={idx} style={{ display: "flex", gap: space("xs", 0.75), color: "var(--gray-200)", lineHeight: 1.6 }}>
                    <span style={{ color: "rgba(239, 68, 68, 0.8)", flexShrink: 0 }}>✗</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {study.challenge.quote && (
            <blockquote
              style={{
                borderLeft: "4px solid var(--primary)",
                paddingLeft: space("md"),
                marginTop: space("md"),
                fontStyle: "italic",
                color: "var(--gray-200)",
                fontSize: "1.1rem",
                lineHeight: 1.7,
              }}
            >
              "{study.challenge.quote.text}"
              <footer style={{ marginTop: space("sm"), fontStyle: "normal", fontSize: "0.95rem", color: "var(--gray-400)" }}>
                — <strong>{study.challenge.quote.author}</strong>, {study.challenge.quote.title}
              </footer>
            </blockquote>
          )}
        </div>
      </section>

      {/* Solution Section */}
      <section style={{ marginBottom: space("xl") }}>
        <div className="glass" style={{ padding: space("lg"), borderRadius: "16px" }}>
          <span style={{ fontSize: "0.9rem", color: "var(--primary)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>
            The Solution
          </span>
          <h2 style={{ fontSize: "2rem", marginTop: space("xs", 0.5), marginBottom: space("md") }}>
            {study.solution.title}
          </h2>
          <div style={{ color: "var(--gray-200)", lineHeight: 1.8, fontSize: "1.05rem", marginBottom: space("md"), whiteSpace: "pre-line" }}>
            {study.solution.content}
          </div>

          {study.solution.keyFeatures && study.solution.keyFeatures.length > 0 && (
            <div
              style={{
                background: "rgba(59, 130, 246, 0.1)",
                border: "1px solid rgba(59, 130, 246, 0.3)",
                borderRadius: "12px",
                padding: space("md"),
                marginBottom: space("md"),
              }}
            >
              <h3 style={{ fontSize: "1.2rem", marginBottom: space("sm"), color: "var(--gray-100)" }}>
                Key Features Implemented
              </h3>
              <ul style={{ listStyle: "none", padding: 0, display: "grid", gap: space("xs", 1) }}>
                {study.solution.keyFeatures.map((feature, idx) => (
                  <li key={idx} style={{ display: "flex", gap: space("xs", 0.75), color: "var(--gray-200)", lineHeight: 1.6 }}>
                    <span style={{ color: "rgba(59, 130, 246, 0.9)", flexShrink: 0 }}>✓</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {study.solution.timeline && (
            <div style={{ fontSize: "0.95rem", color: "var(--gray-400)", marginBottom: space("md") }}>
              <strong style={{ color: "var(--gray-300)" }}>Timeline:</strong> {study.solution.timeline}
            </div>
          )}

          {study.solution.quote && (
            <blockquote
              style={{
                borderLeft: "4px solid var(--primary)",
                paddingLeft: space("md"),
                marginTop: space("md"),
                fontStyle: "italic",
                color: "var(--gray-200)",
                fontSize: "1.1rem",
                lineHeight: 1.7,
              }}
            >
              "{study.solution.quote.text}"
              <footer style={{ marginTop: space("sm"), fontStyle: "normal", fontSize: "0.95rem", color: "var(--gray-400)" }}>
                — <strong>{study.solution.quote.author}</strong>, {study.solution.quote.title}
              </footer>
            </blockquote>
          )}
        </div>
      </section>

      {/* Impact Section */}
      <section style={{ marginBottom: space("xl") }}>
        <div className="glass" style={{ padding: space("lg"), borderRadius: "16px" }}>
          <span style={{ fontSize: "0.9rem", color: "var(--primary)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>
            The Impact
          </span>
          <h2 style={{ fontSize: "2rem", marginTop: space("xs", 0.5), marginBottom: space("md") }}>
            {study.impact.title}
          </h2>
          <div style={{ color: "var(--gray-200)", lineHeight: 1.8, fontSize: "1.05rem", marginBottom: space("md"), whiteSpace: "pre-line" }}>
            {study.impact.content}
          </div>

          {study.impact.qualitativeImpacts && study.impact.qualitativeImpacts.length > 0 && (
            <div
              style={{
                background: "rgba(34, 197, 94, 0.1)",
                border: "1px solid rgba(34, 197, 94, 0.3)",
                borderRadius: "12px",
                padding: space("md"),
                marginBottom: space("md"),
              }}
            >
              <h3 style={{ fontSize: "1.2rem", marginBottom: space("sm"), color: "var(--gray-100)" }}>
                Additional Benefits
              </h3>
              <ul style={{ listStyle: "none", padding: 0, display: "grid", gap: space("xs", 1) }}>
                {study.impact.qualitativeImpacts.map((impact, idx) => (
                  <li key={idx} style={{ display: "flex", gap: space("xs", 0.75), color: "var(--gray-200)", lineHeight: 1.6 }}>
                    <span style={{ color: "rgba(34, 197, 94, 0.9)", flexShrink: 0 }}>✓</span>
                    <span>{impact}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {study.impact.quote && (
            <blockquote
              style={{
                borderLeft: "4px solid var(--primary)",
                paddingLeft: space("md"),
                marginTop: space("md"),
                fontStyle: "italic",
                color: "var(--gray-200)",
                fontSize: "1.1rem",
                lineHeight: 1.7,
              }}
            >
              "{study.impact.quote.text}"
              <footer style={{ marginTop: space("sm"), fontStyle: "normal", fontSize: "0.95rem", color: "var(--gray-400)" }}>
                — <strong>{study.impact.quote.author}</strong>, {study.impact.quote.title}
              </footer>
            </blockquote>
          )}
        </div>
      </section>

      {/* Final Testimonial */}
      {study.testimonial && (
        <section style={{ marginBottom: space("xl") }}>
          <div
            className="glass"
            style={{
              padding: space("xl"),
              borderRadius: "16px",
              textAlign: "center",
              maxWidth: "900px",
              margin: "0 auto",
              background: "linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(147, 51, 234, 0.1) 100%)",
            }}
          >
            <blockquote
              style={{
                fontStyle: "italic",
                color: "var(--gray-100)",
                fontSize: "1.3rem",
                lineHeight: 1.7,
                marginBottom: space("md"),
              }}
            >
              "{study.testimonial.quote}"
            </blockquote>
            <footer style={{ fontSize: "1rem", color: "var(--gray-300)" }}>
              — <strong>{study.testimonial.author}</strong>, {study.testimonial.title}
            </footer>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section
        className="glass"
        style={{
          padding: space("xl"),
          borderRadius: "16px",
          textAlign: "center",
          maxWidth: "800px",
          margin: "0 auto",
        }}
      >
        <h2 style={{ marginBottom: space("sm"), fontSize: "2rem" }}>
          Ready to Achieve Similar Results?
        </h2>
        <p style={{ color: "var(--gray-300)", marginBottom: space("md"), fontSize: "1.1rem", lineHeight: 1.7 }}>
          See how Artifically can deliver measurable ROI for your organization. Schedule a personalized demo to
          explore automation opportunities specific to your industry.
        </p>
        <div style={{ display: "flex", gap: space("sm"), justifyContent: "center", flexWrap: "wrap" }}>
          <Link
            href="/demo"
            style={{
              display: "inline-block",
              padding: `${space("sm")} ${space("md", 1.5)}`,
              background: "var(--primary)",
              color: "white",
              borderRadius: "8px",
              fontWeight: 600,
              textDecoration: "none",
              transition: "opacity 0.2s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.9")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
          >
            Schedule a Demo
          </Link>
          <Link
            href="/case-studies"
            style={{
              display: "inline-block",
              padding: `${space("sm")} ${space("md", 1.5)}`,
              background: "transparent",
              color: "var(--gray-100)",
              border: "1px solid rgba(148, 163, 184, 0.3)",
              borderRadius: "8px",
              fontWeight: 600,
              textDecoration: "none",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(148, 163, 184, 0.1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
            }}
          >
            View More Case Studies
          </Link>
        </div>
      </section>
    </main>
  );
}
