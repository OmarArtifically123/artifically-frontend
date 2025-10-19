import api from "../api.js";
import { MARKETPLACE_ENTRIES } from "./marketplaceCatalog.js";

const DEFAULT_PAGE_SIZE = 20;

export const AUTOMATION_FIELD_WHITELIST = [
  "id",
  "name",
  "title",
  "description",
  "summary",
  "icon",
  "priceMonthly",
  "price",
  "currency",
  "priceTier",
  "category",
  "tags",
  "labels",
  "integrations",
  "performance.avgInteractionMs",
  "performance.fps",
  "teamVotes",
  "deploymentsPerWeek",
  "attributes",
];

const buildFieldParam = () => AUTOMATION_FIELD_WHITELIST.join(",");

const enhanceAutomation = (automation = {}, index = 0) => {
  const voteFallback = 120 + (index % 6) * 18;
  const teamVotes = typeof automation.teamVotes === "number" ? automation.teamVotes : voteFallback;
  const avgInteractionMs = Math.max(120, Math.round(automation?.performance?.avgInteractionMs ?? 200 - index * 6));
  const fps = automation?.performance?.fps ?? 60;

  return {
    ...automation,
    teamVotes,
    performance: {
      ...(automation.performance ?? {}),
      avgInteractionMs,
      fps,
    },
  };
};

const enhanceAutomationList = (list = []) => list.map((automation, index) => enhanceAutomation(automation, index));

export const SAMPLE_AUTOMATIONS = MARKETPLACE_ENTRIES.map((automation, index) =>
  enhanceAutomation({ ...automation }, index),
);

const paginate = (list = [], page = 1, limit = DEFAULT_PAGE_SIZE) => {
  const safePage = Math.max(1, Number(page) || 1);
  const safeLimit = Math.max(1, Number(limit) || DEFAULT_PAGE_SIZE);
  const start = (safePage - 1) * safeLimit;
  const end = start + safeLimit;
  const slice = enhanceAutomationList(list.slice(start, end));
  const total = list.length;
  const hasMore = end < total;
  return {
    items: slice,
    page: safePage,
    limit: safeLimit,
    total,
    hasMore,
    nextPage: hasMore ? safePage + 1 : null,
  };
};

const validateAutomationList = (automations) => {
  if (!Array.isArray(automations)) {
    if (import.meta.env.DEV) {
      console.error("Automations data is not an array:", automations);
    }
    return [];
  }

  const validAutomations = automations.filter((automation) => {
    if (!automation || typeof automation !== "object") {
      if (import.meta.env.DEV) {
        console.warn("Invalid automation object:", automation);
      }
      return false;
    }

    if (!automation.id) {
      if (import.meta.env.DEV) {
        console.warn("Automation missing required 'id' field:", automation);
      }
      return false;
    }

    if (!automation.name && !automation.title) {
      if (import.meta.env.DEV) {
        console.warn("Automation missing required 'name' field:", automation);
      }
      return false;
    }

    return true;
  });

  if (import.meta.env.DEV && validAutomations.length !== automations.length) {
    console.warn(`Filtered out ${automations.length - validAutomations.length} invalid automation(s)`);
  }

  return validAutomations;
};

const buildResult = (list, page, limit, totalHint) => {
  const total = Number.isFinite(Number(totalHint)) ? Number(totalHint) : list.length;
  const pagination = paginate(list, page, limit);
  if (total > pagination.total) {
    return {
      ...pagination,
      total,
      hasMore: pagination.page * pagination.limit < total,
      nextPage: pagination.page * pagination.limit < total ? pagination.page + 1 : null,
    };
  }
  return pagination;
};

/**
 * @typedef {Object} FetchAutomationsOptions
 * @property {number} [page]
 * @property {number} [limit]
 * @property {AbortSignal} [signal]
 */

/**
 * @param {FetchAutomationsOptions} [options]
 */

export async function fetchAutomations({ page = 1, limit = DEFAULT_PAGE_SIZE, signal } = {}) {
  try {
    const res = await api.get("/marketplace", {
      params: {
        page,
        limit,
        fields: buildFieldParam(),
      },
      signal,
    });

    if (!res || !res.data) {
      if (import.meta.env.DEV) {
        console.error("Invalid response structure from /marketplace API");
      }
      return paginate(SAMPLE_AUTOMATIONS, page, limit);
    }

    const payload = res.data;
    let automations;
    let total;

    if (Array.isArray(payload.items)) {
      automations = payload.items;
      total = payload.total ?? payload.count ?? payload.items.length;
    } else if (Array.isArray(payload.automations)) {
      automations = payload.automations;
      total = payload.total ?? payload.automations.length;
    } else if (Array.isArray(payload.data)) {
      automations = payload.data;
      total = payload.total ?? payload.meta?.total ?? payload.data.length;
    } else if (Array.isArray(payload)) {
      automations = payload;
      total = payload.length;
    } else {
      if (import.meta.env.DEV) {
        console.warn("Unexpected response format from /marketplace API:", payload);
      }
      return paginate(SAMPLE_AUTOMATIONS, page, limit);
    }

    const validAutomations = validateAutomationList(automations);

    if (validAutomations.length > 0) {
      return buildResult(validAutomations, page, limit, total);
    }

    if (import.meta.env.DEV) {
      console.warn("Marketplace API returned no valid automations, using sample dataset");
    }
    return paginate(SAMPLE_AUTOMATIONS, page, limit);
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error("Failed to fetch automations:", error);
    }

    if (error?.status === 0 || error?.code === "NETWORK_ERROR") {
      if (import.meta.env.DEV) {
        console.warn("Network error - returning fallback automations");
      }
      return paginate(SAMPLE_AUTOMATIONS, page, limit);
    }

    if (error?.status >= 500) {
      if (import.meta.env.DEV) {
        console.warn("Server error - returning fallback automations");
      }
      return paginate(SAMPLE_AUTOMATIONS, page, limit);
    }

    if (error?.status >= 400 && error?.status < 500) {
      if (import.meta.env.DEV) {
        console.error("Client error when fetching automations:", error?.message);
      }
      return paginate(SAMPLE_AUTOMATIONS, page, limit);
    }

    if (import.meta.env.DEV) {
      console.error("Failed to load automations, using fallback dataset", error);
    }
    return paginate(SAMPLE_AUTOMATIONS, page, limit);
  }
}

// Optional: Add a function to validate individual automation objects
export function validateAutomation(automation) {
  if (!automation || typeof automation !== 'object') {
    return false;
  }
  
  const requiredFields = ['id', 'name'];
  const optionalFields = ['description', 'icon', 'priceMonthly', 'currency', 'tags'];
  
  // Check required fields
  for (const field of requiredFields) {
    if (!automation[field]) {
      return false;
    }
  }
  
  // Validate specific field types
  if (typeof automation.id !== 'string' && typeof automation.id !== 'number') {
    return false;
  }
  
  if (typeof automation.name !== 'string' || automation.name.trim().length === 0) {
    return false;
  }
  
  if (automation.priceMonthly !== undefined && typeof automation.priceMonthly !== 'number') {
    return false;
  }
  
  if (automation.tags !== undefined && !Array.isArray(automation.tags)) {
    return false;
  }
  
  return true;
}