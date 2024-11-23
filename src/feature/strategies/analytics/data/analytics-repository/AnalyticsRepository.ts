import { AnalyticsResponse } from '../model/AnalyticsResponse.ts'
import { AnalyticsRange } from './AnalyticsRange.ts'

export abstract class AnalyticsRepository {

  public abstract getAnalytics(strategyHash: string, range: AnalyticsRange): Promise<AnalyticsResponse>
}
