import { Module } from '@di-core/decorator/decorators.ts'
import { RouterModule } from './common/di/AppRouterModule.ts'
import { AuthModule } from './common/di/AuthModule.ts'
import { ExceptionModule } from './common/di/ExceptionModule.ts'
import { NotificationModule } from './common/di/NotificationModule.ts'
import { RepositoryModule } from './common/di/RepositoryModule.ts'
import { SourceModule } from './common/di/SourceModule.ts'
import { CurrencyRepository } from './common/repository/data/currencies/CurrencyRepository.ts'
import { PreferencesRepository } from './common/repository/data/preferences/PreferencesRepository.ts'
import { AppSourceService } from './common/repository/data/source/AppSourceService.ts'
import { WalletRepository } from './common/repository/data/wallet/WalletRepository.ts'
import { ApplicationRouter } from './common/router/domain/ApplicationRouter.ts'
import { AppAuthService } from './common/service/auth/AppAuthService.ts'
import { ExceptionHandlerService } from './common/service/exception-handler/ExceptionHandlerService.ts'
import { ExceptionNotifierService } from './common/service/exception-handler/ExceptionNotifierService.ts'
import { PushNotificationService } from './common/service/notification/PushNotificationService.ts'

export const SCALPEL_ENDPOINT = window.location.origin
export const REOWN_PROJECT_ID = '882d3398012401b6a598b7a245adff21'

@Module({
  imports: [
    ExceptionModule,
    RepositoryModule,
    SourceModule,
    AuthModule,
    RouterModule,
    NotificationModule,
  ],
  exports: [
    ExceptionHandlerService,
    ExceptionNotifierService,
    PreferencesRepository,
    CurrencyRepository,
    WalletRepository,
    AppSourceService,
    AppAuthService,
    ApplicationRouter,
    PushNotificationService,
  ],
})
export class AppModule {}
