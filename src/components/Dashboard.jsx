import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api, { pick } from "../api";
import { toast } from "./Toast";
import ThemeToggle from "./ThemeToggle";
import { useTheme } from "../context/ThemeContext";

const statusColors = {
  active: { bg: "rgba(16,185,129,0.18)", color: "#10b981" },
  paused: { bg: "rgba(245,158,11,0.18)", color: "#b45309" },
  error: { bg: "rgba(239,68,68,0.18)", color: "#dc2626" },
};

export default function Dashboard({ user, openAuth }) {
  const { darkMode } = useTheme();
  const [deployments, setDeployments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
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
          toast(res.errors.map((e) => `${e.field}: ${e.message}`).join(", "), { type: "error" });
        } else {
          toast(res?.message || "Failed to load deployments", { type: "error" });
        }
      } finally {
        setLoading(false);
      }
    };

    loadDeployments();
  }, [user]);

  const formatPrice = useMemo(
    () =>
      (price, currency = "USD") =>
        new Intl.NumberFormat("en-US", {
          style: "currency",
          currency,
          minimumFractionDigits: 0,
        }).format(price),
    []
  );

  const renderGate = (title, message, action) => (
    <section
      style={{
        padding: "5rem 0",
        textAlign: "center",
        color: darkMode ? "#e2e8f0" : "#1f2937",
      }}
    >
      <div
        className="container"
        style={{
          background: darkMode ? "rgba(15,23,42,0.75)" : "rgba(255,255,255,0.9)",
          borderRadius: "1.5rem",
          padding: "3rem",
          border: `1px solid ${darkMode ? "rgba(148,163,184,0.25)" : "rgba(148,163,184,0.35)"}`,
          boxShadow: darkMode
            ? "0 40px 70px rgba(8, 15, 34, 0.55)"
            : "0 40px 70px rgba(148, 163, 184, 0.35)",
        }}
      >
        <h2 style={{ fontSize: "2rem", marginBottom: "1rem" }}>{title}</h2>
        <p style={{ color: darkMode ? "#94a3b8" : "#475569", marginBottom: "2rem" }}>{message}</p>
        {action}
      </div>
    </section>
  );

  if (!user) {
    return renderGate(
      "Authentication Required",
      "Please sign in to access your dashboard.",
      <button className="btn btn-primary" onClick={() => openAuth("signin")}>Sign In</button>
    );
  }

  if (loading) {
    return renderGate(
      "Loading your dashboard",
      "We’re fetching your latest deployment metrics.",
      <div className="loading" style={{ width: "40px", height: "40px", margin: "0 auto" }}></div>
    );
  }

  if (error && deployments.length === 0) {
    return renderGate(
      "Unable to Load Dashboard",
      "We encountered an issue loading your deployments. Please try again.",
      <button className="btn btn-primary" onClick={() => window.location.reload()}>Retry</button>
    );
  }

  return (
    <section className="dashboard" style={{ padding: "5rem 0" }}>
      <div className="container" style={{ display: "grid", gap: "2rem" }}>
        <div
          className="dashboard-header"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "1rem",
            background: darkMode ? "rgba(15,23,42,0.75)" : "rgba(255,255,255,0.95)",
            padding: "1.5rem",
            borderRadius: "1.25rem",
            border: `1px solid ${darkMode ? "rgba(148,163,184,0.25)" : "rgba(148,163,184,0.35)"}`,
          }}
        >
          <div>
            <h1 style={{ fontSize: "1.8rem", fontWeight: 700 }}>
              Welcome back, {user.businessName || user.email}
            </h1>
            <p style={{ color: darkMode ? "#94a3b8" : "#475569" }}>Your deployed automations and usage</p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <ThemeToggle />
            <button className="btn btn-primary" onClick={() => navigate("/marketplace")}>
              + Add Automation
            </button>
          </div>
        </div>

        {deployments.length === 0 ? (
          <div
            className="empty-state"
            style={{
              textAlign: "center",
              padding: "4rem",
              borderRadius: "1.5rem",
              border: `1px solid ${darkMode ? "rgba(148,163,184,0.25)" : "rgba(148,163,184,0.35)"}`,
              background: darkMode ? "rgba(15,23,42,0.7)" : "rgba(255,255,255,0.95)",
            }}
          >
            <div style={{ fontSize: "3rem", marginBottom: "1rem", opacity: 0.6 }}>🤖</div>
            <h3 style={{ fontSize: "1.4rem", marginBottom: "0.5rem" }}>No Automations Yet</h3>
            <p style={{ color: darkMode ? "#94a3b8" : "#475569", maxWidth: "400px", margin: "0 auto 1.5rem" }}>
              Browse the marketplace to deploy your first AI automation and start transforming your business operations.
            </p>
            <button className="btn btn-primary" onClick={() => navigate("/marketplace")}>
              Browse Marketplace
            </button>
          </div>
        ) : (
          <div
            className="deployments-list"
            style={{
              display: "grid",
              gap: "1.5rem",
            }}
          >
            {deployments.map((deployment) => {
              const status = (deployment.status || "active").toLowerCase();
              const colors = statusColors[status] || statusColors.active;
              const usagePercent = deployment.requestLimit
                ? Math.min(100, Math.round((deployment.requestsUsed / deployment.requestLimit) * 100))
                : null;

              return (
                <article
                  key={deployment.id}
                  style={{
                    borderRadius: "1.25rem",
                    border: `1px solid ${darkMode ? "rgba(148,163,184,0.25)" : "rgba(148,163,184,0.35)"}`,
                    padding: "1.75rem",
                    background: darkMode
                      ? "linear-gradient(145deg, rgba(15,23,42,0.8), rgba(30,41,59,0.85))"
                      : "linear-gradient(145deg, rgba(255,255,255,0.97), rgba(241,245,249,0.94))",
                    boxShadow: darkMode
                      ? "0 30px 55px rgba(8, 15, 34, 0.45)"
                      : "0 30px 55px rgba(148, 163, 184, 0.3)",
                    display: "grid",
                    gap: "1.25rem",
                  }}
                >
                  <header
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: "1rem",
                      flexWrap: "wrap",
                    }}
                  >
                    <div>
                      <h2 style={{ fontSize: "1.35rem", fontWeight: 700 }}>
                        {deployment.automation?.name || "Automation"}
                      </h2>
                      <p style={{ color: darkMode ? "#94a3b8" : "#475569" }}>
                        {deployment.automation?.description || "Deployed workflow"}
                      </p>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                      <span
                        style={{
                          padding: "0.35rem 0.75rem",
                          borderRadius: "0.75rem",
                          fontSize: "0.8rem",
                          fontWeight: 700,
                          textTransform: "uppercase",
                          background: colors.bg,
                          color: colors.color,
                        }}
                      >
                        {status}
                      </span>
                      {deployment.automation?.priceMonthly && (
                        <span style={{ color: darkMode ? "#cbd5e1" : "#475569" }}>
                          {formatPrice(deployment.automation.priceMonthly, deployment.automation.currency)}/mo
                        </span>
                      )}
                    </div>
                  </header>

                  {usagePercent !== null && (
                    <div style={{ display: "grid", gap: "0.5rem" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", color: darkMode ? "#cbd5e1" : "#475569" }}>
                        <span>Usage this month</span>
                        <span>
                          {deployment.requestsUsed}/{deployment.requestLimit} ({usagePercent}%)
                        </span>
                      </div>
                      <div
                        style={{
                          width: "100%",
                          height: "10px",
                          borderRadius: "999px",
                          background: darkMode ? "rgba(148,163,184,0.2)" : "rgba(148,163,184,0.3)",
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            width: `${usagePercent}%`,
                            height: "100%",
                            background: "linear-gradient(90deg, #6366f1, #06b6d4)",
                          }}
                        />
                      </div>
                    </div>
                  )}

                  {deployment.placeholders && (
                    <details
                      style={{
                        background: darkMode ? "rgba(15,23,42,0.75)" : "rgba(255,255,255,0.95)",
                        borderRadius: "1rem",
                        border: `1px solid ${darkMode ? "rgba(148,163,184,0.2)" : "rgba(148,163,184,0.3)"}`,
                        padding: "1rem 1.25rem",
                      }}
                    >
                      <summary style={{ cursor: "pointer", fontWeight: 600 }}>Configuration Details</summary>
                      <pre
                        style={{
                          marginTop: "0.75rem",
                          background: darkMode ? "rgba(15,23,42,0.85)" : "rgba(15,23,42,0.85)",
                          color: "#f8fafc",
                          padding: "1rem",
                          borderRadius: "0.85rem",
                          fontFamily: "var(--font-mono)",
                          fontSize: "0.85rem",
                          overflowX: "auto",
                        }}
                      >
                        {JSON.stringify(deployment.placeholders, null, 2)}
                      </pre>
                    </details>
                  )}
                </article>
              );
            })}
          </div>
        )}

        {error && deployments.length > 0 && (
          <div
            role="alert"
            style={{
              marginTop: "0.5rem",
              padding: "1rem 1.25rem",
              borderRadius: "1rem",
              border: `1px solid ${darkMode ? "rgba(239,68,68,0.4)" : "rgba(239,68,68,0.5)"}`,
              background: darkMode ? "rgba(239,68,68,0.15)" : "rgba(254,226,226,0.85)",
              color: darkMode ? "#fca5a5" : "#b91c1c",
              textAlign: "center",
            }}
          >
            Some data may not be up to date due to a connection issue.
          </div>
        )}
      </div>
    </section>
  );
}