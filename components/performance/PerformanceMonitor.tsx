"use client";

import { useEffect, useState } from "react";
import { reportWebVitals } from "@/lib/webVitalsOptimized";

interface Metric {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
}

/**
 * Performance Monitoring Dashboard (Development Only)
 * Displays real-time Web Vitals metrics
 * Shows when Shift+P is pressed
 */
export default function PerformanceMonitor() {
  const [isVisible, setIsVisible] = useState(false);
  const [metrics, setMetrics] = useState<Metric[]>([]);

  useEffect(() => {
    // Only show in development
    if (process.env.NODE_ENV !== 'development') {
      return;
    }

    // Toggle with Shift+P
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.shiftKey && event.key === 'P') {
        setIsVisible(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyPress);

    // Collect metrics
    reportWebVitals((metric) => {
      setMetrics(prev => {
        const existing = prev.findIndex(m => m.name === metric.name);
        if (existing >= 0) {
          const updated = [...prev];
          updated[existing] = {
            name: metric.name,
            value: metric.value,
            rating: metric.rating,
          };
          return updated;
        }
        return [...prev, {
          name: metric.name,
          value: metric.value,
          rating: metric.rating,
        }];
      });
    });

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, []);

  if (!isVisible || process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        left: '24px',
        background: 'rgba(15, 23, 42, 0.95)',
        backdropFilter: 'blur(12px)',
        color: 'white',
        padding: '20px',
        borderRadius: '12px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
        zIndex: 10000,
        maxWidth: '400px',
        fontFamily: 'monospace',
        fontSize: '13px',
        border: '1px solid rgba(148, 163, 184, 0.2)',
      }}
    >
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '16px',
      }}>
        <div style={{ 
          fontWeight: 700,
          fontSize: '14px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>
          ⚡ Performance Monitor
        </div>
        <button
          onClick={() => setIsVisible(false)}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#94a3b8',
            cursor: 'pointer',
            padding: '4px 8px',
            fontSize: '16px',
          }}
        >
          ✕
        </button>
      </div>

      {metrics.length === 0 ? (
        <div style={{ color: '#94a3b8', fontSize: '12px' }}>
          Collecting metrics...
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '12px' }}>
          {metrics.map(metric => (
            <div
              key={metric.name}
              style={{
                padding: '12px',
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '8px',
                border: `2px solid ${getRatingColor(metric.rating)}`,
              }}
            >
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '4px',
              }}>
                <span style={{ fontWeight: 600 }}>{metric.name}</span>
                <span>{getRatingEmoji(metric.rating)}</span>
              </div>
              <div style={{ 
                fontSize: '20px', 
                fontWeight: 700,
                color: getRatingColor(metric.rating),
              }}>
                {formatMetricValue(metric.name, metric.value)}
              </div>
              <div style={{ 
                fontSize: '11px', 
                color: '#94a3b8',
                marginTop: '4px',
              }}>
                {metric.rating.toUpperCase()}
              </div>
            </div>
          ))}
        </div>
      )}

      <div style={{ 
        marginTop: '16px',
        paddingTop: '16px',
        borderTop: '1px solid rgba(148, 163, 184, 0.2)',
        fontSize: '11px',
        color: '#94a3b8',
      }}>
        Press Shift+P to toggle • Dev mode only
      </div>
    </div>
  );
}

function getRatingEmoji(rating: string): string {
  switch (rating) {
    case 'good': return '✅';
    case 'needs-improvement': return '⚠️';
    case 'poor': return '❌';
    default: return '📊';
  }
}

function getRatingColor(rating: string): string {
  switch (rating) {
    case 'good': return '#10b981';
    case 'needs-improvement': return '#f59e0b';
    case 'poor': return '#ef4444';
    default: return '#94a3b8';
  }
}

function formatMetricValue(name: string, value: number): string {
  if (name === 'CLS') {
    return value.toFixed(3);
  }
  return `${Math.round(value)}ms`;
}

