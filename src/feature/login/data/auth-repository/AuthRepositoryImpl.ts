import { AppSourceService } from '../../../../common/repository/data/source/AppSourceService.ts'
import { UnauthorizedException } from '../../../../common/repository/data/source/exception/UnauthorizedException.ts'
import { UnknownException } from '../../../../common/repository/data/source/exception/UnknownException.ts'
import { AuthRepository } from './AuthRepository.ts'

export class AuthRepositoryImpl extends AuthRepository {

  constructor(private readonly sourceService: AppSourceService) {
    super()
  }

  public async getSignMessage(): Promise<string> {
    return this.sourceService.get<string, string>(
      {
        path: '/auth/sign-message'
      },
      async (response) => {
        if (response.success) {
          return response.data!
        }

        throw UnknownException.create()
      }
    )
  }

  public async login(address: string, message: string, sig: string): Promise<string> {
    return this.sourceService.post<string, string>(
      {
        path: '/auth',
        body: {
          address,
          message,
          sign: sig
        }
      },
      async (response) => {
        if (response.success) {
          return response.data!
        }

        throw UnauthorizedException.create()
      }
    )
  }

  public async registration(address: string, message: string, sig: string): Promise<string> {
    return this.sourceService.post<string, string>(
      {
        path: '/auth/signup',
        body: {
          address,
          message,
          sign: sig
        }
      },
      async (response) => {
        if (response.success) {
          return response.data!
        }

        throw UnknownException.create()
      }
    )
  }
}
