/* ==========================================================================
 * BOOK THREAD 0.6.2.1  ThemeToggle   (Chapter 0: App start and layout)
 * File: src/components/toggleButtons/ThemeToggle.tsx
 *
 * Button switching between light and dark mode (uses ThemeProvider 0.2).
 *
 * Used by: 0.6.2 Header
 * Uses: 0.2 ThemeProvider
 * Table of contents: frontend/CODE_GUIDE.md
 * ========================================================================== */

import { useTheme } from '../../contexts/ThemeProvider' // 0.2 ThemeProvider

export default function ThemeToggle() {

  const { theme, toggleTheme } = useTheme() // 0.2 useTheme

  return (
    <button
      onClick={toggleTheme}
      className="py-2.5 px-2 rounded-md bg-gray-100 text-[#111827] dark:bg-gray-800 dark:text-[#F9FAFB] cursor-pointer"
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? '☀️' : '🌙'}
    </button>
  )
}

// → Next in the book: 0.6.2.2 LanguageToggle  (src/components/toggleButtons/LanguageToggle.tsx)
