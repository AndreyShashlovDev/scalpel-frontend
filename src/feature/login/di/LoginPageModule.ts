import { Module } from '@di-core/decorator/decorators.ts'
import { ModuleClassProvider } from '@di-core/di/Dependency.ts'
import { MessageSignerModule } from '../../../common/di/MessageSignerModule.ts'
import { WalletConnectModule } from '../../../common/di/WalletConnectModule.ts'
import { AppSourceService } from '../../../common/repository/data/source/AppSourceService.ts'
import { ApplicationRouter } from '../../../common/router/domain/ApplicationRouter.ts'
import { AppAuthService } from '../../../common/service/auth/AppAuthService.ts'
import { MessageSigner } from '../../../common/service/message-signer/MessageSigner.ts'
import { Wallet, WalletConnect } from '../../../common/service/wallet-connect/WalletConnect.ts'
import { AuthRepositoryImpl } from '../data/auth-repository/AuthRepositoryImpl.ts'
import { LoginInteractor } from '../domain/interactor/LoginInteractor.ts'
import { RegistrationInteractor } from '../domain/interactor/RegistrationInteractor.ts'
import { LoginPagePresenter } from '../domain/LoginPagePresenter.ts'
import { LoginPageDialogProvider } from '../router/LoginPageDialogProvider.ts'
import { LoginPageRouterImpl } from '../router/LoginPageRouterImpl.ts'

const DialogProvider: ModuleClassProvider = {
  provide: LoginPageDialogProvider,
  useClass: LoginPageDialogProvider
}

@Module({
  imports: [WalletConnectModule, MessageSignerModule],

  providers: [
    DialogProvider,
    {
      provide: LoginPagePresenter,
      deps: [
        WalletConnect,
        MessageSigner,
        AppAuthService,
        AppSourceService,
        ApplicationRouter,
        LoginPageDialogProvider,
      ],
      useFactory: async (
        walletConnect: WalletConnect<Wallet>,
        messageSigner: MessageSigner,
        appAuthService: AppAuthService,
        appSourceService: AppSourceService,
        appRouter: ApplicationRouter,
        loginPageDialogProvider: LoginPageDialogProvider,
      ) => {
        const presenterModule = await import('../domain/LoginPagePresenterImpl')
        const LoginPagePresenterImpl = presenterModule.LoginPagePresenterImpl

        return new LoginPagePresenterImpl(
          walletConnect,
          new LoginInteractor(
            messageSigner,
            new AuthRepositoryImpl(appSourceService),
            appAuthService
          ),
          new RegistrationInteractor(
            messageSigner,
            new AuthRepositoryImpl(appSourceService),
          ),
          new LoginPageRouterImpl(appRouter, loginPageDialogProvider)
        )
      }
    }
  ],
  exports: [LoginPagePresenter, LoginPageDialogProvider]
})
export class LoginPageModule {}
