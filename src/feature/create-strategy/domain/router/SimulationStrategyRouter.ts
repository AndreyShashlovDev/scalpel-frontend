import { ApplicationRouter } from '../../../../common/router/domain/ApplicationRouter.ts'
import { CreateStrategyRouter } from './CreateStrategyRouter.ts'

export class SimulationStrategyRouter extends CreateStrategyRouter {

  constructor(private readonly appRouter: ApplicationRouter) {
    super()
  }

  public openStrategiesPage(): void {
    this.appRouter.openSimulationPage()
  }
}
