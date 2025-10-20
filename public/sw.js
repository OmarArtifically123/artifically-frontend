let workboxLoaded = false;

try {
  importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.5.4/workbox-sw.js');
  workboxLoaded = typeof self.workbox !== 'undefined';
} catch (error) {
  console.warn('Workbox failed to load for Artifically service worker.', error);
}

if (workboxLoaded && self.workbox) {
  const { core, precaching, routing, strategies, expiration, cacheableResponse } = self.workbox;

  core.setConfig({ debug: false });
  core.skipWaiting();
  core.clientsClaim();
  core.setCacheNameDetails({ prefix: 'artifically', suffix: 'v1' });

  const PRECACHE_ASSETS = [
    { url: '/', revision: null },
    { url: '/offline.html', revision: '1' },
    { url: '/site.webmanifest', revision: '1' },
    { url: '/favicon-32x32.png', revision: '1' },
    { url: '/favicon-16x16.png', revision: '1' },
    { url: '/android-chrome-192x192.png', revision: '1' },
    { url: '/android-chrome-512x512.png', revision: '1' },
  ];

  const manifest = self.__WB_MANIFEST || [];
  precaching.precacheAndRoute([...manifest, ...PRECACHE_ASSETS]);
  precaching.cleanupOutdatedCaches();

  routing.registerRoute(
    ({ request }) => ['script', 'style', 'font'].includes(request.destination),
    new strategies.CacheFirst({
      cacheName: 'artifically-static-assets',
      plugins: [
        new cacheableResponse.Plugin({ statuses: [200] }),
        new expiration.Plugin({ maxEntries: 60, maxAgeSeconds: 60 * 60 * 24 * 365 }),
      ],
    }),
  );

  routing.registerRoute(
    ({ request }) => request.destination === 'image',
    new strategies.CacheFirst({
      cacheName: 'artifically-images',
      plugins: [
        new cacheableResponse.Plugin({ statuses: [200] }),
        new expiration.Plugin({ maxEntries: 80, maxAgeSeconds: 60 * 60 * 24 * 365 }),
      ],
    }),
  );

  routing.registerRoute(
    ({ url, request }) =>
      url.origin === self.location.origin &&
      request.method === 'GET' &&
      url.pathname.startsWith('/api'),
    new strategies.NetworkFirst({
      cacheName: 'artifically-api',
      networkTimeoutSeconds: 3,
      plugins: [
        new cacheableResponse.Plugin({ statuses: [200] }),
        new expiration.Plugin({ maxEntries: 100, maxAgeSeconds: 60 * 5 }),
      ],
    }),
  );

  routing.registerRoute(
    ({ request }) => request.mode === 'navigate',
    new strategies.NetworkFirst({
      cacheName: 'artifically-pages',
      plugins: [
        new cacheableResponse.Plugin({ statuses: [200] }),
        new expiration.Plugin({ maxEntries: 25, maxAgeSeconds: 60 * 60 * 24 }),
      ],
    }),
  );

  routing.setCatchHandler(async ({ event }) => {
    if (event.request.destination === 'document') {
      const cache = await caches.open('artifically-pages');
      const cached = await cache.match('/offline.html');
      if (cached) {
        return cached;
      }
      return caches.match('/offline.html');
    }
    return Response.error();
  });
} else {
  if (!workboxLoaded) {
    console.warn('Workbox unavailable, running fallback service worker.');
  }
  self.addEventListener('install', (event) => {
    event.waitUntil(self.skipWaiting());
  });

  self.addEventListener('activate', (event) => {
    event.waitUntil(self.clients.claim());
  });

  self.addEventListener('fetch', () => {
    // No-op fallback to ensure the service worker remains passive when Workbox is unavailable.
  });
}