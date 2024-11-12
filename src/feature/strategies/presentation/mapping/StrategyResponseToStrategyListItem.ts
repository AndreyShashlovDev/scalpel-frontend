import { ethers } from 'ethers'
import { SwapResponse } from '../../../../common/repository/data/model/SwapResponse.ts'
import { DateUtils } from '../../../../utils/DateUtils.ts'
import { StrategyResponse } from '../../data/model/StrategyResponse.ts'
import { CurrencyUiModel } from '../model/CurrencyUiModel.ts'
import { StrategyListItem } from '../model/StrategyListItem.ts'
import { SwapUiModel } from '../model/SwapUiModel.ts'

export const StrategyResponseToStrategyListItem = (strategy: StrategyResponse, swaps: SwapResponse[]) => {
  const mapOfToken = new Map([
    [strategy.currencyA.address, strategy.currencyA],
    [strategy.currencyB.address, strategy.currencyB]
  ])

  const swapsUiModels = swaps.map(item => {
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
    strategy.options,
    strategy.currencyA.valueTo(strategy.initialAmountA),
    strategy.approvedA,
    strategy.approvedB,
    strategy.status,
    Number(ethers.formatUnits(strategy.gasLimit, 9)),
    DateUtils.toFormat(strategy.createdAt, DateUtils.DATE_FORMAT_SHORT),
    swapsUiModels,
  )
}
