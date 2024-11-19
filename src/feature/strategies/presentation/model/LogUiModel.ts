export class LogUiModel {

  public readonly diff: number
  public readonly trend: string
  public readonly createdAt: string

  constructor(diff: number, trend: string, createdAt: string) {
    this.diff = diff
    this.trend = trend
    this.createdAt = createdAt
  }
}
