// Minimal service worker (no caching) to satisfy installability criteria.
self.addEventListener('install', (e) => self.skipWaiting());
self.addEventListener('activate', (e) => self.clients.claim());
// Chrome expects a fetch handler for A2HS installability.
self.addEventListener('fetch', () => {});
