import { ListItem } from '../../../../common/app-ui/presentation/AppInfiniteScrollView.tsx'
import { JsonObject } from '../../../../utils/types.ts'
import { LogType } from '../../data/model/LogResponse.ts'

export class LogListItemModel implements ListItem {

  public readonly hash: string
  public readonly id: number
  public readonly type: LogType
  public readonly log: JsonObject<unknown>
  public readonly createdAt: string

  constructor(hash: string, id: number, type: LogType, log: JsonObject<unknown>, createdAt: string) {
    this.hash = hash
    this.id = id
    this.type = type
    this.log = log
    this.createdAt = createdAt
  }
}
