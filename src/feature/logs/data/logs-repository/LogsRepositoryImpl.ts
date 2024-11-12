import { Pageable } from '../../../../common/repository/data/model/Pageable.ts'
import { AppSourceService } from '../../../../common/repository/data/source/AppSourceService.ts'
import { LogResponse } from '../model/LogResponse.ts'
import { LogsRepository } from './LogsRepository.ts'

export class LogsRepositoryImpl extends LogsRepository {

  constructor(private readonly appSourceService: AppSourceService) {
    super()
  }

  public async getLogs(
    strategyHash: string,
    page: number,
    limit: number,
  ): Promise<Pageable<LogResponse>> {
    const result = await this.appSourceService.get<Pageable<LogResponse>>(`/strategy/${strategyHash}/log/`, {
      query: new Map([
        ['page', page.toString()],
        ['limit', limit.toString()],
      ])
    })

    if (result.success && result.data) {
      return new Pageable(
        result.data.data.map(LogResponse.valueOfJson),
        result.data.total,
        result.data.page
      )
    }

    throw new Error()
  }
}
