/* ==========================================================================
 * BOOK THREAD 0.2  ThemeProvider   (Chapter 0: App start and layout)
 * File: src/contexts/ThemeProvider.tsx
 *
 * Remembers light / dark mode and puts the `dark` class on <html>, so every `dark:` Tailwind class in the app
 * switches.
 *
 * CONTEXT PROVIDER - shares data with every component below it, renders no HTML of its own.
 *
 * Used by: 0.1 main, 0.6.2.1 ThemeToggle
 * Table of contents: frontend/CODE_GUIDE.md
 * ========================================================================== */

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

//for dark mode
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('theme') as Theme | null;   //initial check, whether something save in local storage

    if (saved) return saved;

    //second check, what is browser preferenced theme
    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    //saving preferences theme in localStorage, so it does not change on every reload
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(t => (t === 'dark' ? 'light' : 'dark'));

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

// → Next in the book: 0.3 AuthProvider  (src/contexts/AuthProvider.tsx)
