"use client";

import {
  Children,
  isValidElement,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import MagneticButton from "./animation/MagneticButton.jsx";
import useMicroInteractions from "../hooks/useMicroInteractions.js";
import { BlurImage } from "./media/OptimizedImage.js";
import ScrollIndicator from "./landing/ScrollIndicator.jsx";
import { useTheme } from "../context/ThemeContext.jsx";
import Button from "./ui/Button.js";
import Input from "./ui/Input.jsx";
import useDocumentVisibility from "../hooks/useDocumentVisibility";
import { Icon } from "./icons/index.js";

const HERO_PREVIEW_IMAGE = "/images/hero-preview.jpg";
const HERO_PREVIEW_DIMENSIONS = { width: 1920, height: 1080 };
const HERO_PREVIEW_SIZES = "(max-width: 768px) 92vw, (max-width: 1280px) 60vw, 540px";
const HERO_PREVIEW_SOURCES = [
  { type: "image/avif", srcSet: "/images/hero-preview.avif", sizes: HERO_PREVIEW_SIZES },
  { type: "image/webp", srcSet: "/images/hero-preview.webp", sizes: HERO_PREVIEW_SIZES },
];
const HERO_PREVIEW_BLUR = "/images/hero-preview-blur.jpg";

const HERO_CUSTOMER_LOGOS = [
  { name: "Northwind Retail", initials: "NR" },
  { name: "Acme Robotics", initials: "AR" },
  { name: "Aurora Health", initials: "AH" },
  { name: "Velocity Commerce", initials: "VC" },
  { name: "Nimbus Airlines", initials: "NA" },
  { name: "Atlas Finance", initials: "AF" },
  { name: "Zenith Manufacturing", initials: "ZM" },
  { name: "Skyline Media", initials: "SM" },
];

const LIVE_ACTIVITY_SOCKET_URL = process.env.NEXT_PUBLIC_ACTIVITY_SOCKET_URL;

let heroSceneModulePromise;

const loadHeroScene = async () => {
  if (!heroSceneModulePromise) {
    heroSceneModulePromise = import(
      /* webpackChunkName: "hero-scene" */ "./HeroScene.jsx",
    );
  }
  const heroSceneModule = await heroSceneModulePromise;
  return heroSceneModule?.default ?? heroSceneModule;
};

export default function Hero({ openAuth, user }) {
  const { dispatchInteraction } = useMicroInteractions();
  const messaging = usePersonalizedMessaging(user);
  const { available, total } = useSpotAvailability();

  const handlePrimaryClick = useCallback(
    (event) => {
      dispatchInteraction("cta-primary", { event });
      if (typeof openAuth === "function") {
        openAuth("signup");
        return;
      }
      if (typeof window !== "undefined") {
        window.location.href = "/signup";
      }
    },
    [dispatchInteraction, openAuth],
  );

  const handleSecondaryClick = useCallback(
    (event) => {
      dispatchInteraction("cta-secondary", { event });
      if (typeof window === "undefined") return;
      const preview = document.getElementById("product-preview");
      preview?.scrollIntoView({ behavior: "smooth", block: "center" });
    },
    [dispatchInteraction],
  );

  return (
    <section className="hero" data-animate-root data-hero-version="reimagined">
      <BackgroundCanvas />
      <StickyConversionBar />
      <ExitIntentModal />
      <div className="hero-shell">
        <div className="hero-content">
          <UrgencyBanner />
          <AnimatedEyebrow icon={messaging.eyebrow?.icon}>{messaging.eyebrow?.label}</AnimatedEyebrow>
          <AnimatedHeadline>{messaging.headline}</AnimatedHeadline>
          <AnimatedSubheadline>{messaging.subheadline}</AnimatedSubheadline>
          <HeroCTAGroup
            onPrimaryClick={handlePrimaryClick}
            onSecondaryClick={handleSecondaryClick}
            primaryLabel={messaging.cta}
          />
          <SpotIndicator available={available} total={total} />
          <SocialProofStrip />
          <LiveActivityFeed />
          <TrustBadges />
        </div>
      </div>
      <LogoWall logos={HERO_CUSTOMER_LOGOS}>
        <HeroSceneShowcase />
      </LogoWall>
      <ScrollIndicator />
    </section>
  );
}

function BackgroundCanvas() {
  const canvasRef = useRef(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  const { darkMode } = useTheme();
  const isDocumentVisible = useDocumentVisibility();
  const [isInViewport, setIsInViewport] = useState(false);

  const palette = useMemo(
    () =>
      darkMode
        ? {
            gradientStops: [
              { offset: 0, color: "rgba(104, 83, 255, 0.58)" },
              { offset: 0.32, color: "rgba(45, 212, 191, 0.28)" },
              { offset: 0.68, color: "rgba(14, 30, 58, 0.82)" },
              { offset: 0.92, color: "rgba(6, 12, 28, 0.96)" },
            ],
            nodeColor: "rgba(190, 243, 255, 0.8)",
            nodeShadow: "rgba(45, 212, 191, 0.35)",
            connectionColor: "77, 204, 255",
            backgroundOverlay: "rgba(15, 23, 42, 0.32)",
          }
        : {
            gradientStops: [
              { offset: 0, color: "rgba(187, 222, 255, 0.72)" },
              { offset: 0.38, color: "rgba(99, 102, 241, 0.22)" },
              { offset: 0.72, color: "rgba(226, 240, 255, 0.78)" },
              { offset: 1, color: "rgba(248, 252, 255, 0.96)" },
            ],
            nodeColor: "rgba(37, 99, 235, 0.45)",
            nodeShadow: "rgba(56, 189, 248, 0.28)",
            connectionColor: "37, 99, 235",
            backgroundOverlay: "rgba(221, 233, 255, 0.35)",
          },
    [darkMode],
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || typeof IntersectionObserver === "undefined") {
      setIsInViewport(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.target === canvas) {
            setIsInViewport(entry.isIntersecting);
          }
        });
      },
      { threshold: 0.1 },
    );

    observer.observe(canvas);

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const context = canvas.getContext("2d");
    if (!context) return undefined;

    const dpr = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;
    const nodeCount = 58;
    const nodes = Array.from({ length: nodeCount }, () => ({
      x: Math.random(),
      y: Math.random(),
      vx: (Math.random() - 0.5) * 0.0008,
      vy: (Math.random() - 0.5) * 0.0008,
    }));
    const pointer = { x: 0.5, y: 0.5, active: false };
    let animationFrameId;
    const shouldAnimate = isInViewport && isDocumentVisible && !prefersReducedMotion;

    const resize = () => {
      const { width, height } = canvas.getBoundingClientRect();
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();

    const handlePointerMove = (event) => {
      if (typeof window === "undefined") return;
      const rect = canvas.getBoundingClientRect();
      pointer.x = (event.clientX - rect.left) / rect.width;
      pointer.y = (event.clientY - rect.top) / rect.height;
      pointer.active = true;
    };

    const handlePointerLeave = () => {
      pointer.active = false;
    };

    const updateNodes = (delta) => {
      nodes.forEach((node) => {
        node.x += node.vx * delta;
        node.y += node.vy * delta;

        if (pointer.active) {
          const dx = pointer.x - node.x;
          const dy = pointer.y - node.y;
          const distance = Math.sqrt(dx * dx + dy * dy) + 0.0001;
          const force = Math.min(0.00045 / distance, 0.0025);
          node.vx += dx * force;
          node.vy += dy * force;
        }

        if (node.x < -0.05 || node.x > 1.05) node.vx *= -1;
        if (node.y < -0.05 || node.y > 1.05) node.vy *= -1;
        node.x = Math.min(Math.max(node.x, -0.1), 1.1);
        node.y = Math.min(Math.max(node.y, -0.1), 1.1);
      });
    };

    const draw = () => {
      const { width, height } = canvas;
      context.clearRect(0, 0, width, height);

      const gradient = context.createRadialGradient(
        width * 0.2,
        height * 0.2,
        width * 0.05,
        width * 0.5,
        height * 0.5,
        width * 0.9,
      );
      palette.gradientStops.forEach(({ offset, color }) => {
        gradient.addColorStop(offset, color);
      });
      context.fillStyle = gradient;
      context.fillRect(0, 0, width, height);

      context.fillStyle = palette.backgroundOverlay;
      context.fillRect(0, 0, width, height);

      nodes.forEach((node) => {
        context.beginPath();
        context.arc(node.x * width, node.y * height, 2.5, 0, Math.PI * 2);
        context.shadowColor = palette.nodeShadow;
        context.shadowBlur = darkMode ? 18 : 12;
        context.fillStyle = palette.nodeColor;
        context.fill();
        context.shadowBlur = 0;
      });

      for (let i = 0; i < nodes.length; i += 1) {
        for (let j = i + 1; j < nodes.length; j += 1) {
          const nodeA = nodes[i];
          const nodeB = nodes[j];
          const dx = nodeA.x - nodeB.x;
          const dy = nodeA.y - nodeB.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < 0.18) {
            const alpha = 0.35 - distance * 1.1;
            context.strokeStyle = `rgba(${palette.connectionColor}, ${alpha})`;
            context.lineWidth = 1;
            context.beginPath();
            context.moveTo(nodeA.x * width, nodeA.y * height);
            context.lineTo(nodeB.x * width, nodeB.y * height);
            context.stroke();
          }
        }
      }
    };

    let lastTime = performance.now();

    const render = (time) => {
      const delta = Math.min(time - lastTime, 32);
      lastTime = time;
      if (!prefersReducedMotion) {
        updateNodes(delta * 0.6);
      }
      draw();
      if (shouldAnimate) {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    if (shouldAnimate) {
      animationFrameId = requestAnimationFrame(render);
    } else {
      draw();
    }

    window.addEventListener("resize", resize);
    canvas.addEventListener("pointermove", handlePointerMove);
    canvas.addEventListener("pointerleave", handlePointerLeave);

    return () => {
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("pointermove", handlePointerMove);
      canvas.removeEventListener("pointerleave", handlePointerLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, [darkMode, isDocumentVisible, isInViewport, palette, prefersReducedMotion]);

  return <canvas ref={canvasRef} className="hero-background hero-bg-fixed" aria-hidden="true" />;
}

function AnimatedEyebrow({ children, icon }) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.span
      className="hero-eyebrow"
      initial={shouldReduceMotion ? undefined : { opacity: 0, y: -12 }}
      animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.33, 1, 0.68, 1] }}
    >
      {icon ? (
        <span className="hero-eyebrow__icon" aria-hidden="true">
          <Icon name={icon} size={16} />
        </span>
      ) : null}
      <span className="hero-eyebrow__text">{children}</span>
    </motion.span>
  );
}

