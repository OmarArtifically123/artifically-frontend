"use client";

import { ContactAnalytics } from './analytics';

// A/B Testing configuration
interface ABTest {
  name: string;
  enabled: boolean;
  variants: ABVariant[];
  traffic?: number; // Percentage of traffic to include in test (0-100)
  isActive?: boolean;
  audience?: {
    percentage: number;
    conditions?: Array<{
      type: 'url' | 'referrer' | 'device' | 'geo';
      operator: 'equals' | 'contains' | 'startsWith' | 'endsWith';
      value: string;
    }>;
  };
}

interface ABVariant {
  name: string;
  weight: number; // Weight for traffic allocation
  config: Record<string, string | number | boolean | string[]>;
}

// Active A/B tests configuration
const AB_TESTS: Record<string, ABTest> = {
  contact_headline: {
    name: 'contact_headline',
    enabled: true,
    variants: [
      {
        name: 'original',
        weight: 50,
        config: {
          headline: "Let's Build Your Automation Success",
          subheadline: "Get personalized guidance from our automation experts. Whether you need a demo, have questions, or want pricing - we'll help you find the perfect solution."
        }
      },
      {
        name: 'urgency_driven',
        weight: 50,
        config: {
          headline: "Get Answers in Minutes, Not Days",
          subheadline: "Skip the wait. Our automation experts are standing by to help you solve your biggest workflow challenges. Choose how you'd like to connect below."
        }
      }
    ],
    traffic: 50,
    isActive: true
  },
  
  path_selector_layout: {
    name: 'path_selector_layout',
    enabled: false,
    variants: [
      {
        name: 'grid_3x2',
        weight: 50,
        config: {
          layout: 'grid',
          columns: 3,
          rows: 2
        }
      },
      {
        name: 'list_vertical',
        weight: 50,
        config: {
          layout: 'list',
          direction: 'vertical'
        }
      }
    ],
    audience: {
      percentage: 50
    }
  },
  
  trust_signals_position: {
    name: 'trust_signals_position',
    enabled: false,
    variants: [
      {
        name: 'sidebar',
        weight: 50,
        config: {
          position: 'sidebar',
          timing: 'immediate'
        }
      },
      {
        name: 'inline',
        weight: 50,
        config: {
          position: 'inline',
          timing: 'after_path_selection'
        }
      }
    ],
    audience: {
      percentage: 75
    }
  },
  
  form_field_count: {
    name: 'form_field_count',
    enabled: false,
    variants: [
      {
        name: 'minimal',
        weight: 40,
        config: {
          demo_fields: ['email', 'company', 'useCase'],
          question_fields: ['email', 'question'],
          pricing_fields: ['email', 'company', 'companySize']
        }
      },
      {
        name: 'standard',
        weight: 40,
        config: {
          demo_fields: ['name', 'email', 'company', 'companySize', 'useCase'],
          question_fields: ['email', 'question'],
          pricing_fields: ['email', 'company', 'companySize', 'timeline']
        }
      },
      {
        name: 'detailed',
        weight: 20,
        config: {
          demo_fields: ['name', 'email', 'company', 'companySize', 'useCase', 'timeline', 'budget'],
          question_fields: ['name', 'email', 'company', 'question'],
          pricing_fields: ['email', 'company', 'companySize', 'employees', 'timeline', 'budget']
        }
      }
    ],
    audience: {
      percentage: 100
    }
  }
};

class ABTestingManager {
  private static instance: ABTestingManager;
  private userVariants: Map<string, string> = new Map();
  
  static getInstance(): ABTestingManager {
    if (!ABTestingManager.instance) {
      ABTestingManager.instance = new ABTestingManager();
    }
    return ABTestingManager.instance;
  }
  
  // Get user's variant for a specific test
  getVariant(testName: string): string | null {
    if (typeof window === 'undefined') return null;
    
    const test = AB_TESTS[testName];
    if (!test || !test.enabled) return null;
    
    // Check if user is already assigned to this test
    const storedVariant = this.getUserVariant(testName);
    if (storedVariant) {
      return storedVariant;
    }
    
    // Check if user should be included in test
    if (!this.shouldIncludeUser(test.audience?.percentage ?? 0)) {
      return null;
    }
    
    // Assign variant based on weights
    const variant = this.assignVariant(test.variants);
    this.setUserVariant(testName, variant.name);
    
    // Track variant assignment
    ContactAnalytics.trackABTestVariant(testName, variant.name);
    
    return variant.name;
  }
  
  // Get configuration for user's variant
  getVariantConfig(testName: string): Record<string, string | number | boolean | string[]> | null {
    const variantName = this.getVariant(testName);
    if (!variantName) return null;
    
    const test = AB_TESTS[testName];
    const variant = test.variants.find(v => v.name === variantName);
    
    return variant?.config || null;
  }
  
  // Check if user should be included in test based on traffic percentage
  private shouldIncludeUser(trafficPercentage: number): boolean {
    if (trafficPercentage >= 100) return true;
    if (trafficPercentage <= 0) return false;
    
    // Use consistent hash based on session/user ID
    const userId = this.getUserId();
    const hash = this.hashString(userId);
    const bucket = hash % 100;
    
    return bucket < trafficPercentage;
  }
  
