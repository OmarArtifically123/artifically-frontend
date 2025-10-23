import dynamic from "next/dynamic";
import { Suspense } from "react";

import ServerRenderedHero from "@/components/landing/ServerRenderedHero";
import IntelligenceUnveiling from "@/components/landing/IntelligenceUnveiling";
import TransformationVisualizer from "@/components/landing/TransformationVisualizer";
import SystemOrchestra from "@/components/landing/SystemOrchestra";
import ImpactDashboard from "@/components/landing/ImpactDashboard";
import PatternIntelligence from "@/components/landing/PatternIntelligence";
import VerifiedResults from "@/components/landing/VerifiedResults";
import SystemInvitation from "@/components/landing/SystemInvitation";

const HeroExperienceIsland = dynamic(() => import("@/app/(site)/_components/HeroExperienceIsland"), {
  suspense: true,
});

export default function HomePage() {
  return (
    <>
      <div className="home-page" role="presentation">
        {/* The Foundation: Revolutionary Hero */}
        <ServerRenderedHero />
        <Suspense fallback={null}>
          <HeroExperienceIsland />
        </Suspense>

        {/* The Vision Unfolds: The Unveiling */}
        <IntelligenceUnveiling />
        <TransformationVisualizer />
        <SystemOrchestra />
        <ImpactDashboard />
        <PatternIntelligence />
        <VerifiedResults />

        {/* The Invitation to Join */}
        <SystemInvitation />
      </div>
    </>
  );
}