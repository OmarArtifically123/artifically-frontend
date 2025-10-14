const customerLogos = [
  "Mercury Labs",
  "Nova Retail",
  "Atlas Finance",
  "Helios Health",
  "Vantage Ops",
  "Artemis Cloud",
  "Northwind AI",
  "Titan Manufacturing",
];

const testimonials = [
  {
    id: "atlas",
    quote: "Our revops team finally has an automation stack they can trust. Deployment windows dropped from weeks to minutes.",
    name: "Jared Collins",
    title: "VP Revenue Operations",
    company: "Atlas Finance",
    roi: 5.1,
    timeSaved: 38,
  },
  {
    id: "nova",
    quote: "We replaced seven internal tools and automated global merchandising within a quarter.",
    name: "Mei Chen",
    title: "Director of Automation",
    company: "Nova Retail",
    roi: 4.4,
    timeSaved: 52,
  },
];

export default function SocialProofSection() {
  return (
    <section className="section-shell" aria-labelledby="social-proof-title">
      <header className="section-header">
        <span className="section-eyebrow">Trusted by Industry Leaders</span>
        <h2 id="social-proof-title" className="section-title">
          Join 12,500+ Companies
        </h2>
      </header>
      <div className="logo-wall" aria-label="Customer logos">
        {customerLogos.map((logo) => (
          <span
            key={logo}
            style={{
              padding: "1rem 1.5rem",
              borderRadius: "0.85rem",
              border: "1px solid color-mix(in oklch, white 10%, transparent)",
              background: "color-mix(in oklch, var(--glass-2) 70%, transparent)",
              fontSize: "0.9rem",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "color-mix(in oklch, white 75%, var(--gray-200))",
            }}
          >
            {logo}
          </span>
        ))}
      </div>
      <div className="testimonial-carousel">
        {testimonials.map((testimonial) => (
          <article key={testimonial.id} className="testimonial-card">
            <blockquote>“{testimonial.quote}”</blockquote>
            <footer style={{ display: "flex", flexWrap: "wrap", gap: "0.85rem", alignItems: "center" }}>
              <div>
                <strong style={{ color: "white" }}>{testimonial.name}</strong>
                <div style={{ fontSize: "0.95rem", color: "color-mix(in oklch, white 75%, var(--gray-300))" }}>
                  {testimonial.title} at {testimonial.company}
                </div>
              </div>
            </footer>
            <div className="metric-grid">
              <Metric value={`${testimonial.roi}x`} label="ROI Increase" />
              <Metric value={`${testimonial.timeSaved} hrs`} label="Saved per Week" />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function Metric({ value, label }) {
  return (
    <div className="metric">
      <strong>{value}</strong>
      <span>{label}</span>
    </div>
  );
}