function AnimatedHeadline({ children }) {
  const shouldReduceMotion = useReducedMotion();

  const tokens = useMemo(() => {
    const flattened = [];
    let index = 0;

    const pushWord = (word) => {
      if (!word) return;
      flattened.push({ key: `word-${index}`, content: word, type: "text" });
      index += 1;
    };

    Children.forEach(children, (child) => {
      if (typeof child === "string") {
        child
          .split(/\s+/)
          .map((word) => word.trim())
          .filter(Boolean)
          .forEach(pushWord);
      } else if (isValidElement(child)) {
        flattened.push({ key: `node-${index}`, content: child, type: "node" });
        index += 1;
      }
    });

    return flattened;
  }, [children]);

  return (
    <h1 className="hero-headline">
      {tokens.map((token, tokenIndex) => (
        <motion.span
          key={token.key}
          className="hero-headline__word"
          initial={shouldReduceMotion ? undefined : { opacity: 0, y: 28 }}
          animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{
            duration: 0.8,
            delay: shouldReduceMotion ? 0 : tokenIndex * 0.12,
            ease: [0.6, 0.05, 0.01, 0.9],
            type: "spring",
            stiffness: 120,
            damping: 18,
          }}
        >
          {token.type === "node" ? token.content : `${token.content}`}
        </motion.span>
      ))}
    </h1>
  );
}

