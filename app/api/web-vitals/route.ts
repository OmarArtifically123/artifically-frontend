import { NextResponse } from 'next/server';

/**
 * Web Vitals API Route
 * Accepts POST requests with web vitals data
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Log web vitals in development
    if (process.env.NODE_ENV === 'development') {
      console.log('Web Vitals:', body);
    }
    
    // TODO: Send to analytics service in production
    // await sendToAnalytics(body);
    
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error processing web vitals:', error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

// Handle OPTIONS for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Allow': 'POST, OPTIONS',
    },
  });
}


