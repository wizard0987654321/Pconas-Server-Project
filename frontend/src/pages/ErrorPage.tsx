import { useTranslation } from 'react-i18next';


function ErrorPage() {

    const { t } = useTranslation()

    return (
        <>
            <h1 className="text-blue-600 dark:text-red-600">This is Error Page</h1>
            <p>{t('error.errorMessage')}</p>
        </>
    )
}

export default ErrorPage
