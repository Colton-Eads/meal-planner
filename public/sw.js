// Eads Meal Planner — Service Worker
// Strategy: network-first for navigation, cache-first for static assets.

const CACHE_NAME = 'eads-meal-planner-v1';

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', evt => {
  evt.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', evt => {
  const { request } = evt;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  // Only handle same-origin requests
  if (url.origin !== self.location.origin) return;

  // Navigation requests (HTML pages) — network-first, fall back to cached /
  if (request.mode === 'navigate') {
    evt.respondWith(
      fetch(request)
        .then(response => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(request, clone));
          return response;
        })
        .catch(() => caches.match('/').then(r => r || caches.match('/index.html')))
    );
    return;
  }

  // Static assets — cache-first, update in background
  evt.respondWith(
    caches.open(CACHE_NAME).then(cache =>
      cache.match(request).then(cached => {
        const networkFetch = fetch(request).then(response => {
          if (response && response.status === 200 && response.type !== 'opaque') {
            cache.put(request, response.clone());
          }
          return response;
        }).catch(() => null);

        return cached || networkFetch;
      })
    )
  );
});
