"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { useInView } from "react-intersection-observer";
import { BrandMark } from "./brand/BrandLogo";

// Icon components - using lucide-react pattern
import {
  Twitter,
  Linkedin,
  Github,
  Youtube,
  Shield,
  Globe,
  FileText,
  CheckCircle2,
  TrendingUp,
  Sparkles,
} from "lucide-react";

const productLinks = [
  { label: "Marketplace", href: "/marketplace" },
  { label: "Pricing", href: "/pricing" },
  { label: "Enterprise", href: "/enterprise" },
  { label: "Automations", href: "/marketplace?category=automations" },
  { label: "Integrations", href: "/integrations" },
];

const companyLinks = [
  { label: "About Us", href: "/about" },
  { label: "Blog", href: "/blog" },
  { label: "Press Kit", href: "/press" },
  { label: "Contact", href: "/contact" },
];

const resourceLinks = [
  { label: "Documentation", href: "/docs" },
  { label: "API Reference", href: "/api" },
  { label: "Help Center", href: "/help" },
  { label: "Status", href: "/status" },
  { label: "Changelog", href: "/changelog" },
];

const legalLinks = [
  { label: "Terms of Service", href: "/terms" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Security", href: "/security" },
  { label: "Compliance", href: "/compliance" },
  { label: "DPA", href: "/dpa" },
];

const regionalLinks = [
  { label: "Middle East", href: "/middle-east" },
  { label: "North America", href: "/north-america" },
  { label: "Europe", href: "/europe" },
];

const socialLinks = [
  {
    label: "X (Twitter)",
    href: "https://twitter.com/artifically",
    icon: Twitter,
    ariaLabel: "Follow Artifically on X (opens in new window)",
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com/company/artifically",
    icon: Linkedin,
    ariaLabel: "Follow Artifically on LinkedIn (opens in new window)",
  },
  {
    label: "GitHub",
    href: "https://github.com/artifically",
    icon: Github,
    ariaLabel: "View Artifically on GitHub (opens in new window)",
  },
  {
    label: "YouTube",
    href: "https://youtube.com/@artifically",
    icon: Youtube,
    ariaLabel: "Subscribe to Artifically on YouTube (opens in new window)",
  },
];

const trustBadges = [
  { id: "soc2", label: "SOC 2 Type II", icon: Shield },
  { id: "iso", label: "ISO 27001", icon: CheckCircle2 },
  { id: "gdpr", label: "GDPR", icon: FileText },
  { id: "hipaa", label: "HIPAA Ready", icon: Shield },
  { id: "saudi", label: "Saudi PDPL", icon: Globe },
  { id: "uae", label: "UAE DPA", icon: Globe },
];

const footerStats = [
  { value: "12.4K", label: "Automations Deployed", icon: TrendingUp },
  { value: "3.2K", label: "Companies Served", icon: Sparkles },
  { value: "99.9%", label: "Uptime", icon: CheckCircle2 },
];

export default function Footer() {
  const [email, setEmail] = useState("");
  const [formStatus, setFormStatus] = useState("");
  const [formMessage, setFormMessage] = useState("");
  const [emailError, setEmailError] = useState("");
  const messageTimeoutRef = useRef(null);
  const errorSummaryRef = useRef(null);
  const emailInputRef = useRef(null);
  const emailId = useId();

  const handleNewsletterSubmit = async (event) => {
    event.preventDefault();
    const trimmedEmail = email.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

    if (!trimmedEmail) {
      setEmailError("Enter your work email address.");
      setFormStatus("");
      setFormMessage("");
      if (messageTimeoutRef.current) clearTimeout(messageTimeoutRef.current);
      requestAnimationFrame(() => {
        errorSummaryRef.current?.focus();
      });
      return;
    }

    if (!emailPattern.test(trimmedEmail)) {
      setEmailError("Enter a valid work email to join the digest.");
      setFormStatus("");
      setFormMessage("");
      if (messageTimeoutRef.current) clearTimeout(messageTimeoutRef.current);
      requestAnimationFrame(() => {
        errorSummaryRef.current?.focus();
      });
      return;
    }

    setEmailError("");
    setFormStatus("loading");
    setFormMessage("Subscribing you to curated updates…");
    try {
      await new Promise((resolve) => setTimeout(resolve, 1100));
      setFormStatus("success");
      setFormMessage("Thanks for subscribing! Check your inbox to confirm.");
      setEmail("");
      if (messageTimeoutRef.current) clearTimeout(messageTimeoutRef.current);
      messageTimeoutRef.current = setTimeout(() => {
        setFormStatus("");
        setFormMessage("");
      }, 4200);
    } catch (error) {
      console.error(error);
      setFormStatus("");
      setFormMessage("");
      setEmailError("We couldn't save that email. Please try again.");
      if (messageTimeoutRef.current) clearTimeout(messageTimeoutRef.current);
      requestAnimationFrame(() => {
        errorSummaryRef.current?.focus();
      });
    }
  };

  useEffect(() => {
    return () => {
      if (messageTimeoutRef.current) {
        clearTimeout(messageTimeoutRef.current);
      }
    };
  }, []);

  const inputClassName = `footer-newsletter-input${
    emailError ? " has-error" : ""
  }${formStatus === "success" ? " has-success" : ""}`;
  const summaryId = `${emailId}-errors`;
  const errorId = `${emailId}-error`;
  const messageId = `${emailId}-message`;
  const messageStateClass =
    formStatus === "loading" || formStatus === "success" ? ` ${formStatus}` : "";

  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true });

  return (
    <footer
      ref={ref}
      className="footer-world-class"
      role="contentinfo"
      data-animate="true"
      aria-busy={!inView}
    >
      {inView ? (
        <>
          {/* Animated gradient background overlay */}
          <div className="footer-gradient-mesh" aria-hidden="true">
            <div className="footer-gradient-orb footer-gradient-orb-1"></div>
            <div className="footer-gradient-orb footer-gradient-orb-2"></div>
            <div className="footer-gradient-orb footer-gradient-orb-3"></div>
          </div>

          {/* Edge-lit top border */}
          <div className="footer-edge-lit" aria-hidden="true"></div>

          <div className="footer-container">
            {/* Top section: Brand + Newsletter */}
            <div className="footer-top-section">
              <div className="footer-brand-area">
                <Link href="/" aria-label="Artifically home" className="footer-brand-link">
                  <BrandMark
                    interactive={false}
                    className="footer-brand-mark"
                    style={{ width: 48, height: 48 }}
                  />
                </Link>
                <h2 className="footer-brand-tagline">
                  Enterprise AI Automation Infrastructure
                </h2>
                <p className="footer-brand-description">
                  Deploy production-ready AI automations in hours, not months. Trusted by 3,200+ companies across North America, Europe, and the Middle East.
                </p>

                {/* Trust Stats */}
                <div className="footer-stats-grid" aria-label="Platform performance metrics">
                  {footerStats.map(({ value, label, icon: Icon }) => (
                    <div key={label} className="footer-stat-card">
                      <Icon className="footer-stat-icon" size={20} strokeWidth={2} aria-hidden="true" />
                      <div className="footer-stat-content">
                        <div className="footer-stat-value">{value}</div>
                        <div className="footer-stat-label">{label}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="footer-newsletter-area">
                <h3 className="footer-newsletter-heading">Stay Ahead of AI Automation</h3>
                <p className="footer-newsletter-description">
                  Join 10,000+ operators receiving curated insights on AI automation trends, case studies, and product updates.
                </p>

                <form className="footer-newsletter-form" onSubmit={handleNewsletterSubmit} noValidate>
                  {emailError && (
                    <div
                      id={summaryId}
                      ref={errorSummaryRef}
                      tabIndex={-1}
                      role="alert"
                      aria-live="assertive"
                      className="footer-newsletter-error-summary"
                    >
                      <strong>We couldn't add your email yet.</strong>
                      <ul>
                        <li>
                          <button type="button" onClick={() => emailInputRef.current?.focus()}>
                            Work email: {emailError}
                          </button>
                        </li>
                      </ul>
                    </div>
                  )}

                  <label className="sr-only" htmlFor={emailId}>
                    Work email
                  </label>

                  <div className="footer-newsletter-field-row">
                    <input
                      id={emailId}
                      type="email"
                      value={email}
                      onChange={(event) => {
                        setEmail(event.target.value);
                        if (emailError) {
                          setEmailError("");
                        }
                      }}
                      placeholder="Enter your work email"
                      className={inputClassName}
                      aria-invalid={emailError ? "true" : "false"}
                      aria-describedby={[emailError ? summaryId : null, emailError ? errorId : null, messageId]
                        .filter(Boolean)
                        .join(" ") || undefined}
                      disabled={formStatus === "loading"}
                      required
                      ref={emailInputRef}
                    />
                    <button
                      type="submit"
                      className="footer-newsletter-button"
                      disabled={formStatus === "loading"}
                    >
                      {formStatus === "loading" ? "Joining…" : "Join Newsletter"}
                    </button>
                  </div>

                  {emailError && (
                    <p id={errorId} role="alert" aria-live="assertive" className="footer-newsletter-inline-error">
                      {emailError}
                    </p>
                  )}
                </form>

                <div
                  id={messageId}
                  className={`footer-newsletter-message${messageStateClass}`}
                  role="status"
                  aria-live="polite"
                >
                  {formMessage || "We send curated insights twice a month. Unsubscribe anytime."}
                </div>

                {/* Social Links */}
                <div className="footer-social-links">
                  {socialLinks.map(({ label, href, icon: Icon, ariaLabel }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="footer-social-link"
                      aria-label={ariaLabel}
                    >
                      <Icon size={20} strokeWidth={1.8} aria-hidden="true" />
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Navigation Grid */}
            <div className="footer-nav-grid">
              <nav className="footer-nav-column" aria-label="Product">
                <h4 className="footer-nav-heading">Product</h4>
                <ul className="footer-nav-list">
                  {productLinks.map(({ label, href }) => (
                    <li key={label}>
                      <Link href={href} className="footer-nav-link">
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>

              <nav className="footer-nav-column" aria-label="Company">
                <h4 className="footer-nav-heading">Company</h4>
                <ul className="footer-nav-list">
                  {companyLinks.map(({ label, href }) => (
                    <li key={label}>
                      <Link href={href} className="footer-nav-link">
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>

              <nav className="footer-nav-column" aria-label="Resources">
                <h4 className="footer-nav-heading">Resources</h4>
                <ul className="footer-nav-list">
                  {resourceLinks.map(({ label, href }) => (
                    <li key={label}>
                      <Link href={href} className="footer-nav-link">
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>

              <nav className="footer-nav-column" aria-label="Legal">
                <h4 className="footer-nav-heading">Legal</h4>
                <ul className="footer-nav-list">
                  {legalLinks.map(({ label, href }) => (
                    <li key={label}>
                      <Link href={href} className="footer-nav-link">
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>

              <nav className="footer-nav-column" aria-label="Regions">
                <h4 className="footer-nav-heading">Regions</h4>
                <ul className="footer-nav-list">
                  {regionalLinks.map(({ label, href }) => (
                    <li key={label}>
                      <Link href={href} className="footer-nav-link">
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>

            {/* Trust Badges */}
            <div className="footer-trust-section">
              <h3 className="footer-trust-heading">Enterprise-Grade Security & Compliance</h3>
              <div className="footer-trust-badges">
                {trustBadges.map(({ id, label, icon: Icon }) => (
                  <div key={id} className="footer-trust-badge">
                    <Icon className="footer-trust-badge-icon" size={18} strokeWidth={2} aria-hidden="true" />
                    <span className="footer-trust-badge-label">{label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Bar */}
            <div className="footer-bottom-bar">
              <div className="footer-bottom-left">
                <p className="footer-copyright">
                  © {new Date().getFullYear()} Artifically. All rights reserved.
                </p>
              </div>
              <div className="footer-bottom-right">
                <Link href="/status" className="footer-status-link">
                  <span className="footer-status-indicator" aria-hidden="true"></span>
                  <span>All Systems Operational</span>
                </Link>
              </div>
            </div>
          </div>
        </>
      ) : (
        <FooterSkeleton />
      )}

      <style jsx>{`
        /* ============================================================
           WORLD-CLASS FOOTER - UNIQUE VISUAL IDENTITY
           ============================================================ */

        .footer-world-class {
          position: relative;
          background: var(--footer-bg-base, #0a0a0f);
          color: var(--footer-text, rgba(255, 255, 255, 0.95));
          padding: 120px 0 0;
          overflow: hidden;
          border-top: 1px solid var(--footer-edge, rgba(139, 92, 246, 0.2));
        }

        /* ============================================================
           ANIMATED GRADIENT MESH BACKGROUND (Linear-style)
           ============================================================ */

        .footer-gradient-mesh {
          position: absolute;
          inset: 0;
          overflow: hidden;
          z-index: 0;
          opacity: var(--footer-mesh-opacity, 0.4);
          pointer-events: none;
        }

        .footer-gradient-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(120px);
          opacity: 0.6;
          will-change: transform;
        }

        .footer-gradient-orb-1 {
          width: 600px;
          height: 600px;
          background: radial-gradient(circle, oklch(0.65 0.32 264 / 0.5), transparent 70%);
          top: -300px;
          left: -200px;
          animation: float-orb-1 20s ease-in-out infinite;
        }

        .footer-gradient-orb-2 {
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, oklch(0.75 0.28 192 / 0.4), transparent 70%);
          bottom: -200px;
          right: 10%;
          animation: float-orb-2 25s ease-in-out infinite;
        }

        .footer-gradient-orb-3 {
          width: 400px;
          height: 400px;
          background: radial-gradient(circle, oklch(0.70 0.26 330 / 0.3), transparent 70%);
          top: 40%;
          right: -150px;
          animation: float-orb-3 30s ease-in-out infinite;
        }

        @keyframes float-orb-1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(50px, -30px) scale(1.1); }
          66% { transform: translate(-30px, 40px) scale(0.9); }
        }

        @keyframes float-orb-2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(-40px, 50px) scale(0.95); }
          66% { transform: translate(60px, -20px) scale(1.05); }
        }

        @keyframes float-orb-3 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-50px, 30px) scale(1.1); }
        }

        /* ============================================================
           EDGE-LIT TOP BORDER (Vercel-style)
           ============================================================ */

        .footer-edge-lit {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(
            90deg,
            transparent 0%,
            oklch(0.65 0.32 264 / 0.6) 20%,
            oklch(0.75 0.28 192 / 0.8) 50%,
            oklch(0.65 0.32 264 / 0.6) 80%,
            transparent 100%
          );
          animation: edge-glow 8s ease-in-out infinite;
          z-index: 1;
        }

        @keyframes edge-glow {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }

        /* ============================================================
           CONTAINER & LAYOUT
           ============================================================ */

        .footer-container {
          position: relative;
          z-index: 1;
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 40px 40px;
        }

        /* ============================================================
           TOP SECTION - BRAND + NEWSLETTER
           ============================================================ */

        .footer-top-section {
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          gap: 80px;
          margin-bottom: 80px;
          padding-bottom: 80px;
          border-bottom: 1px solid var(--footer-divider, rgba(255, 255, 255, 0.08));
        }

        /* Brand Area */
        .footer-brand-area {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .footer-brand-link {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 56px;
          height: 56px;
          border-radius: 16px;
          background: var(--footer-brand-bg, rgba(139, 92, 246, 0.08));
          border: 1px solid var(--footer-brand-border, rgba(139, 92, 246, 0.2));
          transition: background 300ms cubic-bezier(0.4, 0, 0.2, 1),
            border-color 300ms cubic-bezier(0.4, 0, 0.2, 1);
        }

        .footer-brand-link:hover {
          background: rgba(139, 92, 246, 0.15);
          border-color: rgba(139, 92, 246, 0.4);
        }

        .footer-brand-link:focus-visible {
          outline: 3px solid var(--accent-primary);
          outline-offset: 4px;
          border-radius: 16px;
        }

        .footer-brand-tagline {
          font-size: 20px;
          font-weight: 600;
          line-height: 1.4;
          color: var(--footer-heading, #ffffff);
          margin: 0;
          letter-spacing: -0.02em;
        }

        .footer-brand-description {
          font-size: 15px;
          line-height: 1.6;
          color: var(--footer-description, rgba(255, 255, 255, 0.7));
          margin: 0;
          max-width: 540px;
        }

        /* Stats Grid */
        .footer-stats-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
          margin-top: 8px;
        }

        .footer-stat-card {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px;
          background: var(--footer-stat-bg, rgba(255, 255, 255, 0.03));
          border: 1px solid var(--footer-stat-border, rgba(255, 255, 255, 0.08));
          border-radius: 12px;
          transition: all 300ms cubic-bezier(0.4, 0, 0.2, 1);
        }

        .footer-stat-card:hover {
          background: rgba(255, 255, 255, 0.05);
          border-color: rgba(139, 92, 246, 0.3);
          transform: translateY(-2px);
        }

        .footer-stat-icon {
          color: var(--accent-primary);
          flex-shrink: 0;
        }

        .footer-stat-content {
          display: flex;
          flex-direction: column;
          gap: 2px;
          min-width: 0;
        }

        .footer-stat-value {
          font-size: 18px;
          font-weight: 700;
          color: var(--footer-stat-value, #ffffff);
          line-height: 1.2;
          letter-spacing: -0.02em;
        }

        .footer-stat-label {
          font-size: 12px;
          color: var(--footer-stat-label, rgba(255, 255, 255, 0.6));
          line-height: 1.3;
        }

        /* Newsletter Area */
        .footer-newsletter-area {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .footer-newsletter-heading {
          font-size: 24px;
          font-weight: 700;
          line-height: 1.3;
          color: var(--footer-heading, #ffffff);
          margin: 0;
          letter-spacing: -0.03em;
        }

        .footer-newsletter-description {
          font-size: 14px;
          line-height: 1.6;
          color: var(--footer-description, rgba(255, 255, 255, 0.7));
          margin: 0;
        }

        .footer-newsletter-form {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .footer-newsletter-field-row {
          display: flex;
          gap: 12px;
        }

        .footer-newsletter-input {
          flex: 1;
          height: 52px;
          padding: 0 20px;
          background: var(--footer-input-bg, rgba(255, 255, 255, 0.05));
          border: 1.5px solid var(--footer-input-border, rgba(255, 255, 255, 0.15));
          border-radius: 12px;
          font-size: 15px;
          color: var(--footer-input-text, #ffffff);
          transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
        }

        .footer-newsletter-input::placeholder {
          color: rgba(255, 255, 255, 0.4);
        }

        .footer-newsletter-input:hover {
          border-color: rgba(255, 255, 255, 0.25);
        }

        .footer-newsletter-input:focus {
          outline: none;
          border-color: var(--accent-primary);
          box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.15);
          background: rgba(255, 255, 255, 0.08);
        }

        .footer-newsletter-input.has-error {
          border-color: var(--accent-error);
          box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.15);
        }

        .footer-newsletter-input.has-success {
          border-color: var(--accent-success);
        }

        .footer-newsletter-button {
          height: 52px;
          padding: 0 32px;
          background: linear-gradient(135deg, oklch(0.65 0.32 264), oklch(0.70 0.32 264));
          border: none;
          border-radius: 12px;
          font-size: 15px;
          font-weight: 600;
          color: #ffffff;
          cursor: pointer;
          white-space: nowrap;
          transition: all 300ms cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
        }

        .footer-newsletter-button:hover:enabled {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(139, 92, 246, 0.4);
        }

        .footer-newsletter-button:active:enabled {
          transform: translateY(0);
        }

        .footer-newsletter-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .footer-newsletter-button:focus-visible {
          outline: 3px solid var(--accent-primary);
          outline-offset: 3px;
        }

        .footer-newsletter-error-summary {
          padding: 16px;
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.3);
          border-radius: 10px;
          color: #fca5a5;
        }

        .footer-newsletter-error-summary strong {
          display: block;
          margin-bottom: 8px;
          font-weight: 600;
        }

        .footer-newsletter-error-summary ul {
          margin: 0;
          padding-left: 20px;
        }

        .footer-newsletter-error-summary button {
          background: none;
          border: none;
          color: #bae6fd;
          text-decoration: underline;
          cursor: pointer;
          padding: 0;
          font: inherit;
        }

        .footer-newsletter-inline-error {
          font-size: 13px;
          color: #fca5a5;
        }

        .footer-newsletter-message {
          font-size: 13px;
          color: var(--footer-message, rgba(255, 255, 255, 0.5));
          min-height: 18px;
        }

        .footer-newsletter-message.success {
          color: var(--accent-success);
        }

        .footer-newsletter-message.loading {
          color: var(--accent-primary);
        }

        /* Social Links */
        .footer-social-links {
          display: flex;
          gap: 12px;
          margin-top: 8px;
        }

        .footer-social-link {
          display: flex;
          align-items: center;
          justify-content: center;
          min-width: 48px;
          min-height: 48px;
          width: 48px;
          height: 48px;
          border-radius: 12px;
          background: var(--footer-social-bg, rgba(255, 255, 255, 0.05));
          border: 1px solid var(--footer-social-border, rgba(255, 255, 255, 0.1));
          color: var(--footer-social-icon, rgba(255, 255, 255, 0.7));
          transition: all 300ms cubic-bezier(0.4, 0, 0.2, 1);
        }

        .footer-social-link:hover {
          background: rgba(139, 92, 246, 0.15);
          border-color: rgba(139, 92, 246, 0.4);
          color: #ffffff;
          transform: translateY(-3px);
          box-shadow: 0 8px 16px rgba(139, 92, 246, 0.2);
        }

        .footer-social-link:focus-visible {
          outline: 3px solid var(--accent-primary);
          outline-offset: 3px;
        }

        /* ============================================================
           NAVIGATION GRID
           ============================================================ */

        .footer-nav-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 48px;
          margin-bottom: 80px;
        }

        .footer-nav-column {
          display: flex;
          flex-direction: column;
          gap: 20px;
          min-width: 0;
        }

        .footer-nav-heading {
          font-size: 13px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--footer-nav-heading, rgba(255, 255, 255, 0.5));
          margin: 0;
        }

        .footer-nav-list {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .footer-nav-link {
          display: inline-block;
          font-size: 15px;
          font-weight: 500;
          color: var(--footer-nav-link, rgba(255, 255, 255, 0.8));
          text-decoration: none;
          transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          padding-left: 0;
        }

        .footer-nav-link::before {
          content: '';
          position: absolute;
          left: -16px;
          top: 50%;
          transform: translateY(-50%);
          width: 8px;
          height: 1.5px;
          background: var(--accent-primary);
          opacity: 0;
          transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
        }

        .footer-nav-link:hover {
          color: #ffffff;
          padding-left: 16px;
        }

        .footer-nav-link:hover::before {
          opacity: 1;
        }

        .footer-nav-link:focus-visible {
          outline: 3px solid var(--accent-primary);
          outline-offset: 3px;
          border-radius: 4px;
        }

        /* ============================================================
           TRUST SECTION
           ============================================================ */

        .footer-trust-section {
          margin-bottom: 60px;
          padding: 40px;
          background: var(--footer-trust-bg, rgba(255, 255, 255, 0.02));
          border: 1px solid var(--footer-trust-border, rgba(255, 255, 255, 0.08));
          border-radius: 20px;
        }

        .footer-trust-heading {
          font-size: 14px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: var(--footer-trust-heading, rgba(255, 255, 255, 0.6));
          margin: 0 0 24px;
        }

        .footer-trust-badges {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
          gap: 16px;
        }

        .footer-trust-badge {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 14px 18px;
          background: var(--footer-badge-bg, rgba(255, 255, 255, 0.03));
          border: 1px solid var(--footer-badge-border, rgba(255, 255, 255, 0.1));
          border-radius: 10px;
          transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
        }

        .footer-trust-badge:hover {
          background: rgba(255, 255, 255, 0.05);
          border-color: rgba(139, 92, 246, 0.3);
        }

        .footer-trust-badge-icon {
          color: var(--accent-primary);
          flex-shrink: 0;
        }

        .footer-trust-badge-label {
          font-size: 13px;
          font-weight: 600;
          color: var(--footer-badge-label, rgba(255, 255, 255, 0.8));
          white-space: nowrap;
        }

        /* ============================================================
           BOTTOM BAR
           ============================================================ */

        .footer-bottom-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 32px;
          border-top: 1px solid var(--footer-divider, rgba(255, 255, 255, 0.08));
          gap: 24px;
          flex-wrap: wrap;
        }

        .footer-copyright {
          font-size: 14px;
          color: var(--footer-copyright, rgba(255, 255, 255, 0.5));
          margin: 0;
        }

        .footer-status-link {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          font-weight: 500;
          color: var(--footer-status, rgba(255, 255, 255, 0.7));
          text-decoration: none;
          transition: color 200ms cubic-bezier(0.4, 0, 0.2, 1);
        }

        .footer-status-link:hover {
          color: var(--accent-success);
        }

        .footer-status-link:focus-visible {
          outline: 3px solid var(--accent-primary);
          outline-offset: 3px;
          border-radius: 4px;
        }

        .footer-status-indicator {
          display: block;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--accent-success);
          box-shadow: 0 0 8px var(--accent-success);
          animation: pulse-status 2s ease-in-out infinite;
        }

        @keyframes pulse-status {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        /* ============================================================
           SCREEN READER ONLY
           ============================================================ */

        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border: 0;
        }

        /* ============================================================
           LIGHT THEME
           ============================================================ */

        :global([data-theme="light"]) .footer-world-class {
          --footer-bg-base: #ffffff;
          --footer-text: rgba(15, 23, 42, 0.95);
          --footer-edge: rgba(31, 126, 255, 0.2);
          --footer-mesh-opacity: 0.15;
          --footer-heading: #0f172a;
          --footer-description: rgba(15, 23, 42, 0.7);
          --footer-divider: rgba(15, 23, 42, 0.1);
          --footer-brand-bg: rgba(31, 126, 255, 0.08);
          --footer-brand-border: rgba(31, 126, 255, 0.2);
          --footer-stat-bg: rgba(15, 23, 42, 0.03);
          --footer-stat-border: rgba(15, 23, 42, 0.1);
          --footer-stat-value: #0f172a;
          --footer-stat-label: rgba(15, 23, 42, 0.6);
          --footer-input-bg: rgba(15, 23, 42, 0.03);
          --footer-input-border: rgba(15, 23, 42, 0.2);
          --footer-input-text: #0f172a;
          --footer-social-bg: rgba(15, 23, 42, 0.05);
          --footer-social-border: rgba(15, 23, 42, 0.1);
          --footer-social-icon: rgba(15, 23, 42, 0.7);
          --footer-nav-heading: rgba(15, 23, 42, 0.5);
          --footer-nav-link: rgba(15, 23, 42, 0.8);
          --footer-trust-bg: rgba(15, 23, 42, 0.02);
          --footer-trust-border: rgba(15, 23, 42, 0.1);
          --footer-trust-heading: rgba(15, 23, 42, 0.6);
          --footer-badge-bg: rgba(15, 23, 42, 0.03);
          --footer-badge-border: rgba(15, 23, 42, 0.15);
          --footer-badge-label: rgba(15, 23, 42, 0.9);
          --footer-copyright: rgba(15, 23, 42, 0.5);
          --footer-status: rgba(15, 23, 42, 0.7);
          --footer-message: rgba(15, 23, 42, 0.5);
        }

        /* ============================================================
           CONTRAST THEME
           ============================================================ */

        :global([data-theme="contrast"]) .footer-world-class {
          --footer-bg-base: #000000;
          --footer-text: #ffffff;
          --footer-edge: #00eaff;
          --footer-mesh-opacity: 0;
          --footer-heading: #ffffff;
          --footer-description: #ffffff;
          --footer-divider: #ffffff;
          --footer-brand-bg: transparent;
          --footer-brand-border: #00eaff;
          --footer-stat-bg: transparent;
          --footer-stat-border: #ffffff;
          --footer-stat-value: #ffffff;
          --footer-stat-label: #ffffff;
          --footer-input-bg: #000000;
          --footer-input-border: #ffffff;
          --footer-input-text: #ffffff;
          --footer-social-bg: transparent;
          --footer-social-border: #ffffff;
          --footer-social-icon: #ffffff;
          --footer-nav-heading: #ffffff;
          --footer-nav-link: #ffffff;
          --footer-trust-bg: transparent;
          --footer-trust-border: #ffffff;
          --footer-trust-heading: #ffffff;
          --footer-badge-bg: transparent;
          --footer-badge-border: #ffffff;
          --footer-badge-label: #ffffff;
          --footer-copyright: #ffffff;
          --footer-status: #ffffff;
          --footer-message: #ffffff;
          border-top: 2px solid #00eaff;
        }

        :global([data-theme="contrast"]) .footer-gradient-mesh {
          display: none;
        }

        :global([data-theme="contrast"]) .footer-edge-lit {
          display: none;
        }

        :global([data-theme="contrast"]) .footer-stat-card,
        :global([data-theme="contrast"]) .footer-trust-badge,
        :global([data-theme="contrast"]) .footer-social-link,
        :global([data-theme="contrast"]) .footer-trust-section {
          border-width: 2px;
        }

        /* ============================================================
           RESPONSIVE DESIGN
           ============================================================ */

        /* Tablet: 640px - 1024px */
        @media (max-width: 1024px) {
          .footer-top-section {
            grid-template-columns: 1fr;
            gap: 60px;
            margin-bottom: 60px;
            padding-bottom: 60px;
          }

          .footer-nav-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 40px;
            margin-bottom: 60px;
          }

          .footer-stats-grid {
            grid-template-columns: 1fr;
          }
        }

        /* Mobile: < 640px */
        @media (max-width: 640px) {
          .footer-container {
            padding: 0 24px 32px;
          }

          .footer-world-class {
            padding: 80px 0 0;
          }

          .footer-top-section {
            gap: 48px;
            margin-bottom: 48px;
            padding-bottom: 48px;
          }

          .footer-brand-tagline {
            font-size: 18px;
          }

          .footer-newsletter-heading {
            font-size: 20px;
          }

          .footer-newsletter-field-row {
            flex-direction: column;
          }

          .footer-newsletter-button {
            width: 100%;
          }

          .footer-nav-grid {
            grid-template-columns: 1fr;
            gap: 32px;
            margin-bottom: 48px;
          }

          .footer-trust-section {
            padding: 24px;
            margin-bottom: 40px;
          }

          .footer-trust-badges {
            grid-template-columns: 1fr;
          }

          .footer-bottom-bar {
            flex-direction: column;
            align-items: flex-start;
            gap: 16px;
          }

          .footer-stats-grid {
            grid-template-columns: 1fr;
          }

          .footer-social-links {
            flex-wrap: wrap;
          }
        }

        /* ============================================================
           REDUCED MOTION
           ============================================================ */

        @media (prefers-reduced-motion: reduce) {
          .footer-gradient-orb,
          .footer-edge-lit,
          .footer-status-indicator {
            animation: none !important;
          }

          .footer-stat-card,
          .footer-social-link,
          .footer-nav-link,
          .footer-newsletter-button,
          .footer-brand-link {
            transition: none !important;
          }
        }
      `}</style>
    </footer>
  );
}

function FooterSkeleton() {
  const blockStyle = {
    background: "linear-gradient(135deg, rgba(148,163,184,0.12), rgba(148,163,184,0.06))",
    borderRadius: "12px",
  };

  return (
    <div className="footer-container" aria-hidden="true" style={{ paddingTop: 0 }}>
      <div className="footer-top-section">
        <div className="footer-brand-area">
          <div style={{ ...blockStyle, width: 56, height: 56, marginBottom: 16 }} />
          <div style={{ ...blockStyle, height: 24, width: "70%", marginBottom: 12 }} />
          <div style={{ ...blockStyle, height: 60, width: "90%", marginBottom: 16 }} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
            {[1, 2, 3].map((i) => (
              <div key={i} style={{ ...blockStyle, height: 72 }} />
            ))}
          </div>
        </div>
        <div className="footer-newsletter-area">
          <div style={{ ...blockStyle, height: 28, width: "80%", marginBottom: 12 }} />
          <div style={{ ...blockStyle, height: 42, width: "100%", marginBottom: 12 }} />
          <div style={{ ...blockStyle, height: 52, width: "100%", marginBottom: 12 }} />
          <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
            {[1, 2, 3, 4].map((i) => (
              <div key={i} style={{ ...blockStyle, width: 48, height: 48 }} />
            ))}
          </div>
        </div>
      </div>

      <div className="footer-nav-grid">
        {[1, 2, 3, 4, 5].map((col) => (
          <div key={col} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ ...blockStyle, height: 16, width: "60%" }} />
            {[1, 2, 3, 4, 5].map((row) => (
              <div key={row} style={{ ...blockStyle, height: 14, width: `${85 - row * 8}%`, opacity: 0.7 }} />
            ))}
          </div>
        ))}
      </div>

      <div style={{ ...blockStyle, height: 140, marginBottom: 60, padding: 40 }}>
        <div style={{ ...blockStyle, height: 16, width: "40%", marginBottom: 24 }} />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 16 }}>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} style={{ ...blockStyle, height: 46 }} />
          ))}
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 32, borderTop: "1px solid rgba(255,255,255,0.08)" }}>
        <div style={{ ...blockStyle, height: 18, width: 200 }} />
        <div style={{ ...blockStyle, height: 18, width: 160 }} />
      </div>
    </div>
  );
}
