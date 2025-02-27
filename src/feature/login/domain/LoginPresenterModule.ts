import { AppSourceService } from '../../../common/repository/data/source/AppSourceService.ts'
import { ApplicationRouter } from '../../../common/router/domain/ApplicationRouter.ts'
import { AppAuthService } from '../../../common/service/auth/AppAuthService.ts'
import { ExceptionNotifierService } from '../../../common/service/exception-handler/ExceptionNotifierService.ts'
import { MessageSigner } from '../../../common/service/message-signer/MessageSigner.ts'
import { MessageSingerImpl } from '../../../common/service/message-signer/MessageSingerImpl.ts'
import { WalletConnect } from '../../../common/service/wallet-connect/WalletConnect.ts'
import { WalletConnectImpl } from '../../../common/service/wallet-connect/WalletConnectImpl.ts'
import { Factory, getDIValue, injectionKernel, Singleton } from '../../../Injections.ts'
import { AuthRepositoryImpl } from '../data/auth-repository/AuthRepositoryImpl.ts'
import { LoginInteractor } from './interactor/LoginInteractor.ts'
import { LoginPagePresenter } from './LoginPagePresenter.ts'
import { LoginPagePresenterImpl } from './LoginPagePresenterImpl.ts'

injectionKernel.set(
  WalletConnect,
  new Singleton(() => new WalletConnectImpl('882d3398012401b6a598b7a245adff21', getDIValue(ExceptionNotifierService)))
)

injectionKernel.set(MessageSigner, new Factory(() => new MessageSingerImpl(getDIValue(WalletConnect)), false))

injectionKernel.set(LoginPagePresenter, new Factory(() => new LoginPagePresenterImpl(
  getDIValue(WalletConnect),
  new LoginInteractor(
    getDIValue(MessageSigner),
    new AuthRepositoryImpl(getDIValue(AppSourceService)),
    getDIValue(AppAuthService)
  ),
  getDIValue(ApplicationRouter),
), false))
