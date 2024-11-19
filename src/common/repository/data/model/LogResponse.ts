import { JsonObject } from '../../../../utils/types.ts'

export enum LogType {
  SWAP = 'SWAP'
}

export class LogResponse {

  public static valueOfJson(json: JsonObject<LogResponse>): LogResponse {
    return new LogResponse(
      json.id,
      LogType[json.type],
      json.log,
      new Date(json.createdAt.toString()),
    )
  }

  public readonly id: number
  public readonly type: LogType
  public readonly log: JsonObject<unknown>
  public readonly createdAt: Date

  constructor(id: number, type: LogType, log: JsonObject<unknown>, createdAt: Date) {
    this.id = id
    this.type = type
    this.log = log
    this.createdAt = createdAt
  }
}
