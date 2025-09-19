import { useState, useRef } from "react";
import api from "./api";
import Toast from "./Toast";

export default function AuthModal({ onClose, onAuthenticated, initialMode = "signin" }) {
  const [mode, setMode] = useState(initialMode);
  const [form, setForm] = useState({
    email: "",
    password: "",
    businessName: "",
    businessPhone: "",
    businessEmail: "",
    websiteUrl: ""
  });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const modalRef = useRef(null);

  const swap = () => setMode(mode === "signin" ? "signup" : "signin");

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signup") {
        await api.post("/auth/signup", form);
        onAuthenticated({
          token: null,
          user: null,
          notice: "Account created. Please check your email to verify your address.",
        });
        setToast("Account created. Please check your email to verify.");
      } else {
        const res = await api.post("/auth/signin", {
          email: form.email,
          password: form.password,
        });
        onAuthenticated(res.data);
      }
    } catch (err) {
      const res = err?.response?.data;
      if (res?.errors?.length) {
        setToast(res.errors.map(e => `${e.field}: ${e.message}`).join(", "));
      } else {
        setToast(res?.message || "Authentication failed");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOverlayClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) onClose();
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div ref={modalRef} className="modal" style={{ maxWidth: 520 }}>
        <div className="modal-header">
          <h2>{mode === "signin" ? "Sign In" : "Create your account"}</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <form onSubmit={submit}>
          {mode === "signup" && (
            <>
              <div className="form-group">
                <label className="form-label">Business Name *</label>
                <input
                  className="form-input"
                  value={form.businessName}
                  onChange={(e) => setForm({ ...form, businessName: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Business Phone</label>
                <input
                  className="form-input"
                  value={form.businessPhone}
                  onChange={(e) => setForm({ ...form, businessPhone: e.target.value })}
                  placeholder="+971551234567"
                />
                <small className="form-hint">Enter in international format (e.g. +971551234567)</small>
              </div>
              <div className="form-group">
                <label className="form-label">Business Email</label>
                <input
                  className="form-input"
                  type="email"
                  value={form.businessEmail}
                  onChange={(e) => setForm({ ...form, businessEmail: e.target.value })}
                  placeholder="support@yourbusiness.com"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Website URL</label>
                <input
                  className="form-input"
                  type="url"
                  value={form.websiteUrl}
                  onChange={(e) => setForm({ ...form, websiteUrl: e.target.value })}
                  placeholder="https://yourbusiness.com"
                />
              </div>
            </>
          )}

          <div className="form-group">
            <label className="form-label">Email *</label>
            <input
              className="form-input"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
              placeholder="you@example.com"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password *</label>
            <input
              className="form-input"
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
              placeholder="••••••••"
            />
            <small className="form-hint">
              Must be at least 12 characters, include uppercase, lowercase, number, and symbol.
            </small>
          </div>

          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? <span className="loading"></span> : (mode === "signin" ? "Sign In" : "Create Account")}
          </button>
        </form>

        <div style={{ marginTop: 12, fontSize: 14 }}>
          {mode === "signin" ? (
            <>New here? <button className="linklike" onClick={swap}>Create an account</button></>
          ) : (
            <>Already have an account? <button className="linklike" onClick={swap}>Sign in</button></>
          )}
        </div>

        {toast && <Toast message={toast} onClose={() => setToast(null)} />}
      </div>
    </div>
  );
}
