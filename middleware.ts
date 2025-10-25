import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  // List of all supported locales
  locales: ['en', 'ar'],

  // Default locale if no match
  defaultLocale: 'en',

  // Default locale stays unprefixed; other locales use prefix
  localePrefix: 'as-needed'
});

export const config = {
  // Match all pathnames except API routes, static files
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};
