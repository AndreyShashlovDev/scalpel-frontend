import { Inject, Injectable } from 'flexdi'
import { BehaviorSubject, catchError, distinctUntilChanged, EMPTY, from, Observable, Subject, Subscription } from 'rxjs'
import { StrategyStatusType } from '../../../common/repository/data/model/StrategyResponse.ts'
import { PreferencesRepository } from '../../../common/repository/data/preferences/PreferencesRepository.ts'
import { UnknownException } from '../../../common/repository/data/source/exception/UnknownException.ts'
import { ExceptionNotifierService } from '../../../common/service/exception-handler/ExceptionNotifierService.ts'
import { PushNotificationService } from '../../../common/service/notification/PushNotificationService.ts'
import { ChangeOptionsRequest } from '../data/model/ChangeOptionsRequest.ts'
import { StrategyRepository } from '../data/strategy-repository/StrategyRepository.ts'
import { StrategyResponseToStrategyListItem } from '../presentation/mapping/StrategyResponseToStrategyListItem.ts'
import { StrategyListItem } from '../presentation/model/StrategyListItem.ts'
import { StrategyPageRouter } from '../router/StrategyPageRouter.ts'
import StrategiesFilter, { StrategyTypeFilterItem } from './model/StrategiesFilter.ts'
import { StrategiesPagePresenter } from './StrategiesPagePresenter.ts'
import { StrategyHolderButtonIds } from './StrategyHolderButtonIds.ts'

@Injectable()
export class StrategiesPagePresenterImpl extends StrategiesPagePresenter {

  private static PAGE_LIMIT: number = 5
  private static readonly ARCHIVE_ORDER_RESULT_ID = 1
  private static readonly FORCE_EXEUE_ORDER_RESULT_ID = 2
  private static readonly DELETE_ORDER_RESULT_ID = 3
  private static readonly CHANGE_NOTIFICATION_STATE_RESULT_ID = 4

  private readonly destroySubject: Subject<void> = new Subject()
  private readonly strategiesList = new BehaviorSubject<StrategyListItem<unknown>[]>([])
  private readonly isLastPage = new BehaviorSubject<boolean>(true)
  private readonly isLoading = new BehaviorSubject<boolean>(true)
  private readonly isLoadingFinished = new Subject<boolean>()
  private readonly isEmpty = new Subject<boolean>()
  private readonly listScrollPosition = new BehaviorSubject<number | undefined>(undefined)

  private readonly filter = new BehaviorSubject<StrategiesFilter>(new StrategiesFilter(
    [
      new StrategyTypeFilterItem(StrategyStatusType.IN_PROGRESS, 'In progress'),
      new StrategyTypeFilterItem(StrategyStatusType.PAUSED, 'Paused'),
      new StrategyTypeFilterItem(StrategyStatusType.CREATED, 'Created'),
      new StrategyTypeFilterItem(StrategyStatusType.APPROVE_IN_PROGRESS, 'Approve proccess'),
      new StrategyTypeFilterItem(StrategyStatusType.USER_ACTION_REQUIRED, 'Action required'),
      new StrategyTypeFilterItem(StrategyStatusType.CANCELED, 'Archived'),
    ],
    new Set<StrategyStatusType>(
      [
        StrategyStatusType.CREATED,
        StrategyStatusType.APPROVE_IN_PROGRESS,
        StrategyStatusType.IN_PROGRESS,
        StrategyStatusType.USER_ACTION_REQUIRED,
        StrategyStatusType.PAUSED,
      ]
    )
  ))

  private currentPage: number | undefined

  private listFetchSubscriber: Subscription | undefined

  constructor(
    @Inject(StrategyRepository) private readonly strategiesRepository: StrategyRepository,
    @Inject(StrategyPageRouter) private readonly router: StrategyPageRouter,
    @Inject(PreferencesRepository) private readonly preferencesRepository: PreferencesRepository,
    @Inject(PushNotificationService) private readonly pushNotificationService: PushNotificationService,
    @Inject(ExceptionNotifierService) private readonly exceptionNotifierService: ExceptionNotifierService,
  ) {
    super()
  }

