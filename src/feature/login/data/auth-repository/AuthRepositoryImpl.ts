import { AppSourceService } from '../../../../common/repository/data/source/AppSourceService.ts'
import { AuthRepository } from './AuthRepository.ts'

export class AuthRepositoryImpl extends AuthRepository {

  constructor(private readonly sourceService: AppSourceService) {
    super()
  }

  public async getSignMessage(): Promise<string> {
    const result = await this.sourceService.get<string>('/auth/sign-message')

    if (result.success) {
      return result.data!
    }

    throw new Error()
  }

  public async login(address: string, message: string, sig: string): Promise<string> {
    const result = await this.sourceService.post<string>('/auth', {
      body: {
        address,
        message,
        sign: sig
      }
    })

    if (result.success) {
      return result.data!
    }

    throw new Error()
  }
}
