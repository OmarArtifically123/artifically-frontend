import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { marketplaceListingMap } from "@/data/marketplace";

interface MarketplaceAutomationPageProps {
  params: { slug: string };
}

/**
 * Dynamic metadata for automation detail pages
 * SEO optimized with Open Graph and Twitter Cards
 */
export async function generateMetadata({
  params,
}: MarketplaceAutomationPageProps): Promise<Metadata> {
  const automation = marketplaceListingMap.get(params.slug);

  if (!automation) {
    return {
      title: "Automation Not Found | Artifically Marketplace",
    };
  }

  const title = `${automation.title} | AI Automation Marketplace`;
  const description = automation.description || automation.summary || "Discover this AI automation";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      siteName: "Artifically Marketplace",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default function MarketplaceAutomationPage({
  params,
}: MarketplaceAutomationPageProps) {
  const automation = marketplaceListingMap.get(params.slug);

  if (!automation) {
    notFound();
  }

  return (
    <div className="container" style={{ padding: "var(--space-2xl) 0", minHeight: "80vh" }}>
      <header style={{ maxWidth: "900px", margin: "0 auto var(--space-xl)", textAlign: "center" }}>
        {automation.badge && (
          <span style={{
            display: "inline-block",
            padding: "0.25rem 0.75rem",
            background: "var(--primary-500)",
            color: "white",
            borderRadius: "0.5rem",
            fontSize: "0.75rem",
            fontWeight: 600,
            marginBottom: "var(--space-sm)",
          }}>
            {automation.badge}
          </span>
        )}
        <h1 style={{ fontSize: "3rem", fontWeight: 800, marginBottom: "var(--space-sm)" }}>
          {automation.title}
        </h1>
        <p style={{ color: "var(--gray-400)", fontSize: "1.25rem", lineHeight: 1.7 }}>
          {automation.description}
        </p>
        <div style={{ marginTop: "var(--space-md)", display: "flex", gap: "var(--space-md)", justifyContent: "center", alignItems: "center" }}>
          <span>{automation.rating}</span>
          <span style={{ color: "var(--primary-500)", fontWeight: 600 }}>{automation.price}</span>
        </div>
      </header>

      <section className="glass" style={{ padding: "var(--space-lg)", borderRadius: "16px", maxWidth: "900px", margin: "0 auto" }}>
        <h2 style={{ marginBottom: "var(--space-md)" }}>Summary</h2>
        <p style={{ color: "var(--gray-300)", lineHeight: 1.7, marginBottom: "var(--space-lg)" }}>
          {automation.summary}
        </p>

        <h3 style={{ marginBottom: "var(--space-sm)" }}>What it does</h3>
        <ul style={{ display: "grid", gap: "var(--space-xs)", paddingLeft: "var(--space-md)", color: "var(--gray-300)" }}>
          {automation.outcomes.map((outcome, index) => (
            <li key={index} style={{ lineHeight: 1.7 }}>{outcome}</li>
          ))}
        </ul>

        <h3 style={{ marginTop: "var(--space-lg)", marginBottom: "var(--space-sm)" }}>Integrations</h3>
        <div style={{ display: "flex", gap: "var(--space-xs)", flexWrap: "wrap" }}>
          {automation.integrations.map((integration, index) => (
            <span
              key={index}
              style={{
                padding: "0.5rem 1rem",
                background: "rgba(99, 102, 241, 0.1)",
                border: "1px solid rgba(99, 102, 241, 0.2)",
                borderRadius: "0.5rem",
                fontSize: "0.875rem",
                color: "var(--gray-200)",
              }}
            >
              {integration}
            </span>
          ))}
        </div>

        <div style={{ marginTop: "var(--space-xl)", display: "flex", gap: "var(--space-md)" }}>
          <button
            style={{
              padding: "0.75rem 2rem",
              background: "var(--primary-500)",
              color: "white",
              border: "none",
              borderRadius: "0.75rem",
              fontSize: "1rem",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Deploy Now
          </button>
          <button
            style={{
              padding: "0.75rem 2rem",
              background: "transparent",
              color: "var(--gray-200)",
              border: "1px solid var(--gray-600)",
              borderRadius: "0.75rem",
              fontSize: "1rem",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            View Demo
          </button>
        </div>
      </section>
    </div>
  );
}
