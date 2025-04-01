import { Inject, Injectable } from '@di-core/decorator/decorators.ts'
import { ApplicationRouter, RouterPath } from './ApplicationRouter.ts'
import { RouteStateManager } from './state-manager/RouteStateManager.ts'

@Injectable()
export class ApplicationRouterImpl extends ApplicationRouter {

  constructor(
    @Inject(RouteStateManager) private readonly stateManager: RouteStateManager
  ) {
    super()
  }

  public saveRouteState<T>(bundle: Readonly<T>): void {
    const current = this.stack[this.stack.length - 1]
    const prev = this.stack[this.stack.length - 2]

    if (!current.replace) {
      return this.stateManager.saveSate(prev.path, bundle)
    }
  }

  public restoreRouteState<T>(): Readonly<T> | undefined {
    return this.stateManager.getAndDelete(this.stack[this.stack.length - 1].path) as Readonly<T>
  }

  public openLoginPage(): void {
    this.navigateTo(RouterPath.Login.buildPath(), {replace: true})
  }

  public openStrategiesPage(): void {
    this.navigateTo(RouterPath.Orders.buildPath(), {replace: true})
  }

  public openCreateStrategyPage(): void {
    this.navigateTo(RouterPath.CreateOrder.buildPath(), {replace: true})
  }

  public openWalletsPage(): void {
    this.navigateTo(RouterPath.Wallets.buildPath(), {replace: true})
  }

  public openTransactionsPage(): void {
    this.navigateTo(RouterPath.Transactions.buildPath(), {replace: true})
  }

  public openSimulationPage(): void {
    this.navigateTo(RouterPath.Simulation.buildPath(), {replace: true})
  }

  public openDemoPage(): void {
    this.navigateTo(RouterPath.Demo.buildPath(), {replace: true})
  }

  public openOrderAnalytics(strategyHash: string): void {
    this.navigateTo(RouterPath.OrderAnalytics.buildPath({strategyHash}), {replace: false})
  }

  public openOrderLogs(strategyHash: string): void {
    this.navigateTo(RouterPath.OrderLogs.buildPath({strategyHash}), {replace: false})
  }

  public openOrderSwaps(strategyHash: string): void {
    this.navigateTo(RouterPath.OrderSwaps.buildPath({strategyHash}), {replace: false})
  }
}
