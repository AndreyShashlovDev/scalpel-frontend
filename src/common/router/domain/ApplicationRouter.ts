import { AnalyticsPageArgs } from '../../../feature/analytics/domain/AnalyticsPagePresenter.ts'
import { LogsPageArgs } from '../../../feature/logs/domain/LogsPagePresenter.ts'
import { SwapPageArgs } from '../../../feature/swap/domain/SwapPagePresenter.ts'
import { BasicRouter } from './BasicRouter.ts'

export class RouterPath<T extends object> {

  public static readonly Root = new RouterPath('/')
  public static readonly Login = new RouterPath('/login')
  public static readonly Orders = new RouterPath('/strategies')
  public static readonly OrderLogs = new RouterPath<LogsPageArgs>('/strategies/:strategyHash/logs')
  public static readonly OrderSwaps = new RouterPath<SwapPageArgs>('/strategies/:strategyHash/swaps')
  public static readonly OrderAnalytics = new RouterPath<AnalyticsPageArgs>('/strategies/:strategyHash/analytics')
  public static readonly CreateOrder = new RouterPath('/create-strategy')
  public static readonly Wallets = new RouterPath('/wallets')
  public static readonly Transactions = new RouterPath('/transactions')
  public static readonly Simulation = new RouterPath('/simulation')
  public static readonly Demo = new RouterPath('/demo')

  private readonly _paramNames: string[] = []
  public readonly params: { [K in keyof T]: K }

  constructor(readonly path: string) {
    const paramMatches = path.match(/:([\w]+)/g)

    this.params = new Proxy({} as { [K in keyof T]: K }, {
      get: (_, prop: string) => {
        if (this._paramNames.includes(prop)) {
          return prop.toString()
        }
        return ''
      }
    })

    if (paramMatches) {
      this._paramNames = paramMatches.map(match => match.substring(1))
    }
  }

  public buildPath(params?: T): string {
    if (!params) {
      return this.path
    }

    return Array.from(
      Object.entries(params))
      .reduce((previousValue, [key, value]) => previousValue.replace(':' + key, value.toString()), this.path)
  }
}

export abstract class ApplicationRouter extends BasicRouter {

  public abstract openLoginPage(): void

  public abstract openStrategiesPage(): void

  public abstract openCreateStrategyPage(): void

  public abstract openWalletsPage(): void

  public abstract openTransactionsPage(): void

  public abstract openSimulationPage(): void

  public abstract openDemoPage(): void

  public abstract openOrderSwaps(strategyHash: string): void

  public abstract openOrderLogs(strategyHash: string): void

  public abstract openOrderAnalytics(strategyHash: string): void
}
