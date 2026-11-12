const CACHE_NAME = 'portafolio-rpg-v1';

// Lista exacta de tus archivos en perfil2.1
const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './fotos.html',
    './intereses.html',
    './musicaRock.html',
    './rutinaSemanal.html',
    './styles.css',
    './script.js',
    './manifest.json',
    './WhatsApp Image 2026-11-03 at 9.18.01 PM.jpeg',
    './hermanos2026-11-11 at 1.16.32 AM.jpeg',
    './susu 2026-11-11 at 1.14.44 AM.jpeg'
];

// 1. Instalación: Guarda los archivos en el dispositivo
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return Promise.allSettled(
                ASSETS_TO_CACHE.map(url => cache.add(url))
            );
        })
    );
    self.skipWaiting();
});

// 2. Activación: Toma el control inmediato y limpia cachés viejas
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(
                keys.map(key => {
                    if (key !== CACHE_NAME) return caches.delete(key);
                })
            );
        }).then(() => self.clients.claim())
    );
});

// 3. Interceptación Offline-First: Sirve desde caché si no hay internet
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(cachedResponse => {
            if (cachedResponse) {
                return cachedResponse;
            }
            return fetch(event.request).then(networkResponse => {
                if (event.request.url.startsWith('http')) {
                    const responseClone = networkResponse.clone();
                    caches.open(CACHE_NAME).then(cache => cache.put(event.request, responseClone));
                }
                return networkResponse;
            });
        })
    );
});