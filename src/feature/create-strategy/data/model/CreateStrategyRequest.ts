import { ChainType } from '../../../../common/repository/data/model/ChainType.ts'
import { StrategyType } from '../../../../common/repository/data/model/StrategyType.ts'

export class CreateScalpelStrategyRequest {

  public readonly type: StrategyType
  public readonly chain: ChainType
  public readonly walletAddress: string
  public readonly stableToken: string // must be stable coin for Scalpel strategy
  public readonly targetToken: string
  public readonly stableTokenAmount: number
  public readonly diffPercentUp: number
  public readonly diffPercentDown: number
  public readonly maxBuyPrice?: number
  public readonly maxGasPrice: number

  constructor(
    type: StrategyType,
    chain: ChainType,
    walletAddress: string,
    stableToken: string,
    targetToken: string,
    stableTokenAmount: number,
    diffPercentUp: number,
    diffPercentDown: number,
    maxBuyPrice: number | undefined,
    maxGasPrice: number,
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
  }
}

export class CreateStrategyRequest {

  public readonly strategy: CreateScalpelStrategyRequest

  constructor(strategy: CreateScalpelStrategyRequest) {
    this.strategy = strategy
  }
}
