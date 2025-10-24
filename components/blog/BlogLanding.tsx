"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { space } from "@/styles/spacing";
import posts from "@/data/blog/posts.json";
import categories from "@/data/blog/categories.json";

export default function BlogLanding() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchesCategory = selectedCategory === "All" || post.category === selectedCategory;
      const matchesSearch =
        searchQuery === "" ||
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const featuredPost = posts.find((post) => post.featured);
  const regularPosts = filteredPosts.filter((post) => !post.featured || selectedCategory !== "All" || searchQuery !== "");

  return (
    <main className="container" style={{ padding: `${space("2xl")} 0` }}>
      {/* Hero Section */}
      <header style={{ maxWidth: "800px", margin: `0 auto ${space("xl")}`, textAlign: "center" }}>
        <h1 style={{ fontSize: "3rem", fontWeight: 800, marginBottom: space("sm"), lineHeight: 1.2 }}>
          Blog
        </h1>
        <p style={{ color: "var(--gray-300)", fontSize: "1.2rem", lineHeight: 1.7 }}>
          Insights, best practices, and technical deep dives on AI automation, workflow design, and enterprise
          operations.
        </p>
      </header>

      {/* Search Bar */}
      <div style={{ maxWidth: "600px", margin: `0 auto ${space("lg")}` }}>
        <input
          type="search"
          placeholder="Search articles..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            width: "100%",
            padding: `${space("sm")} ${space("md")}`,
            borderRadius: "12px",
            border: "1px solid rgba(148, 163, 184, 0.3)",
            background: "rgba(15, 23, 42, 0.7)",
            color: "var(--gray-100)",
            fontSize: "1rem",
          }}
        />
      </div>

      {/* Category Filters */}
      <div
        style={{
          display: "flex",
          gap: space("xs", 1),
          marginBottom: space("xl"),
          justifyContent: "center",
          flexWrap: "wrap",
        }}
      >
        <button
          onClick={() => setSelectedCategory("All")}
          style={{
            padding: `${space("xs", 0.625)} ${space("sm", 1.125)}`,
            borderRadius: "8px",
            border: "none",
            background: selectedCategory === "All" ? "var(--primary)" : "rgba(148, 163, 184, 0.15)",
            color: selectedCategory === "All" ? "white" : "var(--gray-300)",
            cursor: "pointer",
            fontWeight: 600,
            fontSize: "0.95rem",
            transition: "all 0.2s ease",
          }}
        >
          All Posts
        </button>
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.name)}
            style={{
              padding: `${space("xs", 0.625)} ${space("sm", 1.125)}`,
              borderRadius: "8px",
              border: "none",
              background: selectedCategory === category.name ? "var(--primary)" : "rgba(148, 163, 184, 0.15)",
              color: selectedCategory === category.name ? "white" : "var(--gray-300)",
              cursor: "pointer",
              fontWeight: 600,
              fontSize: "0.95rem",
              transition: "all 0.2s ease",
            }}
          >
            {category.name}
            {category.count > 0 && (
              <span
                style={{
                  marginLeft: space("xs", 0.5),
                  opacity: 0.7,
                  fontSize: "0.85rem",
                }}
              >
                ({category.count})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Featured Post (only show when no filters applied) */}
      {selectedCategory === "All" && searchQuery === "" && featuredPost && (
        <Link
          href={`/blog/${featuredPost.slug}`}
          style={{ textDecoration: "none", color: "inherit", display: "block", marginBottom: space("xl") }}
        >
          <article
            className="glass"
            style={{
              padding: space("lg"),
              borderRadius: "16px",
              display: "grid",
              gridTemplateColumns: "1fr",
              gap: space("md"),
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
            <div>
              <span
                style={{
                  display: "inline-block",
                  padding: "4px 12px",
                  borderRadius: "6px",
                  background: "var(--primary)",
                  color: "white",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  marginBottom: space("sm"),
                }}
              >
                Featured
              </span>
              <h2 style={{ fontSize: "2rem", marginBottom: space("sm"), lineHeight: 1.3 }}>
                {featuredPost.title}
              </h2>
              <p style={{ color: "var(--gray-300)", fontSize: "1.1rem", lineHeight: 1.7, marginBottom: space("md") }}>
                {featuredPost.excerpt}
              </p>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: space("md"),
                  fontSize: "0.9rem",
                  color: "var(--gray-400)",
                }}
              >
                <span>{featuredPost.author.name}</span>
                <span>•</span>
                <span>{featuredPost.publishedDate}</span>
                <span>•</span>
                <span>{featuredPost.readTime}</span>
              </div>
            </div>
          </article>
        </Link>
      )}

      {/* Regular Posts Grid */}
      {regularPosts.length > 0 ? (
        <div
          style={{
            display: "grid",
            gap: space("lg"),
            gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))",
          }}
        >
          {regularPosts.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
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
                <div style={{ marginBottom: space("xs", 0.75) }}>
                  <span
                    style={{
                      fontSize: "0.85rem",
                      color: "var(--primary)",
                      fontWeight: 600,
                    }}
                  >
                    {post.category}
                  </span>
                </div>

                <h3 style={{ fontSize: "1.3rem", marginBottom: space("sm"), lineHeight: 1.4, flex: 0 }}>
                  {post.title}
                </h3>

                <p
                  style={{
                    color: "var(--gray-300)",
                    lineHeight: 1.6,
                    marginBottom: space("md"),
                    flex: 1,
                    fontSize: "0.95rem",
                  }}
                >
                  {post.excerpt}
                </p>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: space("sm"),
                    paddingTop: space("sm"),
                    borderTop: "1px solid rgba(148, 163, 184, 0.2)",
                    fontSize: "0.85rem",
                    color: "var(--gray-400)",
                  }}
                >
                  <span>{post.author.name}</span>
                  <span>•</span>
                  <span>{post.readTime}</span>
                </div>

                {post.tags && post.tags.length > 0 && (
                  <div style={{ display: "flex", gap: space("xs", 0.5), flexWrap: "wrap", marginTop: space("sm") }}>
                    {post.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        style={{
                          fontSize: "0.75rem",
                          color: "var(--gray-400)",
                          background: "rgba(148, 163, 184, 0.1)",
                          padding: "2px 8px",
                          borderRadius: "4px",
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </article>
            </Link>
          ))}
        </div>
      ) : (
        <div
          className="glass"
          style={{
            padding: space("lg"),
            borderRadius: "14px",
            textAlign: "center",
          }}
        >
          <p style={{ color: "var(--gray-300)", fontSize: "1.1rem" }}>
            No articles found matching your criteria. Try adjusting your filters or search query.
          </p>
        </div>
      )}

      {/* Newsletter CTA */}
      <section
        className="glass"
        style={{
          padding: space("xl"),
          borderRadius: "16px",
          marginTop: space("xl"),
          textAlign: "center",
          maxWidth: "700px",
          margin: `${space("xl")} auto 0`,
        }}
      >
        <h2 style={{ marginBottom: space("sm"), fontSize: "2rem" }}>Stay Updated</h2>
        <p style={{ color: "var(--gray-300)", marginBottom: space("md"), fontSize: "1.05rem", lineHeight: 1.7 }}>
          Get the latest insights on AI automation, workflow design, and operational excellence delivered to your inbox
          monthly.
        </p>
        <form
          style={{ display: "flex", gap: space("sm"), maxWidth: "500px", margin: "0 auto", flexWrap: "wrap" }}
          onSubmit={(e) => {
            e.preventDefault();
            alert("Newsletter signup would be handled here");
          }}
        >
          <input
            type="email"
            placeholder="Enter your email"
            required
            style={{
              flex: 1,
              minWidth: "250px",
              padding: `${space("sm")} ${space("md")}`,
              borderRadius: "8px",
              border: "1px solid rgba(148, 163, 184, 0.3)",
              background: "rgba(15, 23, 42, 0.7)",
              color: "var(--gray-100)",
              fontSize: "1rem",
            }}
          />
          <button
            type="submit"
            style={{
              padding: `${space("sm")} ${space("md", 1.5)}`,
              background: "var(--primary)",
              color: "white",
              borderRadius: "8px",
              fontWeight: 600,
              border: "none",
              cursor: "pointer",
              fontSize: "1rem",
              transition: "opacity 0.2s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.9")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
          >
            Subscribe
          </button>
        </form>
      </section>
    </main>
  );
}
