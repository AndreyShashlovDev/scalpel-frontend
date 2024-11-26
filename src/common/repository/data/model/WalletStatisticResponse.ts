import { JsonObject } from '../../../../utils/types.ts'
import { CurrencyResponse } from './CurrencyResponse.ts'

export class WalletCurrency {

  public static valueOfJson(json: JsonObject<WalletCurrency>): WalletCurrency {
    return new WalletCurrency(
      CurrencyResponse.valueOfJson(json.currency),
      json.amount
    )
  }

  public readonly currency: CurrencyResponse
  public readonly amount: string

  constructor(currency: CurrencyResponse, amount: string) {
    this.currency = currency
    this.amount = amount
  }
}

export class WalletStatisticResponse {

  public static valueOfJson(json: JsonObject<WalletStatisticResponse>): WalletStatisticResponse {
    return new WalletStatisticResponse(
      json.address,
      json.name,
      json.totalOrders,
      json.activeOrders,
      json.totalUsdProfit,
      json.currencies.map(WalletCurrency.valueOfJson)
    )
  }

  public readonly address: string
  public readonly name: string | undefined
  public readonly totalOrders: number
  public readonly activeOrders: number
  public readonly totalUsdProfit: number
  public readonly currencies: WalletCurrency[]

  constructor(
    address: string,
    name: string | undefined,
    totalOrders: number,
    activeOrders: number,
    totalUsdProfit: number,
    currencies: WalletCurrency[]
  ) {
    this.address = address
    this.name = name
    this.totalOrders = totalOrders
    this.activeOrders = activeOrders
    this.totalUsdProfit = totalUsdProfit
    this.currencies = currencies
  }
}
