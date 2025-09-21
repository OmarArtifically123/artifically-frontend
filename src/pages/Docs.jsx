import { Link } from "react-router-dom";

export default function Docs() {
  return (
    <main className="container" style={{ padding: "48px 0", minHeight: "80vh" }}>
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
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
            Documentation
          </h1>
          <p style={{ color: "var(--gray-400)", fontSize: "1.125rem" }}>
            Everything you need to deploy and manage AI automations at scale
          </p>
        </div>

        <div style={{ display: "grid", gap: "32px" }}>
          <section className="glass" style={{ padding: "32px", borderRadius: "16px" }}>
            <h2 style={{ 
              fontSize: "1.5rem", 
              fontWeight: "700", 
              marginBottom: "16px",
              color: "var(--white)"
            }}>
              Quick Start Guide
            </h2>
            <div style={{ color: "var(--gray-300)", lineHeight: "1.8" }}>
              <ol style={{ paddingLeft: "24px", marginTop: "16px" }}>
                <li style={{ marginBottom: "12px" }}>
                  <Link to="/pricing" style={{ color: "var(--primary-light)", textDecoration: "none" }}>
                    Create your account
                  </Link> and complete business verification
                </li>
                <li style={{ marginBottom: "12px" }}>
                  Browse the <Link to="/marketplace" style={{ color: "var(--primary-light)", textDecoration: "none" }}>
                    Marketplace
                  </Link> and select your automation
                </li>
                <li style={{ marginBottom: "12px" }}>
                  Configure automation parameters and integration settings
                </li>
                <li style={{ marginBottom: "12px" }}>
                  Deploy with one click and monitor from your dashboard
                </li>
              </ol>
            </div>
          </section>

          <section className="glass" style={{ padding: "32px", borderRadius: "16px" }}>
            <h2 style={{ 
              fontSize: "1.5rem", 
              fontWeight: "700", 
              marginBottom: "16px",
              color: "var(--white)"
            }}>
              Configuration Parameters
            </h2>
            <p style={{ color: "var(--gray-400)", marginBottom: "16px" }}>
              Each automation requires specific configuration inputs for optimal performance:
            </p>
            <div style={{ display: "grid", gap: "16px", marginTop: "16px" }}>
              <div style={{ 
                background: "var(--bg-glass)", 
                padding: "16px", 
                borderRadius: "12px",
                border: "1px solid var(--border-color)"
              }}>
                <h4 style={{ color: "var(--primary-light)", fontWeight: "600", marginBottom: "8px" }}>
                  AI Receptionist
                </h4>
                <p style={{ color: "var(--gray-300)", fontSize: "0.875rem" }}>
                  businessName, businessPhone, workingHours, timezone, brandTone, escalationRules
                </p>
              </div>
              <div style={{ 
                background: "var(--bg-glass)", 
                padding: "16px", 
                borderRadius: "12px",
                border: "1px solid var(--border-color)"
              }}>
                <h4 style={{ color: "var(--primary-light)", fontWeight: "600", marginBottom: "8px" }}>
                  Lead Scoring Engine
                </h4>
                <p style={{ color: "var(--gray-300)", fontSize: "0.875rem" }}>
                  crmProvider, leadScoreThreshold, salesSlackChannel, scoringCriteria
                </p>
              </div>
              <div style={{ 
                background: "var(--bg-glass)", 
                padding: "16px", 
                borderRadius: "12px",
                border: "1px solid var(--border-color)"
              }}>
                <h4 style={{ color: "var(--primary-light)", fontWeight: "600", marginBottom: "8px" }}>
                  Cart Recovery Bot
                </h4>
                <p style={{ color: "var(--gray-300)", fontSize: "0.875rem" }}>
                  ecommercePlatform, discountCode, whatsappNumber, recoverySequence
                </p>
              </div>
            </div>
          </section>

          <section className="glass" style={{ padding: "32px", borderRadius: "16px" }}>
            <h2 style={{ 
              fontSize: "1.5rem", 
              fontWeight: "700", 
              marginBottom: "16px",
              color: "var(--white)"
            }}>
              Security & Compliance
            </h2>
            <div style={{ color: "var(--gray-300)", lineHeight: "1.8" }}>
              <p style={{ marginBottom: "16px" }}>
                All data is encrypted in transit and at rest using AES-256 encryption. 
                Our platform maintains SOC 2 Type II compliance and follows zero-trust security principles.
              </p>
              <ul style={{ paddingLeft: "24px", marginTop: "16px" }}>
                <li style={{ marginBottom: "8px" }}>
                  <strong style={{ color: "var(--white)" }}>Payment Processing:</strong> Handled via Stripe with PCI DSS compliance
                </li>
                <li style={{ marginBottom: "8px" }}>
                  <strong style={{ color: "var(--white)" }}>Data Retention:</strong> Configurable retention policies with automated purging
                </li>
                <li style={{ marginBottom: "8px" }}>
                  <strong style={{ color: "var(--white)" }}>Access Control:</strong> Role-based permissions with audit logging
                </li>
                <li style={{ marginBottom: "8px" }}>
                  <strong style={{ color: "var(--white)" }}>Monitoring:</strong> 24/7 security monitoring with real-time alerts
                </li>
              </ul>
            </div>
          </section>

          <section className="glass" style={{ padding: "32px", borderRadius: "16px" }}>
            <h2 style={{ 
              fontSize: "1.5rem", 
              fontWeight: "700", 
              marginBottom: "16px",
              color: "var(--white)"
            }}>
              API Integration
            </h2>
            <div style={{ color: "var(--gray-300)", lineHeight: "1.8" }}>
              <p style={{ marginBottom: "16px" }}>
                Enterprise customers can access our REST API for custom integrations and automation management.
              </p>
              <div style={{ 
                background: "var(--gray-900)", 
                padding: "16px", 
                borderRadius: "8px", 
                marginTop: "16px",
                fontFamily: "var(--font-mono)",
                fontSize: "0.875rem",
                border: "1px solid var(--border-color)"
              }}>
                <div style={{ color: "var(--success)" }}>POST</div>
                <div style={{ color: "var(--gray-300)" }}>/api/v1/deployments</div>
                <div style={{ color: "var(--gray-400)", marginTop: "8px" }}>
                  Deploy a new automation instance
                </div>
              </div>
            </div>
          </section>

          <section className="glass" style={{ padding: "32px", borderRadius: "16px" }}>
            <h2 style={{ 
              fontSize: "1.5rem", 
              fontWeight: "700", 
              marginBottom: "16px",
              color: "var(--white)"
            }}>
              Support & Resources
            </h2>
            <div style={{ color: "var(--gray-300)", lineHeight: "1.8" }}>
              <p style={{ marginBottom: "16px" }}>
                Our enterprise support team is available 24/7 to help with deployment, configuration, and optimization.
              </p>
              <div style={{ display: "grid", gap: "12px", marginTop: "16px" }}>
                <div>
                  <strong style={{ color: "var(--white)" }}>Email Support:</strong>{" "}
                  <a href="mailto:support@artifically.com" style={{ color: "var(--primary-light)", textDecoration: "none" }}>
                    support@artifically.com
                  </a>
                </div>
                <div>
                  <strong style={{ color: "var(--white)" }}>Response Time:</strong> 
                  <span style={{ color: "var(--success)" }}> &lt; 2 hours for enterprise customers</span>
                </div>
                <div>
                  <strong style={{ color: "var(--white)" }}>Slack Community:</strong>{" "}
                  <a href="#" style={{ color: "var(--primary-light)", textDecoration: "none" }}>
                    Join 5000+ automation experts
                  </a>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}