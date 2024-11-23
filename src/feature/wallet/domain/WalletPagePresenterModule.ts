import { WalletRepository } from '../../../common/repository/data/wallet/WalletRepository.ts'
import { Factory, getDIValue, injectionKernel } from '../../../Injections.ts'
import { WalletPagePresenter } from './WalletPagePresenter.ts'
import { WalletPagePresenterImpl } from './WalletPagePresenterImpl.ts'

injectionKernel.set(
  WalletPagePresenter,
  new Factory(
    () => new WalletPagePresenterImpl(getDIValue(WalletRepository)),
    false
  )
)
