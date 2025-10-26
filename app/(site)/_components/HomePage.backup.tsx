import dynamic from "next/dynamic";
import { Suspense } from "react";

// Hero (Existing - Enhanced)
import ServerRenderedHero from "@/components/landing/ServerRenderedHero";

// New 10x Enhanced Sections
import PageProgressIndicator from "@/components/landing/PageProgressIndicator";
import SmartStickyNav from "@/components/landing/SmartStickyNav";
import SectionTransition from "@/components/landing/SectionTransition";
import ValuePropositionMatrix from "@/components/landing/ValuePropositionMatrix";
import TechnologyArchitectureExplorer from "@/components/landing/TechnologyArchitectureExplorer";
import AdaptiveIntelligenceShowcase from "@/components/landing/AdaptiveIntelligenceShowcase";
import TransformationTimelineJourney from "@/components/landing/TransformationTimelineJourney";
import ProvenAtScale from "@/components/landing/ProvenAtScale";
import IntegrationEcosystemGalaxy from "@/components/landing/IntegrationEcosystemGalaxy";
import TransformationVisualizerV2 from "@/components/landing/TransformationVisualizerV2";
import TrustSecurityFortress from "@/components/landing/TrustSecurityFortress";

// Dynamic imports for heavy components
const HeroExperienceIsland = dynamic(() => import("@/app/(site)/_components/HeroExperienceIsland"), {
  suspense: true,
  ssr: false,
});

export default function HomePage() {
  return (
    <>
      {/* Page Progress Indicator */}
      <PageProgressIndicator />
      
      {/* Smart Sticky Navigation */}
      <SmartStickyNav />
      
      <div className="home-page" role="presentation">
        {/* The Foundation: Revolutionary Hero */}
        <ServerRenderedHero />
        <Suspense fallback={null}>
          <HeroExperienceIsland />
        </Suspense>

        {/* Section 1: Value Proposition Matrix */}
        <SectionTransition>
          <ValuePropositionMatrix />
        </SectionTransition>

        {/* Section 2: Technology Architecture Explorer */}
        <SectionTransition>
          <TechnologyArchitectureExplorer />
        </SectionTransition>

        {/* Section 3: Adaptive Intelligence Showcase */}
        <SectionTransition>
          <AdaptiveIntelligenceShowcase />
        </SectionTransition>

        {/* Section 4: Transformation Timeline Journey */}
        <SectionTransition>
          <TransformationTimelineJourney />
        </SectionTransition>

        {/* Section 5: Proven At Scale */}
        <SectionTransition>
          <ProvenAtScale />
        </SectionTransition>

        {/* Section 6: Integration Ecosystem Galaxy */}
        <SectionTransition>
          <IntegrationEcosystemGalaxy />
        </SectionTransition>

        {/* Section 7: Transformation Visualizer V2 */}
        <SectionTransition>
          <TransformationVisualizerV2 />
        </SectionTransition>

        {/* Section 8: Trust & Security Fortress */}
        <SectionTransition>
          <TrustSecurityFortress />
        </SectionTransition>
      </div>
    </>
  );
}