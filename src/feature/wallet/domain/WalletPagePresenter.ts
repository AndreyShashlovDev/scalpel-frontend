import { Observable } from 'rxjs'
import { BasicPresenter } from '../../../utils/arch/BasicPresenter.ts'
import { WalletListItemModel } from '../presentation/model/WalletListItemModel.ts'

export abstract class WalletPagePresenter extends BasicPresenter {

  public abstract getWalletItems(): Observable<WalletListItemModel[]>

  public abstract getIsLoading(): Observable<boolean>

  public abstract refresh(): void
}
