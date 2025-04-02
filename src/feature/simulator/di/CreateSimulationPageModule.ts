import { Module } from '@di-core/decorator/decorators.ts'
import { CurrencyRepository } from '../../../common/repository/data/currencies/CurrencyRepository.ts'
import { WalletRepository } from '../../../common/repository/data/wallet/WalletRepository.ts'
import { CreateStrategyPagePresenter } from '../../create-strategy/domain/CreateStrategyPagePresenter.ts'
import { CreateStrategyPagePresenterImpl } from '../../create-strategy/domain/CreateStrategyPagePresenterImpl.ts'
import { SimulationRepository } from '../data/simulation-repository/SimulationRepository.ts'
import { SimulationRepositoryImpl } from '../data/simulation-repository/SimulationRepositoryImpl.ts'
import { SimulationPageDialogProvider } from '../domain/router/SimulationPageDialogProvider.ts'
import { SimulationPageRouter } from '../domain/router/SimulationPageRouter.ts'
import { SimulationPageRouterImpl } from '../domain/router/SimulationPageRouterImpl.ts'

@Module({
  imports: [],
  providers: [
    {
      provide: SimulationPageDialogProvider,
      useClass: SimulationPageDialogProvider
    },
    {
      provide: SimulationPageRouter,
      useClass: SimulationPageRouterImpl,
    },
    {
      provide: SimulationRepository,
      useClass: SimulationRepositoryImpl,
    },
    {
      provide: CreateStrategyPagePresenter,
      deps: [CurrencyRepository, WalletRepository, SimulationRepository, SimulationPageRouter],
      useFactory: (
        currencyRepository: CurrencyRepository,
        walletRepository: WalletRepository,
        simulationRepository: SimulationRepository,
        simulationPageRouter: SimulationPageRouter
      ) => {
        return new CreateStrategyPagePresenterImpl(
          currencyRepository,
          walletRepository,
          simulationRepository,
          simulationPageRouter,
          true /* is simulation */
        )
      }
    }
  ],
  exports: [CreateStrategyPagePresenter, SimulationPageDialogProvider, SimulationRepository, SimulationPageRouter]
})
export class CreateSimulationPageModule {}
