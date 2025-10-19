"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";

import { Icon } from "./icons";
import LogoWordmark from "./ui/LogoWordmark";

const productLinks = [
  { label: "Marketplace", description: "Browse automations", href: "/marketplace" },
  {
    label: "AI Receptionist",
    description: "Smart call handling",
    href: "/marketplace?category=receptionist",
  },
  {
    label: "Lead Scoring",
    description: "Qualify prospects",
    href: "/marketplace?category=sales",
  },
  {
    label: "Analytics Engine",
    description: "Business insights",
    href: "/marketplace?category=analytics",
  },
  {
    label: "Custom Solutions",
    description: "Enterprise integrations",
    href: "/contact",
  },
  {
    label: "Workflow Library",
    description: "Pre-built templates",
    href: "/marketplace?category=workflows",
  },
  {
    label: "Integrations",
    description: "Connect your stack",
    href: "/integrations",
  },
  {
    label: "View All Products →",
    description: "",
    href: "/products",
  },
];

const resourceLinks = [
  { label: "Documentation", description: "Complete guides", href: "/docs" },
  { label: "API Reference", description: "Developer docs", href: "/api" },
  { label: "Help Center", description: "24/7 support", href: "/help" },
  { label: "Community Forum", description: "Peer discussions", href: "/community" },
  { label: "Blog", description: "Latest insights", href: "/blog" },
  { label: "Case Studies", description: "Success stories", href: "/case-studies" },
  { label: "Webinars", description: "Live sessions", href: "/webinars" },
  { label: "Changelog", description: "Product updates", href: "/changelog" },
  { label: "Status Page", description: "System uptime", href: "/status" },
];

const companyLinks = [
  { label: "About Us", description: "Our mission", href: "/about" },
  { label: "Careers", description: "Join the team", href: "/careers" },
  { label: "Partners", description: "Integration partners", href: "/partners" },
  { label: "Press", description: "Media resources", href: "/press" },
  { label: "Contact", description: "Get in touch", href: "/contact" },
  { label: "Brand Assets", description: "Logos and guidelines", href: "/brand" },
];

const supportLinks = [
  { label: "Help Center", description: "24/7 support", href: "/help" },
  { label: "Contact Support", description: "Get in touch", href: "/support" },
  { label: "Security", description: "SOC 2, GDPR", href: "/security" },
  { label: "Privacy Policy", description: "Data protection", href: "/privacy" },
  { label: "Terms of Service", description: "Legal terms", href: "/terms" },
  { label: "Cookie Policy", description: "Cookie usage", href: "/cookies" },
  { label: "Compliance", description: "Certifications", href: "/compliance" },
];

const socialLinks = [
  { label: "Twitter/X", href: "https://twitter.com/artifically", icon: "twitter" },
  { label: "LinkedIn", href: "https://linkedin.com/company/artifically", icon: "linkedin" },
  { label: "GitHub", href: "https://github.com/artifically", icon: "github" },
  { label: "Discord", href: "https://discord.gg/artifically", icon: "discord" },
  { label: "YouTube", href: "https://youtube.com/@artifically", icon: "youtube" },
];

const footerStats = [
  "12.4K Automations Deployed",
  "3.2K Companies Served",
  "99.9% Uptime",
];

