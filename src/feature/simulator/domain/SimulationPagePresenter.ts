import { Observable } from 'rxjs'
import { BasicPresenter } from '../../../utils/arch/BasicPresenter.ts'
import { SimulationListItemModel } from '../presentation/model/SimulationListItemModel.ts'

export abstract class SimulationPagePresenter extends BasicPresenter<void> {

  public abstract getLogItems(): Observable<SimulationListItemModel[]>

  public abstract getIsLastPage(): Observable<boolean>

  public abstract getIsLoading(): Observable<boolean>

  public abstract getLoadingFinished(): Observable<boolean | undefined>

  public abstract onFetchNext(): void

  public abstract refresh(): void

  public abstract onCreateNewSimulationClick(): void

  public abstract onListItemClick(hash: string, viewId: number, data: unknown): void

  public abstract onActionResultCallback(data: unknown, dialogId: number | string): void
}
