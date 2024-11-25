import { ChainType } from './ChainType.ts'
import { CurrencyResponse } from './CurrencyResponse.ts'
import { StrategyType } from './StrategyType.ts'
import { JsonObject } from '../../../../utils/types.ts'

export enum StrategyStatusType {
  CREATED = 'CREATED',
  APPROVE_IN_PROGRESS = 'APPROVE_IN_PROGRESS',
  IN_PROGRESS = 'IN_PROGRESS',
  USER_ACTION_REQUIRED = 'USER_ACTION_REQUIRED',
  PAUSED = 'PAUSED',
  CANCELED = 'CANCELED'
}

export class StrategyResponse {

  public static valueOfJson(json: JsonObject<StrategyResponse>): StrategyResponse {
    return new StrategyResponse(
      ChainType[json.chain],
      StrategyType[json.type],
      json.orderHash ?? `${json.chain}${json.wallet}${json.currencyA.address}${json.currencyB.address}${Math.random()}`,
      json.wallet,
      CurrencyResponse.valueOfJson(json.currencyA),
      CurrencyResponse.valueOfJson(json.currencyB),
      json.totalAmountA,
      json.totalAmountB,
      json.options,
      json.initialAmountA,
      json.approvedA,
      json.approvedB,
      StrategyStatusType[json.status],
      json.gasLimit,
      new Date(json.createdAt.toString()),
    )
  }

  public readonly chain: ChainType
  public readonly type: StrategyType
  public readonly orderHash: string
  public readonly wallet: string
  public readonly currencyA: CurrencyResponse
  public readonly currencyB: CurrencyResponse
  public readonly totalAmountA: string
  public readonly totalAmountB: string
  public readonly options: JsonObject<unknown>
  public readonly initialAmountA: string
  public readonly approvedA: boolean
  public readonly approvedB: boolean
  public readonly status: StrategyStatusType
  public readonly gasLimit: string
  public readonly createdAt: Date

  constructor(
    chain: ChainType,
    type: StrategyType,
    orderHash: string,
    wallet: string,
    currencyA: CurrencyResponse,
    currencyB: CurrencyResponse,
    totalAmountA: string,
    totalAmountB: string,
    options: JsonObject<unknown>,
    initialAmountA: string,
    approvedA: boolean,
    approvedB: boolean,
    status: StrategyStatusType,
    gasLimit: string,
    createdAt: Date
  ) {
    this.chain = chain
    this.type = type
    this.orderHash = orderHash
    this.wallet = wallet
    this.currencyA = currencyA
    this.currencyB = currencyB
    this.totalAmountA = totalAmountA
    this.totalAmountB = totalAmountB
    this.options = options
    this.initialAmountA = initialAmountA
    this.approvedA = approvedA
    this.approvedB = approvedB
    this.status = status
    this.gasLimit = gasLimit
    this.createdAt = createdAt
  }
}
