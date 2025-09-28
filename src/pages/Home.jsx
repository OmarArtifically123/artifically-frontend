import { lazy, Suspense, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Hero from "../components/Hero";
import RouteShell from "../components/skeletons/RouteShell";

const Features = lazy(() => import("../components/Features"));
const SmartSearchDiscovery = lazy(() => import("../components/SmartSearchDiscovery"));
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
    <main>
      <Hero />
      <section aria-label="Platform capabilities">
        <Suspense fallback={<RouteShell rows={4} />}>
          {contentReady ? <Features /> : <RouteShell rows={4} />}
        </Suspense>
      </section>
      <section aria-label="Smart discovery">
        <Suspense fallback={<RouteShell rows={3} />}>
          {contentReady ? <SmartSearchDiscovery /> : <RouteShell rows={3} />}
        </Suspense>
      </section>
      {/* Marketplace section with id to allow smooth scroll */}
      <div id="marketplace">
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
    </main>
  );
}