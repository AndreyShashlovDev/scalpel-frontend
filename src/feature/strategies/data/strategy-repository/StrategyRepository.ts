import { Pageable } from '../../../../common/repository/data/model/Pageable.ts'
import { StrategyResponse, StrategyStatusType } from '../../../../common/repository/data/model/StrategyResponse.ts'
import { ChangeOptionsRequest } from '../model/ChangeOptionsRequest.ts'
import { CompositeStrategyResponse } from '../model/CompositeStrategyResponse.ts'

export abstract class StrategyRepository {

  public abstract getCompositeStrategies(
    status: Set<StrategyStatusType>,
    page: number,
    limit: number,
  ): Promise<Pageable<CompositeStrategyResponse>>

  public abstract getStrategies(page: number, limit: number): Promise<Pageable<StrategyResponse>>

  public abstract changeOptions(orderHash: string, options: Partial<ChangeOptionsRequest>): Promise<void>

  public abstract getStrategy(hash: string): Promise<StrategyResponse>

  public abstract changeStatus(orderHash: string, status: StrategyStatusType): Promise<void>

  public abstract forceExecute(orderHash: string): Promise<void>
}
