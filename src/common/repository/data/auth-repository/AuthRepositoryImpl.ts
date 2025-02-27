import { AppSourceService } from '../source/AppSourceService.ts'
import { UnauthorizedException } from '../source/exception/UnauthorizedException.ts'
import { UnknownException } from '../source/exception/UnknownException.ts'
import { AuthRepository } from './AuthRepository.ts'

export class AuthRepositoryImpl extends AuthRepository {

  constructor(private readonly sourceService: AppSourceService) {
    super()
  }

  public refreshToken(): Promise<string> {
    return this.sourceService.post<string, string>(
      {
        path: '/auth/refresh-token'
      },
      async (response) => {
        if (response.success && response.data) {
          return response.data
        }

        throw UnauthorizedException.create()
      }
    )
  }

  public logout(): Promise<void> {
    return this.sourceService.post<void, void>(
      {
        path: '/auth/logout'
      },
      async (response) => {
        if (!response.success) {
          throw UnknownException.create('unknown error')
        }
      }
    )
  }
}
