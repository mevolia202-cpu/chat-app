// Service worker sederhana: menyimpan file aplikasi di cache browser
// supaya chat.html tetap bisa dibuka walau tidak ada internet.
// Taruh file ini satu folder dengan chat.html saat di-deploy.

const CACHE_NAME = 'chat-shell-v1';

self.addEventListener('install', event => {
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then(cached => {
      const network = fetch(event.request)
        .then(res => {
          if (res && res.status === 200) {
            const copy = res.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
          }
          return res;
        })
        .catch(() => cached);
      // Tampilkan versi cache dulu kalau ada (cepat), network tetap jalan di belakang.
      return cached || network;
    })
  );
});
