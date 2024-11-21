export class AnalyticsChartUiModel {

  public readonly data: {
    date: string,
    currencyBPrice: number,
    currencyASwapPrice?: number,
    currencyBSwapPrice?: number,
  }[]

  constructor(data: {
    date: string;
    currencyBPrice: number;
    currencyASwapPrice?: number;
    currencyBSwapPrice?: number
  }[]) {
    this.data = data
  }
}
