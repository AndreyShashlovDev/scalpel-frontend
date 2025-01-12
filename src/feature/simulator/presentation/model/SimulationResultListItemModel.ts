export class SimulationResultListItemModel {

  public readonly addressFrom: string
  public readonly addressTo: string
  public readonly symbolFrom: string
  public readonly symbolTo: string
  public readonly amountFrom: number
  public readonly amountTo: number | string
  public readonly exchangeUsdPrice: number
  public readonly date: string

  constructor(
    addressFrom: string,
    addressTo: string,
    symbolFrom: string,
    symbolTo: string,
    amountFrom: number,
    amountTo: number | string,
    exchangeUsdPrice: number,
    date: string
  ) {
    this.addressFrom = addressFrom
    this.addressTo = addressTo
    this.symbolFrom = symbolFrom
    this.symbolTo = symbolTo
    this.amountFrom = amountFrom
    this.amountTo = amountTo
    this.exchangeUsdPrice = exchangeUsdPrice
    this.date = date
  }
}
