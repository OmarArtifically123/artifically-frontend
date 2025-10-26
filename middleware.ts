import { NextResponse, type NextRequest } from "next/server";

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};

export default function middleware(_request: NextRequest) {
  // Locale-aware routing is not yet wired up in the app directory structure.
  // Passing every request through avoids redirecting to non-existent /en/... routes.
  return NextResponse.next();
}
