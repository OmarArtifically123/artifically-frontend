import MarketingPlaceholder from "@/app/(site)/_components/MarketingPlaceholder";

export const metadata = {
  title: "Cookie preferences | Artifically",
  description:
    "Understand how Artifically uses cookies and control the preferences that power your experience.",
};

export default function CookiesRoute() {
  return (
    <MarketingPlaceholder
      eyebrow="Cookie controls"
      title="Cookie management is being consolidated"
      description="We're releasing an updated preferences center with granular controls for analytics, support, and personalization cookies."
      ctas={[
        { href: "/privacy", label: "Review our privacy notice" },
        { href: "/compliance", label: "Compliance center", variant: "ghost" },
      ]}
    />
  );
}