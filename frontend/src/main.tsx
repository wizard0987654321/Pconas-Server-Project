/* ==========================================================================
 * BOOK THREAD 0.1  main   (Chapter 0: App start and layout)
 * File: src/main.tsx
 *
 * Starting point of the whole frontend. Creates the React root, wraps the app in ThemeProvider (0.2) and
 * AuthProvider (0.3), loads the translations (0.4) and starts the router with the routes (0.5).
 *
 * Uses: 0.2 ThemeProvider, 0.3 AuthProvider, 0.5 routes
 * Table of contents: frontend/CODE_GUIDE.md
 * ========================================================================== */

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { ThemeProvider } from './contexts/ThemeProvider' // 0.2 ThemeProvider
import { AuthProvider } from './contexts/AuthProvider' // 0.3 AuthProvider
import './i18n/config'
import routes from './routes.tsx' // 0.5 routes
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

const router = createBrowserRouter(routes);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>,
)

// → Next in the book: 0.2 ThemeProvider  (src/contexts/ThemeProvider.tsx)
