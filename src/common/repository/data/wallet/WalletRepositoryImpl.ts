import { Address } from '../../../../utils/types.ts'
import { Pageable } from '../model/Pageable.ts'
import { WalletResponse } from '../model/WalletResponse.ts'
import { WalletStatisticResponse } from '../model/WalletStatisticResponse.ts'
import { AppSourceService } from '../source/AppSourceService.ts'
import { UnknownException } from '../source/exception/UnknownException.ts'
import { WalletRepository } from './WalletRepository.ts'

export class WalletRepositoryImpl extends WalletRepository {

  constructor(private readonly appSourceService: AppSourceService) {
    super()
  }

  public async createWallet(): Promise<string> {
    return this.appSourceService.post<string, string>(
      {
        path: '/wallet/'
      },
      async (response) => {
        if (response.success) {
          return response.data!
        }

        throw UnknownException.create()
      }
    )
  }

  public async getWallets(): Promise<WalletResponse[]> {
    return this.appSourceService.get<WalletResponse[], WalletResponse[]>(
      {
        path: '/wallet/'
      },
      async (response) => {
        if (response.success) {
          return response.data?.map(WalletResponse.valueOfJson) ?? []
        }

        throw new Error()
      }
    )
  }

  public async getStatistic(page: number, limit: number): Promise<Pageable<WalletStatisticResponse>> {
    return this.appSourceService.get<Pageable<WalletStatisticResponse>, Pageable<WalletStatisticResponse>>(
      {
        path: '/wallet/statistic',
        query: new Map([
          ['page', page.toString()],
          ['limit', limit.toString()]
        ])
      },
      async (response) => {
        if (response.success && Array.isArray(response.data?.data)) {
          return new Pageable(
            response.data.data.map(WalletStatisticResponse.valueOfJson),
            response.data?.total,
            response.data?.page
          )
        }

        throw UnknownException.create()
      }
    )
  }

  public changeWalletName(address: Address, name: string | null): Promise<void> {
    return this.appSourceService.post<void, void>(
      {
        path: `/wallet/${address}/change`,
        body: {
          name: name
        }
      },
      async (response) => {
        if (response.success) {
          return
        }

        throw UnknownException.create(JSON.stringify(response.errors))
      }
    )
  }
}
