const CACHE_NAME = 'rpg-hud-v1';
const assetsToCache = [
  'index.html',
  'fotos.html',
  'styles.css',
  'script.js',
  'WhatsApp Image 2026-11-03 at 9.18.01 PM.jpeg',
  'dominic Image 2026-11-03 at 9.18.02 PM.jpeg'
];

// Instalación del Service Worker y almacenamiento en caché
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(assetsToCache);
    })
  );
  self.skipWaiting();
});

// Activación y limpieza de cachés antiguas
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clientClaim();
});

// Interceptar peticiones para funcionamiento offline
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});