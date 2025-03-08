import { BasicDialogProvider } from '../../../utils/arch/DialogProvider.ts'
import { WalletDialogCallBacks } from './WalletPageDialogProvider.ts'
import { WalletPageRouter } from './WalletPageRouter.ts'

export class WalletPageRouterImpl extends WalletPageRouter {

  constructor(
    private readonly dialogProvider: BasicDialogProvider<WalletDialogCallBacks>,
  ) {
    super()
  }

  public openExportPrivateKey(hash: string, resultId: number): void {
    this.dialogProvider.getDialogs()?.openQuestionDialog(
      'Export?',
      'Exporting a private key may cause orders to not work correctly, it is recommended to delete the private key' +
      ' from the system after exporting',
      hash,
      resultId
    )
  }

  public openDeletePrivateKey(hash: string, resultId: number): void {
    this.dialogProvider.getDialogs()?.openQuestionDialog(
      'Delete?',
      'After deleting the private key, all active orders will be cancelled. The system will no longer have access to it. It will not be possible to restore it! Make sure that you have saved the private key safely and securely',
      hash,
      resultId
    )
  }
}
