import { useEffect, useMemo, useRef, useState } from "react";
import {
  calculateHistoryWeights,
  loadRouteHistory,
  loadRouteModel,
  normaliseWeights,
  persistRouteModel,
  recordRouteTransition,
  recordRouteVisit,
  type RouteModel,
  type RouteProbabilityMap,
} from "../services/prefetchAnalytics";
import { getNetworkInformation, prefersLowPower } from "../utils/networkPreferences";

type RouteLoaders = Record<string, () => Promise<unknown>>;
type IdleTaskPriority = "user-blocking" | "user-visible" | "background";
type CancelFn = () => void;

type IdleTaskOptions = {
  priority?: IdleTaskPriority;
};

declare global {
  interface Window {
    scheduler?: {
      postTask: (
        callback: () => void,
        options?: { priority?: IdleTaskPriority; delay?: number; signal?: AbortSignal },
      ) => Promise<void> | void;
    };
  }
}

type PrefetchHandle = {
  prefetch: (path: string) => Promise<unknown> | undefined;
};

const supportsScheduler =
  typeof window !== "undefined" &&
  typeof window.scheduler !== "undefined" &&
  typeof window.scheduler.postTask === "function";

const scheduleIdleTask = (callback: () => void, { priority = "background" }: IdleTaskOptions = {}): CancelFn => {
  if (typeof window === "undefined") {
    return () => {};
  }

  const run = () => callback();

  if (supportsScheduler && window.scheduler) {
    const controller = new AbortController();
    const task = window.scheduler.postTask(run, {
      priority,
      delay: 0,
      signal: controller.signal,
    });
    if (typeof task?.catch === "function") {
      task.catch((error: unknown) => {
        if (!isAbortError(error)) {
          console.error("Predictive prefetch task failed", error);
        }
      });
    }
    return () => controller.abort();
  }

  if (typeof window.requestIdleCallback === "function") {
    const id = window.requestIdleCallback(run, { timeout: 1500 });
    return () => window.cancelIdleCallback(id);
  }

  const timeoutId = window.setTimeout(run, 1);
  return () => window.clearTimeout(timeoutId);
};

const toRouteProbabilityMap = (input: RouteProbabilityMap | undefined): RouteProbabilityMap => input ?? {};

const isAbortError = (error: unknown): boolean => {
  if (error instanceof DOMException) {
    return error.name === "AbortError";
  }

  if (typeof error === "object" && error !== null && "name" in error) {
    return (error as { name?: unknown }).name === "AbortError";
  }

  return false;
};

