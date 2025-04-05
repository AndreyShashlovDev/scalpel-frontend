import { Observable } from 'rxjs'
import { BasicPresenter } from 'flexdi'
import { SwapListItemModel } from '../presentation/model/SwapListItemModel.ts'

export interface SwapPageArgs {
  strategyHash: string
}

export abstract class SwapPagePresenter extends BasicPresenter<SwapPageArgs> {

  public abstract getSwapItems(): Observable<SwapListItemModel[]>

  public abstract getIsLastPage(): Observable<boolean>

  public abstract getIsLoading(): Observable<boolean>

  public abstract getLoadingFinished(): Observable<boolean | undefined>

  public abstract onFetchNext(): void

  public abstract refresh(): void

  public abstract onBackButtonClick(): void
}
