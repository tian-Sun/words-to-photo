import createMiddleware from 'next-intl/middleware';
import {pathnames, locales, localePrefix} from './config';

export default createMiddleware({
  defaultLocale: 'en',
  locales,
  pathnames,
  localePrefix,
  localeDetection: false,
  alternateLinks: false
});

export const config = {
  matcher: [
    // Set a cookie to remember the previous locale for
    // all requests that have a locale prefix
    '/(en|zh)/:path*',
    // Enable redirects that add missing locales
    // (e.g. `/pathnames` -> `/en/pathnames`)
    '/((?!_next|_vercel|.*\\..*).*)'
  ]
};
