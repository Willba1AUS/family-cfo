// Service worker for Family CFO PWA
// Network-first for HTML (always fresh), cache-first for static assets
const CACHE_NAME = 'family-cfo-v5';

self.addEventListener('install', (event) => {
  // Skip pre-caching — we cache as we go to avoid blocking install
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const url = event.request.url;

  // Pass-through for Firebase APIs
  if (url.includes('firestore.googleapis.com') ||
      url.includes('firebaseio.com') ||
      url.includes('googleapis.com/identitytoolkit') ||
      url.includes('firebasestorage.googleapis.com') ||
      url.includes('firebasestorage.app') ||
      url.includes('firebaseapp.com')) {
    return;
  }

  if (event.request.method !== 'GET') return;

  const isHTML = event.request.mode === 'navigate' ||
                 (event.request.headers.get('Accept') || '').includes('text/html') ||
                 url.endsWith('/') || url.endsWith('.html');

  if (isHTML) {
    // Network-first
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (response && response.status === 200) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return response;
        })
        .catch(() => caches.match(event.request).then(c => c || new Response('Offline', { status: 503 })))
    );
    return;
  }

  // Cache-first with background refresh for static assets
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) {
        fetch(event.request).then(r => {
          if (r && r.status === 200) {
            caches.open(CACHE_NAME).then(c => c.put(event.request, r.clone()));
          }
        }).catch(() => {});
        return cached;
      }
      return fetch(event.request).then((response) => {
        if (response && response.status === 200) {
          const same = url.startsWith(self.location.origin);
          const cdn = url.includes('jsdelivr.net') || url.includes('gstatic.com');
          if (same || cdn) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
        }
        return response;
      }).catch(() => new Response('', { status: 503 }));
    })
  );
});
