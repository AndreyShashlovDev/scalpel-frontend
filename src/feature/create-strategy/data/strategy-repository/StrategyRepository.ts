import { CreateScalpelStrategyRequest } from '../model/CreateStrategyRequest.ts'

export type StrategyRequest = CreateScalpelStrategyRequest

export abstract class StrategyRepository {

  public abstract createStrategy(strategy: StrategyRequest): Promise<void>
}
