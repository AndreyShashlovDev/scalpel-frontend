import StrategiesFilter from '../domain/model/StrategiesFilter.ts'

export abstract class StrategyPageRouter {

  public abstract openSwapsDialog(strategyHash: string): void

  public abstract openLogsDialog(strategyHash: string): void

  public abstract openDeleteDialog(strategyHash: string): void

  public abstract openAnalyticsDialog(strategyHash: string): void

  public abstract openForceExecuteDialog(strategyHash: string): void

  public abstract openStrategyFilterDialog(filter: StrategiesFilter): void
}
