import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";
import { useTheme } from "../context/ThemeContext";
import { motion, useAnimationControls } from "../lib/motion";

const MORPH_VALUES = [
  "M24 6c6.627 0 12 5.373 12 12s-5.373 12-12 12-12-5.373-12-12S17.373 6 24 6z",
  "M12 12c4-6 20-6 24 0s4 20-4 24-20 4-24-4-4-20 4-24z",
  "M24 6l14 8v16l-14 8-14-8V14l14-8z",
].join("; ");

function MorphingIcon() {
  return (
    <svg width="56" height="56" viewBox="0 0 48 48" aria-hidden="true">
      <defs>
        <linearGradient id="heroMorphGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(210, 92%, 65%)">
            <animate
              attributeName="stop-color"
              dur="12s"
              repeatCount="indefinite"
              values="hsl(210, 92%, 65%); hsl(260, 92%, 60%); hsl(210, 92%, 65%)"
            />
          </stop>
          <stop offset="100%" stopColor="hsl(270, 92%, 55%)">
            <animate
              attributeName="stop-color"
              dur="12s"
              repeatCount="indefinite"
              values="hsl(270, 92%, 55%); hsl(320, 92%, 60%); hsl(270, 92%, 55%)"
            />
          </stop>
        </linearGradient>
      </defs>
      <path fill="url(#heroMorphGradient)" d="M24 6c6.627 0 12 5.373 12 12s-5.373 12-12 12-12-5.373-12-12S17.373 6 24 6z">
        <animate attributeName="d" dur="12s" repeatCount="indefinite" values={MORPH_VALUES} keyTimes="0;0.5;1" />
      </path>
    </svg>
  );
}

