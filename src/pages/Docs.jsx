import { Link } from "react-router-dom";

export default function Docs() {
  return (
    <main className="container" style={{ padding: "48px 0" }}>
      <h1>Documentation</h1>
      <p style={{ color: "var(--gray-600)", marginTop: 8 }}>
        Learn how to connect integrations, configure placeholders, and deploy automations.
      </p>

      <section style={{ marginTop: 32 }}>
        <h2>Getting Started</h2>
        <ol style={{ marginTop: 12, lineHeight: 2 }}>
          <li>
            <Link to="/pricing">Sign up</Link> and add your business details.
          </li>
          <li>
            Browse the <Link to="/marketplace">Marketplace</Link> and pick an automation.
          </li>
          <li>Provide placeholders (hours, timezone, phone, etc.).</li>
          <li>Deploy and monitor runs from your dashboard.</li>
        </ol>
      </section>

      <section style={{ marginTop: 32 }}>
        <h2>Placeholders</h2>
        <p style={{ marginTop: 8, color: "var(--gray-600)" }}>
          Each automation requires different inputs. For example:
        </p>
        <ul style={{ marginTop: 12, lineHeight: 1.8 }}>
          <li>
            <b>AI Receptionist:</b> businessName, businessPhone, workingHours,
            timezone, brandTone
          </li>
          <li>
            <b>Lead Scorer:</b> crmProvider, leadScoreThreshold,
            salesSlackChannel
          </li>
          <li>
            <b>Cart Recovery Bot:</b> ecommercePlatform, discountCode,
            whatsappNumber
          </li>
        </ul>
      </section>

      <section style={{ marginTop: 32 }}>
        <h2>Security & Payments</h2>
        <p style={{ marginTop: 8, color: "var(--gray-600)" }}>
          All data is validated and stored securely. Payments are handled via
          <b> Stripe</b>, and receipts are emailed automatically.
        </p>
      </section>
    </main>
  );
}
