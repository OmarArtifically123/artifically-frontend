import dynamic from "next/dynamic";
import { Suspense } from "react";
import LazySection from "@/components/performance/LazySection";
import SectionSkeleton from "@/components/performance/SectionSkeleton";
import DeferredRender from "@/components/performance/DeferredRender";

// Hero - Render immediately (above the fold)
import ServerRenderedHero from "@/components/landing/ServerRenderedHero.jsx";

// Critical above-the-fold components - Load with high priority
const PageProgressIndicator = dynamic(
  () => import("@/components/landing/PageProgressIndicator"),
  { ssr: false }
);

const SmartStickyNav = dynamic(
  () => import("@/components/landing/SmartStickyNav"),
  { ssr: false }
);

// Defer heavy 3D component until after initial paint
const HeroExperienceIsland = dynamic(
  () => import("@/app/(site)/_components/HeroExperienceIsland"),
  {
    ssr: false,
    loading: () => null,
  }
);

// Section components - All lazy loaded with proper priorities
const ValuePropositionMatrix = dynamic(
  () => import("@/components/landing/ValuePropositionMatrix"),
  {
    loading: () => <SectionSkeleton height="700px" variant="grid" />,
  }
);

const TechnologyArchitectureExplorer = dynamic(
  () => import("@/components/landing/TechnologyArchitectureExplorer"),
  {
    loading: () => <SectionSkeleton height="800px" variant="columns" />,
  }
);

const AdaptiveIntelligenceShowcase = dynamic(
  () => import("@/components/landing/AdaptiveIntelligenceShowcase"),
  {
    loading: () => <SectionSkeleton height="750px" />,
  }
);

const TransformationTimelineJourney = dynamic(
  () => import("@/components/landing/TransformationTimelineJourney"),
  {
    loading: () => <SectionSkeleton height="850px" />,
  }
);

const ProvenAtScale = dynamic(
  () => import("@/components/landing/ProvenAtScale"),
  {
    loading: () => <SectionSkeleton height="700px" variant="grid" />,
  }
);

const IntegrationEcosystemGalaxy = dynamic(
  () => import("@/components/landing/IntegrationEcosystemGalaxy"),
  {
    loading: () => <SectionSkeleton height="900px" />,
  }
);

const TransformationVisualizerV2 = dynamic(
  () => import("@/components/landing/TransformationVisualizerV2"),
  {
    loading: () => <SectionSkeleton height="800px" />,
  }
);

const TrustSecurityFortress = dynamic(
  () => import("@/components/landing/TrustSecurityFortress"),
  {
    loading: () => <SectionSkeleton height="750px" variant="grid" />,
  }
);

// Lazy load SectionTransition to reduce initial bundle
const SectionTransition = dynamic(
  () => import("@/components/landing/SectionTransition"),
  { ssr: true }
);

/**
 * Highly optimized HomePage with:
 * 1. Aggressive lazy loading for all below-fold content
 * 2. Fixed-height skeletons to prevent CLS
 * 3. Deferred 3D rendering to improve TBT
 * 4. Priority-based loading queue
 * 5. IntersectionObserver-based rendering
 */
export default function HomePageOptimized() {
  return (
    <>
      {/* Non-blocking indicators */}
      <PageProgressIndicator />
      <SmartStickyNav />

      <div className="home-page" role="presentation">
        {/* 
          ABOVE THE FOLD: Critical rendering path 
          Load immediately for optimal FCP and LCP
        */}
        <ServerRenderedHero />

        {/* 
          Defer 3D heavy component to improve TBT
          Uses requestIdleCallback to render during browser idle time
        */}
        <DeferredRender useIdleCallback={true} timeout={2000}>
          <Suspense fallback={null}>
            <HeroExperienceIsland />
          </Suspense>
        </DeferredRender>

        {/* 
          BELOW THE FOLD: Lazy load all sections
          Each section loads when scrolling near viewport
          Priority determines load order when multiple sections enter viewport
        */}

        {/* Section 1: High Priority - First below fold */}
        <LazySection
          minHeight="700px"
          rootMargin="600px"
          strategy="lazy"
          priority={10}
          fallback={<SectionSkeleton height="700px" variant="grid" />}
        >
          <SectionTransition>
            <ValuePropositionMatrix />
          </SectionTransition>
        </LazySection>

        {/* Section 2: High Priority */}
        <LazySection
          minHeight="800px"
          rootMargin="500px"
          strategy="lazy"
          priority={9}
          fallback={<SectionSkeleton height="800px" variant="columns" />}
        >
          <SectionTransition>
            <TechnologyArchitectureExplorer />
          </SectionTransition>
        </LazySection>

        {/* Section 3: Medium Priority */}
        <LazySection
          minHeight="750px"
          rootMargin="400px"
          strategy="lazy"
          priority={8}
          fallback={<SectionSkeleton height="750px" />}
        >
          <SectionTransition>
            <AdaptiveIntelligenceShowcase />
          </SectionTransition>
        </LazySection>

        {/* Section 4: Medium Priority */}
        <LazySection
          minHeight="850px"
          rootMargin="400px"
          strategy="lazy"
          priority={7}
          fallback={<SectionSkeleton height="850px" />}
        >
          <SectionTransition>
            <TransformationTimelineJourney />
          </SectionTransition>
        </LazySection>

        {/* Section 5: Medium Priority */}
        <LazySection
          minHeight="700px"
          rootMargin="300px"
          strategy="lazy"
          priority={6}
          fallback={<SectionSkeleton height="700px" variant="grid" />}
        >
          <SectionTransition>
            <ProvenAtScale />
          </SectionTransition>
        </LazySection>

        {/* Section 6: Lower Priority - 3D Heavy */}
        <LazySection
          minHeight="900px"
          rootMargin="200px"
          strategy="lazy"
          priority={5}
          fallback={<SectionSkeleton height="900px" />}
        >
          <SectionTransition>
            <IntegrationEcosystemGalaxy />
          </SectionTransition>
        </LazySection>

        {/* Section 7: Lower Priority */}
        <LazySection
          minHeight="800px"
          rootMargin="200px"
          strategy="lazy"
          priority={4}
          fallback={<SectionSkeleton height="800px" />}
        >
          <SectionTransition>
            <TransformationVisualizerV2 />
          </SectionTransition>
        </LazySection>

        {/* Section 8: Lowest Priority - Load on idle or when near viewport */}
        <LazySection
          minHeight="750px"
          rootMargin="100px"
          strategy="lazy"
          priority={3}
          fallback={<SectionSkeleton height="750px" variant="grid" />}
        >
          <SectionTransition>
            <TrustSecurityFortress />
          </SectionTransition>
        </LazySection>
      </div>
    </>
  );
}

