import { AnalyticsResponse } from '../model/AnalyticsResponse.ts'

export abstract class AnalyticsRepository {

  public abstract getAnalytics(strategyHash: string): Promise<AnalyticsResponse>
}
