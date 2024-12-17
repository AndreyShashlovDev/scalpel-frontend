import { BehaviorSubject, from, Observable, Subject, Subscription } from 'rxjs'
import { LogResponse } from '../../../common/repository/data/model/LogResponse.ts'
import { Pageable } from '../../../common/repository/data/model/Pageable.ts'
import { LogsRepository } from '../data/logs-repository/LogsRepository.ts'
import { LogResponseToLogListItem } from '../presentation/mapping/LogResponseToLogListItem.ts'
import { LogListItemModel } from '../presentation/model/LogListItemModel.ts'
import { LogsPagePresenter } from './LogsPagePresenter.ts'

export class LogsPagePresenterImpl extends LogsPagePresenter {

  private static readonly PAGE_LIMIT: number = 10

  private readonly logItems: BehaviorSubject<LogListItemModel[]> = new BehaviorSubject<LogListItemModel[]>([])
  private readonly isLastPage: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true)
  private readonly isLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true)
  private readonly isLoadingFinished = new Subject<boolean>()

  private logsFetchSubscription: Subscription | undefined
  private prevSwapsResponse: Pageable<LogResponse> | undefined

  constructor(private readonly logsRepository: LogsRepository) {
    super()
  }

  public ready(): void {
    this.onFetchNext()
  }

  public destroy(): void {
    this.logsFetchSubscription?.unsubscribe()
  }

  public refresh(): void {
    this.logItems.next([])
    this.isLastPage.next(true)
    this.prevSwapsResponse = undefined
    this.onFetchNext()
  }

  public getLogItems(): Observable<LogListItemModel[]> {
    return this.logItems.asObservable()
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

  public onFetchNext(): void {
    if (!this.args) {
      return
    }

    this.isLoading.next(this.logItems.value.length === 0)
    this.logsFetchSubscription?.unsubscribe()

    this.logsFetchSubscription = from(this.logsRepository.getLogs(
      this.args.strategyHash,
      (this.prevSwapsResponse?.page ?? 0) + 1,
      LogsPagePresenterImpl.PAGE_LIMIT,
    )).subscribe({
      next: (result) => {
        const transform = result.data.map(LogResponseToLogListItem)
        const list = this.logItems.value.concat(transform)
        this.prevSwapsResponse = result

        this.isLastPage.next(
          result.total <= list.length ||
          result.data.length < LogsPagePresenterImpl.PAGE_LIMIT
        )

        this.logItems.next(list)
      },
      complete: () => {
        this.isLoading.next(false)
        this.isLoadingFinished.next(true)
      }
    })
  }
}
