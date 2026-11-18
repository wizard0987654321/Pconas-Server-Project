/* ==========================================================================
 * BOOK THREAD 0.7  ErrorPage   (Chapter 0: App start and layout)
 * File: src/pages/ErrorPage.tsx
 *
 * Shown by the router when a URL doesn't exist or a page crashes.
 *
 * Used by: 0.5 routes
 * Table of contents: frontend/CODE_GUIDE.md
 * ========================================================================== */

import { useTranslation } from 'react-i18next';

//simple error page

function ErrorPage() {
    const { t } = useTranslation()

    return (
        <div className="min-h-screen flex flex-col items-center justify-center text-center font-mono">
            <h1 className="text-6xl font-bold text-[#EF4444] dark:text-[#EF4444]">
                {t('error.pageTitle')}
            </h1>
            <p className="mt-6 text-2xl text-[#EF4444] dark:text-[#EF4444]">
                {t('error.errorMessage')}
            </p>
        </div>
    )
}

export default ErrorPage

// → Next in the book: 1 Homepage  (src/pages/Homepage.tsx)
