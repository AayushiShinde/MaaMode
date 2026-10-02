// MaaMode Service Worker for 100% Offline Mobile PWA Experience
const CACHE_NAME = 'maamode-v1';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './style.css',
  './voice-engine.js',
  './ai-engine.js',
  './tutorial-sandbox.js',
  './app.js',
  './manifest.json',
  './logo.png',
  './sample_photo.jpg'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[ServiceWorker] Caching app assets');
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[ServiceWorker] Removing old cache', key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).catch(() => {
        // Offline fallback
        return caches.match('./index.html');
      });
    })
  );
});
