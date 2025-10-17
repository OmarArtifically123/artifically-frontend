import { Suspense, memo, useEffect, useState } from "react";
import ThemeToggle from "./ThemeToggle";
import ServerFeatureHighlights from "./ServerFeatureHighlights";
import { useTheme } from "../context/ThemeContext";
import FeatureSkeletonGrid from "./skeletons/FeatureSkeleton";
import { space } from "../styles/spacing";
import { StaggeredContainer, StaggeredItem } from "./animation/StaggeredList";
import MagneticButton from "./animation/MagneticButton";
import { Icon } from "./icons";
import {
  FALLBACK_FEATURE_HIGHLIGHTS,
  FALLBACK_MARKETPLACE_STATS,
  loadFeatureData,
} from "../lib/graphqlClient";

// Memoize the feature card to avoid unnecessary re-renders while keeping SSR markup stable
const FeatureCard = memo(
  function FeatureCard({ feature, darkMode, ...props }) {
    return (
      <article
        className={`feature-card glass-card ${darkMode ? "feature-card--dark" : "feature-card--light"}`}
        {...props}
      >
        <div className="feature-card__inner">
          <div className="feature-card__header">
            <div className="feature-card__icon glass-card glass-card--subtle" aria-hidden="true">
              <Icon name={feature.icon} size={20} />
            </div>
            <span className="feature-card__badge glass-pill">{feature.status}</span>
          </div>
          <div className="feature-card__body">
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
          </div>
        </div>
      </article>
    );
  },
  (prevProps, nextProps) =>
    prevProps.feature.id === nextProps.feature.id &&
    prevProps.darkMode === nextProps.darkMode
);

const BADGE_PALETTE = {
  accent: {
    text: "var(--brand-glow)",
    background: "color-mix(in oklch, var(--brand-glow) 18%, transparent)",
    border: "color-mix(in oklch, var(--brand-glow) 35%, transparent)",
  },
  energy: {
    text: "var(--brand-energy)",
    background: "color-mix(in oklch, var(--brand-energy) 18%, transparent)",
    border: "color-mix(in oklch, var(--brand-energy) 35%, transparent)",
  },
  success: {
    text: "var(--success-vibrant)",
    background: "color-mix(in oklch, var(--success-vibrant) 18%, transparent)",
    border: "color-mix(in oklch, var(--success-vibrant) 32%, transparent)",
  },
};

function FeaturesContent() {
  const { darkMode } = useTheme();
  const [state, setState] = useState(() => ({
    loading: true,
    features: FALLBACK_FEATURE_HIGHLIGHTS,
    stats: FALLBACK_MARKETPLACE_STATS,
  }));

  useEffect(() => {
    let isMounted = true;
    const controller = typeof AbortController !== "undefined" ? new AbortController() : null;

    setState((prev) => ({ ...prev, loading: true }));

    loadFeatureData({ signal: controller?.signal })
      .then((data) => {
        if (!isMounted) return;
        setState((prev) => ({
          ...prev,
          features: data.features || FALLBACK_FEATURE_HIGHLIGHTS,
          stats: data.stats || FALLBACK_MARKETPLACE_STATS,
        }));
      })
      .catch((error) => {
        if (controller?.signal?.aborted || !isMounted) {
          return;
        }
        if (process.env.NODE_ENV !== "production") {
          console.warn("Failed to load feature data", error);
        }
        })
      .finally(() => {
        if (!isMounted) return;
        setState((prev) => ({ ...prev, loading: false }));
      });

    return () => {
      isMounted = false;
      controller?.abort?.();
    };
  }, []);

  const { features, stats, loading } = state;

  return (
    <section
      className="features"
      data-animate-root
      style={{
        position: "relative",
        padding: `${space("3xl")} 0`,
        background:
          "radial-gradient(circle at 5% 0%, color-mix(in oklch, var(--brand-primary) 12%, transparent) 0%, transparent 65%), " +
          "radial-gradient(circle at 95% 8%, color-mix(in oklch, var(--brand-energy) 16%, transparent) 0%, transparent 55%)",
      }}
    >
      <div
        className="container"
        style={{
          position: "relative",
          zIndex: 1,
          display: "grid",
          gap: space("lg", 1.25),
          maxWidth: "var(--layout-max-width)",
          marginInline: "auto",
        }}
      >
        <div
          className="section-header"
          data-animate="fade-up"
          data-animate-context="story"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: space("sm"),
            alignItems: "flex-start",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
              gap: space("sm"),
              flexWrap: "wrap",
            }}
          >
            <div data-animate="fade-up" data-animate-order="1">
              <h2
              data-kinetic="glimmer"
                style={{
                  fontSize: "clamp(2.1rem, 4vw, 2.8rem)",
                  fontWeight: 800,
                  letterSpacing: "-0.02em",
                  display: "inline-flex",
                  gap: "0.35ch",
                }}
              >
                Built for Modern Enterprises
              </h2>
              <p
                style={{
                  maxWidth: "540px",
                  color: "var(--text-secondary)",
                  fontSize: "1.05rem",
                }}
                data-animate="fade-up"
                data-animate-order="2"
              >
                Automations that deliver measurable ROI from day one, with governance controls your compliance teams will love.
              </p>
            </div>
            <div data-animate="scale-in" data-animate-order="3" data-animate-context="panel">
              <ThemeToggle />
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: space("xs", 1.5),
            }}
            data-animate="fade-up"
            data-animate-order="4"
            data-animate-cascade="0.05"
          >
            {[
              { label: "Accessibility first", tone: "success" },
              { label: "Glassmorphism UI", tone: "accent" },
              {
                label: `${stats.totalAutomations}+ automations deployed`,
                tone: "energy",
              },
            ].map((badge) => (
              <span
                key={badge.label}
                className="glass-pill"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: space("2xs", 1.4),
                  padding: `${space("2xs", 1.6)} ${space("xs", 1.5)}`,
                  borderRadius: "0.75rem",
                  fontSize: "0.85rem",
                  background: BADGE_PALETTE[badge.tone]?.background,
                  color: BADGE_PALETTE[badge.tone]?.text,
                  border: `1px solid ${BADGE_PALETTE[badge.tone]?.border || "transparent"}`,
                  fontWeight: 600,
                }}
              >
                <span aria-hidden="true">●</span>
                {badge.label}
              </span>
            ))}
          </div>
        </div>

         <div
          data-animate="blur-up"
          data-animate-context="story"
          data-animate-order="1"
          style={{
            position: "relative",
            borderRadius: "var(--rounded-3xl)",
            overflow: "hidden",
          }}
        >
          <ServerFeatureHighlights defaultFeatures={features} defaultStats={stats} />
        </div>

        {loading ? (
          <FeatureSkeletonGrid cards={4} />
        ) : (
          <StaggeredContainer
            className="features-grid layout-bento"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "var(--layout-bento-gap)",
            }}
          >
            {features.map((feature, index) => (
                <StaggeredItem key={feature.id} index={index} style={{ display: "flex" }}>
                  <FeatureCard feature={feature} darkMode={darkMode} />
                </StaggeredItem>
              ))}
          </StaggeredContainer>
        )}
      </div>
    </section>
  );
}

export default function Features() {
  return (
    <Suspense fallback={<FeatureSkeletonGrid />}>
      <FeaturesContent />
    </Suspense>
  );
}