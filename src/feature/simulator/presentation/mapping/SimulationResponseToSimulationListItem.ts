import BigNumber from 'bignumber.js'
import { CurrencyResponse } from '../../../../common/repository/data/model/CurrencyResponse.ts'
import { DateUtils } from '../../../../utils/DateUtils.ts'
import { NumberShortener } from '../../../../utils/Shortener.ts'
import { Address, JsonObject } from '../../../../utils/types.ts'
import { toPercents } from '../../../strategies/presentation/mapping/StrategyResponseToStrategyListItem.ts'
import { SimulationResponse } from '../../data/model/SimulationResponse.ts'
import { ScalpelStrategyOptions, SimulationListItemModel } from '../model/SimulationListItemModel.ts'
import { SimulationResultListItemModel } from '../model/SimulationResultListItemModel.ts'

export const SimulationResponseToSimulationListItem = (response: SimulationResponse) => {
  const opt: JsonObject<ScalpelStrategyOptions> = response.options as JsonObject<ScalpelStrategyOptions>

  const currencyByAddress = new Map<Address, CurrencyResponse>([
    [response.currencyA.address, response.currencyA],
    [response.currencyB.address, response.currencyB],
  ])

  const lastStableValue = (response.latestExchanges.find(item => item.fromToken ===
    response.currencyA.address)?.exchangeAmount ?? response.initialAmountA)
  const profit = response.currencyA.valueTo(new BigNumber(lastStableValue).minus(response.initialAmountA).toString())

  const exchanges = response.latestExchanges.map(item => {
    return new SimulationResultListItemModel(
      item.fromToken ?? '0x',
      item.toToken ?? '0x',
      currencyByAddress.get(item.fromToken ?? '0x')?.symbol ?? '-',
      currencyByAddress.get(item.toToken ?? '0x')?.symbol ?? '-',
      NumberShortener(currencyByAddress.get(item.fromToken ?? '0x')?.valueTo(item.exchangeAmount ?? '0') ?? 0),
      NumberShortener(currencyByAddress.get(item.toToken ?? '0x')?.valueTo(item.resultExchangeAmount ?? '0') ?? 0),
      NumberShortener(item.exchangePriceExit ?? item.exchangePriceEnter ?? 0),
      DateUtils.toFormat(item.createdAt, DateUtils.DATE_FORMAT_SHORT),
    )
  })

  return new SimulationListItemModel(
    response.id,
    response.chain,
    response.type,
    response.currencyA,
    response.currencyB,
    NumberShortener(response.currencyA.valueTo(response.totalAmountA)),
    NumberShortener(response.currencyB.valueTo(response.totalAmountB)),
    {
      growDiffPercentsUp: toPercents(opt.growDiffPercentsUp),
      growDiffPercentsDown: toPercents(opt.growDiffPercentsDown),
      buyMaxPrice: opt.buyMaxPrice ? response.currencyA.valueTo(opt.buyMaxPrice.toString()) : undefined,
      stopLoss: opt.stopLoss ? toPercents(opt.stopLoss) : undefined
    },
    NumberShortener(response.currencyA.valueTo(response.initialAmountA)),
    response.status,
    DateUtils.toFormat(response.fromDate, DateUtils.FORMAT_MM_DD_YYYY),
    DateUtils.toFormat(response.toDate, DateUtils.FORMAT_MM_DD_YYYY),
    response.exchangeCount,
    DateUtils.toFormat(response.createdAt, DateUtils.DATE_FORMAT_SHORT),
    exchanges,
    NumberShortener(profit),
  )
}
