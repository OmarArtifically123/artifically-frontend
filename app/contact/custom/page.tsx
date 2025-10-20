import MarketingPlaceholder from "@/app/(site)/_components/MarketingPlaceholder";

export const metadata = {
  title: "Custom engagement | Artifically",
  description:
    "Work with Artifically on tailored deployments, security reviews, and bespoke success plans.",
};

export default function CustomContactRoute() {
  return (
    <MarketingPlaceholder
      eyebrow="Custom engagement"
      title="Let's design the right onboarding plan"
      description="Tell us about your team, regions, and compliance needs so we can assemble the right specialists before kickoff."
      ctas={[
        { href: "/contact", label: "Share your requirements" },
        { href: "/demo", label: "Schedule a walkthrough", variant: "ghost" },
      ]}
    >
      <ul
        style={{
          listStyle: "disc",
          paddingLeft: "var(--space-lg)",
          textAlign: "left",
          color: "var(--color-text-secondary, rgba(226, 240, 255, 0.82))",
          display: "flex",
          flexDirection: "column",
          gap: "var(--space-2xs)",
          margin: 0,
        }}
      >
        <li>Regional data residency and security questionnaires</li>
        <li>Integration architecture reviews and sequencing</li>
        <li>Executive workshops focused on automation ROI</li>
      </ul>
    </MarketingPlaceholder>
  );
}