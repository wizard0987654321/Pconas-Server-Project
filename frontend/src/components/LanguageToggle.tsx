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
      className="p-2 rounded-md bg-gray-100 dark:bg-gray-800 cursor-pointer text-2xl"
    >
      {i18n.language === 'en' ? '🇩🇪' : '🇬🇧'}
    </button>
  );
}