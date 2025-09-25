// src/components/AuthModal.jsx - FIXED INPUT REMOUNTING ISSUE
import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import { useTheme } from "../context/ThemeContext";
import { debounce } from "lodash";
import api from "../api";
import ThemeToggle from "./ThemeToggle";

// ✅ Move InputField outside the component to prevent remounting
const InputField = ({
  label,
  type = "text",
  field,
  placeholder,
  required = false,
  hint,
  autoComplete,
  form,
  fieldErrors,
  handleInputChange,
  loading,
  darkMode
}) => (
  <div
    className="form-group"
    style={{ display: 'grid', gap: '0.35rem' }}
  >
    <label
      className="form-label"
      style={{
        fontWeight: 600,
        color: darkMode ? '#e2e8f0' : '#1f2937'
      }}
    >
      {label} {required && <span style={{ color: '#ef4444' }}>*</span>}
    </label>
    <input
      className={`form-input ${fieldErrors[field] ? 'error' : ''}`}
      type={type}
      value={form[field]}
      onChange={(e) => handleInputChange(field, e.target.value)}
      placeholder={placeholder}
      required={required}
      disabled={loading}
      autoComplete={autoComplete}
      style={{
        borderColor: fieldErrors[field] ? '#ef4444' : (darkMode ? 'rgba(148,163,184,0.4)' : 'rgba(148,163,184,0.55)'),
        background: darkMode ? 'rgba(15,23,42,0.85)' : 'rgba(255,255,255,0.95)',
        color: darkMode ? '#e2e8f0' : '#1f2937',
        padding: '0.75rem 1rem',
        borderRadius: '0.85rem',
        transition: 'all 0.2s ease'
      }}
    />
    {fieldErrors[field] && (
      <div style={{
        color: '#ef4444',
        fontSize: '0.75rem',
        marginTop: '4px',
        display: 'flex',
        alignItems: 'center',
        gap: '4px'
      }}>
        <span>⚠ </span>
        {fieldErrors[field]}
      </div>
    )}
    {hint && !fieldErrors[field] && (
      <small
        className="form-hint"
        style={{ color: darkMode ? '#94a3b8' : '#475569', fontSize: '0.8rem' }}
      >
        {hint}
      </small>
    )}
  </div>
);