function AnimatedSubheadline({ children }) {
  const shouldReduceMotion = useReducedMotion();
  return (
    <motion.p
      className="hero-subheadline"
      initial={shouldReduceMotion ? undefined : { opacity: 0, y: 24 }}
      animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: shouldReduceMotion ? 0 : 0.6, ease: [0.33, 1, 0.68, 1] }}
    >
      {children}
    </motion.p>
  );
}

function HeroCTAGroup({ onPrimaryClick, onSecondaryClick, primaryLabel }) {
  const shouldReduceMotion = useReducedMotion();
  const label = primaryLabel || "Get Started Free";
  return (
    <motion.div
      className="hero-cta-group"
      initial={shouldReduceMotion ? undefined : { opacity: 0, y: 18 }}
      animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: shouldReduceMotion ? 0 : 0.75, ease: [0.33, 1, 0.68, 1] }}
    >
      <CTAGroup>
        <PrimaryCTA icon={<SparklesIcon />} badge="Free Trial" onClick={onPrimaryClick}>
          {label}
          <CTASubtext>No credit card required</CTASubtext>
        </PrimaryCTA>
        <SecondaryCTA
          icon={<PlayCircleIcon />}
          badge={<LiveBadge>12.5K watching</LiveBadge>}
          onClick={onSecondaryClick}
        >
          Watch 2-Minute Demo
        </SecondaryCTA>
      </CTAGroup>
    </motion.div>
  );
}

function CTAGroup({ children }) {
  return <div className="cta-group">{children}</div>;
}

function PrimaryCTA({ children, onClick, icon, badge }) {
  const content = Children.toArray(children);
  const subtext = content.find((child) => isValidElement(child) && child.type === CTASubtext);
  const label = content.filter((child) => child !== subtext);
  return (
    <MagneticButton
      type="button"
      className="hero-cta hero-cta--primary"
      variant="primary"
      onClick={onClick}
    >
      {badge && <span className="hero-cta__badge hero-cta__badge--primary">{badge}</span>}
      <span className="hero-cta__inner">
        {icon && <span className="hero-cta__icon" aria-hidden="true">{icon}</span>}
        <span className="hero-cta__text">
          <span className="hero-cta__label">{label}</span>
          {subtext}
        </span>
      </span>
    </MagneticButton>
  );
}

function SecondaryCTA({ children, onClick, icon, badge }) {
  return (
    <MagneticButton type="button" className="hero-cta hero-cta--secondary" onClick={onClick}>
      {badge && <span className="hero-cta__badge hero-cta__badge--secondary">{badge}</span>}
      <span className="hero-cta__inner">
        {icon && <span className="hero-cta__icon" aria-hidden="true">{icon}</span>}
        <span className="hero-cta__label">{children}</span>
      </span>
    </MagneticButton>
  );
}

function CTASubtext({ children }) {
  return <span className="hero-cta__subtext">{children}</span>;
}

function LiveBadge({ children }) {
  return <span className="live-badge">{children}</span>;
}

function SocialProofStrip() {
  const shouldReduceMotion = useReducedMotion();
  return (
    <motion.div
      className="hero-social-proof"
      initial={shouldReduceMotion ? undefined : { opacity: 0, y: 18 }}
      animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: shouldReduceMotion ? 0 : 0.9, ease: [0.33, 1, 0.68, 1] }}
    >
      <div className="hero-social-proof__message">
        <span className="hero-social-proof__eyebrow">Trusted by operators everywhere</span>
        <p>Join the 12,500+ automation teams orchestrating mission-critical workflows with Artifically.</p>
      </div>
      <div className="hero-social-proof__stats">
        <StatCounter end={12500} label="Automations Deployed" />
        <StatCounter end={98.6} decimals={1} suffix="%" label="Uptime" />
        <StatCounter end={4.8} decimals={1} suffix="x" label="Avg ROI" />
      </div>
    </motion.div>
  );
}

