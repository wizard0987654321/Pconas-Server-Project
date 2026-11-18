/* ==========================================================================
 * BOOK THREAD 0.6.2.2  LanguageToggle   (Chapter 0: App start and layout)
 * File: src/components/toggleButtons/LanguageToggle.tsx
 *
 * Button switching between English and German (uses i18n 0.4).
 *
 * Used by: 0.6.2 Header
 * Table of contents: frontend/CODE_GUIDE.md
 * ========================================================================== */

import { useTranslation } from 'react-i18next';

export default function LanguageToggle() {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const next = i18n.language === 'en' ? 'de' : 'en';
    i18n.changeLanguage(next);
  };

  return (
    <button
      onClick={toggleLanguage}
      className="p-2 rounded-md bg-gray-100 text-[#111827] dark:bg-gray-800 dark:text-[#F9FAFB] cursor-pointer text-2xl"
    >
      {i18n.language === 'en' ? 'DE' : 'EN'}
    </button>
  );
}

// → Next in the book: 0.6.3 DesktopSidebar  (src/components/sidebars/DesktopSidebar.tsx)
