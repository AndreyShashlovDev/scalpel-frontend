import { ethers } from 'ethers'
import { CurrencyResponse } from '../../../../common/repository/data/model/CurrencyResponse.ts'
import { LogResponse } from '../../../../common/repository/data/model/LogResponse.ts'
import { StrategyType } from '../../../../common/repository/data/model/StrategyType.ts'
import { SwapResponse } from '../../../../common/repository/data/model/SwapResponse.ts'
import { DateUtils } from '../../../../utils/DateUtils.ts'
import { JsonObject } from '../../../../utils/types.ts'
import { StrategyResponse, StrategyStatusType } from '../../data/model/StrategyResponse.ts'
import { SwapHistoryResponse } from '../../data/model/SwapHistoryResponse.ts'
import { ScalpelClassicStrategyOptions } from '../components/strategy-list/holder/ScalpelClassicStrategyHolderView.tsx'
import { CurrencyUiModel } from '../model/CurrencyUiModel.ts'
import { LogUiModel } from '../model/LogUiModel.ts'
import { StrategyListItem } from '../model/StrategyListItem.ts'
import { SwapHistoryUiModel } from '../model/SwapHistoryUiModel.ts'
import { SwapUiModel } from '../model/SwapUiModel.ts'

const mapStrategyStatus = new Map<StrategyStatusType, string>([
  [StrategyStatusType.CREATED, 'Created'],
  [StrategyStatusType.APPROVE_IN_PROGRESS, 'Tokens approve in progress'],
  [StrategyStatusType.IN_PROGRESS, 'In progress'],
  [StrategyStatusType.USER_ACTION_REQUIRED, 'User action required'],
  [StrategyStatusType.PAUSED, 'Paused'],
  [StrategyStatusType.CANCELED, 'Canceled'],
])

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
      growDiffPercents: obj.growDiffPercents ? obj.growDiffPercents * 100 : undefined,
      growDiffPercentsDown: obj.growDiffPercentsDown ? obj.growDiffPercentsDown * 100 : undefined,
      growDiffPercentsUp: obj.growDiffPercentsUp ? obj.growDiffPercentsUp * 100 : undefined,
      buyMaxPrice: obj.buyMaxPrice ? tokenA.valueTo(obj.buyMaxPrice.toString()) : undefined
    }

    return res
  }

  throw new Error(`unknown type ${type}`)
}

export const StrategyResponseToStrategyListItem = (
  strategy: StrategyResponse,
  swaps: SwapResponse[] | SwapUiModel[],
  logs: LogResponse[] | LogUiModel[],
  swapHistory: SwapHistoryResponse[] | SwapHistoryUiModel[],
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
        from.valueTo(item.valueFrom),
        to.valueTo(item.valueTo),
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
    : (swapHistory as SwapHistoryResponse[]).map(item => new SwapHistoryUiModel(
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
    currencyBPrice,
    strategy.currencyA.valueTo(strategy.totalAmountA),
    strategy.currencyB.valueTo(strategy.totalAmountB),
    convertOptionsByStrategy(strategy.type, strategy.options, strategy.currencyA),
    initialAmountA,
    strategy.approvedA,
    strategy.approvedB,
    strategy.status,
    mapStrategyStatus.get(strategy.status) ?? 'unknown',
    Number(ethers.formatUnits(strategy.gasLimit, 9)),
    DateUtils.toFormat(strategy.createdAt, DateUtils.DATE_FORMAT_SHORT),
    swapsUiModels,
    false /*waitChangeStatusPlayPause: boolean*/,
    false /*waitChangeStatusCancel: boolean*/,
    logsModels,
    totalUsdProfit,
    history,
  )
}
