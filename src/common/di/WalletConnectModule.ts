import { Singleton, Module } from '@di-core/decorator/decorators.ts'
import { REOWN_PROJECT_ID } from '../../AppModule.ts'
import { ExceptionNotifierService } from '../service/exception-handler/ExceptionNotifierService.ts'
import { WalletConnect } from '../service/wallet-connect/WalletConnect.ts'
import { ExceptionModule } from './ExceptionModule.ts'

@Singleton()
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
})
export class WalletConnectModule {}
