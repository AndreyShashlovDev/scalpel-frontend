import { lazy, Suspense } from 'react'
import { createMemoryRouter } from 'react-router-dom'
import { CreateStrategyInjection } from '../../feature/create-strategy/domain/CreateStrategyInjection.ts'
import { EntrypointView } from './EntrypointView.tsx'
import ErrorBoundary from './ErrorBoundary.tsx'
import { PageNotLoadedView } from './PageNotLoadedView.tsx'

const LoginPageView = lazy(() => import('../../feature/login/presentation/LoginPageView.tsx'))
const StrategiesPageView = lazy(() => import('../../feature/strategies/presentation/StrategiesPageView.tsx'))
const CreateStrategyPageView = lazy(() => import('../../feature/create-strategy/presentation/CreateStrategyPageView.tsx'))
const WalletsPageView = lazy(() => import('../../feature/wallet/presentation/WalletPageView.tsx'))
const TransactionsPageView = lazy(() => import('../../feature/transaction/presentation/TransactionPageView.tsx'))
const SimulationPageView = lazy(() => import('../../feature/simulator/presentation/SimulationPageView.tsx'))

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
          <CreateStrategyPageView
            key={'create-strategy-page'}
            invokeInject={CreateStrategyInjection}
            hasHeader={true}
          />
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
    {
      path: '/transactions',
      element:
        <ErrorBoundary fallback={<PageNotLoadedView />}>
        <Suspense fallback={<EntrypointView />}>
          <TransactionsPageView key={'transactions-page'} />
        </Suspense>
      </ErrorBoundary>
      ,
    },
    {
      path: '/simulation',
      element:
        <ErrorBoundary fallback={<PageNotLoadedView />}>
        <Suspense fallback={<EntrypointView />}>
          <SimulationPageView key={'simulation-page'} />
        </Suspense>
      </ErrorBoundary>
      ,
    },
  ],
)
