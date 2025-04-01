import { Injectable } from '@di-core/decorator/decorators.ts'
import { DialogProvider, DialogRouter } from '../../../../utils/arch/DialogProvider.ts'

export interface SimulationDialogCallBacks extends DialogRouter {

  openCreateStrategyDialog(): void

  closeCreateSimulationDialog(): void

  openConfirmDeleteDialog(resultId: number | string, simulationId: number): void

  openWarnTooMuchInQueueDialog(): void

  openWarnTooMuchSimulations(): void
}

@Injectable()
export class SimulationPageDialogProvider extends DialogProvider<SimulationDialogCallBacks> {
}
