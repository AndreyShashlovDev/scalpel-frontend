import { CurrencyRepository } from '../../../common/repository/data/currencies/CurrencyRepository.ts'
import { AppSourceService } from '../../../common/repository/data/source/AppSourceService.ts'
import { WalletRepositoryImpl } from '../../../common/repository/data/wallet/WalletRepositoryImpl.ts'
import { ApplicationRouter } from '../../../common/router/domain/ApplicationRouter.ts'
import { Factory, getDIValue, injectionKernel } from '../../../Injections.ts'
import { StrategyRepositoryImpl } from '../data/strategy-repository/StrategyRepositoryImpl.ts'
import { CreateStrategyPagePresenter } from './CreateStrategyPagePresenter.ts'
import { CreateStrategyPagePresenterImpl } from './CreateStrategyPagePresenterImpl.ts'

injectionKernel.set(
  CreateStrategyPagePresenter,
  new Factory(() => new CreateStrategyPagePresenterImpl(
    getDIValue(CurrencyRepository),
    new WalletRepositoryImpl(getDIValue(AppSourceService)),
    new StrategyRepositoryImpl(getDIValue(AppSourceService)),
    getDIValue(ApplicationRouter),
  ), false)
)
