import BigNumber from 'bignumber.js'
import { JsonObject } from '../../../../utils/types.ts'
import { ChainType } from './ChainType.ts'

export class CurrencyResponse {

  public static valueOfJson(json: JsonObject<CurrencyResponse>): CurrencyResponse {
    return new CurrencyResponse(
      json.symbol,
      json.name,
      json.address,
      ChainType[json.chain],
      json.decimal,
      json.isStable,
    )
  }

  public readonly symbol: string
  public readonly name: string
  public readonly address: string
  public readonly chain: ChainType
  public readonly decimal: string
  public readonly isStable: boolean

  constructor(symbol: string, name: string, address: string, chain: ChainType, decimal: string, isStable: boolean) {
    this.symbol = symbol
    this.name = name
    this.address = address
    this.chain = chain
    this.decimal = decimal
    this.isStable = isStable
  }

  public valueTo(value: string): number {
    return Number(new BigNumber(value).div(this.decimal).toFixed(4, BigNumber.ROUND_DOWN))
  }
}
