import { Inject, Injectable } from '../../../utils/di-core/decorator/decorators.ts'
import StrategiesFilter from '../domain/model/StrategiesFilter.ts'
import { StrategyPageDialogProvider } from './StrategyPageDialogProvider.ts'
import { StrategyPageRouter } from './StrategyPageRouter.ts'

@Injectable()
export class StrategyPageRouterImpl extends StrategyPageRouter {

  constructor(
    @Inject(StrategyPageDialogProvider) private readonly dialogProvider: StrategyPageDialogProvider,
  ) {
    super()
  }

  public openSwaps(strategyHash: string): void {
    this.dialogProvider.getDialogs()?.openSwapsDialog(strategyHash)
  }

  public openLogs(strategyHash: string): void {
    this.dialogProvider.getDialogs()?.openLogsDialog(strategyHash)
  }

  public openArchiveOrder(strategyHash: string, resultId: number): void {
    this.dialogProvider.getDialogs()?.openQuestionDialog(
      'Archive?',
      'Are you sure you want to archive the order?',
      strategyHash,
      resultId
    )
  }

  public openAnalytics(strategyHash: string): void {
    this.dialogProvider.getDialogs()?.openAnalyticsDialog(strategyHash)
  }

  public openForceExecute(strategyHash: string, resultId: number): void {
    this.dialogProvider.getDialogs()?.openQuestionDialog(
      'Execute?',
      'Are you sure you want to force execute the order now?',
      strategyHash,
      resultId
    )
  }

  public openStrategyFilter(filter: StrategiesFilter): void {
    this.dialogProvider.getDialogs()?.openStrategyFilterDialog(filter)
  }

  public openDeleteOrder(strategyHash: string, resultId: number): void {
    this.dialogProvider.getDialogs()?.openQuestionDialog(
      'Delete?',
      'Are you sure you want to delete the order now?',
      strategyHash,
      resultId
    )
  }
}
