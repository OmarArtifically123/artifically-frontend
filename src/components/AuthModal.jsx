import { useState, useRef } from "react";
import api from "../api";

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
  const [error, setError] = useState("");
  const modalRef = useRef(null);

  const swap = () => {
    setMode(mode === "signin" ? "signup" : "signin");
    setError("");
    setForm({
      email: "",
      password: "",
      businessName: "",
      businessPhone: "",
      businessEmail: "",
      websiteUrl: ""
    });
  };

  const validateForm = () => {
    if (!form.email || !form.password) {
      setError("Email and password are required");
      return false;
    }

    if (mode === "signup" && !form.businessName) {
      setError("Business name is required");
      return false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      setError("Please enter a valid email address");
      return false;
    }

    // Password validation
    if (form.password.length < 8) {
      setError("Password must be at least 8 characters long");
      return false;
    }

    if (mode === "signup") {
      // Strong password validation for signup
      const hasUpper = /[A-Z]/.test(form.password);
      const hasLower = /[a-z]/.test(form.password);
      const hasNumber = /\d/.test(form.password);
      const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(form.password);

      if (!hasUpper || !hasLower || !hasNumber || !hasSpecial) {
        setError("Password must include uppercase, lowercase, number, and special character");
        return false;
      }

      // Phone validation if provided
      if (form.businessPhone && !/^\+?[\d\s\-()]+$/.test(form.businessPhone)) {
        setError("Please enter a valid phone number");
        return false;
      }

      // URL validation if provided
      if (form.websiteUrl && !/^https?:\/\/.+\..+/.test(form.websiteUrl)) {
        setError("Please enter a valid website URL (including http:// or https://)");
        return false;
      }

      // Email validation if provided
      if (form.businessEmail && !emailRegex.test(form.businessEmail)) {
        setError("Please enter a valid business email address");
        return false;
      }
    }

    return true;
  };

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    
    try {
      if (mode === "signup") {
        const signupData = {
          email: form.email.trim().toLowerCase(),
          password: form.password,
          businessName: form.businessName.trim(),
          businessPhone: form.businessPhone.trim() || undefined,
          businessEmail: form.businessEmail.trim().toLowerCase() || undefined,
          websiteUrl: form.websiteUrl.trim() || undefined
        };

        await api.post("/auth/signup", signupData);
        onAuthenticated({
          token: null,
          user: null,
          notice: "Account created successfully! Please check your email to verify your address."
        });
      } else {
        const signinData = {
          email: form.email.trim().toLowerCase(),
          password: form.password
        };

        const res = await api.post("/auth/signin", signinData);
        onAuthenticated({
          token: res.data.token,
          user: res.data.user,
          notice: "Welcome back!"
        });
      }
    } catch (err) {
      console.error("Authentication error:", err);
      
      const res = err?.response?.data;
      if (res?.errors?.length) {
        setError(res.errors.map(e => `${e.field}: ${e.message}`).join(", "));
      } else if (res?.message) {
        setError(res.message);
      } else if (err.message) {
        setError(err.message);
      } else {
        setError("Authentication failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOverlayClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      onClose();
    }
  };

  const handleInputChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (error) setError(""); // Clear error when user starts typing
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div ref={modalRef} className="modal" style={{ maxWidth: 520 }}>
        <div className="modal-header">
          <h2>{mode === "signin" ? "Welcome Back" : "Create Your Account"}</h2>
          <button className="close-btn" onClick={onClose} type="button">
            ×
          </button>
        </div>

        {error && (
          <div style={{ 
            background: 'rgba(239, 68, 68, 0.1)', 
            border: '1px solid rgba(239, 68, 68, 0.3)',
            color: 'var(--danger)',
            padding: 'var(--space-3)',
            borderRadius: 'var(--rounded-lg)',
            marginBottom: 'var(--space-4)',
            fontSize: '0.875rem'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={submit}>
          {/* Signup-only fields */}
          {mode === "signup" && (
            <>
              <div className="form-group">
                <label className="form-label">Business Name *</label>
                <input
                  className="form-input"
                  value={form.businessName}
                  onChange={(e) => handleInputChange('businessName', e.target.value)}
                  placeholder="Enter your business name"
                  required
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Business Phone</label>
                <input
                  className="form-input"
                  value={form.businessPhone}
                  onChange={(e) => handleInputChange('businessPhone', e.target.value)}
                  placeholder="+1 (555) 123-4567"
                  disabled={loading}
                />
                <small className="form-hint">International format preferred</small>
              </div>

              <div className="form-group">
                <label className="form-label">Business Email</label>
                <input
                  className="form-input"
                  type="email"
                  value={form.businessEmail}
                  onChange={(e) => handleInputChange('businessEmail', e.target.value)}
                  placeholder="support@yourbusiness.com"
                  disabled={loading}
                />
                <small className="form-hint">Different from your login email</small>
              </div>

              <div className="form-group">
                <label className="form-label">Website URL</label>
                <input
                  className="form-input"
                  type="url"
                  value={form.websiteUrl}
                  onChange={(e) => handleInputChange('websiteUrl', e.target.value)}
                  placeholder="https://yourbusiness.com"
                  disabled={loading}
                />
              </div>
            </>
          )}

          {/* Universal fields */}
          <div className="form-group">
            <label className="form-label">Email Address *</label>
            <input
              className="form-input"
              type="email"
              value={form.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="you@example.com"
              required
              disabled={loading}
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password *</label>
            <input
              className="form-input"
              type="password"
              value={form.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              placeholder="Enter your password"
              required
              disabled={loading}
              autoComplete={mode === "signin" ? "current-password" : "new-password"}
            />
            {mode === "signup" && (
              <small className="form-hint">
                Must be at least 8 characters with uppercase, lowercase, number, and special character
              </small>
            )}
          </div>

          <button 
            className="btn btn-primary" 
            type="submit" 
            disabled={loading}
            style={{ width: '100%', marginTop: 'var(--space-4)' }}
          >
            {loading ? (
              <>
                <span className="loading"></span>
                <span style={{ marginLeft: 'var(--space-2)' }}>
                  {mode === "signin" ? "Signing in..." : "Creating account..."}
                </span>
              </>
            ) : (
              mode === "signin" ? "Sign In" : "Create Account"
            )}
          </button>
        </form>

        <div style={{ 
          marginTop: 'var(--space-6)', 
          fontSize: '0.875rem', 
          textAlign: 'center',
          color: 'var(--gray-400)'
        }}>
          {mode === "signin" ? (
            <>
              New to Artifically?{" "}
              <button className="linklike" onClick={swap} type="button">
                Create an account
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button className="linklike" onClick={swap} type="button">
                Sign in
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}