import { Singleton } from '../../../utils/di-core/decorator/decorators.ts'
import { ApplicationRouter, RouterPath } from './ApplicationRouter.ts'

@Singleton()
export class ApplicationRouterImpl extends ApplicationRouter {

  constructor() {
    super()
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
