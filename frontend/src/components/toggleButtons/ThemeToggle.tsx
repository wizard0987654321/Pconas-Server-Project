import { useTheme } from '../../contexts/ThemeProvider'

export default function ThemeToggle() {

  const { theme, toggleTheme } = useTheme()

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