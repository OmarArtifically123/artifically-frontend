import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { space } from "@/styles/spacing";
import categories from "@/data/help-center/categories.json";
import articles from "@/data/help-center/articles.json";

type CategoryPageProps = {
  params: { category: string };
};

export function generateStaticParams() {
  return categories.map((category) => ({ category: category.slug }));
}

export function generateMetadata({ params }: CategoryPageProps): Metadata {
  const category = categories.find((c) => c.slug === params.category);

  if (!category) {
    return { title: "Help Category | Artifically" };
  }

  return {
    title: `${category.name} - Help Center | Artifically`,
    description: category.description,
  };
}

export default function HelpCategoryPage({ params }: CategoryPageProps) {
  const category = categories.find((c) => c.slug === params.category);
  const categoryArticles = articles.filter((a) => a.category === params.category);

  if (!category) {
    notFound();
    return null;
  }

  return (
    <main className="container" style={{ padding: `${space("2xl")} 0` }}>
      {/* Breadcrumbs */}
      <nav style={{ marginBottom: space("md"), fontSize: "0.9rem", color: "var(--gray-400)" }}>
        <Link href="/help" style={{ color: "var(--primary)", textDecoration: "none" }}>
          Help Center
        </Link>
        {" / "}
        <span>{category.name}</span>
      </nav>

      {/* Category Header */}
      <header style={{ maxWidth: "800px", margin: `0 auto ${space("xl")}`, textAlign: "center" }}>
        <div
          style={{
            width: "80px",
            height: "80px",
            borderRadius: "16px",
            background: "rgba(59, 130, 246, 0.15)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: `0 auto ${space("md")}`,
            fontSize: "2.5rem",
          }}
        >
          {category.icon === "rocket" && "🚀"}
          {category.icon === "grid" && "🎯"}
          {category.icon === "plug" && "🔌"}
          {category.icon === "credit-card" && "💳"}
          {category.icon === "wrench" && "🔧"}
          {category.icon === "code" && "💻"}
        </div>

        <h1 style={{ fontSize: "2.75rem", fontWeight: 800, marginBottom: space("sm"), lineHeight: 1.2 }}>
          {category.name}
        </h1>
        <p style={{ color: "var(--gray-300)", fontSize: "1.15rem", lineHeight: 1.7 }}>
          {category.description}
        </p>
      </header>

      {/* Articles List */}
      <section>
        <div style={{ display: "grid", gap: space("sm"), maxWidth: "900px", margin: "0 auto" }}>
          {categoryArticles.length > 0 ? (
            categoryArticles.map((article) => (
              <Link
                key={article.id}
                href={`/help/${params.category}/${article.slug}`}
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
                  <h3 style={{ fontSize: "1.2rem", marginBottom: space("xs", 0.75), lineHeight: 1.4 }}>
                    {article.title}
                  </h3>
                  <p style={{ color: "var(--gray-300)", lineHeight: 1.6, marginBottom: space("sm"), fontSize: "0.95rem" }}>
                    {article.description}
                  </p>
                  <div
                    style={{
                      display: "flex",
                      gap: space("md"),
                      alignItems: "center",
                      fontSize: "0.85rem",
                      color: "var(--gray-400)",
                    }}
                  >
                    <span>{article.readTime}</span>
                    <span>•</span>
                    <span>👁 {article.views.toLocaleString()} views</span>
                    <span>•</span>
                    <span>
                      👍 {article.helpful} / 👎 {article.notHelpful}
                    </span>
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
              }}
            >
              <p style={{ color: "var(--gray-300)", fontSize: "1.1rem" }}>
                No articles available in this category yet.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Back to Help Center */}
      <div style={{ textAlign: "center", marginTop: space("xl") }}>
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
          ← Back to Help Center
        </Link>
      </div>
    </main>
  );
}
