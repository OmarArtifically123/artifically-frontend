"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

import AnimatedNumber from "../AnimatedNumber.jsx";
import AnimatedSection from "../AnimatedSection.jsx";
import { SPRING_CONFIGS } from "../../constants/animations.js";

const customerLogos = [
  "Mercury Labs",
  "Nova Retail",
  "Atlas Finance",
  "Helios Health",
  "Vantage Ops",
  "Artemis Cloud",
  "Northwind AI",
  "Titan Manufacturing",
  "Quantum Freight",
  "Evergreen CX",
];

const testimonials = [
  {
    id: "atlas",
    quote: "Our revops team finally has an automation stack they can trust. Deployment windows dropped from weeks to minutes.",
    name: "Jared Collins",
    title: "VP Revenue Operations",
    company: "Atlas Finance",
    roi: 5.1,
    timeSaved: 38,
  },
  {
    id: "nova",
    quote: "We replaced seven internal tools and automated global merchandising within a quarter.",
    name: "Mei Chen",
    title: "Director of Automation",
    company: "Nova Retail",
    roi: 4.4,
    timeSaved: 52,
  },
  {
    id: "helio",
    quote: "Compliance audits used to hijack entire sprints. Now the guardrails generate evidence for us while automations run.",
    name: "Priya Menon",
    title: "Chief Operating Officer",
    company: "Helios Health",
    roi: 6.2,
    timeSaved: 44,
  },
];

const logoContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const logoItemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
};

