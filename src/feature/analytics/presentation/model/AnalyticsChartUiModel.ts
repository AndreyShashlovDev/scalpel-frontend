export class AnalyticsChartUiModel {

  public readonly data: {
    date: string,
    currencyBPrice: number,
    currencyASwapPrice?: number,
    currencyBSwapPrice?: number,
  }[]

  public readonly maxDays: number

  constructor(
    data: {
      date: string;
      currencyBPrice: number;
      currencyASwapPrice?: number;
      currencyBSwapPrice?: number
    }[],
    maxDays: number
  ) {
    this.data = data
    this.maxDays = maxDays
  }
}
