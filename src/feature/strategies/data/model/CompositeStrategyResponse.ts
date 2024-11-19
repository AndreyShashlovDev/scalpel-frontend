import { LogResponse } from '../../../../common/repository/data/model/LogResponse.ts'
import { SwapResponse } from '../../../../common/repository/data/model/SwapResponse.ts'
import { StrategyResponse } from './StrategyResponse.ts'

export class CompositeStrategyResponse {

  public readonly strategy: StrategyResponse
  public readonly swaps: SwapResponse[]
  public readonly latestLog?: LogResponse

  constructor(strategy: StrategyResponse, swaps: SwapResponse[], latestLog: LogResponse | undefined) {
    this.strategy = strategy
    this.swaps = swaps
    this.latestLog = latestLog
  }
}
