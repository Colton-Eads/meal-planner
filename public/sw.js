// Self-cleanup service worker.
//
// We previously shipped a network-first SW for offline support. With auth +
// real backend, caching HTML and JS bundles caused stale auth-state flashes
// and delayed deploys reaching users. The app needs network for anything
// useful (Supabase calls), so the offline story didn't pan out.
//
// Browsers that already registered the old SW will fetch this file on
// update and install it. This version wipes its own caches and unregisters,
// so users converge to "no SW" on their next visit.

self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.map(k => caches.delete(k)));
    await self.registration.unregister();
    const clients = await self.clients.matchAll({ type: 'window' });
    for (const c of clients) c.navigate(c.url);
  })());
});