function StatCounter({ end, label, suffix = "", decimals = 0 }) {
  const shouldReduceMotion = useReducedMotion();
  const [value, setValue] = useState(() => (shouldReduceMotion ? end : 0));

  useEffect(() => {
    if (shouldReduceMotion) {
      setValue(end);
      return;
    }

    let frameId;
    const duration = 1800;
    const start = performance.now();

    const step = (time) => {
      const progress = Math.min((time - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(end * eased);
      if (progress < 1) {
        frameId = requestAnimationFrame(step);
      }
    };

    frameId = requestAnimationFrame(step);

    return () => cancelAnimationFrame(frameId);
  }, [end, shouldReduceMotion]);

  const formatted = useMemo(() => {
    const minimumFractionDigits = decimals;
    const maximumFractionDigits = decimals;
    const base = value >= end ? end : value;
    return base.toLocaleString("en-US", { minimumFractionDigits, maximumFractionDigits });
  }, [decimals, end, value]);

  return (
    <div className="hero-stat">
      <span className="hero-stat__value">
        {formatted}
        {suffix}
      </span>
      <span className="hero-stat__label">{label}</span>
    </div>
  );
}

function StickyConversionBar() {
  const scrollY = useScrollPosition();
  const [visible, setVisible] = useState(false);
  const handleClick = useCallback(() => {
    if (typeof window !== "undefined" && typeof window.scrollTo === "function") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, []);

  useEffect(() => {
    const shouldShow = scrollY > 720 && scrollY < 3200;
    setVisible(shouldShow);
  }, [scrollY]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="sticky-conversion-bar"
          initial={{ y: -120, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -120, opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="conversion-message">Join 12,500+ teams automating with Artifically</span>
          <Button variant="primary" size="sm" onClick={handleClick}>
            Get Started Free
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function useScrollPosition() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") {
      return () => {};
    }

    const handleScroll = () => {
      setScrollY(window.scrollY || window.pageYOffset || 0);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return scrollY;
}

function ExitIntentModal() {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") {
      return () => {};
    }

    setMounted(true);

    const handleMouseLeave = (event) => {
      if (event.clientY <= 0) {
        const storage = window.sessionStorage;
        if (!storage.getItem("exit-intent-shown")) {
          setShow(true);
          storage.setItem("exit-intent-shown", "true");
        }
      }
    };

    document.addEventListener("mouseleave", handleMouseLeave);
    return () => document.removeEventListener("mouseleave", handleMouseLeave);
  }, []);

  const handleSubmit = useCallback(
    (event) => {
      event.preventDefault();
      if (!email) return;
      setSubmitted(true);
      setTimeout(() => {
        setShow(false);
        setEmail("");
        setSubmitted(false);
      }, 2400);
    },
    [email],
  );

  const handleClose = useCallback(() => {
    setShow(false);
    setEmail("");
    setSubmitted(false);
  }, []);

  if (typeof document === "undefined" || !mounted) {
    return null;
  }

  return createPortal(
    <AnimatePresence>
      {show && (
        <motion.div
          className="exit-intent-overlay"
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              handleClose();
            }
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="exit-intent-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="exit-intent-heading"
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.92, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <button className="exit-intent-close" type="button" onClick={handleClose} aria-label="Close exit modal">
              ×
            </button>
            <h2 id="exit-intent-heading">Wait! Before you go…</h2>
            <p className="exit-intent-copy">Unlock the automation playbook top operators use to scale revenue, ops, and CX.</p>
            {submitted ? (
              <motion.p className="exit-intent-success" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                Success! Check your inbox for the playbook.
              </motion.p>
            ) : (
              <form className="exit-intent-form" onSubmit={handleSubmit}>
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                />
                <Button type="submit" variant="primary" className="exit-intent-submit">
                  Send Me The Playbook
                </Button>
              </form>
            )}
            <TrustBadges />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

const OFFER_DEADLINE_STORAGE_KEY = "artifically-offer-deadline";

function UrgencyBanner() {
  const deadline = useMemo(() => {
    if (typeof window === "undefined") {
      return new Date(Date.now() + 1000 * 60 * 60 * 72);
    }
    const stored = window.localStorage.getItem(OFFER_DEADLINE_STORAGE_KEY);
    if (stored) {
      const parsed = Number.parseInt(stored, 10);
      if (!Number.isNaN(parsed) && parsed > Date.now()) {
        return new Date(parsed);
      }
    }
    const fallback = Date.now() + 1000 * 60 * 60 * 72;
    window.localStorage.setItem(OFFER_DEADLINE_STORAGE_KEY, `${fallback}`);
    return new Date(fallback);
  }, []);

  const [timeLeft, setTimeLeft] = useState(() => calculateTimeLeft(deadline));

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft(deadline));
    }, 1000);

    return () => clearInterval(interval);
  }, [deadline]);

  if (timeLeft.totalMilliseconds <= 0) {
    return null;
  }

  return (
    <motion.div
      className="urgency-banner"
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      <span className="urgency-icon" aria-hidden="true">
        <Icon name="flame" size={18} />
      </span>
      <span className="urgency-text">Early Bird Special: 50% off Enterprise plan ends in</span>
      <CountdownTimer time={timeLeft} />
    </motion.div>
  );
}

function CountdownTimer({ time }) {
  const segments = [
    { label: "Days", value: time.days },
    { label: "Hours", value: time.hours },
    { label: "Minutes", value: time.minutes },
    { label: "Seconds", value: time.seconds },
  ];

  return (
    <div className="countdown-timer" role="timer" aria-live="polite">
      {segments.map((segment) => (
        <div key={segment.label} className="countdown-segment">
          <span className="countdown-value">{String(segment.value).padStart(2, "0")}</span>
          <span className="countdown-label">{segment.label}</span>
        </div>
      ))}
    </div>
  );
}

function calculateTimeLeft(deadline) {
  const totalMilliseconds = Math.max(0, deadline.getTime() - Date.now());
  const totalSeconds = Math.floor(totalMilliseconds / 1000);
  const days = Math.floor(totalSeconds / (60 * 60 * 24));
  const hours = Math.floor((totalSeconds % (60 * 60 * 24)) / (60 * 60));
  const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);
  const seconds = totalSeconds % 60;

  return { days, hours, minutes, seconds, totalMilliseconds };
}

