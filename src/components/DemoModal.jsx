// src/components/DemoModal.jsx - Enhanced with Dark Mode
import { useState, useEffect } from "react";
import api from "../api";
import { toast } from "./Toast";

export default function DemoModal({ automation, onClose }) {
  const [darkMode, setDarkMode] = useState(true);
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState(null);

  // Get theme from document
  useEffect(() => {
    const theme = document.documentElement.getAttribute('data-theme');
    setDarkMode(theme === 'dark' || theme === null);
    
    // Listen for theme changes
    const observer = new MutationObserver(() => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      setDarkMode(currentTheme === 'dark' || currentTheme === null);
    });
    
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme']
    });
    
    return () => observer.disconnect();
  }, []);

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
        toast(res?.message || "Demo failed", { type: "error" });
      }
    } finally {
      setRunning(false);
    }
  };

  // Handle backdrop click
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
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
        padding: '1rem'
      }}
    >
      <div 
        className="modal"
        style={{
          width: '100%',
          maxWidth: '600px',
          maxHeight: '90vh',
          overflowY: 'auto',
          background: darkMode
            ? 'rgba(30, 41, 59, 0.95)'
            : 'rgba(255, 255, 255, 0.95)',
          borderRadius: '1.5rem',
          padding: '2rem',
          border: `1px solid ${darkMode ? 'rgba(148, 163, 184, 0.2)' : 'rgba(0, 0, 0, 0.1)'}`,
          boxShadow: darkMode
            ? '0 25px 50px rgba(0, 0, 0, 0.3)'
            : '0 25px 50px rgba(0, 0, 0, 0.15)',
          position: 'relative',
          backdropFilter: 'blur(20px)'
        }}
      >
        <div 
          className="modal-header"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1.5rem'
          }}
        >
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: '700',
            color: darkMode ? '#ffffff' : '#1e293b',
            margin: 0,
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <span style={{ fontSize: '1.75rem' }}>{automation.icon}</span>
            {automation.name} Demo
          </h2>
          
          <button 
            className="close-btn" 
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1.5rem',
              color: darkMode ? '#94a3b8' : '#64748b',
              cursor: 'pointer',
              padding: '0.5rem',
              borderRadius: '0.5rem',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.color = darkMode ? '#ffffff' : '#1e293b';
              e.target.style.background = darkMode
                ? 'rgba(255, 255, 255, 0.05)'
                : 'rgba(0, 0, 0, 0.05)';
            }}
            onMouseLeave={(e) => {
              e.target.style.color = darkMode ? '#94a3b8' : '#64748b';
              e.target.style.background = 'none';
            }}
          >
            ×
          </button>
        </div>

        <p style={{ 
          color: darkMode ? '#94a3b8' : '#64748b', 
          marginBottom: '1.5rem',
          lineHeight: '1.6'
        }}>
          {automation.description}
        </p>

        {!result ? (
          <div style={{ textAlign: "center", padding: "2rem 0" }}>
            <button 
              className="btn btn-primary" 
              disabled={running} 
              onClick={run}
              style={{
                background: running 
                  ? (darkMode ? 'rgba(99, 102, 241, 0.5)' : 'rgba(99, 102, 241, 0.7)')
                  : 'linear-gradient(135deg, #6366f1 0%, #5855eb 100%)',
                color: '#ffffff',
                padding: '1rem 2rem',
                border: 'none',
                borderRadius: '0.75rem',
                fontWeight: '600',
                fontSize: '1rem',
                cursor: running ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: darkMode
                  ? '0 4px 20px rgba(99, 102, 241, 0.4)'
                  : '0 4px 20px rgba(99, 102, 241, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                opacity: running ? 0.7 : 1
              }}
              onMouseEnter={(e) => {
                if (!running) {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = darkMode
                    ? '0 8px 30px rgba(99, 102, 241, 0.5)'
                    : '0 8px 30px rgba(99, 102, 241, 0.4)';
                }
              }}
              onMouseLeave={(e) => {
                if (!running) {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = darkMode
                    ? '0 4px 20px rgba(99, 102, 241, 0.4)'
                    : '0 4px 20px rgba(99, 102, 241, 0.3)';
                }
              }}
            >
              {running ? (
                <>
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
                  Running Demo...
                </>
              ) : (
                'Run Demo'
              )}
            </button>
          </div>
        ) : (
          <>
            <div style={{ 
              background: darkMode
                ? 'rgba(255, 255, 255, 0.05)'
                : 'rgba(0, 0, 0, 0.05)', 
              padding: '1.5rem', 
              borderRadius: '1rem', 
              marginBottom: '1.5rem',
              border: `1px solid ${darkMode ? 'rgba(148, 163, 184, 0.2)' : 'rgba(0, 0, 0, 0.1)'}`,
              backdropFilter: 'blur(10px)'
            }}>
              <div style={{ 
                display: "flex", 
                justifyContent: "space-between", 
                alignItems: "center",
                marginBottom: '1rem',
                flexWrap: 'wrap',
                gap: '0.5rem'
              }}>
                <span style={{ 
                  color: result.status === "success" 
                    ? (darkMode ? '#10b981' : '#059669') 
                    : (darkMode ? '#ef4444' : '#dc2626'), 
                  fontWeight: '700',
                  fontSize: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  {result.status === "success" ? "✅ SUCCESS" : "❌ FAILED"}
                </span>
                {result.cost && result.latency && (
                  <div style={{ 
                    color: darkMode ? '#94a3b8' : '#64748b', 
                    fontSize: '0.875rem',
                    display: 'flex',
                    gap: '1rem'
                  }}>
                    <span>💰 Cost: {result.cost}</span>
                    <span>⚡ Latency: {result.latency}</span>
                  </div>
                )}
              </div>
              <div style={{ 
                fontFamily: 'var(--font-mono, monospace)', 
                fontSize: '0.875rem',
                color: darkMode ? '#e2e8f0' : '#334155',
                lineHeight: '1.6',
                whiteSpace: 'pre-wrap'
              }}>
                {result.output || "No output provided."}
              </div>
            </div>

            {result.logs && result.logs.length > 0 && (
              <div>
                <h4 style={{ 
                  marginBottom: '1rem',
                  color: darkMode ? '#ffffff' : '#1e293b',
                  fontSize: '1.125rem',
                  fontWeight: '600'
                }}>
                  Execution Logs
                </h4>
                <div style={{ 
                  background: darkMode ? '#0f172a' : '#f8fafc', 
                  color: darkMode ? '#e2e8f0' : '#334155', 
                  padding: '1rem', 
                  borderRadius: '0.75rem', 
                  fontFamily: 'var(--font-mono, monospace)', 
                  fontSize: '0.75rem',
                  border: `1px solid ${darkMode ? 'rgba(148, 163, 184, 0.2)' : 'rgba(0, 0, 0, 0.1)'}`,
                  maxHeight: '200px',
                  overflowY: 'auto'
                }}>
                  {result.logs.map((log, i) => (
                    <div key={i} style={{ 
                      marginBottom: '0.25rem',
                      display: 'flex',
                      gap: '0.5rem',
                      alignItems: 'flex-start'
                    }}>
                      <span style={{ 
                        opacity: 0.6,
                        minWidth: 'fit-content'
                      }}>
                        [{log.time}]
                      </span>
                      <span style={{ 
                        color: log.level === 'error' 
                          ? '#ef4444' 
                          : log.level === 'warn' 
                          ? '#f59e0b' 
                          : log.level === 'info'
                          ? '#06b6d4'
                          : 'inherit',
                        fontWeight: '500',
                        minWidth: 'fit-content'
                      }}>
                        {log.level.toUpperCase()}
                      </span>
                      <span style={{ flex: 1 }}>{log.message}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* CSS animations */}
      <style jsx>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}