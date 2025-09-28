import { Link } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";

const BADGES = [
  { icon: "⚡", label: "Deploy in minutes" },
  { icon: "🔒", label: "Enterprise security" },
  { icon: "📊", label: "Transparent pricing" },
  { icon: "🚀", label: "Scale infinitely" },
];

const scrollToMarketplace = () => {
  const el = document.getElementById("marketplace");
  if (!el) return;

  const header = document.querySelector(".site-header");
  const headerHeight = header ? header.offsetHeight : 80;
  const elementPosition = el.getBoundingClientRect().top + window.pageYOffset;
  const offsetPosition = elementPosition - headerHeight - 20;

  window.scrollTo({ top: offsetPosition, behavior: "smooth" });
};

export default function Hero() {
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

        <div className="hero-text">
          <h1>Deploy Enterprise AI Automations in Minutes</h1>
          <p>
            Transform your business operations with battle-tested AI automations. Choose, configure, and deploy in under 10
            minutes. No complex workflows—just measurable outcomes.
          </p>
          <div className="hero-ctas">
            <button type="button" className="btn btn-primary" onClick={scrollToMarketplace}>
              Explore Marketplace
              <span aria-hidden="true">→</span>
            </button>
            <Link to="/docs" className="btn btn-secondary">
              View Documentation
            </Link>
          </div>
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
    </section>
  );
}