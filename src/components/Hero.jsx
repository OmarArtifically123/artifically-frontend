import { useEffect, useRef, useState } from "react";
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
  const [hue, setHue] = useState(210);

  useEffect(() => {
    let rafId;
    const update = () => {
      setHue((current) => (current + 0.35) % 360);
      rafId = requestAnimationFrame(update);
    };
    rafId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <svg width="56" height="56" viewBox="0 0 48 48" aria-hidden="true">
      <defs>
        <linearGradient id="heroMorphGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={`hsla(${hue}, 92%, 65%, 0.95)`} />
          <stop offset="100%" stopColor={`hsla(${(hue + 60) % 360}, 92%, 55%, 0.85)`} />
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
  const [magneticStrength] = useState(1.2);
  const heroControls = useAnimationControls();
  const contentControls = useAnimationControls();
  const badgeControls = useAnimationControls();
  const heroRef = useRef(null);
  const glowState = useRef({
    x: 52,
    y: 42,
    intensity: 0.32,
    vx: 0,
    vy: 0,
    vi: 0,
    targetX: 52,
    targetY: 42,
    targetIntensity: 0.32,
  });

  useEffect(() => {
    let rafId = requestAnimationFrame(async () => {
      await heroControls.start("visible");
      await contentControls.start("visible");
      badgeControls.start("visible");
    });
    return () => cancelAnimationFrame(rafId);
  }, [heroControls, contentControls, badgeControls]);

  useEffect(() => {
    const state = glowState.current;
    const element = heroRef.current;
    if (element) {
      element.style.setProperty("--hero-glow-x", `${state.x}%`);
      element.style.setProperty("--hero-glow-y", `${state.y}%`);
      element.style.setProperty("--hero-glow-alpha", state.intensity.toFixed(3));
    }

    let frameId;
    let lastTime = typeof performance !== "undefined" ? performance.now() : 0;

    const step = (time) => {
      const dt = Math.min(0.032, (time - lastTime) / 1000 || 0.016);
      lastTime = time;
      const stiffness = 6.5;
      const damping = 5.2;

      const updateAxis = (value, velocity, target) => {
        const force = (target - value) * stiffness;
        const dampingForce = -velocity * damping;
        const acceleration = force + dampingForce;
        const nextVelocity = velocity + acceleration * dt;
        const nextValue = value + nextVelocity * dt;
        return [nextValue, nextVelocity];
      };

      [state.x, state.vx] = updateAxis(state.x, state.vx, state.targetX);
      [state.y, state.vy] = updateAxis(state.y, state.vy, state.targetY);
      [state.intensity, state.vi] = updateAxis(state.intensity, state.vi, state.targetIntensity);

      if (heroRef.current) {
        heroRef.current.style.setProperty("--hero-glow-x", `${state.x.toFixed(2)}%`);
        heroRef.current.style.setProperty("--hero-glow-y", `${state.y.toFixed(2)}%`);
        heroRef.current.style.setProperty("--hero-glow-alpha", state.intensity.toFixed(3));
      }

      frameId = requestAnimationFrame(step);
    };

    frameId = requestAnimationFrame(step);
    return () => {
      if (frameId) cancelAnimationFrame(frameId);
    };
  }, []);

  const setGlowTarget = (x, y, intensity) => {
    const state = glowState.current;
    state.targetX = Math.max(5, Math.min(95, x));
    state.targetY = Math.max(8, Math.min(92, y));
    state.targetIntensity = Math.max(0.18, Math.min(0.65, intensity));
  };

  useEffect(() => {
    const state = glowState.current;
    state.targetX = 52;
    state.targetY = 42;
    state.targetIntensity = darkMode ? 0.36 : 0.32;
  }, [darkMode]);

  const handlePointerMove = (event) => {
    const element = heroRef.current;
    if (!element) return;
    const rect = element.getBoundingClientRect();
    const relativeX = ((event.clientX - rect.left) / rect.width) * 100;
    const relativeY = ((event.clientY - rect.top) / rect.height) * 100;
    const intensityBoost = darkMode ? 0.6 : 0.55;
    setGlowTarget(relativeX, relativeY, intensityBoost);
  };

  const handlePointerLeave = () => {
    setGlowTarget(52, 42, 0.32);
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