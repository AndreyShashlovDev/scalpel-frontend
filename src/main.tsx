import i18n, { InitOptions } from 'i18next'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './style/index.css'
import { initReactI18next } from 'react-i18next'
import { AppProvider } from './AppProvider.tsx'
import GTagAnalytics from './common/service/analytics/google/GTagAnalytics.tsx'
import { App } from './feature/app/presentation/App.tsx'
import { AppThemeProvider } from './style/theme/AppThemeProvider.tsx'
import './CoreModule.ts'

const res: InitOptions = {
  // the translations
  // (tip move them in a JSON file and import them,
  // or even better, manage them via a UI: https://react.i18next.com/guides/multiple-translation-files#manage-your-translations-with-a-management-gui)
  resources: {},
  lng: 'en',
  fallbackLng: 'en',

  interpolation: {
    escapeValue: false // react already safes from xss => https://www.i18next.com/translation-function/interpolation#unescape
  }
}

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init(res)

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
