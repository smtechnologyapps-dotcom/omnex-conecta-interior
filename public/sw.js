// OMNEX TACTICAL PWA SERVICE WORKER
// Versión: 2.4.2 - OMNEX Conecta Interior

const CACHE_NAME = 'omnex-tactical-v2.4.2';

const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/favicon.ico',
  '/navigation_flow.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS).catch((err) => {
        console.warn('OMNEX SW precache warning:', err);
      });
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // No interceptar llamadas API POST ni webhooks externos
  if (event.request.method !== 'GET') {
    return;
  }

  // Stale-While-Revalidate para flujos de navegación y metadatos
  if (url.pathname.includes('navigation_flow.json') || url.pathname.startsWith('/api/navigation-flow')) {
    event.respondWith(
      caches.open(CACHE_NAME).then(async (cache) => {
        const cached = await cache.match(event.request);
        const networkPromise = fetch(event.request).then((networkResponse) => {
          if (networkResponse.ok) {
            cache.put(event.request, networkResponse.clone());
          }
          return networkResponse;
        }).catch(() => cached);

        return cached || networkPromise;
      })
    );
    return;
  }

  // Cache-First para assets estáticos de Next.js
  if (url.pathname.startsWith('/_next/static/') || url.pathname.includes('/fonts/')) {
    event.respondWith(
      caches.match(event.request).then((cached) => {
        return cached || fetch(event.request).then((response) => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return response;
        });
      })
    );
    return;
  }

  // Network-First para navegación HTML con fallback offline
  event.respondWith(
    fetch(event.request).catch(async () => {
      const cached = await caches.match(event.request);
      if (cached) return cached;
      const rootCached = await caches.match('/');
      if (rootCached) return rootCached;
      return new Response('OMNEX Modo Sin Conexión Activo. Funcionalidad Local Disponible.', {
        headers: { 'Content-Type': 'text/plain; charset=utf-8' }
      });
    })
  );
});

// Listener de mensajes para SKIP_WAITING (Actualización en caliente solicitada por usuario)
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
