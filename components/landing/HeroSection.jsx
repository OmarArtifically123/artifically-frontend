import { useEffect, useMemo, useRef, useState } from "react";
import {
  animate,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
} from "framer-motion";
import useDocumentVisibility from "../../hooks/useDocumentVisibility";
import useInViewState from "../../hooks/useInViewState";
import motionCatalog from "../../design/motion/catalog";
import HeroBackground from "./HeroBackground";
import ProductPreview3D from "./ProductPreview3D";
import ScrollIndicator from "./ScrollIndicator";
import HeroRoiCalculator from "./HeroRoiCalculator";
import {
  HERO_PREVIEW_DIMENSIONS,
  HERO_PREVIEW_IMAGE,
  HERO_PREVIEW_SIZES,
  HERO_PREVIEW_SOURCES,
} from "./heroPreviewAssets";
import { Icon } from "../icons";

const heroStats = [
  { label: "Automations", value: 12500, suffix: "+" },
  { label: "Uptime", value: 98.6, suffix: "%" },
  { label: "ROI", value: 4.8, suffix: "x" },
];

const defaultLogos = [
  "Northwind", "Aurora", "Nimbus", "Atlas", "Velocity", "Zenith", "Skyline", "Lumen",
];

export default function HeroSection({ onPrimary, onSecondary, demoDialogId, demoOpen }) {
  const gradientId = useMemo(() => `heroGradient-${Math.random().toString(36).slice(2)}`, []);
  const [primaryLabel, setPrimaryLabel] = useState("Start Free Trial");
  const [secondaryLabel, setSecondaryLabel] = useState("Watch Demo");
  const [ctaContext, setCtaContext] = useState("");
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

  const heroContentVariants = useMemo(() => {
    const hidden = { opacity: 0 };
    if (!prefersReducedMotion) {
      hidden.y = 24;
    }
    const visible = {
      opacity: 1,
      y: 0,
      transition: {
        duration: motionCatalog.durations.medium,
        ease: motionCatalog.easings.out,
        delayChildren: motionCatalog.durations.micro,
        staggerChildren: motionCatalog.durations.stagger,
      },
    };
    if (prefersReducedMotion) {
      delete visible.y;
    }
    return { hidden, visible };
  }, [prefersReducedMotion]);

  const heroItemVariants = useMemo(() => {
    const hidden = { opacity: 0 };
    if (!prefersReducedMotion) {
      hidden.y = 16;
    }
    const visible = {
      opacity: 1,
      y: 0,
      transition: {
        duration: motionCatalog.durations.short,
        ease: motionCatalog.easings.out,
      },
    };
    if (prefersReducedMotion) {
      delete visible.y;
    }
    return { hidden, visible };
  }, [prefersReducedMotion]);

  const previewVariants = useMemo(() => {
    const hidden = { opacity: 0 };
    if (!prefersReducedMotion) {
      hidden.y = 20;
    }
    const visible = {
      opacity: 1,
      y: 0,
      transition: {
        duration: motionCatalog.durations.long,
        ease: motionCatalog.easings.out,
      },
    };
    if (prefersReducedMotion) {
      delete visible.y;
    }
    return { hidden, visible };
  }, [prefersReducedMotion]);

  return (
    <section className="page-hero" aria-labelledby="hero-headline">
      <HeroBackground variant="particles" />
      <div className="page-hero__inner">
        <motion.div
          ref={contentRef}
          className="page-hero__content"
          initial="hidden"
          animate={contentInView ? "visible" : "hidden"}
          variants={heroContentVariants}
        >
          <motion.span className="page-hero__eyebrow" variants={heroItemVariants}>
            <Icon name="zap" size={18} aria-hidden="true" />
            <span>The Future of AI Automation</span>
          </motion.span>
          <motion.h1 id="hero-headline" className="page-hero__headline" variants={heroItemVariants}>
            Deploy Enterprise AI <GradientText>Automations</GradientText> in Minutes
          </motion.h1>
          <motion.p className="page-hero__subheadline" variants={heroItemVariants}>
            Transform operations with battle-tested automations. No setup hell. No vendor lock-in. Just results.
          </motion.p>
          <motion.div className="cta-group" variants={heroItemVariants}>
            <button type="button" className="cta-primary" onClick={onPrimary}>
              {primaryLabel}
            </button>
            <button
              type="button"
              className="cta-secondary"
              onClick={onSecondary}
              aria-haspopup="dialog"
              aria-controls={demoDialogId || undefined}
              aria-expanded={typeof demoOpen === "boolean" ? (demoOpen ? "true" : "false") : undefined}
            >
              {secondaryLabel} → <VideoBadge duration="2 min" />
            </button>
          </motion.div>
          {ctaContext ? (
            <motion.p className="hero-cta-context" variants={heroItemVariants}>
              {ctaContext}
            </motion.p>
          ) : null}
          <HeroStats
            stats={heroStats}
            prefersReducedMotion={prefersReducedMotion}
            initialInView={initialHeroInView}
          />
          <LogoTicker
            logos={defaultLogos}
            gradientId={gradientId}
            prefersReducedMotion={prefersReducedMotion}
            initialInView={initialHeroInView}
          />
        </motion.div>
        <div className="page-hero__preview" id="product-preview">
          <motion.article
            ref={previewRef}
            className="preview-card"
            initial="hidden"
            animate={previewInView ? "visible" : "hidden"}
            variants={previewVariants}
          >
            <span className="preview-card__chip">Live product preview</span>
            <div className="preview-card__stage">
              <picture className="hero-preview__fallback" data-enhanced="true" aria-hidden="true">
                {HERO_PREVIEW_SOURCES.map((source) => (
                  <source key={source.type} {...source} />
                ))}
                <img
                  src={HERO_PREVIEW_IMAGE}
                  width={HERO_PREVIEW_DIMENSIONS.width}
                  height={HERO_PREVIEW_DIMENSIONS.height}
                  alt=""
                  loading="eager"
                  decoding="sync"
                  fetchPriority="high"
                  sizes={HERO_PREVIEW_SIZES}
                />
              </picture>
              <ProductPreview3D label="3D preview of automation workflow" />
            </div>
            <p className="preview-card__annotation hero-quote">
              "We launched our global support automation in under 2 hours. Artifically handled auth, routing, and reporting out of the box."
              <span className="hero-quote__author">— Elena Ruiz, VP Operations</span>
            </p>
          </motion.article>
        </div>
      </div>
      <div className="page-hero__roi">
        <HeroRoiCalculator />
      </div>
      <ScrollIndicator targetId="problem-solution" />
    </section>
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
          inView={statsInView}
          {...stat}
        />
      ))}
    </motion.div>
  );
}

