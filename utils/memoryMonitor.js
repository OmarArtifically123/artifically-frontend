export function setupMemoryMonitoring() {
  if (typeof window === "undefined" || !window.performance) {
    return;
  }

  const logMemory = () => {
    const performanceMemory = performance.memory;
    if (!performanceMemory) {
      return;
    }

    const used = performanceMemory.usedJSHeapSize / 1048576;
    const total = performanceMemory.jsHeapSizeLimit / 1048576;

    // eslint-disable-next-line no-console
    console.log(`Memory: ${used.toFixed(2)} MB / ${total.toFixed(2)} MB`);

    if (used > 200) {
      // eslint-disable-next-line no-console
      console.warn("⚠️ High memory usage detected:", used.toFixed(2), "MB");
    }
  };

  const intervalId = window.setInterval(logMemory, 5000);

  return () => {
    window.clearInterval(intervalId);
  };
}