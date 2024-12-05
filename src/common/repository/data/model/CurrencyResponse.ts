import BigNumber from 'bignumber.js'
import { Address, JsonObject } from '../../../../utils/types.ts'
import { ChainType } from './ChainType.ts'
import { CurrencyPriceResponse } from './CurrencyPriceResponse.ts'

export class CurrencyResponse {

  public static valueOfJson(json: JsonObject<CurrencyResponse>): CurrencyResponse {
    return new CurrencyResponse(
      json.symbol,
      json.name,
      json.address,
      ChainType[json.chain],
      json.decimal,
      json.isStable,
      json.price ? CurrencyPriceResponse.valueOfJson(json.price) : undefined,
    )
  }

  public readonly symbol: string
  public readonly name: string
  public readonly address: Address
  public readonly chain: ChainType
  public readonly decimal: string
  public readonly isStable: boolean
  public readonly price?: CurrencyPriceResponse

  constructor(
    symbol: string,
    name: string,
    address: Address,
    chain: ChainType,
    decimal: string,
    isStable: boolean,
    price?: CurrencyPriceResponse
  ) {
    this.symbol = symbol
    this.name = name
    this.address = address
    this.chain = chain
    this.decimal = decimal
    this.isStable = isStable
    this.price = price
  }

  public valueTo(value: string, decimals: number = 4): number {
    return Number(new BigNumber(value).div(this.decimal).toFixed(decimals, BigNumber.ROUND_DOWN))
  }
}
