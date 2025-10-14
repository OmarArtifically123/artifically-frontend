import { lazy, Suspense, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import RouteShell from "../components/skeletons/RouteShell";
import ParallaxSection from "../components/animation/ParallaxSection";

const Hero = lazy(() => import("../components/Hero"));
const Features = lazy(() => import("../components/Features"));
const Marketplace = lazy(() => import("../components/Marketplace"));
const RecommendationEngine = lazy(() => import("../components/RecommendationEngine.jsx"));

export default function Home({ user, scrollTo, openAuth }) {
  const location = useLocation();
  const isServer = typeof window === "undefined";
  const [contentReady, setContentReady] = useState(isServer);
  const [pageReady, setPageReady] = useState(isServer);

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

  useEffect(() => {
    if (isServer) return undefined;

    const timer = window.setTimeout(() => setPageReady(true), 0);
    return () => window.clearTimeout(timer);
  }, [isServer]);

  return (
    <main className="home-shell" data-ready={pageReady ? "true" : "false"}>
      <Suspense fallback={<HeroSkeleton />}>
        <Hero openAuth={openAuth} user={user} />
      </Suspense>
      <ParallaxSection speed={0.18} className="home-section home-section--recommendations">
        <section aria-label="Recommended automations for you">
          <Suspense fallback={<RouteShell rows={3} />}>
            {contentReady ? (
              <RecommendationEngine userBehavior={user?.behavior} deployments={user?.deployments} />
            ) : (
              <RouteShell rows={3} />
            )}
          </Suspense>
        </section>
      </ParallaxSection>
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
    </main>
  );
}


const heroSkeletonCanvasStyle = {
  position: "fixed",
  inset: 0,
  width: "100vw",
  height: "max(100dvh, 1500px)",
  pointerEvents: "none",
  background:
    "radial-gradient(circle at 30% 35%, rgba(59, 130, 246, 0.28), transparent 55%), " +
    "radial-gradient(circle at 70% 65%, rgba(147, 51, 234, 0.24), transparent 58%), " +
    "linear-gradient(180deg, var(--bg-from), var(--bg-to))",
  opacity: 0.85,
  zIndex: -1,
  transform: "translateZ(0)",
};

const heroSkeletonSurface = {
  background: "linear-gradient(160deg, rgba(15, 23, 42, 0.88), rgba(2, 6, 23, 0.94))",
  border: "1px solid rgba(148, 163, 184, 0.22)",
  boxShadow: "0 28px 60px rgba(15, 23, 42, 0.45)",
  backdropFilter: "blur(18px) saturate(140%)",
  WebkitBackdropFilter: "blur(18px) saturate(140%)",
};

const heroSkeletonFillSurface = {
  background: "linear-gradient(135deg, rgba(148, 163, 184, 0.2), rgba(148, 163, 184, 0.1))",
  border: "1px solid rgba(148, 163, 184, 0.18)",
  animation: "pulse 1.6s ease-in-out infinite",
};

const heroSkeletonLogoChipStyle = {
  display: "inline-block",
  minWidth: "96px",
  height: "1.1rem",
  borderRadius: "999px",
  background: "rgba(148, 163, 184, 0.32)",
  animation: "pulse 1.8s ease-in-out infinite",
};

const heroSkeletonAvatarStyle = {
  width: "2.6rem",
  height: "2.6rem",
  borderRadius: "0.95rem",
  background: "rgba(148, 163, 184, 0.28)",
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
      data-hero-version="reimagined"
      aria-busy="true"
      aria-live="polite"
      aria-label="Loading Artifically hero experience"
    >
      <div className="hero-background hero-bg-fixed" aria-hidden="true" style={heroSkeletonCanvasStyle} />
      <div className="hero-shell" aria-hidden="true">
        <div className="hero-content" style={{ gap: "1.6rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.85rem", flexWrap: "wrap" }}>
            <SkeletonBar width="260px" height="42px" radius="1.1rem" />
            <SkeletonBar width="168px" height="30px" radius="999px" />
          </div>
        <SkeletonBar width="180px" height="28px" radius="999px" />
          <div style={{ display: "grid", gap: "0.75rem" }}>
            <SkeletonBar width="72%" height="3.6rem" radius="1.25rem" />
            <SkeletonBar width="68%" height="3.6rem" radius="1.25rem" />
            <SkeletonBar width="54%" height="3.6rem" radius="1.25rem" />
          </div>
          <div style={{ display: "grid", gap: "0.6rem" }}>
            <SkeletonBar width="100%" height="1.15rem" />
            <SkeletonBar width="92%" height="1.15rem" />
            <SkeletonBar width="70%" height="1.15rem" />
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.9rem" }}>
            <SkeletonBar width="214px" height="54px" radius="1.35rem" />
            <SkeletonBar width="220px" height="54px" radius="1.35rem" />
          </div>
          <div style={{ display: "grid", gap: "0.5rem", marginTop: "0.4rem" }}>
            <SkeletonBar width="100%" height="0.7rem" radius="999px" />
            <SkeletonBar width="58%" height="1rem" radius="0.75rem" />
          </div>
          <div
            style={{
              ...heroSkeletonSurface,
              borderRadius: "1.6rem",
              padding: "1.2rem",
              display: "grid",
              gap: "0.9rem",
            }}
          >
            <SkeletonBar width="60%" height="1rem" radius="0.75rem" />
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                gap: "0.9rem",
              }}
            >
              {Array.from({ length: 3 }).map((_, index) => (
                <SkeletonBar key={`stat-${index}`} width="100%" height="2.8rem" radius="0.95rem" />
              ))}
            </div>
            </div>
          <div
            style={{
              ...heroSkeletonSurface,
              borderRadius: "1.6rem",
              padding: "1.1rem 1.2rem",
              display: "grid",
              gap: "0.85rem",
            }}
          >
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={`activity-${index}`}
                style={{
                  display: "grid",
                  gridTemplateColumns: "auto 1fr auto",
                  gap: "0.8rem",
                  alignItems: "center",
                }}
              >
                <span style={heroSkeletonAvatarStyle} />
                <div style={{ display: "grid", gap: "0.35rem" }}>
                  <SkeletonBar width="180px" height="0.95rem" radius="0.75rem" />
                  <SkeletonBar width="120px" height="0.85rem" radius="0.75rem" />
                </div>
                <SkeletonBar width="64px" height="0.75rem" radius="999px" />
              </div>
            ))}
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
              gap: "0.75rem",
            }}
          >
            {Array.from({ length: 4 }).map((_, index) => (
              <SkeletonBar key={`badge-${index}`} width="100%" height="2.4rem" radius="0.9rem" />
            ))}
          </div>
        </div>
      </div>
      <div className="logo-wall" data-with-scene="true" aria-hidden="true">
        <div className="logo-wall__marquee">
          <div className="logo-track" style={{ gap: "2rem" }}>
            {Array.from({ length: 6 }).map((_, index) => (
              <span key={`logo-${index}`} style={heroSkeletonLogoChipStyle} />
            ))}
          </div>
        </div>
        <div className="logo-wall__scene">
          <div className="hero-preview" aria-hidden="true" style={{ minHeight: "clamp(320px, 50vh, 720px)" }}>
            <div
              className="hero-preview__inner"
              style={{
                ...heroSkeletonSurface,
                borderRadius: "clamp(2.4rem, 4vw, 3.6rem)",
                padding: "clamp(1.2rem, 3vw, 2.4rem)",
              }}
            >
              <div
                style={{
                  ...heroSkeletonFillSurface,
                  width: "100%",
                  height: "100%",
                  borderRadius: "clamp(1.6rem, 3vw, 2.75rem)",
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}