function SpotIndicator({ available, total }) {
  if (!total) return null;
  const percentage = Math.min(100, Math.max(0, (available / total) * 100));

  let fillColor = "#10b981";
  if (percentage < 20) {
    fillColor = "#ef4444";
  } else if (percentage < 50) {
    fillColor = "#f59e0b";
  }

  return (
    <div className="spot-indicator" role="status" aria-live="polite">
      <div className="spot-bar">
        <motion.div
          className="spot-fill"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          style={{ backgroundColor: fillColor }}
        />
      </div>
      <span className="spot-text">Only {available} spots left for this month</span>
    </div>
  );
}

function useSpotAvailability(total = 150, minimum = 6) {
  const [available, setAvailable] = useState(() => Math.max(minimum, Math.round(total * 0.18)));

  useEffect(() => {
    if (typeof window === "undefined") {
      return () => {};
    }

    const interval = window.setInterval(() => {
      setAvailable((prev) => {
        if (prev <= minimum) {
          return prev;
        }
        const next = prev - (Math.random() > 0.65 ? 1 : 0);
        return Math.max(minimum, next);
      });
    }, 22000);

    return () => window.clearInterval(interval);
  }, [minimum]);

  return { available, total };
}

const TRUST_BADGE_DATA = [
  { icon: "lock", label: "SOC 2 Type II Certified" },
  { icon: "shield", label: "GDPR Compliant" },
  { icon: "target", label: "99.99% Uptime SLA" },
  { icon: "zap", label: "Enterprise Support" },
  { icon: "trophy", label: "G2 Leader 2024" },
];

function TrustBadges() {
  return (
    <motion.div
      className="trust-badges"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
    >
      {TRUST_BADGE_DATA.map((badge, index) => (
        <motion.div
          key={badge.label}
          className="trust-badge"
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.08, duration: 0.3 }}
        >
          <span className="badge-icon" aria-hidden="true">
            <Icon name={badge.icon} size={18} />
          </span>
          <span className="badge-label">{badge.label}</span>
        </motion.div>
      ))}
    </motion.div>
  );
}

const MOCK_ACTIVITIES = [
  {
    id: "activity-1",
    user: { company: "Northwind Retail", avatar: null },
    automation: "Support Coach",
    timestamp: Date.now() - 1000 * 60 * 2,
  },
  {
    id: "activity-2",
    user: { company: "Acme Robotics", avatar: null },
    automation: "Ops Guardian",
    timestamp: Date.now() - 1000 * 60 * 8,
  },
  {
    id: "activity-3",
    user: { company: "Aurora Health", avatar: null },
    automation: "Finance Sentinel",
    timestamp: Date.now() - 1000 * 60 * 13,
  },
  {
    id: "activity-4",
    user: { company: "Velocity Commerce", avatar: null },
    automation: "Revenue Loop",
    timestamp: Date.now() - 1000 * 60 * 19,
  },
];

