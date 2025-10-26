/**
 * Advanced Service Worker with Intelligent Caching
 * - Aggressive caching strategy
 * - Predictive prefetching
 * - Offline fallbacks
 * - Background sync
 * - Network-first for HTML, Cache-first for assets
 */

const CACHE_VERSION = 'v2.0.0';
const CACHE_NAME = `artifically-${CACHE_VERSION}`;
const OFFLINE_URL = '/offline.html';

// Assets to cache immediately on install
const CRITICAL_ASSETS = [
  '/',
  '/offline.html',
  '/images/hero-preview.avif',
  '/images/hero-preview.webp',
  '/fonts/inter-var.woff2',
  '/manifest.json',
];

// Routes to prefetch when idle
const PREFETCH_ROUTES = [
  '/marketplace',
  '/pricing',
  '/about',
  '/docs',
];

// Cache strategy configurations
const CACHE_STRATEGIES = {
  // Images: Cache first, network fallback
  images: {
    pattern: /\.(png|jpg|jpeg|svg|gif|webp|avif)$/,
    strategy: 'cache-first',
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    maxEntries: 100,
  },
  // Fonts: Cache first, critical for performance
  fonts: {
    pattern: /\.(woff|woff2|ttf|otf)$/,
    strategy: 'cache-first',
    maxAge: 365 * 24 * 60 * 60 * 1000, // 1 year
    maxEntries: 30,
  },
  // JS/CSS: Stale while revalidate
  static: {
    pattern: /\.(js|css|json)$/,
    strategy: 'stale-while-revalidate',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    maxEntries: 50,
  },
  // API: Network first, cache fallback
  api: {
    pattern: /\/api\//,
    strategy: 'network-first',
    maxAge: 5 * 60 * 1000, // 5 minutes
    maxEntries: 50,
  },
  // HTML: Network first, cache fallback
  pages: {
    pattern: /\.html$|\/[^.]*$/,
    strategy: 'network-first',
    maxAge: 24 * 60 * 60 * 1000, // 1 day
    maxEntries: 30,
  },
};

// Install event - cache critical assets
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker...');
  
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Caching critical assets');
      return cache.addAll(CRITICAL_ASSETS);
    }).then(() => {
      console.log('[SW] Skip waiting');
      return self.skipWaiting();
    })
  );
});

// Activate event - clean old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker...');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('[SW] Claiming clients');
      return self.clients.claim();
    })
  );
});

// Fetch event - intelligent caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip chrome extensions and other protocols
  if (!url.protocol.startsWith('http')) {
    return;
  }

  // Determine strategy based on request type
  let strategy = getStrategy(request);

  event.respondWith(
    handleFetch(request, strategy)
      .catch((error) => {
        console.error('[SW] Fetch failed:', error);
        return handleOffline(request);
      })
  );
});

// Message event - handle commands from client
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'PREFETCH_ROUTES') {
    prefetchRoutes(event.data.routes || PREFETCH_ROUTES);
  }
  
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    clearCache();
  }
});

/**
 * Determine caching strategy for a request
 */
function getStrategy(request) {
  const url = request.url;

  // Check each strategy pattern
  for (const [name, config] of Object.entries(CACHE_STRATEGIES)) {
    if (config.pattern.test(url)) {
      return config;
    }
  }

  // Default: network first
  return CACHE_STRATEGIES.pages;
}

/**
 * Handle fetch with specified strategy
 */
async function handleFetch(request, strategy) {
  const cache = await caches.open(CACHE_NAME);

  switch (strategy.strategy) {
    case 'cache-first':
      return cacheFirst(request, cache, strategy);
    
    case 'network-first':
      return networkFirst(request, cache, strategy);
    
    case 'stale-while-revalidate':
      return staleWhileRevalidate(request, cache, strategy);
    
    default:
      return fetch(request);
  }
}

/**
 * Cache-first strategy: Try cache, fall back to network
 */
async function cacheFirst(request, cache, strategy) {
  const cached = await cache.match(request);
  
  if (cached && !isCacheExpired(cached, strategy.maxAge)) {
    return cached;
  }

  const response = await fetch(request);
  
  if (response.ok) {
    await cache.put(request, response.clone());
  }
  
  return response;
}

/**
 * Network-first strategy: Try network, fall back to cache
 */
async function networkFirst(request, cache, strategy) {
  try {
    const response = await fetch(request, { timeout: 3000 });
    
    if (response.ok) {
      await cache.put(request, response.clone());
    }
    
    return response;
  } catch (error) {
    const cached = await cache.match(request);
    
    if (cached) {
      console.log('[SW] Using cached response for:', request.url);
      return cached;
    }
    
    throw error;
  }
}

/**
 * Stale-while-revalidate: Return cache immediately, update in background
 */
async function staleWhileRevalidate(request, cache, strategy) {
  const cached = await cache.match(request);
  
  // Start fetching fresh version in background
  const fetchPromise = fetch(request).then((response) => {
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  });

  // Return cached version immediately if available
  if (cached && !isCacheExpired(cached, strategy.maxAge)) {
    return cached;
  }

  // Otherwise wait for fresh version
  return fetchPromise;
}

/**
 * Check if cached response is expired
 */
function isCacheExpired(response, maxAge) {
  if (!maxAge) return false;

  const cachedTime = response.headers.get('sw-cached-time');
  if (!cachedTime) return true;

  const age = Date.now() - parseInt(cachedTime, 10);
  return age > maxAge;
}

/**
 * Handle offline scenarios
 */
async function handleOffline(request) {
  const cache = await caches.open(CACHE_NAME);
  
  // Try to find cached version
  const cached = await cache.match(request);
  if (cached) {
    return cached;
  }

  // For HTML pages, return offline page
  if (request.headers.get('accept').includes('text/html')) {
    const offlinePage = await cache.match(OFFLINE_URL);
    if (offlinePage) {
      return offlinePage;
    }
  }

  // Return a basic offline response
  return new Response('Offline - No cached version available', {
    status: 503,
    statusText: 'Service Unavailable',
    headers: new Headers({
      'Content-Type': 'text/plain',
    }),
  });
}

/**
 * Prefetch routes during idle time
 */
async function prefetchRoutes(routes) {
  console.log('[SW] Prefetching routes:', routes);
  
  const cache = await caches.open(CACHE_NAME);
  
  for (const route of routes) {
    try {
      const response = await fetch(route);
      if (response.ok) {
        await cache.put(route, response);
        console.log('[SW] Prefetched:', route);
      }
    } catch (error) {
      console.error('[SW] Failed to prefetch:', route, error);
    }
  }
}

/**
 * Clear all caches
 */
async function clearCache() {
  console.log('[SW] Clearing all caches');
  const cacheNames = await caches.keys();
  await Promise.all(cacheNames.map((name) => caches.delete(name)));
}

/**
 * Background sync for failed requests
 */
self.addEventListener('sync', (event) => {
  console.log('[SW] Background sync:', event.tag);
  
  if (event.tag === 'sync-analytics') {
    event.waitUntil(syncAnalytics());
  }
});

/**
 * Sync analytics data
 */
async function syncAnalytics() {
  // Implementation for syncing queued analytics
  console.log('[SW] Syncing analytics data');
}

console.log('[SW] Service Worker loaded');
