import { BehaviorSubject, from, Observable, Subscription } from 'rxjs'
import { ChainType } from '../../../common/repository/data/model/ChainType.ts'
import { Pageable } from '../../../common/repository/data/model/Pageable.ts'
import { BasicDialogProvider } from '../../../utils/arch/DialogProvider.ts'
import { CompositeStrategyResponse } from '../data/model/CompositeStrategyResponse.ts'
import { StrategyRepository } from '../data/strategy-repository/StrategyRepository.ts'
import { StrategyResponseToStrategyListItem } from '../presentation/mapping/StrategyResponseToStrategyListItem.ts'
import { StrategyListItem } from '../presentation/model/StrategyListItem.ts'
import { StrategyPageRouter } from '../router/StrategyPageRouter.ts'
import { StrategiesPagePresenter } from './StrategiesPagePresenter.ts'
import { StrategyDialogCallBacks } from './StrategyDialogProvider.ts'
import { StrategyHolderButtonIds } from './StrategyHolderButtonIds.ts'

export class StrategiesPagePresenterImpl extends StrategiesPagePresenter {

  private static PAGE_LIMIT: number = 10

  private readonly strategiesList = new BehaviorSubject<StrategyListItem<unknown>[]>([])
  private readonly isLastPage = new BehaviorSubject<boolean>(false)
  private strategiesLatestResult: Pageable<CompositeStrategyResponse> | undefined

  private listFetchSubscriber: Subscription | undefined

  constructor(
    private readonly strategiesRepository: StrategyRepository,
    private readonly dialogProvider: BasicDialogProvider<StrategyDialogCallBacks>,
    private readonly router: StrategyPageRouter,
  ) {
    super()
  }

  public ready() {
    this.fetchNextPage()
  }

  public destroy(): void {
    this.listFetchSubscriber?.unsubscribe()
  }

  public getStrategiesList(): Observable<StrategyListItem<unknown>[]> {
    return this.strategiesList.asObservable()
  }

  public getIsLastPage(): Observable<boolean> {
    return this.isLastPage.asObservable()
  }

  public fetchNextPage(): void {
    this.listFetchSubscriber?.unsubscribe()

    this.listFetchSubscriber = from(this.strategiesRepository.getCompositeStrategies(
      (this.strategiesLatestResult?.page ?? 0) + 1,
      StrategiesPagePresenterImpl.PAGE_LIMIT
    ))
      .subscribe({
        next: (result) => {
          this.strategiesLatestResult = result

          const list = this.strategiesList
            .value
            .concat(result.data.map(item => StrategyResponseToStrategyListItem(item.strategy, item.swaps)))

          this.strategiesList.next(list)
          this.isLastPage.next(
            result.total <= list.length ||
            result.data.length < StrategiesPagePresenterImpl.PAGE_LIMIT
          )
        }
      })
  }

  public onListItemClick(viewId: number, item: StrategyListItem<unknown>): void {
    if (viewId === StrategyHolderButtonIds.OPEN_SWAP_BUTTON_ID) {
      this.onShowSwapsClick(item.hash, item.chain)

    } else if (viewId === StrategyHolderButtonIds.OPEN_LOGS_BUTTON_ID) {
      this.onShowLogsClick(item.hash)
    }
  }

  private onShowSwapsClick(strategyHash: string, chain: ChainType): void {
    this.dialogProvider.getDialogs()?.openSwapsDialog(strategyHash, chain)
  }

  private onShowLogsClick(strategyHash: string): void {
    this.dialogProvider.getDialogs()?.openLogsDialog(strategyHash)
  }

  public onCreateNewStrategyClick(): void {
    this.router.openCreateStrategyPage()
  }
}
