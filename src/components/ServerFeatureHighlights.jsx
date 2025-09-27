import { Suspense, useEffect, useState } from "react";
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
  const [hydrated, setHydrated] = useState(false);
  const intersection = useIntersectionLazy({ rootMargin: "400px" });

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated || !intersection.isIntersecting) {
      return;
    }

    preloadServerComponent(SERVER_COMPONENT_KEY);
  }, [hydrated, intersection.isIntersecting]);

  const sectionProps = {
    className: "rsc-feature-shell",
    "aria-hidden": hydrated ? undefined : true,
    "aria-label": hydrated ? "Server rendered feature insights" : undefined,
  };

  if (hydrated) {
    sectionProps.ref = intersection.ref;
  }

  return (
    <section {...sectionProps}>
      {hydrated ? (
        <Suspense fallback={<FeatureSkeletonGrid cards={4} />}>
          <FeatureStream />
        </Suspense>
      ) : (
        <FeatureSkeletonGrid cards={4} />
      )}
    </section>
  );
}