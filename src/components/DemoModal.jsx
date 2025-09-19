import { useState } from "react";
import api from "./api";
import Toast from "./Toast";

export default function DemoModal({ automation, onClose }) {
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
          output: res.errors.map(e => `${e.field}: ${e.message}`).join(", "),
          logs: [],
        });
      } else {
        Toast({ message: res?.message || "Demo failed", onClose: () => {} });
      }
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h2>{automation.icon} {automation.name} Demo</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <p style={{ color: "var(--gray-600)", marginBottom: 16 }}>
          {automation.description}
        </p>

        {!result ? (
          <div style={{ textAlign: "center", padding: "24px 0" }}>
            <button className="btn btn-primary" disabled={running} onClick={run}>
              {running ? <span className="loading"></span> : "Run Demo"}
            </button>
          </div>
        ) : (
          <>
            <div style={{ background: "var(--off-white)", padding: 16, borderRadius: 8, marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ color: result.status === "success" ? "var(--success)" : "var(--danger)", fontWeight: 600 }}>
                  {result.status === "success" ? "✅ SUCCESS" : "❌ FAILED"}
                </span>
                {result.cost && result.latency && (
                  <div style={{ color: "var(--gray-600)", fontSize: 14 }}>
                    Cost: {result.cost} • Latency: {result.latency}
                  </div>
                )}
              </div>
              <div style={{ fontFamily: "monospace", fontSize: 14 }}>
                {result.output || "No output provided."}
              </div>
            </div>
            {result.logs && result.logs.length > 0 && (
              <div>
                <h4 style={{ marginBottom: 8 }}>Execution Logs</h4>
                <div style={{ background: "var(--charcoal)", color: "white", padding: 12, borderRadius: 8, fontFamily: "monospace", fontSize: 12 }}>
                  {result.logs.map((log, i) => (
                    <div key={i} style={{ marginBottom: 4 }}>
                      <span style={{ opacity: 0.7 }}>[{log.time}]</span>
                      <span style={{ marginLeft: 8 }}>{log.level}</span>
                      <span style={{ marginLeft: 8 }}>{log.message}</span>
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
