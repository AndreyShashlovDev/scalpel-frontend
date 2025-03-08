import { DialogProvider, DialogRouter } from '../../../utils/arch/DialogProvider.ts'

export interface WalletDialogCallBacks extends DialogRouter {

  openQuestionDialog(title: string, message: string, data: unknown, resultId: number): void
}

export class WalletPageDialogProvider extends DialogProvider<WalletDialogCallBacks> {
}
