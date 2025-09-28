import { useEffect, useState } from "react";
import { fetchAutomations } from "../data/automations";
import AutomationCard from "./AutomationCard";
import DemoModal from "./DemoModal";
import { toast } from "./Toast";
import api from "../api";
import ThemeToggle from "./ThemeToggle";
import { useTheme } from "../context/ThemeContext";
import { warmupWasm, wasmAverage } from "../lib/wasmMath";

export default function Marketplace({ user, openAuth }) {
  const { darkMode } = useTheme();
  const [demo, setDemo] = useState(null);
  const [automations, setAutomations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [averageROI, setAverageROI] = useState(null);

  useEffect(() => {
    warmupWasm();

    const loadAutomations = async () => {
      try {
        setLoading(true);
        setError(null);
        const list = await fetchAutomations();
        if (!Array.isArray(list)) {
          throw new Error("Invalid data format received");
        }
        setAutomations(list);

        const roiValues = list.map((item) => Math.round((item.roi || 4.2) * 100));
        wasmAverage(roiValues)
          .then((avg) => setAverageROI(Number((avg / 100).toFixed(2))))
          .catch((err) => console.warn("Failed to compute ROI average", err));
      } catch (err) {
        console.error("Error loading automations:", err);
        setAutomations([]);
        setError(err);
        toast(err?.message || "Failed to load automations", { type: "error" });
      } finally {
        setLoading(false);
      }
    };

    loadAutomations();
  }, []);

  const buy = async (item) => {
    if (!item || !item.id) {
      toast("Invalid automation selected", { type: "error" });
      return;
    }

    if (!user) {
      openAuth("signup");
      return;
    }

    if (!user.verified) {
      toast("Please verify your email before deploying automations.", { type: "warn" });
      return;
    }

    try {
      const deploymentData = {
        automationId: item.id,
        placeholders: {
          businessName: user.businessName || "",
          businessPhone: user.businessPhone || "",
          businessEmail: user.businessEmail || "",
          websiteUrl: user.websiteUrl || "",
        },
      };

      await api.post("/deployments", deploymentData);
      toast(`Successfully deployed ${item.name || "automation"}`, { type: "success" });
    } catch (err) {
      console.error("Deployment error:", err);
      const res = err?.response?.data;
      if (res?.errors?.length) {
        toast(res.errors.map((e) => `${e.field}: ${e.message}`).join(", "), { type: "error" });
      } else {
        const errorMessage = res?.message || err?.message || "Deployment failed";
        toast(errorMessage, { type: "error" });
      }
    }
  };

  const handleDemo = (item) => {
    if (!item || !item.id) {
      toast("Invalid automation selected", { type: "error" });
      return;
    }
    setDemo(item);
  };

  const sectionHeader = (
    <div
      className="section-header"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "1rem",
          flexWrap: "wrap",
        }}
      >
        <div>
          <h2 style={{ fontSize: "2.4rem", fontWeight: 800 }}>Automation Marketplace</h2>
          <p style={{ color: darkMode ? "#94a3b8" : "#475569" }}>
            Pick an automation, preview the workflow, and deploy with glassmorphism-rich previews.
          </p>
        </div>
        <ThemeToggle />
      </div>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "0.75rem",
        }}
      >
        {[
          "Instant deployments",
          "Security reviews",
          "Theme-aware demos",
          averageROI ? `Avg ROI ${averageROI}x` : null,
        ]
          .filter(Boolean)
          .map((tag) => (
          <span
            key={tag}
            style={{
              padding: "0.4rem 0.75rem",
              borderRadius: "0.8rem",
              background: darkMode ? "rgba(148,163,184,0.18)" : "rgba(99,102,241,0.12)",
              border: `1px solid ${darkMode ? "rgba(148,163,184,0.32)" : "rgba(99,102,241,0.25)"}`,
              fontSize: "0.85rem",
              fontWeight: 600,
              color: darkMode ? "#cbd5e1" : "#1f2937",
            }}
          >
            {tag}
          </span>
          ))}
      </div>
    </div>
  );

  if (loading) {
    return (
      <section
        className="marketplace"
        id="marketplace"
        data-glass="true"
        style={{ padding: "5rem 0" }}
      >
        <div className="container" style={{ display: "grid", gap: "2rem" }}>
          {sectionHeader}
          <div
            style={{
              textAlign: "center",
              padding: "4rem 0",
              borderRadius: "1.5rem",
              border: `1px solid ${darkMode ? "rgba(148,163,184,0.25)" : "rgba(148,163,184,0.35)"}`,
              background: darkMode
                ? "linear-gradient(145deg, rgba(15,23,42,0.75), rgba(30,41,59,0.82))"
                : "linear-gradient(145deg, rgba(255,255,255,0.95), rgba(241,245,249,0.92))",
            }}
          >
            <div className="loading" style={{ width: "40px", height: "40px", margin: "0 auto" }}></div>
            <p style={{ color: darkMode ? "#94a3b8" : "#475569", marginTop: "1rem" }}>Loading automations…</p>
          </div>
        </div>
      </section>
    );
  }

  if (error && automations.length === 0) {
    return (
      <section
        className="marketplace"
        id="marketplace"
        data-glass="true"
        style={{ padding: "5rem 0" }}
      >
        <div className="container" style={{ display: "grid", gap: "2rem" }}>
          {sectionHeader}
          <div
            style={{
              textAlign: "center",
              padding: "4rem 0",
              borderRadius: "1.5rem",
              border: `1px solid ${darkMode ? "rgba(248,113,113,0.4)" : "rgba(248,113,113,0.5)"}`,
              background: darkMode
                ? "linear-gradient(145deg, rgba(127,29,29,0.45), rgba(15,23,42,0.85))"
                : "linear-gradient(145deg, rgba(254,226,226,0.95), rgba(254,242,242,0.9))",
              color: darkMode ? "#fecaca" : "#b91c1c",
            }}
          >
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>⚠️</div>
            <h3 style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>Unable to Load Marketplace</h3>
            <p style={{ maxWidth: "420px", margin: "0 auto 1.5rem" }}>
              We're having trouble loading the automation marketplace. Please check your connection and try again.
            </p>
            <button className="btn btn-primary" onClick={() => window.location.reload()}>
              Retry
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      className="marketplace"
      id="marketplace"
      data-glass="true"
      style={{ padding: "5rem 0" }}
    >
      <div className="container" style={{ display: "grid", gap: "2.5rem" }}>
        {sectionHeader}

        {error && automations.length > 0 && (
          <div
            role="alert"
            style={{
              padding: "1rem 1.25rem",
              borderRadius: "1rem",
              border: `1px solid ${darkMode ? "rgba(245,158,11,0.4)" : "rgba(245,158,11,0.5)"}`,
              background: darkMode ? "rgba(245,158,11,0.12)" : "rgba(245,158,11,0.18)",
              color: darkMode ? "#fbbf24" : "#b45309",
              textAlign: "center",
            }}
          >
            Some automations may not be displayed due to a connection issue.
          </div>
        )}

        {automations.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "4rem 0",
              borderRadius: "1.5rem",
              border: `1px solid ${darkMode ? "rgba(148,163,184,0.25)" : "rgba(148,163,184,0.35)"}`,
            }}
          >
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🤔</div>
            <h3 style={{ fontSize: "1.4rem", marginBottom: "0.75rem" }}>No automations found</h3>
            <p style={{ color: darkMode ? "#94a3b8" : "#475569" }}>
              Check back soon—new automations are added every week.
            </p>
          </div>
        ) : (
          <div
            className="automation-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "1.5rem",
            }}
          >
            {automations.map((item) => (
              <AutomationCard key={item.id} item={item} onDemo={handleDemo} onBuy={buy} />
            ))}
          </div>
        )}
      </div>

      {demo && <DemoModal automation={demo} onClose={() => setDemo(null)} />}
    </section>
  );
}