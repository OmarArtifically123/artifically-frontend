import {
  Children,
  isValidElement,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { motion, useReducedMotion } from "framer-motion";
import MagneticButton from "./animation/MagneticButton";
import useMicroInteractions from "../hooks/useMicroInteractions";
import { BlurImage } from "./media/OptimizedImage";

const HERO_PREVIEW_IMAGE = "/images/hero-preview.jpg";
const HERO_PREVIEW_SOURCES = [
  { type: "image/avif", srcSet: "/images/hero-preview.avif" },
  { type: "image/webp", srcSet: "/images/hero-preview.webp" },
];
const HERO_PREVIEW_BLUR = "/images/hero-preview-blur.jpg";

let heroSceneModulePromise;

const loadHeroScene = async () => {
  if (!heroSceneModulePromise) {
    heroSceneModulePromise = import(
      /* webpackChunkName: "hero-scene" */ "./HeroScene.jsx",
    );
  }
  const module = await heroSceneModulePromise;
  return module?.default ?? module;
};

export default function Hero({ openAuth }) {
  const { dispatchInteraction } = useMicroInteractions();

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
      <div className="hero-shell">
        <div className="hero-content">
          <AnimatedEyebrow>🚀 The Future of AI Automation</AnimatedEyebrow>
          <AnimatedHeadline>
            Deploy Enterprise AI <span className="gradient-text">Automations</span> in Minutes
          </AnimatedHeadline>
          <AnimatedSubheadline>
            Transform your operations with battle-tested automations. No setup hell. No vendor lock-in. Just
            results.
          </AnimatedSubheadline>
          <HeroCTAGroup onPrimaryClick={handlePrimaryClick} onSecondaryClick={handleSecondaryClick} />
          <SocialProofStrip />
        </div>
        <FloatingProductPreview />
      </div>
      <ScrollIndicator />
    </section>
  );
}

function BackgroundCanvas() {
  const canvasRef = useRef(null);
  const prefersReducedMotion = usePrefersReducedMotion();

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
      gradient.addColorStop(0, "rgba(93, 47, 254, 0.28)");
      gradient.addColorStop(0.4, "rgba(62, 249, 197, 0.18)");
      gradient.addColorStop(0.8, "rgba(15, 23, 42, 0.85)");
      context.fillStyle = gradient;
      context.fillRect(0, 0, width, height);

      nodes.forEach((node) => {
        context.beginPath();
        context.arc(node.x * width, node.y * height, 2.5, 0, Math.PI * 2);
        context.fillStyle = "rgba(190, 243, 255, 0.75)";
        context.fill();
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
            context.strokeStyle = `rgba(125, 211, 252, ${alpha})`;
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
      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    window.addEventListener("resize", resize);
    canvas.addEventListener("pointermove", handlePointerMove);
    canvas.addEventListener("pointerleave", handlePointerLeave);

    return () => {
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("pointermove", handlePointerMove);
      canvas.removeEventListener("pointerleave", handlePointerLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, [prefersReducedMotion]);

  return <canvas ref={canvasRef} className="hero-background" aria-hidden="true" />;
}

function AnimatedEyebrow({ children }) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.span
      className="hero-eyebrow"
      initial={shouldReduceMotion ? undefined : { opacity: 0, y: -12 }}
      animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.33, 1, 0.68, 1] }}
    >
      {children}
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

function HeroCTAGroup({ onPrimaryClick, onSecondaryClick }) {
  const shouldReduceMotion = useReducedMotion();
  return (
    <motion.div
      className="hero-cta-group"
      initial={shouldReduceMotion ? undefined : { opacity: 0, y: 18 }}
      animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: shouldReduceMotion ? 0 : 0.75, ease: [0.33, 1, 0.68, 1] }}
    >
      <PrimaryCTA onClick={onPrimaryClick}>Start Free Trial</PrimaryCTA>
      <SecondaryCTA onClick={onSecondaryClick}>Watch Demo →</SecondaryCTA>
    </motion.div>
  );
}

function PrimaryCTA({ children, onClick }) {
  return (
    <MagneticButton type="button" className="hero-cta hero-cta--primary" variant="primary" onClick={onClick}>
      {children}
    </MagneticButton>
  );
}

function SecondaryCTA({ children, onClick }) {
  return (
    <MagneticButton type="button" className="hero-cta hero-cta--secondary" onClick={onClick}>
      {children}
    </MagneticButton>
  );
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
      <StatCounter end={12500} label="Automations Deployed" />
      <StatCounter end={98.6} decimals={1} suffix="%" label="Uptime" />
      <StatCounter end={4.8} decimals={1} suffix="x" label="Avg ROI" />
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

function FloatingProductPreview() {
  const containerRef = useRef(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  const [shouldRenderScene, setShouldRenderScene] = useState(false);
  const [SceneComponent, setSceneComponent] = useState(null);

  useEffect(() => {
    if (prefersReducedMotion) {
      return () => {};
    }

    const container = containerRef.current;
    if (!container) {
      setShouldRenderScene(true);
      return () => {};
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
      <div className="hero-preview__inner">
        {SceneComponent && !prefersReducedMotion ? (
          <SceneComponent width={960} height={540} />
        ) : (
          <BlurImage
            src={HERO_PREVIEW_IMAGE}
            blurDataURL={HERO_PREVIEW_BLUR}
            sources={HERO_PREVIEW_SOURCES}
            alt="Artifically automation workspace preview"
            className="hero-preview__fallback"
            loading="eager"
            decoding="sync"
            wrapperProps={{ "data-enhanced": "true" }}
          />
        )}
      </div>
    </div>
  );
}

function ScrollIndicator() {
  return (
    <div className="hero-scroll-indicator" aria-hidden="true">
      <span className="hero-scroll-indicator__track">
        <span className="hero-scroll-indicator__dot" />
      </span>
      <span className="hero-scroll-indicator__label">Scroll</span>
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