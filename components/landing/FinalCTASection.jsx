"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import AnimatedSection from "../AnimatedSection.jsx";
import { ANIMATION_TIMINGS, SPRING_CONFIGS } from "../../constants/animations.js";
import CTABackground from "./CTABackground";
import { Icon } from "../icons";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

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
  const [email, setEmail] = useState("");
  const [formStatus, setFormStatus] = useState("idle");
  const [formError, setFormError] = useState("");
  const [formNotice, setFormNotice] = useState("");
  const errorSummaryRef = useRef(null);
  const emailInputRef = useRef(null);
  const noticeTimeoutRef = useRef(null);
  const emailFieldId = useId();
  const isLoading = formStatus === "loading";

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();
      if (isLoading) {
        return;
      }

      const trimmedEmail = email.trim();
      if (!trimmedEmail) {
        if (noticeTimeoutRef.current) clearTimeout(noticeTimeoutRef.current);
        setFormStatus("error");
        setFormError("Enter your work email address.");
        setFormNotice("");
        requestAnimationFrame(() => {
          errorSummaryRef.current?.focus();
        });
        return;
      }

      if (!EMAIL_PATTERN.test(trimmedEmail)) {
        if (noticeTimeoutRef.current) clearTimeout(noticeTimeoutRef.current);
        setFormStatus("error");
        setFormError("Enter a valid work email to start your trial.");
        setFormNotice("");
        requestAnimationFrame(() => {
          errorSummaryRef.current?.focus();
        });
        return;
      }

      setFormError("");
      setFormStatus("loading");
      setFormNotice("");
      if (noticeTimeoutRef.current) clearTimeout(noticeTimeoutRef.current);

      try {
        const maybePromise = onSubmit?.({ email: trimmedEmail });
        if (maybePromise && typeof maybePromise.then === "function") {
          await maybePromise;
        }
        setFormStatus("success");
        setFormNotice("Check your inbox—your trial invite is on its way.");
        setEmail("");
        noticeTimeoutRef.current = setTimeout(() => {
          setFormStatus("idle");
          setFormNotice("");
        }, 5000);
      } catch (error) {
        console.error(error);
        setFormStatus("error");
        setFormError("We couldn't start your trial right now. Please try again.");
        requestAnimationFrame(() => {
          errorSummaryRef.current?.focus();
        });
      }
    },
    [email, isLoading, onSubmit],
  );

  useEffect(() => {
    return () => {
      if (noticeTimeoutRef.current) {
        clearTimeout(noticeTimeoutRef.current);
      }
    };
  }, []);

  const summaryId = `${emailFieldId}-errors`;
  const errorId = `${emailFieldId}-error`;
  const noticeId = `${emailFieldId}-notice`;

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
            <form
              onSubmit={handleSubmit}
              noValidate
              style={{ display: "grid", gap: "0.75rem", width: "min(540px, 100%)" }}
            >
              {formError && (
                <div
                  id={summaryId}
                  ref={errorSummaryRef}
                  tabIndex={-1}
                  role="alert"
                  aria-live="assertive"
                  style={{
                    display: "grid",
                    gap: "0.5rem",
                    padding: "0.85rem 1rem",
                    borderRadius: "16px",
                    border: "1px solid rgba(248, 113, 113, 0.55)",
                    background: "rgba(127, 29, 29, 0.35)",
                    color: "#fecaca",
                  }}
                >
                  <strong>We need a valid work email.</strong>
                  <ul style={{ margin: 0, paddingLeft: "1.25rem", display: "grid", gap: "0.25rem" }}>
                    <li>
                      <button
                        type="button"
                        onClick={() => emailInputRef.current?.focus()}
                        style={{
                          background: "none",
                          border: "none",
                          padding: 0,
                          color: "#dbeafe",
                          textDecoration: "underline",
                          cursor: "pointer",
                          font: "inherit",
                        }}
                      >
                        Work email: {formError}
                      </button>
                    </li>
                  </ul>
                </div>
              )}
              <label htmlFor={emailFieldId} className="sr-only">
                Work email
              </label>
              <div className="cta-form">
                <input
                  id={emailFieldId}
                  name="email"
                  type="email"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    if (formError) {
                      setFormError("");
                      setFormStatus("idle");
                    }
                  }}
                  placeholder="Enter your work email"
                  aria-invalid={formError ? "true" : "false"}
                  aria-describedby={
                    [formError ? summaryId : null, formError ? errorId : null, formNotice ? noticeId : null]
                      .filter(Boolean)
                      .join(" ") || undefined
                  }
                  ref={emailInputRef}
                  required
                />
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
              </div>
              {formError && (
                <p
                  id={errorId}
                  role="alert"
                  aria-live="assertive"
                  style={{
                    margin: 0,
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    fontSize: "0.9rem",
                    color: "#fecaca",
                  }}
                >
                  <Icon name="alert" size={18} aria-hidden="true" />
                  {formError}
                </p>
              )}
            </form>
            {formNotice && (
              <p
                id={noticeId}
                role="status"
                aria-live="polite"
                style={{
                  marginTop: "0.5rem",
                  color: "#bef264",
                  fontSize: "0.95rem",
                }}
              >
                {formNotice}
              </p>
            )}
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