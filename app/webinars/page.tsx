import MarketingPlaceholder from "@/app/(site)/_components/MarketingPlaceholder";

export const metadata = {
  title: "Webinars & live sessions | Artifically",
  description:
    "Register for upcoming Artifically webinars and on-demand walkthroughs. New sessions are recorded as we finalize the schedule.",
};

export default function WebinarsRoute() {
  return (
    <MarketingPlaceholder
      eyebrow="Webinars"
      title="Live sessions will be published shortly"
      description="We'll share sign-up links for expert roundtables, roadmap previews, and customer deep-dives as soon as the schedule is confirmed."
      ctas={[
        { href: "/updates", label: "Get product news" },
        { href: "/demo", label: "Request a tailored demo", variant: "ghost" },
      ]}
    />
  );
}