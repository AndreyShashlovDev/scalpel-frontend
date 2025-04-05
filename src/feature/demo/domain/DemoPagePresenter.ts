import { Observable } from 'rxjs'
import { BasicPresenter } from 'flexdi'
import { SimulationListItemModel } from '../presentation/model/SimulationListItemModel.ts'

export abstract class DemoPagePresenter extends BasicPresenter<void> {

  public abstract getItems(): Observable<SimulationListItemModel[]>

  public abstract getIsLastPage(): Observable<boolean>

  public abstract getIsLoading(): Observable<boolean>

  public abstract getLoadingFinished(): Observable<boolean | undefined>

  public abstract onFetchNext(): void

  public abstract refresh(): void

  public abstract onListItemClick(hash: string, viewId: number, data: unknown): void

  public abstract onBackClick(): void
}
