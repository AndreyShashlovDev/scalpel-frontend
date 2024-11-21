import { JsonObject } from '../../../../../utils/types.ts'
import { SimpleHistoryResponse } from '../../../data/model/SimpleHistoryResponse.ts'

export class AnalyticsResponse {

  public static valueOfJson(json: JsonObject<AnalyticsResponse>): AnalyticsResponse {
    return new AnalyticsResponse(
      json.swapsCurrencyA.map(SimpleHistoryResponse.valueOfJson),
      json.swapsCurrencyB.map(SimpleHistoryResponse.valueOfJson),
      json.priceCurrencyB.map(SimpleHistoryResponse.valueOfJson),
    )
  }

  public readonly swapsCurrencyA: SimpleHistoryResponse[]
  public readonly swapsCurrencyB: SimpleHistoryResponse[]
  public readonly priceCurrencyB: SimpleHistoryResponse[]

  constructor(
    swapsCurrencyA: SimpleHistoryResponse[],
    swapsCurrencyB: SimpleHistoryResponse[],
    priceCurrencyB: SimpleHistoryResponse[]
  ) {
    this.swapsCurrencyA = swapsCurrencyA
    this.swapsCurrencyB = swapsCurrencyB
    this.priceCurrencyB = priceCurrencyB
  }
}
