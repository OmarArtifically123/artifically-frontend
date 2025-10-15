import { useCallback, useState } from "react";
import HeroSection from "../components/landing/HeroSection";
import ProblemSolutionSection from "../components/landing/ProblemSolutionSection";
import FeaturesShowcaseSection from "../components/landing/FeaturesShowcaseSection";
import SocialProofSection from "../components/landing/SocialProofSection";
import FinalCTASection from "../components/landing/FinalCTASection";
import HeroDemoModal from "../components/landing/HeroDemoModal";
import PersonaScenarioSection from "../components/landing/PersonaScenarioSection";
import GoalOnboardingWizard from "../components/landing/GoalOnboardingWizard";

export default function Home({ openAuth }) {
  const [demoOpen, setDemoOpen] = useState(false);
  const handlePrimary = useCallback(() => {
    if (typeof openAuth === "function") {
      openAuth("signup");
    }
  }, [openAuth]);

  const handleSecondary = useCallback(() => {
    setDemoOpen(true);
  }, []);

  const handleDemoClose = useCallback(() => {
    setDemoOpen(false);
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
    <>
      <main>
        <HeroSection onPrimary={handlePrimary} onSecondary={handleSecondary} />
        <PersonaScenarioSection />
        <ProblemSolutionSection />
        <FeaturesShowcaseSection />
        <GoalOnboardingWizard />
        <SocialProofSection />
        <FinalCTASection onSubmit={handleFinalSubmit} />
      </main>
      <HeroDemoModal open={demoOpen} onClose={handleDemoClose} />
    </>
  );
}