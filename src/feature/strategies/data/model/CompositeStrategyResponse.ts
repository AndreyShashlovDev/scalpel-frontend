import { SwapResponse } from '../../../../common/repository/data/model/SwapResponse.ts'
import { StrategyResponse } from './StrategyResponse.ts'

export class CompositeStrategyResponse {

  public readonly strategy: StrategyResponse
  public readonly swaps: SwapResponse[]

  constructor(strategy: StrategyResponse, swaps: SwapResponse[]) {
    this.strategy = strategy
    this.swaps = swaps
  }
}
