import { NextResponse, type NextRequest } from "next/server";

export const config = {
  // Match all pathnames except API routes and static assets
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};

export default function middleware(_request: NextRequest) {
  // Localisation middleware was redirecting to non-existent locale-prefixed routes,
  // which caused every navigation to resolve to a 404. Until full locale-aware routes
  // are implemented, allow requests to continue untouched so the existing pages render.
  return NextResponse.next();
}
