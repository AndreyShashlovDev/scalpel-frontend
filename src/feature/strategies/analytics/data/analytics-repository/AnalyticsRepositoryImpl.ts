import { AppSourceService } from '../../../../../common/repository/data/source/AppSourceService.ts'
import { AnalyticsResponse } from '../model/AnalyticsResponse.ts'
import { AnalyticsRange } from './AnalyticsRange.ts'
import { AnalyticsRepository } from './AnalyticsRepository.ts'

export class AnalyticsRepositoryImpl extends AnalyticsRepository {

  constructor(private readonly appSourceService: AppSourceService) {
    super()
  }

  public async getAnalytics(
    strategyHash: string,
    range: AnalyticsRange,
  ): Promise<AnalyticsResponse> {
    const result = await this.appSourceService.get<AnalyticsResponse>(
      `/strategy/${strategyHash}/analytics/`,
      {
        query: new Map([
          ['range', range.toString()]
        ])
      }
    )

    if (result.success && result.data) {
      return AnalyticsResponse.valueOfJson(result.data)
    }

    throw new Error()
  }
}
