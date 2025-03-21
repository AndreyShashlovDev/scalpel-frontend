import { DialogProvider, DialogRouter } from '../../../../utils/arch/DialogProvider.ts'
import { Singleton } from '../../../../utils/di-core/decorator/decorators.ts'

export interface SimulationDialogCallBacks extends DialogRouter {

  openCreateStrategyDialog(): void

  closeCreateSimulationDialog(): void

  openConfirmDeleteDialog(resultId: number | string, simulationId: number): void

  openWarnTooMuchInQueueDialog(): void

  openWarnTooMuchSimulations(): void
}

@Singleton()
export class SimulationPageDialogProvider extends DialogProvider<SimulationDialogCallBacks> {
}