export default function Hero() {
  const { darkMode } = useTheme();
  const magneticStrength = 1.2;
  const heroControls = useAnimationControls();
  const contentControls = useAnimationControls();
  const badgeControls = useAnimationControls();
  const heroRef = useRef(null);
  const glowState = useRef({
    x: 52,
    y: 42,
    intensity: 0.32,
  });
  const glowFrameRef = useRef(null);

  useEffect(() => {
    let rafId = requestAnimationFrame(async () => {
      await heroControls.start("visible");
      await contentControls.start("visible");
      badgeControls.start("visible");
    });
    return () => cancelAnimationFrame(rafId);
  }, [heroControls, contentControls, badgeControls]);

  const scheduleGlowUpdate = () => {
    if (glowFrameRef.current) return;
    glowFrameRef.current = requestAnimationFrame(() => {
      glowFrameRef.current = null;
      const element = heroRef.current;
      if (!element) return;
      const { x, y, intensity } = glowState.current;
      element.style.setProperty("--hero-glow-x", `${x.toFixed(2)}%`);
      element.style.setProperty("--hero-glow-y", `${y.toFixed(2)}%`);
      element.style.setProperty("--hero-glow-alpha", intensity.toFixed(3));
    });
  };

  const applyGlow = (x, y, intensity) => {
    const clampedX = Math.max(5, Math.min(95, x));
    const clampedY = Math.max(8, Math.min(92, y));
    const clampedIntensity = Math.max(0.18, Math.min(0.65, intensity));
    glowState.current = {
      x: clampedX,
      y: clampedY,
      intensity: clampedIntensity,
    };
    scheduleGlowUpdate();
  };

  useEffect(() => {
    applyGlow(52, 42, darkMode ? 0.36 : 0.32);
    return () => {
      if (glowFrameRef.current) {
        cancelAnimationFrame(glowFrameRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [darkMode]);

  const handlePointerMove = (event) => {
    const element = heroRef.current;
    if (!element) return;
    const rect = element.getBoundingClientRect();
    const relativeX = ((event.clientX - rect.left) / rect.width) * 100;
    const relativeY = ((event.clientY - rect.top) / rect.height) * 100;
    const intensityBoost = darkMode ? 0.6 : 0.55;
    applyGlow(relativeX, relativeY, intensityBoost);
  };

  const handlePointerLeave = () => {
    applyGlow(52, 42, darkMode ? 0.36 : 0.32);
  };

  const heroVariants = {
    hidden: { opacity: 0, y: 64 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { stiffness: 190, damping: 24 },
    },
  };

  const contentVariants = {
    hidden: { opacity: 0, y: 36 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { stiffness: 220, damping: 24 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 32 },
    visible: (index = 0) => ({
      opacity: 1,
      y: 0,
      transition: { stiffness: 230, damping: 24, delay: index * 0.08 },
    }),
  };

  const badgeVariants = {
    hidden: { opacity: 0, y: 28 },
    visible: (index = 0) => ({
      opacity: 1,
      y: 0,
      transition: { stiffness: 210, damping: 24, delay: 0.4 + index * 0.08 },
    }),
  };

  const scrollToMarketplace = () => {
    const el = document.getElementById("marketplace");
    if (!el) return;

    const header = document.querySelector(".site-header");
    const headerHeight = header ? header.offsetHeight : 80;
    const elementPosition = el.getBoundingClientRect().top + window.pageYOffset;
    const offsetPosition = elementPosition - headerHeight - 20;

    const startPosition = window.pageYOffset;
    const distance = offsetPosition - startPosition;
    const duration = 900;
    let start = null;

    const smoothScrollStep = (timestamp) => {
      if (!start) start = timestamp;
      const progress = timestamp - start;
      const progressPercentage = Math.min(progress / duration, 1);
      const ease =
        progressPercentage < 0.5
          ? 4 * progressPercentage * progressPercentage * progressPercentage
          : 1 - Math.pow(-2 * progressPercentage + 2, 3) / 2;

      window.scrollTo(0, startPosition + distance * ease);
      if (progress < duration) {
        requestAnimationFrame(smoothScrollStep);
      }
    };

    requestAnimationFrame(smoothScrollStep);
  };

  return (
    <motion.section
      ref={heroRef}
      className="hero"
      data-glass="true"
      variants={heroVariants}
      initial="hidden"
      animate={heroControls}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      <div className="hero-lights" aria-hidden="true">
        <div className="hero-light" />
        <div className="hero-light hero-light--accent" />
      </div>

      <motion.div
        className="hero-inner"
        variants={contentVariants}
        initial="hidden"
        animate={contentControls}
      >
        <motion.div
          className="hero-header"
          variants={itemVariants}
          initial="hidden"
          animate={contentControls}
          custom={0}
        >
          <span className="hero-pill">
            <span aria-hidden="true">✨</span>
            Interactive experiences engineered for trust
          </span>
          <ThemeToggle />
        </motion.div>

        <motion.div
          className="hero-text"
          variants={itemVariants}
          initial="hidden"
          animate={contentControls}
          custom={1}
        >
          <motion.h1 variants={itemVariants} initial="hidden" animate={contentControls} custom={0}>
            Deploy Enterprise AI Automations in Minutes
          </motion.h1>
          <motion.p variants={itemVariants} initial="hidden" animate={contentControls} custom={0.5}>
            Transform your business operations with battle-tested AI automations. Choose, configure, and deploy in under 10
            minutes. No complex workflows—just measurable outcomes.
          </motion.p>
          <div className="hero-ctas">
            <motion.button
              variants={itemVariants}
              custom={1}
              initial="hidden"
              animate={contentControls}
              className="btn btn-primary"
              onClick={scrollToMarketplace}
              data-magnetic="true"
              data-ripple="true"
              data-magnetic-strength={magneticStrength}
            >
              Explore Marketplace
              <span aria-hidden="true">→</span>
            </motion.button>
            <motion.span variants={itemVariants} initial="hidden" animate={contentControls} custom={1.2}>
              <Link
                to="/docs"
                className="btn btn-secondary"
                data-magnetic="true"
                data-ripple="true"
                data-magnetic-strength={magneticStrength * 0.65}
              >
                View Documentation
              </Link>
            </motion.span>
          </div>
        </motion.div>

        <motion.div
          className="hero-badges"
          variants={contentVariants}
          initial="hidden"
          animate={badgeControls}
        >
          {["⚡ Deploy in minutes", "🔒 Enterprise security", "📊 Transparent pricing", "🚀 Scale infinitely"].map(
            (label, index) => (
              <motion.span
                key={label}
                variants={badgeVariants}
                initial="hidden"
                animate={badgeControls}
                custom={index}
              >
                <MorphingIcon />
                {label}
              </motion.span>
            )
          )}
        </motion.div>
      </motion.div>
    </motion.section>
  );
}