  public ready() {
    const restoredState = this.router.restoreRouteState()

    if (restoredState) {
      this.currentPage = restoredState.currentPage
      this.isLastPage.next(restoredState.isLastPage)
      this.strategiesList.next(restoredState.listItems)
      this.listScrollPosition.next(restoredState.listScrollY)
      this.isLoadingFinished.next(true)
      this.isLoading.next(false)

      return
    }

    this.isLoading.next(true)

    this.preferencesRepository
      .getUserPreference()
      .then(prefs => {
        const filters = prefs?.strategyFilters ?? []

        if (filters.length > 0) {
          const updated = this.filter.value.copy({selectedStatus: new Set(filters)})
          this.filter.next(updated)
        }
      }).catch(e => console.error(e))
      .finally(() => this.fetchNextPage())
  }

  public destroy(): void {
    this.router.saveRouteState({
      listScrollY: this.listScrollPosition.value,
      currentPage: this.currentPage,
      listItems: this.strategiesList.value,
      isLastPage: this.isLastPage.value,
    })
    this.listFetchSubscriber?.unsubscribe()

    this.destroySubject.next()
    this.destroySubject.complete()
  }

  public refresh(): void {
    this.isLastPage.next(true)
    this.currentPage = undefined
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

  public getIsEmpty(): Observable<boolean> {
    return this.isEmpty.asObservable()
  }

  public getListScrollY(): Observable<number | undefined> {
    return this.listScrollPosition.asObservable()
      .pipe(distinctUntilChanged())
  }

  public fetchNextPage(): void {
    this.listFetchSubscriber?.unsubscribe()
    this.isLoading.next(this.strategiesList.value.length === 0)

    this.listFetchSubscriber = from(this.strategiesRepository.getCompositeStrategies(
      this.filter.value.selectedStatus,
      (this.currentPage ?? 0) + 1,
      StrategiesPagePresenterImpl.PAGE_LIMIT
    ))
      .pipe(catchError(() => {return EMPTY}))
      .subscribe({
        next: (result) => {
          this.currentPage = result.page

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
          if (list.length === 0 && result.page === 1) {
            this.isEmpty.next(true)
          }
        },
        complete: () => {
          this.isLoading.next(false)
          this.isLoadingFinished.next(true)
        },
        error: (e) => {
          console.error(e)
          this.isLoading.next(false)
          this.isLoadingFinished.next(true)
        }
      })
  }

  public onActionResultCallback(data: unknown, resultId: number | string): void {
    if (resultId === StrategiesPagePresenterImpl.CHANGE_NOTIFICATION_STATE_RESULT_ID) {
      this.changeNotificationSubscription()
        .then(() => {})
        .catch(e => console.error(e))
    }

    if (typeof data !== 'string') {
      return
    }

    if (resultId === StrategiesPagePresenterImpl.ARCHIVE_ORDER_RESULT_ID) {
      this.changeStrategyStatus(data, StrategyStatusType.CANCELED)
        .then(() => {})
        .catch(e => console.error(e))

    } else if (resultId === StrategiesPagePresenterImpl.FORCE_EXEUE_ORDER_RESULT_ID) {
      this.forceExecuteStrategy(data)
        .then(() => {})
        .catch(e => console.error(e))

    } else if (resultId === StrategiesPagePresenterImpl.DELETE_ORDER_RESULT_ID) {
      this.deleteOrder(data)
        .then(() => {})
        .catch(e => console.error(e))

    }
  }

  private async deleteOrder(hash: string): Promise<void> {
    try {
      await this.strategiesRepository.deleteOrder(hash)
      const list = this.strategiesList.value.filter(item => item.hash !== hash)
      this.strategiesList.next(list)

    } catch (e) {
      console.error(e)
    }
  }

  public onListItemClick(viewId: number, hash: string, data?: number | null): void {
    const item = this.strategiesList.value.find(item => item.hash == hash)
    if (!item) {
      return
    }

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

    } else if (viewId === StrategyHolderButtonIds.CHANGE_STOP_LOSS_PERCENT_BUTTON_ID) {
      this.changeStrategyOptions(item.hash, {stopLossPercents: data})

    } else if (viewId === StrategyHolderButtonIds.PLAY_ORDER_BUTTON_ID) {
      this.changeStrategyStatus(item.hash, StrategyStatusType.IN_PROGRESS)

    } else if (viewId === StrategyHolderButtonIds.PAUSE_ORDER_BUTTON_ID) {
      this.changeStrategyStatus(item.hash, StrategyStatusType.PAUSED)

    } else if (viewId === StrategyHolderButtonIds.CANCEL_ORDER_BUTTON_ID) {
      this.router.openArchiveOrder(item.hash, StrategiesPagePresenterImpl.ARCHIVE_ORDER_RESULT_ID)

    } else if (viewId === StrategyHolderButtonIds.OPEN_ANALYTICS_BUTTON_ID) {
      this.router.openAnalytics(item.hash)

    } else if (viewId === StrategyHolderButtonIds.FORCE_EXECUTE_ORDER_BUTTON_ID) {
      this.router.openForceExecute(item.hash, StrategiesPagePresenterImpl.FORCE_EXEUE_ORDER_RESULT_ID)

    } else if (viewId === StrategyHolderButtonIds.DELETE_ORDER_BUTTON_ID) {
      this.router.openDeleteOrder(item.hash, StrategiesPagePresenterImpl.DELETE_ORDER_RESULT_ID)
    }
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
    this.router.openSwaps(strategyHash)
  }

