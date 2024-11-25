import { Observable } from 'rxjs'
import { BasicPresenter } from '../../../utils/arch/BasicPresenter.ts'
import { SwapListItemModel } from '../presentation/model/SwapListItemModel.ts'

export abstract class SwapPagePresenter extends BasicPresenter {

  public abstract setupSwapData(strategyHash: string): void

  public abstract getSwapItems(): Observable<SwapListItemModel[]>

  public abstract getIsLastPage(): Observable<boolean>

  public abstract getIsLoading(): Observable<boolean>

  public abstract onFetchNext(): void

  public abstract refresh(): void
}
