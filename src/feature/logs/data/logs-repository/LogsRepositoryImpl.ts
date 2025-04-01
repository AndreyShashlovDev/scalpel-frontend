import { Inject, Injectable } from '@di-core/decorator/decorators.ts'
import { LogResponse } from '../../../../common/repository/data/model/LogResponse.ts'
import { Pageable } from '../../../../common/repository/data/model/Pageable.ts'
import { AppSourceService } from '../../../../common/repository/data/source/AppSourceService.ts'
import { LogsRepository } from './LogsRepository.ts'

@Injectable()
export class LogsRepositoryImpl extends LogsRepository {

  constructor(
    @Inject(AppSourceService) private readonly appSourceService: AppSourceService) {
    super()
  }

  public async getLogs(
    strategyHash: string,
    page: number,
    limit: number,
  ): Promise<Pageable<LogResponse>> {
    return this.appSourceService.get<Pageable<LogResponse>, Pageable<LogResponse>>(
      {
        path: `/strategy/${strategyHash}/log/`,
        query: new Map([
          ['page', page.toString()],
          ['limit', limit.toString()],
        ])
      },
      async (response) => {
        if (response.success && response.data) {
          return new Pageable(
            response.data.data.map(LogResponse.valueOfJson),
            response.data.total,
            response.data.page
          )
        }

        throw new Error()
      }
    )
  }
}
