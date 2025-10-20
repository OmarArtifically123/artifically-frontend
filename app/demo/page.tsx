import MarketingPlaceholder from "@/app/(site)/_components/MarketingPlaceholder";

export const metadata = {
  title: "Request a demo | Artifically",
  description:
    "See how Artifically automations deliver measurable outcomes. Share your goals and we'll tailor a walkthrough for your stakeholders.",
};

export default function DemoRoute() {
  return (
    <MarketingPlaceholder
      eyebrow="Personalised demo"
      title="Your tailored demo is a message away"
      description="Every team receives a curated walkthrough with relevant automations, ROI benchmarks, and integration guidance."
      ctas={[
        { href: "/contact", label: "Contact sales" },
        { href: "/marketplace", label: "Explore automations", variant: "ghost" },
      ]}
    />
  );
}