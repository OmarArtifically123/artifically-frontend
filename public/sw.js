const CACHE_VERSION = "v1";
const STATIC_CACHE = `artifically-static-${CACHE_VERSION}`;
const ASSET_CACHE = `artifically-assets-${CACHE_VERSION}`;

const PRECACHE_URLS = [
  "/",
  "/offline.html",
  "/site.webmanifest",
  "/favicon-32x32.png",
  "/favicon-16x16.png",
  "/android-chrome-192x192.png",
  "/android-chrome-512x512.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .catch((error) => {
        console.warn("Failed to precache static assets", error);
      })
      .finally(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      try {
        const keys = await caches.keys();
        await Promise.all(
          keys
            .filter((key) => key.startsWith("artifically-") && key !== STATIC_CACHE && key !== ASSET_CACHE)
            .map((key) => caches.delete(key)),
        );
      } catch (error) {
        console.warn("Failed to clean up old caches", error);
      }

      if (self.registration && "navigationPreload" in self.registration) {
        try {
          await self.registration.navigationPreload.disable();
        } catch (error) {
          console.warn("Failed to disable navigation preload", error);
        }
      }

      await self.clients.claim();
    })(),
  );
});

const cacheFirst = async (request) => {
  const cache = await caches.open(ASSET_CACHE);
  const cached = await cache.match(request);
  if (cached) {
    return cached;
  }

  try {
    const response = await fetch(request);
    if (response && response.status === 200) {
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    return cached ?? Promise.reject(error);
  }
};

const networkFirst = async (request) => {
  try {
    const response = await fetch(request);
    const cache = await caches.open(STATIC_CACHE);
    if (response && response.status === 200) {
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    const cached = await caches.match(request);
    if (cached) {
      return cached;
    }
    if (request.mode === "navigate") {
      return caches.match("/offline.html");
    }
    throw error;
  }
};

self.addEventListener("fetch", (event) => {
  const { request } = event;

  if (request.method !== "GET") {
    return;
  }

  const url = new URL(request.url);

  if (url.origin !== self.location.origin) {
    event.respondWith(fetch(request).catch(() => caches.match("/offline.html")));
    return;
  }

  if (request.mode === "navigate") {
    event.respondWith(networkFirst(request));
    return;
  }

  if (PRECACHE_URLS.includes(url.pathname)) {
    event.respondWith(caches.match(request).then((cached) => cached ?? fetch(request)));
    return;
  }

  if (["style", "script", "font", "image"].includes(request.destination)) {
    event.respondWith(cacheFirst(request));
  }
});
