import { lazy } from 'react'
import { createMemoryRouter } from 'react-router-dom'
import { CreateStrategyPageModule } from '../../feature/create-strategy/di/CreateStrategyPageModule.ts'
import { DemoPageModule } from '../../feature/demo/di/DemoPageModule.ts'
import { LoginPageModule } from '../../feature/login/di/LoginPageModule.ts'
import { SimulationPageModule } from '../../feature/simulator/di/SimulationPageModule.ts'
import { SplashPageModule } from '../../feature/splash/di/SplashPageModule.ts'
import { StrategiesPageModule } from '../../feature/strategies/di/StrategiesPageModule.ts'
import { TransactionsPageModule } from '../../feature/transaction/di/TransactionsPageModule.ts'
import { WalletPageModule } from '../../feature/wallet/di/WalletPageModule.ts'
import { createModuleRoute } from '../../utils/di-core/react/router/ModuleRouter.tsx'
import { RouterPath } from './domain/ApplicationRouter.ts'
import { EntrypointView } from './EntrypointView.tsx'
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

    createModuleRoute({
      path: RouterPath.Root.path,
      module: SplashPageModule,
      component: SplashPageView,
      LoadingComponent: EntrypointView
    }),

    createModuleRoute({
      path: RouterPath.Login.path,
      module: LoginPageModule,
      component: LoginPageView,
      LoadingComponent: EntrypointView
    }),

    createModuleRoute({
      path: RouterPath.Orders.path,
      module: StrategiesPageModule,
      component: StrategiesPageView,
      LoadingComponent: EntrypointView
    }),

    createModuleRoute({
      path: RouterPath.CreateOrder.path,
      module: CreateStrategyPageModule,
      component: CreateStrategyPageView,
      LoadingComponent: EntrypointView
    }),

    createModuleRoute({
      path: RouterPath.Wallets.path,
      module: WalletPageModule,
      component: WalletsPageView,
      LoadingComponent: EntrypointView
    }),

    createModuleRoute({
      path: RouterPath.Transactions.path,
      module: TransactionsPageModule,
      component: TransactionsPageView,
      LoadingComponent: EntrypointView
    }),

    createModuleRoute({
      path: RouterPath.Simulation.path,
      module: SimulationPageModule,
      component: SimulationPageView,
      LoadingComponent: EntrypointView
    }),

    createModuleRoute({
      path: RouterPath.Demo.path,
      module: DemoPageModule,
      component: DemoPageView,
      LoadingComponent: EntrypointView
    }),
  ],
)
AppRouting.initialize()
