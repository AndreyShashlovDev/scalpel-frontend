import { Observable } from 'rxjs'
import { BasicPresenter } from 'flexdi'
import { WalletListItemModel } from '../presentation/model/WalletListItemModel.ts'

export abstract class WalletPagePresenter extends BasicPresenter<void> {

  public abstract getWalletItems(): Observable<WalletListItemModel[]>

  public abstract getIsLoading(): Observable<boolean>

  public abstract getIsLastPage(): Observable<boolean>

  public abstract getLoadingFinished(): Observable<boolean | undefined>

  public abstract fetchNext(): void

  public abstract refresh(): void

  public abstract onListItemClick(hash: string, viewId: number, data: unknown): void

  public abstract onActionResultCallback(data: unknown, dialogId: string | number): void
}
