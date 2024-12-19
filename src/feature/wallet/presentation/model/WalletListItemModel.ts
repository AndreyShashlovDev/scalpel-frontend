import BigNumber from 'bignumber.js'
import { ListItem } from '../../../../common/app-ui/AppInfiniteScrollView.tsx'
import { ChainType } from '../../../../common/repository/data/model/ChainType.ts'
import { CurrencyResponse } from '../../../../common/repository/data/model/CurrencyResponse.ts'
import { Address } from '../../../../utils/types.ts'

export class WalletCurrencyUiModel {

  public readonly currency: CurrencyResponse
  public readonly amount: number
  public readonly usdAmount: number
  public readonly actualBalance?: number
  public readonly actualUsdAmount?: number

  constructor(currency: CurrencyResponse, amount: number, actualBalance: number | undefined) {
    this.currency = currency
    this.amount = amount
    this.actualBalance = actualBalance
    this.usdAmount = amount * new BigNumber(currency.price?.usdtPrice ?? 0).div(new BigNumber(10).pow(6)).toNumber()

    if (actualBalance !== undefined) {
      this.actualUsdAmount = actualBalance *
        new BigNumber(currency.price?.usdtPrice ?? 0).div(new BigNumber(10).pow(6)).toNumber()
    }
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
  public readonly totalValueWalletUsdt: Map<ChainType, number>
  public readonly totalActualValueWalletUsdt: Map<ChainType, number | undefined>

  constructor(
    address: Address,
    name: string | undefined,
    totalOrders: number,
    activeOrders: number,
    totalUsdProfit: number,
    totalFee: Map<ChainType, { eth: number, usd: number | undefined }>,
    currencies: Map<ChainType, WalletCurrencyUiModel[]>,
    totalValueWalletUsdt: Map<ChainType, number>,
    totalActualValueWalletUsdt: Map<ChainType, number | undefined>,
  ) {
    this.hash = address
    this.address = address
    this.name = name
    this.totalOrders = totalOrders
    this.activeOrders = activeOrders
    this.totalUsdProfit = totalUsdProfit
    this.totalFee = totalFee
    this.currencies = currencies
    this.totalValueWalletUsdt = totalValueWalletUsdt
    this.totalActualValueWalletUsdt = totalActualValueWalletUsdt
  }

  public copy(entity: Partial<WalletListItemModel>): WalletListItemModel {
    return Object.assign(Reflect.construct(WalletListItemModel, []), this, entity)
  }
}
