import { Suspense, memo, useEffect, useState } from "react";
import ThemeToggle from "./ThemeToggle";
import ServerFeatureHighlights from "./ServerFeatureHighlights";
import { useTheme } from "../context/ThemeContext";
import FeatureSkeletonGrid from "./skeletons/FeatureSkeleton";
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
        style={{
          position: "relative",
          padding: "1.75rem",
          borderRadius: "1.25rem",
          border: `1px solid ${darkMode ? "rgba(148,163,184,0.2)" : "rgba(148,163,184,0.3)"}`,
          background: darkMode
            ? "linear-gradient(160deg, rgba(15,23,42,0.82), rgba(30,41,59,0.88))"
            : "linear-gradient(160deg, rgba(255,255,255,0.92), rgba(241,245,249,0.9))",
          boxShadow: darkMode
            ? "0 25px 45px rgba(8, 15, 34, 0.55)"
            : "0 20px 35px rgba(148, 163, 184, 0.35)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          color: darkMode ? "#e2e8f0" : "#1f2937",
          transition: "transform var(--transition-fast), box-shadow var(--transition-fast)",
        }}
      >
        <span
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: "1px",
            borderRadius: "inherit",
            background: darkMode
              ? "linear-gradient(135deg, rgba(99,102,241,0.12), transparent 65%)"
              : "linear-gradient(135deg, rgba(99,102,241,0.08), transparent 65%)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "relative",
            zIndex: 1,
            display: "grid",
            gap: "1.25rem",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div
              style={{
                width: "3rem",
                height: "3rem",
                display: "grid",
                placeItems: "center",
                fontSize: "1.5rem",
                borderRadius: "0.85rem",
                background: darkMode
                  ? "linear-gradient(135deg, rgba(99,102,241,0.25), rgba(79,70,229,0.35))"
                  : "linear-gradient(135deg, rgba(79,70,229,0.18), rgba(99,102,241,0.25))",
                boxShadow: darkMode
                  ? "0 12px 24px rgba(30,58,138,0.45)"
                  : "0 15px 30px rgba(99,102,241,0.22)",
              }}
            >
              {feature.icon}
            </div>
            <span
              style={{
                padding: "0.35rem 0.85rem",
                borderRadius: "999px",
                background: darkMode
                  ? "rgba(148,163,184,0.16)"
                  : "rgba(30,64,175,0.1)",
                border: darkMode
                  ? "1px solid rgba(148,163,184,0.28)"
                  : "1px solid rgba(59,130,246,0.2)",
                fontSize: "0.75rem",
                fontWeight: 600,
                color: darkMode ? "#cbd5e1" : "#1d4ed8",
              }}
            >
              {feature.status}
            </span>
          </div>
          <div style={{ display: "grid", gap: "0.75rem" }}>
            <h3
              style={{
                fontSize: "1.4rem",
                fontWeight: 700,
                letterSpacing: "-0.015em",
              }}
            >
              {feature.title}
            </h3>
            <p
              style={{
                color: darkMode ? "#cbd5e1" : "#475569",
                lineHeight: 1.7,
              }}
            >
              {feature.description}
            </p>
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
        padding: "5rem 0",
      }}
    >
      <div
        className="container"
        style={{
          position: "relative",
          zIndex: 1,
          display: "grid",
          gap: "2.5rem",
        }}
      >
        <div
          className="section-header"
          data-animate="fade-up"
          data-animate-context="story"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            alignItems: "flex-start",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
              gap: "1rem",
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
              gap: "0.75rem",
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
                  gap: "0.35rem",
                  padding: "0.4rem 0.75rem",
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
              gap: "1.5rem",
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