import { BehaviorSubject, forkJoin, Observable, Subscription } from 'rxjs'
import { CurrencyRepository } from '../../../common/repository/data/currencies/CurrencyRepository.ts'
import { ChainType } from '../../../common/repository/data/model/ChainType.ts'
import { CurrencyResponse } from '../../../common/repository/data/model/CurrencyResponse.ts'
import { Pageable } from '../../../common/repository/data/model/Pageable.ts'
import { SortOrder } from '../../../common/repository/data/model/SortOrder.ts'
import { SwapResponse } from '../../../common/repository/data/model/SwapResponse.ts'
import { SwapRepository } from '../data/swap-repository/SwapRepository.ts'
import { SwapResponseToSwapListItem } from '../presentation/mapping/SwapResponseToSwapListItem.ts'
import { SwapListItemModel } from '../presentation/model/SwapListItemModel.ts'
import { SwapPagePresenter } from './SwapPagePresenter.ts'

export class SwapPagePresenterImpl extends SwapPagePresenter {

  private static readonly PAGE_LIMIT: number = 10

  private readonly swapsItems: BehaviorSubject<SwapListItemModel[]> = new BehaviorSubject<SwapListItemModel[]>([])
  private readonly isLastPage: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true)
  private readonly isLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true)

  private readonly currencies: Map<string, CurrencyResponse> = new Map()

  private swapsFetchSubscription: Subscription | undefined
  private strategyHash: string | undefined
  private currentChain: ChainType | undefined
  private prevSwapsResponse: Pageable<SwapResponse> | undefined

  constructor(
    private readonly swapRepository: SwapRepository,
    private readonly currencyRepository: CurrencyRepository,
  ) {
    super()
  }

  public ready(): void {
    this.onFetchNext()
  }

  public destroy(): void {
    this.swapsFetchSubscription?.unsubscribe()
  }

  public setupSwapData(hash: string, chain: ChainType): void {
    this.strategyHash = hash
    this.currentChain = chain
  }

  public getSwapItems(): Observable<SwapListItemModel[]> {
    return this.swapsItems.asObservable()
  }

  public getIsLastPage(): Observable<boolean> {
    return this.isLastPage.asObservable()
  }

  public getIsLoading(): Observable<boolean> {
    return this.isLoading.asObservable()
  }

  private async fetchCurrencies(): Promise<Map<string, CurrencyResponse>> {
    if (this.currencies.size > 0) {
      return this.currencies
    }

    const response = await this.currencyRepository.getCurrencies(this.currentChain)

    response.forEach(item => {
      this.currencies.set(item.address, item)
    })

    return this.currencies
  }

  public onFetchNext(): void {
    if (!this.strategyHash) {
      return
    }

    this.isLoading.next(true)
    this.swapsFetchSubscription?.unsubscribe()

    this.swapsFetchSubscription = forkJoin([
      this.fetchCurrencies(),
      this.swapRepository.getSwaps(
        this.strategyHash,
        (this.prevSwapsResponse?.page ?? 0) + 1,
        SwapPagePresenterImpl.PAGE_LIMIT,
        new SortOrder([{key: 'updatedAt', order: 'desc'}])
      )
    ])
      .subscribe({
        next: ([currenciesMap, swapsList]) => {
          const transform = swapsList.data.map(item => {
            return SwapResponseToSwapListItem(item, currenciesMap)
          })
          const list = this.swapsItems.value.concat(transform)

          this.prevSwapsResponse = swapsList

          this.swapsItems.next(list)

          this.isLastPage.next(
            swapsList.total <= list.length ||
            swapsList.data.length < SwapPagePresenterImpl.PAGE_LIMIT
          )
          this.isLoading.next(false)
        }
      })
  }

  public refresh(): void {
    this.prevSwapsResponse = undefined
    this.isLastPage.next(false)
    this.swapsItems.next([])
    this.onFetchNext()
  }
}
