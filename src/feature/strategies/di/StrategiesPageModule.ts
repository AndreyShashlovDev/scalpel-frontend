import { Module } from '../../../utils/di-core/di/Dependency.ts'
import { LogsPageModule } from '../../logs/di/LogsPageModule.ts'
import { LogsPagePresenter } from '../../logs/domain/LogsPagePresenter.ts'
import { AnalyticsPageModule } from '../analytics/di/AnalyticsPageModule.ts'
import { AnalyticsPagePresenter } from '../analytics/domain/AnalyticsPagePresenter.ts'
import { StrategyRepository } from '../data/strategy-repository/StrategyRepository.ts'
import { StrategyRepositoryImpl } from '../data/strategy-repository/StrategyRepositoryImpl.ts'
import { StrategiesPagePresenter } from '../domain/StrategiesPagePresenter.ts'
import { StrategiesPagePresenterImpl } from '../domain/StrategiesPagePresenterImpl.ts'
import { StrategyPageDialogProvider } from '../router/StrategyPageDialogProvider.ts'
import { StrategyPageRouter } from '../router/StrategyPageRouter.ts'
import { StrategyPageRouterImpl } from '../router/StrategyPageRouterImpl.ts'

@Module({
  imports: [AnalyticsPageModule, LogsPageModule],
  providers: [
    {
      provide: StrategyPageDialogProvider,
      useClass: StrategyPageDialogProvider,
    },
    {
      provide: StrategyRepository,
      useClass: StrategyRepositoryImpl
    },
    {
      provide: StrategyPageRouter,
      useClass: StrategyPageRouterImpl
    },
    {
      provide: StrategiesPagePresenter,
      useClass: StrategiesPagePresenterImpl
    },
  ],
  exports: [StrategiesPagePresenter, StrategyPageDialogProvider, AnalyticsPagePresenter, LogsPagePresenter]
})
export class StrategiesPageModule {}
