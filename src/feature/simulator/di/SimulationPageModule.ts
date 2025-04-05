import { Module } from 'flexdi'
import { CreateStrategyPagePresenter } from '../../create-strategy/domain/CreateStrategyPagePresenter.ts'
import { SimulationPageDialogProvider } from '../domain/router/SimulationPageDialogProvider.ts'
import { SimulationPagePresenter } from '../domain/SimulationPagePresenter.ts'
import { SimulationPagePresenterImpl } from '../domain/SimulationPagePresenterImpl.ts'
import { CreateSimulationPageModule } from './CreateSimulationPageModule.ts'

@Module({
  imports: [CreateSimulationPageModule],
  providers: [
    {
      provide: SimulationPagePresenter,
      useClass: SimulationPagePresenterImpl
    }
  ],
  exports: [SimulationPagePresenter, SimulationPageDialogProvider, CreateStrategyPagePresenter]
})
export class SimulationPageModule {}
