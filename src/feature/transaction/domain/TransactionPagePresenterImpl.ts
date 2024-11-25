import { BehaviorSubject, from, Observable, Subscription } from 'rxjs'
import { Pageable } from '../../../common/repository/data/model/Pageable.ts'
import { TransactionResponse } from '../data/model/TransactionResponse.ts'
import { TransactionRepository } from '../data/transaction-repository/TransactionRepository.ts'
import {
  TransactionResponseToTransactionListItem
} from '../presentation/mapping/TransactionResponseToTransactionListItem.ts'
import { TransactionListItemModel } from '../presentation/model/TransactionListItemModel.ts'
import { TransactionPagePresenter } from './TransactionPagePresenter.ts'

export class TransactionPagePresenterImpl extends TransactionPagePresenter {

  private static readonly PAGE_LIMIT = 10

  private readonly transactionItems: BehaviorSubject<TransactionListItemModel[]> = new BehaviorSubject<TransactionListItemModel[]>(
    [])
  private readonly isLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true)
  private readonly isLastPage: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true)

  private transactionFetchSubscription: Subscription | undefined
  private transactionLatestResult: Pageable<TransactionResponse> | undefined

  constructor(private readonly transactionRepository: TransactionRepository) {
    super()
  }

  public ready(): void {
    this.fetchNext()
  }

  public destroy(): void {
    this.transactionFetchSubscription?.unsubscribe()
  }

  public refresh(): void {
    this.transactionItems.next([])
    this.fetchNext()
  }

  public getTransactionItems(): Observable<TransactionListItemModel[]> {
    return this.transactionItems.asObservable()
  }

  public getIsLoading(): Observable<boolean> {
    return this.isLoading.asObservable()
  }

  public getIsLastPage(): Observable<boolean> {
    return this.isLastPage.asObservable()
  }

  public fetchNext(): void {
    this.isLoading.next(true)
    this.transactionFetchSubscription?.unsubscribe()

    this.transactionFetchSubscription = from(this.transactionRepository.getTransactions(
      (this.transactionLatestResult?.page ?? 0) + 1,
      TransactionPagePresenterImpl.PAGE_LIMIT
    ))
      .subscribe({
        next: (result) => {
          this.transactionLatestResult = result

          const list = this.transactionItems
            .value
            .concat(result.data.map(TransactionResponseToTransactionListItem))

          this.transactionItems.next(list)
          this.isLastPage.next(
            result.total <= list.length ||
            result.data.length < TransactionPagePresenterImpl.PAGE_LIMIT
          )
          
          this.isLoading.next(false)
        }
      })
  }
}
