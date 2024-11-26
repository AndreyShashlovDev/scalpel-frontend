import { ChainType } from '../../../../common/repository/data/model/ChainType.ts'
import {
  WalletCurrency,
  WalletStatisticResponse
} from '../../../../common/repository/data/model/WalletStatisticResponse.ts'
import { WalletListItemModel } from '../model/WalletListItemModel.ts'

export const WalletResponseToWalletListItem = (response: WalletStatisticResponse) => new WalletListItemModel(
  response.address,
  response.name,
  response.totalOrders,
  response.activeOrders,
  response.totalUsdProfit,
  response.currencies.reduce(
    (acc, curr) => {
      const itemsByChain = acc.get(curr.currency.chain) ?? []
      itemsByChain.push(curr)
      return acc.set(curr.currency.chain, itemsByChain)
    },
    new Map<ChainType, WalletCurrency[]>()
  ),
)
