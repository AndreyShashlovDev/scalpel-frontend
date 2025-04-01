import { Module } from '@di-core/decorator/decorators.ts'
import { ApplicationRouter } from '../../../common/router/domain/ApplicationRouter.ts'
import { LogsRepository } from '../data/logs-repository/LogsRepository.ts'
import { LogsRepositoryImpl } from '../data/logs-repository/LogsRepositoryImpl.ts'
import { LogsPagePresenter } from '../domain/LogsPagePresenter.ts'
import { LogsPagePresenterImpl } from '../domain/LogsPagePresenterImpl.ts'
import { LogsPageRouter } from '../router/LogsPageRouter.ts'

@Module({
  providers: [
    {
      provide: LogsPageRouter,
      deps: [ApplicationRouter],
      useFactory: (appRouter: ApplicationRouter) => appRouter
    },
    {
      provide: LogsRepository,
      useClass: LogsRepositoryImpl
    },
    {
      provide: LogsPagePresenter,
      useClass: LogsPagePresenterImpl
    }
  ],
  exports: [LogsPagePresenter]
})
export class LogsPageModule {}
