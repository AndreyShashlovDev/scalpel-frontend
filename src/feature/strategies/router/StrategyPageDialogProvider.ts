import { DialogProvider, DialogRouter } from '../../../utils/arch/DialogProvider.ts'
import StrategiesFilter from '../domain/model/StrategiesFilter.ts'

export interface StrategyDialogCallBacks extends DialogRouter {

  openSwapsDialog(strategyHash: string): void

  openLogsDialog(strategyHash: string): void

  openDeleteDialog(strategyHash: string): void

  openAnalyticsDialog(strategyHash: string): void

  openForceExecuteDialog(strategyHash: string): void

  openStrategyFilterDialog(filter: StrategiesFilter): void
}

export class StrategyPageDialogProvider extends DialogProvider<StrategyDialogCallBacks> {
}
