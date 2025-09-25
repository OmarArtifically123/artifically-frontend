import { useEffect, useState } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Pricing from "./pages/Pricing";
import Docs from "./pages/Docs";
import Marketplace from "./components/Marketplace";
import Dashboard from "./components/Dashboard";
import AuthModal from "./components/AuthModal";
import Verify from "./components/Verify";
import Toast, { ToastHost, toast } from "./components/Toast";
import api, { pick } from "./api";
import "./styles/global.css";

export default function App() {
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState("signin");
  const [user, setUser] = useState(null);
  const [booted, setBooted] = useState(false);
  const [darkMode, setDarkMode] = useState(true);

  const navigate = useNavigate();
  const { pathname } = useLocation();

  // Initialize theme on app load
  useEffect(() => {
    // Check for saved theme or default to dark
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialDarkMode = savedTheme ? savedTheme === 'dark' : prefersDark;
    
    setDarkMode(initialDarkMode);
    document.documentElement.setAttribute('data-theme', initialDarkMode ? 'dark' : 'light');
    
    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemThemeChange = (e) => {
      if (!localStorage.getItem('theme')) {
        setDarkMode(e.matches);
        document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light');
      }
    };
    
    mediaQuery.addEventListener('change', handleSystemThemeChange);
    return () => mediaQuery.removeEventListener('change', handleSystemThemeChange);
  }, []);

  // Restore session on app load
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setBooted(true);
      return;
    }

    api
      .get("/auth/me")
      .then(pick("user"))
      .then((u) => setUser(u))
      .catch(() => {
        localStorage.removeItem("token");
        setUser(null);
      })
      .finally(() => setBooted(true));
  }, []);

  const openAuth = (mode = "signin") => {
    setAuthMode(mode);
    setAuthOpen(true);
  };

  const signOut = () => {
    localStorage.removeItem("token");
    setUser(null);
    toast("Successfully signed out", { type: "info" });
    if (pathname.startsWith("/dashboard")) {
      navigate("/");
    }
  };

  const onAuthenticated = ({ token, user: u, notice }) => {
    if (token) {
      localStorage.setItem("token", token);
    }
    if (u) {
      setUser(u);
    }
    if (notice) {
      toast(notice, { type: u?.verified ? "success" : "info" });
    }
    setAuthOpen(false);
  };

  // Show loading state while booting
  if (!booted) {
    return (
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        height: '100vh',
        background: 'var(--bg-primary)',
        flexDirection: 'column',
        gap: '1rem'
      }}>
        <div className="loading" style={{ width: '40px', height: '40px' }}></div>
        <div style={{
          background: 'linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          fontSize: '1.25rem',
          fontWeight: '600',
          animation: 'pulse 2s ease-in-out infinite'
        }}>
          Loading Artifically...
        </div>
      </div>
    );
  }

  return (
    <>
      <Header
        user={user}
        onSignIn={() => openAuth("signin")}
        onSignUp={() => openAuth("signup")}
        onSignOut={signOut}
        darkMode={darkMode}
        onToggleTheme={() => setDarkMode(!darkMode)}
      />

      {/* Email verification reminder with theme support */}
      {user && !user.verified && (
        <div 
          className="banner warn"
          style={{
            padding: '1rem 0',
            textAlign: 'center',
            position: 'sticky',
            top: '80px',
            zIndex: 90,
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            background: darkMode
              ? 'linear-gradient(90deg, rgba(245, 158, 11, 0.1), rgba(245, 158, 11, 0.2))'
              : 'linear-gradient(90deg, rgba(245, 158, 11, 0.05), rgba(245, 158, 11, 0.1))',
            borderBottom: '1px solid rgba(245, 158, 11, 0.3)',
            color: '#f59e0b'
          }}
        >
          <div className="container" style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.75rem',
            flexWrap: 'wrap'
          }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '1.2rem' }}>⚠️</span>
              <strong>Verify your email</strong> to unlock deployments and AI features.
            </span>
            <button
              className="btn btn-small"
              style={{
                padding: '0.5rem 1rem',
                fontSize: '0.75rem',
                background: 'rgba(245, 158, 11, 0.2)',
                color: '#f59e0b',
                border: '1px solid rgba(245, 158, 11, 0.5)',
                borderRadius: '0.5rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                backdropFilter: 'blur(10px)'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'rgba(245, 158, 11, 0.3)';
                e.target.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'rgba(245, 158, 11, 0.2)';
                e.target.style.transform = 'translateY(0)';
              }}
              onClick={async () => {
                try {
                  await api.post("/auth/resend-verification");
                  toast("Verification email sent. Check your inbox.", {
                    type: "success",
                  });
                } catch (e) {
                  toast(e.message || "Could not resend verification", {
                    type: "error",
                  });
                }
              }}
            >
              Resend link
            </button>
          </div>
        </div>
      )}

      <main style={{ minHeight: 'calc(100vh - 200px)' }}>
        <Routes>
          <Route 
            path="/" 
            element={<Home openAuth={openAuth} user={user} />} 
          />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/docs" element={<Docs />} />
          <Route
            path="/marketplace"
            element={<Marketplace openAuth={openAuth} user={user} />}
          />
          <Route
            path="/dashboard"
            element={
              user ? (
                <Dashboard user={user} openAuth={openAuth} />
              ) : (
                <Home openAuth={openAuth} user={null} />
              )
            }
          />
          <Route 
            path="/verify" 
            element={<Verify onVerified={(u) => setUser(u)} />} 
          />
          {/* Catch-all route for 404s */}
          <Route 
            path="*" 
            element={<Home openAuth={openAuth} user={user} />} 
          />
        </Routes>
      </main>

      <Footer />

      {authOpen && (
        <AuthModal
          onClose={() => setAuthOpen(false)}
          onAuthenticated={onAuthenticated}
          initialMode={authMode}
        />
      )}

      <ToastHost />

      {/* Add theme transition styles */}
      <style jsx global>{`
        /* Smooth theme transition animations */
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        
        /* Enhanced loading animation */
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        
        .loading {
          animation: spin 1s linear infinite;
        }
        
        /* Ensure smooth transitions for all theme-dependent elements */
        * {
          transition: background-color 0.3s cubic-bezier(0.4, 0, 0.2, 1),
                      border-color 0.3s cubic-bezier(0.4, 0, 0.2, 1),
                      color 0.3s cubic-bezier(0.4, 0, 0.2, 1),
                      box-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        /* Theme-specific enhancements */
        [data-theme="light"] body {
          background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
        }
        
        [data-theme="dark"] body {
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
        }
        
        /* Enhanced glass effects */
        .glass {
          position: relative;
        }
        
        .glass::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, 
            rgba(255, 255, 255, 0.1) 0%, 
            rgba(255, 255, 255, 0.05) 50%, 
            rgba(255, 255, 255, 0) 100%);
          border-radius: inherit;
          pointer-events: none;
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        
        .glass:hover::before {
          opacity: 1;
        }
        
        [data-theme="light"] .glass::before {
          background: linear-gradient(135deg, 
            rgba(0, 0, 0, 0.05) 0%, 
            rgba(0, 0, 0, 0.02) 50%, 
            rgba(0, 0, 0, 0) 100%);
        }
      `}</style>
    </>
  );
}