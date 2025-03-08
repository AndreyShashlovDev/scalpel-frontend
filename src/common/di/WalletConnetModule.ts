import { ExceptionNotifierService } from '../service/exception-handler/ExceptionNotifierService.ts'
import { WalletConnect } from '../service/wallet-connect/WalletConnect.ts'
import { getDIValue, injectionKernel, Singleton } from '../../utils/arch/Injections.ts'
import { REOWN_PROJECT_ID } from '../../CoreModule.ts'

export const WalletConnectModule = async () => {
  const walletConnectModule = await import('../service/wallet-connect/WalletConnectImpl.ts')
  const WalletConnectImpl = walletConnectModule.WalletConnectImpl

  injectionKernel.set(
    WalletConnect,
    new Singleton(() => new WalletConnectImpl(
      REOWN_PROJECT_ID,
      getDIValue(ExceptionNotifierService)
    ))
  )
}
