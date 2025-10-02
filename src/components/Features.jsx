import { Suspense, memo, useEffect, useState } from "react";
import ThemeToggle from "./ThemeToggle";
import ServerFeatureHighlights from "./ServerFeatureHighlights";
import { useTheme } from "../context/ThemeContext";
import FeatureSkeletonGrid from "./skeletons/FeatureSkeleton";
import { space } from "../styles/spacing";
import {
  FALLBACK_FEATURE_HIGHLIGHTS,
  FALLBACK_MARKETPLACE_STATS,
  loadFeatureData,
} from "../lib/graphqlClient";

// Memoize the feature card to avoid unnecessary re-renders while keeping SSR markup stable
const FeatureCard = memo(
  function FeatureCard({ feature, darkMode, ...motionProps }) {
    return (
      <article
      {...motionProps}
        className={`feature-card glass-card ${darkMode ? "feature-card--dark" : "feature-card--light"}`}
      >
        <div className="feature-card__inner">
          <div className="feature-card__header">
            <div className="feature-card__icon glass-card glass-card--subtle" aria-hidden="true">
              {feature.icon}
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

function FeaturesContent() {
  const { darkMode } = useTheme();
  const [state, setState] = useState(() => ({
    loading: false,
    features: FALLBACK_FEATURE_HIGHLIGHTS,
    stats: FALLBACK_MARKETPLACE_STATS,
  }));

  useEffect(() => {
    let isMounted = true;
    const controller = typeof AbortController !== "undefined" ? new AbortController() : null;

    loadFeatureData({ signal: controller?.signal })
      .then((data) => {
        if (!isMounted) return;
        setState((prev) => ({
          ...prev,
          loading: false,
          features: data.features || FALLBACK_FEATURE_HIGHLIGHTS,
          stats: data.stats || FALLBACK_MARKETPLACE_STATS,
        }));
      })
      .catch((error) => {
        if (controller?.signal?.aborted || !isMounted) {
          return;
        }
        if (import.meta.env.DEV) {
          console.warn("Failed to load feature data", error);
        }
        setState((prev) => ({
          ...prev,
          loading: false,
        }));
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
      }}
    >
      <div
        className="container"
        style={{
          position: "relative",
          zIndex: 1,
          display: "grid",
          gap: space("lg", 1.25),
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
                style={{
                  fontSize: "clamp(2.1rem, 4vw, 2.8rem)",
                  fontWeight: 800,
                  letterSpacing: "-0.02em",
                }}
              >
                Built for Modern Enterprises
              </h2>
              <p
                style={{
                  maxWidth: "540px",
                  color: darkMode ? "#94a3b8" : "#475569",
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
              { label: "Accessibility first", color: "#10b981" },
              { label: "Glassmorphism UI", color: "#06b6d4" },
              {
                label: `${stats.totalAutomations}+ automations deployed`,
                color: "#6366f1",
              },
            ].map((badge) => (
              <span
                key={badge.label}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: space("2xs", 1.4),
                  padding: `${space("2xs", 1.6)} ${space("xs", 1.5)}`,
                  borderRadius: "0.75rem",
                  fontSize: "0.85rem",
                  background: `${badge.color}1a`,
                  color: badge.color,
                  border: `1px solid ${badge.color}33`,
                  fontWeight: 600,
                }}
              >
                <span aria-hidden="true">●</span>
                {badge.label}
              </span>
            ))}
          </div>
        </div>

         <div data-animate="blur-up" data-animate-context="story" data-animate-order="1">
          <ServerFeatureHighlights defaultFeatures={features} defaultStats={stats} />
        </div>
        
        {loading ? (
          <FeatureSkeletonGrid cards={4} />
        ) : (
          <div
            className="features-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: space("md"),
            }}
          >
            {features.map((feature, index) => (
              <FeatureCard
                key={feature.id}
                feature={feature}
                darkMode={darkMode}
                data-animate="scale-in"
                data-animate-context="panel"
                data-animate-order={index}
                data-animate-cascade="0.08"
              />
            ))}
          </div>
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