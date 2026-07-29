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