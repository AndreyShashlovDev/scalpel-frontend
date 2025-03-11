import { DialogProvider, DialogRouter } from '../../../utils/arch/DialogProvider.ts'

export interface LoginDialogCallBacks extends DialogRouter {

  openJoinTgAccountDialog(title: string, message: string, link: string): void
}

export class LoginPageDialogProvider extends DialogProvider<LoginDialogCallBacks> {
}
