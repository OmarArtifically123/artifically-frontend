import { Link } from "react-router-dom";

export default function Hero() {
  const scrollToMarketplace = () => {
    const el = document.getElementById("marketplace");
    if (el) {
      // Get the header height to offset the scroll position
      const header = document.querySelector('.site-header');
      const headerHeight = header ? header.offsetHeight : 80;
      
      // Calculate the position to scroll to
      const elementPosition = el.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - headerHeight - 20;
      
      // Smooth scroll implementation that works across browsers
      const startPosition = window.pageYOffset;
      const distance = offsetPosition - startPosition;
      const duration = 1000; // 1 second
      let start = null;

      function smoothScrollStep(timestamp) {
        if (!start) start = timestamp;
        const progress = timestamp - start;
        const progressPercentage = Math.min(progress / duration, 1);
        
        // Easing function for smooth animation
        const ease = progressPercentage < 0.5 
          ? 4 * progressPercentage * progressPercentage * progressPercentage
          : 1 - Math.pow(-2 * progressPercentage + 2, 3) / 2;
        
        window.scrollTo(0, startPosition + distance * ease);
        
        if (progress < duration) {
          requestAnimationFrame(smoothScrollStep);
        }
      }
      
      requestAnimationFrame(smoothScrollStep);
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