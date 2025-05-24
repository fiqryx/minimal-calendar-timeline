import { App } from '@/App.tsx'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Analytics } from '@vercel/analytics/next';
import { ThemeProvider } from '@/components/providers/theme-provider.tsx'
import '@/styles/index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
    <Analytics />
  </StrictMode>,
)
