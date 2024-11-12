import { WalletResponse } from '../model/WalletResponse.ts'
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
      return result.data!
    }

    throw new Error()
  }

}
