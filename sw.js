/* ============================================================
   NOOR — Light of Islam  |  sw.js  (Service Worker)
   Strategy : Cache-First — serve from cache instantly,
              fall back to network, update cache in background.
   ============================================================ */

const CACHE_NAME = 'noor-v1';

/* Every file the app needs to work completely offline.
   Add new assets here whenever you expand the app.          */
const PRECACHE_URLS = [
  './islam-guide.html',
  './noor-styles.css',
  './noor-app.js',
  './manifest.json',
  /* Icon placeholders — add real files to /icons/ when ready */
  /* './icons/icon-192.png', */
  /* './icons/icon-512.png', */
];

/* ------------------------------------------------------------
   INSTALL — pre-cache all core assets
   ------------------------------------------------------------ */
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('[NOOR SW] Pre-caching app shell…');
      return cache.addAll(PRECACHE_URLS);
    })
  );

  /* Activate immediately — don't wait for old tabs to close */
  self.skipWaiting();
});

/* ------------------------------------------------------------
   ACTIVATE — delete stale caches from previous versions
   ------------------------------------------------------------ */
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames =>
      Promise.all(
        cacheNames
          .filter(name => name !== CACHE_NAME)
          .map(name => {
            console.log('[NOOR SW] Deleting old cache:', name);
            return caches.delete(name);
          })
      )
    )
  );

  /* Take control of all open clients immediately */
  self.clients.claim();
});

/* ------------------------------------------------------------
   FETCH — Cache-First strategy
   1. Check cache  → return instantly if found
   2. On miss      → fetch from network
   3. Clone & store the network response for next time
   4. If network also fails → fail gracefully (offline)
   ------------------------------------------------------------ */
self.addEventListener('fetch', event => {
  /* Only intercept GET requests for same-origin or relative URLs */
  if (event.request.method !== 'GET') return;

  /* Skip cross-origin requests (e.g. Google Fonts CDN) —
     let the browser handle those normally.                   */
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    caches.match(event.request).then(cachedResponse => {

      /* ── Cache hit: return immediately ── */
      if (cachedResponse) {
        /* Background revalidation (stale-while-revalidate pattern):
           update the cache entry silently so the *next* load is fresh. */
        const fetchAndUpdate = fetch(event.request)
          .then(networkResponse => {
            if (networkResponse && networkResponse.ok) {
              return caches.open(CACHE_NAME).then(cache => {
                cache.put(event.request, networkResponse.clone());
                return networkResponse;
              });
            }
          })
          .catch(() => { /* Network unavailable — ignore, cache is sufficient */ });

        /* Fire-and-forget background update; return cached immediately */
        event.waitUntil(fetchAndUpdate);
        return cachedResponse;
      }

      /* ── Cache miss: go to network and cache the result ── */
      return fetch(event.request)
        .then(networkResponse => {
          if (!networkResponse || !networkResponse.ok) {
            return networkResponse; /* Pass through non-OK responses unchanged */
          }

          return caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          });
        })
        .catch(() => {
          /* Offline and not cached: return a minimal fallback for HTML requests */
          if (event.request.headers.get('accept')?.includes('text/html')) {
            return caches.match('./islam-guide.html');
          }
          /* For other asset types, just fail — the browser handles it */
        });
    })
  );
});
