// PostCSS config with optional PurgeCSS for production builds.
// Plugins are required dynamically so CI/builds don't fail if the package
// isn't installed; install `autoprefixer` and `@fullhuman/postcss-purgecss`
// to enable full optimizations.
const plugins = []

try {
  const autoprefixer = require('autoprefixer')
  plugins.push(autoprefixer)
} catch (e) {
  // autoprefixer not installed; optional
}

if (process.env.NODE_ENV === 'production') {
  try {
    const purgecss = require('@fullhuman/postcss-purgecss')({
      content: ['./index.html', './src/**/*.{js,ts,jsx,tsx,html}'],
      defaultExtractor: (content) => content.match(/[\w-/:]+(?<!:)/g) || []
    })
    plugins.push(purgecss)
  } catch (e) {
    // purgecss not installed; optional
  }
}

module.exports = { plugins }
