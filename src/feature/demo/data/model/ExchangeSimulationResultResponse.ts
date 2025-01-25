import { Address, JsonObject } from '../../../../utils/types.ts'

export class ExchangeSimulationResultResponse {

  public static valueOfJson(entity: JsonObject<ExchangeSimulationResultResponse>): ExchangeSimulationResultResponse {
    return new ExchangeSimulationResultResponse(
      entity.price,
      entity.exchangePriceEnter,
      entity.exchangePriceExit,
      entity.exchangeAdaptiveGrow,
      entity.stopLoss,
      entity.fromToken,
      entity.toToken,
      entity.exchangeAmount,
      entity.resultExchangeAmount,
      new Date(entity.createdAt.toString())
    )
  }

  public readonly price: number
  public readonly exchangePriceEnter?: number | null
  public readonly exchangePriceExit?: number | null
  public readonly exchangeAdaptiveGrow?: number | null
  public readonly stopLoss?: boolean | null
  public readonly fromToken?: Address | null
  public readonly toToken?: Address | null
  public readonly exchangeAmount?: string | null
  public readonly resultExchangeAmount?: string | null
  public readonly createdAt: Date

  constructor(
    price: number,
    exchangePriceEnter: number | null | undefined,
    exchangePriceExit: number | null | undefined,
    exchangeAdaptiveGrow: number | null | undefined,
    stopLoss: boolean | null | undefined,
    fromToken: Address | null | undefined,
    toToken: Address | null | undefined,
    exchangeAmount: string | null | undefined,
    resultExchangeAmount: string | null | undefined,
    createdAt: Date
  ) {
    this.price = price
    this.exchangePriceEnter = exchangePriceEnter
    this.exchangePriceExit = exchangePriceExit
    this.exchangeAdaptiveGrow = exchangeAdaptiveGrow
    this.stopLoss = stopLoss
    this.fromToken = fromToken
    this.toToken = toToken
    this.exchangeAmount = exchangeAmount
    this.resultExchangeAmount = resultExchangeAmount
    this.createdAt = createdAt
  }
}
