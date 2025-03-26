import { BehaviorSubject, forkJoin, Observable, Subject, Subscription } from 'rxjs'
import { Pageable } from '../../../common/repository/data/model/Pageable.ts'
import { SortOrder } from '../../../common/repository/data/model/SortOrder.ts'
import { StrategyResponse } from '../../../common/repository/data/model/StrategyResponse.ts'
import { SwapResponse } from '../../../common/repository/data/model/SwapResponse.ts'
import { Inject, Injectable } from '../../../utils/di-core/decorator/decorators.ts'
import { StrategyRepository } from '../data/strategy-repository/StrategyRepository.ts'
import { SwapRepository } from '../data/swap-repository/SwapRepository.ts'
import { SwapResponseToSwapListItem } from '../presentation/mapping/SwapResponseToSwapListItem.ts'
import { SwapListItemModel } from '../presentation/model/SwapListItemModel.ts'
import { SwapsPageRouter } from '../router/SwapsPageRouter.ts'
import { SwapPagePresenter } from './SwapPagePresenter.ts'

@Injectable()
export class SwapPagePresenterImpl extends SwapPagePresenter {

  private static readonly PAGE_LIMIT: number = 10

  private readonly swapsItems: BehaviorSubject<SwapListItemModel[]> = new BehaviorSubject<SwapListItemModel[]>([])
  private readonly isLastPage: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true)
  private readonly isLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true)
  private readonly isLoadingFinished = new Subject<boolean>()

  private swapsFetchSubscription: Subscription | undefined
  private prevSwapsResponse: Pageable<SwapResponse> | undefined
  private strategy: StrategyResponse | undefined

  constructor(
    @Inject(StrategyRepository) private readonly strategyRepository: StrategyRepository,
    @Inject(SwapRepository) private readonly swapRepository: SwapRepository,
    @Inject(SwapsPageRouter) private readonly router: SwapsPageRouter,
  ) {
    super()
  }

  public ready(): void {
    this.onFetchNext()
  }

  public destroy(): void {
    this.swapsFetchSubscription?.unsubscribe()
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

  public getLoadingFinished(): Observable<boolean | undefined> {
    return this.isLoadingFinished.asObservable()
  }

  private async fetchStrategy(): Promise<StrategyResponse> {
    if (this.strategy) {
      return this.strategy
    }

    this.strategy = await this.strategyRepository.getStrategy(this.args?.strategyHash ?? '')

    return this.strategy
  }

  public onFetchNext(): void {
    if (!this.args) {
      return
    }

    this.isLoading.next(this.swapsItems.value.length === 0)
    this.swapsFetchSubscription?.unsubscribe()

    this.swapsFetchSubscription = forkJoin([
      this.fetchStrategy(),
      this.swapRepository.getSwaps(
        this.args?.strategyHash,
        (this.prevSwapsResponse?.page ?? 0) + 1,
        SwapPagePresenterImpl.PAGE_LIMIT,
        new SortOrder([{key: 'updatedAt', order: 'desc'}])
      )
    ])
      .subscribe({
        next: ([strategy, swapsList]) => {
          const transform = swapsList.data.map(item => {
            return SwapResponseToSwapListItem(item, strategy)
          })
          const list = this.swapsItems.value.concat(transform)

          this.prevSwapsResponse = swapsList

          this.swapsItems.next(list)

          this.isLastPage.next(
            swapsList.total <= list.length ||
            swapsList.data.length < SwapPagePresenterImpl.PAGE_LIMIT
          )
        },
        complete: () => {
          this.isLoading.next(false)
          this.isLoadingFinished.next(true)
        }
      })
  }

  public refresh(): void {
    this.prevSwapsResponse = undefined
    this.isLastPage.next(true)
    this.swapsItems.next([])
    this.onFetchNext()
  }

  public onBackButtonClick(): void {
    this.router.back()
  }
}
