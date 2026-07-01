import { useTheme } from '../contexts/ThemeProvider'

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-md bg-gray-100 dark:bg-gray-800 cursor-pointer"
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? '🌙' : '☀️'}
    </button>
  )
}