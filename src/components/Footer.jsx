import { Link } from "react-router-dom";
import { useEffect, useMemo, useState, useId, useRef } from "react";
import LogoLight from "../assets/logos/1_Primary.svg";
import LogoDark from "../assets/logos/3_Dark_Mode.svg";
import ThemeToggle from "./ThemeToggle";
import { useTheme } from "../context/ThemeContext";

export default function Footer() {
  const { darkMode } = useTheme();
  const [currentYear] = useState(new Date().getFullYear());
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
      { name: "Twitter", url: "https://twitter.com/artifically", icon: "🐦", color: "#1DA1F2" },
      { name: "LinkedIn", url: "https://linkedin.com/company/artifically", icon: "💼", color: "#0A66C2" },
      { name: "GitHub", url: "https://github.com/artifically", icon: "💻", color: darkMode ? "#ffffff" : "#1f2937" },
      { name: "Discord", url: "https://discord.gg/artifically", icon: "💬", color: "#5865F2" },
    ],
    [darkMode]
  );

  const statusBadges = [
    { label: "All systems operational", status: "success" },
    { label: "SOC 2 Type II", status: "info" },
    { label: "99.99% uptime", status: "accent" },
  ];

  return (
    <footer
      className="site-footer"
      style={{
        marginTop: "4rem",
        padding: "4rem 0 2.5rem",
        color: darkMode ? "#e2e8f0" : "#1f2937",
        background: darkMode
          ? "radial-gradient(circle at top, rgba(99,102,241,0.25), transparent 55%), linear-gradient(180deg, rgba(15, 23, 42, 0.95), rgba(15, 23, 42, 0.98))"
          : "radial-gradient(circle at top, rgba(99,102,241,0.18), transparent 55%), linear-gradient(180deg, rgba(248, 250, 252, 0.95), rgba(241, 245, 249, 0.98))",
        borderTop: `1px solid ${darkMode ? "rgba(148, 163, 184, 0.25)" : "rgba(148, 163, 184, 0.35)"}`,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        className="container"
        style={{
          position: "relative",
          zIndex: 1,
          display: "grid",
          gap: "3rem",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1.5rem",
            background: darkMode ? "rgba(15, 23, 42, 0.65)" : "rgba(255, 255, 255, 0.8)",
            border: `1px solid ${darkMode ? "rgba(148,163,184,0.22)" : "rgba(148,163,184,0.28)"}`,
            borderRadius: "1.5rem",
            padding: "2rem",
            boxShadow: darkMode
              ? "0 30px 50px rgba(8, 15, 34, 0.55)"
              : "0 30px 50px rgba(148, 163, 184, 0.35)",
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
              gap: "1rem",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <img
                src={darkMode ? LogoDark : LogoLight}
                alt="Artifically"
                style={{ height: "60px", width: "auto" }}
              />
              <div>
                <p
                  style={{
                    fontSize: "1.15rem",
                    fontWeight: 600,
                    marginBottom: "0.35rem",
                  }}
                >
                  Building trustworthy automations for enterprises worldwide.
                </p>
                <div
                  style={{
                    display: "flex",
                    gap: "0.75rem",
                    flexWrap: "wrap",
                  }}
                >
                  {statusBadges.map(({ label, status }) => (
                    <span
                      key={label}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.35rem",
                        padding: "0.35rem 0.75rem",
                        borderRadius: "999px",
                        fontSize: "0.8rem",
                        fontWeight: 600,
                        letterSpacing: "0.02em",
                        background:
                          status === "success"
                            ? "rgba(16, 185, 129, 0.18)"
                            : status === "info"
                            ? "rgba(59, 130, 246, 0.18)"
                            : "rgba(6, 182, 212, 0.18)",
                        color:
                          status === "success"
                            ? darkMode ? "#6ee7b7" : "#047857"
                            : status === "info"
                            ? darkMode ? "#93c5fd" : "#1d4ed8"
                            : darkMode ? "#67e8f9" : "#0e7490",
                        border: "1px solid rgba(148, 163, 184, 0.22)",
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
              gap: "1.75rem",
              marginTop: "1.5rem",
            }}
          >
            {footerSections.map(({ title, links }) => (
              <div key={title}>
                <h4
                  style={{
                    fontSize: "1rem",
                    marginBottom: "0.75rem",
                    color: darkMode ? "#e2e8f0" : "#1e293b",
                  }}
                >
                  {title}
                </h4>
                <ul style={{ listStyle: "none", display: "grid", gap: "0.75rem" }}>
                  {links.map((link) => (
                    <li key={link.name}>
                      <Link
                        to={link.path}
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "0.2rem",
                          padding: "0.6rem 0.75rem",
                          borderRadius: "0.75rem",
                          textDecoration: "none",
                          color: darkMode ? "#cbd5e1" : "#475569",
                          background: darkMode ? "rgba(148, 163, 184, 0.08)" : "rgba(148, 163, 184, 0.16)",
                          transition: "all var(--transition-fast)",
                        }}
                      >
                        <span style={{ fontWeight: 600 }}>{link.name}</span>
                        <span style={{ fontSize: "0.85rem", color: darkMode ? "#94a3b8" : "#64748b" }}>
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
              gap: "1.5rem",
              background: darkMode ? "rgba(15, 23, 42, 0.6)" : "rgba(248, 250, 252, 0.85)",
              borderRadius: "1.25rem",
              padding: "1.75rem",
              border: `1px solid ${darkMode ? "rgba(148,163,184,0.22)" : "rgba(148,163,184,0.3)"}`,
            }}
          >
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "1rem",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <h5 style={{ fontSize: "1.05rem", fontWeight: 600 }}>Stay ahead of automation trends</h5>
                <p style={{ color: darkMode ? "#94a3b8" : "#475569" }}>
                  Join {stats.automationsDeployed.toLocaleString()} operators getting curated updates.
                </p>
              </div>

              <form
                onSubmit={handleNewsletterSubmit}
                noValidate
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "0.75rem",
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
                    padding: "0.75rem 1rem",
                    borderRadius: "0.85rem",
                    border: `1px solid ${
                      newsletterStatus === "error"
                        ? darkMode
                          ? "rgba(248, 113, 113, 0.65)"
                          : "rgba(220, 38, 38, 0.65)"
                        : darkMode
                        ? "rgba(148,163,184,0.28)"
                        : "rgba(148,163,184,0.45)"
                    }`,
                    background: darkMode ? "rgba(15, 23, 42, 0.8)" : "rgba(255, 255, 255, 0.9)",
                    color: darkMode ? "#e2e8f0" : "#1e293b",
                    transition: "border var(--transition-fast)",
                  }}
                />
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{
                    padding: "0.75rem 1.4rem",
                    borderRadius: "0.85rem",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                  disabled={newsletterStatus === "loading"}
                >
                  {newsletterStatus === "loading" ? "Joining…" : "Join newsletter"}
                </button>
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
                    ? darkMode ? "#6ee7b7" : "#047857"
                    : newsletterStatus === "error"
                    ? darkMode ? "#fda4af" : "#b91c1c"
                    : darkMode
                    ? "#94a3b8"
                    : "#64748b",
              }}
            >
              {newsletterMessage}
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
                gap: "1rem",
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
                      padding: "1rem",
                      borderRadius: "1rem",
                      background: darkMode ? "rgba(15, 23, 42, 0.75)" : "rgba(255, 255, 255, 0.95)",
                      border: `1px solid ${darkMode ? "rgba(148,163,184,0.16)" : "rgba(148,163,184,0.28)"}`,
                    }}
                  >
                    <div style={{ fontSize: "1.65rem", fontWeight: 700 }}>{value}</div>
                    <div style={{ color: darkMode ? "#94a3b8" : "#475569", fontSize: "0.85rem" }}>{label}</div>
                  </div>
                );
              })}
            </div>

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "space-between",
                gap: "1rem",
                alignItems: "center",
              }}
            >
              <div style={{ display: "flex", gap: "0.85rem", flexWrap: "wrap" }}>
                {socialLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.4rem",
                      padding: "0.6rem 0.85rem",
                      borderRadius: "0.75rem",
                      border: `1px solid ${darkMode ? "rgba(148,163,184,0.25)" : "rgba(148,163,184,0.35)"}`,
                      color: link.color,
                      background: darkMode ? "rgba(15, 23, 42, 0.7)" : "rgba(255, 255, 255, 0.95)",
                      textDecoration: "none",
                      fontWeight: 600,
                    }}
                  >
                    <span aria-hidden="true">{link.icon}</span>
                    {link.name}
                  </a>
                ))}
              </div>

              <div style={{ color: darkMode ? "#64748b" : "#475569", fontSize: "0.85rem" }}>
                &copy; {currentYear} Artifically. Crafted with resilience and intent.
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}