import { ExceptionNotifierService } from '../../../common/service/exception-handler/ExceptionNotifierService.ts'
import { WalletConnect } from '../../../common/service/wallet-connect/WalletConnect.ts'
import { getDIValue, injectionKernel, Singleton } from '../../../Injections.ts'

export const WalletConnectModule = async () => {
  if (injectionKernel.get(WalletConnect)) {
    return
  }

  const walletConnectModule = await import('../../../common/service/wallet-connect/WalletConnectImpl.ts')
  const WalletConnectImpl = walletConnectModule.WalletConnectImpl

  injectionKernel.set(
    WalletConnect,
    new Singleton(() => new WalletConnectImpl(
      '882d3398012401b6a598b7a245adff21',
      getDIValue(ExceptionNotifierService)
    ))
  )
}
