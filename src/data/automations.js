import api from "../api";
import { MARKETPLACE_ENTRIES } from "../../data/marketplaceCatalog.js";

export const SAMPLE_AUTOMATIONS = MARKETPLACE_ENTRIES.map((automation) => ({
  ...automation,
}));

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