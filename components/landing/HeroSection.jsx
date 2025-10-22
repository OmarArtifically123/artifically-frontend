"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import dynamic from "next/dynamic";
import useInViewState from "../../hooks/useInViewState";
import motionCatalog from "../../design/motion/catalog";
import ScrollIndicator from "./ScrollIndicator";
import HeroRoiCalculator from "./HeroRoiCalculator";
import { Icon } from "../icons";
import TrustedBy from "./TrustedBy";
import AnimatedNumber from "../AnimatedNumber.jsx";
import { SPRING_CONFIGS } from "../../constants/animations.js";

function HeroBackgroundPlaceholder() {
  return <div className="hero-background hero-background--placeholder" aria-hidden="true" />;
}

const HeroBackground = dynamic(() => import("./HeroBackground"), {
  ssr: false,
  loading: () => <HeroBackgroundPlaceholder />,
});

const heroStats = [
  { label: "Automations", value: 12500, suffix: "+" },
  { label: "Uptime", value: 98.6, suffix: "%" },
  { label: "ROI", value: 4.8, suffix: "x" },
];

const defaultLogos = [
  "Northwind", "Aurora", "Nimbus", "Atlas", "Velocity", "Zenith", "Skyline", "Lumen",
];

const headlineWords = ["Deploy", "Enterprise", "AI", "Automations", "in", "Minutes"];

const previewTiles = [
  {
    icon: "database",
    label: "Unified Data Lake",
    description: "Stream customer and ops data into one warehouse with automated schema mapping.",
  },
  {
    icon: "barChart",
    label: "Executive Dashboards",
    description: "Broadcast KPI shifts to every region with adaptive alerting workflows.",
  },
  {
    icon: "mail",
    label: "Smart Outreach",
    description: "Trigger tailored nurture campaigns the second intent signals spike.",
  },
  {
    icon: "cog",
    label: "Ops Orchestration",
    description: "Automate hand-offs between systems and teams with zero manual routing.",
  },
  {
    icon: "users",
    label: "Agent Assist",
    description: "Serve frontline teams AI copilots that surface next-best actions instantly.",
  },
  {
    icon: "workflow",
    label: "Workflow Builder",
    description: "Drag-and-drop approvals, escalations, and QA into reusable playbooks.",
  },
  {
    icon: "code",
    label: "API Automations",
    description: "Deploy serverless functions that connect every bespoke tool in minutes.",
  },
  {
    icon: "bell",
    label: "Incident Alerts",
    description: "Route critical incidents to the right owner with AI-prioritized severity.",
  },
  {
    icon: "lock",
    label: "Governance Guardrails",
    description: "Enforce SOC2-ready policies with full audit trails and role-based control.",
  },
];

const defaultPreviewTile = previewTiles[0];

