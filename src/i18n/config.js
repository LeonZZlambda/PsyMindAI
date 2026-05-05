import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import resourcesToBackend from 'i18next-resources-to-backend';

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
    resourcesToBackend(
      (language, namespace) =>
        import(`./locales/${language}/${namespace}.json`)
    )
  )
  .init({
    // Namespaces to load eagerly on startup
    ns: ['translation', 'chat', 'landing', 'learning', 'dashboard', 'tools', 'support', 'quotes', 'kindness'],
    defaultNS: 'translation',
    fallbackNS: ['translation'],
    fallbackLng: 'pt',
    supportedLngs: ['pt', 'en'],
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['querystring', 'localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    },
    // Don't wait for all namespaces before rendering — React Suspense handles this
    partialBundledLanguages: true,
  });

export default i18n;


