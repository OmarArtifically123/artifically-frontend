// src/components/Verify.jsx - Enhanced with Dark Mode
import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api, { pick } from "../api";
import { toast } from "./Toast";

export default function Verify({ onVerified }) {
  const [darkMode, setDarkMode] = useState(true);
  const [params] = useSearchParams();
  const [status, setStatus] = useState("loading"); // loading | success | error
  const [email, setEmail] = useState("");
  const [resending, setResending] = useState(false);
  const navigate = useNavigate();

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
    const token = params.get("token");
    if (!token) {
      setStatus("error");
      toast("Missing verification token", { type: "error" });
      return;
    }

    (async () => {
      try {
        // Verify token with backend
        await api.get("/auth/verify-email", { params: { token } }).then(pick());

        // Refresh user state
        try {
          const me = await api.get("/auth/me").then(pick("user"));
          if (me) {
            onVerified?.(me);
            setEmail(me.email);
          }
        } catch {
          /* ignore */
        }

        setStatus("success");
        toast("Email verified! You're good to go.", { type: "success" });

        setTimeout(() => navigate("/dashboard"), 1500);
      } catch (err) {
        setStatus("error");
        const msg =
          err?.response?.data?.message ||
          err?.message ||
          "Verification failed";
        toast(msg, { type: "error" });
      }
    })();
  }, [params, navigate, onVerified]);

  const resend = async () => {
    if (!email) {
      toast("No email found. Please sign in first.", { type: "error" });
      return;
    }
    try {
      setResending(true);
      await api.post("/auth/resend-verification", { email });
      toast("Verification email resent", { type: "success" });
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Resend failed";
      toast(msg, { type: "error" });
    } finally {
      setResending(false);
    }
  };

  return (
    <div 
      className="container" 
      style={{ 
        padding: "4rem 1rem", 
        textAlign: "center",
        minHeight: "80vh",
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <div
        style={{
          background: darkMode
            ? 'rgba(255, 255, 255, 0.05)'
            : 'rgba(255, 255, 255, 0.8)',
          borderRadius: '1.5rem',
          padding: '3rem 2rem',
          border: `1px solid ${darkMode ? 'rgba(148, 163, 184, 0.2)' : 'rgba(0, 0, 0, 0.1)'}`,
          backdropFilter: 'blur(20px)',
          boxShadow: darkMode
            ? '0 25px 50px rgba(0, 0, 0, 0.3)'
            : '0 25px 50px rgba(0, 0, 0, 0.15)',
          maxWidth: '500px',
          width: '100%'
        }}
      >
        {status === "loading" && (
          <>
            <div 
              className="loading"
              style={{
                width: "60px",
                height: "60px",
                border: `4px solid ${darkMode ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)'}`,
                borderTopColor: '#6366f1',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                margin: '0 auto 2rem'
              }}
            />
            <h2 style={{
              color: darkMode ? '#ffffff' : '#1e293b',
              fontSize: '1.75rem',
              fontWeight: '700',
              marginBottom: '1rem'
            }}>
              Verifying your email…
            </h2>
            <p style={{
              color: darkMode ? '#94a3b8' : '#64748b',
              fontSize: '1.125rem'
            }}>
              Please wait while we verify your account.
            </p>
          </>
        )}
        
        {status === "success" && (
          <>
            <div style={{ 
              fontSize: "4rem", 
              marginBottom: "1.5rem",
              filter: 'drop-shadow(0 0 20px rgba(16, 185, 129, 0.5))'
            }}>
              ✅
            </div>
            <h2 style={{
              color: darkMode ? '#10b981' : '#059669',
              fontSize: '1.75rem',
              fontWeight: '700',
              marginBottom: '1rem'
            }}>
              Verified! Redirecting…
            </h2>
            <p style={{
              color: darkMode ? '#94a3b8' : '#64748b',
              fontSize: '1.125rem'
            }}>
              Your email has been successfully verified. You'll be redirected to your dashboard shortly.
            </p>
          </>
        )}
        
        {status === "error" && (
          <>
            <div style={{ 
              fontSize: "4rem", 
              marginBottom: "1.5rem",
              filter: 'drop-shadow(0 0 20px rgba(239, 68, 68, 0.5))'
            }}>
              ❌
            </div>
            <h2 style={{
              color: darkMode ? '#ef4444' : '#dc2626',
              fontSize: '1.75rem',
              fontWeight: '700',
              marginBottom: '1rem'
            }}>
              Verification Error
            </h2>
            <p style={{
              color: darkMode ? '#94a3b8' : '#64748b',
              marginBottom: "2rem",
              lineHeight: '1.6',
              fontSize: '1.125rem'
            }}>
              We couldn't verify that link. The token may have expired or already been used.
            </p>
            <button 
              className="btn btn-primary" 
              disabled={resending} 
              onClick={resend}
              style={{
                background: resending
                  ? (darkMode ? 'rgba(99, 102, 241, 0.5)' : 'rgba(99, 102, 241, 0.7)')
                  : 'linear-gradient(135deg, #6366f1 0%, #5855eb 100%)',
                color: '#ffffff',
                padding: '1rem 2rem',
                border: 'none',
                borderRadius: '0.75rem',
                fontWeight: '600',
                fontSize: '1rem',
                cursor: resending ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: darkMode
                  ? '0 4px 20px rgba(99, 102, 241, 0.4)'
                  : '0 4px 20px rgba(99, 102, 241, 0.3)',
                opacity: resending ? 0.7 : 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                margin: '0 auto'
              }}
              onMouseEnter={(e) => {
                if (!resending) {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = darkMode
                    ? '0 8px 30px rgba(99, 102, 241, 0.5)'
                    : '0 8px 30px rgba(99, 102, 241, 0.4)';
                }
              }}
              onMouseLeave={(e) => {
                if (!resending) {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = darkMode
                    ? '0 4px 20px rgba(99, 102, 241, 0.4)'
                    : '0 4px 20px rgba(99, 102, 241, 0.3)';
                }
              }}
            >
              {resending ? (
                <>
                  <div
                    style={{
                      width: '16px',
                      height: '16px',
                      border: '2px solid rgba(255, 255, 255, 0.3)',
                      borderTopColor: 'white',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite'
                    }}
                  />
                  Resending…
                </>
              ) : (
                'Resend Verification Email'
              )}
            </button>
          </>
        )}
      </div>

      {/* CSS animations */}
      <style jsx>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}