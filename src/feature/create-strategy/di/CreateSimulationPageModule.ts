import { CurrencyRepository } from '../../../common/repository/data/currencies/CurrencyRepository.ts'
import { AppSourceService } from '../../../common/repository/data/source/AppSourceService.ts'
import { WalletRepositoryImpl } from '../../../common/repository/data/wallet/WalletRepositoryImpl.ts'
import { Factory, getDIValue, injectionKernel } from '../../../utils/arch/Injections.ts'
import { SimulationRepositoryImpl } from '../../simulator/data/simulation-repository/SimulationRepositoryImpl.ts'
import { SimulationPageRouter } from '../../simulator/domain/router/SimulationPageRouter.ts'
import { CreateStrategyPagePresenter } from '../domain/CreateStrategyPagePresenter.ts'
import { CreateStrategyPagePresenterImpl } from '../domain/CreateStrategyPagePresenterImpl.ts'

export const CreateSimulationPageModule = () => {
  injectionKernel.set(
    CreateStrategyPagePresenter,
    new Factory(() => new CreateStrategyPagePresenterImpl(
      getDIValue(CurrencyRepository),
      new WalletRepositoryImpl(getDIValue(AppSourceService)),
      new SimulationRepositoryImpl(getDIValue(AppSourceService)),
      getDIValue(SimulationPageRouter),
      true /* is simulation */
    ), false)
  )
}
