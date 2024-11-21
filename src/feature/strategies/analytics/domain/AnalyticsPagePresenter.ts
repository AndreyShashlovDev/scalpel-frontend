import { Observable } from 'rxjs'
import { BasicPresenter } from '../../../../utils/arch/BasicPresenter.ts'
import { AnalyticsChartUiModel } from '../presentation/model/AnalyticsChartUiModel.ts'

export abstract class AnalyticsPagePresenter extends BasicPresenter {

  public abstract setStrategyHash(hash: string): void

  public abstract getIsLoading(): Observable<boolean>

  public abstract getChartModel(): Observable<AnalyticsChartUiModel | undefined>

  public abstract refresh(): void
}
