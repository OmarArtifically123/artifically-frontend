const VERSION = 'artifically-cache-v5';
const STATIC_CACHE = `${VERSION}-static`;
const DYNAMIC_CACHE = `${VERSION}-dynamic`;
const IMMUTABLE_CACHE = `${VERSION}-immutable`;

const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/site.webmanifest',
  '/favicon-32x32.png',
  '/favicon-16x16.png',
  '/android-chrome-192x192.png',
  '/android-chrome-512x512.png',
];

const IMMUTABLE_PATTERNS = [/\/assets\//, /\.(?:woff2?|ttf|otf)$/i];

const isHtmlRequest = (request, response) => {
  if (request.mode === 'navigate' || request.destination === 'document') {
    return true;
  }

  const acceptHeader = request.headers.get('Accept') || '';
  if (acceptHeader.includes('text/html')) {
    return true;
  }

  if (response) {
    const contentType = response.headers.get('Content-Type') || '';
    if (contentType.includes('text/html')) {
      return true;
    }
  }

  return false;
};

const shouldCacheResponse = (request, response) => {
  if (!response || response.status !== 200) {
    return false;
  }

  const cacheControl = response.headers.get('Cache-Control') || '';
  if (/no-store|no-cache|private/i.test(cacheControl)) {
    return false;
  }

  if (isHtmlRequest(request, response)) {
    return false;
  }

  const authorization = request.headers.get('Authorization');
  if (authorization) {
    return false;
  }

  if (request.credentials === 'include') {
    return false;
  }

  return true;
};

// Check if we're in development mode
const isDevelopment = () => {
  return self.location.hostname === 'localhost' || 
         self.location.hostname === '127.0.0.1' ||
         self.location.port === '3000' ||
         self.location.port === '4173';
};

self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(STATIC_CACHE);
      try {
        await cache.addAll(PRECACHE_URLS);
      } catch (error) {
        console.warn('SW: Failed to precache some resources:', error);
      }
      await caches.open(IMMUTABLE_CACHE);
    })()
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      // Only enable navigation preload in production or when SSR is active
      if (self.registration.navigationPreload && !isDevelopment()) {
        try {
          await self.registration.navigationPreload.enable();
        } catch (error) {
          console.warn('SW: Navigation preload not available:', error);
        }
      }

      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames
          .filter((name) => !name.startsWith(VERSION))
          .map((name) => caches.delete(name))
      );

      await self.clients.claim();
    })()
  );
});

self.addEventListener('message', (event) => {
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
  }
});

const networkFirst = async (request, options = {}) => {
  const { cacheName = DYNAMIC_CACHE, shouldCache = shouldCacheResponse } = options;
  const cache = await caches.open(cacheName);
  try {
    const response = await fetch(request);
    // Only cache successful responses
    if (shouldCache(request, response)) {
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    const cached = await cache.match(request);
    if (cached) {
      return cached;
    }
    throw error;
  }
};

const staleWhileRevalidate = async (request, cacheName, shouldCache = shouldCacheResponse) => {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  const fetchPromise = fetch(request)
    .then((response) => {
      if (shouldCache(request, response)) {
        cache.put(request, response.clone());
      }
      return response;
    })
    .catch((error) => {
      console.warn('SW: Fetch failed, using cache:', error);
      return cached;
    });

  return cached || fetchPromise;
};

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') {
    return;
  }

  const { request } = event;
  const url = new URL(request.url);

  // Skip cross-origin requests that we can't handle
  if (url.origin !== self.location.origin) {
    return;
  }

  if (request.mode === 'navigate') {
    event.respondWith(
      (async () => {
        // Only try to use preload response in production
        if (!isDevelopment()) {
          try {
            const preloadResponse = await event.preloadResponse;
            if (preloadResponse) {
              const cache = await caches.open(DYNAMIC_CACHE);
              if (shouldCacheResponse(request, preloadResponse)) {
                cache.put(request, preloadResponse.clone());
              }
              return preloadResponse;
            }
          } catch (error) {
            console.warn('SW: Navigation preload failed:', error);
          }
        }

        try {
          return await networkFirst(request);
        } catch (error) {
          console.warn('SW: Network failed for navigation, using fallback:', error);
          const cache = await caches.open(STATIC_CACHE);
          const fallback = await cache.match('/index.html') || await cache.match('/');
          
          if (fallback) {
            return fallback;
          }
          
          // Create a basic offline fallback if no cache is available
          return new Response(
            `<!DOCTYPE html>
            <html>
              <head>
                <title>Offline - Artifically</title>
                <style>
                  body { 
                    font-family: system-ui, sans-serif; 
                    display: flex; 
                    align-items: center; 
                    justify-content: center; 
                    min-height: 100vh; 
                    margin: 0; 
                    background: #0f172a; 
                    color: #f8fafc; 
                  }
                  .offline { text-align: center; }
                  h1 { color: #6366f1; }
                </style>
              </head>
              <body>
                <div class="offline">
                  <h1>You're offline</h1>
                  <p>Please check your connection and try again.</p>
                  <button onclick="location.reload()">Retry</button>
                </div>
              </body>
            </html>`,
            {
              status: 200,
              statusText: 'OK',
              headers: { 'Content-Type': 'text/html' }
            }
          );
        }
      })()
    );
    return;
  }

  // Skip API requests in development (let them go to network)
  if (isDevelopment() && (url.pathname.startsWith('/api') || url.pathname.startsWith('/graphql'))) {
    return;
  }

  if (url.pathname.startsWith('/api') || url.pathname.startsWith('/graphql')) {
    event.respondWith(networkFirst(request, { shouldCache: () => false }));
    return;
  }

  if (IMMUTABLE_PATTERNS.some((pattern) => pattern.test(url.pathname))) {
    event.respondWith(staleWhileRevalidate(request, IMMUTABLE_CACHE));
    return;
  }

  if (PRECACHE_URLS.includes(url.pathname)) {
    event.respondWith(staleWhileRevalidate(request, STATIC_CACHE));
    return;
  }

  event.respondWith(staleWhileRevalidate(request, DYNAMIC_CACHE));
});

// Handle errors globally
self.addEventListener('error', (event) => {
  console.error('SW: Global error:', event.error);
});

self.addEventListener('unhandledrejection', (event) => {
  console.error('SW: Unhandled promise rejection:', event.reason);
});