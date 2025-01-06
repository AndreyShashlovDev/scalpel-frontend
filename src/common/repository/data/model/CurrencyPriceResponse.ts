import BigNumber from 'bignumber.js'
import { JsonObject } from '../../../../utils/types.ts'

export class CurrencyPriceResponse {

  private static readonly DECIMALS = new BigNumber(10).pow(6)

  public static valueOfJson(json: JsonObject<CurrencyPriceResponse>): CurrencyPriceResponse {
    return new CurrencyPriceResponse(
      json.address,
      json.usdtPrice,
      json.usdtExchangePrice,
      json.dex,
      new Date(json.createdAt.toString())
    )
  }

  public readonly address: string
  public readonly usdtPrice: string
  public readonly usdtExchangePrice: string
  public readonly dex: string
  public readonly createdAt: Date

  constructor(address: string, usdtPrice: string, usdtExchangePrice: string, dex: string, createdAt: Date) {
    this.address = address
    this.usdtPrice = usdtPrice
    this.usdtExchangePrice = usdtExchangePrice
    this.dex = dex
    this.createdAt = createdAt
  }

  public toUsdValue(): number {
    return new BigNumber(this.usdtPrice ?? 0).div(CurrencyPriceResponse.DECIMALS).toNumber()
  }
}
