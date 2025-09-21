// src/components/AuthModal.jsx - FIXED INPUT REMOUNTING ISSUE
import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import { debounce } from "lodash";
import api from "../api";

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
  loading
}) => (
  <div className="form-group">
    <label className="form-label">
      {label} {required && <span style={{ color: 'var(--danger)' }}>*</span>}
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
        borderColor: fieldErrors[field] ? 'var(--danger)' : 'var(--border-color)',
        transition: 'all 0.2s ease'
      }}
    />
    {fieldErrors[field] && (
      <div style={{
        color: 'var(--danger)',
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
      <small className="form-hint">{hint}</small>
    )}
  </div>
);

const AuthModal = ({ onClose, onAuthenticated, initialMode = "signin" }) => {
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
        background: 'rgba(0, 0, 0, 0.8)',
        backdropFilter: 'blur(8px)',
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
          background: 'var(--bg-secondary)',
          borderRadius: 'var(--rounded-2xl)',
          padding: 'var(--space-8)',
          border: '1px solid var(--border-color)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          position: 'relative',
          transform: 'scale(1)',
          transition: 'all 0.3s ease'
        }}
      >
        {/* Header */}
        <div className="modal-header" style={{ marginBottom: 'var(--space-6)' }}>
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: '700',
            color: 'var(--white)',
            margin: 0
          }}>
            {mode === "signin" ? "Welcome Back" : "Create Your Account"}
          </h2>
          <button 
            className="close-btn" 
            onClick={onClose} 
            type="button"
            disabled={loading}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1.5rem',
              color: 'var(--gray-400)',
              cursor: loading ? 'not-allowed' : 'pointer',
              padding: 'var(--space-2)',
              borderRadius: 'var(--rounded-lg)',
              transition: 'all 0.2s ease',
              opacity: loading ? 0.5 : 1
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.target.style.color = 'var(--white)';
                e.target.style.background = 'var(--bg-glass)';
              }
            }}
            onMouseLeave={(e) => {
              e.target.style.color = 'var(--gray-400)';
              e.target.style.background = 'none';
            }}
          >
            ×
          </button>
        </div>

        {/* Error Display */}
        {error && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            color: 'var(--danger)',
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
              gap: '8px'
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
          color: 'var(--gray-400)'
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