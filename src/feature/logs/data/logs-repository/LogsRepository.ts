import { Pageable } from '../../../../common/repository/data/model/Pageable.ts'
import { LogResponse } from '../../../../common/repository/data/model/LogResponse.ts'

export abstract class LogsRepository {

  public abstract getLogs(
    strategyHash: string,
    page: number,
    limit: number,
  ): Promise<Pageable<LogResponse>>
}
