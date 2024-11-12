import { Pageable } from '../../../../common/repository/data/model/Pageable.ts'
import { CompositeStrategyResponse } from '../model/CompositeStrategyResponse.ts'
import { StrategyResponse } from '../model/StrategyResponse.ts'

export abstract class StrategyRepository {

  public abstract getCompositeStrategies(page: number, limit: number): Promise<Pageable<CompositeStrategyResponse>>

  public abstract getStrategies(page: number, limit: number): Promise<Pageable<StrategyResponse>>
}
