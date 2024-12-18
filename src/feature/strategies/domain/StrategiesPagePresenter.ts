import { Observable } from 'rxjs'
import { BasicPresenter } from '../../../utils/arch/BasicPresenter.ts'
import { StrategyListItem } from '../presentation/model/StrategyListItem.ts'
import StrategiesFilter from './model/StrategiesFilter.ts'

export abstract class StrategiesPagePresenter extends BasicPresenter<void> {

  public abstract refresh(): void

  public abstract getStrategiesList(): Observable<StrategyListItem<unknown>[]>

  public abstract getIsLoading(): Observable<boolean>

  public abstract getLoadingFinished(): Observable<boolean | undefined>

  public abstract getIsLastPage(): Observable<boolean>

  public abstract fetchNextPage(): void

  public abstract onListItemClick(
    viewId: number,
    item: StrategyListItem<unknown>,
    data?: number | null
  ): void

  public abstract onDeleteStrategyClick(hash: string): void

  public abstract onForceExecuteClick(hash: string): void

  public abstract onFilterButtonClick(): void

  public abstract onChangeFilter(filter: StrategiesFilter): void
}
