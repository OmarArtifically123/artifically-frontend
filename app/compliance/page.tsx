import MarketingPlaceholder from "@/app/(site)/_components/MarketingPlaceholder";

export const metadata = {
  title: "Compliance center | Artifically",
  description:
    "Review Artifically's security, privacy, and regulatory posture. We're preparing new attestations and policy summaries.",
};

export default function ComplianceRoute() {
  return (
    <MarketingPlaceholder
      eyebrow="Compliance"
      title="Compliance resources are getting an upgrade"
      description="SOC 2 reports, data processing terms, and regional addendums will be published here with guided implementation checklists."
      ctas={[
        { href: "/security", label: "Security overview" },
        { href: "/contact", label: "Request compliance package", variant: "ghost" },
      ]}
    />
  );
}