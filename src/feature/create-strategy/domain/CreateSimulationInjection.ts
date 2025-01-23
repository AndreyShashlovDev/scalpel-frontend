import { CurrencyRepository } from '../../../common/repository/data/currencies/CurrencyRepository.ts'
import { AppSourceService } from '../../../common/repository/data/source/AppSourceService.ts'
import { WalletRepositoryImpl } from '../../../common/repository/data/wallet/WalletRepositoryImpl.ts'
import { ApplicationRouter } from '../../../common/router/domain/ApplicationRouter.ts'
import { Factory, getDIValue, injectionKernel } from '../../../Injections.ts'
import { SimulationRepositoryImpl } from '../../simulator/data/simulation-repository/SimulationRepositoryImpl.ts'
import { CreateStrategyPagePresenter } from './CreateStrategyPagePresenter.ts'
import { CreateStrategyPagePresenterImpl } from './CreateStrategyPagePresenterImpl.ts'
import { SimulationStrategyRouter } from './router/SimulationStrategyRouter.ts'

export const CreateSimulationInjection = () => {
  injectionKernel.set(
    CreateStrategyPagePresenter,
    new Factory(() => new CreateStrategyPagePresenterImpl(
      getDIValue(CurrencyRepository),
      new WalletRepositoryImpl(getDIValue(AppSourceService)),
      new SimulationRepositoryImpl(getDIValue(AppSourceService)),
      new SimulationStrategyRouter(getDIValue(ApplicationRouter)),
      true /* is simulation */
    ), false)
  )
}
