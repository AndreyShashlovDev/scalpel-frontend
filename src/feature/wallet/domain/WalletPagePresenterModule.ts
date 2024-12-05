import { CurrencyRepository } from '../../../common/repository/data/currencies/CurrencyRepository.ts'
import { AppSourceService } from '../../../common/repository/data/source/AppSourceService.ts'
import { WalletRepositoryImpl } from '../../../common/repository/data/wallet/WalletRepositoryImpl.ts'
import { EthereumServiceStrategy } from '../../../common/service/ethereum-service/EthereumServiceStrategy.ts'
import { Factory, getDIValue, injectionKernel } from '../../../Injections.ts'
import { GetErc20BalanceInteractor } from './interactor/GetErc20BalanceInteractor.ts'
import { WalletPagePresenter } from './WalletPagePresenter.ts'
import { WalletPagePresenterImpl } from './WalletPagePresenterImpl.ts'

injectionKernel.set(
  WalletPagePresenter,
  new Factory(
    () => new WalletPagePresenterImpl(
      new WalletRepositoryImpl(getDIValue(AppSourceService)),
      new GetErc20BalanceInteractor(getDIValue(EthereumServiceStrategy)),
      getDIValue(CurrencyRepository),
    ),
    false
  )
)
