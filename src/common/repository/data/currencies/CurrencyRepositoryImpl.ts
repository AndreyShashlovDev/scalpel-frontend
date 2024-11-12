import { ChainType } from '../model/ChainType.ts'
import { CurrencyResponse } from '../model/CurrencyResponse.ts'
import { AppSourceService } from '../source/AppSourceService.ts'
import { CurrencyRepository } from './CurrencyRepository.ts'

export class CurrencyRepositoryImpl extends CurrencyRepository {

  constructor(private readonly appSourceService: AppSourceService) {
    super()
  }

  public async getCurrencies(chain?: ChainType): Promise<CurrencyResponse[]> {
    const query = new Map<string, string>()

    if (chain) {
      query.set('chain', chain)
    }

    const result = await this.appSourceService.get<CurrencyResponse[]>(`/currency/`, {query})

    if (result.success && result.data) {
      return result.data.map(CurrencyResponse.valueOfJson)
    }

    throw new Error()
  }
}
