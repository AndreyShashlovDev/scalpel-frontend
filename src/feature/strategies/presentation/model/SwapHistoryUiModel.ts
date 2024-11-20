export class SwapHistoryUiModel {

  public readonly date: Date
  public readonly value: number

  constructor(date: Date, value: number) {
    this.date = date
    this.value = value
  }
}
