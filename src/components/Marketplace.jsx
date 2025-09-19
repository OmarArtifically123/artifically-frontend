import { useEffect, useState } from "react";
import { fetchAutomations } from "./automations";
import AutomationCard from "./AutomationCard";
import DemoModal from "./DemoModal";
import { toast } from "./Toast";
import api from "./api";

export default function Marketplace({ user, openAuth }) {
  const [demo, setDemo] = useState(null);
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
          "Failed to load automations";
        toast(msg, { type: "error" });
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const buy = async (item) => {
    if (!user) {
      openAuth("signup");
      return;
    }
    if (!user.verified) {
      toast("Please verify your email before deploying automations.", {
        type: "warn",
      });
      return;
    }
    try {
      await api.post("/deployments", {
        automationId: item.id,
        placeholders: {
          businessName: user.businessName,
          businessPhone: user.businessPhone,
          businessEmail: user.businessEmail,
          websiteUrl: user.websiteUrl,
        },
      });
      toast(`Deployed ${item.name} successfully`, { type: "success" });
      // optionally redirect to dashboard
    } catch (err) {
      const res = err?.response?.data;
      if (res?.errors?.length) {
        toast(
          res.errors.map((e) => `${e.field}: ${e.message}`).join(", "),
          { type: "error" }
        );
      } else {
        toast(res?.message || "Purchase/deployment failed", {
          type: "error",
        });
      }
    }
  };

  return (
    <section className="marketplace" id="marketplace">
      <div className="container">
        <div className="section-header">
          <h2>Automation Marketplace</h2>
          <p>Pick an automation. Launch in minutes.</p>
        </div>

        {loading ? (
          <p>Loading automations…</p>
        ) : automations.length === 0 ? (
          <p>No automations available right now.</p>
        ) : (
          <div className="automation-grid">
            {automations.map((item) => (
              <AutomationCard
                key={item.id}
                item={item}
                onDemo={setDemo}
                onBuy={buy}
              />
            ))}
          </div>
        )}
      </div>

      {demo && <DemoModal automation={demo} onClose={() => setDemo(null)} />}
    </section>
  );
}
