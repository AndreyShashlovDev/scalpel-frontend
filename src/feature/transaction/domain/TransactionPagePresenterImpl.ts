import { BehaviorSubject, from, Observable, Subject, Subscription } from 'rxjs'
import { Pageable } from '../../../common/repository/data/model/Pageable.ts'
import { Inject, Injectable } from '../../../utils/di-core/decorator/decorators.ts'
import { TransactionResponse } from '../data/model/TransactionResponse.ts'
import { TransactionRepository } from '../data/transaction-repository/TransactionRepository.ts'
import {
  TransactionResponseToTransactionListItem
} from '../presentation/mapping/TransactionResponseToTransactionListItem.ts'
import { TransactionListItemModel } from '../presentation/model/TransactionListItemModel.ts'
import { TransactionPagePresenter } from './TransactionPagePresenter.ts'

@Injectable()
export class TransactionPagePresenterImpl extends TransactionPagePresenter {

  private static readonly PAGE_LIMIT = 10

  private readonly transactionItems: BehaviorSubject<TransactionListItemModel[]> = new BehaviorSubject<TransactionListItemModel[]>(
    [])
  private readonly isLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true)
  private readonly isLastPage: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true)
  private readonly isLoadingFinished = new Subject<boolean>()

  private transactionFetchSubscription: Subscription | undefined
  private transactionLatestResult: Pageable<TransactionResponse> | undefined

  constructor(
    @Inject(TransactionRepository) private readonly transactionRepository: TransactionRepository,
  ) {
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
    this.isLastPage.next(true)
    this.transactionLatestResult = undefined

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

  public getLoadingFinished(): Observable<boolean | undefined> {
    return this.isLoadingFinished.asObservable()
  }

  public fetchNext(): void {
    this.isLoading.next(this.transactionItems.value.length === 0)
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
        },
        complete: () => {
          this.isLoading.next(false)
          this.isLoadingFinished.next(true)
        }
      })
  }
}
