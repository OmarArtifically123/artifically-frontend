import dynamic from "next/dynamic";
import { Suspense } from "react";

import FeaturesShowcaseSection from "@/components/landing/FeaturesShowcaseSection";
import PersonaScenarioSection from "@/components/landing/PersonaScenarioSection";
import ProblemSolutionSection from "@/components/landing/ProblemSolutionSection";
import SocialProofSection from "@/components/landing/SocialProofSection";
import ServerRenderedHero from "@/components/landing/ServerRenderedHero";

const HeroExperienceIsland = dynamic(() => import("@/app/(site)/_components/HeroExperienceIsland"), {
  suspense: true,
});
const GoalOnboardingWizard = dynamic(() => import("@/components/landing/GoalOnboardingWizard"), {
  suspense: true,
});
const FinalCTASectionClient = dynamic(
  () => import("@/app/(site)/_components/FinalCTASectionClient"),
  { suspense: true },
);

export default function HomePage() {
  return (
    <>
      <div className="home-page" role="presentation">
        <ServerRenderedHero />
        <Suspense fallback={null}>
          <HeroExperienceIsland />
        </Suspense>
        <PersonaScenarioSection />
        <ProblemSolutionSection />
        <FeaturesShowcaseSection />
        <Suspense fallback={null}>
          <GoalOnboardingWizard />
        </Suspense>
        <SocialProofSection />
        <Suspense fallback={null}>
          <FinalCTASectionClient />
        </Suspense>
      </div>
    </>
  );
}