import { useEffect, useState } from "react";
import { fetchAutomations } from "../data/automations";
import { toast } from "../components/Toast";

export default function Pricing() {
  const [automations, setAutomations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const list = await fetchAutomations();
        setAutomations(list || []);
      } catch (err) {
        const msg =
          err?.response?.data?.message ||
          err?.message ||
          "Failed to load pricing";
        toast(msg, { type: "error" });
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <main className="container" style={{ padding: "48px 0" }}>
      <h1>Pricing</h1>
      <p style={{ color: "var(--gray-600)", marginTop: 8 }}>
        Pay per automation with generous request limits. No “all-you-can-eat”
        subscriptions.
      </p>

      {loading ? (
        <p style={{ marginTop: 16 }}>Loading pricing…</p>
      ) : automations.length === 0 ? (
        <p style={{ marginTop: 16 }}>No automations available right now.</p>
      ) : (
        <ul style={{ marginTop: 16, lineHeight: 2 }}>
          {automations.map((a) => (
            <li key={a.id}>
              {a.name} — <b>${a.priceMonthly}/mo</b> —{" "}
              {a.requestLimit.toLocaleString()} requests
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
