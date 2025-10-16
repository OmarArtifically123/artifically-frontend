import { useEffect, useRef, useState } from "react";
import DOMPurify from "dompurify";
import FeatureSkeletonGrid from "./skeletons/FeatureSkeleton";
import useIntersectionLazy from "../hooks/useIntersectionLazy";
import { space } from "../styles/spacing";
import {
  FALLBACK_FEATURE_HIGHLIGHTS,
  FALLBACK_MARKETPLACE_STATS,
} from "../lib/graphqlClient";

const SERVER_COMPONENT_ENDPOINT = "/rsc/features";

function FeatureHighlightFallback({
  features = FALLBACK_FEATURE_HIGHLIGHTS,
  stats = FALLBACK_MARKETPLACE_STATS,
}) {
  const safeFeatures = Array.isArray(features) ? features.slice(0, 4) : [];
  const safeStats = stats || FALLBACK_MARKETPLACE_STATS;

  return (
    <div className="rsc-feature-grid" aria-live="polite">
      {safeFeatures.map((feature) => (
        <article key={feature.id} data-fallback-node="feature-card">
          <header style={{ display: "flex", alignItems: "center", gap: space("xs", 1.5) }}>
            <span
              aria-hidden="true"
              style={{
                width: "3rem",
                height: "3rem",
                display: "grid",
                placeItems: "center",
                borderRadius: "1rem",
                background:
                  "linear-gradient(135deg, rgba(99,102,241,0.32), rgba(45,212,191,0.26))",
                fontSize: "1.35rem",
              }}
            >
              {feature.icon}
            </span>
            <div>
              <h4>{feature.title}</h4>
              <small style={{ color: "var(--gray-400)", fontWeight: 600 }}>
                {feature.status}
              </small>
            </div>
          </header>
          <p>{feature.description}</p>
          <footer>
            <span>
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  d="M2.5 8.5L6 12L13.5 4.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              {safeStats?.averageROI ?? "5.0"}x avg ROI
            </span>
            <span>{safeStats?.totalAutomations ?? "100"}+ live</span>
          </footer>
        </article>
      ))}
    </div>
  );
}

export default function ServerFeatureHighlights({
  defaultFeatures = FALLBACK_FEATURE_HIGHLIGHTS,
  defaultStats = FALLBACK_MARKETPLACE_STATS,
} = {}) {
  const [isMounted, setIsMounted] = useState(false);
  const [state, setState] = useState({ status: "idle", markup: "", error: null });
  const hasRequestedRef = useRef(false);
  const intersection = useIntersectionLazy({ rootMargin: "400px" });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted || !intersection.isIntersecting || hasRequestedRef.current) {
      return;
    }

    const controller = new AbortController();
    hasRequestedRef.current = true;
    setState({ status: "loading", markup: "", error: null });

    fetch(SERVER_COMPONENT_ENDPOINT, {
      headers: {
        Accept: "text/html",
        "X-Server-Component": "1",
      },
      credentials: "same-origin",
      signal: controller.signal,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to load server component: ${response.status}`);
        }
        return response.text();
      })
      .then((html) => {
        const trimmed = html.trim();
        if (!trimmed || /<html[^>]*>/i.test(trimmed) || /<body[^>]*>/i.test(trimmed)) {
          throw new Error("Received invalid server markup");
        }
        const sanitized =
          typeof window === "undefined"
            ? trimmed
            : DOMPurify.sanitize(trimmed, {
                USE_PROFILES: { html: true },
                ADD_ATTR: ["target", "rel"],
                FORBID_TAGS: ["script", "style"],
              });
        setState({ status: "success", markup: sanitized, error: null })
      })
      .catch((error) => {
        if (controller.signal.aborted) {
          return;
        }
        console.error("Server feature highlight stream failed", error);
        setState({ status: "error", markup: "", error });
      });

    return () => {
      controller.abort();
    };
  }, [isMounted, intersection.isIntersecting]);

  const sectionProps = {
    className: "rsc-feature-shell",
    "aria-label": "Feature insights",
    ref: intersection.ref,
  };

  let content = <FeatureSkeletonGrid cards={4} />;

  if (state.status === "success" && state.markup) {
    content = (
      <div
        className="rsc-feature-grid"
        dangerouslySetInnerHTML={{ __html: state.markup }}
      />
    );
  } else if (state.status === "error") {
    content = (
      <FeatureHighlightFallback
        features={defaultFeatures}
        stats={defaultStats}
      />
    );
  } else if (state.status === "idle" && defaultFeatures && defaultFeatures.length) {
    content = (
      <FeatureHighlightFallback
        features={defaultFeatures}
        stats={defaultStats}
      />
    );
  }

  return <section {...sectionProps}>{content}</section>;
}