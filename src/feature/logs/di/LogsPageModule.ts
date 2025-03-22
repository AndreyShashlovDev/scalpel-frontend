import { Module } from '../../../utils/di-core/di/Dependency.ts'
import { LogsRepository } from '../data/logs-repository/LogsRepository.ts'
import { LogsRepositoryImpl } from '../data/logs-repository/LogsRepositoryImpl.ts'
import { LogsPagePresenter } from '../domain/LogsPagePresenter.ts'
import { LogsPagePresenterImpl } from '../domain/LogsPagePresenterImpl.ts'

@Module({
  providers: [
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
