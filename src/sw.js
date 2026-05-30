import { precacheAndRoute, cleanupOutdatedCaches } from 'workbox-precaching'
import { registerRoute, NavigationRoute } from 'workbox-routing'
import { StaleWhileRevalidate, CacheFirst, NetworkOnly } from 'workbox-strategies'
import { CacheableResponsePlugin } from 'workbox-cacheable-response'
import { ExpirationPlugin } from 'workbox-expiration'

cleanupOutdatedCaches()
precacheAndRoute(self.__WB_MANIFEST)

// 1. Cache First for Images
registerRoute(
  ({ request }) => request.destination === 'image',
  new CacheFirst({
    cacheName: 'images-cache',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
      }),
    ],
  }),
)

// 2. Cache CSS & JS using Stale-While-Revalidate (Updates in background)
registerRoute(
  ({ request }) => request.destination === 'script' || request.destination === 'style',
  new StaleWhileRevalidate({
    cacheName: 'static-resources',
  }),
)

// 3. Fallback for Google Fonts
registerRoute(
  ({ url }) =>
    url.origin === 'https://fonts.googleapis.com' || url.origin === 'https://fonts.gstatic.com',
  new CacheFirst({
    cacheName: 'google-fonts-cache',
    plugins: [
      new CacheableResponsePlugin({ statuses: [0, 200] }),
      new ExpirationPlugin({ maxAgeSeconds: 365 * 24 * 60 * 60, maxEntries: 30 }),
    ],
  }),
)

// 4. API & External request fallback - Use Network Only for AI endpoints (streaming)
registerRoute(({ url }) => url.href.includes('generativelanguage'), new NetworkOnly())

// 5. Offline Fallback for SPA routing - serve index.html for navigation
const navHandler = new NetworkOnly({
  plugins: [
    {
      handlerDidError: async () => {
        return await caches.match('/index.html', { ignoreSearch: true })
      },
    },
  ],
})
registerRoute(new NavigationRoute(navHandler))

self.addEventListener('install', (event) => {
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim())
})
