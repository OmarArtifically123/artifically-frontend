"use client";

import { useState } from "react";
import Link from "next/link";
import { space } from "@/styles/spacing";
import sections from "@/data/documentation/sections.json";

export default function DocumentationPage() {
  const [activeSection, setActiveSection] = useState(sections[0].id);
  const [searchQuery, setSearchQuery] = useState("");

  const currentSection = sections.find((s) => s.id === activeSection);

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* Left Sidebar Navigation */}
      <aside
        style={{
          width: "280px",
          position: "sticky",
          top: 0,
          height: "100vh",
          overflowY: "auto",
          borderRight: "1px solid rgba(148, 163, 184, 0.2)",
          padding: space("lg"),
          background: "rgba(15, 23, 42, 0.6)",
        }}
      >
        {/* Search */}
        <div style={{ marginBottom: space("md") }}>
          <input
            type="search"
            placeholder="Search docs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: "100%",
              padding: `${space("xs", 0.75)} ${space("sm")}`,
              borderRadius: "8px",
              border: "1px solid rgba(148, 163, 184, 0.3)",
              background: "rgba(15, 23, 42, 0.8)",
              color: "var(--gray-100)",
              fontSize: "0.95rem",
            }}
          />
        </div>

        {/* Navigation Sections */}
        <nav>
          {sections.map((section) => (
            <div key={section.id} style={{ marginBottom: space("md") }}>
              <button
                onClick={() => setActiveSection(section.id)}
                style={{
                  width: "100%",
                  textAlign: "left",
                  padding: `${space("xs", 0.75)} ${space("sm")}`,
                  borderRadius: "8px",
                  border: "none",
                  background: activeSection === section.id ? "rgba(59, 130, 246, 0.2)" : "transparent",
                  color: activeSection === section.id ? "var(--primary)" : "var(--gray-300)",
                  cursor: "pointer",
                  fontWeight: 600,
                  fontSize: "0.95rem",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  if (activeSection !== section.id) {
                    e.currentTarget.style.background = "rgba(148, 163, 184, 0.1)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeSection !== section.id) {
                    e.currentTarget.style.background = "transparent";
                  }
                }}
              >
                {section.name}
              </button>

              {activeSection === section.id && (
                <div style={{ marginTop: space("xs"), paddingLeft: space("sm") }}>
                  {section.articles.map((article: any) => (
                    <Link
                      key={article.id}
                      href={`/documentation/${section.slug}/${article.slug}`}
                      style={{
                        display: "block",
                        padding: `${space("xs", 0.5)} ${space("xs", 0.75)}`,
                        color: "var(--gray-400)",
                        textDecoration: "none",
                        fontSize: "0.9rem",
                        lineHeight: 1.5,
                        borderRadius: "6px",
                        transition: "all 0.2s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = "var(--gray-200)";
                        e.currentTarget.style.background = "rgba(148, 163, 184, 0.05)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = "var(--gray-400)";
                        e.currentTarget.style.background = "transparent";
                      }}
                    >
                      {article.title}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Quick Links */}
        <div
          style={{
            marginTop: space("xl"),
            paddingTop: space("md"),
            borderTop: "1px solid rgba(148, 163, 184, 0.2)",
          }}
        >
          <div style={{ fontSize: "0.85rem", color: "var(--gray-500)", marginBottom: space("sm") }}>
            Quick Links
          </div>
          <div style={{ display: "grid", gap: space("xs", 0.75) }}>
            <Link
              href="/help"
              style={{
                color: "var(--gray-400)",
                textDecoration: "none",
                fontSize: "0.9rem",
              }}
            >
              Help Center
            </Link>
            <Link
              href="/api"
              style={{
                color: "var(--gray-400)",
                textDecoration: "none",
                fontSize: "0.9rem",
              }}
            >
              API Reference
            </Link>
            <a
              href="https://github.com/artifically"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: "var(--gray-400)",
                textDecoration: "none",
                fontSize: "0.9rem",
              }}
            >
              GitHub
            </a>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="container" style={{ flex: 1, padding: `${space("xl")} ${space("lg")}`, maxWidth: "900px" }}>
        {/* Header */}
        <header style={{ marginBottom: space("xl") }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: space("xs"),
              padding: "6px 14px",
              borderRadius: "6px",
              background: "rgba(59, 130, 246, 0.15)",
              color: "var(--primary)",
              fontSize: "0.85rem",
              fontWeight: 600,
              marginBottom: space("md"),
            }}
          >
            {currentSection?.icon === "book-open" && "📖"}
            {currentSection?.icon === "list-checks" && "✅"}
            {currentSection?.icon === "code" && "💻"}
            {currentSection?.icon === "lightbulb" && "💡"}
            <span>{currentSection?.name}</span>
          </div>

          <h1 style={{ fontSize: "2.75rem", fontWeight: 800, marginBottom: space("sm"), lineHeight: 1.2 }}>
            {currentSection?.name}
          </h1>
          <p style={{ color: "var(--gray-300)", fontSize: "1.15rem", lineHeight: 1.7 }}>
            {currentSection?.description}
          </p>
        </header>

        {/* Articles Grid */}
        <section>
          <div style={{ display: "grid", gap: space("md") }}>
            {currentSection?.articles.map((article: any) => (
              <Link
                key={article.id}
                href={`/documentation/${currentSection.slug}/${article.slug}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <article
                  className="glass"
                  style={{
                    padding: space("md", 1.25),
                    borderRadius: "14px",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateX(4px)";
                    e.currentTarget.style.background = "rgba(148, 163, 184, 0.05)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateX(0)";
                    e.currentTarget.style.background = "";
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: space("xs", 0.75) }}>
                    <h3 style={{ fontSize: "1.2rem", lineHeight: 1.4, margin: 0 }}>
                      {article.title}
                    </h3>
                    <span
                      style={{
                        padding: "4px 10px",
                        borderRadius: "6px",
                        background:
                          article.difficulty === "Beginner"
                            ? "rgba(34, 197, 94, 0.15)"
                            : article.difficulty === "Intermediate"
                            ? "rgba(234, 179, 8, 0.15)"
                            : "rgba(239, 68, 68, 0.15)",
                        color:
                          article.difficulty === "Beginner"
                            ? "#22c55e"
                            : article.difficulty === "Intermediate"
                            ? "#eab308"
                            : "#ef4444",
                        fontSize: "0.8rem",
                        fontWeight: 600,
                        flexShrink: 0,
                      }}
                    >
                      {article.difficulty}
                    </span>
                  </div>

                  <p style={{ color: "var(--gray-300)", lineHeight: 1.6, marginBottom: space("sm"), fontSize: "0.95rem" }}>
                    {article.description}
                  </p>

                  <div style={{ fontSize: "0.85rem", color: "var(--gray-400)" }}>
                    📖 {article.readTime}
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </section>

        {/* Additional Resources */}
        <section
          className="glass"
          style={{
            padding: space("xl"),
            borderRadius: "16px",
            marginTop: space("xl"),
            textAlign: "center",
          }}
        >
          <h2 style={{ marginBottom: space("sm"), fontSize: "1.75rem" }}>Need More Help?</h2>
          <p style={{ color: "var(--gray-300)", marginBottom: space("md"), fontSize: "1rem", lineHeight: 1.7 }}>
            Can't find what you're looking for? Check out our Help Center or contact support.
          </p>
          <div style={{ display: "flex", gap: space("sm"), justifyContent: "center", flexWrap: "wrap" }}>
            <Link
              href="/help"
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
              Visit Help Center
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
              onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(148, 163, 184, 0.1)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              Contact Support
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
