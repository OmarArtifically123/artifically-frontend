import { lazy, Suspense, useCallback, useEffect, useState } from "react";
import ProblemSolutionSection from "../components/landing/ProblemSolutionSection";
import FeaturesShowcaseSection from "../components/landing/FeaturesShowcaseSection";
import SocialProofSection from "../components/landing/SocialProofSection";
import FinalCTASection from "../components/landing/FinalCTASection";
import HeroDemoModal from "../components/landing/HeroDemoModal";
import PersonaScenarioSection from "../components/landing/PersonaScenarioSection";
import GoalOnboardingWizard from "../components/landing/GoalOnboardingWizard";
import ServerRenderedHero from "../components/landing/ServerRenderedHero";

const HeroSection = lazy(() => import("../components/landing/HeroSection"));

export default function Home({ openAuth }) {
  const [demoOpen, setDemoOpen] = useState(false);
  const [enhanceHero, setEnhanceHero] = useState(false);
  const [showStaticHero, setShowStaticHero] = useState(true);
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

  const handleHeroReady = useCallback(() => {
    setShowStaticHero(false);
  }, []);

  useEffect(() => {
    setEnhanceHero(true);
  }, []);

  return (
    <>
      <main>
        <ServerRenderedHero hidden={!showStaticHero} />
        {enhanceHero ? (
          <Suspense fallback={null}>
            <HeroSectionIsland
              onReady={handleHeroReady}
              onPrimary={handlePrimary}
              onSecondary={handleSecondary}
            />
          </Suspense>
        ) : null}
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

function HeroSectionIsland({ onReady, ...props }) {
  useEffect(() => {
    if (typeof onReady === "function") {
      onReady();
    }
  }, [onReady]);

  return <HeroSection {...props} />;
}