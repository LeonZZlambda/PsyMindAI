import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import resourcesToBackend from 'i18next-resources-to-backend'

// Eagerly import critical Portuguese namespaces to prevent NO_LCP / Total Blocking Time failures from Suspense
import ptLanding from './locales/pt/landing.json'
import ptTranslation from './locales/pt/translation.json'
import enLanding from './locales/en/landing.json'
import enTranslation from './locales/en/translation.json'


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
      return import(`./locales/${language}/${namespace}.json`)
    }),
  )
  .init({
    // Preload critical local resources immediately so Suspense is skipped for Portuguese
    partialBundledLanguages: true,
    resources: {
      pt: {
        landing: ptLanding,
        translation: ptTranslation
      },
      en: {
        landing: enLanding,
        translation: enTranslation
      }
    },
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
    fallbackLng: 'pt',
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
