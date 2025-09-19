import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api, { pick } from "../api";
import { toast } from "./Toast";

export default function Dashboard({ user, openAuth }) {
  const [deployments, setDeployments] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      openAuth("signin");
      return;
    }
    api.get("/deployments")
      .then(pick("deployments"))
      .then((list) => setDeployments(list || []))
      .catch((err) => {
        const res = err?.response?.data;
        if (res?.errors?.length) {
          toast(res.errors.map(e => `${e.field}: ${e.message}`).join(", "), { type: "error" });
        } else {
          toast(res?.message || "Failed to load deployments", { type: "error" });
        }
      })
      .finally(() => setLoading(false));
  }, [user]);

  if (!user) return null;

  const formatPrice = (price, currency = "USD") =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      minimumFractionDigits: 0,
    }).format(price);

  return (
    <div className="dashboard active">
      <div className="container">
        <div className="dashboard-header">
          <div>
            <h1>Welcome back, {user.businessName || user.email}</h1>
            <p style={{ color: "var(--gray-600)" }}>Your deployed automations and usage</p>
          </div>
          <button className="btn btn-primary" onClick={() => navigate("/marketplace")}>
            + Add Automation
          </button>
        </div>

        {loading ? (
          <div>Loading…</div>
        ) : deployments.length === 0 ? (
          <div className="empty-state">
            <p>No automations yet. Browse the marketplace to get started.</p>
          </div>
        ) : (
          <div className="deployments-list">
            {deployments.map((d) => (
              <div className="deployment-card" key={d.id}>
                <div className="deployment-head">
                  <div className="deployment-title">{d.automation?.name || "Automation"}</div>
                  {d.automation?.priceMonthly ? (
                    <div className="deployment-plan">
                      {formatPrice(d.automation.priceMonthly, d.automation.currency)}/mo
                    </div>
                  ) : null}
                </div>
                <div className="deployment-body">
                  <div><b>Status:</b> {d.status || "active"}</div>
                  {typeof d.requestsUsed !== "undefined" && typeof d.requestLimit !== "undefined" && (
                    <div><b>Requests this month:</b> {d.requestsUsed}/{d.requestLimit}</div>
                  )}
                </div>
                {d.placeholders && (
                  <details className="deployment-details">
                    <summary>Placeholders</summary>
                    <pre className="code">{JSON.stringify(d.placeholders, null, 2)}</pre>
                  </details>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
