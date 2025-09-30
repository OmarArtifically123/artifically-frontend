import { useCallback } from "react";
import { Link } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";
import useMicroInteractions from "../hooks/useMicroInteractions";

const BADGES = [
  { icon: "⚡", label: "Deploy in minutes" },
  { icon: "🔒", label: "Enterprise security" },
  { icon: "📊", label: "Transparent pricing" },
  { icon: "🧠", label: "Guided evaluations" },
];

const HERO_METRICS = [
  {
    label: "Deployments queued",
    value: "0",
    helper: "Your first launch lights up live telemetry.",
  },
  {
    label: "Automation templates",
    value: "64",
    helper: "Curated playbooks across revenue, ops, and CX.",
  },
  {
    label: "Preview coverage",
    value: "100%",
    helper: "Every automation ships with an interactive walkthrough.",
  },
];

const HERO_CHECKLIST = [
  "Personalize the marketplace with a single profile import",
  "Share live previews with stakeholders before you deploy",
  "Schedule a guided launch when you're ready to go live",
];

export default function Hero() {
  const { dispatchInteraction } = useMicroInteractions();

  const handleScrollToMarketplace = useCallback(
    (event) => {
      dispatchInteraction("cta-primary", { event });
      if (typeof window === "undefined") return;
      const el = document.getElementById("marketplace");
      if (!el) return;

  const header = document.querySelector(".site-header");
      const headerHeight = header ? header.offsetHeight : 80;
      const elementPosition = el.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - headerHeight - 20;

      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
    },
    [dispatchInteraction],
  );

  const handleDocsClick = useCallback(
    (event) => {
      dispatchInteraction("cta-secondary", { event });
    },
    [dispatchInteraction],
  );

  return (
    <section className="hero">
      <div className="hero-inner">
        <header className="hero-header">
          <span className="hero-pill">
            <span aria-hidden="true">✨</span>
            Interactive experiences engineered for trust
          </span>
          <ThemeToggle />
        </header>

        <div className="hero-body">
          <div className="hero-text">
            <h1>Deploy Enterprise AI Automations in Minutes</h1>
            <p>
              Transform operations with a guided evaluation flow. Configure live previews, align stakeholders, and deploy
              production-ready automations without wrestling with setup screens.
            </p>
            <div className="hero-ctas">
              <button
                type="button"
                className="btn btn-primary"
                data-magnetic="true"
                data-ripple="true"
                data-magnetic-strength="1.2"
                onClick={handleScrollToMarketplace}
              >
                Explore Marketplace
                <span aria-hidden="true">→</span>
              </button>
              <Link
                to="/docs"
                className="btn btn-secondary"
                data-prefetch-route="/docs"
                data-magnetic="true"
                data-magnetic-strength="0.9"
                onClick={handleDocsClick}
              >
                View Documentation
              </Link>
            </div>

            <ul className="hero-badges">
              {BADGES.map(({ icon, label }) => (
                <li key={label}>
                  <span className="hero-badge-icon" aria-hidden="true">
                    {icon}
                  </span>
                  <span>{label}</span>
                </li>
              ))}
            </ul>
          </div>

        <aside className="hero-visual" aria-hidden="true">
            <div className="hero-visual__glow" />
            <div className="hero-visual__card">
              <span className="hero-visual__eyebrow">Launch readiness</span>
              <h3>Everything is staged—just add your first workflow.</h3>
              <ul className="hero-visual__metrics">
                {HERO_METRICS.map((metric) => (
                  <li key={metric.label}>
                    <div>
                      <span>{metric.label}</span>
                      <strong>{metric.value}</strong>
                    </div>
                    <p>{metric.helper}</p>
                  </li>
                ))}
              </ul>
              <div className="hero-visual__divider" />
              <ul className="hero-visual__checklist">
                {HERO_CHECKLIST.map((item) => (
                  <li key={item}>
                    <span aria-hidden="true">✔</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}