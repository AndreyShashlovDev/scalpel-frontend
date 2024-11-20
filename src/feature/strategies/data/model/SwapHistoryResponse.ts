import { JsonObject } from '../../../../utils/types.ts'

export class SwapHistoryResponse {

  public static valueOfJson(json: JsonObject<SwapHistoryResponse>): SwapHistoryResponse {
    return new SwapHistoryResponse(
      json.date,
      json.value
    )
  }

  public readonly date: number
  public readonly value: string

  constructor(date: number, value: string) {
    this.date = date
    this.value = value
  }
}
