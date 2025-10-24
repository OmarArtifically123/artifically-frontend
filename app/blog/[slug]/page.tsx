import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { space } from "@/styles/spacing";
import posts from "@/data/blog/posts.json";

type BlogPostPageProps = {
  params: { slug: string };
};

export function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }));
}

export function generateMetadata({ params }: BlogPostPageProps): Metadata {
  const post = posts.find((p) => p.slug === params.slug);

  if (!post) {
    return { title: "Blog Post | Artifically" };
  }

  return {
    title: `${post.title} | Artifically Blog`,
    description: post.excerpt,
  };
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const post = posts.find((p) => p.slug === params.slug);

  if (!post) {
    notFound();
    return null;
  }

  // Find related posts (same category, different post)
  const relatedPosts = posts
    .filter((p) => p.category === post.category && p.id !== post.id)
    .slice(0, 3);

  return (
    <main className="container" style={{ padding: `${space("2xl")} 0`, maxWidth: "900px" }}>
      {/* Breadcrumbs */}
      <nav style={{ marginBottom: space("md"), fontSize: "0.9rem", color: "var(--gray-400)" }}>
        <Link href="/blog" style={{ color: "var(--primary)", textDecoration: "none" }}>
          Blog
        </Link>
        {" / "}
        <Link href={`/blog?category=${post.category}`} style={{ color: "var(--primary)", textDecoration: "none" }}>
          {post.category}
        </Link>
        {" / "}
        <span>{post.title}</span>
      </nav>

      {/* Article Header */}
      <header style={{ marginBottom: space("xl") }}>
        <span
          style={{
            display: "inline-block",
            padding: "6px 14px",
            borderRadius: "6px",
            background: "var(--primary)",
            color: "white",
            fontSize: "0.85rem",
            fontWeight: 600,
            marginBottom: space("md"),
          }}
        >
          {post.category}
        </span>

        <h1 style={{ fontSize: "2.75rem", fontWeight: 800, marginBottom: space("md"), lineHeight: 1.2 }}>
          {post.title}
        </h1>

        <p style={{ fontSize: "1.3rem", color: "var(--gray-300)", lineHeight: 1.7, marginBottom: space("lg") }}>
          {post.excerpt}
        </p>

        {/* Author & Meta Info */}
        <div style={{ display: "flex", alignItems: "center", gap: space("md"), paddingBottom: space("lg"), borderBottom: "1px solid rgba(148, 163, 184, 0.2)" }}>
          <div>
            <div style={{ fontWeight: 600, color: "var(--gray-100)" }}>{post.author.name}</div>
            <div style={{ fontSize: "0.9rem", color: "var(--gray-400)" }}>{post.author.role}</div>
          </div>
          <span style={{ color: "var(--gray-500)" }}>•</span>
          <div style={{ fontSize: "0.9rem", color: "var(--gray-400)" }}>
            <div>{post.publishedDate}</div>
            <div>{post.readTime} read</div>
          </div>
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
          {/* Placeholder content - in a real implementation, this would be MDX or rich text */}
          <p style={{ marginBottom: space("md") }}>
            This is where the full blog post content would appear. In a production implementation, you would use a
            content management system (CMS) like Contentful, Sanity, or MDX files to store and render the full article
            content with proper formatting, images, code blocks, and other rich media.
          </p>

          <h2 style={{ fontSize: "1.75rem", marginTop: space("xl"), marginBottom: space("md"), color: "var(--gray-100)" }}>
            Key Takeaways
          </h2>
          <ul style={{ marginBottom: space("md"), paddingLeft: space("md") }}>
            <li style={{ marginBottom: space("xs", 0.75) }}>Important point from the article</li>
            <li style={{ marginBottom: space("xs", 0.75) }}>Another crucial insight</li>
            <li style={{ marginBottom: space("xs", 0.75) }}>Actionable recommendation for readers</li>
          </ul>

          <p style={{ marginBottom: space("md") }}>
            Additional paragraphs would continue here with proper formatting, inline code examples, blockquotes, images,
            and other content elements that make up a comprehensive blog post.
          </p>

          <div
            style={{
              background: "rgba(59, 130, 246, 0.1)",
              border: "1px solid rgba(59, 130, 246, 0.3)",
              borderRadius: "12px",
              padding: space("md"),
              marginTop: space("xl"),
              marginBottom: space("xl"),
            }}
          >
            <h3 style={{ fontSize: "1.2rem", marginBottom: space("sm"), color: "var(--gray-100)" }}>
              💡 Pro Tip
            </h3>
            <p style={{ color: "var(--gray-200)", lineHeight: 1.7, margin: 0 }}>
              This is where helpful tips, callouts, or important notes would appear to emphasize key information for
              readers.
            </p>
          </div>

          <h2 style={{ fontSize: "1.75rem", marginTop: space("xl"), marginBottom: space("md"), color: "var(--gray-100)" }}>
            Conclusion
          </h2>
          <p style={{ marginBottom: space("md") }}>
            The article would conclude with a summary of the main points and potentially a call-to-action for readers.
          </p>
        </div>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div style={{ marginTop: space("xl"), paddingTop: space("lg"), borderTop: "1px solid rgba(148, 163, 184, 0.2)" }}>
            <div style={{ fontSize: "0.85rem", color: "var(--gray-500)", marginBottom: space("xs", 0.75) }}>
              Tags
            </div>
            <div style={{ display: "flex", gap: space("xs", 0.75), flexWrap: "wrap" }}>
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  style={{
                    fontSize: "0.9rem",
                    color: "var(--gray-300)",
                    background: "rgba(148, 163, 184, 0.15)",
                    padding: "6px 12px",
                    borderRadius: "6px",
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </article>

      {/* Author Bio */}
      <div
        className="glass"
        style={{
          padding: space("lg"),
          borderRadius: "16px",
          marginBottom: space("xl"),
        }}
      >
        <h3 style={{ fontSize: "1.2rem", marginBottom: space("md") }}>About the Author</h3>
        <div style={{ display: "flex", gap: space("md"), alignItems: "start" }}>
          <div>
            <div style={{ fontWeight: 600, fontSize: "1.1rem", marginBottom: space("xs", 0.5) }}>
              {post.author.name}
            </div>
            <div style={{ color: "var(--gray-400)", marginBottom: space("sm"), fontSize: "0.95rem" }}>
              {post.author.role}
            </div>
            <p style={{ color: "var(--gray-300)", lineHeight: 1.6 }}>
              Author bio would appear here with background information, expertise areas, and links to social profiles
              or other content.
            </p>
          </div>
        </div>
      </div>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section>
          <h2 style={{ fontSize: "2rem", marginBottom: space("md") }}>Related Articles</h2>
          <div style={{ display: "grid", gap: space("md"), gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))" }}>
            {relatedPosts.map((relatedPost) => (
              <Link
                key={relatedPost.id}
                href={`/blog/${relatedPost.slug}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <article
                  className="glass"
                  style={{
                    padding: space("md"),
                    borderRadius: "14px",
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
                  <h3 style={{ fontSize: "1.1rem", marginBottom: space("sm"), lineHeight: 1.4 }}>
                    {relatedPost.title}
                  </h3>
                  <p style={{ color: "var(--gray-400)", fontSize: "0.9rem", lineHeight: 1.6 }}>
                    {relatedPost.excerpt.substring(0, 120)}...
                  </p>
                  <div style={{ marginTop: space("sm"), fontSize: "0.85rem", color: "var(--gray-500)" }}>
                    {relatedPost.readTime}
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Newsletter CTA */}
      <section
        className="glass"
        style={{
          padding: space("xl"),
          borderRadius: "16px",
          marginTop: space("xl"),
          textAlign: "center",
        }}
      >
        <h2 style={{ marginBottom: space("sm"), fontSize: "1.75rem" }}>Get More Insights Like This</h2>
        <p style={{ color: "var(--gray-300)", marginBottom: space("md"), fontSize: "1rem", lineHeight: 1.7 }}>
          Subscribe to our newsletter for monthly updates on AI automation, best practices, and industry trends.
        </p>
        <Link
          href="/blog"
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
          View All Articles
        </Link>
      </section>
    </main>
  );
}
