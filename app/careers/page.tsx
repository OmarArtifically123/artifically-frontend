import MarketingPlaceholder from "@/app/(site)/_components/MarketingPlaceholder";

export const metadata = {
  title: "Careers at Artifically",
  description:
    "Help build the automation platform operations teams love. Our recruiting experience is being rebuilt to reflect new roles and benefits.",
};

export default function CareersRoute() {
  return (
    <MarketingPlaceholder
      eyebrow="Careers"
      title="Our recruiting experience is relaunching"
      description="We're finalizing role profiles, hiring timelines, and our candidate resource hub. Join the list to be first in line."
      ctas={[
        { href: "/contact", label: "Introduce yourself" },
        { href: "https://www.linkedin.com/company/artifically", label: "Follow on LinkedIn", variant: "ghost", external: true },
      ]}
    />
  );
}