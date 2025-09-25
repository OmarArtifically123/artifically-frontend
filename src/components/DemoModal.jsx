import { useState } from "react";
import api from "../api";
import { toast } from "./Toast";
import { useTheme } from "../context/ThemeContext";

export default function DemoModal({ automation, onClose }) {
  const { darkMode } = useTheme();
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState(null);

  const run = async () => {
    setRunning(true);
    setResult(null);
    try {
      const res = await api.post("/ai/demo", { automationId: automation.id });
      setResult(res.data);
    } catch (err) {
      const res = err?.response?.data;
      if (res?.errors?.length) {
        setResult({
          status: "error",
          output: res.errors.map((e) => `${e.field}: ${e.message}`).join(", "),
          logs: [],
        });
      } else {
        toast(res?.message || "Demo failed", { type: "error" });
      }
    } finally {
      setRunning(false);
    }
  };

  const statusColor = result?.status === "success"
    ? darkMode ? "#6ee7b7" : "#047857"
    : darkMode ? "#fca5a5" : "#b91c1c";

  return (
    <div
      className="modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="demo-modal-title"
      style={{
        position: "fixed",
        inset: 0,
        background: darkMode ? "rgba(15, 23, 42, 0.65)" : "rgba(15, 23, 42, 0.35)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        display: "grid",
        placeItems: "center",
        padding: "2rem",
        zIndex: 1200,
      }}
    >
      <div
        className="modal"
        style={{
          width: "min(720px, 100%)",
          borderRadius: "1.5rem",
          padding: "2rem",
          background: darkMode
            ? "linear-gradient(135deg, rgba(15,23,42,0.92), rgba(30,41,59,0.88))"
            : "linear-gradient(135deg, rgba(255,255,255,0.98), rgba(241,245,249,0.95))",
          border: `1px solid ${darkMode ? "rgba(148,163,184,0.28)" : "rgba(148,163,184,0.45)"}`,
          boxShadow: darkMode
            ? "0 35px 65px rgba(8, 15, 34, 0.55)"
            : "0 25px 55px rgba(148, 163, 184, 0.35)",
          color: darkMode ? "#e2e8f0" : "#1f2937",
          display: "grid",
          gap: "1.5rem",
        }}
      >
        <div
          className="modal-header"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "1rem",
          }}
        >
          <h2 id="demo-modal-title" style={{ fontSize: "1.6rem", fontWeight: 700 }}>
            {automation.icon} {automation.name} Demo
          </h2>
          <button
            className="close-btn"
            onClick={onClose}
            aria-label="Close demo"
            style={{
              width: "2.25rem",
              height: "2.25rem",
              borderRadius: "999px",
              border: `1px solid ${darkMode ? "rgba(148,163,184,0.3)" : "rgba(148,163,184,0.4)"}`,
              background: "transparent",
              color: darkMode ? "#e2e8f0" : "#1f2937",
              fontSize: "1.2rem",
              cursor: "pointer",
            }}
          >
            ×
          </button>
        </div>

        <p style={{ color: darkMode ? "#94a3b8" : "#475569" }}>{automation.description}</p>

        {!result ? (
          <div style={{ textAlign: "center", padding: "2rem 0" }}>
            <button
              className="btn btn-primary"
              disabled={running}
              onClick={run}
              style={{
                padding: "0.9rem 1.6rem",
                borderRadius: "0.95rem",
                fontSize: "1rem",
              }}
            >
              {running ? <span className="loading" style={{ width: "1.5rem", height: "1.5rem" }}></span> : "Run Demo"}
            </button>
          </div>
        ) : (
          <>
            <div
              style={{
                background: darkMode ? "rgba(15,23,42,0.75)" : "rgba(248,250,252,0.95)",
                padding: "1.25rem",
                borderRadius: "1rem",
                border: `1px solid ${darkMode ? "rgba(148,163,184,0.28)" : "rgba(148,163,184,0.4)"}`,
                display: "grid",
                gap: "0.75rem",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  color: statusColor,
                  fontWeight: 700,
                }}
              >
                <span>{result.status === "success" ? "✅ Success" : "❌ Failed"}</span>
                {result.cost && result.latency && (
                  <div style={{ color: darkMode ? "#cbd5e1" : "#475569", fontSize: "0.85rem" }}>
                    Cost: {result.cost} • Latency: {result.latency}
                  </div>
                )}
              </div>
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.9rem",
                  lineHeight: 1.6,
                  color: darkMode ? "#f8fafc" : "#0f172a",
                  background: darkMode ? "rgba(15,23,42,0.85)" : "rgba(255,255,255,0.9)",
                  borderRadius: "0.85rem",
                  padding: "1rem",
                  border: `1px solid ${darkMode ? "rgba(148,163,184,0.18)" : "rgba(148,163,184,0.3)"}`,
                }}
              >
                {result.output || "No output provided."}
              </div>
            </div>
            {result.logs && result.logs.length > 0 && (
              <div style={{ display: "grid", gap: "0.75rem" }}>
                <h4 style={{ fontSize: "1rem", fontWeight: 600 }}>Execution Logs</h4>
                <div
                  style={{
                    background: darkMode ? "rgba(15,23,42,0.8)" : "rgba(15,23,42,0.85)",
                    color: "#f8fafc",
                    padding: "1rem",
                    borderRadius: "0.85rem",
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.85rem",
                    maxHeight: "240px",
                    overflowY: "auto",
                  }}
                >
                  {result.logs.map((log, index) => (
                    <div key={index} style={{ display: "flex", gap: "0.75rem", marginBottom: "0.5rem" }}>
                      <span style={{ opacity: 0.6 }}>[{log.time}]</span>
                      <span style={{ minWidth: "3rem", textTransform: "uppercase" }}>{log.level}</span>
                      <span>{log.message}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}