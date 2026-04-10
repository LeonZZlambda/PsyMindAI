## Performance & A11y Improvements (suggested changes)

This file lists actionable improvements we added or recommend for the project.

1) TypeScript strictness
- `tsconfig.json` already has `strict: true`.
- Added `npm run type-check` script and CI step to enforce `tsc --noEmit` on PRs.

2) Bundle analysis & chunking
- Vite manualChunks refined in `vite.config.js` to split `vendor.react`, `vendor.router`, `vendor.prism`, `vendor.i18n`, and `vendor.ui` for better caching.
- Optional bundle visualizer: install `rollup-plugin-visualizer` and run `npm run analyze` (the config will include visualizer if installed and generate `dist/stats.html`).

3) Remove unused CSS/JS
- Added `postcss.config.cjs` with optional `@fullhuman/postcss-purgecss` plugin for production builds. Install `autoprefixer` and `@fullhuman/postcss-purgecss` and test production build to prune unused styles.

4) Images modern formats
- Recommendation: convert images in `src/assets/` to WebP/AVIF with a CLI (Squoosh, sharp, or imagemin) and add `srcset`/`sizes` attributes in image components.

5) Cache & compression
- Ensure hosting config (Vercel/Netlify/Cloud Run) sets long `Cache-Control` for static assets, and enables Brotli/Gzip compression. Add `_headers` or platform-specific config for caching when deploying.

6) Accessibility (A11y)
- `BaseModal.jsx` includes focus trapping, `role="dialog"`, `aria-modal="true"`, and focus restoration — reviewed.
- Add automated checks in CI: `axe-core` or `pa11y-ci` against preview builds.

7) Next steps
- Install optional dev dependencies: `rollup-plugin-visualizer`, `@fullhuman/postcss-purgecss`, `autoprefixer`.
- Run a production build and inspect `dist/stats.html` to tune `manualChunks` further.
- Add Lighthouse CI and automated a11y checks in CI.
