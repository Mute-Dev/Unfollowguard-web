// sw-v4.js
const CACHE_STATIC = 'ug-static-v4';
const CACHE_PAGES  = 'ug-pages-v4';

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_STATIC).then(c =>
      c.addAll(['./','./unfollowguard_logo.png','./manifest.webmanifest'])
    )
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => ![CACHE_STATIC, CACHE_PAGES].includes(k)).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Network-first for HTML; cache-first for other assets
self.addEventListener('fetch', event => {
  const req = event.request;
  const accept = req.headers.get('accept') || '';
  if (accept.includes('text/html') || req.mode === 'navigate') {
    event.respondWith(
      fetch(req).then(resp => {
        const copy = resp.clone();
        caches.open(CACHE_PAGES).then(c => c.put(req, copy));
        return resp;
      }).catch(() => caches.match(req).then(r => r || caches.match('./')))
    );
    return;
  }
  event.respondWith(
    caches.match(req).then(r => r || fetch(req).then(resp => {
      const copy = resp.clone();
      caches.open(CACHE_STATIC).then(c => c.put(req, copy));
      return resp;
    }))
  );
});
