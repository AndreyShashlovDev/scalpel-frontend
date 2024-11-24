import { lazy, Suspense } from 'react'
import { createMemoryRouter } from 'react-router-dom'
import { EntrypointView } from './EntrypointView.tsx'
import ErrorBoundary from './ErrorBoundary.tsx'
import { PageNotLoadedView } from './PageNotLoadedView.tsx'

const LoginPageView = lazy(() => import('../../feature/login/presentation/LoginPageView.tsx'))
const StrategiesPageView = lazy(() => import('../../feature/strategies/presentation/StrategiesPageView.tsx'))
const CreateStrategyPageView = lazy(() => import('../../feature/create-strategy/presentation/CreateStrategyPageView.tsx')
  .catch(e => {
    console.error(e)
    throw e
  }))
const WalletsPageView = lazy(() => import('../../feature/wallet/presentation/WalletPageView.tsx'))

export const AppRouting = createMemoryRouter(
  [
    {
      path: '*',
      element: <PageNotLoadedView />
    },
    {
      path: '/',
      element:
        <ErrorBoundary fallback={<PageNotLoadedView />}>
        <Suspense fallback={<EntrypointView />}>
          <LoginPageView key={'login-page'} />
        </Suspense>
      </ErrorBoundary>
      ,
    },
    {
      path: '/strategies',
      element:
        <ErrorBoundary fallback={<PageNotLoadedView />}>
        <Suspense fallback={<EntrypointView />}>
          <StrategiesPageView key={'strategies-page'} />
        </Suspense>
      </ErrorBoundary>
      ,
    },
    {
      path: '/create-strategy',
      element:
        <ErrorBoundary fallback={<PageNotLoadedView />}>
        <Suspense fallback={<EntrypointView />}>
          <CreateStrategyPageView key={'create-strategy-page'} />
        </Suspense>
      </ErrorBoundary>
      ,
    },
    {
      path: '/wallets',
      element:
        <ErrorBoundary fallback={<PageNotLoadedView />}>
        <Suspense fallback={<EntrypointView />}>
          <WalletsPageView key={'wallets-page'} />
        </Suspense>
      </ErrorBoundary>
      ,
    },
  ],
)