const AuthModal = ({ onClose, onAuthenticated, initialMode = "signin" }) => {
  const { darkMode } = useTheme();
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
  const [fieldErrors, setFieldErrors] = useState({});
  const [csrfToken, setCsrfToken] = useState("");
  const modalRef = useRef(null);
  const submitRef = useRef(false);

  // Get CSRF token on mount
  useEffect(() => {
    const getCsrfToken = async () => {
      try {
        const response = await api.get('/auth/csrf-token');
        setCsrfToken(response.data.csrfToken);
      } catch (error) {
        console.warn('Could not get CSRF token:', error);
      }
    };
    getCsrfToken();
  }, []);

  // Debounced validation to reduce lag
  const debouncedValidation = useMemo(
    () => debounce((field, value) => {
      validateField(field, value);
    }, 300),
    []
  );

  // Real-time field validation
  const validateField = useCallback((field, value) => {
    const errors = {};

    switch (field) {
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (value && !emailRegex.test(value)) {
          errors.email = 'Invalid email format';
        }
        break;
      
      case 'password':
        if (mode === 'signup') {
          if (value.length < 12) {
            errors.password = 'Password must be at least 12 characters';
          } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/.test(value)) {
            errors.password = 'Password must include uppercase, lowercase, number, and special character';
          }
        }
        break;
      
      case 'businessName':
        if (mode === 'signup' && (!value || value.trim().length < 2)) {
          errors.businessName = 'Business name is required';
        }
        break;
      
      case 'businessPhone':
        if (value && !/^\+?[\d\s\-()]+$/.test(value)) {
          errors.businessPhone = 'Invalid phone number format';
        }
        break;
      
      case 'websiteUrl':
        if (value && !/^https?:\/\/.+\..+/.test(value)) {
          errors.websiteUrl = 'URL must include protocol (https://)';
        }
        break;
    }

    setFieldErrors(prev => ({
      ...prev,
      [field]: errors[field] || null
    }));
  }, [mode]);

  // Optimized input handler
  const handleInputChange = useCallback((field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setError(""); // Clear global error
    
    // Debounced validation for better performance
    debouncedValidation(field, value);
  }, [debouncedValidation]);

  // Mode switcher with form reset
  const swap = useCallback(() => {
    setMode(prev => prev === "signin" ? "signup" : "signin");
    setError("");
    setFieldErrors({});
    setForm({
      email: form.email, // Keep email when switching
      password: "",
      businessName: "",
      businessPhone: "",
      businessEmail: "",
      websiteUrl: ""
    });
  }, [form.email]);

  // Comprehensive form validation
  const validateForm = useCallback(() => {
    const errors = {};

    // Required fields validation
    if (!form.email?.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errors.email = "Invalid email format";
    }

    if (!form.password) {
      errors.password = "Password is required";
    } else if (mode === "signup") {
      if (form.password.length < 12) {
        errors.password = "Password must be at least 12 characters";
      } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/.test(form.password)) {
        errors.password = "Password must include uppercase, lowercase, number, and special character";
      }
    }

    if (mode === "signup") {
      if (!form.businessName?.trim()) {
        errors.businessName = "Business name is required";
      }

      // Optional field validations
      if (form.businessPhone && !/^\+?[\d\s\-()]+$/.test(form.businessPhone)) {
        errors.businessPhone = "Invalid phone number format";
      }

      if (form.businessEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.businessEmail)) {
        errors.businessEmail = "Invalid business email format";
      }

      if (form.websiteUrl && !/^https?:\/\/.+\..+/.test(form.websiteUrl)) {
        errors.websiteUrl = "Website URL must include protocol (https://)";
      }
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }, [form, mode]);

  // Form submission with anti-spam protection
  const submit = useCallback(async (e) => {
    e.preventDefault();
    
    // Prevent double submission
    if (submitRef.current || loading) return;
    submitRef.current = true;
    
    setError("");
    
    if (!validateForm()) {
      submitRef.current = false;
      return;
    }

    setLoading(true);
    
    try {
      const sanitizedData = {
        email: form.email.trim().toLowerCase(),
        password: form.password,
        ...(csrfToken && { _csrf: csrfToken })
      };

      if (mode === "signup") {
        sanitizedData.businessName = form.businessName.trim();
        if (form.businessPhone?.trim()) {
          sanitizedData.businessPhone = form.businessPhone.trim();
        }
        if (form.businessEmail?.trim()) {
          sanitizedData.businessEmail = form.businessEmail.trim().toLowerCase();
        }
        if (form.websiteUrl?.trim()) {
          sanitizedData.websiteUrl = form.websiteUrl.trim();
        }
      }

      const endpoint = mode === "signup" ? "/auth/signup" : "/auth/signin";
      const response = await api.post(endpoint, sanitizedData);

      // Handle different response formats
      if (response.data.success !== false) {
        onAuthenticated({
          token: response.data.token || null,
          user: response.data.user || null,
          notice: response.data.message || (mode === "signup" 
            ? "Account created! Please check your email to verify." 
            : "Welcome back!")
        });
      } else {
        throw new Error(response.data.message || "Authentication failed");
      }

    } catch (err) {
      console.error("Authentication error:", err);
      
      // Enhanced error handling
      let errorMessage = "An unexpected error occurred. Please try again.";
      
      if (err.message) {
        errorMessage = err.message;
      } else if (err.response?.data) {
        const data = err.response.data;
        if (data.errors && Array.isArray(data.errors)) {
          errorMessage = data.errors.map(e => `${e.field}: ${e.message}`).join(", ");
        } else if (data.message) {
          errorMessage = data.message;
        }
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
      submitRef.current = false;
    }
  }, [form, mode, validateForm, onAuthenticated, loading, csrfToken]);

  // Handle backdrop click
  const handleOverlayClick = useCallback((e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      onClose();
    }
  }, [onClose]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div
      className="modal-overlay"
      onClick={handleOverlayClick}
      style={{
        position: 'fixed',
        inset: 0,
        background: darkMode ? 'rgba(15, 23, 42, 0.85)' : 'rgba(148, 163, 184, 0.45)',
        backdropFilter: 'blur(14px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: 'var(--space-4)',
        overflowY: 'auto'
      }}
    >
      <div
        ref={modalRef}
        className="modal"
        style={{
          width: '100%',
          maxWidth: '520px',
          maxHeight: '90vh',
          overflowY: 'auto',
          background: darkMode
            ? 'linear-gradient(140deg, rgba(15,23,42,0.95), rgba(30,41,59,0.9))'
            : 'linear-gradient(140deg, rgba(255,255,255,0.98), rgba(241,245,249,0.95))',
          borderRadius: 'var(--rounded-2xl)',
          padding: 'var(--space-8)',
          border: darkMode
            ? '1px solid rgba(148,163,184,0.35)'
            : '1px solid rgba(148,163,184,0.45)',
          boxShadow: darkMode
            ? '0 40px 70px rgba(8, 15, 34, 0.55)'
            : '0 40px 70px rgba(148, 163, 184, 0.35)',
          position: 'relative',
          transform: 'scale(1)',
          transition: 'all 0.3s ease'
        }}
      >
        {/* Header */}
        <div className="modal-header" style={{ marginBottom: 'var(--space-6)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: '700',
              color: darkMode ? '#f8fafc' : '#0f172a',
              margin: 0
            }}>
              {mode === "signin" ? "Welcome Back" : "Create Your Account"}
            </h2>
            <ThemeToggle />
          </div>
          <button 
            className="close-btn" 
            onClick={onClose} 
            type="button"
            disabled={loading}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1.5rem',
              color: darkMode ? '#94a3b8' : '#475569',
              cursor: loading ? 'not-allowed' : 'pointer',
              padding: 'var(--space-2)',
              borderRadius: 'var(--rounded-lg)',
              transition: 'all 0.2s ease',
              opacity: loading ? 0.5 : 1
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.target.style.color = darkMode ? '#f8fafc' : '#0f172a';
                e.target.style.background = darkMode ? 'rgba(148,163,184,0.12)' : 'rgba(99,102,241,0.12)';
              }
            }}
            onMouseLeave={(e) => {
              e.target.style.color = darkMode ? '#94a3b8' : '#475569';
              e.target.style.background = 'none';
            }}
          >
            ×
          </button>
        </div>

        {/* Error Display */}
        {error && (
          <div style={{
            background: darkMode ? 'rgba(239, 68, 68, 0.15)' : 'rgba(254, 226, 226, 0.9)',
            border: darkMode ? '1px solid rgba(239,68,68,0.35)' : '1px solid rgba(239,68,68,0.45)',
            color: darkMode ? '#fca5a5' : '#b91c1c',
            padding: 'var(--space-3)',
            borderRadius: 'var(--rounded-lg)',
            marginBottom: 'var(--space-4)',
            fontSize: '0.875rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <span>⚠ </span>
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={submit} noValidate>
          {/* Signup-only fields */}
          {mode === "signup" && (
            <>
              <InputField
                label="Business Name"
                field="businessName"
                placeholder="Enter your business name"
                required
                autoComplete="organization"
                form={form}
                fieldErrors={fieldErrors}
                handleInputChange={handleInputChange}
                loading={loading}
                darkMode={darkMode}
              />

              <InputField
                label="Business Phone"
                field="businessPhone"
                placeholder="+971 50 123 4567"
                hint="International format preferred"
                autoComplete="tel"
                form={form}
                fieldErrors={fieldErrors}
                handleInputChange={handleInputChange}
                loading={loading}
                darkMode={darkMode}
              />

              <InputField
                label="Business Email"
                type="email"
                field="businessEmail"
                placeholder="support@yourbusiness.com"
                hint="Different from your login email"
                autoComplete="email"
                form={form}
                fieldErrors={fieldErrors}
                handleInputChange={handleInputChange}
                loading={loading}
                darkMode={darkMode}
              />

              <InputField
                label="Website URL"
                type="url"
                field="websiteUrl"
                placeholder="https://yourbusiness.com"
                autoComplete="url"
                form={form}
                fieldErrors={fieldErrors}
                handleInputChange={handleInputChange}
                loading={loading}
                darkMode={darkMode}
              />
            </>
          )}

          {/* Universal fields */}
          <InputField
            label="Email Address"
            type="email"
            field="email"
            placeholder="you@example.com"
            required
            autoComplete="email"
            form={form}
            fieldErrors={fieldErrors}
            handleInputChange={handleInputChange}
            loading={loading}
            darkMode={darkMode}
          />

          <InputField
            label="Password"
            type="password"
            field="password"
            placeholder="Enter your password"
            required
            hint={mode === "signup" 
              ? "Must be 12+ characters with uppercase, lowercase, number, and special character"
              : undefined
            }
            autoComplete={mode === "signin" ? "current-password" : "new-password"}
            form={form}
            fieldErrors={fieldErrors}
            handleInputChange={handleInputChange}
            loading={loading}
            darkMode={darkMode}
          />

          {/* Submit Button */}
          <button
            className="btn btn-primary"
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              marginTop: 'var(--space-4)',
              padding: 'var(--space-4)',
              fontSize: '1rem',
              fontWeight: '600',
              opacity: loading ? 0.7 : 1,
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: darkMode
                ? '0 20px 35px rgba(99, 102, 241, 0.35)'
                : '0 20px 35px rgba(99, 102, 241, 0.25)'
            }}
          >
            {loading && (
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
            )}
            <span>
              {loading 
                ? (mode === "signin" ? "Signing in..." : "Creating account...")
                : (mode === "signin" ? "Sign In" : "Create Account")
              }
            </span>
          </button>
        </form>

        {/* Mode Switch */}
        <div style={{
          marginTop: 'var(--space-6)',
          fontSize: '0.875rem',
          textAlign: 'center',
          color: darkMode ? '#94a3b8' : '#475569'
        }}>
          {mode === "signin" ? (
            <>
              New to Artifically?{" "}
              <button 
                className="linklike" 
                onClick={swap} 
                type="button"
                disabled={loading}
                style={{
                  opacity: loading ? 0.5 : 1,
                  cursor: loading ? 'not-allowed' : 'pointer'
                }}
              >
                Create an account
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button 
                className="linklike" 
                onClick={swap} 
                type="button"
                disabled={loading}
                style={{
                  opacity: loading ? 0.5 : 1,
                  cursor: loading ? 'not-allowed' : 'pointer'
                }}
              >
                Sign in
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;