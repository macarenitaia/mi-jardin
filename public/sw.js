// Mi Jardín - Service Worker
const CACHE_NAME = 'mi-jardin-v1'
const STATIC_ASSETS = [
  '/',
  '/plants',
  '/manifest.json',
]

// Instalar: cachear assets estáticos
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  )
  self.skipWaiting()
})

// Activar: limpiar caches viejos
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  )
  self.clients.claim()
})

// Fetch: network-first para API, cache-first para assets
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // No interceptar API calls ni Supabase
  if (url.pathname.startsWith('/api/') || url.hostname.includes('supabase')) {
    return
  }

  // Network first para navegación, cache fallback
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(() => caches.match('/plants') || caches.match('/'))
    )
    return
  }

  // Cache first para assets estáticos
  event.respondWith(
    caches.match(request).then((cached) => cached || fetch(request))
  )
})
