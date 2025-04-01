import { Module } from '@di-core/decorator/decorators.ts'
import { CurrencyRepository } from '../../../common/repository/data/currencies/CurrencyRepository.ts'
import { WalletRepository } from '../../../common/repository/data/wallet/WalletRepository.ts'
import { ApplicationRouter } from '../../../common/router/domain/ApplicationRouter.ts'
import { StrategyRepository } from '../data/strategy-repository/StrategyRepository.ts'
import { StrategyRepositoryImpl } from '../data/strategy-repository/StrategyRepositoryImpl.ts'
import { CreateStrategyPagePresenter } from '../domain/CreateStrategyPagePresenter.ts'
import { CreateStrategyPagePresenterImpl } from '../domain/CreateStrategyPagePresenterImpl.ts'
import { CreateStrategyRouter } from '../domain/router/CreateStrategyRouter.ts'

@Module({
  imports: [],
  providers: [
    {
      provide: CreateStrategyRouter,
      deps: [ApplicationRouter],
      useFactory: (appRouter: ApplicationRouter) => appRouter
    },
    {
      provide: StrategyRepository,
      useClass: StrategyRepositoryImpl
    },
    {
      provide: CreateStrategyPagePresenter,
      deps: [CurrencyRepository, WalletRepository, StrategyRepository, CreateStrategyRouter],
      useFactory: (
        currencyRepository: CurrencyRepository,
        walletRepository: WalletRepository,
        strategyRepository: StrategyRepository,
        createStrategyRouter: CreateStrategyRouter
      ) => {
        return new CreateStrategyPagePresenterImpl(
          currencyRepository,
          walletRepository,
          strategyRepository,
          createStrategyRouter,
          false /* is simulation */
        )
      }
    }
  ],
  exports: [CreateStrategyPagePresenter]
})
export class CreateStrategyPageModule {}
