import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CaseStudyDetail from "@/components/case-studies/CaseStudyDetail";
import studies from "@/data/case-studies/studies.json";

type CaseStudyPageProps = {
  params: { slug: string };
};

export function generateStaticParams() {
  return studies.map((study) => ({ slug: study.slug }));
}

export function generateMetadata({ params }: CaseStudyPageProps): Metadata {
  const study = studies.find((s) => s.slug === params.slug);

  if (!study) {
    return { title: "Case Study | Artifically" };
  }

  return {
    title: `${study.company} Case Study | Artifically`,
    description: `${study.impact.title}. Learn how ${study.company} achieved measurable ROI with Artifically's automation platform.`,
  };
}

export default function CaseStudyPage({ params }: CaseStudyPageProps) {
  const study = studies.find((s) => s.slug === params.slug);

  if (!study) {
    notFound();
    return null;
  }

  return <CaseStudyDetail study={study} />;
}