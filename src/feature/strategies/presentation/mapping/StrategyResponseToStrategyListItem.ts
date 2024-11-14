import { ethers } from 'ethers'
import { CurrencyResponse } from '../../../../common/repository/data/model/CurrencyResponse.ts'
import { StrategyType } from '../../../../common/repository/data/model/StrategyType.ts'
import { SwapResponse } from '../../../../common/repository/data/model/SwapResponse.ts'
import { DateUtils } from '../../../../utils/DateUtils.ts'
import { JsonObject } from '../../../../utils/types.ts'
import { StrategyResponse } from '../../data/model/StrategyResponse.ts'
import { ScalpelClassicStrategyOptions } from '../components/strategy-list/holder/ScalpelClassicStrategyHolderView.tsx'
import { CurrencyUiModel } from '../model/CurrencyUiModel.ts'
import { StrategyListItem } from '../model/StrategyListItem.ts'
import { SwapUiModel } from '../model/SwapUiModel.ts'

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
  swaps: SwapResponse[] | SwapUiModel[]
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
        from.symbol,
        to.symbol,
        from.valueTo(item.valueFrom),
        to.valueTo(item.valueTo),
        item.txHash,
        item.state,
        DateUtils.toFormat(item.updateAt, DateUtils.DATE_FORMAT_SHORT),
      )
    })

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
    strategy.currencyA.valueTo(strategy.totalAmountA),
    strategy.currencyB.valueTo(strategy.totalAmountB),
    convertOptionsByStrategy(strategy.type, strategy.options, strategy.currencyA),
    strategy.currencyA.valueTo(strategy.initialAmountA),
    strategy.approvedA,
    strategy.approvedB,
    strategy.status,
    Number(ethers.formatUnits(strategy.gasLimit, 9)),
    DateUtils.toFormat(strategy.createdAt, DateUtils.DATE_FORMAT_SHORT),
    swapsUiModels,
    false /*waitChangeStatusPlayPause: boolean*/,
    false /*waitChangeStatusCancel: boolean*/,
  )
}
