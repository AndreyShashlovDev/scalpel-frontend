import { AppSourceService } from '../../../common/repository/data/source/AppSourceService.ts'
import { Factory, getDIValue, injectionKernel } from '../../../utils/arch/Injections.ts'
import { SimulationRepositoryImpl } from '../data/simulation-repository/SimulationRepositoryImpl.ts'
import { SimulationPageDialogProvider } from '../domain/router/SimulationPageDialogProvider.ts'
import { SimulationPageRouter } from '../domain/router/SimulationPageRouter.ts'
import { SimulationPageRouterImpl } from '../domain/router/SimulationPageRouterImpl.ts'
import { SimulationPagePresenter } from '../domain/SimulationPagePresenter.ts'
import { SimulationPagePresenterImpl } from '../domain/SimulationPagePresenterImpl.ts'

injectionKernel.set(SimulationPageDialogProvider, new Factory(() => new SimulationPageDialogProvider(), true))

injectionKernel.set(
  SimulationPageRouter,
  new Factory(() => new SimulationPageRouterImpl(getDIValue(SimulationPageDialogProvider)), true)
)

injectionKernel.set(
  SimulationPagePresenter,
  new Factory(
    () => new SimulationPagePresenterImpl(
      new SimulationRepositoryImpl(getDIValue(AppSourceService)),
      getDIValue(SimulationPageRouter),
    ),
    false
  )
)
