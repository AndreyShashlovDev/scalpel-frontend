import { AnalyticsResponse } from '../../data/model/AnalyticsResponse.ts'
import { AnalyticsChartUiModel } from '../model/AnalyticsChartUiModel.ts'

export const AnalyticsResponseToSwapPriceUiModel = (response: AnalyticsResponse): AnalyticsChartUiModel => {

  const roundToMinute = (unixtime: number) => Math.floor(unixtime / 60) * 60

  const swapAByDate = new Map(response.swapsCurrencyA.map(item => [
    roundToMinute(item.date),
    (Number(item.value) / 10 ** 6)
  ]))
  const swapBByDate = new Map(response.swapsCurrencyB.map(item => [
    roundToMinute(item.date),
    (Number(item.value) / 10 ** 18)
  ]))

  // Основной результат
  const result = response.priceCurrencyB.map(priceBItem => {
    const roundedDate = roundToMinute(priceBItem.date)

    return {
      date: new Date(roundedDate * 1000).toISOString(),
      currencyBPrice: (Number(priceBItem.value) / 10 ** 6),
      currencyASwapPrice: swapAByDate.get(roundedDate),
      currencyBSwapPrice: swapBByDate.get(roundedDate),
    }
  })

  return new AnalyticsChartUiModel(result)
}
