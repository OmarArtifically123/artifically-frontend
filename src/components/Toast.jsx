// src/components/Toast.jsx
import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import Lottie from "lottie-react";
import { useTheme } from "../context/ThemeContext";

// ---------------------------
// Toast component
// ---------------------------
export function ToastItem({ data, onClose }) {
  const { darkMode } = useTheme();
  const {
    message,
    type = "success",
    title,
    description,
    animation,
    reward,
    duration,
  } = data;

  const displayTitle = title || message;
  const displayDescription = description || (title ? message : "");
  const dismissAfter = duration ?? 3500;

  useEffect(() => {
    const t = setTimeout(onClose, dismissAfter);
    const handleKey = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => {
      clearTimeout(t);
      window.removeEventListener("keydown", handleKey);
    };
  }, [dismissAfter, onClose]);

  const colors = useMemo(
    () => ({
      success: darkMode ? "rgba(16,185,129,0.92)" : "rgba(16,185,129,0.92)",
      error: darkMode ? "rgba(239,68,68,0.92)" : "rgba(239,68,68,0.95)",
      warn: darkMode ? "rgba(250,204,21,0.92)" : "rgba(250,204,21,0.94)",
      info: darkMode ? "rgba(59,130,246,0.92)" : "rgba(37,99,235,0.94)",
      celebration: darkMode ? "rgba(99,102,241,0.95)" : "rgba(79,70,229,0.95)",
    }),
    [darkMode]
  );

  const icons = {
    success: "✅",
    error: "⚠️",
    warn: "⚠️",
    info: "ℹ️",
    celebration: "🎉",
  };

  return (
    <div
      className="toast"
      style={{
        display: "flex",
        alignItems: "center",
        gap: "1rem",
        background: colors[type] || colors.success,
        color: darkMode ? "#0f172a" : "#0f172a",
        boxShadow: darkMode
          ? "0 24px 45px rgba(8, 15, 34, 0.45)"
          : "0 24px 45px rgba(148, 163, 184, 0.35)",
        borderRadius: "1.25rem",
        padding: "1rem 1.25rem",
        minWidth: "260px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          width: 60,
          height: 60,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: darkMode ? "rgba(15,23,42,0.35)" : "rgba(255,255,255,0.55)",
          borderRadius: "1rem",
          flexShrink: 0,
        }}
      >
        {animation ? (
          <Lottie
            animationData={animation}
            loop={false}
            style={{ width: 60, height: 60 }}
          />
        ) : (
          <span style={{ fontSize: "1.75rem" }}>{icons[type] || icons.success}</span>
        )}
      </div>

      <div style={{ display: "grid", gap: "0.25rem", flex: 1 }}>
        {displayTitle && (
          <strong style={{ fontSize: "1rem", color: darkMode ? "#0f172a" : "#0f172a" }}>
            {displayTitle}
          </strong>
        )}
        {displayDescription && (
          <span style={{ fontSize: "0.9rem", color: darkMode ? "#0f172a" : "#0f172a" }}>
            {displayDescription}
          </span>
        )}
        {reward && (
          <span
            style={{
              fontSize: "0.85rem",
              fontWeight: 600,
              color: darkMode ? "#1e293b" : "#1e293b",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.35rem",
            }}
          >
            🎁 {reward}
          </span>
        )}
      </div>

      <button
        type="button"
        onClick={onClose}
        aria-label="Dismiss notification"
        style={{
          appearance: "none",
          border: "none",
          background: "transparent",
          color: darkMode ? "#0f172a" : "#0f172a",
          fontSize: "1.25rem",
          lineHeight: 1,
          cursor: "pointer",
          padding: 0,
        }}
      >
        ×
      </button>
    </div>
  );
}

// ---------------------------
// Global Toast Store
// ---------------------------
let setToasts;
export function toast(message, opts = {}) {
  if (setToasts) {
    setToasts((prev) => [
      ...prev,
      {
        id: Date.now() + Math.random(),
        message,
        type: opts.type || "success",
        title: opts.title,
        description: opts.description,
        animation: opts.animation,
        reward: opts.reward,
        duration: opts.duration,
      },
    ]);
  } else {
    console.warn("ToastHost not mounted yet, toast ignored:", message);
  }
}

// ---------------------------
// Toast Host (renders all toasts)
// ---------------------------
export function ToastHost() {
  const [toasts, _setToasts] = useState([]);
  
  useEffect(() => {
    setToasts = _setToasts;
    return () => {
      if (setToasts === _setToasts) {
        setToasts = undefined;
      }
    };
  }, [_setToasts]);

  if (typeof document === "undefined") {
    return null;
  }

  return createPortal(
    <div style={{ position: "fixed", top: 20, right: 20, zIndex: 1200 }}>
      <div style={{ display: "grid", gap: "1rem" }}>
        {toasts.map((toastItem) => (
          <ToastItem
            key={toastItem.id}
            data={toastItem}
            onClose={() =>
              _setToasts((prev) => prev.filter((toast) => toast.id !== toastItem.id))
            }
          />
        ))}
      </div>
    </div>,
    document.body
  );
}

export default Toast;