  private onShowLogsClick(strategyHash: string): void {
    this.router.openLogs(strategyHash)
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

  public onFilterButtonClick(): void {
    this.router.openStrategyFilter(this.filter.value)
  }

  public onChangeFilter(filter: StrategiesFilter): void {
    const newFiler = this.filter.value.copy({selectedStatus: filter.selectedStatus})

    this.filter.next(newFiler)

    this.preferencesRepository.updateUserPreference({
      strategyFilters: Array.from(filter.selectedStatus)
    }).catch(e => console.error(e))

    this.refresh()
  }

  public setListScrollY(scrollTop: number): void {
    this.listScrollPosition.next(scrollTop)
  }

  public onNotificationClick() {
    this.showDialogChangeNotificationSubscription()
      .catch(e => console.warn(e))
  }

  private async showDialogChangeNotificationSubscription(): Promise<void> {

    if (this.pushNotificationService.isReady()) {
      const status = await this.pushNotificationService.getNotificationPermission()
      const hasSubs = await this.pushNotificationService.hasSubscription()

      const text = `Permission status: ${status} \n\n ${
        (hasSubs)
          ? 'Do you want to unsubscribe?'
          : 'Do you want to subscribe?'
      }`
      this.router.openChangeNotificationState(text, StrategiesPagePresenterImpl.CHANGE_NOTIFICATION_STATE_RESULT_ID)

    } else {
      this.exceptionNotifierService.notify(
        UnknownException.create('Notification subscription no supported or something went wrong')
      )
    }
  }

  private async changeNotificationSubscription(): Promise<void> {
    if (!this.pushNotificationService.isReady()) {
      this.exceptionNotifierService.notify(
        UnknownException.create('Notification subscription no supported or something went wrong')
      )
    }

    try {
      const hasSubs = await this.pushNotificationService.hasSubscription()

      if (hasSubs) {
        await this.pushNotificationService.unsubscribe()
          .then(granted => {
            this.exceptionNotifierService.notify(
              UnknownException.create(
                granted
                  ? 'Unsubscription success'
                  : 'Unsubscription error =( Something went wrong!')
            )
          })

      } else {
        await this.pushNotificationService.subscribe()
          .then(granted => {
            this.exceptionNotifierService.notify(
              UnknownException.create(
                granted
                  ? 'Subscription was created success'
                  : 'Notification subscription not created =( Something went wrong!')
            )
          })
      }
    } catch (e: unknown) {
      // @ts-expect-error isOk
      this.exceptionNotifierService.notify(UnknownException.create(e.message))
    }
  }
}
