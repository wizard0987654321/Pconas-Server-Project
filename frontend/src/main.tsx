import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './pages/App.tsx'
import { ThemeProvider } from './contexts/ThemeProvider'
import './i18n/config'
import routes from './routes.tsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

const router = createBrowserRouter(routes);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  </StrictMode>,
)
