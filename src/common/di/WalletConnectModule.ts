import { REOWN_PROJECT_ID } from '../../AppModule.ts'
import { Module } from '../../utils/di-core/di/Dependency.ts'
import { ExceptionNotifierService } from '../service/exception-handler/ExceptionNotifierService.ts'
import { WalletConnect } from '../service/wallet-connect/WalletConnect.ts'
import { ExceptionModule } from './ExceptionModule.ts'

@Module({
  imports: [ExceptionModule],
  providers: [
    {
      provide: WalletConnect,
      deps: [ExceptionNotifierService],
      useFactory: async (exceptionNotifierService: ExceptionNotifierService) => {
        const walletConnectModule = await import('../service/wallet-connect/WalletConnectImpl.ts')

        return new walletConnectModule.WalletConnectImpl(
          REOWN_PROJECT_ID,
          exceptionNotifierService,
        )
      }
    }
  ],
  exports: [WalletConnect],
  global: true
})
export class WalletConnectModule {}
