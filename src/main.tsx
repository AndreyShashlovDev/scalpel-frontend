import 'reflect-metadata'
import { ModuleLoader, RootModuleLoader } from 'flexdi/react'
import i18n, { InitOptions } from 'i18next'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './style/index.css'
import { initReactI18next } from 'react-i18next'
import { AppModule } from './AppModule.ts'
import { AppProvider } from './AppProvider.tsx'
import DefaultErrorBoundary from './common/router/DefaultErrorBoundary.tsx'
import { DefaultError } from './common/router/DefaultErrorView.tsx'
import { EntrypointView } from './common/router/EntrypointView.tsx'
import GTagAnalytics from './common/service/analytics/google/GTagAnalytics.tsx'
import { AppPageModule } from './feature/app/di/AppPageModule.ts'
import { App } from './feature/app/presentation/App.tsx'
import { AppThemeProvider } from './style/theme/AppThemeProvider.tsx'

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
    <AppThemeProvider>
      <RootModuleLoader
        module={AppModule}
        ErrorBoundary={DefaultErrorBoundary}
        LoadingComponent={DefaultError}
        ErrorComponent={DefaultError}
        enableStrictMode={process.env.NODE_ENV !== 'production'}
      >
        <AppProvider>
          <ModuleLoader
            module={AppPageModule}
            children={<App />}
            ErrorBoundary={DefaultErrorBoundary}
            LoadingComponent={EntrypointView}
            ErrorComponent={DefaultError}
          />
        </AppProvider>
      </RootModuleLoader>
    </AppThemeProvider>
  </StrictMode>,
)
