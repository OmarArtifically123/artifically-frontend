"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { space } from "@/styles/spacing";
import categories from "@/data/help-center/categories.json";
import articles from "@/data/help-center/articles.json";

export default function HelpCenterLanding() {
  const [searchQuery, setSearchQuery] = useState("");

  const searchResults = useMemo(() => {
    if (!searchQuery) return [];

    const query = searchQuery.toLowerCase();
    return articles.filter(
      (article) =>
        article.title.toLowerCase().includes(query) ||
        article.description.toLowerCase().includes(query) ||
        article.category.toLowerCase().includes(query)
    ).slice(0, 10);
  }, [searchQuery]);

  const showResults = searchQuery.length > 0;

  return (
    <main className="container" style={{ padding: `${space("2xl")} 0` }}>
      {/* Hero Section */}
      <header style={{ maxWidth: "800px", margin: `0 auto ${space("xl")}`, textAlign: "center" }}>
        <h1 style={{ fontSize: "3rem", fontWeight: 800, marginBottom: space("sm"), lineHeight: 1.2 }}>
          Help Center
        </h1>
        <p style={{ color: "var(--gray-300)", fontSize: "1.2rem", lineHeight: 1.7 }}>
          Self-serve resources and quick answers for operators, developers, and security teams.
        </p>
      </header>

      {/* Search Bar */}
      <div style={{ maxWidth: "700px", margin: `0 auto ${space("lg")}` }}>
        <div style={{ position: "relative" }}>
          <input
            type="search"
            placeholder="Search for help articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: "100%",
              padding: `${space("md")} ${space("md")}`,
              paddingLeft: space("xl"),
              borderRadius: "12px",
              border: "2px solid rgba(148, 163, 184, 0.3)",
              background: "rgba(15, 23, 42, 0.7)",
              color: "var(--gray-100)",
              fontSize: "1.1rem",
            }}
          />
          <span
            style={{
              position: "absolute",
              left: space("md"),
              top: "50%",
              transform: "translateY(-50%)",
              fontSize: "1.3rem",
              color: "var(--gray-400)",
            }}
          >
            🔍
          </span>
        </div>

        {/* Search Results Dropdown */}
        {showResults && (
          <div
            className="glass"
            style={{
              marginTop: space("xs"),
              borderRadius: "12px",
              padding: searchResults.length > 0 ? space("sm") : space("md"),
              maxHeight: "400px",
              overflowY: "auto",
            }}
          >
            {searchResults.length > 0 ? (
              <div style={{ display: "grid", gap: space("xs") }}>
                {searchResults.map((article) => (
                  <Link
                    key={article.id}
                    href={`/help/${article.category}/${article.slug}`}
                    style={{
                      display: "block",
                      padding: space("sm"),
                      borderRadius: "8px",
                      textDecoration: "none",
                      color: "inherit",
                      transition: "background 0.2s ease",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(148, 163, 184, 0.1)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  >
                    <div style={{ fontWeight: 600, marginBottom: space("xs", 0.25) }}>{article.title}</div>
                    <div style={{ fontSize: "0.9rem", color: "var(--gray-400)" }}>
                      {article.description.substring(0, 100)}...
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: "center", color: "var(--gray-400)" }}>
                No articles found. Try a different search term.
              </div>
            )}
          </div>
        )}
      </div>

      {/* Categories Grid */}
      {!showResults && (
        <>
          <section style={{ marginBottom: space("xl") }}>
            <h2 style={{ textAlign: "center", marginBottom: space("md"), fontSize: "2rem" }}>
              Browse by Category
            </h2>
            <div
              style={{
                display: "grid",
                gap: space("md"),
                gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
              }}
            >
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/help/${category.slug}`}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <article
                    className="glass"
                    style={{
                      padding: space("lg"),
                      borderRadius: "16px",
                      height: "100%",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
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
                    {/* Icon */}
                    <div
                      style={{
                        width: "56px",
                        height: "56px",
                        borderRadius: "12px",
                        background: "rgba(59, 130, 246, 0.15)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginBottom: space("md"),
                        fontSize: "1.75rem",
                      }}
                    >
                      {category.icon === "rocket" && "🚀"}
                      {category.icon === "grid" && "🎯"}
                      {category.icon === "plug" && "🔌"}
                      {category.icon === "credit-card" && "💳"}
                      {category.icon === "wrench" && "🔧"}
                      {category.icon === "code" && "💻"}
                    </div>

                    <h3 style={{ fontSize: "1.4rem", marginBottom: space("xs", 0.75) }}>
                      {category.name}
                    </h3>
                    <p style={{ color: "var(--gray-300)", lineHeight: 1.6, marginBottom: space("md") }}>
                      {category.description}
                    </p>

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        paddingTop: space("sm"),
                        borderTop: "1px solid rgba(148, 163, 184, 0.2)",
                      }}
                    >
                      <span style={{ fontSize: "0.9rem", color: "var(--gray-400)" }}>
                        {category.articleCount} articles
                      </span>
                      <span style={{ color: "var(--primary)", fontWeight: 600 }}>View articles →</span>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </section>

          {/* Popular Articles */}
          <section style={{ marginBottom: space("xl") }}>
            <h2 style={{ textAlign: "center", marginBottom: space("md"), fontSize: "2rem" }}>
              Popular Articles
            </h2>
            <div
              style={{
                display: "grid",
                gap: space("sm"),
                gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
              }}
            >
              {articles.slice(0, 6).map((article) => {
                const category = categories.find((c) => c.id === article.category);
                return (
                  <Link
                    key={article.id}
                    href={`/help/${article.category}/${article.slug}`}
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    <div
                      className="glass"
                      style={{
                        padding: space("md"),
                        borderRadius: "12px",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(148, 163, 184, 0.05)")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "")}
                    >
                      <div style={{ fontSize: "0.85rem", color: "var(--primary)", marginBottom: space("xs", 0.5) }}>
                        {category?.name}
                      </div>
                      <h3 style={{ fontSize: "1.1rem", marginBottom: space("xs", 0.75), lineHeight: 1.4 }}>
                        {article.title}
                      </h3>
                      <div
                        style={{
                          display: "flex",
                          gap: space("sm"),
                          fontSize: "0.85rem",
                          color: "var(--gray-400)",
                        }}
                      >
                        <span>{article.readTime}</span>
                        <span>•</span>
                        <span>👁 {article.views.toLocaleString()}</span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>

          {/* Contact Support CTA */}
          <section
            className="glass"
            style={{
              padding: space("xl"),
              borderRadius: "16px",
              textAlign: "center",
              maxWidth: "700px",
              margin: "0 auto",
            }}
          >
            <h2 style={{ marginBottom: space("sm"), fontSize: "2rem" }}>Can't Find What You Need?</h2>
            <p style={{ color: "var(--gray-300)", marginBottom: space("md"), fontSize: "1.05rem", lineHeight: 1.7 }}>
              Our support team is available 24/7 with a dedicated escalation path for enterprise customers.
            </p>
            <div style={{ display: "flex", gap: space("sm"), justifyContent: "center", flexWrap: "wrap" }}>
              <Link
                href="/contact"
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
                Contact Support
              </Link>
              <a
                href="mailto:support@artifically.com"
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
                Email Support
              </a>
            </div>
          </section>
        </>
      )}
    </main>
  );
}
