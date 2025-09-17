export default function Features() {
  const features = [
    {
      icon: "🛒",
      title: "Marketplace, not a builder",
      desc: "Choose proven automations. No complex flow building."
    },
    {
      icon: "🔗",
      title: "Plug & play integrations",
      desc: "Connect Stripe, HubSpot, Shopify, Slack, WhatsApp and more."
    },
    {
      icon: "🛡️",
      title: "Enterprise-grade",
      desc: "Least-privilege keys, audit logs, and per-workspace isolation."
    }
  ];
  return (
    <section className="features">
      <div className="container">
        <div className="section-header">
          <h2>Built for Modern Teams</h2>
          <p>Automations that actually ship value on day one</p>
        </div>
        <div className="features-grid">
          {features.map((f, i) => (
            <div className="feature-card" key={i}>
              <div className="feature-icon">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
