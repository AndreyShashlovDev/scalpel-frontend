import { UnknownException } from '../../../../common/repository/data/source/exception/UnknownException.ts'
import { WalletRepository } from '../../../../common/repository/data/wallet/WalletRepository.ts'
import { ECHDCrypto } from '../../../../common/service/crypto/ECHDCrypto.ts'
import { ExceptionNotifierService } from '../../../../common/service/exception-handler/ExceptionNotifierService.ts'
import { MessageSigner } from '../../../../common/service/message-signer/MessageSigner.ts'
import { Interactor } from '../../../../utils/arch/Interactor.ts'

export interface ExportWalletPrivateKeyParams {
  account: string
}

export class ExportWalletPrivateKeyInteractor implements Interactor<ExportWalletPrivateKeyParams, Promise<string>> {

  constructor(
    private readonly walletRepository: WalletRepository,
    private readonly messageSigner: MessageSigner,
    private readonly echdCrypto: ECHDCrypto,
    private readonly exceptionNotifierService: ExceptionNotifierService,
  ) {
  }

  public async invoke(params: ExportWalletPrivateKeyParams): Promise<string> {
    try {
      const publicKeyVector = await this.echdCrypto.createKeyPair(params.account)

      const msg = JSON.stringify({
        account: params.account,
        pub: publicKeyVector,
        t: Math.round(Date.now() / 1000),
      })

      const sig = await this.messageSigner.signMessage(msg)

      const exportWallet = await this.walletRepository.exportWallet(msg, sig.signature)

      return await this.echdCrypto.decrypt(
        exportWallet.data,
        exportWallet.iv,
        exportWallet.tag,
        params.account,
        exportWallet.pub
      )
    } catch (e) {
      console.error(e)
      // @ts-expect-error checked
      const error = UnknownException.create(e?.message ?? 'Cannot export private key =(')
      this.exceptionNotifierService.notify(error)
      throw error
    }
  }
}
