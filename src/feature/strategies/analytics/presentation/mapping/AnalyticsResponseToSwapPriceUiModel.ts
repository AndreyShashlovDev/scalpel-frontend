import { DateUtils } from '../../../../../utils/DateUtils.ts'
import { AnalyticsRange } from '../../data/analytics-repository/AnalyticsRange.ts'
import { AnalyticsResponse } from '../../data/model/AnalyticsResponse.ts'
import { AnalyticsChartUiModel } from '../model/AnalyticsChartUiModel.ts'

export const AnalyticsResponseToSwapPriceUiModel = (
  response: AnalyticsResponse,
  range: AnalyticsRange
): AnalyticsChartUiModel => {

  const roundToTenMinutes = (unixtime: number) => Math.floor(unixtime / 600) * 600
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

  let rangeFormat = DateUtils.FORMAT_MMMM_DD

  if (range === AnalyticsRange.DAY) {
    rangeFormat = DateUtils.FORMAT_DD_HH_MM

  } else if (range === AnalyticsRange.WEEK || range === AnalyticsRange.MONTH) {
    rangeFormat = DateUtils.FORMAT_DD_HH_MM

  } else if (range === AnalyticsRange.ALL) {
    rangeFormat = DateUtils.FORMAT_MM_DD_YYYY
  }

  const result = response.priceCurrencyB.map(priceBItem => {
    const roundedDate = roundToTenMinutes(priceBItem.date)

    return {
      date: DateUtils.toFormat(roundedDate * 1000, rangeFormat),
      currencyBPrice: toUsdt(priceBItem.value),
      currencyASwapPrice: swapAByDate.get(roundedDate),
      currencyBSwapPrice: swapBByDate.get(roundedDate),
    }
  })

  return new AnalyticsChartUiModel(result)
}
