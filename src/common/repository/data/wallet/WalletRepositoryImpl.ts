import { Inject, Injectable } from '../../../../utils/di-core/decorator/decorators.ts'
import { Address } from '../../../../utils/types.ts'
import { ExportWalletResponse } from '../model/ExportWalletResponse.ts'
import { Pageable } from '../model/Pageable.ts'
import { WalletResponse } from '../model/WalletResponse.ts'
import { WalletStatisticResponse } from '../model/WalletStatisticResponse.ts'
import { AppSourceService } from '../source/AppSourceService.ts'
import { UnknownException } from '../source/exception/UnknownException.ts'
import { WalletRepository } from './WalletRepository.ts'

@Injectable()
export class WalletRepositoryImpl extends WalletRepository {

  constructor(
    @Inject(AppSourceService) private readonly appSourceService: AppSourceService
  ) {
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

  public changeWalletName(account: Address, name: string | null): Promise<void> {
    return this.appSourceService.post<void, void>(
      {
        path: `/wallet/${account}/change`,
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

  public async exportWallet(msg: string, sig: string): Promise<ExportWalletResponse> {
    return this.appSourceService.post<ExportWalletResponse, ExportWalletResponse>(
      {
        path: `/wallet/export`,
        body: {
          msg,
          sig
        }
      },
      async (response) => {
        if (response.success && response.data) {
          return ExportWalletResponse.valueOfJson(response.data)
        }

        throw UnknownException.create(JSON.stringify(response.errors))
      }
    )
  }
}
