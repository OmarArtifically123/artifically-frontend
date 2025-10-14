import { useCallback } from "react";
import HeroSection from "../components/landing/HeroSection";
import ProblemSolutionSection from "../components/landing/ProblemSolutionSection";
import FeaturesShowcaseSection from "../components/landing/FeaturesShowcaseSection";
import SocialProofSection from "../components/landing/SocialProofSection";
import FinalCTASection from "../components/landing/FinalCTASection";

export default function Home({ openAuth }) {
  const handlePrimary = useCallback(() => {
    if (typeof openAuth === "function") {
      openAuth("signup");
    }
  }, [openAuth]);

  const handleSecondary = useCallback(() => {
    const preview = document.getElementById("product-preview");
    preview?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, []);

  const handleFinalSubmit = useCallback(
    () => {
      if (typeof openAuth === "function") {
        openAuth("signup");
      }
    },
    [openAuth],
  );

  return (
    <main>
      <HeroSection onPrimary={handlePrimary} onSecondary={handleSecondary} />
      <ProblemSolutionSection />
      <FeaturesShowcaseSection />
      <SocialProofSection />
      <FinalCTASection onSubmit={handleFinalSubmit} />
    </main>
  );
}