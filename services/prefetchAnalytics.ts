export const ROUTE_MODEL_STORAGE_KEY = "__artifically_route_model_v1";
export const ROUTE_HISTORY_STORAGE_KEY = "route-history";

export type RouteHistoryEntry = {
  path: string;
  ts: number;
};

export type RouteProbabilityMap = Record<string, number>;

export type RouteModel = {
  transitions: Record<string, RouteProbabilityMap>;
  visits: Record<string, number>;
};

const isBrowser = () => typeof window !== "undefined";

const emptyModel = (): RouteModel => ({ transitions: {}, visits: {} });

export const normaliseWeights = (weights: RouteProbabilityMap): RouteProbabilityMap => {
  const entries = Object.entries(weights ?? {});
  if (!entries.length) {
    return {};
  }

  const total = entries.reduce((acc, [, value]) => acc + value, 0);
  if (!total) {
    return {};
  }

  return entries.reduce<RouteProbabilityMap>((acc, [key, value]) => {
    acc[key] = value / total;
    return acc;
  }, {});
};

export const loadRouteHistory = (): RouteHistoryEntry[] => {
  if (!isBrowser()) {
    return [];
  }

  try {
    const stored = window.localStorage.getItem(ROUTE_HISTORY_STORAGE_KEY);
    if (!stored) {
      return [];
    }

    const parsed = JSON.parse(stored);
    return Array.isArray(parsed)
      ? (parsed.filter((entry) => typeof entry?.path === "string") as RouteHistoryEntry[])
      : [];
  } catch (error) {
    console.warn("Failed to load route history", error);
    return [];
  }
};

export const persistRouteHistory = (history: RouteHistoryEntry[]): void => {
  if (!isBrowser()) {
    return;
  }

  try {
    window.localStorage.setItem(ROUTE_HISTORY_STORAGE_KEY, JSON.stringify(history));
  } catch (error) {
    console.warn("Failed to persist route history", error);
  }
};

export const calculateHistoryWeights = (
  history: RouteHistoryEntry[],
  currentPathname: string,
): RouteProbabilityMap => {
  if (!Array.isArray(history) || !history.length) {
    return {};
  }

  const now = Date.now();
  const weights = history.reduce<RouteProbabilityMap>((acc, entry, index) => {
    if (!entry || typeof entry.path !== "string" || entry.path === currentPathname) {
      return acc;
    }

    const age = Math.max(now - (entry.ts || 0), 0);
    const recency = Math.exp(-age / (1000 * 60 * 10));
    const positionWeight = 1 / Math.pow(index + 1, 1.2);
    const weight = recency * positionWeight;

    acc[entry.path] = (acc[entry.path] || 0) + weight;
    return acc;
  }, {});

  return normaliseWeights(weights);
};

export const loadRouteModel = (): RouteModel => {
  if (!isBrowser()) {
    return emptyModel();
  }

  try {
    const stored = window.localStorage.getItem(ROUTE_MODEL_STORAGE_KEY);
    if (!stored) {
      return emptyModel();
    }

    const parsed = JSON.parse(stored);
    if (typeof parsed !== "object" || !parsed) {
      return emptyModel();
    }

    return {
      transitions: (parsed.transitions as RouteModel["transitions"]) || {},
      visits: (parsed.visits as RouteModel["visits"]) || {},
    };
  } catch (error) {
    console.warn("Failed to load predictive model", error);
    return emptyModel();
  }
};

export const persistRouteModel = (model: RouteModel): void => {
  if (!isBrowser()) {
    return;
  }

  try {
    window.localStorage.setItem(
      ROUTE_MODEL_STORAGE_KEY,
      JSON.stringify({
        transitions: model.transitions,
        visits: model.visits,
      }),
    );
  } catch (error) {
    console.warn("Failed to persist predictive model", error);
  }
};

export const recordRouteTransition = (model: RouteModel, from: string, to: string, weight = 1): void => {
  if (!from || !to) {
    return;
  }

  const transitions = model.transitions[from] || {};
  transitions[to] = (transitions[to] || 0) + weight;
  model.transitions[from] = transitions;
};

export const recordRouteVisit = (model: RouteModel, path: string): void => {
  if (!path) {
    return;
  }

  model.visits[path] = (model.visits[path] || 0) + 1;
};