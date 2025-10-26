import CaseStudiesPageClient from "./CaseStudiesPageClient";

export const metadata = {
  title: "Customer Success Stories | Artifically",
  description:
    "See how leading organizations across financial services, healthcare, retail, and manufacturing use Artifically to transform their operations with measurable ROI and proven results.",
  openGraph: {
    title: "Customer Success Stories | Artifically",
    description:
      "Real transformation stories from Fortune 500 companies and enterprises worldwide. 500+ companies, 12,400+ automations deployed, $47M+ saved annually.",
    type: "website",
  },
};

export default function CaseStudiesRoute() {
  return <CaseStudiesPageClient />;
}
