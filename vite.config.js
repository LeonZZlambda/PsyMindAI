import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import { createRequire } from 'module'

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
  // Ensure certain i18n libs are pre-bundled / not externalized by SSR/PWA builds
  optimizeDeps: {
    include: ['react-i18next', 'i18next']
  },
  ssr: {
    noExternal: ['react-i18next', 'i18next']
  },
  plugins: [
    react(),
    VitePWA({
      strategies: 'injectManifest',
      srcDir: 'src',
      filename: 'sw.js',
      registerType: 'autoUpdate',
      injectRegister: 'script-defer',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: 'PsyMind AI',
        short_name: 'PsyMind',
        description: 'Seu assistente de saúde mental',
        theme_color: '#ffffff',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
  build: {
    target: 'esnext',
    sourcemap: false,
    rollupOptions: {
      // optional visualizer plugin - only active if devDependency is installed
      plugins: [
        visualizer && visualizer({ filename: 'dist/stats.html', template: 'treemap', gzipSize: true })
      ].filter(Boolean),
      output: {
        // finer-grained chunking for better caching and smaller vendor bundles
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react')) return 'vendor.react'
            if (id.includes('react-router-dom')) return 'vendor.router'
            if (id.includes('prismjs')) return 'vendor.prism'
            if (id.includes('i18next') || id.includes('react-i18next')) return 'vendor.i18n'
            if (id.includes('framer-motion') || id.includes('sonner')) return 'vendor.ui'
            if (id.includes('react-textarea-autosize') || id.includes('react-markdown')) return 'vendor.ui'
            return 'vendor'
          }
        }
      }
    },
    chunkSizeWarningLimit: 500
  }
})
