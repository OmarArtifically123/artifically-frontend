import CTABackground from "./CTABackground";

export default function FinalCTASection({ onSubmit }) {
  return (
    <section className="section-shell" aria-labelledby="final-cta-title">
      <article className="final-cta">
        <CTABackground variant="gradient-mesh" />
        <div className="final-cta__content">
          <h2 id="final-cta-title" className="final-cta__headline">
            Ready to Transform Your Operations?
          </h2>
          <p className="final-cta__subheadline">
            Join thousands of companies automating with Artifically.
          </p>
          <form className="cta-form" onSubmit={handleSubmit(onSubmit)}>
            <label htmlFor="cta-email" className="sr-only">
              Work email
            </label>
            <input id="cta-email" name="email" type="email" placeholder="Enter your work email" required />
            <button type="submit">Start Free Trial</button>
          </form>
          <ul className="trust-signals" role="list">
            <li>
              <span aria-hidden="true">✅</span> No credit card required
            </li>
            <li>
              <span aria-hidden="true">✅</span> Free for 14 days
            </li>
            <li>
              <span aria-hidden="true">✅</span> Cancel anytime
            </li>
          </ul>
        </div>
      </article>
    </section>
  );
}

function handleSubmit(onSubmit) {
  return (event) => {
    event.preventDefault();
    if (!onSubmit) return;
    const formData = new FormData(event.currentTarget);
    const email = formData.get("email");
    onSubmit({ email });
  };
}