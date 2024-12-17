import * as console from 'node:console'
import { BehaviorSubject, from, Observable, Subject, Subscription } from 'rxjs'
import { Pageable } from '../../../common/repository/data/model/Pageable.ts'
import { StrategyStatusType } from '../../../common/repository/data/model/StrategyResponse.ts'
import { BasicDialogProvider } from '../../../utils/arch/DialogProvider.ts'
import { ChangeOptionsRequest } from '../data/model/ChangeOptionsRequest.ts'
import { CompositeStrategyResponse } from '../data/model/CompositeStrategyResponse.ts'
import { StrategyRepository } from '../data/strategy-repository/StrategyRepository.ts'
import { StrategyResponseToStrategyListItem } from '../presentation/mapping/StrategyResponseToStrategyListItem.ts'
import { StrategyListItem } from '../presentation/model/StrategyListItem.ts'
import { StrategiesPagePresenter } from './StrategiesPagePresenter.ts'
import { StrategyDialogCallBacks } from './StrategyDialogProvider.ts'
import { StrategyHolderButtonIds } from './StrategyHolderButtonIds.ts'

export class StrategiesPagePresenterImpl extends StrategiesPagePresenter {

  private static PAGE_LIMIT: number = 5

  private readonly strategiesList = new BehaviorSubject<StrategyListItem<unknown>[]>([])
  private readonly isLastPage = new BehaviorSubject<boolean>(true)
  private readonly isLoading = new BehaviorSubject<boolean>(true)
  private readonly isLoadingFinished = new Subject<boolean>()
  private strategiesLatestResult: Pageable<CompositeStrategyResponse> | undefined

  private listFetchSubscriber: Subscription | undefined

  constructor(
    private readonly strategiesRepository: StrategyRepository,
    private readonly dialogProvider: BasicDialogProvider<StrategyDialogCallBacks>,
  ) {
    super()
  }

  public ready() {
    this.fetchNextPage()
  }

  public destroy(): void {
    this.listFetchSubscriber?.unsubscribe()
  }

  public refresh(): void {
    this.isLastPage.next(true)
    this.strategiesLatestResult = undefined
    this.strategiesList.next([])
    this.fetchNextPage()
  }

