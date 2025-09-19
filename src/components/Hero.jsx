import { Link } from "react-router-dom";

export default function Hero() {
  const scrollToMarketplace = () => {
    const el = document.getElementById("marketplace");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="hero">
      <div className="container">
        <h1>Buy & Deploy AI Automations</h1>
        <p>
          Browse a curated marketplace of automations for sales, support,
          marketing and ops—priced per automation (e.g., $200/mo for AI Receptionist),
          with generous request limits.
        </p>

        <div className="hero-ctas">
          <button onClick={scrollToMarketplace} className="btn btn-primary">
            Explore Marketplace
          </button>

          <Link to="/docs" className="btn btn-secondary">
            Read Docs
          </Link>
        </div>

        <div className="hero-badges">
          <span>✅ Deploy in minutes</span>
          <span>🔒 Business-grade security</span>
          <span>📈 Clear, per-automation pricing</span>
        </div>
      </div>
    </section>
  );
}
