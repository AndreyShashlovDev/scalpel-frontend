export abstract class LoginPageRouter {

  public abstract openStrategiesPage(): void

  public abstract openDemoPage(): void

  public abstract openJoinTelegramBot(joinCode: string): void
}
