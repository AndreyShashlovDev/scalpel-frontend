import { Module } from '@di-core/decorator/decorators.ts'
import { MessageSigner } from '../service/message-signer/MessageSigner.ts'
import { WalletConnect } from '../service/wallet-connect/WalletConnect.ts'
import { WalletProvider } from '../service/wallet-connect/WalletProvider.ts'
import { WalletConnectModule } from './WalletConnectModule.ts'

@Module({
  imports: [WalletConnectModule],
  providers: [
    {
      provide: MessageSigner,
      deps: [WalletConnect],
      useFactory: async (walletConnect: WalletConnect<WalletProvider>) => {
        const messageSignerModule = await import('../service/message-signer/MessageSingerImpl.ts')
        const MessageSignerImpl = messageSignerModule.MessageSingerImpl

        return new MessageSignerImpl(walletConnect)
      }
    }
  ],
  exports: [MessageSigner],
})
export class MessageSignerModule {}