function LiveActivityFeed() {
  const [activities, setActivities] = useState(() =>
    MOCK_ACTIVITIES.slice(0, 3).map((activity) => ({ ...activity, id: `${activity.id}-${activity.timestamp}` })),
  );

  useEffect(() => {
    if (typeof window === "undefined") {
      return () => {};
    }

    let ws;
    let fallbackTimer;

    const pushActivity = (activity) => {
      setActivities((prev) => [activity, ...prev].slice(0, 3));
    };

    const startFallback = () => {
      if (!fallbackTimer) {
        pushActivity(generateMockActivity());
        fallbackTimer = window.setInterval(() => {
          pushActivity(generateMockActivity());
        }, 9000);
      }
    };

    if (typeof window.WebSocket !== "function") {
      startFallback();
      return () => {
        if (fallbackTimer) {
          window.clearInterval(fallbackTimer);
        }
      };
    }

    const socketUrl = typeof LIVE_ACTIVITY_SOCKET_URL === "string" ? LIVE_ACTIVITY_SOCKET_URL.trim() : "";
    const isSecureContext = window.location?.protocol === "https:";
    const isLocalHost = /(^localhost$)|(^127\.)|(\.local$)|(^0\.0\.0\.0$)/i.test(window.location?.hostname || "");

    if (!socketUrl || !isSecureContext || isLocalHost) {
      startFallback();
      return () => {
        if (fallbackTimer) {
          window.clearInterval(fallbackTimer);
        }
      };
    }

    try {
      ws = new WebSocket(socketUrl);
      ws.addEventListener("message", (event) => {
        try {
          const payload = JSON.parse(event.data);
          const activity = {
            id: payload.id || `activity-${payload.timestamp || Date.now()}`,
            user: payload.user ?? { company: "Automation Team", avatar: null },
            automation: payload.automation ?? "New automation",
            timestamp: payload.timestamp ?? Date.now(),
          };
          pushActivity(activity);
        } catch (error) {
          console.warn("Failed to parse live activity payload", error);
        }
      });
      ws.addEventListener("error", () => {
        startFallback();
        ws?.close();
      });
      ws.addEventListener("close", () => {
        startFallback();
      });
    } catch (error) {
      startFallback();
    }

    if (!ws || ws.readyState === WebSocket.CLOSED) {
      startFallback();
    }

    return () => {
      ws?.close();
      if (fallbackTimer) {
        window.clearInterval(fallbackTimer);
      }
    };
  }, []);

  if (!activities.length) {
    return null;
  }

  return (
    <div className="live-activity-feed" aria-live="polite">
      <AnimatePresence mode="popLayout">
        {activities.map((activity) => (
          <motion.div
            key={activity.id}
            className="activity-item"
            layout
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 24 }}
            transition={{ duration: 0.35, ease: [0.33, 1, 0.68, 1] }}
          >
            <Avatar company={activity.user.company} src={activity.user.avatar} />
            <div className="activity-item__copy">
              <strong>{activity.user.company}</strong> just deployed
              <span className="activity-item__highlight">{activity.automation}</span>
            </div>
            <TimeAgo timestamp={activity.timestamp} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

function generateMockActivity() {
  const seed = MOCK_ACTIVITIES[Math.floor(Math.random() * MOCK_ACTIVITIES.length)];
  return {
    ...seed,
    id: `${seed.id}-${Date.now()}-${Math.random().toString(16).slice(2, 6)}`,
    timestamp: Date.now() - Math.floor(Math.random() * 1000 * 60 * 20),
  };
}

function Avatar({ src, company }) {
  const initials = useMemo(() => {
    if (!company) return "";
    return company
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  }, [company]);

  return (
    <div className="activity-avatar" aria-hidden="true">
      {src ? <img src={src} alt="" /> : initials}
    </div>
  );
}

function TimeAgo({ timestamp }) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (typeof window === "undefined") {
      return () => {};
    }

    const interval = window.setInterval(() => {
      setNow(Date.now());
    }, 60000);

    return () => window.clearInterval(interval);
  }, []);

  const safeTimestamp = typeof timestamp === "number" ? timestamp : new Date(timestamp || Date.now()).getTime();
  const diffInSeconds = Math.max(0, Math.floor((now - safeTimestamp) / 1000));

  const { value, unit } = useMemo(() => {
    if (diffInSeconds < 60) {
      return { value: diffInSeconds, unit: "s" };
    }
    if (diffInSeconds < 3600) {
      return { value: Math.floor(diffInSeconds / 60), unit: "m" };
    }
    if (diffInSeconds < 86400) {
      return { value: Math.floor(diffInSeconds / 3600), unit: "h" };
    }
    return { value: Math.floor(diffInSeconds / 86400), unit: "d" };
  }, [diffInSeconds]);

  return <span className="activity-time">{`${value}${unit} ago`}</span>;
}

function LogoWall({ logos, children }) {
  if (!logos?.length && !children) {
    return null;
  }

  const marqueeLogos = logos ? [...logos, ...logos] : [];
  const hasScene = Boolean(children);

  return (
    <div className="logo-wall" data-with-scene={hasScene ? "true" : undefined} aria-hidden="true">
      {marqueeLogos.length > 0 && (
        <div className="logo-wall__marquee">
          <motion.div
            className="logo-track"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          >
            {marqueeLogos.map((logo, index) => (
              <div key={`${logo.name}-${index}`} className="logo-item">
                {logo.src ? (
                  <img src={logo.src} alt={logo.name} loading="lazy" />
                ) : (
                  <span>{logo.initials || logo.name}</span>
                )}
              </div>
            ))}
          </motion.div>
        </div>
      )}
      {hasScene && <div className="logo-wall__scene">{children}</div>}
    </div>
  );
}

