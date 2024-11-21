import BigNumber from 'bignumber.js'
import { ethers } from 'ethers'
import { CurrencyResponse } from '../../../../common/repository/data/model/CurrencyResponse.ts'
import { SwapResponse, SwapState } from '../../../../common/repository/data/model/SwapResponse.ts'
import { DateUtils } from '../../../../utils/DateUtils.ts'
import { SwapListItemModel } from '../model/SwapListItemModel.ts'

const StateText = new Map<SwapState, string>([
  [SwapState.WAIT_FOR_ACTION, 'Wait user action'],
  [SwapState.WAIT_EXECUTION, 'Wait for execute'],
  [SwapState.EXECUTION, 'Execution in progress'],
  [SwapState.EXECUTION_SUCCESS, 'Tx executed success'],
  [SwapState.EXECUTION_FAILED, 'Tx failed'],
  [SwapState.FAILED, 'Failed'],
  [SwapState.CANCELLED, 'Canceled'],
])

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
    swap.valueFrom ? from?.valueTo(swap.valueFrom) : undefined,
    swap.valueTo ? to?.valueTo(swap.valueTo) : undefined,
    swap.scalpelFeeAmount,
    swap.accumulatorFeeAmount,
    swap.txHash,
    swap.txFee ? new BigNumber(ethers.formatEther(swap.txFee)).toFixed(4, 1) : undefined,
    swap.state,
    StateText.get(swap.state) ?? 'unknown state',
    DateUtils.toFormat(swap.updateAt, DateUtils.DATE_FORMAT_SHORT2)
  )
}
