import { BehaviorSubject, from, Observable, Subscription } from 'rxjs'
import { Pageable } from '../../../common/repository/data/model/Pageable.ts'
import { WalletStatisticResponse } from '../../../common/repository/data/model/WalletStatisticResponse.ts'
import { WalletRepository } from '../../../common/repository/data/wallet/WalletRepository.ts'
import { WalletResponseToWalletListItem } from '../presentation/mapping/WalletResponseToWalletListItem.ts'
import { WalletListItemModel } from '../presentation/model/WalletListItemModel.ts'
import { WalletPagePresenter } from './WalletPagePresenter.ts'

export class WalletPagePresenterImpl extends WalletPagePresenter {

  public static readonly PAGE_LIMIT = 5

  private readonly walletItems: BehaviorSubject<WalletListItemModel[]> = new BehaviorSubject<WalletListItemModel[]>([])
  private readonly isLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true)
  private readonly isLastPage: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true)

  private walletsLatestResult: Pageable<WalletStatisticResponse> | undefined
  private walletsFetchSubscription: Subscription | undefined

  constructor(private readonly walletRepository: WalletRepository) {
    super()
  }

  public ready(): void {
    this.fetchNext()
  }

  public destroy(): void {
    this.walletsFetchSubscription?.unsubscribe()
  }

  public refresh(): void {
    this.walletItems.next([])
    this.fetchNext()
  }

  public getWalletItems(): Observable<WalletListItemModel[]> {
    return this.walletItems.asObservable()
  }

  public getIsLoading(): Observable<boolean> {
    return this.isLoading.asObservable()
  }

  public getIsLastPage(): Observable<boolean> {
    return this.isLastPage.asObservable()
  }

  public fetchNext(): void {
    this.isLoading.next(true)
    this.walletsFetchSubscription?.unsubscribe()

    this.walletsFetchSubscription = from(this.walletRepository.getStatistic(
      (this.walletsLatestResult?.page ?? 0) + 1,
      WalletPagePresenterImpl.PAGE_LIMIT
    ))
      .subscribe({
        next: (result) => {
          this.walletsLatestResult = result

          const list = this.walletItems
            .value
            .concat(result.data.map(WalletResponseToWalletListItem))

          this.walletItems.next(list)
          this.isLastPage.next(
            result.total <= list.length ||
            result.data.length < WalletPagePresenterImpl.PAGE_LIMIT
          )

          this.isLoading.next(false)
        }
      })
  }
}