const PERSONALIZED_COPY = {
  ecommerce: {
    eyebrow: { icon: "shoppingBag", label: "Ecommerce teams scaling faster" },
    headline: (
      <>
        Automate Your <span className="gradient-text">Ecommerce Operations</span>
      </>
    ),
    subheadline: "From inventory sync to customer service macros, orchestrate end-to-end commerce workflows with governance built in.",
    cta: "See Ecommerce Automations",
  },
  healthcare: {
    eyebrow: { icon: "hospital", label: "Built for regulated industries" },
    headline: (
      <>
        HIPAA-Compliant <span className="gradient-text">Healthcare Automation</span>
      </>
    ),
    subheadline: "Secure patient data flows that meet compliance standards while accelerating care coordination and intake.",
    cta: "Explore Healthcare Solutions",
  },
  finance: {
    eyebrow: { icon: "barChart", label: "Finance teams closing faster" },
    headline: (
      <>
        Automate Your <span className="gradient-text">Finance Ops</span> with Guardrails
      </>
    ),
    subheadline: "Detect anomalies across billing, ERP, and spend in minutes instead of days with explainable AI automations.",
    cta: "Review Finance Playbooks",
  },
  security: {
    eyebrow: { icon: "shield", label: "SOC 2, ISO, and beyond" },
    headline: (
      <>
        Ship <span className="gradient-text">Security Automations</span> with Confidence
      </>
    ),
    subheadline: "Close compliance gaps with continuous monitoring, policy reminders, and automated evidence collection.",
    cta: "Secure Your Stack",
  },
  revops: {
    eyebrow: { icon: "zap", label: "Revenue teams love fast loops" },
    headline: (
      <>
        Reclaim <span className="gradient-text">Revenue Velocity</span>
      </>
    ),
    subheadline: "Sync pipeline signals and trigger personalised outreach loops that revive stalled deals automatically.",
    cta: "See RevOps Recipes",
  },
  default: {
    eyebrow: { icon: "rocket", label: "The Future of AI Automation" },
    headline: (
      <>
        Deploy Enterprise AI <span className="gradient-text">Automations</span> in Minutes
      </>
    ),
    subheadline: "Transform your operations with battle-tested automations. No setup hell. No vendor lock-in. Just results.",
    cta: "Start Building Automations",
  },
};

function usePersonalizedMessaging(user) {
  const behavior = user?.behavior ?? {};

  return useMemo(() => {
    const industrySignal = (user?.industry ?? behavior.industry ?? "").toLowerCase();
    const roleSignal = (user?.role ?? behavior.role ?? "").toLowerCase();
    const sourceSignal = (user?.source ?? behavior.source ?? "").toLowerCase();

    const matchKey = Object.keys(PERSONALIZED_COPY)
      .filter((key) => key !== "default")
      .find((key) => {
        if (!key) return false;
        return [industrySignal, roleSignal].some((signal) => signal && signal.includes(key));
      });

    let message = (matchKey && PERSONALIZED_COPY[matchKey]) || PERSONALIZED_COPY.default;

    if (sourceSignal.includes("g2")) {
      message = {
        ...message,
        eyebrow: { icon: "star", label: "Loved by 1,000+ G2 reviewers" },
      };
    } else if (sourceSignal.includes("partner")) {
      message = {
        ...message,
        eyebrow: { icon: "handshake", label: "Welcome, partner recommendation" },
      };
    }

    return message;
  }, [behavior.industry, behavior.role, behavior.source, user?.industry, user?.role, user?.source]);
}

function SparklesIcon(props) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M10 2.5L11.12 6.38L15 7.5L11.12 8.62L10 12.5L8.88 8.62L5 7.5L8.88 6.38L10 2.5Z"
        fill="currentColor"
      />
      <path
        d="M4 11L4.66 13.34L7 14L4.66 14.66L4 17L3.34 14.66L1 14L3.34 13.34L4 11Z"
        fill="currentColor"
      />
      <path
        d="M16 9L16.5 10.5L18 11L16.5 11.5L16 13L15.5 11.5L14 11L15.5 10.5L16 9Z"
        fill="currentColor"
      />
    </svg>
  );
}

function PlayCircleIcon(props) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <circle cx="10" cy="10" r="8.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8.25 6.75L13 10L8.25 13.25V6.75Z" fill="currentColor" />
    </svg>
  );
}

