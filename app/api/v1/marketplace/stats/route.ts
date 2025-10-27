import { NextResponse } from 'next/server';
import { SAMPLE_AUTOMATIONS } from '@/data/automations';

interface AutomationItem {
  id: string;
  name: string;
  description: string;
  category?: string | { slug: string; [key: string]: unknown };
  deploymentCount?: number;
  deploymentsPerWeek?: number;
  [key: string]: unknown;
}

/**
 * Mock Marketplace Stats API Route
 * Returns marketplace statistics for development
 */
export async function GET() {
  try {
    const automations = SAMPLE_AUTOMATIONS as unknown as AutomationItem[];
    const totalAutomations = automations.length;
    const categories = new Set(
      automations.map((auto) => {
        const cat = auto.category;
        if (typeof cat === 'object' && cat !== null && 'slug' in cat) {
          return cat.slug;
        }
        return cat;
      }).filter(Boolean)
    ).size;
    
    // Calculate total deployments
    const totalDeployments = automations.reduce(
      (sum, auto) => sum + (auto.deploymentCount || auto.deploymentsPerWeek || 0),
      0
    );

    return NextResponse.json({
      success: true,
      data: {
        totalAutomations,
        totalCategories: categories,
        totalDeployments,
        activeUsers: 1250,
        avgRating: 4.7,
      },
    });
  } catch (error) {
    console.error('Error fetching marketplace stats:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}


