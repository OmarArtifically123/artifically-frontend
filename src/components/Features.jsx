export default function Features() {
  const features = [
    {
      icon: "🛒",
      title: "Marketplace, Not a Builder",
      desc: "Choose from battle-tested automations built by experts. No complex flow building or configuration nightmares."
    },
    {
      icon: "🔗",
      title: "Enterprise Integrations", 
      desc: "Seamlessly connects with Stripe, HubSpot, Shopify, Slack, WhatsApp, and 50+ business tools out of the box."
    },
    {
      icon: "🛡️",
      title: "Military-Grade Security",
      desc: "SOC 2 compliant with zero-trust architecture, end-to-end encryption, and granular permission controls."
    },
    {
      icon: "⚡",
      title: "Lightning Deployment",
      desc: "From selection to production in under 10 minutes. No coding, no complex setup, just results."
    },
    {
      icon: "📊",
      title: "Real-Time Analytics",
      desc: "Monitor performance, track ROI, and optimize operations with comprehensive dashboards and insights."
    },
    {
      icon: "🚀",
      title: "Infinite Scale",
      desc: "Built on cloud-native infrastructure that scales from startup to enterprise without breaking stride."
    }
  ];

  return (
    <section className="features">
      <div className="container">
        <div className="section-header">
          <h2>Built for Modern Enterprises</h2>
          <p>Automations that deliver measurable ROI from day one</p>
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