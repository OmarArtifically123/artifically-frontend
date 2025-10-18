import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { marketplaceListingMap, marketplaceListings } from "@/data/marketplace";

type MarketplacePageProps = {
  params: { slug: string };
};

export function generateStaticParams() {
  return marketplaceListings.map(({ slug }) => ({ slug }));
}

export function generateMetadata({ params }: MarketplacePageProps): Metadata {
  const listing = marketplaceListingMap.get(params.slug);

  if (!listing) {
    return { title: "Automation Marketplace | Artifically" };
  }

  return {
    title: `${listing.title} | Automation Template`,
    description: listing.summary,
  };
}

export default function MarketplaceListingPage({ params }: MarketplacePageProps) {
  const listing = marketplaceListingMap.get(params.slug);

  if (!listing) {
    notFound();
  }

  return (
    <div className="detail-page">
      <section className="detail-page__hero">
        <span className="detail-page__eyebrow">Automation Template</span>
        <h1 className="detail-page__title">{listing.title}</h1>
        <p className="detail-page__lede">{listing.summary}</p>
        <div className="detail-page__tag-row">
          <span className="detail-page__tag">{listing.badge}</span>
          <span className="detail-page__tag">{listing.rating}</span>
          <span className="detail-page__tag">{listing.price}</span>
        </div>
        <div className="detail-page__actions">
          <Link href="/marketplace" className="detail-page__cta detail-page__cta--ghost">
            Browse more automations
          </Link>
          <Link href="/demo" className="detail-page__cta detail-page__cta--primary">
            Launch this automation
          </Link>
        </div>
      </section>

      <section className="detail-page__section">
        <h2 className="detail-page__section-title">What it delivers</h2>
        <ul className="detail-page__list">
          {listing.outcomes.map((outcome) => (
            <li key={outcome} className="detail-page__list-item">
              <span>{outcome}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="detail-page__section detail-page__section--alt">
        <h2 className="detail-page__section-title">Works with your stack</h2>
        <div className="detail-page__tag-row">
          {listing.integrations.map((integration) => (
            <span key={integration} className="detail-page__tag">
              {integration}
            </span>
          ))}
        </div>
      </section>
    </div>
  );
}