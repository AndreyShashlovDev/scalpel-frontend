export class ChangeOptionsRequest {

  public readonly diffPercentUp?: number
  public readonly diffPercentDown?: number
  public readonly maxBuyPrice?: number | null
  public readonly maxGasPrice?: number
  public readonly stopLossPercents?: number | null

  constructor(
    diffPercentUp: number,
    diffPercentDown: number,
    maxBuyPrice: number | null,
    maxGasPrice: number,
    stopLossPercents: number | null
  ) {
    this.diffPercentUp = diffPercentUp
    this.diffPercentDown = diffPercentDown
    this.maxBuyPrice = maxBuyPrice
    this.maxGasPrice = maxGasPrice
    this.stopLossPercents = stopLossPercents
  }
}