function HeroSceneShowcase() {
  const containerRef = useRef(null);
  const innerRef = useRef(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  const [shouldRenderScene, setShouldRenderScene] = useState(false);
  const [SceneComponent, setSceneComponent] = useState(null);
  const [sceneDimensions, setSceneDimensions] = useState({ width: 1280, height: 720 });
  const { darkMode } = useTheme();

  useLayoutEffect(() => {
    if (typeof window === "undefined") {
      return () => {};
    }

    const target = innerRef.current;
    if (!target) {
      return () => {};
    }

    let animationFrame = null;
    const updateSize = (width, height) => {
      if (!Number.isFinite(width) || !Number.isFinite(height)) {
        return;
      }
      setSceneDimensions((previous) => {
        const nextWidth = Math.max(1, Math.round(width));
        const nextHeight = Math.max(1, Math.round(height));
        if (previous.width === nextWidth && previous.height === nextHeight) {
          return previous;
        }
        return { width: nextWidth, height: nextHeight };
      });
    };

    const measure = () => {
      animationFrame = null;
      const rect = target.getBoundingClientRect();
      updateSize(rect.width, rect.height);
    };

    const queueMeasure = () => {
      if (animationFrame !== null) {
        cancelAnimationFrame(animationFrame);
      }
      animationFrame = requestAnimationFrame(measure);
    };

    queueMeasure();

    let resizeObserver;

    if (typeof ResizeObserver === "function") {
      resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          if (entry.target !== target) {
            continue;
          }
          const { width, height } = entry.contentRect ?? {};
          if (width && height) {
            updateSize(width, height);
          } else {
            queueMeasure();
          }
        }
      });
      resizeObserver.observe(target);
    } else {
      window.addEventListener("resize", queueMeasure);
    }

    return () => {
      if (animationFrame !== null) {
        cancelAnimationFrame(animationFrame);
      }
      if (resizeObserver) {
        resizeObserver.disconnect();
      } else {
        window.removeEventListener("resize", queueMeasure);
      }
    };
  }, []);

  useEffect(() => {
    if (prefersReducedMotion) {
      return () => {};
    }

    const container = containerRef.current;
    if (!container) {
      setShouldRenderScene(true);
      return () => {};
      fetchPriority="high"
    }

    if (typeof IntersectionObserver !== "function") {
      setShouldRenderScene(true);
      return () => {};
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setShouldRenderScene(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.2,
        rootMargin: "0px 0px 240px 0px",
      },
    );

    observer.observe(container);

    return () => observer.disconnect();
  }, [prefersReducedMotion]);

  useEffect(() => {
    if (prefersReducedMotion || shouldRenderScene) {
      return () => {};
    }

    if (typeof window === "undefined") {
      setShouldRenderScene(true);
      return () => {};
    }

    let cancelled = false;

    const handleTrigger = () => {
      if (!cancelled) {
        setShouldRenderScene(true);
      }
    };

    if ("requestIdleCallback" in window) {
      const idleId = window.requestIdleCallback(handleTrigger, { timeout: 1200 });
      return () => {
        cancelled = true;
        if (typeof window.cancelIdleCallback === "function") {
          window.cancelIdleCallback(idleId);
        }
      };
    }

    const timeoutId = window.setTimeout(handleTrigger, 1200);

    return () => {
      cancelled = true;
      window.clearTimeout(timeoutId);
    };
  }, [prefersReducedMotion, shouldRenderScene]);
  
  useEffect(() => {
    if (!shouldRenderScene || prefersReducedMotion) {
      return;
    }

    let cancelled = false;
    loadHeroScene()
      .then((Component) => {
        if (!cancelled) {
          setSceneComponent(() => Component);
        }
      })
      .catch((error) => {
        console.error("Failed to load hero scene", error);
      });

    return () => {
      cancelled = true;
    };
  }, [prefersReducedMotion, shouldRenderScene]);

  return (
    <div className="hero-preview" id="product-preview" ref={containerRef} aria-hidden="true">
      <div
        className="hero-preview__inner"
        ref={innerRef}
        data-theme-variant={darkMode ? "dark" : "light"}
      >
        {SceneComponent && !prefersReducedMotion ? (
          <SceneComponent width={sceneDimensions.width} height={sceneDimensions.height} />
        ) : (
          <HeroFallbackIllustration darkMode={darkMode} />
        )}
      </div>
    </div>
  );
}

function HeroFallbackIllustration({ darkMode }) {
  return (
    <div className="hero-fallback" data-theme-variant={darkMode ? "dark" : "light"}>
      <BlurImage
        src={HERO_PREVIEW_IMAGE}
        blurDataURL={HERO_PREVIEW_BLUR}
        sources={HERO_PREVIEW_SOURCES}
        alt="Artifically automation workspace preview"
        className="hero-fallback__image"
        loading="eager"
        decoding="sync"
        fetchPriority="high"
        width={HERO_PREVIEW_DIMENSIONS.width}
        height={HERO_PREVIEW_DIMENSIONS.height}
        sizes={HERO_PREVIEW_SIZES}
        wrapperProps={{
          "data-enhanced": "true",
          className: "hero-fallback__media hero-preview__fallback",
        }}
      />
      <div className="hero-fallback__overlay">
        <div className="hero-fallback__card">
          <span className="hero-fallback__icon hero-fallback__icon--primary" aria-hidden="true">
            <Icon name="robot" size={22} />
          </span>
          <div className="hero-fallback__card-copy">
            <span className="hero-fallback__card-title">Realtime orchestrations</span>
            <span className="hero-fallback__card-subtitle">3D preview paused for performance</span>
          </div>
        </div>
        <div className="hero-fallback__chips">
          <span className="hero-fallback__chip">
            <Icon name="brain" size={14} /> AI routing
          </span>
          <span className="hero-fallback__chip">
            <Icon name="sparkles" size={14} /> Auto-tuned responses
          </span>
          <span className="hero-fallback__chip">
            <Icon name="globe" size={14} /> Global resilience
          </span>
        </div>
      </div>
    </div>
  );
}

function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
      return false;
    }
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });

  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
      return () => {};
    }

    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setPrefersReducedMotion(query.matches);
    update();

    const add = query.addEventListener?.bind(query) ?? query.addListener?.bind(query);
    const remove = query.removeEventListener?.bind(query) ?? query.removeListener?.bind(query);
    add?.("change", update);

    return () => {
      remove?.("change", update);
    };
  }, []);

  return prefersReducedMotion;
}