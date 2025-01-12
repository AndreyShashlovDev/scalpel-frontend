import { CreateScalpelStrategySimulationRequest } from './CreateScalpelStrategySimulationRequest.ts'

export class SimulationRequest {

  public readonly strategy: CreateScalpelStrategySimulationRequest

  constructor(strategy: CreateScalpelStrategySimulationRequest) {
    this.strategy = strategy
  }
}