export default function HeroSection({
  onPrimary,
  onSecondary,
  demoDialogId,
  demoOpen,
  onReady = () => {},
}) {
  const [primaryLabel, setPrimaryLabel] = useState("Start Free Trial");
  const [secondaryLabel, setSecondaryLabel] = useState("Watch Demo");
  const [ctaContext, setCtaContext] = useState("");
  const [activeTile, setActiveTile] = useState(defaultPreviewTile);
  const tooltipTimeoutRef = useRef(null);
  const [initialHeroInView] = useState(() => {
    if (typeof window === "undefined") {
      return true;
    }
    const scrollElement = document.scrollingElement || document.documentElement;
    const scrollPosition = typeof window.scrollY === "number" ? window.scrollY : scrollElement?.scrollTop || 0;
    return scrollPosition <= 48;
  });

  useEffect(() => {
    if (typeof window === "undefined") {
      return undefined;
    }

    const referrer = document.referrer || "";
    const locale = window.navigator?.language || "";
    let timezone = "";
    try {
      timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
    } catch (error) {
      timezone = "";
    }

    if (referrer.includes("partners")) {
      setPrimaryLabel("Launch partner pilot");
      setCtaContext("We noticed you're visiting from the partner hub—skip the trial and request a guided pilot.");
    } else if (locale.startsWith("en-GB") || timezone.includes("Europe")) {
      setPrimaryLabel("Book EU onboarding");
      setCtaContext("European customers get dedicated onboarding slots with GDPR-ready templates.");
    } else if (locale.startsWith("en-AU") || timezone.includes("Australia")) {
      setPrimaryLabel("Start ANZ rollout");
      setCtaContext("We'll provision an APAC workspace with local support hours.");
    }

    if (referrer.includes("webinar")) {
      setSecondaryLabel("Replay webinar demo");
    }

    return undefined;
  }, []);

  const prefersReducedMotion = useReducedMotion();
  const [heroRef, heroInView] = useInViewState({
    threshold: 0.2,
    rootMargin: "0px 0px -20% 0px",
    once: true,
    initialInView: initialHeroInView,
  });
  const [contentRef, contentInView] = useInViewState({
    threshold: 0.4,
    rootMargin: "-80px",
    once: true,
    initialInView: initialHeroInView,
  });
  const [previewRef, previewInView] = useInViewState({
    threshold: 0.3,
    rootMargin: "-64px",
    once: true,
    initialInView: initialHeroInView,
  });

  const { scrollY } = useScroll();
  const heroParallaxY = useTransform(scrollY, [0, 500], [0, 150]);
  const heroFade = useTransform(scrollY, [0, 200, 900], [1, 1, 0]);

  useEffect(() => {
    if (typeof onReady === "function") {
      onReady();
    }
  }, [onReady]);

  useEffect(() => {
    return () => {
      if (tooltipTimeoutRef.current) {
        clearTimeout(tooltipTimeoutRef.current);
      }
    };
  }, []);

  const createFadeVariants = useCallback(
    (delay, duration, distance = 24) => {
      const hidden = { opacity: 0 };
      if (!prefersReducedMotion) {
        hidden.y = distance;
      }
      const visible = {
        opacity: 1,
        transition: {
          delay,
          duration,
          ease: motionCatalog.easings.out,
        },
      };
      if (!prefersReducedMotion) {
        visible.y = 0;
      }
      return { hidden, visible };
    },
    [prefersReducedMotion],
  );

  const eyebrowVariants = useMemo(() => createFadeVariants(0.2, 0.6, 20), [createFadeVariants]);
  const subheadlineVariants = useMemo(() => createFadeVariants(0.8, 0.6, 18), [createFadeVariants]);
  const ctaVariants = useMemo(() => createFadeVariants(1, 0.6, 18), [createFadeVariants]);
  const trustVariants = useMemo(() => createFadeVariants(1.2, 0.6, 14), [createFadeVariants]);

  const headlineVariants = useMemo(() => {
    const hidden = { opacity: 0 };
    if (!prefersReducedMotion) {
      hidden.y = 32;
    }
    const visible = {
      opacity: 1,
      transition: {
        delay: 0.4,
        duration: 0.8,
        ease: motionCatalog.easings.out,
        staggerChildren: 0.05,
      },
    };
    if (!prefersReducedMotion) {
      visible.y = 0;
    }
    return { hidden, visible };
  }, [prefersReducedMotion]);

  const headlineWordVariants = useMemo(() => {
    const hidden = { opacity: 0 };
    if (!prefersReducedMotion) {
      hidden.y = 18;
    }
    const visible = {
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: motionCatalog.easings.out,
      },
    };
    if (!prefersReducedMotion) {
      visible.y = 0;
    }
    return { hidden, visible };
  }, [prefersReducedMotion]);

  const previewVariants = useMemo(() => {
    const hidden = { opacity: 0 };
    if (!prefersReducedMotion) {
      hidden.x = 80;
      hidden.rotateY = -22;
    }
    const visible = {
      opacity: 1,
      transition: {
        delay: 0.6,
        duration: 1,
        ease: [0.34, 1.56, 0.64, 1],
      },
    };
    if (!prefersReducedMotion) {
      visible.x = 0;
      visible.rotateY = -8;
    }
    return { hidden, visible };
  }, [prefersReducedMotion]);

  const handleTileSelect = useCallback((tile) => {
    if (tooltipTimeoutRef.current) {
      clearTimeout(tooltipTimeoutRef.current);
    }
    setActiveTile(tile);
    tooltipTimeoutRef.current = setTimeout(() => {
      setActiveTile(defaultPreviewTile);
    }, 4000);
  }, []);

  const handleTileBlur = useCallback(() => {
    if (tooltipTimeoutRef.current) {
      clearTimeout(tooltipTimeoutRef.current);
    }
    tooltipTimeoutRef.current = setTimeout(() => {
      setActiveTile(defaultPreviewTile);
    }, 150);
  }, []);

  const visibleTile = activeTile ?? defaultPreviewTile;
  const visibleTileIndex = Math.max(
    previewTiles.findIndex((tile) => tile.label === visibleTile.label),
    0,
  );
  const previewPanelId = "hero-preview-panel";
  const activeTabId = `hero-preview-tab-${visibleTileIndex}`;

  return (
    <motion.section
      data-hero-enhanced="true"
      ref={heroRef}
      className="page-hero"
      aria-labelledby="hero-headline"
      tabIndex={-1}
      style={prefersReducedMotion ? undefined : { y: heroParallaxY, opacity: heroFade }}
    >
      {heroInView ? <HeroBackground variant="particles" /> : <HeroBackgroundPlaceholder />}
      <div className="page-hero__inner">
        <motion.div ref={contentRef} className="page-hero__content">
          <motion.span
            className="page-hero__eyebrow"
            initial="hidden"
            animate={contentInView ? "visible" : "hidden"}
            variants={eyebrowVariants}
          >
            <span className="page-hero__eyebrow-icon" aria-hidden="true">
              ⚡
            </span>
            <span>THE FUTURE OF AI AUTOMATION</span>
          </motion.span>
          <motion.h1
            id="hero-headline"
            className="page-hero__headline"
            initial="hidden"
            animate={contentInView ? "visible" : "hidden"}
            variants={headlineVariants}
          >
            {headlineWords.map((word) => (
              <motion.span
                key={word}
                className={word === "Automations" ? "headline-word headline-word--gradient" : "headline-word"}
                variants={headlineWordVariants}
              >
                {word}
              </motion.span>
            ))}
          </motion.h1>
          <motion.p
            className="page-hero__subheadline"
            initial="hidden"
            animate={contentInView ? "visible" : "hidden"}
            variants={subheadlineVariants}
          >
            Transform operations with battle-tested automations. No setup hell. No vendor lock-in. Just results.
          </motion.p>
          <motion.div
            className="cta-group"
            initial="hidden"
            animate={contentInView ? "visible" : "hidden"}
            variants={ctaVariants}
          >
            <motion.button
              type="button"
              className="cta-primary"
              data-hero-focus-target="primary-cta"
              onClick={onPrimary}
              whileHover={{
                scale: 1.02,
                boxShadow: "0 12px 32px rgba(99, 102, 241, 0.45)",
                transition: { type: "spring", ...SPRING_CONFIGS.medium },
              }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.2 }}
            >
              <span className="cta-primary__label">{primaryLabel}</span>
            </motion.button>
            <motion.button
              type="button"
              className="cta-secondary"
              onClick={onSecondary}
              aria-haspopup="dialog"
              aria-controls={demoDialogId || undefined}
              aria-expanded={typeof demoOpen === "boolean" ? (demoOpen ? "true" : "false") : undefined}
              whileHover={{
                scale: 1.02,
                y: -2,
                transition: { type: "spring", ...SPRING_CONFIGS.slow },
              }}
              whileTap={{ scale: 0.97 }}
            >
              <span className="cta-secondary__icon" aria-hidden="true">
                ▶
              </span>
              <span>{secondaryLabel}</span>
            </motion.button>
          </motion.div>
          <motion.div
            className="hero-trust-row"
            initial="hidden"
            animate={contentInView ? "visible" : "hidden"}
            variants={trustVariants}
          >
            <TrustSignal>No credit card required</TrustSignal>
            <TrustSignal>Free 14-day trial</TrustSignal>
            <TrustSignal>Cancel anytime</TrustSignal>
          </motion.div>
          {ctaContext ? (
            <motion.p
              className="hero-cta-context"
              initial="hidden"
              animate={contentInView ? "visible" : "hidden"}
              variants={createFadeVariants(1.35, 0.6, 12)}
            >
              {ctaContext}
            </motion.p>
          ) : null}
          <HeroStats
            stats={heroStats}
            prefersReducedMotion={prefersReducedMotion}
            initialInView={initialHeroInView}
          />
          <TrustedBy logos={defaultLogos} />
        </motion.div>
        <div className="page-hero__preview" id="product-preview">
          <motion.article
            ref={previewRef}
            className="preview-card"
            initial="hidden"
            animate={previewInView ? "visible" : "hidden"}
            variants={previewVariants}
            whileHover={
              prefersReducedMotion
                ? { y: -4 }
                : { rotateY: 0, y: -8, transition: { duration: 0.4, ease: "easeOut" } }
            }
          >
            <span className="preview-card__chip">LIVE PRODUCT PREVIEW</span>
            <div className="preview-card__stage">
              <div className="preview-grid" role="tablist" aria-label="Product preview options">
                {previewTiles.map((tile, index) => {
                  const isActive = visibleTile.label === tile.label;
                  const tabId = `hero-preview-tab-${index}`;
                  return (
                    <motion.button
                      key={tile.label}
                      type="button"
                      className="preview-grid__cell"
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleTileSelect(tile)}
                      onMouseEnter={() => handleTileSelect(tile)}
                      onFocus={() => handleTileSelect(tile)}
                      onBlur={handleTileBlur}
                      onMouseLeave={handleTileBlur}
                      role="tab"
                      id={tabId}
                      aria-selected={isActive ? "true" : "false"}
                      aria-controls={previewPanelId}
                      data-index={index}
                      data-active={isActive ? "true" : "false"}
                    >
                      <Icon name={tile.icon} size={32} strokeWidth={1.6} className="preview-grid__icon" />
                      <span className="sr-only">{tile.label}</span>
                    </motion.button>
                  );
                })}
              </div>
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={visibleTile.label}
                  className="preview-card__tooltip"
                  role="tabpanel"
                  id={previewPanelId}
                  aria-labelledby={activeTabId}
                  tabIndex={0}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } }}
                  exit={{ opacity: 0, y: 12, transition: { duration: 0.2, ease: "easeInOut" } }}
                >
                  <span className="preview-card__tooltip-title">{visibleTile.label}</span>
                  <p>{visibleTile.description}</p>
                </motion.div>
              </AnimatePresence>
            </div>
            <p className="preview-card__annotation hero-quote">
              "We launched our global support automation in under 2 hours. Artifically handled auth, routing, and reporting out of the box."
              <span className="hero-quote__author">— Elena Ruiz, VP Operations</span>
            </p>
          </motion.article>
          <div className="preview-floating preview-floating--deploy" aria-hidden="true">
            <span className="preview-floating__icon">⚡</span>
            Deploy in 5 min
          </div>
          <div className="preview-floating preview-floating--uptime" aria-hidden="true">
            <span className="preview-floating__icon">✓</span>
            99.9% Uptime
          </div>
          <div className="preview-floating preview-floating--active" aria-hidden="true">
            <span className="preview-floating__icon">🚀</span>
            10K+ Active
          </div>
        </div>
      </div>
      <div className="page-hero__roi">
        <HeroRoiCalculator />
      </div>
      <ScrollIndicator targetId="problem-solution" />
    </motion.section>
  );
}

