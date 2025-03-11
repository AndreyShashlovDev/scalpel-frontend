import { PreferencesRepository } from '../../../common/repository/data/preferences/PreferencesRepository.ts'
import { AppSourceService } from '../../../common/repository/data/source/AppSourceService.ts'
import { Factory, getDIValue, injectionKernel, Singleton } from '../../../utils/arch/Injections.ts'
import { StrategyRepositoryImpl } from '../data/strategy-repository/StrategyRepositoryImpl.ts'
import { StrategiesPagePresenter } from '../domain/StrategiesPagePresenter.ts'
import { StrategiesPagePresenterImpl } from '../domain/StrategiesPagePresenterImpl.ts'
import { StrategyPageDialogProvider } from '../router/StrategyPageDialogProvider.ts'
import { StrategyPageRouterImpl } from '../router/StrategyPageRouterImpl.ts'

injectionKernel.set(StrategyPageDialogProvider, new Singleton(() => new StrategyPageDialogProvider()))

injectionKernel.set(
  StrategiesPagePresenter,
  new Factory(
    () => new StrategiesPagePresenterImpl(
      new StrategyRepositoryImpl(getDIValue(AppSourceService)),
      new StrategyPageRouterImpl(getDIValue(StrategyPageDialogProvider)),
      getDIValue(PreferencesRepository),
    ),
    false
  )
)
