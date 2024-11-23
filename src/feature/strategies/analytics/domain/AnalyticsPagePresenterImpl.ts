import { BehaviorSubject, from, Observable, Subscription } from 'rxjs'
import { AnalyticsRange } from '../data/analytics-repository/AnalyticsRange.ts'
import { AnalyticsRepository } from '../data/analytics-repository/AnalyticsRepository.ts'
import { AnalyticsResponseToSwapPriceUiModel } from '../presentation/mapping/AnalyticsResponseToSwapPriceUiModel.ts'
import { AnalyticsChartUiModel } from '../presentation/model/AnalyticsChartUiModel.ts'
import { AnalyticsPagePresenter } from './AnalyticsPagePresenter.ts'

export class AnalyticsPagePresenterImpl extends AnalyticsPagePresenter {

  private readonly chartModel = new BehaviorSubject<AnalyticsChartUiModel | undefined>(undefined)
  private readonly isLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true)

  private fetchAnalytics: Subscription | undefined

  private chartDateRange: AnalyticsRange = AnalyticsRange.DAY
  private strategyHash: string | undefined

  constructor(private readonly analyticsRepository: AnalyticsRepository) {
    super()
  }

  public ready(): void {
    this.loadData()
  }

  public destroy(): void {
    this.fetchAnalytics?.unsubscribe()
  }

  public refresh(): void {
    this.chartModel.next(undefined)
    this.loadData()
  }

  public setStrategyHash(hash: string): void {
    this.strategyHash = hash
  }

  public getChartModel(): Observable<AnalyticsChartUiModel | undefined> {
    return this.chartModel.asObservable()
  }

  public getIsLoading(): Observable<boolean> {
    return this.isLoading.asObservable()
  }

  public loadData(): void {
    if (!this.strategyHash) {
      return
    }
    this.isLoading.next(true)
    this.fetchAnalytics?.unsubscribe()

    this.fetchAnalytics = from(this.analyticsRepository.getAnalytics(this.strategyHash, this.chartDateRange))
      .subscribe({
        next: (result) => {
          this.chartModel.next(AnalyticsResponseToSwapPriceUiModel(result))
          this.isLoading.next(false)
        }
      })
  }

  public onChartRangeChange(range: AnalyticsRange): void {
    this.chartDateRange = range
    this.loadData()
  }
}
