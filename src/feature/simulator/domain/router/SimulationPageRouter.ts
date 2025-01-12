import { CreateStrategyRouter } from '../../../create-strategy/domain/router/CreateStrategyRouter.ts'

export abstract class SimulationPageRouter extends CreateStrategyRouter {

  public abstract openCreateSimulation(): void

  public abstract openDeleteSimulation(resultId: number | string, simulationId: number): void

  public abstract openWarnTooMuchInQueue(): void

  public abstract openWarnTooMuchSimulations(): void
}
