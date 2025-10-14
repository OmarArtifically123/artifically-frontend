export default function FinalCTASection({ onSubmit }) {
  return (
    <section className="section-shell" aria-labelledby="final-cta-title">
      <article className="final-cta">
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
          <div className="trust-signals">
            <span>✅ No credit card required</span>
            <span>✅ Free for 14 days</span>
            <span>✅ Cancel anytime</span>
          </div>
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