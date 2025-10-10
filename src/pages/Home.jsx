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


const heroSkeletonCanvasStyle = {
  position: "absolute",
  inset: 0,
  borderRadius: "inherit",
  background:
    "radial-gradient(circle at 30% 35%, rgba(59, 130, 246, 0.28), transparent 55%), radial-gradient(circle at 70% 65%, rgba(147, 51, 234, 0.24), transparent 58%)",
  opacity: 0.85,
};

const heroSkeletonPanelSurface = {
  background: "linear-gradient(160deg, rgba(15, 23, 42, 0.9), rgba(2, 6, 23, 0.94))",
  border: "1px solid rgba(148, 163, 184, 0.22)",
  boxShadow: "0 30px 60px rgba(15, 23, 42, 0.45)",
  backdropFilter: "blur(18px) saturate(140%)",
  WebkitBackdropFilter: "blur(18px) saturate(140%)",
};

const heroSkeletonFillSurface = {
  background: "linear-gradient(135deg, rgba(148, 163, 184, 0.18), rgba(148, 163, 184, 0.08))",
  border: "1px solid rgba(148, 163, 184, 0.18)",
  animation: "pulse 1.6s ease-in-out infinite",
};

function SkeletonBar({ width, height, radius = "0.85rem", style }) {
  return (
    <div
      style={{
        width,
        height,
        borderRadius: radius,
        background: "linear-gradient(120deg, rgba(148, 163, 184, 0.32), rgba(148, 163, 184, 0.12))",
        animation: "pulse 1.6s ease-in-out infinite",
        ...style,
      }}
    />
  );
}

function HeroSkeleton() {
  return (
    <section
      className="hero"
      aria-busy="true"
      aria-live="polite"
      aria-label="Loading Artifically hero experience"
    >
      <div className="hero-canvas" aria-hidden="true" style={heroSkeletonCanvasStyle} />
      <div className="hero-gradient" aria-hidden="true" />
      <div className="hero-inner" aria-hidden="true">
        <header className="hero-header" style={{ alignItems: "center" }}>
          <SkeletonBar width="220px" height="42px" radius="999px" />
          <div className="hero-actions" style={{ gap: "0.75rem" }}>
            <SkeletonBar width="190px" height="52px" radius="1.2rem" />
            <SkeletonBar width="56px" height="52px" radius="1.2rem" />
          </div>
        </header>
        <div className="hero-body">
          <div className="hero-text" style={{ gap: "1.6rem" }}>
            <div style={{ display: "grid", gap: "0.75rem" }}>
              <SkeletonBar width="68%" height="3.4rem" radius="1.2rem" />
              <SkeletonBar width="74%" height="3.4rem" radius="1.2rem" />
              <SkeletonBar width="58%" height="3.4rem" radius="1.2rem" />
            </div>
            <div style={{ display: "grid", gap: "0.6rem" }}>
              <SkeletonBar width="100%" height="1.1rem" />
              <SkeletonBar width="94%" height="1.1rem" />
              <SkeletonBar width="72%" height="1.1rem" />
            </div>
            <div className="hero-ctas" style={{ gap: "0.85rem", flexWrap: "wrap" }}>
              <SkeletonBar width="190px" height="52px" radius="1.2rem" />
              <SkeletonBar width="212px" height="52px" radius="1.2rem" />
              <SkeletonBar width="168px" height="20px" radius="999px" />
            </div>
            <div
              className="hero-ticker"
              style={{ display: "flex", alignItems: "center", gap: "0.85rem", padding: "0.5rem 0" }}
            >
              <SkeletonBar width="110px" height="28px" radius="999px" />
              <SkeletonBar width="280px" height="24px" radius="0.85rem" />
            </div>
            <div className="hero-badges" style={{ gap: "0.75rem" }}>
              {Array.from({ length: 4 }).map((_, index) => (
                <SkeletonBar key={index} width="182px" height="38px" radius="999px" />
              ))}
            </div>
          </div>
          <div className="hero-insights">
            <div
              className="hero-panel"
              style={{
                ...heroSkeletonPanelSurface,
                minHeight: "340px",
                display: "grid",
                gap: "1rem",
              }}
            >
              <SkeletonBar width="45%" height="1.05rem" radius="0.75rem" />
              <div style={{ display: "grid", gap: "0.75rem" }}>
                <SkeletonBar width="100%" height="48px" radius="0.95rem" />
                <SkeletonBar width="100%" height="48px" radius="0.95rem" />
              </div>
              <div
                style={{
                  borderRadius: "1.05rem",
                  minHeight: "96px",
                  ...heroSkeletonFillSurface,
                }}
              />
            </div>
            <div
              className="hero-panel"
              style={{
                ...heroSkeletonPanelSurface,
                minHeight: "320px",
                display: "grid",
                gap: "0.95rem",
              }}
            >
              <SkeletonBar width="38%" height="1.05rem" radius="0.75rem" />
              <div
                className="hero-map"
                style={{
                  borderRadius: "1.2rem",
                  minHeight: "220px",
                  ...heroSkeletonFillSurface,
                }}
              />
            </div>
            <div
              className="hero-panel"
              style={{
                ...heroSkeletonPanelSurface,
                minHeight: "260px",
                display: "grid",
                gap: "0.8rem",
              }}
            >
              <SkeletonBar width="50%" height="1.05rem" radius="0.75rem" />
              <div style={{ display: "grid", gap: "0.7rem" }}>
                {Array.from({ length: 3 }).map((_, index) => (
                  <SkeletonBar key={index} width="100%" height="64px" radius="1rem" />
                ))}
              </div>
            </div>
            <div
              className="hero-panel"
              style={{
                ...heroSkeletonPanelSurface,
                minHeight: "240px",
                display: "grid",
                gap: "0.75rem",
              }}
            >
              <SkeletonBar width="60%" height="1.05rem" radius="0.75rem" />
              <div
                className="hero-trust__grid"
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                  gap: "0.6rem",
                }}
              >
                {Array.from({ length: 6 }).map((_, index) => (
                  <div
                    key={index}
                    style={{
                      height: "60px",
                      borderRadius: "1rem",
                      display: "block",
                      ...heroSkeletonFillSurface,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}