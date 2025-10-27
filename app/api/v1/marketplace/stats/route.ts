import { NextResponse } from 'next/server';
import { SAMPLE_AUTOMATIONS } from '@/data/automations';

/**
 * Mock Marketplace Stats API Route
 * Returns marketplace statistics for development
 */
export async function GET() {
  try {
    const totalAutomations = SAMPLE_AUTOMATIONS.length;
    const categories = new Set(
      SAMPLE_AUTOMATIONS.map((auto) => auto.category?.slug || auto.category).filter(Boolean)
    ).size;
    
    // Calculate total deployments
    const totalDeployments = SAMPLE_AUTOMATIONS.reduce(
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

