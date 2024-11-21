import { AppSourceService } from '../../../../../common/repository/data/source/AppSourceService.ts'
import { AnalyticsResponse } from '../model/AnalyticsResponse.ts'
import { AnalyticsRepository } from './AnalyticsRepository.ts'

export class AnalyticsRepositoryImpl extends AnalyticsRepository {

  constructor(private readonly appSourceService: AppSourceService) {
    super()
  }

  public async getAnalytics(
    strategyHash: string,
  ): Promise<AnalyticsResponse> {
    const result = await this.appSourceService.get<AnalyticsResponse>(`/strategy/${strategyHash}/analytics/`)

    if (result.success && result.data) {
      return AnalyticsResponse.valueOfJson(result.data)
    }

    throw new Error()
  }
}
