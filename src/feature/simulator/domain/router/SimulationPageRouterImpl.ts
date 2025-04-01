import { Inject, Injectable } from '@di-core/decorator/decorators.ts'
import { SimulationPageDialogProvider } from './SimulationPageDialogProvider.ts'
import { SimulationPageRouter } from './SimulationPageRouter.ts'

@Injectable()
export class SimulationPageRouterImpl extends SimulationPageRouter {

  constructor(
    @Inject(SimulationPageDialogProvider) private readonly dialogProvider: SimulationPageDialogProvider,
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
