import MarketingPlaceholder from "@/app/(site)/_components/MarketingPlaceholder";

export const metadata = {
  title: "Interactive demos | Artifically",
  description:
    "Preview Artifically automations in the browser. Our interactive demos will let your team experience real workflows before launch.",
};

export default function DemosRoute() {
  return (
    <MarketingPlaceholder
      eyebrow="Interactive demos"
      title="Interactive demos are almost ready"
      description="We're packaging our most popular automation journeys into guided demos so every stakeholder can explore the experience with zero setup."
      ctas={[
        { href: "/marketplace", label: "Browse the marketplace" },
        { href: "/contact", label: "Talk to our team", variant: "ghost" },
      ]}
    />
  );
}