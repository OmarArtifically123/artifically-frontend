// src/components/Dashboard.jsx - Enhanced with Dark Mode
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api, { pick } from "../api";
import { toast } from "./Toast";

export default function Dashboard({ user, openAuth }) {
  const [darkMode, setDarkMode] = useState(true);
  const [deployments, setDeployments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // helper used below (kept minimal to satisfy existing calls)
  const formatPrice = (amount, currency = "USD") =>
    new Intl.NumberFormat("en-US", { style: "currency", currency }).format(amount || 0);

  // Get theme from document
  useEffect(() => {
    const theme = document.documentElement.getAttribute('data-theme');
    setDarkMode(theme === 'dark' || theme === null);
    
    // Listen for theme changes
    const observer = new MutationObserver(() => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      setDarkMode(currentTheme === 'dark' || currentTheme === null);
    });
    
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme']
    });
    
    return () => observer.disconnect();
  }, []);

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
      <div 
        className="dashboard"
        style={{
          minHeight: 'calc(100vh - 200px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <div className="container" style={{ textAlign: "center", padding: "4rem 0" }}>
          <div style={{ 
            fontSize: "4rem", 
            marginBottom: "1.5rem",
            opacity: 0.5 
          }}>
            🔒
          </div>
          <h2 style={{ 
            color: darkMode ? '#ffffff' : '#1e293b', 
            marginBottom: "1rem",
            fontSize: '2rem',
            fontWeight: '700'
          }}>
            Authentication Required
          </h2>
          <p style={{ 
            color: darkMode ? '#94a3b8' : '#64748b', 
            marginTop: "1rem",
            fontSize: '1.125rem'
          }}>
            Loading pricing information...
          </p>
        </div>
      </div>
    );
  }

  // Main render (unchanged UI; just corrected variables)
  return (
    <main>
      {deployments.length === 0 ? (
        <div style={{ textAlign: "center", padding: "3rem" }}>
          <div style={{ 
            fontSize: "4rem", 
            marginBottom: "1.5rem",
            opacity: 0.5 
          }}>
            💰
          </div>
          <p style={{ 
            color: darkMode ? '#94a3b8' : '#64748b', 
            fontSize: "1.125rem" 
          }}>
            Pricing information is currently unavailable. Please check back soon.
          </p>
        </div>
      ) : (
        <>
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", 
            gap: "1.5rem",
            marginBottom: "3rem"
          }}>
            {deployments.map((automation) => (
              <div 
                key={automation.id}
                className="glass"
                style={{ 
                  padding: "2rem", 
                  borderRadius: "1rem",
                  textAlign: "center",
                  transition: "all 0.3s ease",
                  cursor: "pointer",
                  background: darkMode
                    ? 'rgba(255, 255, 255, 0.05)'
                    : 'rgba(255, 255, 255, 0.8)',
                  border: `1px solid ${darkMode ? 'rgba(148, 163, 184, 0.2)' : 'rgba(0, 0, 0, 0.1)'}`,
                  backdropFilter: 'blur(20px)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.borderColor = darkMode ? 'rgba(99, 102, 241, 0.3)' : 'rgba(99, 102, 241, 0.2)';
                  e.currentTarget.style.boxShadow = darkMode 
                    ? '0 10px 30px rgba(0, 0, 0, 0.2)' 
                    : '0 10px 30px rgba(0, 0, 0, 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.borderColor = darkMode ? 'rgba(148, 163, 184, 0.2)' : 'rgba(0, 0, 0, 0.1)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div style={{ 
                  fontSize: "2rem", 
                  marginBottom: "1rem",
                  filter: "drop-shadow(0 0 10px rgba(99, 102, 241, 0.3))"
                }}>
                  {automation.icon || "🤖"}
                </div>
                
                <h3 style={{ 
                  color: darkMode ? '#ffffff' : '#1e293b', 
                  marginBottom: "0.5rem",
                  fontSize: "1.25rem",
                  fontWeight: "700"
                }}>
                  {automation.name}
                </h3>
                
                <div style={{ 
                  fontSize: "2rem", 
                  fontWeight: "800", 
                  color: darkMode ? '#a5b4fc' : '#6366f1',
                  marginBottom: "0.5rem"
                }}>
                  {formatPrice(automation.priceMonthly, automation.currency)}
                  <span style={{ 
                    fontSize: "1rem", 
                    color: darkMode ? '#94a3b8' : '#64748b', 
                    fontWeight: "400" 
                  }}>
                    /month
                  </span>
                </div>
                
                <p style={{ 
                  color: darkMode ? '#94a3b8' : '#64748b', 
                  marginBottom: "1.5rem",
                  lineHeight: "1.6"
                }}>
                  {automation.description}
                </p>
                
                <div style={{ 
                  background: darkMode 
                    ? 'rgba(255, 255, 255, 0.05)' 
                    : 'rgba(0, 0, 0, 0.03)',
                  padding: "0.75rem",
                  borderRadius: "0.5rem",
                  marginBottom: "1rem",
                  border: `1px solid ${darkMode ? 'rgba(148, 163, 184, 0.2)' : 'rgba(0, 0, 0, 0.1)'}`,
                  backdropFilter: 'blur(10px)'
                }}>
                  <div style={{ 
                    color: darkMode ? '#10b981' : '#059669', 
                    fontWeight: "600", 
                    fontSize: "0.875rem" 
                  }}>
                    {automation.requestLimit?.toLocaleString() || "Unlimited"} requests/month included
                  </div>
                </div>
                
                {automation.tags && automation.tags.length > 0 && (
                  <div style={{ 
                    display: "flex", 
                    flexWrap: "wrap", 
                    gap: "0.5rem", 
                    justifyContent: "center",
                    marginTop: "1rem"
                  }}>
                    {automation.tags.slice(0, 3).map((tag) => (
                      <span 
                        key={tag}
                        style={{ 
                          background: darkMode 
                            ? 'rgba(255, 255, 255, 0.05)' 
                            : 'rgba(0, 0, 0, 0.05)',
                          color: darkMode ? '#cbd5e1' : '#64748b',
                          padding: "0.25rem 0.75rem",
                          borderRadius: "0.75rem",
                          fontSize: "0.75rem",
                          fontWeight: "500",
                          border: `1px solid ${darkMode ? 'rgba(148, 163, 184, 0.2)' : 'rgba(0, 0, 0, 0.1)'}`,
                          backdropFilter: 'blur(10px)'
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

          <div 
            className="glass" 
            style={{ 
              padding: "2rem", 
              borderRadius: "1rem", 
              textAlign: "center",
              background: darkMode
                ? 'rgba(255, 255, 255, 0.05)'
                : 'rgba(255, 255, 255, 0.8)',
              border: `1px solid ${darkMode ? 'rgba(148, 163, 184, 0.2)' : 'rgba(0, 0, 0, 0.1)'}`,
              backdropFilter: 'blur(20px)'
            }}
          >
            <h3 style={{ 
              color: darkMode ? '#ffffff' : '#1e293b', 
              marginBottom: "1rem",
              fontSize: '1.5rem',
              fontWeight: '700'
            }}>
              Enterprise Pricing
            </h3>
            <p style={{ 
              color: darkMode ? '#94a3b8' : '#64748b', 
              marginBottom: "1.5rem" 
            }}>
              Need custom automations or higher usage limits? We've got you covered.
            </p>
            <div style={{ 
              display: "flex", 
              gap: "1rem", 
              justifyContent: "center", 
              flexWrap: "wrap" 
            }}>
              <a 
                href="mailto:sales@artifically.com" 
                className="btn btn-primary"
                style={{ 
                  textDecoration: "none",
                  background: 'linear-gradient(135deg, #6366f1 0%, #5855eb 100%)',
                  color: '#ffffff',
                  padding: '0.875rem 1.5rem',
                  border: 'none',
                  borderRadius: '0.75rem',
                  fontWeight: '600',
                  fontSize: '1rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: darkMode
                    ? '0 4px 20px rgba(99, 102, 241, 0.4)'
                    : '0 4px 20px rgba(99, 102, 241, 0.3)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = darkMode
                    ? '0 8px 30px rgba(99, 102, 241, 0.5)'
                    : '0 8px 30px rgba(99, 102, 241, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = darkMode
                    ? '0 4px 20px rgba(99, 102, 241, 0.4)'
                    : '0 4px 20px rgba(99, 102, 241, 0.3)';
                }}
              >
                Contact Sales
              </a>
              <a 
                href="#" 
                className="btn btn-secondary"
                style={{ 
                  textDecoration: "none",
                  background: darkMode
                    ? 'rgba(255, 255, 255, 0.05)'
                    : 'rgba(0, 0, 0, 0.05)',
                  color: darkMode ? '#ffffff' : '#1e293b',
                  padding: '0.875rem 1.5rem',
                  border: `1px solid ${darkMode ? 'rgba(148, 163, 184, 0.2)' : 'rgba(0, 0, 0, 0.1)'}`,
                  borderRadius: '0.75rem',
                  fontWeight: '500',
                  fontSize: '1rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  backdropFilter: 'blur(10px)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = darkMode
                    ? 'rgba(255, 255, 255, 0.1)'
                    : 'rgba(0, 0, 0, 0.1)';
                  e.target.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = darkMode
                    ? 'rgba(255, 255, 255, 0.05)'
                    : 'rgba(0, 0, 0, 0.05)';
                  e.target.style.transform = 'translateY(0)';
                }}
              >
                Schedule Demo
              </a>
            </div>
          </div>
        </>
      )}

      {/* CSS animations */}
      <style jsx>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </main>
  );
}