function StatCounter({ value, suffix = "", label, index, prefersReducedMotion, inView }) {
  const valueMotion = useMotionValue(prefersReducedMotion ? value : 0);
  const [display, setDisplay] = useState(valueMotion.get());
  const isDocumentVisible = useDocumentVisibility();
  const hasAnimatedRef = useRef(false);

  useMotionValueEvent(valueMotion, "change", (latest) => {
    setDisplay(latest);
  });

  useEffect(() => {
    if (prefersReducedMotion) {
      valueMotion.set(value);
      setDisplay(value);
      return;
    }

    if (!inView || !isDocumentVisible) {
      if (!hasAnimatedRef.current) {
        valueMotion.set(0);
        setDisplay(0);
      }
      return;
    }

    hasAnimatedRef.current = true;
    const controls = animate(valueMotion, value, {
      duration: motionCatalog.durations.long,
      ease: motionCatalog.easings.out,
    });

    return () => controls.stop();
  }, [prefersReducedMotion, inView, isDocumentVisible, value, valueMotion]);

  const formatted = useMemo(() => {
    const currentValue = prefersReducedMotion ? value : display;
    if (value >= 1000) {
      return `${Math.round(currentValue).toLocaleString()}${suffix}`;
    }
    const decimals = Number.isInteger(value) ? 0 : 1;
    return `${Number(currentValue).toFixed(decimals)}${suffix}`;
  }, [display, suffix, value, prefersReducedMotion]);

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

  return (
    <motion.div className="hero-stat" variants={itemVariants}>
      <span className="hero-stat__value">{formatted}</span>
      <span className="hero-stat__label">{label}</span>
    </motion.div>
  );
}

function LogoTicker({ logos, gradientId, prefersReducedMotion, initialInView }) {
  const [tickerRef, tickerInView] = useInViewState({ threshold: 0.2, once: true, initialInView });

  const tickerVariants = useMemo(() => {
    const hidden = { opacity: 0 };
    if (!prefersReducedMotion) {
      hidden.y = 16;
    }
    const visible = {
      opacity: 1,
      y: 0,
      transition: {
        duration: motionCatalog.durations.medium,
        ease: motionCatalog.easings.out,
      },
    };
    if (prefersReducedMotion) {
      delete visible.y;
    }
    return { hidden, visible };
  }, [prefersReducedMotion]);

  return (
    <motion.div
      ref={tickerRef}
      aria-label="Trusted by leading teams"
      className="trusted-by"
      initial="hidden"
      animate={tickerInView ? "visible" : "hidden"}
      variants={tickerVariants}
    >
      <span className="trusted-by__eyebrow">Trusted by teams shipping AI in production</span>
      <div className="trusted-by__logos">
        {logos.map((logo) => (
          <span key={logo} className="trusted-by__logo">
            {logo}
          </span>
        ))}
      </div>
      <svg width="0" height="0" className="trusted-by__gradient-defs" aria-hidden="true">
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="var(--brand-glow)" />
          <stop offset="100%" stopColor="var(--brand-energy)" />
        </linearGradient>
      </svg>
    </motion.div>
  );
}

function VideoBadge({ duration }) {
  return (
    <span className="video-badge">
      <span aria-hidden="true" className="video-badge__icon">
        ▶
      </span>
      {duration}
    </span>
  );
}

function GradientText({ children }) {
  return <span className="gradient-text">{children}</span>;
}