function HeroStats({ stats, prefersReducedMotion, initialInView }) {
  const [statsRef, statsInView] = useInViewState({ threshold: 0.4, once: true, initialInView });

  const containerVariants = useMemo(() => {
    const hidden = { opacity: 0 };
    if (!prefersReducedMotion) {
      hidden.y = 12;
    }
    const visible = {
      opacity: 1,
      y: 0,
      transition: {
        duration: motionCatalog.durations.short,
        ease: motionCatalog.easings.out,
        staggerChildren: motionCatalog.durations.stagger,
      },
    };
    if (prefersReducedMotion) {
      delete visible.y;
    }
    return { hidden, visible };
  }, [prefersReducedMotion]);

  return (
    <motion.div
      ref={statsRef}
      className="hero-stats"
      aria-label="Key platform metrics"
      initial="hidden"
      animate={statsInView ? "visible" : "hidden"}
      variants={containerVariants}
    >
      {stats.map((stat, index) => (
        <StatCounter
          key={stat.label}
          index={index}
          prefersReducedMotion={prefersReducedMotion}
          {...stat}
        />
      ))}
    </motion.div>
  );
}

function StatCounter({ value, suffix = "", label, index, prefersReducedMotion }) {
  const itemVariants = useMemo(() => {
    const hidden = { opacity: 0 };
    if (!prefersReducedMotion) {
      hidden.y = 12;
    }
    const visible = {
      opacity: 1,
      y: 0,
      transition: {
        duration: motionCatalog.durations.short,
        ease: motionCatalog.easings.out,
        delay: Math.min(0.32, index * motionCatalog.durations.stagger),
      },
    };
    if (prefersReducedMotion) {
      delete visible.y;
    }
    return { hidden, visible };
  }, [prefersReducedMotion, index]);

  const precision = Number.isInteger(value) ? 0 : 1;
  const formattedStatic = useMemo(
    () =>
      `${Number(value).toLocaleString(undefined, {
        minimumFractionDigits: precision,
        maximumFractionDigits: precision,
      })}${suffix}`,
    [precision, suffix, value],
  );

  return (
    <motion.div className="hero-stat" variants={itemVariants}>
      <span className="hero-stat__value">
        {prefersReducedMotion ? (
          formattedStatic
        ) : (
          <AnimatedNumber value={value} precision={precision} suffix={suffix} />
        )}
      </span>
      <span className="hero-stat__label">{label}</span>
    </motion.div>
  );
}

function TrustSignal({ children }) {
  return (
    <span className="trust-signal">
      <span className="trust-signal__icon" aria-hidden="true">
        <span className="trust-signal__check">✓</span>
      </span>
      <span>{children}</span>
    </span>
  );
}