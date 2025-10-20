import MarketingPlaceholder from "@/app/(site)/_components/MarketingPlaceholder";

export const metadata = {
  title: "Brand center | Artifically",
  description:
    "Access logos, color palettes, and usage guidelines for Artifically. We're refreshing our brand system for the next chapter.",
};

export default function BrandRoute() {
  return (
    <MarketingPlaceholder
      eyebrow="Brand center"
      title="A refreshed brand kit is on the way"
      description="Updated assets, motion principles, and accessibility guidance will land here soon."
      ctas={[
        { href: "/press", label: "Press resources" },
        { href: "/contact", label: "Request specific assets", variant: "ghost" },
      ]}
    />
  );
}