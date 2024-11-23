import BigNumber from 'bignumber.js'
import { ethers } from 'ethers'
import { CurrencyResponse } from '../../../../common/repository/data/model/CurrencyResponse.ts'
import { SwapResponse } from '../../../../common/repository/data/model/SwapResponse.ts'
import { DateUtils } from '../../../../utils/DateUtils.ts'
import { NumberShortener } from '../../../../utils/Shortener.ts'
import { SwapListItemModel } from '../model/SwapListItemModel.ts'

export const SwapResponseToSwapListItem = (
  swap: SwapResponse,
  currencies: Map<string, CurrencyResponse>
) => {

  const from = currencies.get(swap.currencyFrom)
  const to = currencies.get(swap.currencyTo)

  return new SwapListItemModel(
    swap.id.toString(),
    swap.id,
    swap.chain,
    from?.symbol ?? 'unknown',
    to?.symbol ?? 'unknown',
    swap.currencyFrom,
    swap.currencyTo,
    swap.valueFrom && from ? NumberShortener(from.valueTo(swap.valueFrom)) : undefined,
    swap.valueTo && to ? NumberShortener(to.valueTo(swap.valueTo)) : undefined,
    swap.scalpelFeeAmount,
    swap.accumulatorFeeAmount,
    swap.txHash,
    swap.txFee ? new BigNumber(ethers.formatEther(swap.txFee)).toFixed(4, 1) : undefined,
    swap.state,
    DateUtils.toFormat(swap.updateAt, DateUtils.DATE_FORMAT_SHORT)
  )
}
