import { BehaviorSubject, catchError, EMPTY, from, Observable, Subject, Subscription } from 'rxjs'
import { CurrencyRepository } from '../../../common/repository/data/currencies/CurrencyRepository.ts'
import { ChainType } from '../../../common/repository/data/model/ChainType.ts'
import { CurrencyResponse } from '../../../common/repository/data/model/CurrencyResponse.ts'
import { Pageable } from '../../../common/repository/data/model/Pageable.ts'
import { WalletStatisticResponse } from '../../../common/repository/data/model/WalletStatisticResponse.ts'
import { WalletRepository } from '../../../common/repository/data/wallet/WalletRepository.ts'
import { Address } from '../../../utils/types.ts'
import { WalletResponseToWalletListItem } from '../presentation/mapping/WalletResponseToWalletListItem.ts'
import { WalletListItemModel } from '../presentation/model/WalletListItemModel.ts'
import { WalletPageRouter } from '../router/WalletPageRouter.ts'
import { ExportWalletPrivateKeyInteractor } from './interactor/ExportWalletPrivateKeyInteractor.ts'
import { GetErc20BalanceInteractor } from './interactor/GetErc20BalanceInteractor.ts'
import { WalletListItemIds } from './model/WalletListItemIds.ts'
import { WalletPagePresenter } from './WalletPagePresenter.ts'

export class WalletPagePresenterImpl extends WalletPagePresenter {

  private static readonly PAGE_LIMIT = 5
  private static readonly EXPORT_PRIVATE_KEY_RESULT_ID: number = Math.random()
  private static readonly DELETE_PRIVATE_KEY_RESULT_ID: number = Math.random()

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
    private readonly exportWalletInteractor: ExportWalletPrivateKeyInteractor,
    private readonly router: WalletPageRouter,
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
      .pipe(catchError(() => {return EMPTY}))
      .subscribe({
        next: (result) => {
          try {
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
          } catch (e) {
            console.error(e)
          }
        },
        complete: () => {
          this.isLoading.next(false)
          this.isLoadingFinished.next(true)
        },
        error: (e) => {
          console.log(e)
          this.isLoading.next(false)
          this.isLoadingFinished.next(true)
        }
      })
  }

  public onListItemClick(hash: string, viewId: number, data: unknown): void {
    const wallet = this.walletItems.value.find(item => item.hash === hash)

    if (!wallet) {
      return
    }

    if (WalletListItemIds.BUTTON_CHANGE_NAME === viewId) {
      const validName = (((data as string | undefined)?.length ?? 0) === 0 ? null : data as string)

      this.walletRepository.changeWalletName(wallet.address, validName)
        .catch(e => console.error(e))

    } else if (WalletListItemIds.BUTTON_EXPORT_WALLET === viewId) {
      this.router.openExportPrivateKey(wallet.hash, WalletPagePresenterImpl.EXPORT_PRIVATE_KEY_RESULT_ID)

    } else if (WalletListItemIds.BUTTON_DELETE_PRIVATE_KEY === viewId) {
      this.router.openDeletePrivateKey(wallet.hash, WalletPagePresenterImpl.DELETE_PRIVATE_KEY_RESULT_ID)
    }
  }

  public onActionResultCallback(data: unknown, dialogId: string | number): void {
    const wallet = this.walletItems.value.find(item => item.hash === data)

    if (!wallet) {
      return
    }

    if (dialogId === WalletPagePresenterImpl.EXPORT_PRIVATE_KEY_RESULT_ID) {
      this.exportPrivateKey(wallet)

    } else if (dialogId === WalletPagePresenterImpl.DELETE_PRIVATE_KEY_RESULT_ID && data) {
      this.deletePrivateKey(wallet)
    }
  }

  private deletePrivateKey(wallet: WalletListItemModel) {
    console.log(wallet)
  }

  private exportPrivateKey(exportWallet: WalletListItemModel): void {
    this.exportWalletInteractor.invoke({account: exportWallet.address})
      .then(pk => {
        const updatedList = this.walletItems.value.map(
          wallet => wallet.hash === exportWallet.hash ? wallet.copy({privateKey: pk}) : wallet
        )

        this.walletItems.next(updatedList)
      })
      .catch(e => console.error(e))
  }
}
