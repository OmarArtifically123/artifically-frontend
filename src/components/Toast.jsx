// src/components/Toast.jsx
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

// ---------------------------
// Toast component
// ---------------------------
export function Toast({ message, type = "success", onClose }) {
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
    success: "var(--success)",
    error: "var(--danger)",
    warn: "var(--warning)",
    info: "var(--accent)",
  };

  return (
    <div
      className="toast"
      style={{ background: colors[type] || colors.success }}
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
