import { JsonObject } from '../../../../utils/types.ts'

export class SimpleHistoryResponse {

  public static valueOfJson(json: JsonObject<SimpleHistoryResponse>): SimpleHistoryResponse {
    return new SimpleHistoryResponse(
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
