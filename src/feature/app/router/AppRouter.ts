export abstract class AppRouter {

  public abstract getCurrentPath(): string | undefined

  public abstract openLoginPage(): void

  public abstract openStrategiesPage(): void

  public abstract openCreateStrategyPage(): void

  public abstract openWalletsPage(): void

  public abstract openTransactionsPage(): void

  public abstract openSimulationPage(): void
}
