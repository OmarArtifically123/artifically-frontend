import { useEffect, useMemo, useRef, useState } from "react";
import { useTheme } from "../context/ThemeContext";

function useIconPalette(icon) {
  const [palette, setPalette] = useState({
    primary: "rgba(99,102,241,0.65)",
    secondary: "rgba(14,165,233,0.45)",
    shadow: "rgba(15,23,42,0.45)",
  });
  const canvasRef = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined" || !icon) return;
    let frameId;
    const canvas = canvasRef.current || document.createElement("canvas");
    canvasRef.current = canvas;
    canvas.width = 96;
    canvas.height = 96;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#0f172a";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = "64px 'Segoe UI Emoji', 'Apple Color Emoji', 'Noto Color Emoji', sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(icon, canvas.width / 2, canvas.height / 2 + 6);
    const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height);

    let r = 0;
    let g = 0;
    let b = 0;
    let total = 0;

    for (let i = 0; i < data.length; i += 4) {
      const alpha = data[i + 3];
      if (alpha < 32) continue;
      r += data[i];
      g += data[i + 1];
      b += data[i + 2];
      total += 1;
    }

    if (!total) return;
    const avgR = Math.min(255, Math.round(r / total));
    const avgG = Math.min(255, Math.round(g / total));
    const avgB = Math.min(255, Math.round(b / total));

    const lighten = (value) => Math.min(255, Math.round(value + (255 - value) * 0.35));
    const darken = (value) => Math.max(0, Math.round(value * 0.55));

    frameId = requestAnimationFrame(() => {
      setPalette({
        primary: `rgba(${avgR}, ${avgG}, ${avgB}, 0.75)`,
        secondary: `rgba(${lighten(avgR)}, ${lighten(avgG)}, ${lighten(avgB)}, 0.35)`,
        shadow: `rgba(${darken(avgR)}, ${darken(avgG)}, ${darken(avgB)}, 0.55)`,
      });
    });

    return () => cancelAnimationFrame(frameId);
  }, [icon]);

  return palette;
}

export default function AutomationCard({ item, onDemo, onBuy }) {
  const { darkMode } = useTheme();
  const palette = useIconPalette(item.icon);

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
      className="automation-card glass-panel"
      data-glass="true"
      style={{
        position: "relative",
        display: "grid",
        gap: "1rem",
        padding: "1.85rem",
        borderRadius: "1.35rem",
        border: `1px solid ${darkMode ? "rgba(148,163,184,0.22)" : "rgba(148,163,184,0.32)"}`,
        background: `linear-gradient(145deg, ${palette.secondary}, rgba(15,23,42,0.8))`,
        boxShadow: `0 25px 45px ${palette.shadow}`,
        color: darkMode ? "#e2e8f0" : "#1f2937",
        transition: "transform var(--transition-fast), box-shadow var(--transition-fast)",
        overflow: "hidden",
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
            width: "3.25rem",
            height: "3.25rem",
            display: "grid",
            placeItems: "center",
            fontSize: "1.9rem",
            borderRadius: "1rem",
            background: `linear-gradient(135deg, ${palette.primary}, rgba(255,255,255,0.12))`,
            boxShadow: `0 12px 25px ${palette.shadow}`,
            color: "#fff",
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

      <h3 style={{ fontSize: "1.3rem", fontWeight: 700 }}>{item.name}</h3>
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
                background: `linear-gradient(135deg, ${palette.primary}, ${palette.secondary})`,
                color: "#0f172a",
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
          data-magnetic="true"
          data-ripple="true"
          data-magnetic-strength="0.75"
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
          data-magnetic="true"
          data-ripple="true"
          data-magnetic-strength="1.1"
          onClick={() => onBuy(item)}
          style={{
            padding: "0.6rem 1.2rem",
            borderRadius: "0.85rem",
            boxShadow: `0 15px 30px ${palette.shadow}`,
          }}
        >
          Buy & Deploy
        </button>
      </div>
    </div>
  );
}