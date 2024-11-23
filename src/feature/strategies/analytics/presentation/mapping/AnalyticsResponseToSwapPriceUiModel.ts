import { AnalyticsResponse } from '../../data/model/AnalyticsResponse.ts'
import { AnalyticsChartUiModel } from '../model/AnalyticsChartUiModel.ts'

export const AnalyticsResponseToSwapPriceUiModel = (response: AnalyticsResponse): AnalyticsChartUiModel => {

  const roundToTenMinutes = (unixtime: number) => Math.floor(unixtime / 60) * 60
  const toUsdt = (value: string): number => Number((Number(value) / 10 ** 6).toFixed(2))

// maps rounded by 10 minutes
  const swapAByDate = new Map(
    response.swapsCurrencyA.map(item => [
      roundToTenMinutes(item.date - 1),
      toUsdt(item.value),
    ])
  )
  const swapBByDate = new Map(
    response.swapsCurrencyB.map(item => [
      roundToTenMinutes(item.date - 1),
      toUsdt(item.value),
    ])
  )

  const result = response.priceCurrencyB.map(priceBItem => {
    const roundedDate = roundToTenMinutes(priceBItem.date)

    return {
      date: new Date(roundedDate * 1000).toISOString(),
      currencyBPrice: toUsdt(priceBItem.value),
      currencyASwapPrice: swapAByDate.get(roundedDate),
      currencyBSwapPrice: swapBByDate.get(roundedDate),
    }
  })

  return new AnalyticsChartUiModel(result)
}
