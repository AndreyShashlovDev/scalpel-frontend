import { ModuleType } from 'flexdi'
import { createModuleRoute } from 'flexdi/react'
import { ComponentType, lazy, LazyExoticComponent } from 'react'
import { createMemoryRouter } from 'react-router-dom'
import { AnalyticsPageModule } from '../../feature/analytics/di/AnalyticsPageModule.ts'
import { CreateStrategyPageModule } from '../../feature/create-strategy/di/CreateStrategyPageModule.ts'
import { DemoPageModule } from '../../feature/demo/di/DemoPageModule.ts'
import { LoginPageModule } from '../../feature/login/di/LoginPageModule.ts'
import { LogsPageModule } from '../../feature/logs/di/LogsPageModule.ts'
import { SimulationPageModule } from '../../feature/simulator/di/SimulationPageModule.ts'
import { SplashPageModule } from '../../feature/splash/di/SplashPageModule.ts'
import { StrategiesPageModule } from '../../feature/strategies/di/StrategiesPageModule.ts'
import { SwapPageModule } from '../../feature/swap/di/SwapPageModule.ts'
import { TransactionsPageModule } from '../../feature/transaction/di/TransactionsPageModule.ts'
import { WalletPageModule } from '../../feature/wallet/di/WalletPageModule.ts'
import DefaultErrorBoundary from './DefaultErrorBoundary.tsx'
import { DefaultError } from './DefaultErrorView.tsx'
import { RouterPath } from './domain/ApplicationRouter.ts'
import { EntrypointView } from './EntrypointView.tsx'
import { PageNotLoadedView } from './PageNotLoadedView.tsx'

const SplashPageView = lazy(() => import('../../feature/splash/presentation/SplashPageView.tsx'))
const LoginPageView = lazy(() => import('../../feature/login/presentation/LoginPageView.tsx'))
const StrategiesPageView = lazy(() => import('../../feature/strategies/presentation/StrategiesPageView.tsx'))
const AnalyticsPageView = lazy(() => import('../../feature/analytics/presentation/AnalyticsPageView.tsx'))
const SwapsPageView = lazy(() => import('../../feature/swap/presentation/SwapPageView.tsx'))
const LogsPageView = lazy(() => import('../../feature/logs/presentation/LogsPageView.tsx'))
const CreateStrategyPageView = lazy(() => import('../../feature/create-strategy/presentation/CreateStrategyPageView.tsx'))
const WalletsPageView = lazy(() => import('../../feature/wallet/presentation/WalletPageView.tsx'))
const TransactionsPageView = lazy(() => import('../../feature/transaction/presentation/TransactionPageView.tsx'))
const SimulationPageView = lazy(() => import('../../feature/simulator/presentation/SimulationPageView.tsx'))
const DemoPageView = lazy(() => import('../../feature/demo/presentation/DemoPageView.tsx'))

const createAppRoute = (
  {
    route,
    feature,
    module
  }: { route: RouterPath<object>, feature: LazyExoticComponent<ComponentType<unknown>>, module: ModuleType }
) => createModuleRoute({
  path: route.path,
  module: module,
  Component: feature,
  ErrorBoundary: DefaultErrorBoundary,
  LoadingComponent: EntrypointView,
  ErrorComponent: DefaultError,
})

export const AppRouting = createMemoryRouter(
  [
    {
      path: '*',
      element: <PageNotLoadedView />
    },

    createAppRoute({
      route: RouterPath.Root,
      module: SplashPageModule,
      feature: SplashPageView,
    }),

    createAppRoute({
      route: RouterPath.Login,
      module: LoginPageModule,
      feature: LoginPageView,
    }),

    createAppRoute({
      route: RouterPath.Orders,
      module: StrategiesPageModule,
      feature: StrategiesPageView,
    }),

    createAppRoute({
      route: RouterPath.OrderAnalytics,
      module: AnalyticsPageModule,
      feature: AnalyticsPageView,
    }),

    createAppRoute({
      route: RouterPath.OrderSwaps,
      module: SwapPageModule,
      feature: SwapsPageView,
    }),

    createAppRoute({
      route: RouterPath.OrderLogs,
      module: LogsPageModule,
      feature: LogsPageView,
    }),

    createAppRoute({
      route: RouterPath.CreateOrder,
      module: CreateStrategyPageModule,
      feature: CreateStrategyPageView,
    }),

    createAppRoute({
      route: RouterPath.Wallets,
      module: WalletPageModule,
      feature: WalletsPageView,
    }),

    createAppRoute({
      route: RouterPath.Transactions,
      module: TransactionsPageModule,
      feature: TransactionsPageView,
    }),

    createAppRoute({
      route: RouterPath.Simulation,
      module: SimulationPageModule,
      feature: SimulationPageView,
    }),

    createAppRoute({
      route: RouterPath.Demo,
      module: DemoPageModule,
      feature: DemoPageView,
    }),
  ],
)
AppRouting.initialize()
