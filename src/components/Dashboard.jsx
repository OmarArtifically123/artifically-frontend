import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api, { pick } from "../api";
import { toast } from "./Toast";

export default function Dashboard({ user, openAuth }) {
  const [deployments, setDeployments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // If no user is provided, don't attempt to load data
    if (!user) {
      setLoading(false);
      return;
    }

    const loadDeployments = async () => {
      try {
        setError(null);
        const response = await api.get("/deployments");
        const deploymentsData = pick("deployments")(response);
        setDeployments(deploymentsData || []);
      } catch (err) {
        console.error("Failed to load deployments:", err);
        setError(err);
        
        const res = err?.response?.data;
        if (res?.errors?.length) {
          toast(res.errors.map(e => `${e.field}: ${e.message}`).join(", "), { type: "error" });
        } else {
          toast(res?.message || "Failed to load deployments", { type: "error" });
        }
      } finally {
        setLoading(false);
      }
    };

    loadDeployments();
  }, [user]);

  // Handle case where user is not authenticated
  if (!user) {
    return (
      <div className="dashboard">
        <div className="container" style={{ textAlign: "center", padding: "60px 0" }}>
          <h2 style={{ color: "var(--white)", marginBottom: "16px" }}>
            Authentication Required
          </h2>
          <p style={{ color: "var(--gray-400)", marginBottom: "32px" }}>
            Please sign in to access your dashboard.
          </p>
          <button 
            className="btn btn-primary" 
            onClick={() => openAuth("signin")}
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  // Handle loading state
  if (loading) {
    return (
      <div className="dashboard">
        <div className="container" style={{ textAlign: "center", padding: "60px 0" }}>
          <div className="loading" style={{ width: "40px", height: "40px", margin: "0 auto" }}></div>
          <p style={{ color: "var(--gray-400)", marginTop: "16px" }}>
            Loading your dashboard...
          </p>
        </div>
      </div>
    );
  }

  // Handle error state
  if (error && deployments.length === 0) {
    return (
      <div className="dashboard">
        <div className="container" style={{ textAlign: "center", padding: "60px 0" }}>
          <h2 style={{ color: "var(--danger)", marginBottom: "16px" }}>
            Unable to Load Dashboard
          </h2>
          <p style={{ color: "var(--gray-400)", marginBottom: "32px" }}>
            We encountered an issue loading your deployments. Please try again.
          </p>
          <button 
            className="btn btn-primary" 
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

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

        {deployments.length === 0 ? (
          <div className="empty-state">
            <div style={{ textAlign: "center", padding: "48px 0" }}>
              <div style={{ 
                fontSize: "3rem", 
                marginBottom: "16px",
                opacity: 0.5 
              }}>
                🤖
              </div>
              <h3 style={{ 
                color: "var(--white)", 
                marginBottom: "8px",
                fontSize: "1.25rem" 
              }}>
                No Automations Yet
              </h3>
              <p style={{ 
                color: "var(--gray-400)", 
                marginBottom: "24px",
                maxWidth: "400px",
                margin: "0 auto 24px"
              }}>
                Browse the marketplace to deploy your first AI automation and start transforming your business operations.
              </p>
              <button 
                className="btn btn-primary" 
                onClick={() => navigate("/marketplace")}
              >
                Browse Marketplace
              </button>
            </div>
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
                    <summary>Configuration Details</summary>
                    <pre className="code">{JSON.stringify(d.placeholders, null, 2)}</pre>
                  </details>
                )}
              </div>
            ))}
          </div>
        )}

        {error && deployments.length > 0 && (
          <div style={{
            marginTop: "24px",
            padding: "16px",
            background: "rgba(239, 68, 68, 0.1)",
            border: "1px solid rgba(239, 68, 68, 0.3)",
            borderRadius: "8px",
            color: "var(--danger)",
            fontSize: "0.875rem"
          }}>
            Some data may not be up to date due to a connection issue.
          </div>
        )}
      </div>
    </div>
  );
}