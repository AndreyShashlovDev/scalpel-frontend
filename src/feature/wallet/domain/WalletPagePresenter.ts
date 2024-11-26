import { Observable } from 'rxjs'
import { BasicPresenter } from '../../../utils/arch/BasicPresenter.ts'
import { WalletListItemModel } from '../presentation/model/WalletListItemModel.ts'

export abstract class WalletPagePresenter extends BasicPresenter {

  public abstract getWalletItems(): Observable<WalletListItemModel[]>

  public abstract getIsLoading(): Observable<boolean>

  public abstract getIsLastPage(): Observable<boolean>

  public abstract fetchNext(): void
  
  public abstract refresh(): void
}
