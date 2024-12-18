import { AppSourceService } from '../../../common/repository/data/source/AppSourceService.ts'
import { Factory, getDIValue, injectionKernel } from '../../../Injections.ts'
import { StrategyRepositoryImpl } from '../data/strategy-repository/StrategyRepositoryImpl.ts'
import { StrategyPageDialogProvider } from '../router/StrategyPageDialogProvider.ts'
import { StrategyPageRouterImpl } from '../router/StrategyPageRouterImpl.ts'
import { StrategiesPagePresenter } from './StrategiesPagePresenter.ts'
import { StrategiesPagePresenterImpl } from './StrategiesPagePresenterImpl.ts'

injectionKernel.set(StrategyPageDialogProvider, new Factory(() => new StrategyPageDialogProvider(), true))

injectionKernel.set(
  StrategiesPagePresenter,
  new Factory(
    () => new StrategiesPagePresenterImpl(
      new StrategyRepositoryImpl(getDIValue(AppSourceService)),
      new StrategyPageRouterImpl(getDIValue(StrategyPageDialogProvider))
    ),
    false
  )
)
