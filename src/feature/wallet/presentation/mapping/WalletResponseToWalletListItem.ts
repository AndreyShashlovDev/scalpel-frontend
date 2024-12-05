import BigNumber from 'bignumber.js'
import { ChainType } from '../../../../common/repository/data/model/ChainType.ts'
import { WalletStatisticResponse } from '../../../../common/repository/data/model/WalletStatisticResponse.ts'
import { WeiToEth } from '../../../../utils/ChainsData.ts'
import { NumberShortener } from '../../../../utils/Shortener.ts'
import { Address } from '../../../../utils/types.ts'
import { WalletCurrencyUiModel, WalletListItemModel } from '../model/WalletListItemModel.ts'

export const WalletResponseToWalletListItem = (
  response: WalletStatisticResponse,
  actualAmount: Map<ChainType, Map<Address, BigNumber>>
) => {
  const fees = new Map(Object.keys(response.txFee)
    .map(key => {
      // @ts-expect-error not error
      const chain = ChainType[key]
      // @ts-expect-error not error
      return [chain, {eth: WeiToEth(response.txFee[chain]), usd: undefined}]
    }))

  const currencies = response.currencies.reduce(
    (acc, curr) => {
      const itemsByChain = acc.get(curr.currency.chain) ?? []
      const totalBalance = actualAmount.get(curr.currency.chain)?.get(curr.currency.address)

      const model = new WalletCurrencyUiModel(
        curr.currency,
        NumberShortener(curr.currency.valueTo(curr.amount)),
        totalBalance ? NumberShortener(curr.currency.valueTo(totalBalance.toString())) : undefined,
      )
      itemsByChain.push(model)

      return acc.set(curr.currency.chain, itemsByChain)
    },
    new Map<ChainType, WalletCurrencyUiModel[]>()
  )

  return new WalletListItemModel(
    response.address,
    response.name,
    response.totalOrders,
    response.activeOrders,
    response.totalUsdProfit,
    fees,
    currencies,
  )
}
