"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { space } from "@/styles/spacing";
import studies from "@/data/case-studies/studies.json";

type IndustryFilter = "All" | "Global Freight & Logistics" | "Healthcare Services" | "Financial Services";
type CompanySizeFilter = "All" | "200-500" | "500-1000" | "1000-2500";

export default function CaseStudiesLanding() {
  const [industryFilter, setIndustryFilter] = useState<IndustryFilter>("All");
  const [sizeFilter, setSizeFilter] = useState<CompanySizeFilter>("All");

  const filteredStudies = useMemo(() => {
    return studies.filter((study) => {
      const matchesIndustry = industryFilter === "All" || study.industry === industryFilter;
      const matchesSize = sizeFilter === "All" || study.companySize === sizeFilter;
      return matchesIndustry && matchesSize;
    });
  }, [industryFilter, sizeFilter]);

  const industries: IndustryFilter[] = [
    "All",
    "Global Freight & Logistics",
    "Healthcare Services",
    "Financial Services",
  ];
  const companySizes: CompanySizeFilter[] = ["All", "200-500", "500-1000", "1000-2500"];

  return (
    <main className="container" style={{ padding: `${space("2xl")} 0` }}>
      {/* Hero Section */}
      <header style={{ maxWidth: "900px", margin: `0 auto ${space("xl")}`, textAlign: "center" }}>
        <h1 style={{ fontSize: "3rem", fontWeight: 800, marginBottom: space("sm"), lineHeight: 1.2 }}>
          Case Studies
        </h1>
        <p style={{ color: "var(--gray-300)", fontSize: "1.2rem", lineHeight: 1.7 }}>
          Explore how industry leaders design resilient automations with Artifically. Every engagement is crafted with
          compliance, observability, and measurable ROI in mind.
        </p>
      </header>

      {/* Filters */}
      <div
        style={{
          display: "flex",
          gap: space("md"),
          marginBottom: space("lg"),
          justifyContent: "center",
          flexWrap: "wrap",
        }}
      >
        <div>
          <label
            htmlFor="industry-filter"
            style={{ display: "block", marginBottom: space("xs", 0.5), fontSize: "0.9rem" }}
          >
            Industry
          </label>
          <select
            id="industry-filter"
            value={industryFilter}
            onChange={(e) => setIndustryFilter(e.target.value as IndustryFilter)}
            style={{
              padding: `${space("xs", 0.75)} ${space("sm")}`,
              borderRadius: "8px",
              border: "1px solid rgba(148, 163, 184, 0.3)",
              background: "rgba(15, 23, 42, 0.7)",
              color: "var(--gray-100)",
              fontSize: "1rem",
              minWidth: "220px",
            }}
          >
            {industries.map((industry) => (
              <option key={industry} value={industry}>
                {industry}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="size-filter"
            style={{ display: "block", marginBottom: space("xs", 0.5), fontSize: "0.9rem" }}
          >
            Company Size
          </label>
          <select
            id="size-filter"
            value={sizeFilter}
            onChange={(e) => setSizeFilter(e.target.value as CompanySizeFilter)}
            style={{
              padding: `${space("xs", 0.75)} ${space("sm")}`,
              borderRadius: "8px",
              border: "1px solid rgba(148, 163, 184, 0.3)",
              background: "rgba(15, 23, 42, 0.7)",
              color: "var(--gray-100)",
              fontSize: "1rem",
              minWidth: "180px",
            }}
          >
            {companySizes.map((size) => (
              <option key={size} value={size}>
                {size === "All" ? "All Sizes" : `${size} employees`}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Case Studies Grid */}
      <div
        style={{
          display: "grid",
          gap: space("lg"),
          gridTemplateColumns: "repeat(auto-fill, minmax(380px, 1fr))",
        }}
      >
        {filteredStudies.length > 0 ? (
          filteredStudies.map((study) => (
            <Link
              key={study.id}
              href={`/case-studies/${study.slug}`}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <article
                className="glass"
                style={{
                  padding: space("md"),
                  borderRadius: "16px",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  transition: "all 0.2s ease",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.3)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                {/* Company Info */}
                <div style={{ marginBottom: space("sm") }}>
                  <h2 style={{ fontSize: "1.5rem", marginBottom: space("xs", 0.5) }}>{study.company}</h2>
                  <div style={{ display: "flex", gap: space("xs", 1.5), flexWrap: "wrap", fontSize: "0.9rem" }}>
                    <span
                      style={{
                        color: "var(--gray-400)",
                        background: "rgba(148, 163, 184, 0.1)",
                        padding: "4px 10px",
                        borderRadius: "6px",
                      }}
                    >
                      {study.industry}
                    </span>
                    <span
                      style={{
                        color: "var(--gray-400)",
                        background: "rgba(148, 163, 184, 0.1)",
                        padding: "4px 10px",
                        borderRadius: "6px",
                      }}
                    >
                      {study.companySize}
                    </span>
                  </div>
                </div>

                {/* Key Metrics */}
                <div
                  style={{
                    flex: 1,
                    display: "grid",
                    gap: space("xs", 1.25),
                    marginBottom: space("md"),
                  }}
                >
                  {study.impact.metrics.slice(0, 3).map((metric) => (
                    <div key={metric.label}>
                      <div
                        style={{
                          fontSize: "1.8rem",
                          fontWeight: 700,
                          color: "var(--primary)",
                          lineHeight: 1,
                        }}
                      >
                        {metric.value}
                      </div>
                      <div style={{ fontSize: "0.9rem", color: "var(--gray-300)", marginTop: space("xs", 0.25) }}>
                        {metric.label}
                      </div>
                      <div style={{ fontSize: "0.85rem", color: "var(--gray-400)", marginTop: space("xs", 0.125) }}>
                        {metric.detail}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Products Used */}
                <div
                  style={{
                    paddingTop: space("sm"),
                    borderTop: "1px solid rgba(148, 163, 184, 0.2)",
                  }}
                >
                  <div style={{ fontSize: "0.85rem", color: "var(--gray-500)", marginBottom: space("xs", 0.5) }}>
                    Products Used
                  </div>
                  <div style={{ display: "flex", gap: space("xs", 0.75), flexWrap: "wrap" }}>
                    {study.productsUsed.slice(0, 3).map((product) => (
                      <span
                        key={product}
                        style={{
                          fontSize: "0.8rem",
                          color: "var(--gray-300)",
                          background: "rgba(59, 130, 246, 0.1)",
                          padding: "2px 8px",
                          borderRadius: "4px",
                        }}
                      >
                        {product}
                      </span>
                    ))}
                    {study.productsUsed.length > 3 && (
                      <span
                        style={{
                          fontSize: "0.8rem",
                          color: "var(--gray-400)",
                          padding: "2px 8px",
                        }}
                      >
                        +{study.productsUsed.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Read More CTA */}
                <div
                  style={{
                    marginTop: space("md"),
                    color: "var(--primary)",
                    fontSize: "0.95rem",
                    fontWeight: 600,
                  }}
                >
                  Read full case study →
                </div>
              </article>
            </Link>
          ))
        ) : (
          <div
            className="glass"
            style={{
              padding: space("lg"),
              borderRadius: "14px",
              textAlign: "center",
              gridColumn: "1 / -1",
            }}
          >
            <p style={{ color: "var(--gray-300)", fontSize: "1.1rem" }}>
              No case studies match your filters. Try adjusting your search.
            </p>
          </div>
        )}
      </div>

      {/* CTA Section */}
      <section
        className="glass"
        style={{
          padding: space("xl"),
          borderRadius: "16px",
          marginTop: space("xl"),
          textAlign: "center",
          maxWidth: "800px",
          margin: `${space("xl")} auto 0`,
        }}
      >
        <h2 style={{ marginBottom: space("sm"), fontSize: "2rem" }}>Ready to Transform Your Operations?</h2>
        <p style={{ color: "var(--gray-300)", marginBottom: space("md"), fontSize: "1.1rem", lineHeight: 1.7 }}>
          See how Artifically can deliver measurable ROI for your team. Schedule a demo to explore automation
          opportunities specific to your industry and use cases.
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
            href="/contact"
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
            Contact Sales
          </Link>
        </div>
      </section>
    </main>
  );
}
