export default function Pricing() {
  return (
    <main className="container" style={{ padding: "48px 0" }}>
      <h1>Pricing</h1>
      <p style={{ color: "var(--gray-600)", marginTop: 8 }}>
        Pay per automation with generous request limits. No “all-you-can-eat” subscriptions.
      </p>
      <ul style={{ marginTop: 16, lineHeight: 2 }}>
        <li>AI Receptionist — <b>$200/mo</b> — 10,000 requests</li>
        <li>Lead Scorer & Router — <b>$250/mo</b> — 50,000 requests</li>
        <li>Invoice Matcher — <b>$180/mo</b> — 12,000 requests</li>
        <li>Review Responder — <b>$120/mo</b> — 20,000 requests</li>
        <li>Trend Radar — <b>$160/mo</b> — 15,000 requests</li>
        <li>Cart Recovery Bot — <b>$140/mo</b> — 30,000 requests</li>
      </ul>
    </main>
  );
}
