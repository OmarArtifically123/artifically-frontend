import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import {
  industrySolutionMap,
  industrySolutions,
  caseStudySolutions,
} from "@/data/solutions";

const FALLBACK_TITLE = "Industry Solutions | Artifically";

type IndustrySolutionPageProps = {
  params: { slug: string };
};

export function generateStaticParams() {
  return industrySolutions.map(({ slug }) => ({ slug }));
}

export function generateMetadata({ params }: IndustrySolutionPageProps): Metadata {
  const entry = industrySolutionMap.get(params.slug);
  if (!entry) {
    return { title: FALLBACK_TITLE };
  }

  return {
    title: `${entry.title} Solutions | Artifically`,
    description: entry.summary,
  };
}

export default function IndustrySolutionPage({ params }: IndustrySolutionPageProps) {
  const entry = industrySolutionMap.get(params.slug);

  if (!entry) {
    notFound();
    return null;
  }

  return (
    <div className="detail-page">
      <section className="detail-page__hero">
        <span className="detail-page__eyebrow">Industry Solutions</span>
        <h1 className="detail-page__title">{entry.title}</h1>
        <p className="detail-page__lede">{entry.summary}</p>
        <div className="detail-page__actions">
          <Link href="/demo" className="detail-page__cta detail-page__cta--primary">
            Book a demo
          </Link>
          <Link href="/contact/custom" className="detail-page__cta detail-page__cta--ghost">
            Talk to solutions engineering
          </Link>
        </div>
      </section>

      <section className="detail-page__section">
        <h2 className="detail-page__section-title">{entry.headline}</h2>
        <p className="detail-page__body">
          Artifically orchestrates humans, AI copilots, and integrations so your {entry.title.toLowerCase()} team can focus on
          high-impact work.
        </p>
        <ul className="detail-page__list">
          {entry.highlights.map((item) => (
            <li key={item} className="detail-page__list-item">
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="detail-page__section detail-page__section--alt">
        <h2 className="detail-page__section-title">See it working in the field</h2>
        <div className="detail-page__card-grid">
          {caseStudySolutions.map((study) => (
            <Link key={study.slug} href={`/case-studies/${study.slug}`} className="detail-page__card">
              <div className="detail-page__card-meta">
                <span className="detail-page__card-initials" style={{ background: study.theme }}>
                  {study.initials}
                </span>
                <div>
                  <p className="detail-page__card-title">{study.name}</p>
                  <p className="detail-page__card-subtitle">{study.summary}</p>
                </div>
              </div>
              <blockquote className="detail-page__card-quote">{study.quote}</blockquote>
              <div className="detail-page__tag-row">
                {study.metrics.map((metric) => (
                  <span key={metric} className="detail-page__tag">
                    {metric}
                  </span>
                ))}
              </div>
              <span className="detail-page__card-link">Read full story →</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}