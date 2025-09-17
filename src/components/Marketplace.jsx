import { useEffect, useState } from "react";
import { automations } from "../data/automations";
import AutomationCard from "./AutomationCard";
import DemoModal from "./DemoModal";
import axios from "axios";

export default function Marketplace({ user, onRequireAuth, onNotify }) {
  const [selectedDemo, setSelectedDemo] = useState(null);
  const [loading, setLoading] = useState(false);

  const buyAndDeploy = async (automation) => {
    if (!user) {
      onRequireAuth();
      return;
    }
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      // For now, simulate purchase and immediate deployment (Stripe can be added later)
      const res = await axios.post(
        "/api/deployments",
        {
          automationId: automation.id,
          placeholders: {} // backend will seed defaults based on user's profile
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      onNotify(`Deployed ${automation.name} for ${user.businessName}.`);
    } catch (e) {
      onNotify("Purchase/deployment failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="marketplace" id="marketplace">
      <div className="container">
        <div className="section-header">
          <h2>Automation Marketplace</h2>
          <p>Per-automation pricing with clear request limits</p>
        </div>
        <div className="automation-grid">
          {automations.map((a) => (
            <AutomationCard
              key={a.id}
              item={a}
              onDemo={(it) => setSelectedDemo(it)}
              onBuy={buyAndDeploy}
            />
          ))}
        </div>
      </div>

      {selectedDemo && (
        <DemoModal
          automation={selectedDemo}
          onClose={() => setSelectedDemo(null)}
        />
      )}

      {loading && (
        <div className="toast">Processing…</div>
      )}
    </section>
  );
}
