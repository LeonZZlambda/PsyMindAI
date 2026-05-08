import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import resourcesToBackend from 'i18next-resources-to-backend'
import pt from './locales/pt/schedule.json'
import en from './locales/en/schedule.json'
import es from './locales/es/schedule.json'
import fr from './locales/fr/schedule.json'
import de from './locales/de/schedule.json'
import it from './locales/it/schedule.json'
import ja from './locales/ja/schedule.json'
import ko from './locales/ko/schedule.json'
import zh from './locales/zh/schedule.json'
import zhTW from './locales/zh-TW/schedule.json'
import ru from './locales/ru/schedule.json'
import ar from './locales/ar/schedule.json'
import hi from './locales/hi/schedule.json'
import la from './locales/la/schedule.json'

/**
 * i18n Configuration — Senior Architecture
 *
 * Strategy: lazy-load translation JSON files on demand via i18next-resources-to-backend.
 * This removes ALL translation JSONs from the initial bundle (~200KB uncompressed),
 * loading only the active language's files asynchronously after the app boots.
 *
 * Namespaces:
 *   - translation: merged default namespace (backward-compatible key resolution)
 *   - chat, landing, learning, dashboard, tools, support, quotes, kindness: domain-specific
 */
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .use(
    resourcesToBackend((language, namespace) => {
      if (namespace === 'schedule') {
        // Schedule translations are bundled
        return Promise.resolve(null)
      }
      return import(`./locales/${language}/${namespace}.json`)
    }),
  )
  .init({
    resources: {
      pt: { schedule: pt },
      en: { schedule: en },
      es: { schedule: es },
      fr: { schedule: fr },
      de: { schedule: de },
      it: { schedule: it },
      ja: { schedule: ja },
      ko: { schedule: ko },
      zh: { schedule: zh },
      'zh-TW': { schedule: zhTW },
      ru: { schedule: ru },
      ar: { schedule: ar },
      hi: { schedule: hi },
      la: { schedule: la },
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
    ],
    defaultNS: 'translation',
    fallbackNS: ['translation', 'schedule'],
    fallbackLng: 'pt',
    supportedLngs: ['pt', 'en', 'es', 'fr', 'de', 'it', 'ja', 'ko', 'zh', 'zh-TW', 'ru', 'ar', 'hi', 'la'],
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['querystring', 'localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    },
    // Don't wait for all namespaces before rendering — React Suspense handles this
    partialBundledLanguages: true,
    preload: ['pt'], // Preload Portuguese
  })

export default i18n
