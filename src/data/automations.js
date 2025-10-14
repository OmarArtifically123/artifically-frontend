import api from "../api";

export const SAMPLE_AUTOMATIONS = [
  {
    id: "ops-guardian",
    name: "Ops Guardian",
    description: "AI-assisted incident routing keeps tickets flowing to the right squad automatically.",
    icon: "🛡️",
    priceMonthly: 249,
    currency: "USD",
    roi: 4.6,
    deploymentsPerWeek: 22,
    hoursSavedWeekly: 280,
    category: "Operations",
    tags: ["incident response", "it ops", "ticket triage"],
    highlights: [
      "Real-time incident clustering",
      "Predictive SLA breach alerts",
      "Automated post-mortem summaries",
    ],
    integrations: {
      sources: ["PagerDuty", "Zendesk", "Jira Service Management"],
      destinations: ["Slack", "ServiceNow"],
    },
  },
  {
    id: "revenue-loop",
    name: "Revenue Loop",
    description: "Sync pipeline signals with personalised outreach loops that recover stalled deals.",
    icon: "💼",
    priceMonthly: 329,
    currency: "USD",
    roi: 5.2,
    deploymentsPerWeek: 18,
    hoursSavedWeekly: 310,
    category: "Revenue",
    tags: ["sales automation", "pipeline", "revops"],
    highlights: [
      "Predictive deal scoring",
      "Rep nudges based on buyer activity",
      "Closed-won playbooks triggered live",
    ],
    integrations: {
      sources: ["Salesforce", "HubSpot", "Outreach"],
      destinations: ["Slack", "Teams", "Notion"],
    },
  },
  {
    id: "support-coach",
    name: "Support Coach",
    description: "Guides agents with AI macros and empathetic tone adjustments in every conversation.",
    icon: "🤝",
    priceMonthly: 189,
    currency: "USD",
    roi: 3.8,
    deploymentsPerWeek: 27,
    hoursSavedWeekly: 265,
    category: "Customer Experience",
    tags: ["support", "customer success", "cx"],
    highlights: [
      "Context-aware response drafting",
      "Live retention risk alerts",
      "Customer journey insights",
    ],
    integrations: {
      sources: ["Zendesk", "Intercom", "Gong"],
      destinations: ["Slack", "Notion", "Salesforce"],
    },
  },
  {
    id: "finance-sentinel",
    name: "Finance Sentinel",
    description: "Detect anomalies across billing, ERP, and spend in minutes instead of days.",
    icon: "📊",
    priceMonthly: 299,
    currency: "USD",
    roi: 6.1,
    deploymentsPerWeek: 15,
    hoursSavedWeekly: 340,
    category: "Finance",
    tags: ["finops", "compliance", "audit"],
    highlights: [
      "Adaptive variance thresholds",
      "Continuous GL reconciliation",
      "Autonomous escalation routing",
    ],
    integrations: {
      sources: ["NetSuite", "Workday", "Stripe"],
      destinations: ["Snowflake", "Slack", "Teams"],
    },
  },
];

export async function fetchAutomations() {
  try {
    const res = await api.get("/marketplace");
    
    // Validate the response structure
    if (!res || !res.data) {
      console.error("Invalid response structure from /marketplace API");
      return [];
    }
    
    // Handle different response formats the API might return
    let automations;
    
    if (res.data.automations) {
      // Expected format: { automations: [...] }
      automations = res.data.automations;
    } else if (Array.isArray(res.data)) {
      // Fallback format: [...]
      automations = res.data;
    } else if (res.data.data && Array.isArray(res.data.data)) {
      // Another possible format: { data: [...] }
      automations = res.data.data;
    } else {
      console.warn("Unexpected response format from /marketplace API:", res.data);
      return [];
    }
    
    // Ensure we return an array
    if (!Array.isArray(automations)) {
      console.error("Automations data is not an array:", automations);
      return [];
    }
    
    // Validate each automation object has required fields
    const validAutomations = automations.filter(automation => {
      if (!automation || typeof automation !== 'object') {
        console.warn("Invalid automation object:", automation);
        return false;
      }
      
      // Check for required fields
      if (!automation.id) {
        console.warn("Automation missing required 'id' field:", automation);
        return false;
      }
      
      if (!automation.name) {
        console.warn("Automation missing required 'name' field:", automation);
        return false;
      }
      
      return true;
    });
    
    // Log warning if some automations were filtered out
    if (validAutomations.length !== automations.length) {
      console.warn(`Filtered out ${automations.length - validAutomations.length} invalid automation(s)`);
    }
    
     if (validAutomations.length > 0) {
      return validAutomations;
    }

    if (import.meta.env.DEV) {
      console.warn("Marketplace API returned no automations, using sample dataset");
    }
    return SAMPLE_AUTOMATIONS.map((automation) => ({ ...automation }));
    
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error("Failed to fetch automations:", error);
    }
    
    // If it's a network error or API is down, return empty array
    // This prevents the UI from breaking
    if (error.status === 0 || error.code === 'NETWORK_ERROR') {
      if (import.meta.env.DEV) {
        console.warn("Network error - returning empty automations array");
      }
      return SAMPLE_AUTOMATIONS.map((automation) => ({ ...automation }));
    }
    
    // If it's a server error (5xx), return empty array
    if (error.status >= 500) {
      if (import.meta.env.DEV) {
        console.warn("Server error - returning empty automations array");
      }
      return SAMPLE_AUTOMATIONS.map((automation) => ({ ...automation }));
    }
    
    // If it's a client error (4xx), we might want to handle it differently
    if (error.status >= 400 && error.status < 500) {
      if (import.meta.env.DEV) {
        console.error("Client error when fetching automations:", error.message);
      }
      // Still return empty array to prevent UI breakage
      return SAMPLE_AUTOMATIONS.map((automation) => ({ ...automation }));
    }
    
    // For any other error, rethrow so the calling component can handle it
    // This allows components to show specific error messages if needed
    console.error("Failed to load automations:", error);
    return SAMPLE_AUTOMATIONS.map((automation) => ({ ...automation }));
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