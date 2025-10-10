import { lazy, Suspense, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import * as m from "framer-motion/m";
import RouteShell from "../components/skeletons/RouteShell";
import ParallaxSection from "../components/animation/ParallaxSection";

const Hero = lazy(() => import("../components/Hero"));
const Features = lazy(() => import("../components/Features"));
const Marketplace = lazy(() => import("../components/Marketplace"));

export default function Home({ user, scrollTo, openAuth }) {
  const location = useLocation();
  const [contentReady, setContentReady] = useState(typeof window === "undefined");

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
    if (!contentReady) {
      setContentReady(true);
    }
  }, [contentReady]);

  return (
    <m.main
      initial={{ opacity: 0, filter: "blur(10px)" }}
      animate={{ opacity: 1, filter: "blur(0px)" }}
      transition={{ duration: 0.6, ease: [0.33, 1, 0.68, 1] }}
    >
      <Suspense fallback={<HeroSkeleton />}>
        <Hero openAuth={openAuth} />
      </Suspense>
      <ParallaxSection
        speed={0.22}
        className="home-section home-section--features"
      >
        <section aria-label="Platform capabilities" data-intent-route="/marketplace" data-intent-threshold="0.45">
          <Suspense fallback={<RouteShell rows={4} />}>
            {contentReady ? <Features /> : <RouteShell rows={4} />}
          </Suspense>
        </section>
      </ParallaxSection>
      {/* Marketplace section with id to allow smooth scroll */}
      <ParallaxSection speed={0.35} className="home-section home-section--marketplace">
        <div
          id="marketplace"
          data-intent-route="/pricing"
          data-intent-threshold="0.3"
        >
          <Suspense fallback={<RouteShell rows={5} />}>
            {contentReady ? (
              <Marketplace
                user={user}
                openAuth={openAuth}
              />
            ) : (
              <RouteShell rows={5} />
            )}
          </Suspense>
        </div>
      </ParallaxSection>
    </m.main>
    );
}

function HeroSkeleton() {
  return (
    <section
      className="hero"
      aria-busy="true"
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        background:
          "linear-gradient(135deg, rgba(102, 126, 234, 0.35) 0%, rgba(118, 75, 162, 0.45) 100%)",
      }}
    >
      <div className="loading-spinner" aria-hidden="true" />
    </section>
  );
}