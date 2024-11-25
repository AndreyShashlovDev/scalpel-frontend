import { StrategyResponse } from '../../../../common/repository/data/model/StrategyResponse.ts'

export abstract class StrategyRepository {

  public abstract getStrategy(hash: string): Promise<StrategyResponse>
}
