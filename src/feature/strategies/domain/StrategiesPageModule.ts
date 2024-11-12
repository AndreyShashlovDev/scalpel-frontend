import { AppSourceService } from '../../../common/repository/data/source/AppSourceService.ts'
import { ApplicationRouter } from '../../../common/router/domain/ApplicationRouter.ts'
import { Factory, getDIValue, injectionKernel } from '../../../Injections.ts'
import { StrategyRepositoryImpl } from '../data/strategy-repository/StrategyRepositoryImpl.ts'
import { StrategiesPagePresenter } from './StrategiesPagePresenter.ts'
import { StrategiesPagePresenterImpl } from './StrategiesPagePresenterImpl.ts'
import { StrategyDialogProvider } from './StrategyDialogProvider.ts'

injectionKernel.set(StrategyDialogProvider, new Factory(() => new StrategyDialogProvider(), true))

injectionKernel.set(
  StrategiesPagePresenter,
  new Factory(
    () => new StrategiesPagePresenterImpl(
      new StrategyRepositoryImpl(getDIValue(AppSourceService)),
      getDIValue(StrategyDialogProvider),
      getDIValue(ApplicationRouter),
    ),
    false
  )
)
