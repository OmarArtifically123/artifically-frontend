import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { caseStudySolutionMap, caseStudySolutions } from "@/data/solutions";

type CaseStudyPageProps = {
  params: { slug: string };
};

export function generateStaticParams() {
  return caseStudySolutions.map(({ slug }) => ({ slug }));
}

export function generateMetadata({ params }: CaseStudyPageProps): Metadata {
  const entry = caseStudySolutionMap.get(params.slug);

  if (!entry) {
    return { title: "Case Studies | Artifically" };
  }

  return {
    title: `${entry.name} Case Study | Artifically`,
    description: entry.summary,
  };
}

export default function CaseStudyPage({ params }: CaseStudyPageProps) {
  const entry = caseStudySolutionMap.get(params.slug);

  if (!entry) {
    notFound();
    return null;
  }

  return (
    <div className="detail-page detail-page--case-study">
      <section className="detail-page__hero">
        <span className="detail-page__eyebrow">Case Study</span>
        <h1 className="detail-page__title">{entry.name}</h1>
        <p className="detail-page__lede">{entry.summary}</p>
        <div className="detail-page__tag-row">
          {entry.metrics.map((metric) => (
            <span key={metric} className="detail-page__tag">
              {metric}
            </span>
          ))}
        </div>
      </section>

      <section className="detail-page__section">
        <div className="detail-page__case-card">
          <div className="detail-page__card-meta">
            <span className="detail-page__card-initials" style={{ background: entry.theme }}>
              {entry.initials}
            </span>
            <div>
              <p className="detail-page__card-title">About {entry.name}</p>
              <p className="detail-page__card-subtitle">{entry.summary}</p>
            </div>
          </div>
          <blockquote className="detail-page__card-quote">{entry.quote}</blockquote>
        </div>
        <div className="detail-page__actions detail-page__actions--stacked">
          <Link href="/demo" className="detail-page__cta detail-page__cta--primary">
            Schedule a walkthrough
          </Link>
          <Link href="/contact/custom" className="detail-page__cta detail-page__cta--ghost">
            Design your automation plan
          </Link>
        </div>
      </section>
    </div>
  );
}