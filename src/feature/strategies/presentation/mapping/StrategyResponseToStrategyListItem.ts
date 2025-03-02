import { CurrencyResponse } from '../../../../common/repository/data/model/CurrencyResponse.ts'
import { LogResponse } from '../../../../common/repository/data/model/LogResponse.ts'
import { StrategyResponse } from '../../../../common/repository/data/model/StrategyResponse.ts'
import { StrategyType } from '../../../../common/repository/data/model/StrategyType.ts'
import { SwapResponse } from '../../../../common/repository/data/model/SwapResponse.ts'
import { DateUtils } from '../../../../utils/DateUtils.ts'
import { GweiToEther } from '../../../../utils/EthUnits.ts'
import { NumberShortener } from '../../../../utils/Shortener.ts'
import { JsonObject } from '../../../../utils/types.ts'
import { SimpleHistoryResponse } from '../../data/model/SimpleHistoryResponse.ts'
import { ScalpelClassicStrategyOptions } from '../components/strategy-list/holder/ScalpelClassicStrategyHolderView.tsx'
import { CurrencyUiModel } from '../model/CurrencyUiModel.ts'
import { LogUiModel } from '../model/LogUiModel.ts'
import { StrategyListItem } from '../model/StrategyListItem.ts'
import { SwapHistoryUiModel } from '../model/SwapHistoryUiModel.ts'
import { SwapUiModel } from '../model/SwapUiModel.ts'

export const toPercents = (value: number) => Math.round((value * 100) * 100000) / 100000

const convertOptionsByStrategy = (
  type: StrategyType,
  options: JsonObject<unknown>,
  tokenA: CurrencyResponse,
): JsonObject<unknown> => {
  if (type === StrategyType.CLASSIC_SCALPEL ||
    type === StrategyType.CLASSIC_SCALPEL_TEST ||
    type === StrategyType.CLASSIC_SCALPEL_TEST_V2
  ) {
    const obj = options as ScalpelClassicStrategyOptions
    const res: ScalpelClassicStrategyOptions = {
      growDiffPercents: obj.growDiffPercents ? toPercents(obj.growDiffPercents) : undefined,
      growDiffPercentsDown: obj.growDiffPercentsDown ? toPercents(obj.growDiffPercentsDown) : undefined,
      growDiffPercentsUp: obj.growDiffPercentsUp ? toPercents(obj.growDiffPercentsUp) : undefined,
      buyMaxPrice: obj.buyMaxPrice ? tokenA.valueTo(obj.buyMaxPrice.toString()) : undefined,
      stopLossPercents: obj.stopLossPercents ? toPercents(obj.stopLossPercents) : undefined,
    }

    return res
  }

  throw new Error(`unknown type ${type}`)
}

export const StrategyResponseToStrategyListItem = (
  strategy: StrategyResponse,
  swaps: SwapResponse[] | SwapUiModel[],
  logs: LogResponse[] | LogUiModel[],
  swapHistory: SimpleHistoryResponse[] | SwapHistoryUiModel[],
) => {
  const mapOfToken = new Map([
    [strategy.currencyA.address, strategy.currencyA],
    [strategy.currencyB.address, strategy.currencyB]
  ])

  const swapsUiModels = (swaps[0] instanceof SwapUiModel)
    ? swaps as SwapUiModel[]
    : (swaps as SwapResponse[]).map(item => {
      const from = mapOfToken.get(item.currencyFrom)!
      const to = mapOfToken.get(item.currencyTo)!

      return new SwapUiModel(
        from.address,
        to.address,
        from.symbol,
        to.symbol,
        NumberShortener(from.valueTo(item.valueFrom)),
        item.valueTo ? NumberShortener(to.valueTo(item.valueTo)) : '?',
        NumberShortener(strategy.currencyA.valueTo(item.exchangeUsdPrice)),
        item.txHash,
        item.state,
        DateUtils.toFormat(item.updateAt, DateUtils.DATE_FORMAT_SHORT),
      )
    })

  const currencyBPrice = strategy.currencyB.price
    ? strategy.currencyA.valueTo(strategy.currencyB.price.usdtPrice)
    : undefined

  const logsModels = logs[0] instanceof LogUiModel
    ? logs as LogUiModel[]
    : (logs as LogResponse[]).map(item => new LogUiModel(
      // @ts-expect-error swap has diff
      item.log.diff,
      // @ts-expect-error swap has trend
      item.log.trend,
      DateUtils.toFormat(item.createdAt, DateUtils.DATE_FORMAT_SHORT)
    ))

  const history: SwapHistoryUiModel[] = swapHistory[0] instanceof SwapHistoryUiModel
    ? swapHistory as SwapHistoryUiModel[]
    : (swapHistory as SimpleHistoryResponse[]).map(item => new SwapHistoryUiModel(
      new Date(item.date * 1000),
      strategy.currencyA.valueTo(item.value)
    ))

  const initialAmountA = strategy.currencyA.valueTo(strategy.initialAmountA)

  const totalUsdProfit = Number(
    history.reduce((previousValue, currentValue) => previousValue +
      ((currentValue.value - initialAmountA) - previousValue), 0)
      .toFixed(4)
  )

  return new StrategyListItem(
    strategy.chain,
    strategy.type,
    strategy.orderHash,
    strategy.wallet,
    new CurrencyUiModel(
      strategy.currencyA.symbol,
      strategy.currencyA.name,
      strategy.currencyA.address,
    ),
    new CurrencyUiModel(
      strategy.currencyB.symbol,
      strategy.currencyB.name,
      strategy.currencyB.address,
    ),
    NumberShortener(currencyBPrice ?? 0),
    NumberShortener(strategy.currencyA.valueTo(strategy.totalAmountA)),
    NumberShortener(strategy.currencyB.valueTo(strategy.totalAmountB)),
    NumberShortener(strategy.currencyB.valueTo(strategy.totalAmountB) * (currencyBPrice ?? 0)),
    strategy.adaptiveUsdPrice ? strategy.currencyA.valueTo(strategy.adaptiveUsdPrice) : undefined,
    convertOptionsByStrategy(strategy.type, strategy.options, strategy.currencyA),
    NumberShortener(initialAmountA),
    strategy.approvedA,
    strategy.approvedB,
    strategy.status,
    GweiToEther(strategy.gasLimit),
    DateUtils.toFormat(strategy.createdAt, DateUtils.DATE_FORMAT_SHORT_NUMERIC),
    swapsUiModels,
    false /*waitChangeStatusPlayPause: boolean*/,
    false /*waitChangeStatusCancel: boolean*/,
    false, /* wait force execute */
    logsModels,
    NumberShortener(totalUsdProfit),
    history,
  )
}
