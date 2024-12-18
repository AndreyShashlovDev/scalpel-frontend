import StrategiesFilter from '../domain/model/StrategiesFilter.ts'

export abstract class StrategyPageRouter {

  public abstract openSwaps(strategyHash: string): void

  public abstract openLogs(strategyHash: string): void

  public abstract openArchiveOrder(strategyHash: string, resultId: number): void

  public abstract openAnalytics(strategyHash: string): void

  public abstract openForceExecute(strategyHash: string, resultId: number): void

  public abstract openStrategyFilter(filter: StrategiesFilter): void

  public abstract openDeleteOrder(strategyHash: string, resultId: number): void
}
