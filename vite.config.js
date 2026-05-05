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
  server: {
    headers: {
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
      'X-Frame-Options': 'DENY',
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'credentialless',
      'Content-Security-Policy':
        "upgrade-insecure-requests; default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://generativelanguage.googleapis.com https://fonts.googleapis.com https://fonts.gstatic.com; frame-ancestors 'none'; require-trusted-types-for 'script'; trusted-types default goog#html vue dompurify 'allow-duplicates';",
    },
  },
  preview: {
    headers: {
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
      'X-Frame-Options': 'DENY',
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'credentialless',
      'Content-Security-Policy':
        "upgrade-insecure-requests; default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://generativelanguage.googleapis.com https://fonts.googleapis.com https://fonts.gstatic.com; frame-ancestors 'none'; require-trusted-types-for 'script'; trusted-types default goog#html vue dompurify 'allow-duplicates';",
    },
  },
  // Ensure certain i18n libs are pre-bundled / not externalized by SSR/PWA builds
  optimizeDeps: {
    include: ['react-i18next', 'i18next'],
  },
  ssr: {
    noExternal: ['react-i18next', 'i18next'],
  },
  plugins: [
    react(),
    VitePWA({
      strategies: 'injectManifest',
      srcDir: 'src',
      filename: 'sw.js',
      registerType: 'autoUpdate',
      // Disable automatic injection of the register script so we can supply a safer registration
      injectRegister: null,
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
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
    }),
  ],
  build: {
    target: 'esnext',
    sourcemap: true,
    rollupOptions: {
      // Optional visualizer plugin - only active if devDependency is installed
      plugins: [
        visualizer &&
          visualizer({ filename: 'dist/stats.html', template: 'treemap', gzipSize: true }),
      ].filter(Boolean),
      output: {
        manualChunks(id) {
          // Google GenAI SDK — large, only needed when chat is active
          if (id.includes('node_modules/@google/genai/')) {
            return 'genai-vendor'
          }
          // React core — combine react and react-dom to avoid circular dependencies
          if (
            id.includes('node_modules/react/') ||
            id.includes('node_modules/react-dom/') ||
            id.includes('node_modules/react-router-dom/') ||
            id.includes('node_modules/react-router/') ||
            id.includes('node_modules/react-error-boundary/') ||
            id.includes('node_modules/scheduler/')
          ) {
            return 'react-vendor'
          }
          // Framer motion — heavy, isolated so it tree-shakes independently
          if (id.includes('node_modules/framer-motion/')) {
            return 'framer-motion'
          }
          // i18n core runtime (small, without JSON resources)
          if (
            id.includes('node_modules/i18next/') ||
            id.includes('node_modules/react-i18next/') ||
            id.includes('node_modules/i18next-browser-languagedetector/') ||
            id.includes('node_modules/i18next-resources-to-backend/')
          ) {
            return 'i18n-vendor'
          }
          // Markdown + syntax highlighting — only loaded in chat/modals
          if (
            id.includes('node_modules/react-markdown/') ||
            id.includes('node_modules/remark') ||
            id.includes('node_modules/rehype') ||
            id.includes('node_modules/unified') ||
            id.includes('node_modules/prismjs/')
          ) {
            return 'markdown-vendor'
          }
          // Zod — validation library, only used in chatService and study-dashboard
          if (id.includes('node_modules/zod/')) {
            return 'zod-vendor'
          }
          // Sonner — toast library, small but can be separate from initial bundle
          if (id.includes('node_modules/sonner/')) {
            return 'sonner-vendor'
          }
          // All remaining node_modules: dompurify, react-simple-code-editor, etc.
          if (id.includes('node_modules/')) {
            return 'misc-vendor'
          }
        },
      },
    },
    chunkSizeWarningLimit: 400,
  },
})