  public getStrategiesList(): Observable<StrategyListItem<unknown>[]> {
    return this.strategiesList.asObservable()
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

  public fetchNextPage(): void {
    this.listFetchSubscriber?.unsubscribe()
    this.isLoading.next(this.strategiesList.value.length === 0)

    this.listFetchSubscriber = from(this.strategiesRepository.getCompositeStrategies(
      (this.strategiesLatestResult?.page ?? 0) + 1,
      StrategiesPagePresenterImpl.PAGE_LIMIT
    ))
      .subscribe({
        next: (result) => {
          this.strategiesLatestResult = result

          const list = this.strategiesList
            .value
            .concat(result.data.map(item => StrategyResponseToStrategyListItem(
              item.strategy,
              item.swaps,
              item.latestLog ? [item.latestLog] : [],
              item.swapHistory,
            )))

          this.strategiesList.next(list)
          this.isLastPage.next(
            result.total <= list.length ||
            result.data.length < StrategiesPagePresenterImpl.PAGE_LIMIT
          )
        },
        complete: () => {
          this.isLoading.next(false)
          this.isLoadingFinished.next(true)
        }
      })
  }

  public onListItemClick(viewId: number, item: StrategyListItem<unknown>, data?: number | null): void {
    if (viewId === StrategyHolderButtonIds.OPEN_SWAP_BUTTON_ID) {
      this.onShowSwapsClick(item.hash)

    } else if (viewId === StrategyHolderButtonIds.OPEN_LOGS_BUTTON_ID) {
      this.onShowLogsClick(item.hash)

    } else if (viewId === StrategyHolderButtonIds.CHANGE_GAS_PRICE_BUTTON_ID) {
      this.changeStrategyOptions(item.hash, {maxGasPrice: data || 1})

    } else if (viewId === StrategyHolderButtonIds.CHANGE_GROW_PERCENT_BUTTON_ID) {
      this.changeStrategyOptions(item.hash, {diffPercentUp: data || 0.01})

    } else if (viewId === StrategyHolderButtonIds.CHANGE_FALL_PERCENT_BUTTON_ID) {
      this.changeStrategyOptions(item.hash, {diffPercentDown: data || 0.01})

    } else if (viewId === StrategyHolderButtonIds.CHANGE_TOKEN_B_PRICE_BUTTON_ID) {
      this.changeStrategyOptions(item.hash, {maxBuyPrice: data})

    } else if (viewId === StrategyHolderButtonIds.PLAY_ORDER_BUTTON_ID) {
      this.changeStrategyStatus(item.hash, StrategyStatusType.IN_PROGRESS)

    } else if (viewId === StrategyHolderButtonIds.PAUSE_ORDER_BUTTON_ID) {
      this.changeStrategyStatus(item.hash, StrategyStatusType.PAUSED)

    } else if (viewId === StrategyHolderButtonIds.CANCEL_ORDER_BUTTON_ID) {
      this.dialogProvider.getDialogs()?.openDeleteDialog(item.hash)

    } else if (viewId === StrategyHolderButtonIds.OPEN_ANALYTICS_BUTTON_ID) {
      this.dialogProvider.getDialogs()?.openAnalyticsDialog(item.hash)

    } else if (viewId === StrategyHolderButtonIds.FORCE_EXECUTE_ORDER_BUTTON_ID) {
      this.dialogProvider.getDialogs()?.openForceExecuteDialog(item.hash)
    }
  }

  public onForceExecuteClick(hash: string): void {
    this.forceExecuteStrategy(hash)
      .then(() => {})
      .catch(e => console.error(e))
  }

  private async forceExecuteStrategy(orderHash: string): Promise<void> {
    try {
      const updatedListForWait = this.strategiesList.value.map(item => {
        if (item.hash === orderHash) {
          return item.copy({waitForceExecute: true})
        }
        return item
      })
      this.strategiesList.next(updatedListForWait)

      await this.strategiesRepository.forceExecute(orderHash)
      const strategy = await this.strategiesRepository.getStrategy(orderHash)

      const updatedList = this.strategiesList.value.map(item => {
        if (item.hash === strategy.orderHash) {
          return StrategyResponseToStrategyListItem(strategy, item.swaps, item.logs, item.swapsHistory)
        }
        return item
      })

      this.strategiesList.next(updatedList)

    } catch (e) {
      console.error(e)
      const updatedList = this.strategiesList.value.map(item => {
        if (item.hash === orderHash) {
          return item.copy({waitForceExecute: false})
        }
        return item
      })
      this.strategiesList.next(updatedList)

    }
  }

  private async changeStrategyStatus(orderHash: string, status: StrategyStatusType): Promise<void> {
    try {
      const updatedListForWait = this.strategiesList.value.map(item => {
        if (item.hash === orderHash) {
          if (status === StrategyStatusType.IN_PROGRESS || status === StrategyStatusType.PAUSED) {
            return item.copy({waitChangeStatusPlayPause: true})
          }
          if (status === StrategyStatusType.CANCELED) {
            return item.copy({waitChangeStatusCancel: true})
          }
        }
        return item
      })
      this.strategiesList.next(updatedListForWait)

      await this.strategiesRepository.changeStatus(orderHash, status)
      const strategy = await this.strategiesRepository.getStrategy(orderHash)

      if (strategy.status === StrategyStatusType.CANCELED) {
        this.strategiesList.next(this.strategiesList.value.filter(item => item.hash !== strategy.orderHash))

      } else {
        const updatedList = this.strategiesList.value.map(item => {
          if (item.hash === strategy.orderHash) {
            return StrategyResponseToStrategyListItem(strategy, item.swaps, item.logs, item.swapsHistory)
          }
          return item
        })

        this.strategiesList.next(updatedList)
      }

    } catch (e) {
      console.error(e)
      const updatedList = this.strategiesList.value.map(item => {
        if (item.hash === orderHash) {
          if (status === StrategyStatusType.IN_PROGRESS || status === StrategyStatusType.PAUSED) {
            return item.copy({waitChangeStatusPlayPause: false})
          }
          if (status === StrategyStatusType.CANCELED) {
            return item.copy({waitChangeStatusCancel: false})
          }
        }
        return item
      })
      this.strategiesList.next(updatedList)

    }
  }

  private onShowSwapsClick(strategyHash: string): void {
    this.dialogProvider.getDialogs()?.openSwapsDialog(strategyHash)
  }

  private onShowLogsClick(strategyHash: string): void {
    this.dialogProvider.getDialogs()?.openLogsDialog(strategyHash)
  }

  private async changeStrategyOptions(hash: string, options: Partial<ChangeOptionsRequest>): Promise<void> {
    try {
      await this.strategiesRepository.changeOptions(hash, options)
      const strategy = await this.strategiesRepository.getStrategy(hash)

      const updatedList = this.strategiesList.value.map(item => {
        if (item.hash === strategy.orderHash) {
          return StrategyResponseToStrategyListItem(strategy, item.swaps, item.logs, item.swapsHistory)
        }
        return item
      })

      this.strategiesList.next(updatedList)
    } catch (e) {
      console.error(e)
      this.strategiesList.next(this.strategiesList.value.concat([]))
    }
  }

  public onDeleteStrategyClick(hash: string): void {
    this.changeStrategyStatus(hash, StrategyStatusType.CANCELED)
  }
}
