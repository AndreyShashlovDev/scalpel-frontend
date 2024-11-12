import { Observable } from 'rxjs'
import { BasicPresenter } from '../../../utils/arch/BasicPresenter.ts'
import { LogListItemModel } from '../presentation/model/LogListItemModel.ts'

export abstract class LogsPagePresenter extends BasicPresenter {

  public abstract setStrategyHash(hash: string): void

  public abstract getLogItems(): Observable<LogListItemModel[]>

  public abstract getIsLastPage(): Observable<boolean>

  public abstract onFetchNext(): void
}
