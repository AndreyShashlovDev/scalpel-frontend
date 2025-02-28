import { lazy, Suspense } from 'react'
import { createMemoryRouter } from 'react-router-dom'
import { CreateStrategyInjection } from '../../feature/create-strategy/domain/CreateStrategyInjection.ts'
import { LoginPageModule } from '../../feature/login/di/LoginPageModule.ts'
import { LoginPagePresenter } from '../../feature/login/domain/LoginPagePresenter.ts'
import { createLazyRoute } from '../../utils/arch/CreateLazyRouter.tsx'
import { EntrypointView } from './EntrypointView.tsx'
import ErrorBoundary from './ErrorBoundary.tsx'
import { PageNotLoadedView } from './PageNotLoadedView.tsx'

const SplashPageView = lazy(() => import('../../feature/splash/presentation/SplashPageView.tsx'))
const LoginPageView = lazy(() => import('../../feature/login/presentation/LoginPageView.tsx'))
const StrategiesPageView = lazy(() => import('../../feature/strategies/presentation/StrategiesPageView.tsx'))
const CreateStrategyPageView = lazy(() => import('../../feature/create-strategy/presentation/CreateStrategyPageView.tsx'))
const WalletsPageView = lazy(() => import('../../feature/wallet/presentation/WalletPageView.tsx'))
const TransactionsPageView = lazy(() => import('../../feature/transaction/presentation/TransactionPageView.tsx'))
const SimulationPageView = lazy(() => import('../../feature/simulator/presentation/SimulationPageView.tsx'))
const DemoPageView = lazy(() => import('../../feature/demo/presentation/DemoPageView.tsx'))

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
          <SplashPageView key={'splash-page'} />
        </Suspense>
      </ErrorBoundary>
      ,
    },
    createLazyRoute({
      path: '/login',
      moduleLoader: LoginPageModule,
      presenterType: LoginPagePresenter,
      component: LoginPageView
    }),
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
    {
      path: '/demo',
      element:
        <ErrorBoundary fallback={<PageNotLoadedView />}>
        <Suspense fallback={<EntrypointView />}>
          <DemoPageView key={'demo-page'} />
        </Suspense>
      </ErrorBoundary>
      ,
    },
  ],
)
