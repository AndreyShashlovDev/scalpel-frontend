import { Module } from 'flexdi'
import { ECHDCryptoModule } from '../../../common/di/ECHDCryptoModule.ts'
import { EthereumServiceStrategyModule } from '../../../common/di/EthereumServiceStrategyModule.ts'
import { MessageSignerModule } from '../../../common/di/MessageSignerModule.ts'
import { CurrencyRepository } from '../../../common/repository/data/currencies/CurrencyRepository.ts'
import { WalletRepository } from '../../../common/repository/data/wallet/WalletRepository.ts'
import { ECHDCrypto } from '../../../common/service/crypto/ECHDCrypto.ts'
import { EthereumServiceStrategy } from '../../../common/service/ethereum-service/EthereumServiceStrategy.ts'
import { ExceptionNotifierService } from '../../../common/service/exception-handler/ExceptionNotifierService.ts'
import { MessageSigner } from '../../../common/service/message-signer/MessageSigner.ts'
import { ExportWalletPrivateKeyInteractor } from '../domain/interactor/ExportWalletPrivateKeyInteractor.ts'
import { GetErc20BalanceInteractor } from '../domain/interactor/GetErc20BalanceInteractor.ts'
import { WalletPagePresenter } from '../domain/WalletPagePresenter.ts'
import { WalletPageDialogProvider } from '../router/WalletPageDialogProvider.ts'
import { WalletPageRouter } from '../router/WalletPageRouter.ts'
import { WalletPageRouterImpl } from '../router/WalletPageRouterImpl.ts'

@Module({
  imports: [ECHDCryptoModule, EthereumServiceStrategyModule, MessageSignerModule],
  providers: [
    {
      provide: WalletPageDialogProvider,
      useClass: WalletPageDialogProvider
    },
    {
      provide: WalletPageRouter,
      useClass: WalletPageRouterImpl
    },
    {
      provide: WalletPagePresenter,
      deps: [
        ECHDCrypto,
        EthereumServiceStrategy,
        MessageSigner,
        ExceptionNotifierService,
        WalletPageRouter,
        WalletRepository,
        CurrencyRepository
      ],
      useFactory: async (
        echdCrypto: ECHDCrypto,
        ethereumServiceStrategy: EthereumServiceStrategy,
        messageSigner: MessageSigner,
        exceptionNotifierService: ExceptionNotifierService,
        walletPageRouter: WalletPageRouter,
        walletRepository: WalletRepository,
        currencyRepository: CurrencyRepository
      ) => {
        const module = await import('../../wallet/domain/WalletPagePresenterImpl.ts')

        return new module.WalletPagePresenterImpl(
          walletRepository,
          new GetErc20BalanceInteractor(ethereumServiceStrategy),
          currencyRepository,
          new ExportWalletPrivateKeyInteractor(
            walletRepository,
            messageSigner,
            echdCrypto,
            exceptionNotifierService,
          ),
          walletPageRouter,
        )
      }
    }
  ],
  exports: [WalletPagePresenter, WalletPageDialogProvider]
})
export class WalletPageModule {}
