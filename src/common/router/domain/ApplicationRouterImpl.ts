import { ApplicationRouter } from './ApplicationRouter.ts'

export class ApplicationRouterImpl extends ApplicationRouter {

  constructor() {
    super()
  }

  public openLoginPage(): void {
    this.navigateTo('/', {replace: true})
  }

  public openStrategiesPage(): void {
    this.navigateTo('/strategies', {replace: true})
  }

  public openCreateStrategyPage(): void {
    this.navigateTo('/create-strategy', {replace: true})
  }

  public openWalletsPage(): void {
    this.navigateTo('/wallets', {replace: true})
  }

  public openTransactionsPage(): void {
    this.navigateTo('/transactions', {replace: true})
  }

  public openSimulationPage(): void {
    this.navigateTo('/simulation', {replace: true})
  }

  public openDemoPage(): void {
    this.navigateTo('/demo', {replace: true})
  }
}
