import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translations
import ptTranslation from './locales/pt/translation.json';
import enTranslation from './locales/en/translation.json';
import ptQuotes from './locales/pt/quotes.json';
import enQuotes from './locales/en/quotes.json';
import ptKindness from './locales/pt/kindness.json';
import enKindness from './locales/en/kindness.json';
import ptLanding from './locales/pt/landing.json';
import enLanding from './locales/en/landing.json';
import ptLearning from './locales/pt/learning.json';
import enLearning from './locales/en/learning.json';
import ptChat from './locales/pt/chat.json';
import enChat from './locales/en/chat.json';
import ptDashboard from './locales/pt/dashboard.json';
import enDashboard from './locales/en/dashboard.json';
import ptTools from './locales/pt/tools.json';
import enTools from './locales/en/tools.json';
import ptSupport from './locales/pt/support.json';
import enSupport from './locales/en/support.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      pt: {
        translation: {
          ...ptTranslation,
          ...ptChat,
          ...ptLanding,
          ...ptLearning,
          ...ptDashboard,
          ...ptTools,
          ...ptSupport,
          quotes: ptQuotes, // quotes is handled specifically
          kindness: ptKindness, // kindness is handled specifically
        },
        chat: ptChat,
        landing: ptLanding,
        learning: ptLearning,
        dashboard: ptDashboard,
        tools: ptTools,
        support: ptSupport,
        quotes: ptQuotes,
        kindness: ptKindness,
      },
      en: {
        translation: {
          ...enTranslation,
          ...enChat,
          ...enLanding,
          ...enLearning,
          ...enDashboard,
          ...enTools,
          ...enSupport,
          quotes: enQuotes,
          kindness: enKindness,
        },
        chat: enChat,
        landing: enLanding,
        learning: enLearning,
        dashboard: enDashboard,
        tools: enTools,
        support: enSupport,
        quotes: enQuotes,
        kindness: enKindness,
      },
    },
    fallbackLng: 'pt',
    supportedLngs: ['pt', 'en'],
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['querystring', 'localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    }
  });

export default i18n;
