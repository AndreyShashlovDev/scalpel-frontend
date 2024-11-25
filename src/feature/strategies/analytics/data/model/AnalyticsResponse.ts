import { JsonObject } from '../../../../../utils/types.ts'
import { SimpleHistoryResponse } from '../../../data/model/SimpleHistoryResponse.ts'

export class AnalyticsResponse {

  public static valueOfJson(json: JsonObject<AnalyticsResponse>): AnalyticsResponse {
    return new AnalyticsResponse(
      json.swapsCurrencyA.map(SimpleHistoryResponse.valueOfJson),
      json.swapsCurrencyB.map(SimpleHistoryResponse.valueOfJson),
      json.priceCurrencyB.map(SimpleHistoryResponse.valueOfJson),
      json.maxDays,
    )
  }

  public readonly swapsCurrencyA: SimpleHistoryResponse[]
  public readonly swapsCurrencyB: SimpleHistoryResponse[]
  public readonly priceCurrencyB: SimpleHistoryResponse[]
  public readonly maxDays: number

  constructor(
    swapsCurrencyA: SimpleHistoryResponse[],
    swapsCurrencyB: SimpleHistoryResponse[],
    priceCurrencyB: SimpleHistoryResponse[],
    maxDays: number,
  ) {
    this.swapsCurrencyA = swapsCurrencyA
    this.swapsCurrencyB = swapsCurrencyB
    this.priceCurrencyB = priceCurrencyB
    this.maxDays = maxDays
  }
}
