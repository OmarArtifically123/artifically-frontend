"use client";

import { useCallback, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import AnimatedSection from "../AnimatedSection.jsx";
import { ANIMATION_TIMINGS, SPRING_CONFIGS } from "../../constants/animations.js";
import CTABackground from "./CTABackground";
import { Icon } from "../icons";

function Spinner() {
  return (
    <span
      aria-hidden="true"
      style={{
        width: "1.5rem",
        height: "1.5rem",
        borderRadius: "50%",
        border: "3px solid rgba(255,255,255,0.4)",
        borderTopColor: "#fff",
        display: "inline-block",
        animation: "spin 0.8s linear infinite",
      }}
    />
  );
}

export default function FinalCTASection({ onSubmit }) {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();
      if (isLoading) {
        return;
      }

      const formData = new FormData(event.currentTarget);
      const email = formData.get("email");

      try {
        setIsLoading(true);
        const maybePromise = onSubmit?.({ email });
        if (maybePromise && typeof maybePromise.then === "function") {
          await maybePromise;
        }
      } finally {
        setTimeout(() => setIsLoading(false), ANIMATION_TIMINGS.normal);
      }
    },
    [isLoading, onSubmit],
  );

  return (
    <section className="section-shell" aria-labelledby="final-cta-title">
      <AnimatedSection>
        <article className="final-cta">
          <CTABackground variant="gradient-mesh" />
          <div className="final-cta__content">
            <h2 id="final-cta-title" className="final-cta__headline">
              Ready to Transform Your Operations?
            </h2>
            <p className="final-cta__subheadline">
              Join thousands of companies automating with Artifically.
            </p>
            <form className="cta-form" onSubmit={handleSubmit}>
              <label htmlFor="cta-email" className="sr-only">
                Work email
              </label>
              <input id="cta-email" name="email" type="email" placeholder="Enter your work email" required />
              <motion.button
                type="submit"
                className="cta-form__submit"
                animate={isLoading ? "loading" : "idle"}
                variants={{
                  idle: { width: "auto" },
                  loading: { width: "140px" },
                }}
                transition={{ duration: ANIMATION_TIMINGS.fast / 1000, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{
                  scale: 1.02,
                  boxShadow: "0 12px 32px rgba(99, 102, 241, 0.5)",
                  transition: { type: "spring", ...SPRING_CONFIGS.medium },
                }}
                whileTap={{ scale: 0.97 }}
                disabled={isLoading}
              >
                <AnimatePresence mode="wait" initial={false}>
                  {isLoading ? (
                    <motion.div
                      key="spinner"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: ANIMATION_TIMINGS.fast / 1000 }}
                      style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
                    >
                      <Spinner />
                    </motion.div>
                  ) : (
                    <motion.span
                      key="text"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: ANIMATION_TIMINGS.fast / 1000 }}
                    >
                      Start Free Trial
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            </form>
            <ul className="trust-signals" role="list">
              <li>
                <Icon name="check" size={18} aria-hidden="true" />
                <span>No credit card required</span>
              </li>
              <li>
                <Icon name="check" size={18} aria-hidden="true" />
                <span>Free for 14 days</span>
              </li>
              <li>
                <Icon name="check" size={18} aria-hidden="true" />
                <span>Cancel anytime</span>
              </li>
            </ul>
          </div>
        </article>
      </AnimatedSection>
    </section>
  );
}