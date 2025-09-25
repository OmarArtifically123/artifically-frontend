import ThemeToggle from "./ThemeToggle";
import { useTheme } from "../context/ThemeContext";

export default function Features() {
  const { darkMode } = useTheme();

  const features = [
    {
      icon: "🛒",
      title: "Marketplace, Not a Builder",
      desc: "Choose from battle-tested automations built by experts. No complex flow building or configuration nightmares.",
      status: "Available now",
    },
    {
      icon: "🔗",
      title: "Enterprise Integrations",
      desc: "Seamlessly connects with Stripe, HubSpot, Shopify, Slack, WhatsApp, and 50+ business tools out of the box.",
      status: "Integrations expanding",
    },
    {
      icon: "🛡️",
      title: "Military-Grade Security",
      desc: "SOC 2 compliant with zero-trust architecture, end-to-end encryption, and granular permission controls.",
      status: "SOC 2 Type II",
    },
    {
      icon: "⚡",
      title: "Lightning Deployment",
      desc: "From selection to production in under 10 minutes. No coding, no complex setup, just results.",
      status: "<10 min rollout",
    },
    {
      icon: "📊",
      title: "Real-Time Analytics",
      desc: "Monitor performance, track ROI, and optimize operations with comprehensive dashboards and insights.",
      status: "Live dashboards",
    },
    {
      icon: "🚀",
      title: "Infinite Scale",
      desc: "Built on cloud-native infrastructure that scales from startup to enterprise without breaking stride.",
      status: "Multi-region",
    },
  ];

  return (
    <section
      className="features"
      style={{
        position: "relative",
        padding: "5rem 0",
      }}
    >
      <div
        className="container"
        style={{
          position: "relative",
          zIndex: 1,
          display: "grid",
          gap: "2.5rem",
        }}
      >
        <div
          className="section-header"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            alignItems: "flex-start",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
              gap: "1rem",
            }}
          >
            <div>
              <h2
                style={{
                  fontSize: "clamp(2.1rem, 4vw, 2.8rem)",
                  fontWeight: 800,
                  letterSpacing: "-0.02em",
                }}
              >
                Built for Modern Enterprises
              </h2>
              <p
                style={{
                  maxWidth: "540px",
                  color: darkMode ? "#94a3b8" : "#475569",
                  fontSize: "1.05rem",
                }}
              >
                Automations that deliver measurable ROI from day one, with governance controls your compliance teams will love.
              </p>
            </div>
            <ThemeToggle />
          </div>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "0.75rem",
            }}
          >
            {[
              { label: "Accessibility first", color: "#10b981" },
              { label: "Glassmorphism UI", color: "#06b6d4" },
              { label: "Progressive enhancements", color: "#6366f1" },
            ].map((badge) => (
              <span
                key={badge.label}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.35rem",
                  padding: "0.4rem 0.75rem",
                  borderRadius: "0.75rem",
                  fontSize: "0.85rem",
                  background: `${badge.color}1a`,
                  color: badge.color,
                  border: `1px solid ${badge.color}33`,
                  fontWeight: 600,
                }}
              >
                <span aria-hidden="true">●</span>
                {badge.label}
              </span>
            ))}
          </div>
        </div>

        <div
          className="features-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "1.5rem",
          }}
        >
          {features.map((feature, index) => (
            <article
              key={feature.title}
              style={{
                position: "relative",
                padding: "1.75rem",
                borderRadius: "1.25rem",
                border: `1px solid ${darkMode ? "rgba(148,163,184,0.2)" : "rgba(148,163,184,0.3)"}`,
                background: darkMode
                  ? "linear-gradient(160deg, rgba(15,23,42,0.82), rgba(30,41,59,0.88))"
                  : "linear-gradient(160deg, rgba(255,255,255,0.92), rgba(241,245,249,0.9))",
                boxShadow: darkMode
                  ? "0 25px 45px rgba(8, 15, 34, 0.55)"
                  : "0 20px 35px rgba(148, 163, 184, 0.35)",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
                color: darkMode ? "#e2e8f0" : "#1f2937",
                transition: "transform var(--transition-fast), box-shadow var(--transition-fast)",
              }}
            >
              <span
                aria-hidden="true"
                style={{
                  position: "absolute",
                  inset: "1px",
                  borderRadius: "inherit",
                  background: darkMode
                    ? "linear-gradient(135deg, rgba(99,102,241,0.12), transparent 65%)"
                    : "linear-gradient(135deg, rgba(99,102,241,0.08), transparent 65%)",
                  pointerEvents: "none",
                }}
              />
              <div
                style={{
                  position: "relative",
                  zIndex: 1,
                  display: "grid",
                  gap: "1.25rem",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <div
                    style={{
                      width: "3rem",
                      height: "3rem",
                      display: "grid",
                      placeItems: "center",
                      fontSize: "1.5rem",
                      borderRadius: "0.85rem",
                      background: darkMode ? "rgba(99,102,241,0.18)" : "rgba(99,102,241,0.12)",
                    }}
                  >
                    {feature.icon}
                  </div>
                  <span
                    style={{
                      padding: "0.35rem 0.75rem",
                      borderRadius: "0.75rem",
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      letterSpacing: "0.05em",
                      textTransform: "uppercase",
                      background: index % 2 === 0 ? "rgba(16,185,129,0.18)" : "rgba(6,182,212,0.18)",
                      color: index % 2 === 0 ? "#10b981" : "#06b6d4",
                    }}
                  >
                    {feature.status}
                  </span>
                </div>
                <div style={{ display: "grid", gap: "0.75rem" }}>
                  <h3 style={{ fontSize: "1.35rem", fontWeight: 700 }}>{feature.title}</h3>
                  <p style={{ color: darkMode ? "#94a3b8" : "#475569" }}>{feature.desc}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