  // Assign variant based on weights
  private assignVariant(variants: ABVariant[]): ABVariant {
    const totalWeight = variants.reduce((sum, variant) => sum + variant.weight, 0);
    const userId = this.getUserId();
    const hash = this.hashString(userId + '_variant');
    const bucket = hash % totalWeight;
    
    let currentWeight = 0;
    for (const variant of variants) {
      currentWeight += variant.weight;
      if (bucket < currentWeight) {
        return variant;
      }
    }
    
    // Fallback to first variant
    return variants[0];
  }
  
  // Get or create user ID for consistent assignment
  private getUserId(): string {
    if (typeof window === 'undefined') return 'server';
    
    let userId = localStorage.getItem('ab_test_user_id');
    if (!userId) {
      userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('ab_test_user_id', userId);
    }
    
    return userId;
  }
  
  // Simple hash function for consistent bucketing
  private hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }
  
  // Store user's variant assignment
  private setUserVariant(testName: string, variant: string): void {
    if (typeof window === 'undefined') return;
    
    this.userVariants.set(testName, variant);
    
    // Also store in localStorage for persistence
    const stored = this.getStoredVariants();
    stored[testName] = variant;
    localStorage.setItem('ab_test_variants', JSON.stringify(stored));
  }
  
  // Get user's stored variant
  private getUserVariant(testName: string): string | null {
    // Check memory first
    if (this.userVariants.has(testName)) {
      return this.userVariants.get(testName)!;
    }
    
    // Check localStorage
    if (typeof window !== 'undefined') {
      const stored = this.getStoredVariants();
      if (stored[testName]) {
        this.userVariants.set(testName, stored[testName]);
        return stored[testName];
      }
    }
    
    return null;
  }
  
  // Get all stored variants from localStorage
  private getStoredVariants(): Record<string, string> {
    if (typeof window === 'undefined') return {};
    
    try {
      const stored = localStorage.getItem('ab_test_variants');
      return stored ? JSON.parse(stored) : {};
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error('A/B Test analytics error:', errorMessage);
      return {};
    }
  }
  
  // Force user into specific variant (for testing)
  forceVariant(testName: string, variant: string): void {
    const test = AB_TESTS[testName];
    if (!test) return;
    
    const variantExists = test.variants.some(v => v.name === variant);
    if (!variantExists) return;
    
    this.setUserVariant(testName, variant);
    ContactAnalytics.trackABTestVariant(testName, variant);
  }
  
  // Get all active test assignments for current user
  getAllVariants(): Record<string, string> {
    const variants: Record<string, string> = {};
    
    Object.keys(AB_TESTS).forEach(testName => {
      const variant = this.getVariant(testName);
      if (variant) {
        variants[testName] = variant;
      }
    });
    
    return variants;
  }
  
  // Clear all test assignments (for testing)
  clearAllVariants(): void {
    if (typeof window === 'undefined') return;
    
    this.userVariants.clear();
    localStorage.removeItem('ab_test_variants');
    localStorage.removeItem('ab_test_user_id');
  }
}

// React hook for using A/B tests
export function useABTestVariant(testName: string, defaultConfig: Record<string, string | number | boolean | string[]> = {}) {
  const [variant, setVariant] = React.useState<string | null>(null);
  const [config, setConfig] = React.useState<Record<string, string | number | boolean | string[]>>(defaultConfig);
  const [isLoading, setIsLoading] = React.useState(true);
  
  React.useEffect(() => {
    const manager = ABTestingManager.getInstance();
    const userVariant = manager.getVariant(testName);
    const variantConfig = manager.getVariantConfig(testName);
    
    setVariant(userVariant);
    setConfig(variantConfig || defaultConfig);
    setIsLoading(false);
  }, [testName, defaultConfig]);
  
  return {
    variant,
    config,
    isLoading,
    isInTest: variant !== null
  };
}

// React hook for multiple A/B tests
export function useMultipleABTests(testNames: string[]) {
  const [variants, setVariants] = React.useState<Record<string, string | null>>({});
  const [configs, setConfigs] = React.useState<Record<string, Record<string, string | number | boolean | string[]> | null>>({});
  const [isLoading, setIsLoading] = React.useState(true);
  
  React.useEffect(() => {
    const manager = ABTestingManager.getInstance();
    const newVariants: Record<string, string | null> = {};
    const newConfigs: Record<string, Record<string, string | number | boolean | string[]> | null> = {};
    
    testNames.forEach(testName => {
      newVariants[testName] = manager.getVariant(testName);
      newConfigs[testName] = manager.getVariantConfig(testName);
    });
    
    setVariants(newVariants);
    setConfigs(newConfigs);
    setIsLoading(false);
  }, [testNames]);
  
  return {
    variants,
    configs,
    isLoading
  };
}

// Helper function to get A/B test manager instance
export function getABTestManager(): ABTestingManager {
  return ABTestingManager.getInstance();
}

// Expose for browser debugging
if (typeof window !== 'undefined') {
  (window as Window & { ABTestingManager?: typeof ABTestingManager; getABTestManager?: typeof getABTestManager }).ABTestingManager = ABTestingManager;
  (window as Window & { ABTestingManager?: typeof ABTestingManager; getABTestManager?: typeof getABTestManager }).getABTestManager = getABTestManager;
}

// Import React for hooks
import React from 'react';
