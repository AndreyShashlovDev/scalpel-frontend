import { Inject, Injectable } from '@di-core/decorator/decorators.ts'
import { AppSourceService } from '../../../../common/repository/data/source/AppSourceService.ts'
import { UnknownException } from '../../../../common/repository/data/source/exception/UnknownException.ts'
import { AnalyticsResponse } from '../model/AnalyticsResponse.ts'
import { AnalyticsRange } from './AnalyticsRange.ts'
import { AnalyticsRepository } from './AnalyticsRepository.ts'

@Injectable()
export class AnalyticsRepositoryImpl extends AnalyticsRepository {

  constructor(
    @Inject(AppSourceService) private readonly appSourceService: AppSourceService
  ) {
    super()
  }

  public async getAnalytics(
    strategyHash: string,
    range: AnalyticsRange,
  ): Promise<AnalyticsResponse> {
    return this.appSourceService.get<AnalyticsResponse, AnalyticsResponse>(
      {
        path: `/strategy/${strategyHash}/analytics/`,
        query: new Map([
          ['range', range.toString()]
        ])
      },
      async (response) => {
        if (response.success && response.data) {
          return AnalyticsResponse.valueOfJson(response.data)
        }

        throw UnknownException.create('Cannot receive analytics')
      }
    )
  }
}
