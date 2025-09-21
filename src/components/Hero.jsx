import { Link } from "react-router-dom";

export default function Hero() {
  const scrollToMarketplace = () => {
    const el = document.getElementById("marketplace");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="hero">
      <div className="container">
        <h1>Deploy Enterprise AI Automations in Minutes</h1>
        <p>
          Transform your business operations with battle-tested AI automations. 
          From AI receptionists to lead scoring systems—choose, configure, and deploy 
          in under 10 minutes. No complex workflows, just results.
        </p>

        <div className="hero-ctas">
          <button onClick={scrollToMarketplace} className="btn btn-primary">
            Explore Marketplace
          </button>
          <Link to="/docs" className="btn btn-secondary">
            View Documentation
          </Link>
        </div>

        <div className="hero-badges">
          <span>⚡ Deploy in minutes</span>
          <span>🔒 Enterprise security</span>
          <span>📊 Transparent pricing</span>
          <span>🚀 Scale infinitely</span>
        </div>
      </div>
    </section>
  );
}