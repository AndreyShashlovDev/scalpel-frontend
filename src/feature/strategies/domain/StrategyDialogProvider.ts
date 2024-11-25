import { DialogProvider, DialogRouter } from '../../../utils/arch/DialogProvider.ts'

export interface StrategyDialogCallBacks extends DialogRouter {

  openSwapsDialog(strategyHash: string): void

  openLogsDialog(strategyHash: string): void

  openDeleteDialog(strategyHash: string): void

  openAnalyticsDialog(strategyHash: string): void
}

export class StrategyDialogProvider extends DialogProvider<StrategyDialogCallBacks> {
}
