import { NextRequest, NextResponse } from 'next/server';
import { SAMPLE_AUTOMATIONS } from '@/data/automations';

/**
 * Mock Featured Automations API Route
 * Returns featured automations for development
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '6');

    // Get featured automations (first few for now)
    const featured = SAMPLE_AUTOMATIONS.slice(0, limit);

    return NextResponse.json({
      success: true,
      data: {
        items: featured,
      },
    });
  } catch (error) {
    console.error('Error fetching featured automations:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch featured automations' },
      { status: 500 }
    );
  }
}


