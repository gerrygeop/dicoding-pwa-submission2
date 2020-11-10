const CACHE_NAME = "liga-inggris-v5";
const urlToCache = [
    '/',
    '/index.html',
    '/nav.html',
    '/manifest.json',
    '/register.js',
    '/css/materialize.min.css',
    '/css/style.css',
    '/js/api.js',
    '/js/db.js',
    '/js/idb.js',
    '/js/materialize.min.js',
    '/js/nav.js',
    '/js/view.js',
    '/pages/matches.html',
    '/pages/saved.html',
    '/pages/standing.html',
    '/icons/icon-192x192.png',
    '/icons/icon-512x512.png',
    '/icons/logo.svg',
    'https://fonts.googleapis.com/icon?family=Material+Icons',
    'https://fonts.gstatic.com/s/materialicons/v67/flUhRq6tzZclQEJ-Vdg-IuiaDsNc.woff2',
];


self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return cache.addAll(urlToCache);
        })
    );
});


self.addEventListener('fetch', event => {
    const base_url = "https://api.football-data.org/v2/";
    if (event.request.url.indexOf(base_url) > -1) {
        event.respondWith(
            caches.open(CACHE_NAME).then(cache => {
                return fetch(event.request).then(response => {
                    cache.put(event.request.url, response.clone());
                    return response;
                })
            })
        );
    } else {
        event.respondWith(
            caches.match(event.request, {'ignoreSearch': true}).then(response => {
                if (response) {
                    // console.log('ServiceWorker: Gunakan Aset dari cache: ', response.url);
                    return response
                }
                // console.log('ServiceWorker: Memuat aset dari server: ', event.request.url);
                return fetch(event.request);
            })
        )
    }
});


self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        console.log(`ServiceWorker: cache ${cacheName} dihapus`);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});


self.addEventListener('push', event => {
    let body;
    if (event.data) {
        body = event.data.text();
    } else {
        body = "Push message no payload";
    }

    let options = {
        body: body,
        icon: "/icons/icon-192x192.png",
        vibrate: [100, 50, 100],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
        }
    };

    event.waitUntil(
        self.registration.showNotification('Push Notification', options)
    );
});