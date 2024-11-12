import { Observable } from 'rxjs'
import { BasicPresenter } from '../../../utils/arch/BasicPresenter.ts'
import { StrategyListItem } from '../presentation/model/StrategyListItem.ts'

export abstract class StrategiesPagePresenter extends BasicPresenter {

  public abstract getStrategiesList(): Observable<StrategyListItem<unknown>[]>

  public abstract getIsLastPage(): Observable<boolean>

  public abstract fetchNextPage(): void

  public abstract onListItemClick(viewId: number, item: StrategyListItem<unknown>): void

  public abstract onCreateNewStrategyClick(): void
}
