import { NotificationModule } from '../../../common/di/NotificationModule.ts'
import { Module } from '../../../utils/di-core/di/Dependency.ts'
import { StrategyRepository } from '../data/strategy-repository/StrategyRepository.ts'
import { StrategyRepositoryImpl } from '../data/strategy-repository/StrategyRepositoryImpl.ts'
import { StrategiesPagePresenter } from '../domain/StrategiesPagePresenter.ts'
import { StrategiesPagePresenterImpl } from '../domain/StrategiesPagePresenterImpl.ts'
import { StrategyPageDialogProvider } from '../router/StrategyPageDialogProvider.ts'
import { StrategyPageRouter } from '../router/StrategyPageRouter.ts'
import { StrategyPageRouterImpl } from '../router/StrategyPageRouterImpl.ts'

@Module({
  imports: [NotificationModule],
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
  exports: [StrategiesPagePresenter, StrategyPageDialogProvider]
})
export class StrategiesPageModule {}
