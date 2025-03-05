import { AppSourceService } from '../../../common/repository/data/source/AppSourceService.ts'
import { ApplicationRouter } from '../../../common/router/domain/ApplicationRouter.ts'
import { Factory, getDIValue, injectionKernel } from '../../../utils/arch/Injections.ts'
import { SimulationRepositoryImpl } from '../data/simulation-repository/SimulationRepositoryImpl.ts'
import { DemoPagePresenter } from '../domain/DemoPagePresenter.ts'
import { DemoPagePresenterImpl } from '../domain/DemoPagePresenterImpl.ts'

injectionKernel.set(
  DemoPagePresenter,
  new Factory(
    () => new DemoPagePresenterImpl(
      new SimulationRepositoryImpl(getDIValue(AppSourceService)),
      getDIValue(ApplicationRouter),
    ),
    false
  )
)
