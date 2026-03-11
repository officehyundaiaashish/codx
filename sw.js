// OfficeDesk Service Worker v3
const CACHE = 'officedesk-v3';

// All files that must be cached for offline use
const PRECACHE_URLS = [
  './offdesman.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './ppt-template.js',
  './alcazar.html',
  './keycode.html',
  './letthead.html',
  './pwareg.html'
];

self.addEventListener('install', e => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE).then(c =>
      // Use individual adds so one missing file doesn't break the whole cache
      Promise.allSettled(PRECACHE_URLS.map(url => c.add(url).catch(() => {})))
    )
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request).then(cached => {
      const fetchPromise = fetch(e.request).then(resp => {
        if (resp && resp.status === 200 && resp.type !== 'opaque') {
          caches.open(CACHE).then(c => c.put(e.request, resp.clone()));
        }
        return resp;
      }).catch(() => cached || new Response('Offline', { status: 503 }));
      return cached || fetchPromise;
    })
  );
});
