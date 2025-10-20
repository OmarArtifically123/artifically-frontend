import MarketingPlaceholder from "@/app/(site)/_components/MarketingPlaceholder";

export const metadata = {
  title: "Press resources | Artifically",
  description:
    "Download brand assets, executive bios, and approved messaging. We're assembling a refreshed press kit for launches in 2024.",
};

export default function PressRoute() {
  return (
    <MarketingPlaceholder
      eyebrow="Press"
      title="Our press kit is being updated"
      description="New boilerplates, logos, founder photos, and product imagery will be available shortly."
      ctas={[
        { href: "/brand", label: "Brand center" },
        { href: "mailto:press@artifically.com", label: "Contact our press team", variant: "ghost" },
      ]}
    />
  );
}