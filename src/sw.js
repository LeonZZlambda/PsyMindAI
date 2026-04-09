/* eslint-disable no-restricted-globals */

// Minimal service worker (injectManifest strategy).
// We keep this intentionally small and predictable to avoid build-time minification issues.

import { precacheAndRoute } from 'workbox-precaching';

// eslint-disable-next-line no-underscore-dangle
precacheAndRoute(self.__WB_MANIFEST);

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(Promise.resolve());
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', () => {
  // Network-first (default browser behavior). Precaching is injected by the PWA plugin.
});

