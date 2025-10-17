const KB = 1024;

export const bundleBudgets = Object.freeze({
  mainJsGzipBytes: 200 * KB,
  mainCssGzipBytes: 20 * KB,
});

export const lighthouseBudgets = Object.freeze({
  performanceScore: 0.8,
  lcpMs: 2000,
  cls: 0.1,
});

function setGlobalBudgets(target) {
  if (!target) {
    return;
  }

  const existing = target.__PERFORMANCE_BUDGETS__;
  if (existing && existing.bundle === bundleBudgets && existing.lighthouse === lighthouseBudgets) {
    return;
  }

  target.__PERFORMANCE_BUDGETS__ = Object.freeze({
    bundle: bundleBudgets,
    lighthouse: lighthouseBudgets,
  });
  target.__LIGHTHOUSE_BUDGET__ = lighthouseBudgets;
}

export function exposePerformanceBudgets(target = typeof window !== 'undefined' ? window : undefined) {
  setGlobalBudgets(target);
}

function createObserver(type, options, handler) {
  if (typeof PerformanceObserver !== 'function') {
    return { disconnect() {} };
  }

  try {
    const observer = new PerformanceObserver(handler);
    observer.observe({ type, buffered: true, ...options });
    return observer;
  } catch (error) {
    if (typeof console !== 'undefined' && console.warn) {
      console.warn(`[performance-budget] Unable to observe ${type}:`, error);
    }
    return { disconnect() {} };
  }
}

export function initPerformanceBudgetWatchers(target = typeof window !== 'undefined' ? window : undefined) {
  if (!target || target.__PERF_BUDGETS_WATCHER__) {
    return;
  }

  if (typeof document === 'undefined') {
    return;
  }

  target.__PERF_BUDGETS_WATCHER__ = true;
  setGlobalBudgets(target);

  let clsValue = 0;
  let lcpValue = 0;

  const clsObserver = createObserver('layout-shift', {}, (list) => {
    for (const entry of list.getEntries()) {
      if (!entry.hadRecentInput) {
        clsValue += entry.value;
      }
    }
  });

  const lcpObserver = createObserver('largest-contentful-paint', {}, (list) => {
    const entries = list.getEntries();
    const lastEntry = entries[entries.length - 1];
    if (!lastEntry) {
      return;
    }

    lcpValue = lastEntry.renderTime || lastEntry.loadTime || lastEntry.startTime || 0;
  });

  const budgets = lighthouseBudgets;

  const finalize = () => {
    clsObserver.disconnect();
    lcpObserver.disconnect();

    const warnings = [];
    if (clsValue > budgets.cls) {
      warnings.push(
        `CLS ${clsValue.toFixed(3)} exceeded budget ${budgets.cls.toFixed(2)}`,
      );
    }
    if (lcpValue > budgets.lcpMs) {
      warnings.push(`LCP ${Math.round(lcpValue)}ms exceeded budget ${budgets.lcpMs}ms`);
    }

    if (warnings.length > 0 && typeof console !== 'undefined' && console.error) {
      console.error('[performance-budget]', warnings.join('; '));
    }
  };

  const once = { once: true };
  target.addEventListener('pagehide', finalize, once);
  target.addEventListener('beforeunload', finalize, once);
  document.addEventListener(
    'visibilitychange',
    () => {
      if (document.visibilityState === 'hidden') {
        finalize();
      }
    },
    { once: true },
  );
}

export function formatBudget(bytes) {
  if (typeof bytes !== 'number' || Number.isNaN(bytes)) {
    return '0 B';
  }

  if (bytes < KB) {
    return `${bytes.toFixed(0)} B`;
  }

  return `${(bytes / KB).toFixed(1)} KB`;
}