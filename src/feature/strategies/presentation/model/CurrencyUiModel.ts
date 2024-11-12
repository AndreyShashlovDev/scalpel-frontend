export class CurrencyUiModel {

  public readonly symbol: string
  public readonly name: string
  public readonly address: string

  constructor(symbol: string, name: string, address: string) {
    this.symbol = symbol
    this.name = name
    this.address = address
  }
}
