import { useMemo } from "react";
import { space } from "../styles/spacing";

export default function Blog() {
  const posts = useMemo(
    () => [
      {
        title: "How enterprises deploy guardrailed AI in 14 days",
        date: "June 2, 2024",
        readingTime: "6 min read",
        summary:
          "A blueprint for shipping compliant automations quickly without sacrificing governance or quality.",
      },
      {
        title: "Inside the Artifically reliability stack",
        date: "May 18, 2024",
        readingTime: "8 min read",
        summary:
          "We share the architectural decisions that keep tens of thousands of workflows executing reliably at scale.",
      },
      {
        title: "Designing automations with human-in-the-loop review",
        date: "April 29, 2024",
        readingTime: "9 min read",
        summary:
          "Practical patterns for combining AI speed with expert oversight to meet regulatory expectations.",
      },
    ],
    []
  );

  return (
    <main className="container" style={{ padding: `${space("2xl")} 0`, minHeight: "80vh" }}>
      <header style={{ maxWidth: "680px", margin: `0 auto ${space("lg", 1.25)}`, textAlign: "center" }}>
        <h1 style={{ fontSize: "2.75rem", fontWeight: 800, marginBottom: space("xs", 1.5) }}>Artifically Blog</h1>
        <p style={{ color: "var(--gray-400)", fontSize: "1.1rem", lineHeight: 1.7 }}>
          Insights, architectural deep dives, and customer stories from the team building trustworthy
          automations for the enterprise.
        </p>
      </header>

      <section
        className="glass"
        style={{
          display: "grid",
          gap: space("md"),
          padding: space("lg"),
          borderRadius: "16px",
        }}
      >
        {posts.map((post) => (
          <article
            key={post.title}
            style={{
              padding: space("md"),
              borderRadius: "14px",
              border: "1px solid rgba(148, 163, 184, 0.25)",
              background: "rgba(15, 23, 42, 0.6)",
            }}
          >
            <div style={{ color: "var(--gray-400)", marginBottom: space("xs"), fontSize: "0.9rem" }}>
              {post.date} • {post.readingTime}
            </div>
            <h2 style={{ marginBottom: space("xs", 1.5), fontSize: "1.5rem", fontWeight: 700 }}>{post.title}</h2>
            <p style={{ color: "var(--gray-300)", lineHeight: 1.6 }}>{post.summary}</p>
          </article>
        ))}
      </section>
    </main>
  );
}