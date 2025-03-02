import BigNumber from 'bignumber.js'
import { StrategyResponse } from '../../../../common/repository/data/model/StrategyResponse.ts'
import { SwapResponse } from '../../../../common/repository/data/model/SwapResponse.ts'
import { DateUtils } from '../../../../utils/DateUtils.ts'
import { WeiToEther } from '../../../../utils/EthUnits.ts'
import { NumberShortener } from '../../../../utils/Shortener.ts'
import { SwapListItemModel } from '../model/SwapListItemModel.ts'

export const SwapResponseToSwapListItem = (
  swap: SwapResponse,
  strategy: StrategyResponse,
) => {
  const from = swap.currencyFrom === strategy.currencyA.address ? strategy.currencyA : strategy.currencyB
  const to = swap.currencyTo === strategy.currencyA.address ? strategy.currencyA : strategy.currencyB

  const valueTo = swap.valueTo ? NumberShortener(to.valueTo(swap.valueTo)) : undefined
  const profit = swap.profit ? NumberShortener(strategy.currencyA.valueTo(swap.profit)) : undefined
  const profitPercent = profit && valueTo ? NumberShortener((profit / (valueTo - profit)) * 100) : undefined

  return new SwapListItemModel(
    swap.id.toString(),
    swap.id,
    swap.chain,
    from?.symbol ?? 'unknown',
    to?.symbol ?? 'unknown',
    swap.currencyFrom,
    swap.currencyTo,
    strategy.currencyB.address,
    swap.valueFrom ? NumberShortener(from.valueTo(swap.valueFrom)) : undefined,
    valueTo,
    NumberShortener(strategy.currencyA.valueTo(swap.exchangeUsdPrice)),
    profit,
    profitPercent,
    swap.scalpelFeeAmount,
    swap.accumulatorFeeAmount,
    swap.txHash,
    swap.txFee ? new BigNumber(WeiToEther(swap.txFee)).toFixed(4, 1) : undefined,
    swap.state,
    DateUtils.toFormat(swap.updateAt, DateUtils.DATE_FORMAT_SHORT)
  )
}
