import { BehaviorSubject, from, Observable, Subscription } from 'rxjs'
import { Pageable } from '../../../common/repository/data/model/Pageable.ts'
import { LogsRepository } from '../data/logs-repository/LogsRepository.ts'
import { LogResponse } from '../data/model/LogResponse.ts'
import { LogResponseToLogListItem } from '../presentation/mapping/LogResponseToLogListItem.ts'
import { LogListItemModel } from '../presentation/model/LogListItemModel.ts'
import { LogsPagePresenter } from './LogsPagePresenter.ts'

export class LogsPagePresenterImpl extends LogsPagePresenter {

  private static readonly PAGE_LIMIT: number = 10

  private readonly logItems: BehaviorSubject<LogListItemModel[]> = new BehaviorSubject<LogListItemModel[]>([])
  private readonly isLastPage: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false)

  private logsFetchSubscription: Subscription | undefined
  private strategyHash: string | undefined
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

  public setStrategyHash(hash: string): void {
    this.strategyHash = hash
  }

  public getLogItems(): Observable<LogListItemModel[]> {
    return this.logItems.asObservable()
  }

  public getIsLastPage(): Observable<boolean> {
    return this.isLastPage.asObservable()
  }

  public onFetchNext(): void {
    if (!this.strategyHash) {
      return
    }

    this.logsFetchSubscription?.unsubscribe()

    this.logsFetchSubscription = from(this.logsRepository.getLogs(
      this.strategyHash,
      (this.prevSwapsResponse?.page ?? 0) + 1,
      LogsPagePresenterImpl.PAGE_LIMIT,
    )).subscribe({
      next: (result) => {
        const transform = result.data.map(LogResponseToLogListItem)
        const list = this.logItems.value.concat(transform)
        this.prevSwapsResponse = result

        this.logItems.next(list)

        this.isLastPage.next(
          result.total <= list.length ||
          result.data.length < LogsPagePresenterImpl.PAGE_LIMIT
        )
      }
    })
  }
}
