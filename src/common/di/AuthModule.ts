import { SCALPEL_ENDPOINT } from '../../AppModule.ts'
import { Module } from '../../utils/di-core/di/Dependency'
import { AuthRepositoryImpl } from '../repository/data/auth-repository/AuthRepositoryImpl.ts'
import { AppAuthHttpsService } from '../repository/data/source/AppAuthHttpsService.ts'
import { AppSourceService } from '../repository/data/source/AppSourceService.ts'
import { AppAuthService } from '../service/auth/AppAuthService.ts'
import { AppAuthServiceImpl } from '../service/auth/AppAuthServiceImpl.ts'
import { SourceModule } from './SourceModule.ts'

@Module({
  imports: [SourceModule],
  providers: [
    {
      provide: AppAuthService,
      deps: [AppSourceService],
      useFactory: (appSourceService: AppSourceService) => {
        const appAuthHttpsService = new AppAuthHttpsService(SCALPEL_ENDPOINT, 'api')
        const authRepository = new AuthRepositoryImpl(appSourceService)

        return new AppAuthServiceImpl(appAuthHttpsService, authRepository)
      },
    }
  ],
  exports: [AppAuthService]
})
export class AuthModule {}
