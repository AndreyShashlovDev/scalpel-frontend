import { ListItem } from '../../../../common/app-ui/presentation/AppInfiniteScrollView.tsx'
import { ChainType } from '../../../../common/repository/data/model/ChainType.ts'
import { CurrencyResponse } from '../../../../common/repository/data/model/CurrencyResponse.ts'
import { Address } from '../../../../utils/types.ts'

export class WalletCurrencyUiModel {

  public readonly currency: CurrencyResponse
  public readonly amount: number
  public readonly actualBalance?: number

  constructor(currency: CurrencyResponse, amount: number, actualBalance: number | undefined) {
    this.currency = currency
    this.amount = amount
    this.actualBalance = actualBalance
  }
}

export class WalletListItemModel implements ListItem {

  public readonly hash: string
  public readonly address: Address
  public readonly name: string | undefined
  public readonly totalOrders: number
  public readonly activeOrders: number
  public readonly totalUsdProfit: number
  public readonly totalFee: Map<ChainType, { eth: number, usd: number | undefined }>
  public readonly currencies: Map<ChainType, WalletCurrencyUiModel[]>

  constructor(
    address: Address,
    name: string | undefined,
    totalOrders: number,
    activeOrders: number,
    totalUsdProfit: number,
    totalFee: Map<ChainType, { eth: number, usd: number | undefined }>,
    currencies: Map<ChainType, WalletCurrencyUiModel[]>,
  ) {
    this.hash = address
    this.address = address
    this.name = name
    this.totalOrders = totalOrders
    this.activeOrders = activeOrders
    this.totalUsdProfit = totalUsdProfit
    this.totalFee = totalFee
    this.currencies = currencies
  }

  public copy(entity: Partial<WalletListItemModel>): WalletListItemModel {
    return Object.assign(Reflect.construct(WalletListItemModel, []), this, entity)
  }
}
