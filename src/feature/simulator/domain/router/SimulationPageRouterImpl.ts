import { BasicDialogProvider } from '../../../../utils/arch/DialogProvider.ts'
import { SimulationDialogCallBacks } from './SimulationPageDialogProvider.ts'
import { SimulationPageRouter } from './SimulationPageRouter.ts'

export class SimulationPageRouterImpl extends SimulationPageRouter {

  constructor(
    private readonly dialogProvider: BasicDialogProvider<SimulationDialogCallBacks>,
  ) {
    super()
  }

  public openCreateSimulation(): void {
    this.dialogProvider.getDialogs()?.openCreateStrategyDialog()
  }

  public openDeleteSimulation(resultId: number | string, simulationId: number): void {
    this.dialogProvider.getDialogs()?.openConfirmDeleteDialog(resultId, simulationId)
  }

  public openStrategiesPage(): void {
    this.dialogProvider.getDialogs()?.closeCreateSimulationDialog()
  }

  public openWarnTooMuchInQueue(): void {
    this.dialogProvider.getDialogs()?.openWarnTooMuchInQueueDialog()
  }

  public openWarnTooMuchSimulations(): void {
    this.dialogProvider.getDialogs()?.openWarnTooMuchSimulations()
  }
}
