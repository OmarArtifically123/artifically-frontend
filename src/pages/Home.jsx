import { lazy, Suspense, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Hero from "../components/Hero";
import useIntersectionLazy from "../hooks/useIntersectionLazy";
import RouteShell from "../components/skeletons/RouteShell";

const Features = lazy(() => import("../components/Features"));
const Marketplace = lazy(() => import("../components/Marketplace"));

export default function Home({ user, scrollTo, openAuth }) {
  const location = useLocation();
  const [shouldRenderFeatures, setShouldRenderFeatures] = useState(false);
  const [shouldRenderMarketplace, setShouldRenderMarketplace] = useState(false);

  const featureIntersection = useIntersectionLazy();
  const marketplaceIntersection = useIntersectionLazy();

  useEffect(() => {
    let target = scrollTo;

    // If user landed with a hash (#marketplace)
    if (!target && location.hash) {
      target = location.hash.replace("#", "");
    }

    if (!target) return;

    // wait next paint so sections exist, then scroll
    requestAnimationFrame(() => {
      const el = document.getElementById(target);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    });
  }, [scrollTo, location]);

  useEffect(() => {
    if (featureIntersection.isIntersecting) {
      setShouldRenderFeatures(true);
    }
  }, [featureIntersection.isIntersecting]);

  useEffect(() => {
    if (marketplaceIntersection.isIntersecting) {
      setShouldRenderMarketplace(true);
    }
  }, [marketplaceIntersection.isIntersecting]);

  return (
    <main>
      <Hero />
      <section ref={featureIntersection.ref} aria-label="Platform capabilities">
        {shouldRenderFeatures ? (
          <Suspense fallback={<RouteShell rows={4} />}>
            <Features />
          </Suspense>
        ) : (
          <RouteShell rows={4} />
        )}
      </section>
      {/* Marketplace section with id to allow smooth scroll */}
      <div id="marketplace" ref={marketplaceIntersection.ref}>
        {shouldRenderMarketplace ? (
          <Suspense fallback={<RouteShell rows={5} />}>
            <Marketplace
              user={user}
              openAuth={openAuth}
            />
          </Suspense>
        ) : (
          <RouteShell rows={5} />
        )}
      </div>
    </main>
  );
}