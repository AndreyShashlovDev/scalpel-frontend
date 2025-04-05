import { Module } from 'flexdi'
import { ApplicationRouter } from '../../../common/router/domain/ApplicationRouter.ts'
import { StrategyRepository } from '../data/strategy-repository/StrategyRepository.ts'
import { StrategyRepositoryImpl } from '../data/strategy-repository/StrategyRepositoryImpl.ts'
import { SwapRepository } from '../data/swap-repository/SwapRepository.ts'
import { SwapRepositoryImpl } from '../data/swap-repository/SwapRepositoryImpl.ts'
import { SwapPagePresenter } from '../domain/SwapPagePresenter.ts'
import { SwapPagePresenterImpl } from '../domain/SwapPagePresenterImpl.ts'
import { SwapsPageRouter } from '../router/SwapsPageRouter.ts'

@Module({
  providers: [
    {
      provide: SwapsPageRouter,
      deps: [ApplicationRouter],
      useFactory: (appRouter: ApplicationRouter) => appRouter
    },
    {
      provide: StrategyRepository,
      useClass: StrategyRepositoryImpl
    },
    {
      provide: SwapRepository,
      useClass: SwapRepositoryImpl
    },
    {
      provide: SwapPagePresenter,
      useClass: SwapPagePresenterImpl
    }
  ],
  exports: [SwapPagePresenter]
})
export class SwapPageModule {}
