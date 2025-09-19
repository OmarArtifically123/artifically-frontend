import { useState } from "react";
import automations from "./automations";
import AutomationCard from "./AutomationCard";
import DemoModal from "./DemoModal";
import { toast } from "./Toast";
import api from "./api";

export default function Marketplace({ user, openAuth }) {
  const [demo, setDemo] = useState(null);
  const buy = async (item) => {
    if (!user) {
      openAuth("signup");
      return;
    }
    if (!user.verified) {
      toast("Please verify your email before deploying automations.", { type: "warn" });
      return;
    }
    try {
      const res = await api.post("/deployments", {
        automationId: item.id,
        placeholders: {
          businessName: user.businessName,
          businessPhone: user.businessPhone,
          businessEmail: user.businessEmail,
          websiteUrl: user.websiteUrl
        },
      });
      toast(`Deployed ${item.name} successfully`, { type: "success" });
      // optionally redirect to dashboard
    } catch (e) {
      toast(e.message || "Purchase/deployment failed", { type: "error" });
    }
  };

  return (
    <section className="marketplace" id="marketplace">
      <div className="container">
        <div className="section-header">
          <h2>Automation Marketplace</h2>
          <p>Pick an automation. Launch in minutes.</p>
        </div>

        <div className="grid">
          {automations.map((item) => (
            <AutomationCard
              key={item.id}
              item={item}
              onDemo={setDemo}
              onBuy={buy}
            />
          ))}
        </div>
      </div>

      {demo && <DemoModal automation={demo} onClose={() => setDemo(null)} />}
    </section>
  );
}
