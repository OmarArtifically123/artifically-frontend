/**
 * Performance Monitoring Utility
 * Tracks FPS, memory usage, and performance metrics
 */

export interface PerformanceMetrics {
  fps: number;
  frameTime: number;
  memory?: {
    usedJSHeapSize: number;
    totalJSHeapSize: number;
    jsHeapSizeLimit: number;
  };
  isLowPerformance: boolean;
}

class PerformanceMonitor {
  private frames: number[] = [];
  private lastTime = performance.now();
  private rafId: number | null = null;
  private metrics: PerformanceMetrics = {
    fps: 60,
    frameTime: 16.67,
    isLowPerformance: false,
  };
  private listeners: Set<(metrics: PerformanceMetrics) => void> = new Set();
  private updateInterval = 1000; // Update every second
  private lastUpdate = 0;

  constructor() {
    this.tick = this.tick.bind(this);
  }

  /**
   * Start monitoring performance
   */
  start(): void {
    if (this.rafId !== null) return;
    
    this.lastTime = performance.now();
    this.tick();
  }

  /**
   * Stop monitoring performance
   */
  stop(): void {
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  /**
   * Subscribe to performance updates
   */
  subscribe(callback: (metrics: PerformanceMetrics) => void): () => void {
    this.listeners.add(callback);
    
    return () => {
      this.listeners.delete(callback);
    };
  }

  /**
   * Get current metrics
   */
  getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  private tick(): void {
    const now = performance.now();
    const delta = now - this.lastTime;
    
    this.frames.push(delta);
    
    // Keep only last 60 frames
    if (this.frames.length > 60) {
      this.frames.shift();
    }

    // Update metrics every second
    if (now - this.lastUpdate > this.updateInterval) {
      this.updateMetrics();
      this.lastUpdate = now;
    }

    this.lastTime = now;
    this.rafId = requestAnimationFrame(this.tick);
  }

  private updateMetrics(): void {
    if (this.frames.length === 0) return;

    // Calculate average frame time
    const avgFrameTime = this.frames.reduce((a, b) => a + b, 0) / this.frames.length;
    const fps = 1000 / avgFrameTime;

    // Get memory info if available
    const perf = window.performance as typeof window.performance & {
      memory?: {
        usedJSHeapSize: number;
        totalJSHeapSize: number;
        jsHeapSizeLimit: number;
      };
    };
    let memory;
    
    if (perf.memory) {
      memory = {
        usedJSHeapSize: perf.memory.usedJSHeapSize,
        totalJSHeapSize: perf.memory.totalJSHeapSize,
        jsHeapSizeLimit: perf.memory.jsHeapSizeLimit,
      };
    }

    // Determine if performance is low
    const isLowPerformance = fps < 30 || avgFrameTime > 33.33;

    this.metrics = {
      fps: Math.round(fps),
      frameTime: Math.round(avgFrameTime * 100) / 100,
      memory,
      isLowPerformance,
    };

    // Notify listeners
    this.listeners.forEach(callback => callback(this.metrics));
  }
}

// Singleton instance
let monitorInstance: PerformanceMonitor | null = null;

export function getPerformanceMonitor(): PerformanceMonitor {
  if (!monitorInstance) {
    monitorInstance = new PerformanceMonitor();
  }
  return monitorInstance;
}

/**
 * React hook for performance monitoring
 */
export function usePerformanceMonitor(): PerformanceMetrics {
  const [metrics, setMetrics] = React.useState<PerformanceMetrics>({
    fps: 60,
    frameTime: 16.67,
    isLowPerformance: false,
  });

  React.useEffect(() => {
    const monitor = getPerformanceMonitor();
    monitor.start();

    const unsubscribe = monitor.subscribe(setMetrics);

    return () => {
      unsubscribe();
      monitor.stop();
    };
  }, []);

  return metrics;
}

// Import React for the hook
import * as React from "react";

export default PerformanceMonitor;




