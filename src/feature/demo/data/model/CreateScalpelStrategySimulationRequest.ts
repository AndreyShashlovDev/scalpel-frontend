import { ChainType } from '../../../../common/repository/data/model/ChainType.ts'
import { StrategyType } from '../../../../common/repository/data/model/StrategyType.ts'
import { Address } from '../../../../utils/types.ts'

export class CreateScalpelStrategySimulationRequest {

  public readonly type: StrategyType
  public readonly chain: ChainType
  public readonly stableToken: Address // must be stable coin for Scalpel strategy
  public readonly targetToken: Address
  public readonly stableTokenAmount: number
  public readonly diffPercentUp: number
  public readonly diffPercentDown: number
  public readonly maxBuyPrice: number | undefined
  public readonly stopLossPercents: number | undefined

  constructor(
    type: StrategyType,
    chain: ChainType,
    stableToken: Address,
    targetToken: Address,
    stableTokenAmount: number,
    diffPercentUp: number,
    diffPercentDown: number,
    maxBuyPrice: number | undefined,
    stopLossPercents: number | undefined
  ) {
    this.type = type
    this.chain = chain
    this.stableToken = stableToken
    this.targetToken = targetToken
    this.stableTokenAmount = stableTokenAmount
    this.diffPercentUp = diffPercentUp
    this.diffPercentDown = diffPercentDown
    this.maxBuyPrice = maxBuyPrice
    this.stopLossPercents = stopLossPercents
  }
}
