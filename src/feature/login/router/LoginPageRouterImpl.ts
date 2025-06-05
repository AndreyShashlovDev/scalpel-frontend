import { ApplicationRouter } from '../../../common/router/domain/ApplicationRouter.ts'
import { LoginPageRouter } from './LoginPageRouter.ts'

export class LoginPageRouterImpl extends LoginPageRouter {

  constructor(
    private readonly appRouter: ApplicationRouter,
  ) {
    super()
  }

  public openStrategiesPage(): void {
    this.appRouter.openStrategiesPage()
  }

  public openDemoPage(): void {
    this.appRouter.openDemoPage()
  }
}
