import { ListItem } from '../../../../common/app-ui/presentation/AppInfiniteScrollView.tsx'
import { ChainType } from '../../../../common/repository/data/model/ChainType.ts'
import { WalletCurrency } from '../../../../common/repository/data/model/WalletStatisticResponse.ts'

export class WalletListItemModel implements ListItem {

  public readonly hash: string
  public readonly address: string
  public readonly name: string | undefined
  public readonly totalOrders: number
  public readonly activeOrders: number
  public readonly totalUsdProfit: number
  public readonly currencies: Map<ChainType, WalletCurrency[]>

  constructor(
    address: string,
    name: string | undefined,
    totalOrders: number,
    activeOrders: number,
    totalUsdProfit: number,
    currencies: Map<ChainType, WalletCurrency[]>
  ) {
    this.hash = address
    this.address = address
    this.name = name
    this.totalOrders = totalOrders
    this.activeOrders = activeOrders
    this.totalUsdProfit = totalUsdProfit
    this.currencies = currencies
  }
}
