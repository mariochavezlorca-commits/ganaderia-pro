const CACHE_NAME = 'ganadapp-v1';
const urlsToCache = [
    '.',
    'index.html',
    'css/estilos.css',
    'manifest.json',
    'assets/icono-192.png',
    'assets/icono-512.png'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(response => response || fetch(event.request))
    );
});