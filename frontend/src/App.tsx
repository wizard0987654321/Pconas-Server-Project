import { useEffect } from 'react'
import './App.css'
import { getHealth, getRoomData, getTestMessage } from './services/api'
import ThemeToggle from './components/ThemeToggle';
import LanguageToggle from './components/LanguageToggle';
import { useTranslation } from 'react-i18next';


function App() {

  const { t } = useTranslation();

  useEffect(() => {
    getHealth()
      .then((data) => {
        console.log("API Response is aaeee:", data);
      })
      .catch((err) => {
        console.error("API erroria aee:", err)
      })
  }, []);

  useEffect(() => {
    getTestMessage()
      .then((data) => {
        console.log("API Response is testistvis:", data);
      })
      .catch((err) => {
        console.error("API erroria aee:", err)
      })
  }, []);

  useEffect(() => {
    getRoomData()
      .then((data) => {
        console.log("API Response is sqlistvis:", data);
      })
      .catch((err) => {
        console.error("API erroria aee:", err)
      })
  }, []);

  return (
    <>
      <ThemeToggle />
      <LanguageToggle />
      <h1 className="text-blue-600 dark:text-red-600">This is Heading</h1>
      <p>{t('test.testWord')}</p>
    </>
  )
}

export default App
