import { Observable } from 'rxjs'
import { BasicPresenter } from '../../../../utils/arch/BasicPresenter.ts'
import { AnalyticsRange } from '../data/analytics-repository/AnalyticsRange.ts'
import { AnalyticsChartUiModel } from '../presentation/model/AnalyticsChartUiModel.ts'

export abstract class AnalyticsPagePresenter extends BasicPresenter {

  public abstract setStrategyHash(hash: string): void

  public abstract getIsLoading(): Observable<boolean>

  public abstract getChartModel(): Observable<AnalyticsChartUiModel | undefined>

  public abstract getSelectedChartRange(): Observable<AnalyticsRange>

  public abstract refresh(): void

  public abstract onChartRangeChange(range: AnalyticsRange): void
}