export default function SocialProofSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const isPausedRef = useRef(false);
  const autoplayRef = useRef();
  const { ref: logosRef, inView: logosVisible } = useInView({
    threshold: 0.8,
    triggerOnce: true,
  });

  const logoSkeletons = useMemo(() => Array.from({ length: customerLogos.length }), []);

  const total = testimonials.length;
  const activeTestimonial = useMemo(() => testimonials[activeIndex % total], [activeIndex, total]);
  const touchStateRef = useRef({ startX: 0, startY: 0, active: false, handled: false });
  const carouselRef = useRef(null);

  useEffect(() => {
    if (isPausedRef.current) {
      return undefined;
    }

    autoplayRef.current = setTimeout(() => {
      setActiveIndex((index) => (index + 1) % total);
    }, 7000);

    return () => clearTimeout(autoplayRef.current);
  }, [activeIndex, total]);

  const handleNavigate = useCallback(
    (direction) => {
      if (!isPausedRef.current && autoplayRef.current) {
        clearTimeout(autoplayRef.current);
      }
      setActiveIndex((index) => (index + direction + total) % total);
    },
    [total],
  );

  const pauseAutoplay = useCallback(() => {
    isPausedRef.current = true;
    if (autoplayRef.current) {
      clearTimeout(autoplayRef.current);
    }
  }, []);

  const resumeAutoplay = useCallback(() => {
    if (!isPausedRef.current) return;
    isPausedRef.current = false;
    autoplayRef.current = setTimeout(() => {
      setActiveIndex((index) => (index + 1) % total);
    }, 7000);
  }, [total]);

  const handleCarouselKeyDown = useCallback(
    (event) => {
      if (!carouselRef.current?.contains(event.target)) {
        return;
      }

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        pauseAutoplay();
        handleNavigate(-1);
        return;
      }

      if (event.key === "ArrowRight") {
        event.preventDefault();
        pauseAutoplay();
        handleNavigate(1);
        return;
      }

      if (event.key === "Home") {
        event.preventDefault();
        pauseAutoplay();
        setActiveIndex(0);
        return;
      }

      if (event.key === "End") {
        event.preventDefault();
        pauseAutoplay();
        setActiveIndex(total - 1);
        return;
      }

      if (event.key === "Escape") {
        event.preventDefault();
        pauseAutoplay();
        carouselRef.current?.focus({ preventScroll: true });
      }
    },
    [handleNavigate, pauseAutoplay, total],
  );

  const handleTouchStart = (event) => {
    const touch = event.touches[0];
    if (!touch) {
      return;
    }
    pauseAutoplay();
    touchStateRef.current = {
      startX: touch.clientX,
      startY: touch.clientY,
      active: true,
      handled: false,
    };
  };

  const handleTouchMove = (event) => {
    const state = touchStateRef.current;
    if (!state.active || state.handled) {
      return;
    }

    const touch = event.touches[0];
    if (!touch) {
      return;
    }

    const deltaX = touch.clientX - state.startX;
    const deltaY = touch.clientY - state.startY;

    if (Math.abs(deltaX) <= Math.abs(deltaY) || Math.abs(deltaX) < 24) {
      return;
    }

    event.preventDefault();
    state.handled = true;
    handleNavigate(deltaX > 0 ? -1 : 1);
  };

  const resetTouchState = () => {
    touchStateRef.current = { startX: 0, startY: 0, active: false, handled: false };
  };

  const handleTouchEnd = () => {
    resetTouchState();
    resumeAutoplay();
  };

  const handleTouchCancel = () => {
    resetTouchState();
    resumeAutoplay();
  };

  useEffect(() => () => clearTimeout(autoplayRef.current), []);

  return (
    <section className="section-shell" aria-labelledby="social-proof-title">
      <AnimatedSection>
        <header className="section-header">
          <span className="section-eyebrow">Trusted by Industry Leaders</span>
          <h2 id="social-proof-title" className="section-title">
            Join 12,500+ Companies
          </h2>
        </header>
      </AnimatedSection>
      <motion.ul
        ref={logosRef}
        className="logo-wall"
        role="list"
        aria-live={logosVisible ? "polite" : "off"}
        variants={logoContainerVariants}
        initial="hidden"
        animate={logosVisible ? "visible" : "hidden"}
      >
        {logosVisible
          ? customerLogos.map((logo) => (
              <motion.li
                key={logo}
                className="logo-wall__item"
                variants={logoItemVariants}
                whileHover={{
                  scale: 1.05,
                  transition: { type: "spring", ...SPRING_CONFIGS.slow },
                }}
              >
                {logo}
              </motion.li>
            ))
          : logoSkeletons.map((_, index) => (
              <li
                key={`logo-skeleton-${index}`}
                aria-hidden="true"
                className="logo-wall__item logo-wall__item--placeholder skeleton"
              >
                •
              </li>
            ))}
      </motion.ul>
      <div
        className="testimonial-carousel"
        onMouseEnter={pauseAutoplay}
        onMouseLeave={resumeAutoplay}
        onFocus={pauseAutoplay}
        onBlur={resumeAutoplay}
        onKeyDown={handleCarouselKeyDown}
        ref={carouselRef}
        role="region"
        aria-roledescription="carousel"
        aria-label="Customer testimonials"
        aria-describedby="testimonial-carousel-instructions"
        tabIndex={-1}
      >
        <p className="sr-only" id="testimonial-carousel-instructions">
          Use the left and right arrow keys to switch testimonials, Home to jump to the first story, End to move to the
          last story, and Escape to pause autoplay.
        </p>
        <div
          className="testimonial-carousel__slides"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onTouchCancel={handleTouchCancel}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.article
              key={activeTestimonial.id}
              className="testimonial-card"
              aria-live="polite"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -24 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <blockquote>“{activeTestimonial.quote}”</blockquote>
              <footer style={{ display: "flex", flexWrap: "wrap", gap: "0.85rem", alignItems: "center" }}>
                <div>
                  <strong style={{ color: "white" }}>{activeTestimonial.name}</strong>
                  <div style={{ fontSize: "0.95rem", color: "color-mix(in oklch, white 75%, var(--gray-300))" }}>
                    {activeTestimonial.title} at {activeTestimonial.company}
                  </div>
                </div>
              </footer>
              <div className="metric-grid">
                <Metric value={activeTestimonial.roi} suffix="x" label="ROI Increase" precision={1} />
                <Metric value={activeTestimonial.timeSaved} suffix=" hrs" label="Saved per Week" />
              </div>
            </motion.article>
          </AnimatePresence>
        </div>
        <div className="testimonial-carousel__controls" role="toolbar" aria-label="Testimonial carousel controls">
          <motion.button
            type="button"
            onClick={() => handleNavigate(-1)}
            aria-label="View previous testimonial"
            whileHover={{ scale: 1.1, transition: { type: "spring", ...SPRING_CONFIGS.fast } }}
            whileTap={{ scale: 0.95 }}
          >
            ←
          </motion.button>
          <span className="testimonial-carousel__index" aria-hidden="true">
            {activeIndex + 1} / {total}
          </span>
          <motion.button
            type="button"
            onClick={() => handleNavigate(1)}
            aria-label="View next testimonial"
            whileHover={{ scale: 1.1, transition: { type: "spring", ...SPRING_CONFIGS.fast } }}
            whileTap={{ scale: 0.95 }}
          >
            →
          </motion.button>
        </div>
      </div>
    </section>
  );
}

function Metric({ value, suffix = "", label, precision = 0 }) {
  return (
    <motion.div
      className="metric"
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      <strong>
        <AnimatedNumber value={value} suffix={suffix} precision={precision} />
      </strong>
      <span>{label}</span>
    </motion.div>
  );
}