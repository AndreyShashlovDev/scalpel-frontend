import { BasicRouter } from './BasicRouter.ts'

export class RouterPath {

  public static readonly Root = new RouterPath('/')
  public static readonly Login = new RouterPath('/login')
  public static readonly Orders = new RouterPath('/strategies')
  public static readonly CreateOrder = new RouterPath('/create-strategy')
  public static readonly Wallets = new RouterPath('/wallets')
  public static readonly Transactions = new RouterPath('/transactions')
  public static readonly Simulation = new RouterPath('/simulation')
  public static readonly Demo = new RouterPath('/demo')

  public readonly path: string

  constructor(path: string) {
    this.path = path
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
}
