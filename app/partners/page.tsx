import MarketingPlaceholder from "@/app/(site)/_components/MarketingPlaceholder";

export const metadata = {
  title: "Partner with Artifically",
  description:
    "Grow with Artifically as an implementation or technology partner. We're preparing the program details and co-marketing resources.",
};

export default function PartnersRoute() {
  return (
    <MarketingPlaceholder
      eyebrow="Partner ecosystem"
      title="The partner program is in private preview"
      description="We're outlining enablement playbooks, certification paths, and co-selling workflows. Let us know how you'd like to collaborate."
      ctas={[
        { href: "/contact", label: "Apply to partner" },
        { href: "/docs", label: "Explore technical docs", variant: "ghost" },
      ]}
    />
  );
}