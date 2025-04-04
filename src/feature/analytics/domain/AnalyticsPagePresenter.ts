import { BasicPresenter } from 'flexdi'
import { Observable } from 'rxjs'
import { AnalyticsRange } from '../data/analytics-repository/AnalyticsRange.ts'
import { AnalyticsChartUiModel } from '../presentation/model/AnalyticsChartUiModel.ts'

export interface AnalyticsPageArgs {
  strategyHash: string
}

export abstract class AnalyticsPagePresenter extends BasicPresenter<AnalyticsPageArgs> {

  public abstract getIsLoading(): Observable<boolean>

  public abstract getChartModel(): Observable<AnalyticsChartUiModel | undefined>

  public abstract getSelectedChartRange(): Observable<AnalyticsRange>

  public abstract refresh(): void

  public abstract onChartRangeChange(range: AnalyticsRange): void

  public abstract onBackButtonClick(): void
}
