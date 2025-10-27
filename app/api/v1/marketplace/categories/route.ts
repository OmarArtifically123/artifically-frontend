import { NextResponse } from 'next/server';

/**
 * Mock Categories API Route
 * Returns marketplace categories for development
 */
export async function GET() {
  try {
    const categories = [
      { id: 1, name: 'Customer Service', slug: 'customer-service', icon: '💬', count: 24 },
      { id: 2, name: 'Sales & Marketing', slug: 'sales-marketing', icon: '📈', count: 18 },
      { id: 3, name: 'Data Processing', slug: 'data-processing', icon: '⚙️', count: 32 },
      { id: 4, name: 'E-commerce', slug: 'ecommerce', icon: '🛒', count: 15 },
      { id: 5, name: 'HR & Recruiting', slug: 'hr-recruiting', icon: '👥', count: 12 },
      { id: 6, name: 'Finance & Accounting', slug: 'finance', icon: '💰', count: 21 },
      { id: 7, name: 'Project Management', slug: 'project-management', icon: '📋', count: 19 },
      { id: 8, name: 'Analytics & Reporting', slug: 'analytics', icon: '📊', count: 28 },
    ];

    return NextResponse.json({
      success: true,
      data: {
        categories,
      },
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}

