// James Sexy Body — Service Worker
// VERSION: 1.6 — Exercise first, walk after. Duplicates removed.
var CACHE_NAME='jsb-cache-v1.6';
self.addEventListener('install',function(e){e.waitUntil(caches.open(CACHE_NAME).then(function(c){return c.addAll(['./', './index.html']);}).then(function(){return self.skipWaiting();}));});
self.addEventListener('activate',function(e){e.waitUntil(caches.keys().then(function(n){return Promise.all(n.map(function(name){if(name!==CACHE_NAME)return caches.delete(name);}));}).then(function(){return self.clients.claim();}));});
self.addEventListener('fetch',function(e){e.respondWith(caches.match(e.request).then(function(r){if(r)return r;return fetch(e.request).then(function(nr){if(nr&&nr.status===200){var c=nr.clone();caches.open(CACHE_NAME).then(function(cache){cache.put(e.request,c);});}return nr;}).catch(function(){return caches.match('./index.html');});}));});
