import { Inject, Injectable } from 'flexdi'
import { BehaviorSubject, from, Observable, Subject, Subscription } from 'rxjs'
import { Pageable } from '../../../common/repository/data/model/Pageable.ts'
import { SimulationResponse } from '../data/model/SimulationResponse.ts'
import { SimulationStatus } from '../data/model/SimulationStatus.ts'
import { SimulationRepository } from '../data/simulation-repository/SimulationRepository.ts'
import {
  SimulationResponseToSimulationListItem
} from '../presentation/mapping/SimulationResponseToSimulationListItem.ts'
import { SimulationListItemModel } from '../presentation/model/SimulationListItemModel.ts'
import { SimulationListItemClickId } from './router/SimulationListItemClickId.ts'
import { SimulationPageRouter } from './router/SimulationPageRouter.ts'
import { SimulationPagePresenter } from './SimulationPagePresenter.ts'

@Injectable()
export class SimulationPagePresenterImpl extends SimulationPagePresenter {

  private static readonly PAGE_LIMIT: number = 10

  private readonly DELETE_SIMULATION_RESULT_ID = 42124

  private readonly listItems = new BehaviorSubject<SimulationListItemModel[]>([])
  private readonly isLastPage: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true)
  private readonly isLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true)
  private readonly isLoadingFinished = new Subject<boolean>()

  private fetchSubscription: Subscription | undefined
  private prevResponse: Pageable<SimulationResponse> | undefined

  constructor(
    @Inject(SimulationRepository) private readonly simulationRepository: SimulationRepository,
    @Inject(SimulationPageRouter) private readonly router: SimulationPageRouter,
  ) {
    super()
  }

  public ready(): void {
    this.onFetchNext()
  }

  public destroy(): void {
    this.fetchSubscription?.unsubscribe()
  }

  public refresh(): void {
    this.listItems.next([])
    this.isLastPage.next(true)
    this.prevResponse = undefined
    this.onFetchNext()
  }

  public getItems(): Observable<SimulationListItemModel[]> {
    return this.listItems.asObservable()
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
    this.isLoading.next(this.listItems.value.length === 0)
    this.fetchSubscription?.unsubscribe()

    this.fetchSubscription = from(this.simulationRepository.getSimulations(
      (this.prevResponse?.page ?? 0) + 1,
      SimulationPagePresenterImpl.PAGE_LIMIT,
    )).subscribe({
      next: (result) => {
        const transform = result.data.map(SimulationResponseToSimulationListItem)
        const list = this.listItems.value.concat(transform)
        this.prevResponse = result

        this.isLastPage.next(
          result.total <= list.length ||
          result.data.length < SimulationPagePresenterImpl.PAGE_LIMIT
        )

        this.listItems.next(list)
      },
      complete: () => {
        this.isLoading.next(false)
        this.isLoadingFinished.next(true)
      }
    })
  }

  public onCreateNewSimulationClick(): void {
    const waitedCount = this.listItems.value.filter(item => item.status === SimulationStatus.WAIT).length

    if (waitedCount >= 3) {
      this.router.openWarnTooMuchInQueue()

    } else if ((this.prevResponse?.total ?? 0) >= 10) {
      this.router.openWarnTooMuchSimulations()

    } else {
      this.router.openCreateSimulation()
    }
  }

  public onListItemClick(hash: string, viewId: number, _: unknown): void {
    const item = this.listItems.value.find(item => item.hash === hash)

    if (viewId === SimulationListItemClickId.BUTTON_DELETE_ID && item) {
      this.router.openDeleteSimulation(this.DELETE_SIMULATION_RESULT_ID, item.id)
    }
  }

  public onActionResultCallback(data: unknown, dialogId: number | string): void {
    if (dialogId === this.DELETE_SIMULATION_RESULT_ID && typeof data === 'number') {
      this.onDeleteSimulation(data)
    }
  }

  private onDeleteSimulation(simulationId: number): void {
    this.simulationRepository.deleteSimulation(simulationId)
      .then(() => {
        const updatedList = this.listItems.value.filter(item => item.id !== simulationId)
        this.listItems.next(updatedList)
      })
  }
}
