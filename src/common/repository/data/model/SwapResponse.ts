import { JsonObject } from '../../../../utils/types.ts'
import { ChainType } from './ChainType.ts'

export enum SwapState {
  WAIT_FOR_ACTION = 'WAIT_FOR_ACTION',
  WAIT_EXECUTION = 'WAIT_EXECUTION',
  CANCELLED = 'CANCELED',
  FAILED = 'FAILED',
  EXECUTION = 'EXECUTION',
  EXECUTION_SUCCESS = 'EXECUTION_SUCCESS',
  EXECUTION_FAILED = 'EXECUTION_FAILED'
}

export class SwapResponse {

  public static valueOfJson(json: JsonObject<SwapResponse>): SwapResponse {
    return new SwapResponse(
      json.id,
      ChainType[json.chain],
      json.currencyFrom,
      json.currencyTo,
      json.valueFrom,
      json.valueTo,
      json.scalpelFeeAmount,
      json.accumulatorFeeAmount,
      json.txHash,
      json.txFee,
      // @ts-expect-error transform
      SwapState[json.state],
      new Date(json.updateAt.toString()),
    )
  }

  public readonly id: number
  public readonly chain: ChainType
  public readonly currencyFrom: string
  public readonly currencyTo: string
  public readonly valueFrom: string
  public readonly valueTo: string
  public readonly scalpelFeeAmount?: string
  public readonly accumulatorFeeAmount?: string
  public readonly txHash?: string
  public readonly txFee?: string
  public readonly state: SwapState
  public readonly updateAt: Date

  constructor(
    id: number,
    chain: ChainType,
    currencyFrom: string,
    currencyTo: string,
    valueFrom: string,
    valueTo: string,
    scalpelFeeAmount: string | undefined,
    accumulatorFeeAmount: string | undefined,
    txHash: string | undefined,
    txFee: string | undefined,
    state: SwapState,
    updateAt: Date
  ) {
    this.id = id
    this.chain = chain
    this.currencyFrom = currencyFrom
    this.currencyTo = currencyTo
    this.valueFrom = valueFrom
    this.valueTo = valueTo
    this.scalpelFeeAmount = scalpelFeeAmount
    this.accumulatorFeeAmount = accumulatorFeeAmount
    this.txHash = txHash
    this.txFee = txFee
    this.state = state
    this.updateAt = updateAt
  }
}
