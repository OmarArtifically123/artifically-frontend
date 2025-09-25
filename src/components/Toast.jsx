// src/components/Toast.jsx
import { useEffect, useState } from "react";
import { useTheme } from "../context/ThemeContext";
import { createPortal } from "react-dom";

// ---------------------------
// Toast component
// ---------------------------
export function Toast({ message, type = "success", onClose }) {
  const { darkMode } = useTheme();
  useEffect(() => {
    const t = setTimeout(onClose, 3500); // auto-dismiss after 3.5s
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => {
      clearTimeout(t);
      window.removeEventListener("keydown", handleKey);
    };
  }, [onClose]);

  const colors = {
    success: darkMode ? "#10b981" : "#047857",
    error: darkMode ? "#f87171" : "#b91c1c",
    warn: darkMode ? "#facc15" : "#b45309",
    info: darkMode ? "#38bdf8" : "#0369a1",
  };

  return (
    <div
      className="toast"
      style={{
        background: `${colors[type] || colors.success}EE`,
        color: '#0f172a',
        boxShadow: darkMode
          ? '0 20px 35px rgba(8, 15, 34, 0.45)'
          : '0 20px 35px rgba(148, 163, 184, 0.35)',
        borderRadius: '1rem',
        padding: '0.85rem 1.1rem',
        fontWeight: 600,
        minWidth: '220px'
      }}
    >
      {message}
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
      { id: Date.now(), message, type: opts.type || "success" },
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
  setToasts = _setToasts;

  return createPortal(
    <div style={{ position: "fixed", top: 20, right: 20, zIndex: 1200 }}>
      {toasts.map((t) => (
        <Toast
          key={t.id}
          message={t.message}
          type={t.type}
          onClose={() =>
            _setToasts((prev) => prev.filter((toast) => toast.id !== t.id))
          }
        />
      ))}
    </div>,
    document.body
  );
}

export default Toast;
