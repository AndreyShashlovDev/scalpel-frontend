import { BehaviorSubject, from, Observable, Subject, Subscription } from 'rxjs'
import { Pageable } from '../../../common/repository/data/model/Pageable.ts'
import { Inject, Injectable } from '../../../utils/di-core/decorator/decorators.ts'
import { SimulationResponse } from '../data/model/SimulationResponse.ts'
import { SimulationRepository } from '../data/simulation-repository/SimulationRepository.ts'
import {
  SimulationResponseToSimulationListItem
} from '../presentation/mapping/SimulationResponseToSimulationListItem.ts'
import { SimulationListItemModel } from '../presentation/model/SimulationListItemModel.ts'
import { DemoPagePresenter } from './DemoPagePresenter.ts'
import { DemoPageRouter } from './router/DemoPageRouter.ts'

@Injectable()
export class DemoPagePresenterImpl extends DemoPagePresenter {

  private static readonly PAGE_LIMIT: number = 20

  private readonly listItems = new BehaviorSubject<SimulationListItemModel[]>([])
  private readonly isLastPage: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true)
  private readonly isLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true)
  private readonly isLoadingFinished = new Subject<boolean>()

  private fetchSubscription: Subscription | undefined
  private prevResponse: Pageable<SimulationResponse> | undefined

  constructor(
    @Inject(SimulationRepository) private readonly simulationRepository: SimulationRepository,
    @Inject(DemoPageRouter) private readonly router: DemoPageRouter,
  ) {
    super()
    console.log('DEMO CREATE', this.prevResponse)
  }

  public ready(): void {
    console.log('DEMO ready')
    this.onFetchNext()
  }

  public destroy(): void {
    console.log('DEMO destroy')
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

    this.fetchSubscription = from(this.simulationRepository.getDemoSimulations(
      (this.prevResponse?.page ?? 0) + 1,
      DemoPagePresenterImpl.PAGE_LIMIT,
    )).subscribe({
      next: (result) => {
        const transform = result.data.map(SimulationResponseToSimulationListItem)
        const list = this.listItems.value.concat(transform)
        this.prevResponse = result

        this.isLastPage.next(
          result.total <= list.length ||
          result.data.length < DemoPagePresenterImpl.PAGE_LIMIT
        )

        this.listItems.next(list)
      },
      complete: () => {
        this.isLoading.next(false)
        this.isLoadingFinished.next(true)
      }
    })
  }

  public onListItemClick(hash: string, viewId: number, _: unknown): void {
    const item = this.listItems.value.find(item => item.hash === hash)
    console.log(item, viewId, _)
  }

  public onBackClick(): void {
    this.router.openLoginPage()
  }
}
