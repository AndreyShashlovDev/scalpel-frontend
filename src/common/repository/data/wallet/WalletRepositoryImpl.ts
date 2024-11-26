import { Pageable } from '../model/Pageable.ts'
import { WalletResponse } from '../model/WalletResponse.ts'
import { WalletStatisticResponse } from '../model/WalletStatisticResponse.ts'
import { AppSourceService } from '../source/AppSourceService.ts'
import { WalletRepository } from './WalletRepository.ts'

export class WalletRepositoryImpl extends WalletRepository {

  constructor(private readonly appSourceService: AppSourceService) {
    super()
  }

  public async createWallet(): Promise<string> {
    const result = await this.appSourceService.post<string>('/wallet/')

    if (result.success) {
      return result.data!
    }

    throw new Error()
  }

  public async getWallets(): Promise<WalletResponse[]> {
    const result = await this.appSourceService.get<WalletResponse[]>('/wallet/')

    if (result.success) {
      return result.data?.map(WalletResponse.valueOfJson) ?? []
    }

    throw new Error()
  }

  public async getStatistic(page: number, limit: number): Promise<Pageable<WalletStatisticResponse>> {
    const result = await this.appSourceService.get<Pageable<WalletStatisticResponse>>(
      '/wallet/statistic',
      {
        query: new Map([
          ['page', page.toString()],
          ['limit', limit.toString()]
        ])
      }
    )

    if (result.success && Array.isArray(result.data?.data)) {
      return new Pageable(
        result.data.data.map(WalletStatisticResponse.valueOfJson),
        result.data?.total,
        result.data?.page
      )
    }

    throw new Error()
  }

}
