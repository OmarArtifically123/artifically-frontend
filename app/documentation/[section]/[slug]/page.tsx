import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { space } from "@/styles/spacing";
import sections from "@/data/documentation/sections.json";
import NavigationCard from "@/components/documentation/NavigationCard";

type Article = {
  id: string;
  title: string;
  slug: string;
  description: string;
  readTime: string;
  difficulty: string;
};

type DocArticlePageProps = {
  params: { section: string; slug: string };
};

export function generateStaticParams() {
  const params: { section: string; slug: string }[] = [];
  sections.forEach((section) => {
    section.articles.forEach((article: Article) => {
      params.push({
        section: section.slug,
        slug: article.slug,
      });
    });
  });
  return params;
}

export function generateMetadata({ params }: DocArticlePageProps): Metadata {
  const section = sections.find((s) => s.slug === params.section);
  const article = section?.articles.find((a: Article) => a.slug === params.slug);

  if (!article) {
    return { title: "Documentation | Artifically" };
  }

  return {
    title: `${article.title} | Artifically Documentation`,
    description: article.description,
  };
}

export default function DocArticlePage({ params }: DocArticlePageProps) {
  const section = sections.find((s) => s.slug === params.section);
  const article = section?.articles.find((a: Article) => a.slug === params.slug);

  if (!article || !section) {
    notFound();
    return null;
  }

  // Find next and previous articles in the section
  const currentIndex = section.articles.findIndex((a: Article) => a.slug === params.slug);
  const prevArticle = currentIndex > 0 ? section.articles[currentIndex - 1] : null;
  const nextArticle = currentIndex < section.articles.length - 1 ? section.articles[currentIndex + 1] : null;

  return (
    <main className="container" style={{ padding: `${space("2xl")} 0`, maxWidth: "900px" }}>
      {/* Breadcrumbs */}
      <nav style={{ marginBottom: space("lg"), fontSize: "0.9rem", color: "var(--gray-400)" }}>
        <Link href="/documentation" style={{ color: "var(--primary)", textDecoration: "none" }}>
          Documentation
        </Link>
        {" / "}
        <Link href={`/documentation#${section.id}`} style={{ color: "var(--primary)", textDecoration: "none" }}>
          {section.name}
        </Link>
        {" / "}
        <span>{article.title}</span>
      </nav>

      {/* Article Header */}
      <header style={{ marginBottom: space("xl") }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: space("sm"),
            marginBottom: space("md"),
          }}
        >
          <span
            style={{
              padding: "6px 14px",
              borderRadius: "6px",
              background: "rgba(59, 130, 246, 0.15)",
              color: "var(--primary)",
              fontSize: "0.85rem",
              fontWeight: 600,
            }}
          >
            {section.name}
          </span>
          <span
            style={{
              padding: "6px 12px",
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
              fontSize: "0.85rem",
              fontWeight: 600,
            }}
          >
            {article.difficulty}
          </span>
        </div>

        <h1 style={{ fontSize: "2.5rem", fontWeight: 800, marginBottom: space("md"), lineHeight: 1.2 }}>
          {article.title}
        </h1>

        <p style={{ fontSize: "1.15rem", color: "var(--gray-300)", lineHeight: 1.7, marginBottom: space("md") }}>
          {article.description}
        </p>

        <div
          style={{
            display: "flex",
            gap: space("md"),
            paddingBottom: space("md"),
            borderBottom: "1px solid rgba(148, 163, 184, 0.2)",
            fontSize: "0.9rem",
            color: "var(--gray-400)",
          }}
        >
          <span>📖 {article.readTime}</span>
        </div>
      </header>

      {/* Article Content */}
      <article
        className="glass"
        style={{
          padding: space("xl"),
          borderRadius: "16px",
          marginBottom: space("xl"),
        }}
      >
        <div
          style={{
            color: "var(--gray-200)",
            lineHeight: 1.9,
            fontSize: "1.05rem",
          }}
        >
          {/* Prerequisites (if applicable) */}
          {(section.id === "tutorials" || article.difficulty === "Advanced") && (
            <div
              style={{
                background: "rgba(234, 179, 8, 0.1)",
                border: "1px solid rgba(234, 179, 8, 0.3)",
                borderRadius: "12px",
                padding: space("md"),
                marginBottom: space("lg"),
              }}
            >
              <h3 style={{ fontSize: "1.15rem", marginBottom: space("sm"), color: "var(--gray-100)" }}>
                📋 Prerequisites
              </h3>
              <ul style={{ margin: 0, paddingLeft: space("md"), color: "var(--gray-200)" }}>
                <li style={{ marginBottom: space("xs", 0.5) }}>Active Artifically account</li>
                <li style={{ marginBottom: space("xs", 0.5) }}>Basic understanding of workflow automation</li>
                {article.difficulty === "Advanced" && (
                  <>
                    <li style={{ marginBottom: space("xs", 0.5) }}>Familiarity with API concepts</li>
                    <li style={{ marginBottom: space("xs", 0.5) }}>Experience with JavaScript/Python recommended</li>
                  </>
                )}
              </ul>
            </div>
          )}

          {/* Main Content */}
          <h2 style={{ fontSize: "1.75rem", marginTop: space("xl"), marginBottom: space("md"), color: "var(--gray-100)" }}>
            Overview
          </h2>
          <p style={{ marginBottom: space("md") }}>
            This guide will walk you through {article.description.toLowerCase()}. By the end, you'll have a solid
            understanding of the concepts and be able to implement them in your own workflows.
          </p>

          <h2 style={{ fontSize: "1.75rem", marginTop: space("xl"), marginBottom: space("md"), color: "var(--gray-100)" }}>
            Step-by-Step Guide
          </h2>

          <h3 style={{ fontSize: "1.3rem", marginTop: space("lg"), marginBottom: space("sm"), color: "var(--gray-100)" }}>
            Step 1: Initial Setup
          </h3>
          <p style={{ marginBottom: space("md") }}>
            Begin by navigating to your dashboard and locating the relevant section. Ensure you have the necessary
            permissions to perform these actions.
          </p>

          <div
            style={{
              background: "rgba(15, 23, 42, 0.8)",
              border: "1px solid rgba(148, 163, 184, 0.2)",
              borderRadius: "8px",
              padding: space("md"),
              marginBottom: space("md"),
              fontFamily: "monospace",
              fontSize: "0.95rem",
              position: "relative",
            }}
          >
            <pre style={{ margin: 0, color: "var(--gray-200)", overflowX: "auto" }}>
              {`// Example code snippet
const workflow = await artifically.workflows.create({
  name: "My First Workflow",
  trigger: { type: "manual" },
  actions: [
    { type: "sendEmail", to: "user@example.com" }
  ]
});`}
            </pre>
            <button
              style={{
                position: "absolute",
                top: space("sm"),
                right: space("sm"),
                padding: "6px 12px",
                background: "rgba(59, 130, 246, 0.2)",
                color: "var(--primary)",
                border: "none",
                borderRadius: "6px",
                fontSize: "0.85rem",
                cursor: "pointer",
              }}
            >
              Copy
            </button>
          </div>

          <h3 style={{ fontSize: "1.3rem", marginTop: space("lg"), marginBottom: space("sm"), color: "var(--gray-100)" }}>
            Step 2: Configuration
          </h3>
          <p style={{ marginBottom: space("md") }}>
            Configure your settings according to your specific requirements. Pay attention to the following parameters:
          </p>

          <ul style={{ marginBottom: space("md"), paddingLeft: space("md") }}>
            <li style={{ marginBottom: space("xs", 0.75) }}>
              <strong>Parameter 1:</strong> Description of what this parameter does and recommended values
            </li>
            <li style={{ marginBottom: space("xs", 0.75) }}>
              <strong>Parameter 2:</strong> Additional configuration option with examples
            </li>
            <li style={{ marginBottom: space("xs", 0.75) }}>
              <strong>Parameter 3:</strong> Optional setting for advanced use cases
            </li>
          </ul>

          <h3 style={{ fontSize: "1.3rem", marginTop: space("lg"), marginBottom: space("sm"), color: "var(--gray-100)" }}>
            Step 3: Testing & Validation
          </h3>
          <p style={{ marginBottom: space("md") }}>
            Before deploying to production, test your configuration thoroughly. Use the built-in testing tools to verify
            everything works as expected.
          </p>

          <div
            style={{
              background: "rgba(59, 130, 246, 0.1)",
              border: "1px solid rgba(59, 130, 246, 0.3)",
              borderRadius: "12px",
              padding: space("md"),
              marginTop: space("lg"),
              marginBottom: space("lg"),
            }}
          >
            <h4 style={{ fontSize: "1.15rem", marginBottom: space("sm"), color: "var(--gray-100)" }}>
              💡 Best Practice
            </h4>
            <p style={{ color: "var(--gray-200)", lineHeight: 1.7, margin: 0 }}>
              Always test in a staging environment first. This helps identify issues before they impact production
              workflows. Set up proper monitoring and alerting to catch problems early.
            </p>
          </div>

          <h2 style={{ fontSize: "1.75rem", marginTop: space("xl"), marginBottom: space("md"), color: "var(--gray-100)" }}>
            Common Pitfalls
          </h2>
          <p style={{ marginBottom: space("md") }}>
            Here are some common mistakes to avoid:
          </p>

          <ul style={{ marginBottom: space("md"), paddingLeft: space("md") }}>
            <li style={{ marginBottom: space("xs", 0.75), lineHeight: 1.7 }}>
              Not testing configuration changes before deploying
            </li>
            <li style={{ marginBottom: space("xs", 0.75), lineHeight: 1.7 }}>
              Forgetting to set up proper error handling
            </li>
            <li style={{ marginBottom: space("xs", 0.75), lineHeight: 1.7 }}>
              Overlooking rate limits and API quotas
            </li>
          </ul>

          <h2 style={{ fontSize: "1.75rem", marginTop: space("xl"), marginBottom: space("md"), color: "var(--gray-100)" }}>
            Next Steps
          </h2>
          <p style={{ marginBottom: 0 }}>
            Now that you've completed this guide, you're ready to explore more advanced topics. Check out the related
            documentation below for further learning.
          </p>
        </div>
      </article>

      {/* Navigation */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: prevArticle && nextArticle ? "1fr 1fr" : "1fr",
          gap: space("md"),
          marginBottom: space("xl"),
        }}
      >
        {prevArticle && (
          <NavigationCard
            href={`/documentation/${params.section}/${prevArticle.slug}`}
            direction="prev"
            title={prevArticle.title}
          />
        )}
        {nextArticle && (
          <NavigationCard
            href={`/documentation/${params.section}/${nextArticle.slug}`}
            direction="next"
            title={nextArticle.title}
            showOpposite={!prevArticle}
            style={{ gridColumn: prevArticle ? "auto" : "1" }}
          />
        )}
      </div>

      {/* Feedback */}
      <section
        className="glass"
        style={{
          padding: space("xl"),
          borderRadius: "16px",
          textAlign: "center",
        }}
      >
        <h2 style={{ marginBottom: space("sm"), fontSize: "1.75rem" }}>Was This Helpful?</h2>
        <p style={{ color: "var(--gray-300)", marginBottom: space("md"), fontSize: "1rem", lineHeight: 1.7 }}>
          Let us know if this documentation helped you. Your feedback helps us improve.
        </p>
        <div style={{ display: "flex", gap: space("sm"), justifyContent: "center" }}>
          <button
            style={{
              padding: `${space("sm")} ${space("md", 1.5)}`,
              background: "rgba(34, 197, 94, 0.15)",
              color: "#22c55e",
              border: "1px solid rgba(34, 197, 94, 0.3)",
              borderRadius: "8px",
              fontWeight: 600,
              cursor: "pointer",
              fontSize: "1rem",
            }}
          >
            👍 Yes
          </button>
          <button
            style={{
              padding: `${space("sm")} ${space("md", 1.5)}`,
              background: "rgba(239, 68, 68, 0.15)",
              color: "#ef4444",
              border: "1px solid rgba(239, 68, 68, 0.3)",
              borderRadius: "8px",
              fontWeight: 600,
              cursor: "pointer",
              fontSize: "1rem",
            }}
          >
            👎 No
          </button>
        </div>
      </section>
    </main>
  );
}
