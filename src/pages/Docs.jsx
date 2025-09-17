export default function Docs() {
  return (
    <main className="container" style={{ padding: "48px 0" }}>
      <h1>Docs</h1>
      <p style={{ color: "var(--gray-600)", marginTop: 8 }}>
        Learn how to connect integrations, configure placeholders, and deploy automations.
      </p>
      <ol style={{ marginTop: 16, lineHeight: 2 }}>
        <li>Sign up and add your business details.</li>
        <li>Pick an automation from the marketplace.</li>
        <li>Provide placeholders (hours, timezone, phone, etc.).</li>
        <li>Deploy and monitor runs from your dashboard.</li>
      </ol>
    </main>
  );
}
