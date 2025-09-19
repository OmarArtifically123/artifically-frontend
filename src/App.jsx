import { useEffect, useState } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import Header from "./Header";
import Home from "./Home";
import Pricing from "./Pricing";
import Docs from "./Docs";
import Marketplace from "./Marketplace";
import Dashboard from "./Dashboard";
import AuthModal from "./AuthModal";
import Verify from "./Verify";            // NEW
import { ToastHost, toast } from "./Toast";
import api, { pick } from "./api";
import "./global.css";

export default function App() {
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState("signin");
  const [user, setUser] = useState(null);
  const [booted, setBooted] = useState(false);

  const navigate = useNavigate();
  const { pathname } = useLocation();

  // restore session
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setBooted(true);
      return;
    }
    api.get("/auth/me")
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
    toast("Signed out", { type: "info" });
    if (pathname.startsWith("/dashboard")) navigate("/");
  };

  const onAuthenticated = ({ token, user: u, notice }) => {
    if (token) localStorage.setItem("token", token);
    if (u) setUser(u);
    if (notice) toast(notice, { type: "success" });
    setAuthOpen(false);
  };

  if (!booted) return null;

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
                  toast("Verification email sent. Check your inbox.", { type: "success" });
                } catch (e) {
                  toast(e.message || "Could not resend verification", { type: "error" });
                }
              }}
            >
              Resend link
            </button>
          </div>
        </div>
      )}

      <Routes>
        <Route path="/" element={<Home openAuth={openAuth} user={user} />} />
        <Route path="/pricing" element={<Pricing openAuth={openAuth} user={user} />} />
        <Route path="/docs" element={<Docs />} />
        <Route path="/marketplace" element={<Marketplace openAuth={openAuth} user={user} />} />
        <Route path="/dashboard" element={<Dashboard user={user} openAuth={openAuth} />} />
        <Route path="/verify" element={<Verify onVerified={(u) => setUser(u)} />} />
      </Routes>

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
