import { ChainType } from '../../../../common/repository/data/model/ChainType.ts'
import {
  WalletCurrency,
  WalletStatisticResponse
} from '../../../../common/repository/data/model/WalletStatisticResponse.ts'
import { WeiToEth } from '../../../../utils/ChainsData.ts'
import { WalletListItemModel } from '../model/WalletListItemModel.ts'

export const WalletResponseToWalletListItem = (response: WalletStatisticResponse) => {
  const fees = new Map(Object.keys(response.txFee)
    .map(key => {
      // @ts-expect-error not error
      const chain = ChainType[key]
      // @ts-expect-error not error
      return [chain, {eth: WeiToEth(response.txFee[chain]), usd: undefined}]
    }))

  return new WalletListItemModel(
    response.address,
    response.name,
    response.totalOrders,
    response.activeOrders,
    response.totalUsdProfit,
    fees,
    response.currencies.reduce(
      (acc, curr) => {
        const itemsByChain = acc.get(curr.currency.chain) ?? []
        itemsByChain.push(curr)
        return acc.set(curr.currency.chain, itemsByChain)
      },
      new Map<ChainType, WalletCurrency[]>()
    ),
  )
}
