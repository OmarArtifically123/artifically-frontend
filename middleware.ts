import { NextResponse } from 'next/server';
import createMiddleware from 'next-intl/middleware';

const defaultLocale = 'en';
const locales = ['en', 'ar'] as const;
const stripDefaultLocalePrefix = (pathname: string) => {
  if (!pathname.startsWith(`/${defaultLocale}`)) {
    return null;
  }
  const withoutLocale = pathname.slice(defaultLocale.length + 1);
  return withoutLocale ? `/${withoutLocale}` : '/';
};

const localizationMiddleware = createMiddleware({
  // List of all supported locales
  locales: [...locales],

  // Default locale if no match
  defaultLocale,

  // Default locale stays unprefixed; other locales use prefix
  localePrefix: 'as-needed'
});

export const config = {
  // Match all pathnames except API routes, static files
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};

export default function middleware(request: Parameters<typeof localizationMiddleware>[0]) {
  const acceptHeader = request.headers.get('accept') ?? '';

  const isRscRequest =
    request.nextUrl.searchParams.has('_rsc') ||
    request.headers.get('rsc') === '1' ||
    request.headers.has('next-router-prefetch') ||
    request.headers.has('next-router-state-tree') ||
    acceptHeader.includes('text/x-component');

  if (isRscRequest) {
    return NextResponse.next();
  }

  const strippedPath = stripDefaultLocalePrefix(request.nextUrl.pathname);
  if (strippedPath !== null) {
    const url = request.nextUrl.clone();
    url.pathname = strippedPath;
    return NextResponse.redirect(url, 308);
  }

  return localizationMiddleware(request);
}
