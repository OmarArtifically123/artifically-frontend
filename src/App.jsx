import { useEffect, useState } from "react";
import { Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

import Header from "./components/Header";
import Home from "./pages/Home";
import Pricing from "./pages/Pricing";
import Docs from "./pages/Docs";
import Dashboard from "./components/Dashboard";
import AuthModal from "./components/AuthModal";
import Toast from "./components/Toast";

function App() {
  const [user, setUser] = useState(null);
  const [authModal, setAuthModal] = useState(false);
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // restore session
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    axios.get("/api/auth/me", { headers: { Authorization: `Bearer ${token}` }})
      .then(res => setUser(res.data.user))
      .catch(() => localStorage.removeItem("token"));
  }, []);

  const handleAuthenticated = ({ token, user }) => {
    localStorage.setItem("token", token);
    setUser(user);
    setAuthModal(false);
    setToast(`Welcome, ${user.businessName}`);
    navigate("/dashboard");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setToast("Logged out.");
    // if you log out while on /dashboard, go home
    if (location.pathname.startsWith("/dashboard")) navigate("/");
  };

  return (
    <>
      <Header
        brand="Artifically"
        user={user}
        onLogin={() => setAuthModal(true)}
        onLogout={handleLogout}
      />

      <Routes>
        {/* Home and a convenience route that scrolls to marketplace */}
        <Route path="/" element={
          <Home user={user} onRequireAuth={() => setAuthModal(true)} onNotify={(m)=>setToast(m)} />
        } />
        <Route path="/marketplace" element={
          <Home user={user} onRequireAuth={() => setAuthModal(true)} onNotify={(m)=>setToast(m)} scrollTo="marketplace" />
        } />

        <Route path="/pricing" element={<Pricing />} />
        <Route path="/docs" element={<Docs />} />

        {/* Protected dashboard */}
        <Route path="/dashboard" element={
          user ? <Dashboard user={user} /> : <Navigate to="/" replace />
        } />
      </Routes>

      {authModal && (
        <AuthModal onClose={() => setAuthModal(false)} onAuthenticated={handleAuthenticated} />
      )}
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </>
  );
}

export default App;
