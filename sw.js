// James Sexy Body — Service Worker
// VERSION: 1.0
// Update this version number every time you upload a new version of the app

var CACHE_NAME = 'jsb-cache-v1.0';

var ASSETS = [
  './',
  './index.html',
  'https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap'
];

// INSTALL — cache all assets on first visit
self.addEventListener('install', function(event) {
  console.log('JSB Service Worker installing — v1.0');
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(['./', './index.html']);
    }).then(function() {
      return self.skipWaiting();
    })
  );
});

// ACTIVATE — clean up old caches when version changes
self.addEventListener('activate', function(event) {
  console.log('JSB Service Worker activating — v1.0');
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(name) {
          if (name !== CACHE_NAME) {
            console.log('JSB: Deleting old cache:', name);
            return caches.delete(name);
          }
        })
      );
    }).then(function() {
      return self.clients.claim();
    })
  );
});

// FETCH — serve from cache, fall back to network
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(response) {
      if (response) {
        return response;
      }
      return fetch(event.request).then(function(networkResponse) {
        // Cache successful responses
        if (networkResponse && networkResponse.status === 200) {
          var responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then(function(cache) {
            cache.put(event.request, responseClone);
          });
        }
        return networkResponse;
      }).catch(function() {
        // If both cache and network fail, return the main page
        return caches.match('./index.html');
      });
    })
  );
});
