import { BehaviorSubject, from, Observable, Subscription } from 'rxjs'
import { WalletRepository } from '../../../common/repository/data/wallet/WalletRepository.ts'
import { WalletResponseToWalletListItem } from '../presentation/mapping/WalletResponseToWalletListItem.ts'
import { WalletListItemModel } from '../presentation/model/WalletListItemModel.ts'
import { WalletPagePresenter } from './WalletPagePresenter.ts'

export class WalletPagePresenterImpl extends WalletPagePresenter {

  private readonly walletItems: BehaviorSubject<WalletListItemModel[]> = new BehaviorSubject<WalletListItemModel[]>([])
  private readonly isLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true)

  private walletsFetchSubscription: Subscription | undefined

  constructor(private readonly walletRepository: WalletRepository) {
    super()
  }

  public ready(): void {
    this.fetchData()
  }

  public destroy(): void {
    this.walletsFetchSubscription?.unsubscribe()
  }

  public refresh(): void {
    this.walletItems.next([])
    this.fetchData()
  }

  public getWalletItems(): Observable<WalletListItemModel[]> {
    return this.walletItems.asObservable()
  }

  public getIsLoading(): Observable<boolean> {
    return this.isLoading.asObservable()
  }

  private fetchData(): void {
    this.isLoading.next(true)
    this.walletsFetchSubscription?.unsubscribe()

    this.walletsFetchSubscription = from(this.walletRepository.getWallets())
      .subscribe({
        next: (result) => {
          const transform = result.map(WalletResponseToWalletListItem)
          const list = this.walletItems.value.concat(transform)

          this.walletItems.next(list)
          this.isLoading.next(false)
        }
      })
  }
}