export default function usePredictivePrefetch(
  routeLoaders: RouteLoaders,
  currentPathname: string,
): PrefetchHandle {
  const interactionCounts = useRef<Map<string, number>>(new Map());
  const idleCancel = useRef<CancelFn | null>(null);
  const modelRef = useRef<RouteModel>(loadRouteModel());
  const previousRouteRef = useRef<string | null>(currentPathname);
  const persistIdleCancel = useRef<CancelFn | null>(null);
  const prefetchedRoutesRef = useRef<Set<string>>(new Set());
  const [hasUserEngaged, setHasUserEngaged] = useState(false);
  const [hasPointerIntent, setHasPointerIntent] = useState(false);
  const [connectionConstrained, setConnectionConstrained] = useState<boolean>(() => prefersLowPower());

  const loaders = useMemo<RouteLoaders>(() => routeLoaders ?? {}, [routeLoaders]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return undefined;
    }

    let pointerRegistered = false;
    const markPointerIntent = () => {
      if (!pointerRegistered) {
        pointerRegistered = true;
        setHasPointerIntent(true);
      }
      setHasUserEngaged(true);
    };

    const markEngaged = () => {
      setHasUserEngaged(true);
    };

    window.addEventListener("pointermove", markPointerIntent, { once: true, passive: true });
    window.addEventListener("pointerdown", markPointerIntent, { once: true, passive: true });
    window.addEventListener("touchstart", markPointerIntent, { once: true, passive: true });
    window.addEventListener("keydown", markEngaged, { once: true });

    return () => {
      window.removeEventListener("pointermove", markPointerIntent);
      window.removeEventListener("pointerdown", markPointerIntent);
      window.removeEventListener("touchstart", markPointerIntent);
      window.removeEventListener("keydown", markEngaged);
    };
  }, []);

  useEffect(() => {
    const connection = getNetworkInformation();
    if (!connection) {
      setConnectionConstrained(false);
      return undefined;
    }

    const updateConstraint = () => setConnectionConstrained(prefersLowPower(connection));
    updateConstraint();

    if (typeof connection.addEventListener === "function") {
      connection.addEventListener("change", updateConstraint);
      return () => {
        if (typeof connection.removeEventListener === "function") {
          connection.removeEventListener("change", updateConstraint);
        }
      };
    }

    connection.onchange = updateConstraint;
    return () => {
      connection.onchange = null;
    };
  }, []);

  useEffect(() => {
    const counts = interactionCounts.current;
    const model = modelRef.current;
    const previous = previousRouteRef.current;

    if (previous && previous !== currentPathname) {
      recordRouteTransition(model, previous, currentPathname);
    }

    recordRouteVisit(model, currentPathname);
    previousRouteRef.current = currentPathname;

    if (persistIdleCancel.current) {
      persistIdleCancel.current();
    }
    persistIdleCancel.current = scheduleIdleTask(() => persistRouteModel(model));

    const currentCount = counts.get(currentPathname) || 0;
    counts.set(currentPathname, currentCount + 0.5);

    const probabilityMap = normaliseWeights(toRouteProbabilityMap(model.transitions[currentPathname]));
    const history = loadRouteHistory();
    const historyMap = calculateHistoryWeights(history, currentPathname);

    const candidatePaths = new Set(
      Object.keys(probabilityMap).filter((path) => Boolean(loaders[path])),
    );
    Object.keys(historyMap)
      .filter((path) => Boolean(loaders[path]))
      .forEach((path) => candidatePaths.add(path));

    const schedulePrefetch = () => {
      const ranked = Array.from(candidatePaths)
        .map((path) => {
          const probability = probabilityMap[path] || 0;
          const interactionBoost = interactionCounts.current.get(path) || 0;
          const historyBoost = historyMap[path] || 0;
          const visitCount = model.visits[path] || 0;
          const decay = Math.exp(-Math.max(visitCount - 1, 0) * 0.05);
          const score = probability * 0.55 + interactionBoost * 0.2 + historyBoost * 0.2 + decay * 0.05;
          return { path, score };
        })
        .filter(({ score }) => score > 0)
        .sort((a, b) => b.score - a.score);

      if (!ranked.length) {
        const fallbackEntries = Array.from(counts.entries())
          .filter(([path]) => loaders[path] && path !== currentPathname)
          .map(([path, score]) => ({ path, score: score / 5 }))
          .sort((a, b) => b.score - a.score)
          .slice(0, 2);

        const historyFallback = Object.entries(historyMap)
          .filter(([path]) => loaders[path] && path !== currentPathname)
          .map(([path, score]) => ({ path, score }))
          .sort((a, b) => b.score - a.score)
          .slice(0, 2);

        const seenFallback = new Set<string>();
        const combined = [...fallbackEntries, ...historyFallback].filter(({ path }) => {
          if (seenFallback.has(path)) return false;
          seenFallback.add(path);
          return true;
        });

        ranked.push(...combined);
      }

      const visibleRoutes = new Set<string>();
      if (typeof document !== "undefined" && typeof window !== "undefined") {
        const viewportHeight = window.innerHeight || 0;
        const viewportWidth = window.innerWidth || 0;
        document.querySelectorAll("[data-prefetch-route]").forEach((element) => {
          const route = element.getAttribute("data-prefetch-route");
          if (!route) return;
          const rect = element.getBoundingClientRect();
          const inViewport =
            rect.bottom > 0 && rect.right > 0 && rect.left < viewportWidth && rect.top < viewportHeight;
          if (inViewport) {
            visibleRoutes.add(route);
          }
        });
      }

      const prioritised: Array<{ path: string; score: number }> = [];
      const seen = new Set<string>();
      const pushEntries = (entries: Array<{ path: string; score: number }>, requireVisibility: boolean) => {
        entries.forEach((entry) => {
          if (seen.has(entry.path)) return;
          if (requireVisibility && visibleRoutes.size && !visibleRoutes.has(entry.path)) {
            return;
          }
          seen.add(entry.path);
          prioritised.push(entry);
        });
      };

      pushEntries(ranked, true);

      if (!prioritised.length) {
        pushEntries(ranked, false);
      }

      if (!visibleRoutes.size) {
        return;
      }

      const limited = prioritised.slice(0, 2);
      limited.forEach(({ path }) => {
        if (prefetchedRoutesRef.current.has(path)) {
          return;
        }
        if (!loaders[path]) {
          return;
        }

        prefetchedRoutesRef.current.add(path);
        try {
          loaders[path]?.();
        } catch (error) {
          console.warn("Prefetch failed", path, error);
        }
      });
    };

    if (idleCancel.current) {
      idleCancel.current();
    }

    if (!hasUserEngaged || !hasPointerIntent || connectionConstrained) {
      return () => {
        if (idleCancel.current) {
          idleCancel.current();
        }
      };
    }

    idleCancel.current = scheduleIdleTask(() => {
      if (typeof document !== "undefined" && document.visibilityState === "hidden") {
        return;
      }
      schedulePrefetch();
    });

    return () => {
      if (idleCancel.current) {
        idleCancel.current();
        idleCancel.current = null;
      }
      if (persistIdleCancel.current) {
        persistIdleCancel.current();
        persistIdleCancel.current = null;
      }
    };
  }, [connectionConstrained, currentPathname, hasPointerIntent, hasUserEngaged, loaders]);

  useEffect(() => {
    if (typeof document === "undefined") {
      return undefined;
    }

    const handler = (event: Event) => {
      const target = event.target as HTMLElement | null;
      const route = target?.getAttribute?.("data-prefetch-route");
      if (!route || !loaders[route]) {
        return;
      }

      if (connectionConstrained) {
        return;
      }

      if (!hasUserEngaged) {
        setHasUserEngaged(true);
      }

      if (!hasPointerIntent && event.type.startsWith("pointer")) {
        setHasPointerIntent(true);
      }

      const model = modelRef.current;
      recordRouteTransition(model, currentPathname, route, 0.35);

      interactionCounts.current.set(route, (interactionCounts.current.get(route) || 0) + 1.5);
      if (prefetchedRoutesRef.current.has(route)) {
        return;
      }

      prefetchedRoutesRef.current.add(route);
      scheduleIdleTask(() => loaders[route]?.());
    };

    document.addEventListener("pointerenter", handler, { passive: true, capture: true });
    document.addEventListener("focusin", handler, { passive: true, capture: true });

    return () => {
      document.removeEventListener("pointerenter", handler, { capture: true });
      document.removeEventListener("focusin", handler, { capture: true });
    };
  }, [connectionConstrained, currentPathname, hasPointerIntent, hasUserEngaged, loaders]);

  return {
    prefetch: (path: string) => loaders[path]?.(),
  };
}