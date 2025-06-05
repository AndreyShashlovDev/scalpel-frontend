import { BasicPresenter } from 'flexdi'
import { Observable } from 'rxjs'
import { StrategyListItem } from '../presentation/model/StrategyListItem.ts'
import StrategiesFilter from './model/StrategiesFilter.ts'

export abstract class StrategiesPagePresenter extends BasicPresenter<void> {

  public abstract refresh(): void

  public abstract getStrategiesList(): Observable<StrategyListItem<unknown>[]>

  public abstract getIsLoading(): Observable<boolean>

  public abstract getLoadingFinished(): Observable<boolean | undefined>

  public abstract getIsLastPage(): Observable<boolean>

  public abstract getIsEmpty(): Observable<boolean>

  public abstract getListScrollY(): Observable<number | undefined>

  public abstract fetchNextPage(): void

  public abstract onListItemClick(
    viewId: number,
    hash: string,
    data?: number | null
  ): void

  public abstract onActionResultCallback(data: unknown, resultId: number | string): void

  public abstract onFilterButtonClick(): void

  public abstract onChangeFilter(filter: StrategiesFilter): void

  public abstract setListScrollY(scrollTop: number): void

  public abstract onNotificationClick(): void

  public abstract onCreateNewOrderClick(): void
}
