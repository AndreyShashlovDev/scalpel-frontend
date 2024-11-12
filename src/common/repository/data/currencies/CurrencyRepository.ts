import { ChainType } from '../model/ChainType.ts'
import { CurrencyResponse } from '../model/CurrencyResponse.ts'

export abstract class CurrencyRepository {

  public abstract getCurrencies(chain?: ChainType): Promise<CurrencyResponse[]>
}
