import { BasicDialogProvider } from '../../../utils/arch/DialogProvider.ts'
import StrategiesFilter from '../domain/model/StrategiesFilter.ts'
import { StrategyDialogCallBacks } from './StrategyPageDialogProvider.ts'
import { StrategyPageRouter } from './StrategyPageRouter.ts'

export class StrategyPageRouterImpl extends StrategyPageRouter {

  constructor(
    private readonly dialogProvider: BasicDialogProvider<StrategyDialogCallBacks>,
  ) {
    super()
  }

  public openSwapsDialog(strategyHash: string): void {
    this.dialogProvider.getDialogs()?.openSwapsDialog(strategyHash)
  }

  public openLogsDialog(strategyHash: string): void {
    this.dialogProvider.getDialogs()?.openLogsDialog(strategyHash)
  }

  public openDeleteDialog(strategyHash: string): void {
    this.dialogProvider.getDialogs()?.openDeleteDialog(strategyHash)
  }

  public openAnalyticsDialog(strategyHash: string): void {
    this.dialogProvider.getDialogs()?.openAnalyticsDialog(strategyHash)
  }

  public openForceExecuteDialog(strategyHash: string): void {
    this.dialogProvider.getDialogs()?.openForceExecuteDialog(strategyHash)
  }

  public openStrategyFilterDialog(filter: StrategiesFilter): void {
    this.dialogProvider.getDialogs()?.openStrategyFilterDialog(filter)
  }
}
