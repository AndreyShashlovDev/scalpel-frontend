import { SignerMessageModule } from '../../../common/di/SignerMessageModule.ts'
import { WalletConnectModule } from '../../../common/di/WalletConnetModule.ts'
import { AppSourceService } from '../../../common/repository/data/source/AppSourceService.ts'
import { ApplicationRouter } from '../../../common/router/domain/ApplicationRouter.ts'
import { AppAuthService } from '../../../common/service/auth/AppAuthService.ts'
import { MessageSigner } from '../../../common/service/message-signer/MessageSigner.ts'
import { WalletConnect } from '../../../common/service/wallet-connect/WalletConnect.ts'
import { Factory, getDIValue, injectionKernel, loadModule, Singleton } from '../../../utils/arch/Injections.ts'
import { AuthRepositoryImpl } from '../data/auth-repository/AuthRepositoryImpl.ts'
import { LoginInteractor } from '../domain/interactor/LoginInteractor.ts'
import { RegistrationInteractor } from '../domain/interactor/RegistrationInteractor.ts'
import { LoginPagePresenter } from '../domain/LoginPagePresenter.ts'
import { LoginPageDialogProvider } from '../router/LoginPageDialogProvider.ts'
import { LoginPageRouterImpl } from '../router/LoginPageRouterImpl.ts'

export const LoginPageModule = async () => {

  await loadModule(WalletConnectModule)
  await loadModule(SignerMessageModule)

  injectionKernel.set(LoginPageDialogProvider, new Singleton(() => new LoginPageDialogProvider()))

  const presenterModule = await import('../domain/LoginPagePresenterImpl')
  const LoginPagePresenterImpl = presenterModule.LoginPagePresenterImpl

  injectionKernel.set(
    LoginPagePresenter,
    new Factory(
      () => new LoginPagePresenterImpl(
        getDIValue(WalletConnect),
        new LoginInteractor(
          getDIValue(MessageSigner),
          new AuthRepositoryImpl(getDIValue(AppSourceService)),
          getDIValue(AppAuthService)
        ),
        new RegistrationInteractor(
          getDIValue(MessageSigner),
          new AuthRepositoryImpl(getDIValue(AppSourceService)),
        ),
        new LoginPageRouterImpl(getDIValue(ApplicationRouter), getDIValue(LoginPageDialogProvider))
      ),
      false
    )
  )
}
