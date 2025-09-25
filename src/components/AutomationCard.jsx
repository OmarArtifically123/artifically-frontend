import { useMemo } from "react";
import { useTheme } from "../context/ThemeContext";

export default function AutomationCard({ item, onDemo, onBuy }) {
  const { darkMode } = useTheme();

  const formatPrice = useMemo(
    () =>
      (price, currency = "USD") =>
        new Intl.NumberFormat("en-US", {
          style: "currency",
          currency,
          minimumFractionDigits: 0,
        }).format(price),
    []
  );

  return (
    <div
      className="automation-card"
      style={{
        position: "relative",
        display: "grid",
        gap: "1rem",
        padding: "1.75rem",
        borderRadius: "1.25rem",
        border: `1px solid ${darkMode ? "rgba(148,163,184,0.22)" : "rgba(148,163,184,0.32)"}`,
        background: darkMode
          ? "linear-gradient(145deg, rgba(15,23,42,0.85), rgba(30,41,59,0.9))"
          : "linear-gradient(145deg, rgba(255,255,255,0.95), rgba(241,245,249,0.92))",
        boxShadow: darkMode
          ? "0 25px 45px rgba(8, 15, 34, 0.55)"
          : "0 20px 35px rgba(148, 163, 184, 0.35)",
        color: darkMode ? "#e2e8f0" : "#1f2937",
        transition: "transform var(--transition-fast), box-shadow var(--transition-fast)",
      }}
    >
      <div
        className="card-header"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div
          className="card-icon"
          style={{
            width: "3rem",
            height: "3rem",
            display: "grid",
            placeItems: "center",
            fontSize: "1.75rem",
            borderRadius: "0.9rem",
            background: darkMode ? "rgba(99,102,241,0.18)" : "rgba(99,102,241,0.12)",
          }}
        >
          {item.icon}
        </div>
        <div
          className="card-price"
          style={{
            fontWeight: 700,
            fontSize: "1rem",
            color: darkMode ? "#cbd5e1" : "#475569",
          }}
        >
          {formatPrice(item.priceMonthly, item.currency)}/mo
        </div>
      </div>

      <h3 style={{ fontSize: "1.25rem", fontWeight: 700 }}>{item.name}</h3>
      <p style={{ color: darkMode ? "#94a3b8" : "#4b5563" }}>{item.description}</p>

      {item.tags?.length > 0 && (
        <div
          className="card-tags"
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "0.5rem",
          }}
        >
          {item.tags.map((tag) => (
            <span
              className="tag"
              key={tag}
              style={{
                padding: "0.35rem 0.65rem",
                borderRadius: "0.75rem",
                fontSize: "0.75rem",
                fontWeight: 600,
                letterSpacing: "0.05em",
                textTransform: "uppercase",
                background: darkMode ? "rgba(99,102,241,0.18)" : "rgba(99,102,241,0.12)",
                color: darkMode ? "#a5b4fc" : "#4338ca",
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      <div
        className="card-actions"
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "0.75rem",
        }}
      >
        <button
          className="btn btn-secondary btn-small"
          onClick={() => onDemo(item)}
          style={{
            padding: "0.6rem 1.1rem",
            borderRadius: "0.85rem",
            border: `1px solid ${darkMode ? "rgba(148,163,184,0.35)" : "rgba(148,163,184,0.45)"}`,
            background: darkMode ? "rgba(15,23,42,0.75)" : "rgba(255,255,255,0.95)",
            color: darkMode ? "#e2e8f0" : "#1f2937",
          }}
        >
          Try Demo
        </button>
        <button
          className="btn btn-primary btn-small"
          onClick={() => onBuy(item)}
          style={{
            padding: "0.6rem 1.2rem",
            borderRadius: "0.85rem",
            boxShadow: darkMode
              ? "0 15px 30px rgba(99, 102, 241, 0.35)"
              : "0 15px 30px rgba(99, 102, 241, 0.25)",
          }}
        >
          Buy & Deploy
        </button>
      </div>
    </div>
  );
}