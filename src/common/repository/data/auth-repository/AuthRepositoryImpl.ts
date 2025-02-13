import { AppSourceService } from '../source/AppSourceService.ts'
import { UnauthorizedException } from '../source/exception/UnauthorizedException.ts'
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
}
