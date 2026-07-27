import { useTranslation } from 'react-i18next';


function ErrorPage() {

    const { t } = useTranslation()

    return (
        <>
            <h1 className="text-blue-600 dark:text-[#F9FAFB]">{t('error.pageTitle')}</h1>
            <p className="text-[#111827] dark:text-[#F9FAFB]">{t('error.errorMessage')}</p>
        </>
    )
}

export default ErrorPage
