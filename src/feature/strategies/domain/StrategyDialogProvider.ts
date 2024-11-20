import { ChainType } from '../../../common/repository/data/model/ChainType.ts'
import { DialogProvider, DialogRouter } from '../../../utils/arch/DialogProvider.ts'

export interface StrategyDialogCallBacks extends DialogRouter {

  openSwapsDialog(strategyHash: string, chain: ChainType): void

  openLogsDialog(strategyHash: string): void

  openDeleteDialog(strategyHash: string): void
}

export class StrategyDialogProvider extends DialogProvider<StrategyDialogCallBacks> {
}
