const CACHE_NAME = 'rompecabezas-v2';
const ASSETS_TO_CACHE = [
    './',
    './welcome.html',
    './puzzle.html',
    './ranking.html',
    './setting.html',
    './completion.html',
    './css/styles.css',
    './js/main.js',
    './js/puzzle.js',
    './js/ranking.js',
    './js/settings.js',
    './js/utils.js',
    'https://cdn.tailwindcss.com?plugins=forms,container-queries',
    'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;700;800&display=swap',
    'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined'
];

// Instalación del Service Worker
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('📦 Rompecabezas: Cacheando archivos estáticos');
                return cache.addAll(ASSETS_TO_CACHE);
            })
    );
    self.skipWaiting();
});

// Activación y limpieza de caches antiguos
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('🧹 Rompecabezas: Limpiando cache antigua', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

// Intercepción de peticiones
self.addEventListener('fetch', (event) => {
    // Estrategia Cache First, falling back to Network para assets
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // Cache hit - retornar respuesta
                if (response) {
                    return response;
                }

                // Clonar la petición porque es un stream de un solo uso
                const fetchRequest = event.request.clone();

                return fetch(fetchRequest).then(
                    (response) => {
                        // Verificar si recibimos una respuesta válida
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }

                        // Clonar la respuesta
                        const responseToCache = response.clone();

                        caches.open(CACHE_NAME)
                            .then((cache) => {
                                cache.put(event.request, responseToCache);
                            });

                        return response;
                    }
                );
            })
    );
});
