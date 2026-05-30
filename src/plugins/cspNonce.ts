import { Plugin } from 'vite'
import { randomBytes } from 'node:crypto'
import { writeFileSync, readFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'

export function cspNonce(): Plugin {
  const nonceFile = join(process.cwd(), 'dist', '.csp-nonce')
  let devNonce = '' // Nonce for dev server - generated once at startup

  return {
    name: 'csp-nonce',
    configureServer(server) {
      // Generate nonce once for entire dev session
      devNonce = randomBytes(16).toString('base64')

      // Set CSP header with per-request nonce for development
      server.middlewares.use((req, res, next) => {
        res.setHeader(
          'Content-Security-Policy',
          `base-uri 'self'; upgrade-insecure-requests; default-src 'self'; script-src 'self' 'unsafe-inline' 'nonce-${devNonce}'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://generativelanguage.googleapis.com https://fonts.googleapis.com https://fonts.gstatic.com; frame-ancestors 'none'; require-trusted-types-for 'script'; trusted-types default goog#html vue dompurify 'allow-duplicates';`,
        )
        next()
      })
    },
    configurePreviewServer(server) {
      // Read nonce from file generated during build
      let productionNonce = 'fallback-nonce'
      try {
        if (existsSync(nonceFile)) {
          productionNonce = readFileSync(nonceFile, 'utf-8').trim()
        }
      } catch (e) {
        console.warn('Could not read CSP nonce file, using fallback')
      }

      // Set CSP header with the nonce from build
      server.middlewares.use((req, res, next) => {
        res.setHeader(
          'Content-Security-Policy',
          `base-uri 'self'; upgrade-insecure-requests; default-src 'self'; script-src 'self' 'unsafe-inline' 'nonce-${productionNonce}'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://generativelanguage.googleapis.com https://fonts.googleapis.com https://fonts.gstatic.com; frame-ancestors 'none'; require-trusted-types-for 'script'; trusted-types default goog#html vue dompurify 'allow-duplicates';`,
        )
        next()
      })
    },
    generateBundle(options, bundle) {
      // Generate and save nonce for production build
      const nonce = randomBytes(16).toString('base64')
      try {
        writeFileSync(nonceFile, nonce, 'utf-8')
      } catch (e) {
        console.warn('Could not write CSP nonce file')
      }
    },
    transformIndexHtml(html, ctx) {
      // Use production nonce for builds, dev nonce generated at server startup
      const isDevelopment = ctx.bundle === undefined
      let nonce: string

      if (isDevelopment) {
        // Use the nonce generated at dev server startup
        nonce = devNonce || randomBytes(16).toString('base64')
      } else {
        // For production build, read from file or generate new
        try {
          if (existsSync(nonceFile)) {
            nonce = readFileSync(nonceFile, 'utf-8').trim()
          } else {
            nonce = randomBytes(16).toString('base64')
            writeFileSync(nonceFile, nonce, 'utf-8')
          }
        } catch (e) {
          nonce = randomBytes(16).toString('base64')
        }
      }

      // Use unsafe-inline for styles in all modes to handle Vite's dynamic injection
      const cspContent = `base-uri 'self'; upgrade-insecure-requests; default-src 'self'; script-src 'self' 'unsafe-inline' 'nonce-${nonce}'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://generativelanguage.googleapis.com https://fonts.googleapis.com https://fonts.gstatic.com; require-trusted-types-for 'script'; trusted-types default goog#html vue dompurify 'allow-duplicates';`

      // Replace the CSP meta tag
      html = html.replace(
        /<meta\s+http-equiv="Content-Security-Policy"[^>]*>/,
        `<meta http-equiv="Content-Security-Policy" content="${cspContent}">`,
      )

      // Add nonce to ALL inline scripts (including those with type="module")
      html = html.replace(/<script(?![^>]*\bsrc\b)([^>]*)>/g, `<script nonce="${nonce}"$1>`)

      // Add nonce to inline styles
      html = html.replace(/<style([^>]*)>/g, `<style nonce="${nonce}"$1>`)

      return html
    },
  }
}
