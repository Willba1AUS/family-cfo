// Service worker for Family CFO PWA
// Handles offline support and asset caching
const CACHE_NAME = 'family-cfo-v1';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './app-icon-192.png',
  './app-icon-512.png',
  'https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@2.47.0/tabler-icons.min.css'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  // Don't cache Firebase API calls — let them go to network or fail naturally
  if (event.request.url.includes('firestore.googleapis.com') ||
      event.request.url.includes('firebaseio.com') ||
      event.request.url.includes('googleapis.com/identitytoolkit')) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request).then((response) => {
        // Cache successful GET responses for same-origin or known CDNs
        if (response && response.status === 200 && event.request.method === 'GET') {
          const url = event.request.url;
          if (url.startsWith(self.location.origin) ||
              url.includes('jsdelivr.net') ||
              url.includes('gstatic.com')) {
            const respClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, respClone));
          }
        }
        return response;
      }).catch(() => cached || new Response('', { status: 503 }));
    })
  );
});
