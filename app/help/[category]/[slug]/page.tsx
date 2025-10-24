import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { space } from "@/styles/spacing";
import categories from "@/data/help-center/categories.json";
import articles from "@/data/help-center/articles.json";

type ArticlePageProps = {
  params: { category: string; slug: string };
};

export function generateStaticParams() {
  return articles.map((article) => ({
    category: article.category,
    slug: article.slug,
  }));
}

export function generateMetadata({ params }: ArticlePageProps): Metadata {
  const article = articles.find((a) => a.slug === params.slug && a.category === params.category);

  if (!article) {
    return { title: "Help Article | Artifically" };
  }

  return {
    title: `${article.title} | Artifically Help Center`,
    description: article.description,
  };
}

export default function HelpArticlePage({ params }: ArticlePageProps) {
  const article = articles.find((a) => a.slug === params.slug && a.category === params.category);
  const category = categories.find((c) => c.id === params.category);

  if (!article || !category) {
    notFound();
    return null;
  }

  // Find related articles from the same category
  const relatedArticles = articles
    .filter((a) => a.category === params.category && a.id !== article.id)
    .slice(0, 3);

  return (
    <main className="container" style={{ padding: `${space("2xl")} 0`, maxWidth: "900px" }}>
      {/* Breadcrumbs */}
      <nav style={{ marginBottom: space("lg"), fontSize: "0.9rem", color: "var(--gray-400)" }}>
        <Link href="/help" style={{ color: "var(--primary)", textDecoration: "none" }}>
          Help Center
        </Link>
        {" / "}
        <Link href={`/help/${params.category}`} style={{ color: "var(--primary)", textDecoration: "none" }}>
          {category.name}
        </Link>
        {" / "}
        <span>{article.title}</span>
      </nav>

      {/* Article Header */}
      <header style={{ marginBottom: space("xl") }}>
        <h1 style={{ fontSize: "2.5rem", fontWeight: 800, marginBottom: space("md"), lineHeight: 1.2 }}>
          {article.title}
        </h1>

        {/* Meta Info */}
        <div
          style={{
            display: "flex",
            gap: space("md"),
            flexWrap: "wrap",
            paddingBottom: space("md"),
            borderBottom: "1px solid rgba(148, 163, 184, 0.2)",
            fontSize: "0.9rem",
            color: "var(--gray-400)",
          }}
        >
          <span>📖 {article.readTime}</span>
          <span>•</span>
          <span>👁 {article.views.toLocaleString()} views</span>
          <span>•</span>
          <span>Last updated: {article.lastUpdated}</span>
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
          {/* In a real implementation, this would render markdown or MDX content */}
          <p style={{ marginBottom: space("md") }}>
            {article.content}
          </p>

          <h2 style={{ fontSize: "1.75rem", marginTop: space("xl"), marginBottom: space("md"), color: "var(--gray-100)" }}>
            Step-by-Step Instructions
          </h2>

          <ol style={{ marginBottom: space("md"), paddingLeft: space("md"), color: "var(--gray-200)" }}>
            <li style={{ marginBottom: space("sm"), lineHeight: 1.7 }}>
              <strong>First step:</strong> Begin by navigating to the relevant section of your dashboard. You'll find
              detailed controls for configuring your workflow settings.
            </li>
            <li style={{ marginBottom: space("sm"), lineHeight: 1.7 }}>
              <strong>Configure settings:</strong> Adjust the parameters according to your specific use case. Make sure
              to test your configuration in a staging environment first.
            </li>
            <li style={{ marginBottom: space("sm"), lineHeight: 1.7 }}>
              <strong>Save and deploy:</strong> Once you're satisfied with your configuration, save your changes and
              deploy to production. Monitor the deployment process closely.
            </li>
            <li style={{ marginBottom: space("sm"), lineHeight: 1.7 }}>
              <strong>Verify results:</strong> Check the execution logs and analytics dashboard to confirm everything is
              working as expected.
            </li>
          </ol>

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
            <h3 style={{ fontSize: "1.15rem", marginBottom: space("sm"), color: "var(--gray-100)" }}>
              💡 Pro Tip
            </h3>
            <p style={{ color: "var(--gray-200)", lineHeight: 1.7, margin: 0 }}>
              Use the built-in testing tools to validate your configuration before deploying to production. This helps
              catch potential issues early and ensures smooth operation.
            </p>
          </div>

          <h2 style={{ fontSize: "1.75rem", marginTop: space("xl"), marginBottom: space("md"), color: "var(--gray-100)" }}>
            Troubleshooting
          </h2>

          <p style={{ marginBottom: space("md") }}>
            If you encounter issues, here are some common problems and their solutions:
          </p>

          <ul style={{ marginBottom: space("md"), paddingLeft: space("md"), color: "var(--gray-200)" }}>
            <li style={{ marginBottom: space("xs", 0.75), lineHeight: 1.7 }}>
              <strong>Issue 1:</strong> Check your API credentials and ensure they have the correct permissions
            </li>
            <li style={{ marginBottom: space("xs", 0.75), lineHeight: 1.7 }}>
              <strong>Issue 2:</strong> Verify network connectivity and firewall rules
            </li>
            <li style={{ marginBottom: space("xs", 0.75), lineHeight: 1.7 }}>
              <strong>Issue 3:</strong> Review error logs for detailed error messages and stack traces
            </li>
          </ul>

          <h2 style={{ fontSize: "1.75rem", marginTop: space("xl"), marginBottom: space("md"), color: "var(--gray-100)" }}>
            Next Steps
          </h2>

          <p style={{ marginBottom: space("md") }}>
            After completing this guide, you might want to explore:
          </p>

          <ul style={{ marginBottom: 0, paddingLeft: space("md"), color: "var(--gray-200)" }}>
            <li style={{ marginBottom: space("xs", 0.75), lineHeight: 1.7 }}>
              Advanced configuration options and customization
            </li>
            <li style={{ marginBottom: space("xs", 0.75), lineHeight: 1.7 }}>
              Integration with other tools and services
            </li>
            <li style={{ marginBottom: space("xs", 0.75), lineHeight: 1.7 }}>
              Performance optimization and best practices
            </li>
          </ul>
        </div>
      </article>

      {/* Was This Helpful */}
      <div
        className="glass"
        style={{
          padding: space("lg"),
          borderRadius: "14px",
          marginBottom: space("xl"),
          textAlign: "center",
        }}
      >
        <h3 style={{ fontSize: "1.3rem", marginBottom: space("md") }}>Was this article helpful?</h3>
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
            👍 Yes ({article.helpful})
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
            👎 No ({article.notHelpful})
          </button>
        </div>
      </div>

      {/* Related Articles */}
      {relatedArticles.length > 0 && (
        <section style={{ marginBottom: space("xl") }}>
          <h2 style={{ fontSize: "1.75rem", marginBottom: space("md") }}>Related Articles</h2>
          <div style={{ display: "grid", gap: space("sm") }}>
            {relatedArticles.map((related) => (
              <Link
                key={related.id}
                href={`/help/${params.category}/${related.slug}`}
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
                  <h3 style={{ fontSize: "1.1rem", marginBottom: space("xs", 0.5), lineHeight: 1.4 }}>
                    {related.title}
                  </h3>
                  <p style={{ color: "var(--gray-400)", fontSize: "0.9rem", lineHeight: 1.6, margin: 0 }}>
                    {related.description.substring(0, 120)}...
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Still Need Help */}
      <section
        className="glass"
        style={{
          padding: space("xl"),
          borderRadius: "16px",
          textAlign: "center",
        }}
      >
        <h2 style={{ marginBottom: space("sm"), fontSize: "1.75rem" }}>Still Need Help?</h2>
        <p style={{ color: "var(--gray-300)", marginBottom: space("md"), fontSize: "1rem", lineHeight: 1.7 }}>
          Our support team is here to help. Contact us for personalized assistance.
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
          <Link
            href="/help"
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
            Back to Help Center
          </Link>
        </div>
      </section>
    </main>
  );
}
