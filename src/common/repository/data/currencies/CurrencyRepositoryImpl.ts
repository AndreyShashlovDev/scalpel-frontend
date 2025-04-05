import { Inject, Injectable } from 'flexdi'
import { ChainType } from '../model/ChainType.ts'
import { CurrencyResponse } from '../model/CurrencyResponse.ts'
import { AppSourceService } from '../source/AppSourceService.ts'
import { UnknownException } from '../source/exception/UnknownException.ts'
import { CurrencyRepository } from './CurrencyRepository.ts'

@Injectable()
export class CurrencyRepositoryImpl extends CurrencyRepository {

  constructor(
    @Inject(AppSourceService) private readonly appSourceService: AppSourceService,
  ) {
    super()
  }

  public async getCurrencies(chain?: ChainType): Promise<CurrencyResponse[]> {
    const query = new Map<string, string>()

    if (chain) {
      query.set('chain', chain)
    }

    return this.appSourceService.get<CurrencyResponse[], CurrencyResponse[]>(
      {
        path: `/currency/`,
        query
      },

      async (response) => {
        if (response.success && response.data) {
          return response.data.map(CurrencyResponse.valueOfJson)
        }

        throw UnknownException.create('Cannot get currency')
      },
    )
  }
}
