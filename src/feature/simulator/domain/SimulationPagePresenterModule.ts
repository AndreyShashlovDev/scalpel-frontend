import { AppSourceService } from '../../../common/repository/data/source/AppSourceService.ts'
import { Factory, getDIValue, injectionKernel } from '../../../Injections.ts'
import { SimulationRepositoryImpl } from '../data/simulation-repository/SimulationRepositoryImpl.ts'
import { SimulationPageDialogProvider } from './router/SimulationPageDialogProvider.ts'
import { SimulationPageRouterImpl } from './router/SimulationPageRouterImpl.ts'
import { SimulationPagePresenter } from './SimulationPagePresenter.ts'
import { SimulationPagePresenterImpl } from './SimulationPagePresenterImpl.ts'

injectionKernel.set(SimulationPageDialogProvider, new Factory(() => new SimulationPageDialogProvider(), true))

injectionKernel.set(
  SimulationPagePresenter,
  new Factory(
    () => new SimulationPagePresenterImpl(
      new SimulationRepositoryImpl(getDIValue(AppSourceService)),
      new SimulationPageRouterImpl(getDIValue(SimulationPageDialogProvider)),
    ),
    false
  )
)
