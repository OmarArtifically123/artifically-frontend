import { useEffect, useState } from "react";
import { fetchAutomations } from "../data/automations";
import { toast } from "../components/Toast";

export default function Pricing() {
  const [automations, setAutomations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPricing = async () => {
      try {
        const list = await fetchAutomations();
        setAutomations(list || []);
      } catch (err) {
        const msg =
          err?.response?.data?.message ||
          err?.message ||
          "Failed to load pricing information";
        toast(msg, { type: "error" });
      } finally {
        setLoading(false);
      }
    };

    loadPricing();
  }, []);

  const formatPrice = (price, currency = "USD") =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      minimumFractionDigits: 0,
    }).format(price);

  return (
    <main className="container" style={{ padding: "48px 0", minHeight: "80vh" }}>
      <div style={{ textAlign: "center", marginBottom: "48px" }}>
        <h1 style={{ 
          fontSize: "2.5rem", 
          fontWeight: "800", 
          marginBottom: "16px",
          background: "linear-gradient(135deg, var(--white) 0%, var(--gray-300) 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text"
        }}>
          Transparent Pricing
        </h1>
        <p style={{ color: "var(--gray-400)", fontSize: "1.125rem", maxWidth: "600px", margin: "0 auto" }}>
          Pay per automation with generous usage limits. No hidden fees, no vendor lock-in, no surprise bills.
        </p>
      </div>

      <div className="glass" style={{ padding: "32px", borderRadius: "16px", marginBottom: "32px" }}>
        <h2 style={{ color: "var(--white)", marginBottom: "16px", textAlign: "center" }}>
          How Pricing Works
        </h2>
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", 
          gap: "24px",
          textAlign: "center"
        }}>
          <div>
            <div style={{ 
              width: "60px", 
              height: "60px", 
              background: "linear-gradient(135deg, var(--primary), var(--accent))",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 12px",
              fontSize: "1.5rem"
            }}>
              1
            </div>
            <h4 style={{ color: "var(--white)", marginBottom: "8px" }}>Choose Automation</h4>
            <p style={{ color: "var(--gray-400)", fontSize: "0.875rem" }}>
              Select from our marketplace of proven automations
            </p>
          </div>
          <div>
            <div style={{ 
              width: "60px", 
              height: "60px", 
              background: "linear-gradient(135deg, var(--primary), var(--accent))",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 12px",
              fontSize: "1.5rem"
            }}>
              2
            </div>
            <h4 style={{ color: "var(--white)", marginBottom: "8px" }}>Pay Monthly</h4>
            <p style={{ color: "var(--gray-400)", fontSize: "0.875rem" }}>
              Simple monthly subscription per automation
            </p>
          </div>
          <div>
            <div style={{ 
              width: "60px", 
              height: "60px", 
              background: "linear-gradient(135deg, var(--primary), var(--accent))",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 12px",
              fontSize: "1.5rem"
            }}>
              3
            </div>
            <h4 style={{ color: "var(--white)", marginBottom: "8px" }}>Use Freely</h4>
            <p style={{ color: "var(--gray-400)", fontSize: "0.875rem" }}>
              Generous usage limits with overage protection
            </p>
          </div>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "48px" }}>
          <div className="loading" style={{ width: "40px", height: "40px" }}></div>
          <p style={{ color: "var(--gray-400)", marginTop: "16px" }}>Loading pricing information...</p>
        </div>
      ) : automations.length === 0 ? (
        <div style={{ textAlign: "center", padding: "48px" }}>
          <p style={{ color: "var(--gray-400)", fontSize: "1.125rem" }}>
            Pricing information is currently unavailable. Please check back soon.
          </p>
        </div>
      ) : (
        <>
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", 
            gap: "24px",
            marginBottom: "48px"
          }}>
            {automations.map((automation) => (
              <div 
                key={automation.id}
                className="glass"
                style={{ 
                  padding: "32px", 
                  borderRadius: "16px",
                  textAlign: "center",
                  transition: "all 0.3s ease",
                  cursor: "pointer"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.borderColor = "var(--border-hover)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.borderColor = "var(--border-color)";
                }}
              >
                <div style={{ 
                  fontSize: "2rem", 
                  marginBottom: "16px",
                  filter: "drop-shadow(0 0 10px rgba(99, 102, 241, 0.3))"
                }}>
                  {automation.icon || "🤖"}
                </div>
                
                <h3 style={{ 
                  color: "var(--white)", 
                  marginBottom: "8px",
                  fontSize: "1.25rem",
                  fontWeight: "700"
                }}>
                  {automation.name}
                </h3>
                
                <div style={{ 
                  fontSize: "2rem", 
                  fontWeight: "800", 
                  color: "var(--primary-light)",
                  marginBottom: "8px"
                }}>
                  {formatPrice(automation.priceMonthly, automation.currency)}
                  <span style={{ fontSize: "1rem", color: "var(--gray-400)", fontWeight: "400" }}>
                    /month
                  </span>
                </div>
                
                <p style={{ 
                  color: "var(--gray-400)", 
                  marginBottom: "24px",
                  lineHeight: "1.6"
                }}>
                  {automation.description}
                </p>
                
                <div style={{ 
                  background: "var(--bg-glass)",
                  padding: "12px",
                  borderRadius: "8px",
                  marginBottom: "16px",
                  border: "1px solid var(--border-color)"
                }}>
                  <div style={{ color: "var(--success)", fontWeight: "600", fontSize: "0.875rem" }}>
                    {automation.requestLimit?.toLocaleString() || "Unlimited"} requests/month included
                  </div>
                </div>
                
                {automation.tags && automation.tags.length > 0 && (
                  <div style={{ 
                    display: "flex", 
                    flexWrap: "wrap", 
                    gap: "8px", 
                    justifyContent: "center",
                    marginTop: "16px"
                  }}>
                    {automation.tags.slice(0, 3).map((tag) => (
                      <span 
                        key={tag}
                        style={{ 
                          background: "var(--bg-glass)",
                          color: "var(--gray-300)",
                          padding: "4px 12px",
                          borderRadius: "12px",
                          fontSize: "0.75rem",
                          fontWeight: "500",
                          border: "1px solid var(--border-color)"
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="glass" style={{ padding: "32px", borderRadius: "16px", textAlign: "center" }}>
            <h3 style={{ color: "var(--white)", marginBottom: "16px" }}>
              Enterprise Pricing
            </h3>
            <p style={{ color: "var(--gray-400)", marginBottom: "24px" }}>
              Need custom automations or higher usage limits? We've got you covered.
            </p>
            <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
              <a 
                href="mailto:sales@artifically.com" 
                className="btn btn-primary"
                style={{ textDecoration: "none" }}
              >
                Contact Sales
              </a>
              <a 
                href="#" 
                className="btn btn-secondary"
                style={{ textDecoration: "none" }}
              >
                Schedule Demo
              </a>
            </div>
          </div>
        </>
      )}
    </main>
  );
}