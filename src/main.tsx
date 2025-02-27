import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './style/index.css'
import { AppProvider } from './AppProvider.tsx'
import GTagAnalytics from './common/service/analytics/google/GTagAnalytics.tsx'
import App from './feature/app/presentation/App.tsx'
import { AppThemeProvider } from './style/theme/AppThemeProvider.tsx'
import './Injections.ts'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GTagAnalytics />
    <AppProvider>
      <AppThemeProvider>
        <App />
      </AppThemeProvider>
    </AppProvider>
  </StrictMode>,
)
