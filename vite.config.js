import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import { createRequire } from 'module'
import { cspNonce } from './src/plugins/cspNonce.ts'

// optional circular-require-friendly import for optional plugins
const require = createRequire(import.meta.url)
let visualizer = null
try {
  visualizer = require('rollup-plugin-visualizer').visualizer
} catch (e) {
  // visualizer is optional; continue if not installed
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    cspNonce(),
    VitePWA({
      strategies: 'injectManifest',
      srcDir: 'src',
      filename: 'sw.js',
      registerType: 'autoUpdate',
      // Disable automatic injection of the register script so we can supply a safer registration
      injectRegister: null,
      includeAssets: ['psymind.svg'],
      manifest: {
        name: 'PsyMind AI',
        short_name: 'PsyMind',
        description: 'Seu assistente de saúde mental',
        theme_color: '#ffffff',
        icons: [
          {
            src: 'psymind.svg',
            sizes: '192x192 512x512',
            type: 'image/svg+xml',
            purpose: 'any maskable'
          }
        ],
      },
      workbox: {
        // Optimize precache: exclude large assets and development files
        globPatterns: [
          '**/*.{js,css,html,ico,png,svg,woff2}',
        ],
        // Exclude large files from precache to reduce initial load
        globIgnores: [
          '**/stats.html', // Build analyzer output
          '**/*-legacy.*', // Legacy browser chunks
          '**/sw.js.map', // Source maps
        ],
        // Runtime caching for dynamic assets
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
              },
              cacheKeyWillBeUsed: async ({ request }) => {
                return `${request.url}?v=1` // Cache-busting for font updates
              },
            },
          },
        ],
      },
    }),
    visualizer ? visualizer({
      filename: 'dist/stats.html',
      open: false,
      gzipSize: true,
      brotliSize: true
    }) : null
  ].filter(Boolean),
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['src/setupTests.ts'],
  },
  server: {
    headers: {
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
      'X-Frame-Options': 'DENY',
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'credentialless',
      // CSP will be set by the cspNonce plugin
    },
  },
  preview: {
    headers: {
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
      'X-Frame-Options': 'DENY',
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Cross-Origin-Opener-Policy': 'same-origin',
      // COEP intentionally omitted from preview — it blocks Lighthouse external resource loading
    },
  },
  // Ensure certain i18n libs are pre-bundled / not externalized by SSR/PWA builds
  optimizeDeps: {
    include: ['react-i18next', 'i18next'],
  },
  ssr: {
    noExternal: ['react-i18next', 'i18next'],
  },
  build: {
    target: 'esnext',
    // 'hidden' generates source maps for error tracking without linking them
    // from the minified output — keeps Lighthouse happy and files truly minified
    sourcemap: 'hidden',
    modulePreload: {
      polyfill: true
    },
    rollupOptions: {
      onwarn(warning, warn) {
        // Suppress warning about statically imported modules being in the dynamic import glob
        if (warning.message.includes('dynamic import will not move module into another chunk')) {
          return;
        }
        warn(warning);
      },
      // Optional visualizer plugin - only active if devDependency is installed
      plugins: [
        visualizer &&
          visualizer({ filename: 'dist/stats.html', template: 'treemap', gzipSize: true }),
      ].filter(Boolean),
      output: {
        // Preload critical chunks for better FCP/LCP
        manualChunks(id) {
          // Core React ecosystem — largest chunk, loaded first
          if (
            id.includes('node_modules/react/') ||
            id.includes('node_modules/react-dom/') ||
            id.includes('node_modules/react-router-dom/') ||
            id.includes('node_modules/react-router/') ||
            id.includes('node_modules/react-error-boundary/') ||
            id.includes('node_modules/scheduler/')
          ) {
            return 'core-vendor'
          }

          // Main App Shell & Chat Logic — group together to avoid chaining
          if (
            id.includes('src/pages/ChatPage') ||
            id.includes('src/components/chat/MessageList') ||
            id.includes('src/components/layout/Header.tsx') ||
            id.includes('src/components/layout/Sidebar.tsx') ||
            id.includes('src/components/chat/InputArea')
          ) {
            return 'chat-core'
          }

          // Heavy dynamic libraries - move to dedicated chunks
          if (id.includes('node_modules/react-markdown/') || id.includes('node_modules/remark') || id.includes('node_modules/rehype')) {
            return 'markdown-vendor'
          }
          if (id.includes('node_modules/@google/genai/')) {
            return 'genai-vendor'
          }
          if (id.includes('node_modules/prismjs/')) {
            return 'prism-vendor'
          }
          if (id.includes('node_modules/framer-motion/')) {
            return 'motion-vendor'
          }
          if (id.includes('node_modules/zod/')) {
            return 'zod-vendor'
          }
          if (id.includes('node_modules/sonner/')) {
            return 'sonner-vendor'
          }
          
          // Let Vite handle the rest of node_modules automatically
          // This avoids the "misc-vendor" bloat on initial load
        },
      },
    },
    chunkSizeWarningLimit: 400,
    // Enhanced CSS optimization for LCP
    cssCodeSplit: true,
    cssMinify: true,
  },
})
