import { Module } from '../../../utils/di-core/di/Dependency.ts'
import { CreateStrategyPagePresenter } from '../../create-strategy/domain/CreateStrategyPagePresenter.ts'
import { SimulationRepository } from '../data/simulation-repository/SimulationRepository.ts'
import { SimulationRepositoryImpl } from '../data/simulation-repository/SimulationRepositoryImpl.ts'
import { SimulationPageDialogProvider } from '../domain/router/SimulationPageDialogProvider.ts'
import { SimulationPageRouter } from '../domain/router/SimulationPageRouter.ts'
import { SimulationPageRouterImpl } from '../domain/router/SimulationPageRouterImpl.ts'
import { SimulationPagePresenter } from '../domain/SimulationPagePresenter.ts'
import { SimulationPagePresenterImpl } from '../domain/SimulationPagePresenterImpl.ts'
import { CreateSimulationPageModule } from './CreateSimulationPageModule.ts'

@Module({
  imports: [CreateSimulationPageModule],
  providers: [
    {
      provide: SimulationPageDialogProvider,
      useClass: SimulationPageDialogProvider,
    },
    {
      provide: SimulationPageRouter,
      useClass: SimulationPageRouterImpl
    },
    {
      provide: SimulationRepository,
      useClass: SimulationRepositoryImpl
    },
    {
      provide: SimulationPagePresenter,
      useClass: SimulationPagePresenterImpl
    }
  ],
  exports: [SimulationPagePresenter, SimulationPageDialogProvider, CreateStrategyPagePresenter]
})
export class SimulationPageModule {}
