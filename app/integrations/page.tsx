import MarketingPlaceholder from "@/app/(site)/_components/MarketingPlaceholder";

export const metadata = {
  title: "Integrations directory | Artifically",
  description:
    "Discover the systems Artifically connects with. Our integration directory is expanding with deep, secure connectors for enterprise stacks.",
};

export default function IntegrationsRoute() {
  return (
    <MarketingPlaceholder
      eyebrow="Integration library"
      title="The integration directory is coming soon"
      description="We're curating detailed integration guides, connection health dashboards, and pre-flight checklists so you can launch with confidence."
      ctas={[
        { href: "/marketplace", label: "See available automations" },
        { href: "/docs", label: "Read the developer docs", variant: "ghost" },
      ]}
    />
  );
}