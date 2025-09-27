const CACHE_VERSION = 'artifically-cache-v1';
const RUNTIME_CACHE = 'artifically-runtime';
const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/site.webmanifest',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then((cache) => cache.addAll(PRECACHE_URLS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames
          .filter((cacheName) => cacheName !== CACHE_VERSION && cacheName !== RUNTIME_CACHE)
          .map((cacheName) => caches.delete(cacheName))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') {
    return;
  }

  const requestURL = new URL(event.request.url);

  if (requestURL.origin === location.origin && PRECACHE_URLS.includes(requestURL.pathname)) {
    event.respondWith(caches.match(event.request));
    return;
  }

  event.respondWith(
    caches.open(RUNTIME_CACHE).then(async (cache) => {
      try {
        const response = await fetch(event.request);
        cache.put(event.request, response.clone());
        return response;
      } catch (error) {
        const cachedResponse = await cache.match(event.request);
        if (cachedResponse) {
          return cachedResponse;
        }
        throw error;
      }
    })
  );
});