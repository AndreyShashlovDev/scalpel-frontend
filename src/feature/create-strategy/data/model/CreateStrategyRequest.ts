import { ChainType } from '../../../../common/repository/data/model/ChainType.ts'
import { StrategyType } from '../../../../common/repository/data/model/StrategyType.ts'
import { Address } from '../../../../utils/types.ts'

export class CreateScalpelStrategyRequest {

  public readonly type: StrategyType
  public readonly chain: ChainType
  public readonly walletAddress: Address
  public readonly stableToken: Address // must be stable coin for Scalpel strategy
  public readonly targetToken: Address
  public readonly stableTokenAmount: number
  public readonly diffPercentUp: number
  public readonly diffPercentDown: number
  public readonly maxBuyPrice?: number
  public readonly maxGasPrice: number
  public readonly stopLossPercents?: number

  constructor(
    type: StrategyType,
    chain: ChainType,
    walletAddress: Address,
    stableToken: Address,
    targetToken: Address,
    stableTokenAmount: number,
    diffPercentUp: number,
    diffPercentDown: number,
    maxBuyPrice: number | undefined,
    maxGasPrice: number,
    stopLossPercents: number | undefined,
  ) {
    this.type = type
    this.chain = chain
    this.walletAddress = walletAddress
    this.stableToken = stableToken
    this.targetToken = targetToken
    this.stableTokenAmount = stableTokenAmount
    this.diffPercentUp = diffPercentUp
    this.diffPercentDown = diffPercentDown
    this.maxBuyPrice = maxBuyPrice
    this.maxGasPrice = maxGasPrice
    this.stopLossPercents = stopLossPercents
  }
}

export class CreateStrategyRequest {

  public readonly strategy: CreateScalpelStrategyRequest

  constructor(strategy: CreateScalpelStrategyRequest) {
    this.strategy = strategy
  }
}