export default function Footer() {
  const [email, setEmail] = useState("");
  const [formStatus, setFormStatus] = useState("");
  const [formMessage, setFormMessage] = useState("");
  const messageTimeoutRef = useRef(null);
  const emailId = useId();

  const handleNewsletterSubmit = async (event) => {
    event.preventDefault();
    const trimmedEmail = email.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

    if (!emailPattern.test(trimmedEmail)) {
      setFormStatus("error");
      setFormMessage("Enter a valid work email to join the digest.");
      if (messageTimeoutRef.current) clearTimeout(messageTimeoutRef.current);
      messageTimeoutRef.current = setTimeout(() => {
        setFormStatus("");
        setFormMessage("");
      }, 3600);
      return;
    }

    setFormStatus("loading");
    setFormMessage("Subscribing you to curated updates…");
    try {
      await new Promise((resolve) => setTimeout(resolve, 1100));
      setFormStatus("success");
      setFormMessage("Thanks for subscribing! Check your inbox to confirm.");
      setEmail("");
    } catch (error) {
      console.error(error);
      setFormStatus("error");
      setFormMessage("We couldn't save that email. Please try again.");
    } finally {
      if (messageTimeoutRef.current) clearTimeout(messageTimeoutRef.current);
      messageTimeoutRef.current = setTimeout(() => {
        setFormStatus("");
        setFormMessage("");
      }, 4200);
    }
  };

  useEffect(() => {
    return () => {
      if (messageTimeoutRef.current) {
        clearTimeout(messageTimeoutRef.current);
      }
    };
  }, []);

  const inputClassName = `newsletter-input${
    formStatus === "error" ? " has-error" : ""
  }${formStatus === "success" ? " has-success" : ""}`;

  return (
    <footer className="enterprise-footer" data-animate="true">
      <div className="footer-inner">
        <div className="footer-grid">
          <nav className="footer-column" aria-label="Products">
            <h4 className="footer-heading">Products</h4>
            <ul className="footer-links">
              {productLinks.map(({ label, description, href }) => (
                <li key={label}>
                  <Link href={href} className="footer-link">
                    <span className="footer-link-text">
                      <span className="footer-link-title">{label}</span>
                      {description ? (
                        <>
                          <span className="footer-link-divider">-</span>
                          <span className="footer-link-description">{description}</span>
                        </>
                      ) : null}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav className="footer-column" aria-label="Resources">
            <h4 className="footer-heading">Resources</h4>
            <ul className="footer-links">
              {resourceLinks.map(({ label, description, href }) => (
                <li key={label}>
                  <Link href={href} className="footer-link">
                    <span className="footer-link-text">
                      <span className="footer-link-title">{label}</span>
                      <span className="footer-link-divider">-</span>
                      <span className="footer-link-description">{description}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav className="footer-column" aria-label="Company">
            <h4 className="footer-heading">Company</h4>
            <ul className="footer-links">
              {companyLinks.map(({ label, description, href }) => (
                <li key={label}>
                  <Link href={href} className="footer-link">
                    <span className="footer-link-text">
                      <span className="footer-link-title">{label}</span>
                      <span className="footer-link-divider">-</span>
                      <span className="footer-link-description">{description}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav className="footer-column" aria-label="Support and legal">
            <h4 className="footer-heading">Support &amp; Legal</h4>
            <ul className="footer-links">
              {supportLinks.map(({ label, description, href }) => (
                <li key={label}>
                  <Link href={href} className="footer-link">
                    <span className="footer-link-text">
                      <span className="footer-link-title">{label}</span>
                      <span className="footer-link-divider">-</span>
                      <span className="footer-link-description">{description}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="footer-column newsletter-column">
            <h4 className="footer-heading">Stay ahead of automation trends</h4>
            <p className="newsletter-description">
              Join 10,000+ operators getting curated updates.
            </p>
            <form className="newsletter-form" onSubmit={handleNewsletterSubmit} noValidate>
              <label className="sr-only" htmlFor={emailId}>
                Work email
              </label>
              <input
                id={emailId}
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Enter work email"
                className={inputClassName}
                aria-describedby={`${emailId}-message`}
                disabled={formStatus === "loading"}
                required
              />
              <button
                type="submit"
                className="newsletter-button"
                disabled={formStatus === "loading"}
              >
                {formStatus === "loading" ? "Joining…" : "Join newsletter"}
              </button>
            </form>
            <div
              id={`${emailId}-message`}
              className={`newsletter-message${formStatus ? ` ${formStatus}` : ""}`}
              role="status"
              aria-live="polite"
            >
              {formMessage || "We send product intelligence twice a month."}
            </div>

            <div className="footer-social">
              {socialLinks.map(({ label, href, icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-social-link"
                  aria-label={label}
                >
                  <Icon name={icon} size={18} strokeWidth={1.6} />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="footer-divider" aria-hidden="true" />

        <div className="footer-bottom">
          <div className="footer-bottom-left">
            <LogoWordmark variant="dark" style={{ width: "120px", height: "auto" }} />
            <p className="footer-copyright">
              © 2025 Artifically. All rights reserved.
            </p>
          </div>

          <div className="footer-bottom-right">
            <div className="footer-certifications">
              <div className="footer-badge">
                <div className="footer-badge-icon">SOC 2</div>
                <span>SOC 2 Certified</span>
              </div>
              <div className="footer-badge">
                <div className="footer-badge-icon">GDPR</div>
                <span>GDPR Compliant</span>
              </div>
            </div>

            <div className="footer-stats" aria-label="Platform performance stats">
              {footerStats.map((stat, index) => (
                <span key={stat} className="footer-stat">
                  {stat}
                  {index < footerStats.length - 1 ? (
                    <span aria-hidden="true" className="footer-stat-divider" />
                  ) : null}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .enterprise-footer {
          background: #070a1a;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          padding: 80px 40px 32px;
          color: rgba(255, 255, 255, 0.9);
        }

        .footer-inner {
          margin: 0 auto;
          max-width: 1400px;
          display: flex;
          flex-direction: column;
        }

        .footer-grid {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr 1fr 1.2fr;
          gap: 60px;
        }

        .footer-column {
          min-width: 0;
        }

        .newsletter-column {
          display: flex;
          flex-direction: column;
        }

        .footer-heading {
          font-size: 16px;
          font-weight: 700;
          color: #ffffff;
          margin-bottom: 20px;
        }

        .footer-links {
          list-style: none;
          margin: 0;
          padding: 0;
        }

        .footer-link {
          display: block;
          padding: 10px 0;
          font-size: 14px;
          color: rgba(255, 255, 255, 0.7);
          text-decoration: none;
          transition: color 200ms ease, transform 200ms ease, text-decoration-color 200ms ease;
        }

        .footer-link-text {
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }

        .footer-link-title {
          font-weight: 600;
        }

        .footer-link-divider {
          color: rgba(255, 255, 255, 0.35);
          font-weight: 500;
          margin: 0 4px;
        }

        .footer-link-description {
          font-weight: 400;
          color: rgba(255, 255, 255, 0.7);
        }

        .footer-link:hover {
          color: #ffffff;
          transform: translateX(4px);
          text-decoration: underline;
          text-decoration-color: rgba(139, 92, 246, 0.6);
        }

        .newsletter-description {
          font-size: 14px;
          color: rgba(255, 255, 255, 0.7);
          line-height: 1.5;
          margin: 0 0 20px;
        }

        .newsletter-form {
          display: flex;
          gap: 8px;
        }

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

        .newsletter-input {
          flex: 1;
          padding: 14px 16px;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 10px;
          font-size: 14px;
          color: #ffffff;
        }

        .newsletter-input.has-error {
          border-color: rgba(248, 113, 113, 0.85);
        }

        .newsletter-input.has-success {
          border-color: rgba(139, 92, 246, 0.85);
        }

        .newsletter-input::placeholder {
          color: rgba(255, 255, 255, 0.4);
        }

        .newsletter-input:focus {
          border-color: #a78bfa;
          outline: none;
          box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.15);
        }

        .newsletter-button {
          padding: 14px 24px;
          background: #a78bfa;
          border: none;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 600;
          color: #ffffff;
          cursor: pointer;
          white-space: nowrap;
          transition: transform 200ms ease, background 200ms ease;
        }

        .newsletter-button:hover:enabled {
          background: #8b5cf6;
          transform: translateY(-1px);
        }

        .newsletter-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .newsletter-message {
          margin-top: 14px;
          font-size: 13px;
          color: rgba(255, 255, 255, 0.6);
          min-height: 18px;
        }

        .newsletter-message.success {
          color: rgba(139, 92, 246, 0.85);
        }

        .newsletter-message.error {
          color: rgba(244, 114, 182, 0.85);
        }

        .footer-social {
          margin-top: 32px;
          display: flex;
          gap: 12px;
        }

        .footer-social-link {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.15);
          color: rgba(255, 255, 255, 0.7);
          transition: transform 200ms ease, background 200ms ease, border-color 200ms ease, color 200ms ease;
        }

        .footer-social-link:hover {
          background: rgba(139, 92, 246, 0.2);
          border-color: #a78bfa;
          transform: translateY(-2px);
          color: #ffffff;
        }

        .footer-divider {
          margin: 60px 0 32px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .footer-bottom {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 32px;
          flex-wrap: wrap;
        }

        .footer-bottom-left {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .footer-bottom-right {
          display: flex;
          align-items: center;
          gap: 32px;
          flex-wrap: wrap;
        }

        .footer-certifications {
          display: flex;
          align-items: center;
          gap: 24px;
          flex-wrap: wrap;
        }

        .footer-badge {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 12px;
          color: rgba(255, 255, 255, 0.6);
        }

        .footer-badge-icon {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: grid;
          place-items: center;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.18);
          font-size: 11px;
          letter-spacing: 0.04em;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.7);
        }

        .footer-stats {
          display: flex;
          gap: 24px;
          align-items: center;
          font-size: 12px;
          color: rgba(255, 255, 255, 0.6);
          flex-wrap: wrap;
        }

        .footer-stat {
          position: relative;
          padding-right: 24px;
          display: inline-flex;
          align-items: center;
        }

        .footer-stat:last-of-type {
          padding-right: 0;
        }

        .footer-stat-divider {
          position: absolute;
          right: 0;
          top: 50%;
          width: 1px;
          height: 18px;
          background: rgba(255, 255, 255, 0.12);
          transform: translateY(-50%);
        }

        .footer-stat:last-of-type .footer-stat-divider {
          display: none;
        }

        @media (max-width: 960px) {
          .footer-grid {
            grid-template-columns: 1fr 1fr;
            gap: 40px;
          }

          .footer-bottom {
            flex-direction: column;
            align-items: flex-start;
          }

          .footer-bottom-right {
            width: 100%;
            justify-content: space-between;
          }
        }

        @media (max-width: 640px) {
          .enterprise-footer {
            padding: 64px 24px 32px;
          }

          .footer-grid {
            grid-template-columns: 1fr;
            gap: 40px;
          }

          .newsletter-form {
            flex-direction: column;
          }

          .newsletter-button {
            width: 100%;
          }

          .footer-bottom {
            align-items: stretch;
            gap: 20px;
          }

          .footer-bottom-right {
            flex-direction: column;
            align-items: flex-start;
            gap: 20px;
          }

          .footer-certifications,
          .footer-stats {
            width: 100%;
          }

          .footer-stat {
            padding-right: 0;
          }

          .footer-stat-divider {
            display: none;
          }
        }
      `}</style>
    </footer>
  );
}