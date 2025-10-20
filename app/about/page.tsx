import MarketingPlaceholder from "@/app/(site)/_components/MarketingPlaceholder";

export const metadata = {
  title: "About Artifically",
  description:
    "Meet the team building Artifically and explore our mission to automate operational excellence. A refreshed company overview is underway.",
};

export default function AboutRoute() {
  return (
    <MarketingPlaceholder
      eyebrow="About Artifically"
      title="We're updating our company story"
      description="The new About page will highlight our mission, leadership, and the principles guiding every automation launch."
      ctas={[
        { href: "/careers", label: "See open roles" },
        { href: "/press", label: "Press resources", variant: "ghost" },
      ]}
    />
  );
}