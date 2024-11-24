import { BasicRouter } from './BasicRouter.ts'

export abstract class ApplicationRouter extends BasicRouter {

  public abstract openLoginPage(): void

  public abstract openStrategiesPage(): void

  public abstract openCreateStrategyPage(): void

  public abstract openWalletsPage(): void
}
