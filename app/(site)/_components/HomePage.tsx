// @ts-nocheck
"use client";

import {
  type ComponentProps,
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";
import { ErrorBoundary } from "react-error-boundary";
import type { AuthMode } from "@/context/AppShellContext";
import ProblemSolutionSection from "@/components/landing/ProblemSolutionSection";
import FeaturesShowcaseSection from "@/components/landing/FeaturesShowcaseSection";
import SocialProofSection from "@/components/landing/SocialProofSection";
import FinalCTASection from "@/components/landing/FinalCTASection";
import HeroDemoModal from "@/components/landing/HeroDemoModal";
import PersonaScenarioSection from "@/components/landing/PersonaScenarioSection";
import GoalOnboardingWizard from "@/components/landing/GoalOnboardingWizard";
import ServerRenderedHero from "@/components/landing/ServerRenderedHero";

type HomePageProps = {
  openAuth?: (mode?: AuthMode) => void;
};

const HeroSection = lazy(() => import("@/components/landing/HeroSection"));
const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

export default function HomePage({ openAuth }: HomePageProps) {
  const [demoOpen, setDemoOpen] = useState(false);
  const [enhanceHero, setEnhanceHero] = useState(false);
  const [showStaticHero, setShowStaticHero] = useState(true);
  const demoDialogId = "hero-demo-modal";
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

  const handleHeroError = useCallback((error: unknown) => {
    if (process.env.NODE_ENV !== "production") {
      // eslint-disable-next-line no-console -- Surface lazy loading issues in development
      console.error("Hero enhancement failed", error);
    }
    setEnhanceHero(false);
  }, []);

  return (
    <>
      <div className="home-page" role="presentation">
        <ServerRenderedHero hidden={!showStaticHero} />
        {enhanceHero ? (
          <ErrorBoundary fallback={null} onError={handleHeroError}>
            <Suspense fallback={null}>
              <HeroSectionIsland
                onReady={handleHeroReady}
                onPrimary={handlePrimary}
                onSecondary={handleSecondary}
                demoDialogId={demoDialogId}
                demoOpen={demoOpen}
              />
            </Suspense>
          </ErrorBoundary>
        ) : null}
        <PersonaScenarioSection />
        <ProblemSolutionSection />
        <FeaturesShowcaseSection />
        <GoalOnboardingWizard />
        <SocialProofSection />
        <FinalCTASection onSubmit={handleFinalSubmit} />
      </div>
      <HeroDemoModal open={demoOpen} onClose={handleDemoClose} dialogId={demoDialogId} />
    </>
  );
}

type HeroSectionIslandProps = {
  onReady?: () => void;
} & ComponentProps<typeof HeroSection>;

function HeroSectionIsland({ onReady, ...props }: HeroSectionIslandProps) {
  useIsomorphicLayoutEffect(() => {
    if (typeof onReady === "function") {
      onReady();
    }
  }, [onReady]);

  return <HeroSection {...props} />;
}