import { Observable } from 'rxjs'
import { BasicPresenter } from '../../../utils/arch/BasicPresenter.ts'
import { TransactionListItemModel } from '../presentation/model/TransactionListItemModel.ts'

export abstract class TransactionPagePresenter extends BasicPresenter {

  public abstract getTransactionItems(): Observable<TransactionListItemModel[]>

  public abstract getIsLoading(): Observable<boolean>

  public abstract getIsLastPage(): Observable<boolean>

  public abstract fetchNext(): void

  public abstract refresh(): void
}
