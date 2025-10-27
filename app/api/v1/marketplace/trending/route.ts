import { NextRequest, NextResponse } from 'next/server';
import { SAMPLE_AUTOMATIONS } from '@/data/automations';

/**
 * Mock Trending Automations API Route
 * Returns trending automations for development
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '10');

    // Get trending automations (sorted by team votes for now)
    const trending = [...SAMPLE_AUTOMATIONS]
      .sort((a, b) => (b.teamVotes || 0) - (a.teamVotes || 0))
      .slice(0, limit);

    return NextResponse.json({
      success: true,
      data: {
        items: trending,
      },
    });
  } catch (error) {
    console.error('Error fetching trending automations:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch trending automations' },
      { status: 500 }
    );
  }
}


