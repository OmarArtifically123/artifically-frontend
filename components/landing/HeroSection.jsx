"use client";

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import dynamic from "next/dynamic";
import useInViewState from "../../hooks/useInViewState";
import motionCatalog from "../../design/motion/catalog";
import ScrollIndicator from "./ScrollIndicator";
import { Icon } from "../icons";
import TrustedBy from "./TrustedBy";
import AnimatedNumber from "../AnimatedNumber.jsx";
import { SPRING_CONFIGS } from "../../constants/animations.js";

function HeroBackgroundPlaceholder() {
  return <div className="hero-background hero-background--placeholder" aria-hidden="true" />;
}

const HeroBackground = dynamic(() => import("./HeroBackgroundV2"), {
  ssr: false,
  loading: () => <HeroBackgroundPlaceholder />,
});

// Real-time marketplace vitality metrics
const heroStats = [
  { label: "Automations Live", value: 18750, suffix: "+" },
  { label: "Uptime SLA", value: 99.98, suffix: "%" },
  { label: "Avg ROI", value: 6.2, suffix: "x" },
];

// Fortune 500 & leading enterprises
const defaultLogos = [
  "Acme Corp", "TechFlow", "DataSync", "CloudScale", "AutomateX", "EnterpriseAI", "SmartOps", "FutureWorks",
];

// Hero headline emphasizing transformation
const headlineWords = ["Enterprise", "AI", "Automation", "Meets", "Operational", "Excellence"];

const previewTiles = [
  {
    icon: "database",
    label: "Enterprise Data Sync",
    description: "Unify data from 500+ systems with AI-powered schema mapping and real-time streaming.",
  },
  {
    icon: "barChart",
    label: "Intelligent Dashboards",
    description: "Executive-grade insights with ML-powered anomaly detection and predictive alerts.",
  },
  {
    icon: "mail",
    label: "Precision Outreach",
    description: "Orchestrate multi-channel campaigns with behavioral AI and propensity modeling.",
  },
  {
    icon: "cog",
    label: "Process Orchestration",
    description: "Automate complex workflows across teams and systems with zero integration work.",
  },
  {
    icon: "users",
    label: "AI Copilots",
    description: "Empower 10,000+ agents with context-aware AI that learns from your playbooks.",
  },
  {
    icon: "workflow",
    label: "No-Code Automation",
    description: "Build enterprise automations in hours with visual workflow design and AI suggestions.",
  },
  {
    icon: "code",
    label: "API-First Platform",
    description: "Connect any system instantly. Deploy automations without custom code or DevOps.",
  },
  {
    icon: "bell",
    label: "Proactive Monitoring",
    description: "Catch issues before they impact operations with AI-powered incident prediction.",
  },
  {
    icon: "lock",
    label: "Enterprise Governance",
    description: "Maintain compliance with automated audit trails, role-based access, and policy enforcement.",
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
  const [primaryLabel, setPrimaryLabel] = useState("Request Enterprise Demo");
  const [secondaryLabel, setSecondaryLabel] = useState("Explore Marketplace");
  const [ctaContext, setCtaContext] = useState("");
  const [activeTile, setActiveTile] = useState(defaultPreviewTile);
  const tooltipTimeoutRef = useRef(null);
  const stageRef = useRef(null);
  const tooltipRef = useRef(null);
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
  const y = useTransform(scrollY, [0, 500], [0, 150]);

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

  const computeGridCellSize = useCallback(() => {
    if (!stageRef.current || typeof window === "undefined") {
      return;
    }

    const tooltipElement = tooltipRef.current;
    const style = window.getComputedStyle(stageRef.current);
    const paddingTop = Number.parseFloat(style.paddingTop) || 0;
    const paddingBottom = Number.parseFloat(style.paddingBottom) || 0;
    const stageHeight = stageRef.current.getBoundingClientRect().height;
    const tooltipHeight = tooltipElement?.getBoundingClientRect().height ?? 0;
    const rows = 3;
    const gap = 12 * (rows - 1);
    const available = Math.max(stageHeight - paddingTop - paddingBottom - tooltipHeight, 0);
    const rawSize = rows > 0 ? (available - gap) / rows : 0;
    const BASE_SIZE = 112;
    const MIN_SIZE = 96;
    const size = Number.isFinite(rawSize) ? Math.max(MIN_SIZE, Math.min(BASE_SIZE, rawSize)) : BASE_SIZE;
    stageRef.current.style.setProperty("--preview-grid-cell-size", `${size}px`);
  }, []);

  useLayoutEffect(() => {
    const stageElement = stageRef.current;
    if (!stageElement || typeof window === "undefined") {
      return undefined;
    }

    let frame = requestAnimationFrame(computeGridCellSize);

    const observer = typeof ResizeObserver !== "undefined"
      ? new ResizeObserver(() => {
          cancelAnimationFrame(frame);
          frame = requestAnimationFrame(computeGridCellSize);
        })
      : null;

    if (observer) {
      observer.observe(stageElement);
      if (tooltipRef.current) {
        observer.observe(tooltipRef.current);
      }
    } else {
      window.addEventListener("resize", computeGridCellSize);
    }

    return () => {
      cancelAnimationFrame(frame);
      if (observer) {
        observer.disconnect();
      } else {
        window.removeEventListener("resize", computeGridCellSize);
      }
    };
  }, [computeGridCellSize, visibleTile]);

  const setTooltipRef = useCallback(
    (node) => {
      tooltipRef.current = node;
      if (node) {
        requestAnimationFrame(computeGridCellSize);
      }
    },
    [computeGridCellSize],
  );

  return (
    <motion.section
      data-hero-enhanced="true"
      ref={heroRef}
      className="page-hero"
      aria-labelledby="hero-headline"
      tabIndex={-1}
      style={prefersReducedMotion ? undefined : { y }}
    >
      {heroInView ? <HeroBackground variant="default" /> : <HeroBackgroundPlaceholder />}
      <div className="page-hero__inner">
        <motion.div ref={contentRef} className="page-hero__content">
          <motion.span
            className="page-hero__eyebrow"
            initial="hidden"
            animate={contentInView ? "visible" : "hidden"}
            variants={eyebrowVariants}
          >
            <span className="page-hero__eyebrow-icon" aria-hidden="true">
              ✨
            </span>
            <span>The World's Premier Enterprise AI Marketplace</span>
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
            Deploy enterprise-grade AI automations that reshape how Fortune 500 companies operate. From conception to production in hours, not months. No custom code. No infrastructure headaches.
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
                boxShadow: "0 12px 32px rgba(139, 92, 246, 0.5)",
              }}
              whileTap={{ scale: 0.98 }}
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
            <TrustSignal>SOC2 Type II Certified</TrustSignal>
            <TrustSignal>GDPR & HIPAA Ready</TrustSignal>
            <TrustSignal>99.98% Uptime SLA</TrustSignal>
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
            <div className="preview-card__stage" ref={stageRef}>
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
                      <span className="preview-grid__icon-surface" aria-hidden="true">
                        <Icon
                          name={tile.icon}
                          size={28}
                          strokeWidth={1.8}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="preview-grid__icon"
                        />
                      </span>
                      <span className="sr-only">{tile.label}</span>
                    </motion.button>
                  );
                })}
              </div>
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={visibleTile.label}
                  className="preview-card__tooltip"
                  ref={setTooltipRef}
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
              "We deployed AI automations across 15 regions in 3 days. This saved us 6+ months of engineering time and cut operational costs by 35%."
              <span className="hero-quote__author">— Sarah Chen, Chief Operations Officer, Fortune 500 Tech</span>
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