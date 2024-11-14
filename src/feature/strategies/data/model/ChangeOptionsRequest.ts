export class ChangeOptionsRequest {

  public readonly diffPercentUp?: number
  public readonly diffPercentDown?: number
  public readonly maxBuyPrice?: number | null
  public readonly maxGasPrice?: number

  constructor(diffPercentUp: number, diffPercentDown: number, maxBuyPrice: number | null, maxGasPrice: number) {
    this.diffPercentUp = diffPercentUp
    this.diffPercentDown = diffPercentDown
    this.maxBuyPrice = maxBuyPrice
    this.maxGasPrice = maxGasPrice
  }
}
