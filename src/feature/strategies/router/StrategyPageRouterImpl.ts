import { Inject, Injectable } from 'flexdi'
import { ApplicationRouter } from '../../../common/router/domain/ApplicationRouter.ts'
import StrategiesFilter from '../domain/model/StrategiesFilter.ts'
import { StrategyPageDialogProvider } from './StrategyPageDialogProvider.ts'
import { StateBundle, StrategyPageRouter } from './StrategyPageRouter.ts'

@Injectable()
export class StrategyPageRouterImpl extends StrategyPageRouter {

  constructor(
    @Inject(StrategyPageDialogProvider) private readonly dialogProvider: StrategyPageDialogProvider,
    @Inject(ApplicationRouter) private readonly appRouter: ApplicationRouter,
  ) {
    super()
  }

  public openSwaps(strategyHash: string): void {
    this.appRouter.openOrderSwaps(strategyHash)
  }

  public openLogs(strategyHash: string): void {
    this.appRouter.openOrderLogs(strategyHash)
  }

  public openArchiveOrder(strategyHash: string, resultId: number): void {
    this.dialogProvider.getDialogs()?.openQuestionDialog(
      'Archive?',
      'Are you sure you want to archive the order?',
      strategyHash,
      resultId
    )
  }

  public openAnalytics(strategyHash: string): void {
    this.appRouter.openOrderAnalytics(strategyHash)
  }

  public openForceExecute(strategyHash: string, resultId: number): void {
    this.dialogProvider.getDialogs()?.openQuestionDialog(
      'Execute?',
      'Are you sure you want to force execute the order now?',
      strategyHash,
      resultId
    )
  }

  public openStrategyFilter(filter: StrategiesFilter): void {
    this.dialogProvider.getDialogs()?.openStrategyFilterDialog(filter)
  }

  public openDeleteOrder(strategyHash: string, resultId: number): void {
    this.dialogProvider.getDialogs()?.openQuestionDialog(
      'Delete?',
      'Are you sure you want to delete the order now?',
      strategyHash,
      resultId
    )
  }

  public saveRouteState(bundle: StateBundle): void {
    this.appRouter.saveRouteState(bundle)
  }

  public restoreRouteState(): Readonly<StateBundle> | undefined {
    return this.appRouter.restoreRouteState()
  }

  public openChangeNotificationState(text: string, resultId: number): void {
    this.dialogProvider.getDialogs()?.openQuestionDialog(
      'Notifications',
      text,
      undefined,
      resultId
    )
  }
}
