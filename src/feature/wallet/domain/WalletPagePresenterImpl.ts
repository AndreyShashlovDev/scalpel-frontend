import { BehaviorSubject, from, Observable, Subject, Subscription } from 'rxjs'
import { CurrencyRepository } from '../../../common/repository/data/currencies/CurrencyRepository.ts'
import { ChainType } from '../../../common/repository/data/model/ChainType.ts'
import { CurrencyResponse } from '../../../common/repository/data/model/CurrencyResponse.ts'
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
  private readonly isLoadingFinished = new Subject<boolean>()

  private walletsLatestResult: Pageable<WalletStatisticResponse> | undefined
  private walletsFetchSubscription: Subscription | undefined
  private readonly currencies = new Map<ChainType, Map<Address, CurrencyResponse>>()

  constructor(
    private readonly walletRepository: WalletRepository,
    private readonly getBalancesInteractor: GetErc20BalanceInteractor,
    private readonly currencyRepository: CurrencyRepository,
  ) {
    super()
  }

  public ready(): void {
    this.fetchNativePrices()
      .finally(() => this.fetchNext())
  }

  public destroy(): void {
    this.walletsFetchSubscription?.unsubscribe()
  }

  public refresh(): void {
    this.walletItems.next([])
    this.walletsLatestResult = undefined
    this.isLastPage.next(true)
    this.isLoading.next(true)

    this.fetchNativePrices()
      .finally(() => this.fetchNext())
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

  public getLoadingFinished(): Observable<boolean | undefined> {
    return this.isLoadingFinished.asObservable()
  }

  private async fetchNativePrices(): Promise<void> {
    const allCurrencies = await this.currencyRepository.getCurrencies()
    allCurrencies.forEach(currency => {
      const byChain = this.currencies.get(currency.chain) ?? new Map<Address, CurrencyResponse>()
      byChain.set(currency.address, currency)
      this.currencies.set(currency.chain, byChain)
    })
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
          return WalletResponseToWalletListItem(
            walletResponse,
            result.get(wallet.address) ?? new Map(),
            this.currencies
          )
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
            .concat(result.data.map(item => WalletResponseToWalletListItem(item, new Map(), this.currencies)))

          this.walletItems.next(list)
          this.isLastPage.next(
            result.total <= list.length ||
            result.data.length < WalletPagePresenterImpl.PAGE_LIMIT
          )
          this.fetchBalances(result.data)
        },
        complete: () => {
          this.isLoading.next(false)
          this.isLoadingFinished.next(true)
        }
      })
  }

  public onListItemClick(hash: string, viewId: number, data: unknown): void {
    console.log(hash, viewId, data)
  }
}
