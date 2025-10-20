import MarketingPlaceholder from "@/app/(site)/_components/MarketingPlaceholder";

export const metadata = {
  title: "Community | Artifically",
  description:
    "Connect with automation builders, share playbooks, and join product roundtables. Our community hub is getting its final polish.",
};

export default function CommunityRoute() {
  return (
    <MarketingPlaceholder
      eyebrow="Community hub"
      title="We're building a shared space for operators"
      description="Soon you'll be able to join live automation clinics, download community playbooks, and co-create new modules with other teams."
      ctas={[
        { href: "/updates", label: "Follow product updates" },
        { href: "/support", label: "Visit the help center", variant: "ghost" },
      ]}
    />
  );
}