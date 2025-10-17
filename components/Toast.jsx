"use client";

import { space } from "../styles/spacing";
// src/components/Toast.jsx
import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { useTheme } from "../context/ThemeContext";
import { Icon } from "./icons";

function CelebrationIcon({ darkMode }) {
  const confettiPieces = useMemo(
    () =>
      Array.from({ length: 14 }).map((_, index) => ({
        id: index,
        delay: `${(index * 70) % 500}ms`,
        duration: `${1400 + (index % 5) * 120}ms`,
        offset: `${(index % 2 === 0 ? -1 : 1) * (6 + (index % 4) * 2)}px`,
      })),
    []
  );

  return (
    <div
      className="toast-celebration"
      style={{
        background: darkMode ? "rgba(14, 165, 233, 0.16)" : "rgba(129, 230, 217, 0.35)",
        borderRadius: "1rem",
        inset: 0,
      }}
    >
      <span className="toast-celebration__burst" aria-hidden="true" />
      {confettiPieces.map((piece) => (
        <span
          key={piece.id}
          className="toast-confetti"
          style={{
            animationDelay: piece.delay,
            animationDuration: piece.duration,
            transform: `translateX(${piece.offset})`,
          }}
          aria-hidden="true"
        />
      ))}
      <span className="toast-celebration__icon" role="presentation" aria-hidden="true">
        <Icon name="celebration" size={22} />
      </span>
    </div>
  );
}

// ---------------------------
// Toast component
// ---------------------------
export function ToastItem({ data, onClose }) {
  const { darkMode } = useTheme();
  const { message, type = "success", title, description, reward, duration } = data;

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
    success: "check",
    error: "alert",
    warn: "alert",
    info: "info",
    celebration: "celebration",
  };

  return (
    <div
      className="toast"
      style={{
        display: "flex",
        alignItems: "center",
        gap: space("sm"),
        background: colors[type] || colors.success,
        color: darkMode ? "#0f172a" : "#0f172a",
        boxShadow: darkMode
          ? "0 24px 45px rgba(8, 15, 34, 0.45)"
          : "0 24px 45px rgba(148, 163, 184, 0.35)",
        borderRadius: "1.25rem",
        padding: `${space("sm")} ${space("fluid-sm")}`,
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
          position: "relative",
          overflow: "hidden",
        }}
      >
        {type === "celebration" ? (
          <CelebrationIcon darkMode={darkMode} />
        ) : (
          <Icon name={icons[type] || icons.success} size={22} />
        )}
      </div>

      <div style={{ display: "grid", gap: space("2xs"), flex: 1 }}>
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
              gap: space("2xs", 1.4),
            }}
          >
            <Icon name="gift" size={16} /> {reward}
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
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setToasts = _setToasts;
    return () => {
      if (setToasts === _setToasts) {
        setToasts = undefined;
      }
    };
  }, [_setToasts]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted || typeof document === "undefined") {
    return null;
  }

  const hasAssertiveToast = toasts.some((toastItem) => toastItem.type === "error" || toastItem.type === "warn");
  const liveMode = hasAssertiveToast ? "assertive" : "polite";

  return createPortal(
    <div
      style={{ position: "fixed", top: 20, right: 20, zIndex: 1200 }}
      role="status"
      aria-live={liveMode}
      aria-atomic="true"
      aria-label="Notifications"
    >
      <div style={{ display: "grid", gap: space("sm") }}>
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

export default ToastHost;