import { NextRequest, NextResponse } from 'next/server';
import { SAMPLE_AUTOMATIONS } from '@/data/automations';

/**
 * Mock Marketplace API Route
 * Returns sample automation data for development
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const category = searchParams.get('category');
    const priceTier = searchParams.get('priceTier');
    const search = searchParams.get('search');

    let filteredAutomations = [...SAMPLE_AUTOMATIONS] as any[];

    // Apply filters
    if (category) {
      filteredAutomations = filteredAutomations.filter(
        (auto: any) => auto.category === category || auto.category?.slug === category
      );
    }

    if (priceTier && priceTier !== 'all') {
      filteredAutomations = filteredAutomations.filter(
        (auto: any) => auto.priceTier === priceTier
      );
    }

    if (search) {
      const searchLower = search.toLowerCase();
      filteredAutomations = filteredAutomations.filter(
        (auto: any) =>
          auto.name?.toLowerCase().includes(searchLower) ||
          auto.description?.toLowerCase().includes(searchLower) ||
          auto.tags?.some((tag: string) => tag.toLowerCase().includes(searchLower))
      );
    }

    // Pagination
    const total = filteredAutomations.length;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedAutomations = filteredAutomations.slice(startIndex, endIndex);
    const hasMore = endIndex < total;

    return NextResponse.json({
      success: true,
      data: {
        items: paginatedAutomations,
        page,
        limit,
        total,
        hasMore,
        nextPage: hasMore ? page + 1 : null,
      },
    });
  } catch (error) {
    console.error('Error fetching automations:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch automations' },
      { status: 500 }
    );
  }
}

