import { MessageSigner } from '../../../common/service/message-signer/MessageSigner.ts'
import { WalletConnect } from '../../../common/service/wallet-connect/WalletConnect.ts'
import { getDIValue, injectionKernel, loadModule, Singleton } from '../../../Injections.ts'
import { WalletConnectModule } from './WalletConnetModule.ts'

export const SignerMessageModule = async () => {
  await loadModule(WalletConnectModule)

  const messageSignerModule = await import('../../../common/service/message-signer/MessageSingerImpl.ts')
  const MessageSignerImpl = messageSignerModule.MessageSingerImpl

  injectionKernel.set(
    MessageSigner,
    new Singleton(
      () => new MessageSignerImpl(getDIValue(WalletConnect)),
    )
  )
}
