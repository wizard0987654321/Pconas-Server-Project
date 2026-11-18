/* ==========================================================================
 * BOOK THREAD 0.4  config   (Chapter 0: App start and layout)
 * File: src/i18n/config.ts
 *
 * Sets up i18next with the English and German texts (i18n/en.json, i18n/de.json). Every t("...") call in the
 * app reads its text from there.
 *
 * HELPER - plain functions / settings, no React, renders no HTML.
 *
 * Table of contents: frontend/CODE_GUIDE.md
 * ========================================================================== */

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import en from './en.json';
import de from './de.json';

//i18n for 2 language setup, automatic translation, easily extendable
//tranlastions located in the siblin de.json and en.json folders

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      de: { translation: de },
    },
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, 
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });

export default i18n;

// → Next in the book: 0.5 routes  (src/routes.tsx)
