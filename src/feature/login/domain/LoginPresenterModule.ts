import { AppSourceService } from '../../../common/repository/data/source/AppSourceService.ts'
import { ApplicationRouter } from '../../../common/router/domain/ApplicationRouter.ts'
import { AppAuthService } from '../../../common/service/auth/AppAuthService.ts'
import { MessageSigner } from '../../../common/service/message-signer/MessageSigner.ts'
import { MessageSingerImpl } from '../../../common/service/message-signer/MessageSingerImpl.ts'
import { WalletConnect } from '../../../common/service/wallet-connect/WalletConnect.ts'
import { Factory, getDIValue, injectionKernel } from '../../../Injections.ts'
import { AuthRepositoryImpl } from '../data/auth-repository/AuthRepositoryImpl.ts'
import { LoginInteractor } from './interactor/LoginInteractor.ts'
import { LoginPagePresenter } from './LoginPagePresenter.ts'
import { LoginPagePresenterImpl } from './LoginPagePresenterImpl.ts'

injectionKernel.set(MessageSigner, new Factory(() => new MessageSingerImpl(getDIValue(WalletConnect)), false))

injectionKernel.set(LoginPagePresenter, new Factory(() => new LoginPagePresenterImpl(
  getDIValue(WalletConnect),
  new LoginInteractor(
    getDIValue(MessageSigner),
    new AuthRepositoryImpl(getDIValue(AppSourceService)),
    getDIValue(AppAuthService)
  ),
  getDIValue(AppAuthService),
  getDIValue(ApplicationRouter),
), false))
