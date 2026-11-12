const CACHE_NAME = 'pwa-cache-v2';
const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './styles.css',
    './script.js',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
    'https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Cormorant+Garamond:ital,wght@0,400;0,600;700;1,400&display=swap'
];

// Evento Instalación: Guarda todos los recursos esenciales en la caché local
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return cache.addAll(ASSETS_TO_CACHE);
        })
    );
    self.skipWaiting();
});

// Evento Activar: Limpia cachés antiguas si actualizas la versión
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(
                keys.map(key => {
                    if (key !== CACHE_NAME) {
                        return caches.delete(key);
                    }
                })
            );
        })
    );
    self.clientClaim();
});

// Evento Fetch: Intercepta solicitudes HTTP y sirve el contenido desde la Caché si estás offline
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(cachedResponse => {
            return cachedResponse || fetch(event.request).catch(() => {
                // Opcional: Podrías retornar una página offline genérica si falla la red y no está en caché
            });
        })
    );
});