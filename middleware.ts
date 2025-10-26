import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './i18n/config';

export default createMiddleware({
  // A list of all locales that are supported
  locales,

  // Used when no locale matches
  defaultLocale,

  // Always show locale in URL
  localePrefix: 'always',

  // Locale detection based on Accept-Language header
  localeDetection: true,
});

export const config = {
  // Match all pathnames except for
  // - API routes
  // - _next (Next.js internals)
  // - _vercel (Vercel internals)
  // - Static files (with file extensions)
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
