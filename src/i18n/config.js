import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import resourcesToBackend from 'i18next-resources-to-backend'

// Eagerly import critical Portuguese namespaces to prevent NO_LCP / Total Blocking Time failures from Suspense
import ptLanding from './locales/pt/landing.json'
import ptTranslation from './locales/pt/translation.json'
import enLanding from './locales/en/landing.json'
import enTranslation from './locales/en/translation.json'

const fallbackLanguage = 'pt'
const localeLoaders = import.meta.glob('./locales/*/*.json')

const bundledResources = {
  pt: {
    landing: ptLanding,
    translation: ptTranslation,
  },
  en: {
    landing: enLanding,
    translation: enTranslation,
  },
}

const getLanguageCandidates = (language) => {
  const normalizedLanguage = language || fallbackLanguage
  const baseLanguage = normalizedLanguage.split('-')[0]

  return [...new Set([normalizedLanguage, baseLanguage, fallbackLanguage])]
}

const loadNamespaceResource = async (language, namespace) => {
  for (const candidateLanguage of getLanguageCandidates(language)) {
    const bundledResource = bundledResources[candidateLanguage]?.[namespace]
    if (bundledResource) return bundledResource

    const resourcePath = `./locales/${candidateLanguage}/${namespace}.json`
    const loadResource = localeLoaders[resourcePath]
    if (loadResource) {
      const resource = await loadResource()
      return resource.default ?? resource
    }
  }

  return {}
}


/**
 * i18n Configuration — Senior Architecture
 *
 * Strategy: lazy-load ALL translation JSON files on demand via i18next-resources-to-backend.
 * This removes ALL translation JSONs from the initial bundle (~200KB uncompressed),
 * loading only the active language's files asynchronously after the app boots.
 *
 * Namespaces:
 *   - translation: merged default namespace (backward-compatible key resolution)
 *   - chat, landing, learning, dashboard, tools, support, quotes, kindness, schedule: domain-specific
 */
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .use(
    resourcesToBackend((language, namespace) => {
      return loadNamespaceResource(language, namespace)
    }),
  )
  .init({
    // Preload critical local resources immediately so Suspense is skipped for Portuguese
    partialBundledLanguages: true,
    resources: bundledResources,
    // Namespaces to load eagerly on startup
    ns: [
      'translation',
      'chat',
      'landing',
      'learning',
      'dashboard',
      'tools',
      'support',
      'quotes',
      'kindness',
      'schedule',
      'reflections',
      'mood_tracker',
    ],
    defaultNS: 'translation',
    fallbackNS: ['translation', 'schedule'],
    fallbackLng: fallbackLanguage,
    supportedLngs: ['pt', 'en', 'es', 'fr', 'de', 'it', 'ja', 'ko', 'zh', 'zh-TW', 'ru', 'ar', 'fa', 'ur', 'hi', 'la'],
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['querystring', 'localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    },
    // All translations are lazy-loaded — React Suspense handles loading states
  })

export default i18n
