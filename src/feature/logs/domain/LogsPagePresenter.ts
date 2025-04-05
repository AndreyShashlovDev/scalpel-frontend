import { Observable } from 'rxjs'
import { BasicPresenter } from 'flexdi'
import { LogListItemModel } from '../presentation/model/LogListItemModel.ts'

export interface LogsPageArgs {
  strategyHash: string
}

export abstract class LogsPagePresenter extends BasicPresenter<LogsPageArgs> {

  public abstract getLogItems(): Observable<LogListItemModel[]>

  public abstract getIsLastPage(): Observable<boolean>

  public abstract getIsLoading(): Observable<boolean>

  public abstract getLoadingFinished(): Observable<boolean | undefined>

  public abstract onFetchNext(): void

  public abstract refresh(): void

  public abstract onBackButtonClick(): void
}
