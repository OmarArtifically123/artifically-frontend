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

  const navigate = useNavigate();
  const { pathname } = useLocation();

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
        background: 'var(--bg-primary)'
      }}>
        <div className="loading" style={{ width: '40px', height: '40px' }}></div>
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
      />

      {/* Email verification reminder */}
      {user && !user.verified && (
        <div className="banner warn">
          <div className="container">
            <strong>Verify your email</strong> to unlock deployments and AI features.
            <button
              className="btn btn-small"
              style={{ marginLeft: 12 }}
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

      <main>
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
    </>
  );
}