import { DialogProvider, DialogRouter } from '../../../utils/arch/DialogProvider.ts'
import StrategiesFilter from '../domain/model/StrategiesFilter.ts'

export interface StrategyDialogCallBacks extends DialogRouter {

  openSwapsDialog(strategyHash: string): void

  openLogsDialog(strategyHash: string): void

  openQuestionDialog(title: string, message: string, data: unknown, resultId: number): void

  openAnalyticsDialog(strategyHash: string): void

  openStrategyFilterDialog(filter: StrategiesFilter): void
}

export class StrategyPageDialogProvider extends DialogProvider<StrategyDialogCallBacks> {
}
