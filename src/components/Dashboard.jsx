import { useEffect, useState } from "react";
import axios from "axios";

export default function Dashboard({ user }) {
  const [deployments, setDeployments] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    axios.get("/api/deployments", { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => setDeployments(res.data.deployments || []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="dashboard active">
      <div className="container">
        <div className="dashboard-header">
          <div>
            <h1>Welcome back, {user.businessName}</h1>
            <p style={{ color: "var(--gray-600)" }}>
              Your deployed automations and usage
            </p>
          </div>
          <a href="#marketplace" className="btn btn-primary">+ Add Automation</a>
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
                  <div className="deployment-title">{d.automationName}</div>
                  <div className="deployment-plan">${d.priceMonthly}/mo</div>
                </div>
                <div className="deployment-body">
                  <div><b>Status:</b> {d.status}</div>
                  <div><b>Requests this month:</b> {d.requestsUsed}/{d.requestLimit}</div>
                </div>
                <details className="deployment-details">
                  <summary>Placeholders</summary>
                  <pre className="code">{JSON.stringify(d.placeholders, null, 2)}</pre>
                </details>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
