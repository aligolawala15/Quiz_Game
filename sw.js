/* ============================================================
   QUIZVERSE — Service Worker 
   Offline-capable PWA app shell (cache-first with network update)
   ============================================================ */
'use strict';

const VERSION = 'quizverse-v1';
const CACHE = VERSION;

// App shell — everything needed to run offline.
const PRECACHE = [
  './',
  './index.html',
  './manifest.webmanifest',
  './css/styles.css',
  './js/utils/helpers.js',
  './js/utils/audio.js',
  './js/data/questions.js',
  './js/state/store.js',
  './js/components/components.js',
  './js/screens/home.js',
  './js/screens/categories.js',
  './js/screens/difficulty.js',
  './js/screens/quiz.js',
  './js/screens/result.js',
  './js/screens/leaderboard.js',
  './js/screens/profile.js',
  './js/screens/about.js',
  './js/app.js',
  './assets/logo.png',
  './assets/logo-mark.png',
  './assets/icon-192.png',
  './assets/icon-512.png',
  './assets/icon-maskable.png',
  './assets/apple-touch-icon.png',
  './assets/favicon-32.png',
  './assets/favicon-16.png',
  './assets/favicon.ico'
];

// ---- Install: precache the app shell ----
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE)
      .then((cache) => cache.addAll(PRECACHE))
      .then(() => self.skipWaiting())
      .catch((err) => console.warn('[SW] precache failed', err))
  );
});

// ---- Activate: clean up old caches ----
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

// ---- Fetch ----
self.addEventListener('fetch', (event) => {
  const req = event.request;

  // Only handle GET
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  const sameOrigin = url.origin === self.location.origin;

  // Navigation requests: serve app shell (cache-first, fall back to network) so
  // the SPA works offline and deep links resolve to index.html.
  if (req.mode === 'navigate') {
    event.respondWith(
      caches.match('./index.html')
        .then((cached) => cached || fetch(req))
        .catch(() => caches.match('./index.html'))
    );
    return;
  }

  // Cross-origin (e.g., Google Fonts): stale-while-revalidate, tolerate failure.
  if (!sameOrigin) {
    event.respondWith(
      caches.open(CACHE).then((cache) =>
        cache.match(req).then((cached) => {
          const network = fetch(req)
            .then((res) => {
              if (res && res.status === 200) cache.put(req, res.clone());
              return res;
            })
            .catch(() => cached);
          return cached || network;
        })
      )
    );
    return;
  }

  // Same-origin static assets: cache-first, then network + populate cache.
  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;
      return fetch(req)
        .then((res) => {
          if (res && res.status === 200 && res.type === 'basic') {
            const copy = res.clone();
            caches.open(CACHE).then((cache) => cache.put(req, copy));
          }
          return res;
        })
        .catch(() => cached);
    })
  );
});

// Allow the page to trigger an immediate activation after an update.
self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING') self.skipWaiting();
});
