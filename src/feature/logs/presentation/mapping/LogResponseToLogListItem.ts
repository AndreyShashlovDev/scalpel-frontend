import { DateUtils } from '../../../../utils/DateUtils.ts'
import { LogResponse } from '../../../../common/repository/data/model/LogResponse.ts'
import { LogListItemModel } from '../model/LogListItemModel.ts'

export const LogResponseToLogListItem = (log: LogResponse) => new LogListItemModel(
  log.id.toString(),
  log.id,
  log.type,
  log.log,
  DateUtils.toFormat(log.createdAt, DateUtils.DATE_FORMAT_SHORT)
)
