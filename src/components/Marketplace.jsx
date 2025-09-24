import { useEffect, useState } from "react";
import { fetchAutomations } from "../data/automations";
import AutomationCard from "./AutomationCard";
import DemoModal from "./DemoModal";
import { toast } from "./Toast";
import api from "../api";

export default function Marketplace({ user, openAuth }) {
  const [demo, setDemo] = useState(null);
  const [automations, setAutomations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadAutomations = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const list = await fetchAutomations();
        
        // Additional validation - the fetchAutomations should handle this,
        // but we add a safety net here
        if (list === null || list === undefined) {
          console.warn("fetchAutomations returned null/undefined, using empty array");
          setAutomations([]);
        } else if (!Array.isArray(list)) {
          console.error("fetchAutomations returned non-array:", typeof list, list);
          setAutomations([]);
          setError(new Error("Invalid data format received"));
        } else {
          setAutomations(list);
        }
        
      } catch (err) {
        console.error("Error loading automations:", err);
        setError(err);
        setAutomations([]); // Ensure we always have an array
        
        // Show user-friendly error message
        const errorMessage = err?.message || "Failed to load automations";
        toast(errorMessage, { type: "error" });
        
      } finally {
        setLoading(false);
      }
    };

    loadAutomations();
  }, []);

  const buy = async (item) => {
    // Validate item before proceeding
    if (!item || !item.id) {
      toast("Invalid automation selected", { type: "error" });
      return;
    }

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
      toast(`Successfully deployed ${item.name || 'automation'}`, { type: "success" });
      
    } catch (err) {
      console.error("Deployment error:", err);
      
      const res = err?.response?.data;
      if (res?.errors?.length) {
        toast(
          res.errors.map((e) => `${e.field}: ${e.message}`).join(", "),
          { type: "error" }
        );
      } else {
        const errorMessage = res?.message || err?.message || "Deployment failed";
        toast(errorMessage, { type: "error" });
      }
    }
  };

  const handleDemo = (item) => {
    // Validate item before opening demo
    if (!item || !item.id) {
      toast("Invalid automation selected", { type: "error" });
      return;
    }
    setDemo(item);
  };

  // Loading state
  if (loading) {
    return (
      <section className="marketplace" id="marketplace">
        <div className="container">
          <div className="section-header">
            <h2>Automation Marketplace</h2>
            <p>Pick an automation. Launch in minutes.</p>
          </div>
          <div style={{ textAlign: "center", padding: "48px 0" }}>
            <div className="loading" style={{ width: "40px", height: "40px", margin: "0 auto" }}></div>
            <p style={{ color: "var(--gray-400)", marginTop: "16px" }}>
              Loading automations...
            </p>
          </div>
        </div>
      </section>
    );
  }

  // Error state (when we couldn't load any data)
  if (error && automations.length === 0) {
    return (
      <section className="marketplace" id="marketplace">
        <div className="container">
          <div className="section-header">
            <h2>Automation Marketplace</h2>
            <p>Pick an automation. Launch in minutes.</p>
          </div>
          <div style={{ textAlign: "center", padding: "48px 0" }}>
            <div style={{ 
              fontSize: "3rem", 
              marginBottom: "16px",
              opacity: 0.5 
            }}>
              ⚠️
            </div>
            <h3 style={{ 
              color: "var(--danger)", 
              marginBottom: "8px",
              fontSize: "1.25rem" 
            }}>
              Unable to Load Marketplace
            </h3>
            <p style={{ 
              color: "var(--gray-400)", 
              marginBottom: "24px",
              maxWidth: "400px",
              margin: "0 auto 24px"
            }}>
              We're having trouble loading the automation marketplace. Please check your connection and try again.
            </p>
            <button 
              className="btn btn-primary" 
              onClick={() => window.location.reload()}
            >
              Retry
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="marketplace" id="marketplace">
      <div className="container">
        <div className="section-header">
          <h2>Automation Marketplace</h2>
          <p>Pick an automation. Launch in minutes.</p>
        </div>

        {/* Show warning if we had errors but still have some data */}
        {error && automations.length > 0 && (
          <div style={{
            marginBottom: "24px",
            padding: "16px",
            background: "rgba(245, 158, 11, 0.1)",
            border: "1px solid rgba(245, 158, 11, 0.3)",
            borderRadius: "8px",
            color: "var(--warning)",
            fontSize: "0.875rem",
            textAlign: "center"
          }}>
            Some automations may not be displayed due to a connection issue.
          </div>
        )}

        {automations.length === 0 ? (
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
              No Automations Available
            </h3>
            <p style={{ 
              color: "var(--gray-400)", 
              maxWidth: "400px",
              margin: "0 auto"
            }}>
              The marketplace is currently empty. New automations are added regularly, so check back soon!
            </p>
          </div>
        ) : (
          <div className="automation-grid">
            {automations.map((item) => (
              <AutomationCard
                key={item.id || `automation-${Math.random()}`} // Fallback key
                item={item}
                onDemo={handleDemo}
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