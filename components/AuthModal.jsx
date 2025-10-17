// components/AuthModal.jsx
import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import { useTheme } from "../context/ThemeContext";
import debounce from "lodash/debounce";
import api from "../api";
import ThemeToggle from "./ThemeToggle";
import Button from "./ui/Button";
import { Icon } from "./icons";

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
    style={{ display: 'grid', gap: 'calc(var(--space-2xs) * 1.5)' }}
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
        padding: 'var(--space-xs) var(--space-sm)',
        borderRadius: '0.85rem',
        transition: 'all 0.2s ease'
      }}
    />
    {fieldErrors[field] && (
      <div style={{
        color: '#ef4444',
        fontSize: '0.75rem',
        marginTop: 'var(--space-2xs)',
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-2xs)'
      }}>
        <Icon name="alert" size={16} aria-hidden="true" />
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
  const [step, setStep] = useState(0);
  const modalRef = useRef(null);
  const submitRef = useRef(false);

  const stepGroups = useMemo(
    () =>
      mode === "signup"
        ? [
            ["email", "password"],
            ["businessName", "businessPhone", "businessEmail", "websiteUrl"],
          ]
        : [["email", "password"]],
    [mode]
  );

  const stepLabels = useMemo(
    () =>
      mode === "signup"
        ? ["Account", "Business Profile"]
        : ["Secure Sign In"],
    [mode]
  );

  const totalSteps = stepGroups.length;
  const isFinalStep = step >= totalSteps - 1;
  const stepProgress = Math.round(((step + 1) / totalSteps) * 100);

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

  useEffect(() => {
    setStep(0);
    setError("");
    setFieldErrors({});
  }, [mode]);

  const validators = useMemo(
    () => ({
      email: (value) => {
        const trimmed = value?.trim?.() || "";
        if (!trimmed) {
          return "Email is required";
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
          return "Invalid email format";
        }
        return null;
      },
      password: (value) => {
        if (!value) {
          return "Password is required";
        }

        if (mode === "signup") {
          if (value.length < 12) {
            return "Password must be at least 12 characters";
          }
          if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/.test(value)) {
            return "Password must include uppercase, lowercase, number, and special character";
          }
        }

        return null;
      },
      businessName: (value) => {
        if (mode !== "signup") {
          return null;
        }

        const trimmed = value?.trim?.() || "";
        if (!trimmed) {
          return "Business name is required";
        }
        if (trimmed.length < 2) {
          return "Business name is required";
        }
        return null;
      },
      businessPhone: (value) => {
        if (!value) {
          return null;
        }
        if (!/^\+?[\d\s\-()]+$/.test(value)) {
          return "Invalid phone number format";
        }
        return null;
      },
      businessEmail: (value) => {
        if (!value) {
          return null;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          return "Invalid business email format";
        }
        return null;
      },
      websiteUrl: (value) => {
        if (!value) {
          return null;
        }
        if (!/^https?:\/\/.+\..+/.test(value)) {
          return "Website URL must include protocol (https://)";
        }
        return null;
      },
    }),
    [mode]
  );

  const validateField = useCallback(
    (field, value = form[field]) => {
      const validator = validators[field];
      if (!validator) {
        return true;
      }

      const result = validator(value);
      setFieldErrors((prev) => ({
        ...prev,
        [field]: result,
      }));

      return !result;
    },
    [form, validators]
  );

  const debouncedValidation = useMemo(
    () =>
      debounce((field, value) => {
        validateField(field, value);
      }, 250),
    [validateField]
  );

  useEffect(() => () => debouncedValidation.cancel(), [debouncedValidation]);

  const handleInputChange = useCallback(
    (field, value) => {
      setForm((prev) => ({ ...prev, [field]: value }));
      setError("");
      debouncedValidation(field, value);
    },
    [debouncedValidation]
  );

  const validateFields = useCallback(
    (fields) => {
      const targets = fields && fields.length ? fields : Object.keys(validators);
      const results = {};

      targets.forEach((field) => {
        const validator = validators[field];
        if (!validator) {
          return;
        }
        results[field] = validator(form[field]) || null;
      });

      if (Object.keys(results).length) {
        setFieldErrors((prev) => ({
          ...prev,
          ...Object.fromEntries(
            Object.entries(results).map(([key, value]) => [key, value])
          ),
        }));
      }

      return Object.values(results).every((value) => !value);
    },
    [form, validators]
  );

  const validateForm = useCallback(() => validateFields(), [validateFields]);

  const validateCurrentStep = useCallback(
    () => validateFields(stepGroups[step] || []),
    [stepGroups, step, validateFields]
  );

  // Mode switcher with form reset
  const swap = useCallback(() => {
    setMode(prev => prev === "signin" ? "signup" : "signin");
    setError("");
    setFieldErrors({});
    setStep(0);
    setForm({
      email: form.email, // Keep email when switching
      password: "",
      businessName: "",
      businessPhone: "",
      businessEmail: "",
      websiteUrl: ""
    });
  }, [form.email]);

  // Form submission with anti-spam protection
  const submit = useCallback(async () => {
    if (submitRef.current || loading) return;
    submitRef.current = true;

    setError("");

    if (!validateForm()) {
      submitRef.current = false;
      return;
    }

    setLoading(true);

    try {
      const normalizedEmail = form.email.trim().toLowerCase();
      const sanitizedData = {
        identifier: normalizedEmail,
        email: normalizedEmail,
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

      if (response.data.success !== false) {
        onAuthenticated({
          user: response.data.user || null,
          notice:
            response.data.message ||
            (mode === "signup"
              ? "Account created! Please check your email to verify."
              : "Welcome back!"),
          sessionEstablished: true
        });
      } else {
        throw new Error(response.data.message || "Authentication failed");
      }

    } catch (err) {
      if (process.env.NODE_ENV !== "production") {
        console.warn("Authentication error:", err);
      }

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

  const handleFormSubmit = useCallback(
    (event) => {
      event.preventDefault();

      if (mode === "signup" && !isFinalStep) {
        if (validateCurrentStep()) {
          setStep((prev) => Math.min(prev + 1, totalSteps - 1));
        }
        return;
      }

      if (!validateForm()) {
        return;
      }

      submit();
    },
    [mode, isFinalStep, validateCurrentStep, totalSteps, validateForm, submit]
  );

  const handleStepBack = useCallback(() => {
    setStep((prev) => Math.max(0, prev - 1));
  }, []);

  const accountFields = (
    <>
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
          : undefined}
        autoComplete={mode === "signin" ? "current-password" : "new-password"}
        form={form}
        fieldErrors={fieldErrors}
        handleInputChange={handleInputChange}
        loading={loading}
        darkMode={darkMode}
      />
    </>
  );

  const businessFields = (
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
  );

  const showAccountFields = mode !== "signup" || step === 0;
  const showBusinessFields = mode === "signup" && step >= 1;
  const primaryActionLabel = loading
    ? mode === "signin"
      ? "Signing in..."
      : "Creating account..."
    : mode === "signup"
      ? isFinalStep
        ? "Create Account"
        : "Continue"
      : "Sign In";

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
        background: darkMode
          ? 'linear-gradient(135deg, oklch(0.12 0.03 264 / 0.78), oklch(0.08 0.02 270 / 0.65))'
          : 'linear-gradient(135deg, oklch(0.92 0.03 264 / 0.75), oklch(0.85 0.03 270 / 0.62))',
        backdropFilter: 'blur(40px) saturate(180%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: 'var(--space-sm)',
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
            ? 'linear-gradient(135deg, oklch(0.18 0.03 264 / 0.92), oklch(0.12 0.02 270 / 0.78))'
            : 'linear-gradient(135deg, oklch(0.94 0.02 264 / 0.96), oklch(0.86 0.02 270 / 0.85))',
          borderRadius: 'var(--rounded-2xl)',
          padding: 'var(--space-lg)',
          border: darkMode
            ? '1px solid oklch(0.35 0.08 264 / 0.35)'
            : '1px solid oklch(0.62 0.05 264 / 0.35)',
          boxShadow: darkMode
            ? 'inset 0 1px 0 oklch(0.45 0.12 264 / 0.2), 0 55px 120px oklch(0.08 0.02 264 / 0.55)'
            : 'inset 0 1px 0 oklch(0.84 0.04 264 / 0.3), 0 55px 120px oklch(0.82 0.02 250 / 0.35)',
          position: 'relative',
          transform: 'scale(1)',
          transition: 'all 0.3s ease',
          backdropFilter: 'blur(32px) saturate(180%)',
          WebkitBackdropFilter: 'blur(32px) saturate(180%)'
        }}
      >
        {/* Header */}
        <div className="modal-header" style={{ marginBottom: 'var(--space-md)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 'var(--space-sm)' }}>
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
              padding: 'var(--space-xs)',
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
            background: darkMode
              ? 'linear-gradient(135deg, oklch(0.42 0.22 25 / 0.25), oklch(0.32 0.18 25 / 0.2))'
              : 'linear-gradient(135deg, oklch(0.9 0.12 25 / 0.85), oklch(0.82 0.1 25 / 0.72))',
            border: darkMode ? '1px solid oklch(0.6 0.18 25 / 0.45)' : '1px solid oklch(0.65 0.16 25 / 0.5)',
            color: darkMode ? '#fecaca' : '#b91c1c',
            padding: 'var(--space-sm)',
            borderRadius: 'var(--rounded-lg)',
            marginBottom: 'var(--space-sm)',
            fontSize: '0.875rem',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-xs)'
          }}>
            <Icon name="alert" size={16} aria-hidden="true" />
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleFormSubmit} noValidate style={{ display: 'grid', gap: 'var(--space-md)' }}>
          <div style={{ display: 'grid', gap: 'var(--space-xs)' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 'var(--space-xs)',
              }}
            >
              <span style={{ fontWeight: 600, color: darkMode ? '#f8fafc' : '#0f172a' }}>
                Step {Math.min(step + 1, totalSteps)} of {totalSteps}
              </span>
              <div style={{ display: 'flex', gap: 'var(--space-xs)', flexWrap: 'wrap' }}>
                {stepLabels.map((label, index) => {
                  const active = index === step;
                  return (
                    <span
                      key={label}
                      style={{
                        padding: 'calc(var(--space-2xs) * 1.4) var(--space-xs)',
                        borderRadius: '999px',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        background: active
                          ? (darkMode ? 'rgba(99,102,241,0.25)' : 'rgba(79,70,229,0.15)')
                          : (darkMode ? 'rgba(148,163,184,0.12)' : 'rgba(148,163,184,0.18)'),
                        color: active
                          ? (darkMode ? '#c7d2fe' : '#4338ca')
                          : (darkMode ? '#94a3b8' : '#475569'),
                        transition: 'all 0.2s ease',
                      }}
                    >
                      {index + 1}. {label}
                    </span>
                  );
                })}
              </div>
            </div>
            <div
              style={{
                width: '100%',
                height: '6px',
                borderRadius: '999px',
                background: darkMode ? 'rgba(148,163,184,0.18)' : 'rgba(148,163,184,0.25)',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  width: `${stepProgress}%`,
                  height: '100%',
                  background: 'linear-gradient(90deg, #6366f1, #22d3ee)',
                  borderRadius: 'inherit',
                  transition: 'width 0.35s ease',
                }}
              />
            </div>
          </div>

          {mode === 'signup' && step > 0 && (
            <div
              style={{
                padding: 'var(--space-sm) calc(var(--space-sm) * 1.1)',
                borderRadius: '1rem',
                background: darkMode ? 'rgba(99,102,241,0.12)' : 'rgba(79,70,229,0.08)',
                color: darkMode ? '#c7d2fe' : '#3730a3',
                display: 'grid',
                gap: 'calc(var(--space-2xs) * 1.5)',
                fontSize: '0.9rem',
              }}
            >
              <strong style={{ fontSize: '0.95rem' }}>Account ready</strong>
              <span>
                We'll use {form.email || 'your email'} for secure sign in. Need to change it?
                Just go back one step.
              </span>
            </div>
          )}

          {showAccountFields && (
            <div style={{ display: 'grid', gap: 'var(--space-sm)' }}>{accountFields}</div>
          )}

          {showBusinessFields && (
            <div style={{ display: 'grid', gap: 'var(--space-sm)' }}>{businessFields}</div>
          )}

          <div
            style={{
              display: 'flex',
              justifyContent: mode === 'signup' && step > 0 ? 'space-between' : 'flex-end',
              alignItems: 'center',
              gap: 'var(--space-sm)',
              marginTop: 'var(--space-xs)',
            }}
          >
            {mode === 'signup' && step > 0 && (
              <Button
                type="button"
                size="sm"
                variant="secondary"
                glowOnHover={false}
                onClick={handleStepBack}
              >
                ← Back
              </Button>
            )}

            <Button
              type="submit"
              size="md"
              variant="primary"
              disabled={loading}
              style={{
                width: mode === 'signup' && step > 0 ? 'auto' : '100%',
                minWidth: '160px',
                gap: 'var(--space-xs)',
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
                    animation: 'spin 1s linear infinite',
                  }}
                />
              )}
              <span>{primaryActionLabel}</span>
            </Button>
          </div>
        </form>

        {/* Mode Switch */}
        <div style={{
          marginTop: 'var(--space-md)',
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
// TEMP
export default AuthModal;