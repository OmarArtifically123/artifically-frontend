import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { teamSizeSolutionMap, teamSizeSolutions } from "@/data/solutions";

type TeamSizePageProps = {
  params: { slug: string };
};

export function generateStaticParams() {
  return teamSizeSolutions.map(({ slug }) => ({ slug }));
}

export function generateMetadata({ params }: TeamSizePageProps): Metadata {
  const entry = teamSizeSolutionMap.get(params.slug);

  if (!entry) {
    return { title: "Team Size Solutions | Artifically" };
  }

  return {
    title: `${entry.title} | Team Solutions`,
    description: entry.summary,
  };
}

export default function TeamSizeSolutionPage({ params }: TeamSizePageProps) {
  const entry = teamSizeSolutionMap.get(params.slug);

  if (!entry) {
    notFound();
    return null;
  }

  return (
    <div className="detail-page">
      <section className="detail-page__hero">
        <span className="detail-page__eyebrow">Team Size Solutions</span>
        <h1 className="detail-page__title">{entry.title}</h1>
        <p className="detail-page__lede">{entry.summary}</p>
        <div className="detail-page__actions">
          <Link href="/pricing" className="detail-page__cta detail-page__cta--primary">
            View pricing
          </Link>
          <Link href="/contact" className="detail-page__cta detail-page__cta--ghost">
            Connect with us
          </Link>
        </div>
      </section>

      <section className="detail-page__section">
        <h2 className="detail-page__section-title">{entry.focus}</h2>
        <ul className="detail-page__list">
          {entry.highlights.map((item) => (
            <li key={item} className="detail-page__list-item">
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="detail-page__section detail-page__section--alt">
        <h2 className="detail-page__section-title">Ready to move forward?</h2>
        <div className="detail-page__actions detail-page__actions--stacked">
          <Link href="/demo" className="detail-page__cta detail-page__cta--primary">
            Book a strategy session
          </Link>
          <Link href="/marketplace" className="detail-page__cta detail-page__cta--ghost">
            Explore automation templates
          </Link>
        </div>
      </section>
    </div>
  );
}