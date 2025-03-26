import { DialogProvider, DialogRouter } from '../../../utils/arch/DialogProvider.ts'
import StrategiesFilter from '../domain/model/StrategiesFilter.ts'

export interface StrategyDialogCallBacks extends DialogRouter {

  openQuestionDialog(title: string, message: string, data: unknown, resultId: number): void

  openStrategyFilterDialog(filter: StrategiesFilter): void
}

export class StrategyPageDialogProvider extends DialogProvider<StrategyDialogCallBacks> {
}
