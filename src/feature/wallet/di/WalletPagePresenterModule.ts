import { CurrencyRepository } from '../../../common/repository/data/currencies/CurrencyRepository.ts'
import { ChainType } from '../../../common/repository/data/model/ChainType.ts'
import { AppSourceService } from '../../../common/repository/data/source/AppSourceService.ts'
import { WalletRepositoryImpl } from '../../../common/repository/data/wallet/WalletRepositoryImpl.ts'
import { EthereumServiceImpl } from '../../../common/service/ethereum-service/EthereumServiceImpl.ts'
import { EthereumServiceStrategy } from '../../../common/service/ethereum-service/EthereumServiceStrategy.ts'
import { EthereumServiceStrategyImpl } from '../../../common/service/ethereum-service/EthereumServiceStrategyImpl.ts'
import { Factory, getDIValue, injectionKernel } from '../../../Injections.ts'
import { GetErc20BalanceInteractor } from '../domain/interactor/GetErc20BalanceInteractor.ts'
import { WalletPagePresenter } from '../domain/WalletPagePresenter.ts'
import { WalletPagePresenterImpl } from '../domain/WalletPagePresenterImpl.ts'

injectionKernel.set(EthereumServiceStrategy, new Factory(() => new EthereumServiceStrategyImpl(
  new Map([
    [
      ChainType.ETHEREUM_MAIN_NET,
      new EthereumServiceImpl(
        ChainType.ETHEREUM_MAIN_NET,
        'https://ethereum-rpc.publicnode.com',
        '0x5BA1e12693Dc8F9c48aAD8770482f4739bEeD696',
      ),
    ],
    [
      ChainType.POLYGON,
      new EthereumServiceImpl(
        ChainType.POLYGON,
        'https://1rpc.io/matic',
        '0x11ce4B23bD875D7F5C6a31084f55fDe1e9A87507',
      ),
    ]
  ])
), true))

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
