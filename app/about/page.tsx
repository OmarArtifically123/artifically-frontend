import HeroSection from "@/components/about/HeroSection";
import CompanyStorySection from "@/components/about/CompanyStorySection";
import ValuesSection from "@/components/about/ValuesSection";
import CTASection from "@/components/about/CTASection";

export const metadata = {
  title: "About Artifically | Leading AI Enterprise Marketplace",
  description:
    "Discover Artifically's mission to build the world's leading AI enterprise marketplace. Learn about our values, vision, and commitment to operational excellence through intelligent automation.",
};

export default function AboutRoute() {
  return (
    <>
      <HeroSection />
      <CompanyStorySection />
      <ValuesSection />
      <CTASection />
    </>
  );
}