import { Suspense, useEffect } from "react";
import FeatureSkeletonGrid from "./skeletons/FeatureSkeleton";
import useIntersectionLazy from "../hooks/useIntersectionLazy";
import useServerComponent, { preloadServerComponent } from "../rsc/useServerComponent";

const SERVER_COMPONENT_KEY = "/rsc/features";

function FeatureStream() {
  const markup = useServerComponent(SERVER_COMPONENT_KEY);
  return (
    <div
      className="rsc-feature-grid"
      dangerouslySetInnerHTML={{ __html: markup }}
    />
  );
}

export default function ServerFeatureHighlights() {
  const isServer = typeof window === "undefined";
  const intersection = useIntersectionLazy({ rootMargin: "400px" });

  useEffect(() => {
    if (!isServer && intersection.isIntersecting) {
      preloadServerComponent(SERVER_COMPONENT_KEY);
    }
  }, [intersection.isIntersecting, isServer]);

  const shellRef = isServer ? undefined : intersection.ref;

  if (isServer) {
    return (
      <section className="rsc-feature-shell" aria-hidden>
        <FeatureSkeletonGrid cards={4} />
      </section>
    );
  }

  return (
    <section
      ref={shellRef}
      className="rsc-feature-shell"
      aria-label="Server rendered feature insights"
    >
      <Suspense fallback={<FeatureSkeletonGrid cards={4} /> }>
        <FeatureStream />
      </Suspense>
    </section>
  );
}