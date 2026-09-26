const CACHE_NAME = 'evolve-pt-v1';

const APP_FILES = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

self.addEventListener('install', event => {

  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(APP_FILES))
  );

  self.skipWaiting();

});

self.addEventListener('activate', event => {

  event.waitUntil(

    caches.keys().then(names => {

      return Promise.all(

        names
          .filter(name => name !== CACHE_NAME)
          .map(name => caches.delete(name))

      );

    })

  );

  self.clients.claim();

});

self.addEventListener('fetch', event => {

  if (event.request.method !== 'GET') {
    return;
  }

  event.respondWith(

    fetch(event.request)

      .then(response => {

        const copy = response.clone();

        if (
          event.request.url.startsWith(
            self.location.origin
          )
        ) {

          caches.open(CACHE_NAME)
            .then(cache =>
              cache.put(event.request, copy)
            );

        }

        return response;

      })

      .catch(() =>
        caches.match(event.request)
      )

  );

});
