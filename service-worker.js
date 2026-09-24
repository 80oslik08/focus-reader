/* Focus Reader service worker — app-shell cache-first; Google APIs network-only */
var CACHE = 'focus-reader-v9';
var PRECACHE = [
  './',
  './index.html',
  './styles.css',
  './app.js',
  './orp.js',
  './recent-store.js',
  './sync.js',
  './library.js',
  './listen.js',
  './jump.js',
  './sentence-strip.js',
  './voice-limit.js',
  './library-seed/manifest.json',
  './config.js',
  './manifest.webmanifest',
  './lib/pdf.min.js',
  './lib/pdf.worker.min.js',
  './lib/pdf-worker-blob.js',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-maskable-512.png',
  './icons/apple-touch-icon.png'
];

self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(CACHE).then(function (cache) {
      return cache.addAll(PRECACHE);
    }).then(function () {
      return self.skipWaiting();
    })
  );
});

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.filter(function (k) {
        return k !== CACHE;
      }).map(function (k) {
        return caches.delete(k);
      }));
    }).then(function () {
      return self.clients.claim();
    })
  );
});

function isGoogleHost(url) {
  try {
    var u = new URL(url);
    return (
      u.hostname === 'accounts.google.com' ||
      u.hostname.endsWith('.googleapis.com') ||
      u.hostname === 'googleapis.com' ||
      u.hostname === 'www.googleapis.com' ||
      u.hostname === 'oauth2.googleapis.com'
    );
  } catch (e) {
    return false;
  }
}

self.addEventListener('fetch', function (event) {
  var req = event.request;
  if (req.method !== 'GET') return;
  var url = req.url;

  if (isGoogleHost(url)) {
    // Always network for Google auth / Drive
    event.respondWith(fetch(req));
    return;
  }

  event.respondWith(
    caches.match(req).then(function (cached) {
      if (cached) return cached;
      return fetch(req).then(function (res) {
        // Cache same-origin successful GETs
        try {
          var u = new URL(url);
          if (u.origin === self.location.origin && res && res.ok) {
            var copy = res.clone();
            caches.open(CACHE).then(function (cache) {
              cache.put(req, copy);
            });
          }
        } catch (e) {}
        return res;
      }).catch(function () {
        if (req.mode === 'navigate') {
          return caches.match('./index.html');
        }
        throw new Error('offline');
      });
    })
  );
});

self.addEventListener('message', function (event) {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
