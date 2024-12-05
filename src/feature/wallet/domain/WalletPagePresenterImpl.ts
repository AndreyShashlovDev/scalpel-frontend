import { BehaviorSubject, from, Observable, Subscription } from 'rxjs'
import { ChainType } from '../../../common/repository/data/model/ChainType.ts'
import { Pageable } from '../../../common/repository/data/model/Pageable.ts'
import { WalletStatisticResponse } from '../../../common/repository/data/model/WalletStatisticResponse.ts'
import { WalletRepository } from '../../../common/repository/data/wallet/WalletRepository.ts'
import { Address } from '../../../utils/types.ts'
import { WalletResponseToWalletListItem } from '../presentation/mapping/WalletResponseToWalletListItem.ts'
import { WalletListItemModel } from '../presentation/model/WalletListItemModel.ts'
import { GetErc20BalanceInteractor } from './interactor/GetErc20BalanceInteractor.ts'
import { WalletPagePresenter } from './WalletPagePresenter.ts'

export class WalletPagePresenterImpl extends WalletPagePresenter {

  public static readonly PAGE_LIMIT = 5

  private readonly walletItems: BehaviorSubject<WalletListItemModel[]> = new BehaviorSubject<WalletListItemModel[]>([])
  private readonly isLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true)
  private readonly isLastPage: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true)

  private walletsLatestResult: Pageable<WalletStatisticResponse> | undefined
  private walletsFetchSubscription: Subscription | undefined

  constructor(
    private readonly walletRepository: WalletRepository,
    private readonly getBalancesInteractor: GetErc20BalanceInteractor
  ) {
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
    this.walletsLatestResult = undefined
    this.isLastPage.next(true)

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

  private async fetchBalances(walletResponses: WalletStatisticResponse[]): Promise<void> {
    try {
      const mapOfCurrencies = walletResponses.reduce((acc, curr) => {
        curr.currencies.forEach(currency => {
          const byChain = acc.get(currency.currency.chain) ?? new Map<Address, Set<Address>>()
          const byWallet = byChain.get(curr.address) ?? new Set<Address>()
          byWallet.add(currency.currency.address)
          byChain.set(curr.address, byWallet)
          acc.set(currency.currency.chain, byChain)
        })

        return acc
      }, new Map<ChainType, Map<Address, Set<Address>>>())

      const result = await this.getBalancesInteractor.invoke({data: mapOfCurrencies})
      const mapOfWallets = new Map(walletResponses.map(wallet => [wallet.address, wallet]))

      const updatedList = this.walletItems.value.map(wallet => {
        const walletResponse = mapOfWallets.get(wallet.address)

        if (walletResponse) {
          return WalletResponseToWalletListItem(walletResponse, result.get(wallet.address) ?? new Map())
        }
        return wallet
      })

      this.walletItems.next(updatedList)
    } catch (e) {
      console.error(e)
    }
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
            .concat(result.data.map(item => WalletResponseToWalletListItem(item, new Map())))

          this.walletItems.next(list)
          this.isLastPage.next(
            result.total <= list.length ||
            result.data.length < WalletPagePresenterImpl.PAGE_LIMIT
          )
          this.fetchBalances(result.data)
          this.isLoading.next(false)
        }
      })
  }

  public onListItemClick(hash: string, viewId: number, data: unknown): void {
    console.log(hash, viewId, data)
  }
}
