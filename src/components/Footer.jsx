import { Link } from "react-router-dom";
import { useEffect, useMemo, useState, useId, useRef } from "react";
import LogoLight from "../assets/logos/1_Primary.svg";
import LogoDark from "../assets/logos/3_Dark_Mode.svg";
import ThemeToggle from "./ThemeToggle";
import { useTheme } from "../context/ThemeContext";
import { space } from "../styles/spacing";
import MagneticButton from "./animation/MagneticButton";

const FALLBACK_YEAR = new Date().getUTCFullYear();

const getInitialYear = () => {
  if (typeof window === "undefined") {
    return FALLBACK_YEAR;
  }
  return new Date().getUTCFullYear();
};

export default function Footer() {
  const { darkMode } = useTheme();
  const [currentYear, setCurrentYear] = useState(getInitialYear);
  const [stats, setStats] = useState({
    automationsDeployed: 0,
    companiesServed: 0,
    timesSaved: 0,
  });
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterStatus, setNewsletterStatus] = useState("");
  const [newsletterMessage, setNewsletterMessage] = useState("");
  const messageTimeoutRef = useRef(null);
  const newsletterId = useId();

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const year = new Date().getUTCFullYear();
    if (year !== currentYear) {
      setCurrentYear(year);
    }
  }, [currentYear]);

  useEffect(() => {
    const finalStats = {
      automationsDeployed: 0,
      companiesServed: 0,
      timesSaved: 0,
    };

    let frame = 0;
    const totalFrames = 60;
    const animate = () => {
      frame += 1;
      const progress = Math.min(frame / totalFrames, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setStats({
        automationsDeployed: Math.floor(finalStats.automationsDeployed * eased),
        companiesServed: Math.floor(finalStats.companiesServed * eased),
        timesSaved: Math.floor(finalStats.timesSaved * eased),
      });
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animate();
            observer.disconnect();
          }
        });
      },
      { threshold: 0.2 }
    );

    const el = document.querySelector(".site-footer");
    if (el) observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => () => {
    if (messageTimeoutRef.current) {
      clearTimeout(messageTimeoutRef.current);
    }
  }, []);

  const footerSections = useMemo(
    () => [
      {
        title: "Products",
        links: [
          { name: "Marketplace", path: "/marketplace", desc: "Browse automations" },
          { name: "AI Receptionist", path: "/marketplace?category=receptionist", desc: "Smart call handling" },
          { name: "Lead Scoring", path: "/marketplace?category=sales", desc: "Intelligent lead analysis" },
          { name: "Analytics Engine", path: "/marketplace?category=analytics", desc: "Business insights" },
          { name: "Custom Solutions", path: "/contact", desc: "Enterprise integrations" },
        ],
      },
      {
        title: "Resources",
        links: [
          { name: "Documentation", path: "/docs", desc: "Complete guides" },
          { name: "API Reference", path: "/api", desc: "Developer resources" },
          { name: "Pricing", path: "/pricing", desc: "Transparent costs" },
          { name: "Blog", path: "/blog", desc: "Latest insights" },
          { name: "Case Studies", path: "/case-studies", desc: "Success stories" },
          { name: "Changelog", path: "/changelog", desc: "Product updates" },
        ],
      },
      {
        title: "Support & Legal",
        links: [
          { name: "Help Center", path: "/help", desc: "24/7 support" },
          { name: "Status Page", path: "/status", desc: "System status" },
          { name: "Security", path: "/security", desc: "SOC 2 compliant" },
          { name: "Privacy Policy", path: "/privacy", desc: "Data protection" },
          { name: "Terms of Service", path: "/terms", desc: "Usage terms" },
          { name: "Contact", path: "/contact", desc: "Get in touch" },
        ],
      },
    ],
    []
  );

  const handleNewsletterSubmit = async (event) => {
    event.preventDefault();
    const trimmedEmail = newsletterEmail.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

    if (!emailPattern.test(trimmedEmail)) {
      setNewsletterStatus("error");
      setNewsletterMessage("Please use a valid work email so we can confirm updates.");
      if (messageTimeoutRef.current) clearTimeout(messageTimeoutRef.current);
      messageTimeoutRef.current = setTimeout(() => {
        setNewsletterStatus("");
        setNewsletterMessage("");
      }, 3200);
      return;
    }

    setNewsletterStatus("loading");
    setNewsletterMessage("Subscribing you to the release digest…");
    try {
      await new Promise((resolve) => setTimeout(resolve, 1200));
      setNewsletterStatus("success");
      setNewsletterMessage("Thanks! Check your inbox for a confirmation email.");
      setNewsletterEmail("");
    } catch (error) {
      console.error(error);
      setNewsletterStatus("error");
      setNewsletterMessage("We couldn't save your email. Please try again in a moment.");
    } finally {
      if (messageTimeoutRef.current) clearTimeout(messageTimeoutRef.current);
      messageTimeoutRef.current = setTimeout(() => {
        setNewsletterStatus("");
        setNewsletterMessage("");
      }, 4000);
    }
  };

  const socialLinks = useMemo(
    () => [
      {
        name: "Twitter",
        url: "https://twitter.com/artifically",
        icon: "🐦",
        color: "color-mix(in oklch, var(--brand-glow) 60%, transparent)",
      },
      {
        name: "LinkedIn",
        url: "https://linkedin.com/company/artifically",
        icon: "💼",
        color: "color-mix(in oklch, var(--brand-primary) 55%, transparent)",
      },
      {
        name: "GitHub",
        url: "https://github.com/artifically",
        icon: "💻",
        color: "color-mix(in oklch, var(--text-primary) 85%, transparent)",
      },
      {
        name: "Discord",
        url: "https://discord.gg/artifically",
        icon: "💬",
        color: "color-mix(in oklch, var(--brand-energy) 55%, transparent)",
      },
    ],
    []
  );

  const statusBadges = [
    { label: "All systems operational", status: "success" },
    { label: "SOC 2 Type II", status: "info" },
    { label: "99.99% uptime", status: "accent" },
  ];

  const badgePalette = {
    success: {
      background: "color-mix(in oklch, var(--success-vibrant) 18%, transparent)",
      text: "color-mix(in oklch, var(--success-vibrant) 65%, transparent)",
      border: "color-mix(in oklch, var(--success-vibrant) 35%, transparent)",
    },
    info: {
      background: "color-mix(in oklch, var(--brand-primary) 18%, transparent)",
      text: "color-mix(in oklch, var(--brand-primary) 70%, transparent)",
      border: "color-mix(in oklch, var(--brand-primary) 35%, transparent)",
    },
    accent: {
      background: "color-mix(in oklch, var(--brand-glow) 18%, transparent)",
      text: "color-mix(in oklch, var(--brand-glow) 65%, transparent)",
      border: "color-mix(in oklch, var(--brand-glow) 35%, transparent)",
    },
  };

  const footerSurface = darkMode
    ? "linear-gradient(180deg, color-mix(in oklch, var(--brand-depth) 92%, black) 0%, color-mix(in oklch, var(--brand-depth) 70%, transparent) 100%)"
    : "linear-gradient(180deg, color-mix(in oklch, white 94%, var(--brand-primary) 6%) 0%, color-mix(in oklch, white 88%, var(--brand-primary) 12%) 100%)";

  const footerBorder = darkMode
    ? "color-mix(in oklch, var(--glass-border-primary) 70%, transparent)"
    : "color-mix(in oklch, var(--glass-border-primary-light) 65%, transparent)";

  const panelSurface = darkMode
    ? "color-mix(in oklch, var(--glass-1) 92%, transparent)"
    : "color-mix(in oklch, var(--glass-3) 94%, transparent)";

  return (
    <footer
      className="site-footer"
      style={{
        marginTop: space("2xl"),
        padding: `${space("2xl")} 0 ${space("lg", 1.25)}`,
        color: "var(--text-primary)",
        background: `${footerSurface}, radial-gradient(circle at 15% -10%, color-mix(in oklch, var(--brand-primary) 18%, transparent) 0%, transparent 55%), radial-gradient(circle at 85% -20%, color-mix(in oklch, var(--brand-energy) 18%, transparent) 0%, transparent 55%)`,
        borderTop: `1px solid ${footerBorder}`,
        position: "relative",
        overflow: "hidden",
      }}
      data-animate="true"
    >
      <div
        className="container"
        style={{
          position: "relative",
          zIndex: 1,
          display: "grid",
          gap: space("xl"),
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: space("md"),
            background: panelSurface,
            border: `1px solid ${footerBorder}`,
            borderRadius: "1.5rem",
            padding: space("lg"),
            boxShadow: darkMode
              ? "0 30px 65px color-mix(in srgb, var(--brand-depth) 65%, transparent)"
              : "0 30px 65px color-mix(in srgb, var(--brand-primary) 22%, transparent)",
            backdropFilter: "blur(22px)",
            WebkitBackdropFilter: "blur(22px)",
          }}
        >
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "space-between",
              gap: space("sm"),
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: space("sm") }}>
              <img
                src={darkMode ? LogoDark : LogoLight}
                alt="Artifically"
                width={375}
                height={375}
                loading="lazy"
                style={{ height: "60px", width: "auto" }}
              />
              <div>
                <p
                  style={{
                    fontSize: "1.15rem",
                    fontWeight: 600,
                    marginBottom: space("2xs", 1.4),
                  }}
                >
                  Building trustworthy automations for enterprises worldwide.
                </p>
                <div
                  style={{
                    display: "flex",
                    gap: space("xs", 1.5),
                    flexWrap: "wrap",
                  }}
                >
                  {statusBadges.map(({ label, status }) => (
                    <span
                      key={label}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: space("2xs", 1.4),
                        padding: `${space("2xs", 1.4)} ${space("xs", 1.5)}`,
                        borderRadius: "999px",
                        fontSize: "0.8rem",
                        fontWeight: 600,
                        letterSpacing: "0.02em",
                        background: badgePalette[status]?.background,
                        color: badgePalette[status]?.text,
                        border: `1px solid ${badgePalette[status]?.border ?? "transparent"}`,
                      }}
                    >
                      <span aria-hidden="true">●</span>
                      {label}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <ThemeToggle />
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: space("md", 1.1667),
              marginTop: space("md"),
            }}
          >
            {footerSections.map(({ title, links }) => (
              <div key={title}>
                <h4
                  style={{
                    fontSize: "1rem",
                    marginBottom: space("xs", 1.5),
                    color: "var(--text-primary)",
                  }}
                >
                  {title}
                </h4>
                <ul style={{ listStyle: "none", display: "grid", gap: space("xs", 1.5) }}>
                  {links.map((link) => (
                    <li key={link.name}>
                      <Link
                        to={link.path}
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: space("3xs", 1.6),
                          padding: `${space("xs", 1.2)} ${space("xs", 1.5)}`,
                          borderRadius: "0.75rem",
                          textDecoration: "none",
                          color: "var(--text-secondary)",
                          background: "color-mix(in oklch, var(--glass-2) 65%, transparent)",
                          transition: "all var(--transition-fast)",
                        }}
                      >
                        <span style={{ fontWeight: 600 }}>{link.name}</span>
                        <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
                          {link.desc}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div
            style={{
              display: "grid",
              gap: space("md"),
              background: "color-mix(in oklch, var(--glass-2) 75%, transparent)",
              borderRadius: "1.25rem",
              padding: space("md", 1.1667),
              border: `1px solid ${footerBorder}`,
            }}
          >
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: space("sm"),
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <h5 style={{ fontSize: "1.05rem", fontWeight: 600 }}>Stay ahead of automation trends</h5>
                <p style={{ color: "var(--text-muted)" }}>
                  Join {stats.automationsDeployed.toLocaleString()} operators getting curated updates.
                </p>
              </div>

              <form
                onSubmit={handleNewsletterSubmit}
                noValidate
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: space("xs", 1.5),
                  alignItems: "center",
                }}
              >
                <label htmlFor={newsletterId} className="sr-only">
                  Email address
                </label>
                <input
                  id={newsletterId}
                  type="email"
                  value={newsletterEmail}
                  onChange={(event) => setNewsletterEmail(event.target.value)}
                  placeholder="you@company.com"
                  required
                  aria-describedby={`${newsletterId}-status`}
                  aria-invalid={newsletterStatus === "error"}
                  style={{
                    minWidth: "240px",
                    padding: `${space("xs", 1.5)} ${space("sm")}`,
                    borderRadius: "0.85rem",
                    border: `1px solid ${
                      newsletterStatus === "error"
                        ? darkMode
                          ? "color-mix(in oklch, var(--error-sharp) 45%, transparent)"
                          : "color-mix(in oklch, var(--error-sharp) 55%, transparent)"
                        : darkMode
                        ? "color-mix(in oklch, var(--glass-border-primary) 75%, transparent)"
                        : "color-mix(in oklch, var(--glass-border-primary-light) 68%, transparent)"
                    }`,
                    background: "color-mix(in oklch, var(--glass-2) 85%, transparent)",
                    color: "var(--text-primary)",
                    transition: "border var(--transition-fast)",
                  }}
                />
                <MagneticButton
                  type="submit"
                  className="btn btn-primary"
                  variant="primary"
                  style={{
                    padding: `${space("xs", 1.5)} ${space("sm", 1.4)}`,
                    borderRadius: "0.85rem",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: space("xs"),
                  }}
                  disabled={newsletterStatus === "loading"}
                >
                  {newsletterStatus === "loading" ? "Joining…" : "Join newsletter"}
                </MagneticButton>
              </form>
            </div>

            <div
              role="status"
              aria-live="polite"
              id={`${newsletterId}-status`}
              style={{
                minHeight: "1.25rem",
                fontSize: "0.9rem",
                color:
                  newsletterStatus === "success"
                    ? badgePalette.success.text
                    : newsletterStatus === "error"
                    ? "color-mix(in oklch, var(--error-sharp) 70%, transparent)"
                    : "var(--text-muted)",
              }}
            >
              {newsletterMessage}
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
                gap: space("sm"),
                textAlign: "center",
              }}
            >
              {["Automations deployed", "Companies served", "Hours saved"].map((label, index) => {
                const value =
                  index === 0
                    ? stats.automationsDeployed.toLocaleString()
                    : index === 1
                    ? stats.companiesServed.toLocaleString()
                    : `${(stats.timesSaved / 1000).toFixed(1)}K+`;
                return (
                  <div
                    key={label}
                    style={{
                      padding: space("sm"),
                      borderRadius: "1rem",
                      background: "color-mix(in oklch, var(--glass-2) 80%, transparent)",
                      border: `1px solid ${footerBorder}`,
                    }}
                  >
                    <div style={{ fontSize: "1.65rem", fontWeight: 700 }}>{value}</div>
                    <div style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>{label}</div>
                  </div>
                );
              })}
            </div>

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "space-between",
                gap: space("sm"),
                alignItems: "center",
              }}
            >
              <div style={{ display: "flex", gap: space("xs", 1.7), flexWrap: "wrap" }}>
                {socialLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: space("2xs", 1.6),
                      padding: `${space("xs", 1.2)} ${space("xs", 1.7)}`,
                      borderRadius: "0.75rem",
                      border: `1px solid ${footerBorder}`,
                      color: link.color,
                      background: "color-mix(in oklch, var(--glass-2) 78%, transparent)",
                      textDecoration: "none",
                      fontWeight: 600,
                    }}
                  >
                    <span aria-hidden="true">{link.icon}</span>
                    {link.name}
                  </a>
                ))}
              </div>

              <div style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
                &copy; <span suppressHydrationWarning>{currentYear}</span> Artifically. Crafted with resilience and
                intent.
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}