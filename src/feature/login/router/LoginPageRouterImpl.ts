import { ApplicationRouter } from '../../../common/router/domain/ApplicationRouter.ts'
import { BasicDialogProvider } from '../../../utils/arch/DialogProvider.ts'
import { LoginDialogCallBacks } from './LoginPageDialogProvider.ts'
import { LoginPageRouter } from './LoginPageRouter.ts'

export class LoginPageRouterImpl extends LoginPageRouter {

  constructor(
    private readonly appRouter: ApplicationRouter,
    private readonly dialogProvider: BasicDialogProvider<LoginDialogCallBacks>,
  ) {
    super()
  }

  public openStrategiesPage(): void {
    this.appRouter.openStrategiesPage()
  }

  public openDemoPage(): void {
    this.appRouter.openDemoPage()
  }

  public openJoinTelegramBot(joinCode: string): void {
    const link = `https://t.me/scalpel_app_bot?start=${joinCode}`

    this.dialogProvider.getDialogs()?.openJoinTgAccountDialog(
      'Connect Telegram',
      'It is necessary to link your telegram account (preferably anonymous, to avoid disclosure of data).\nWe only' +
      ` store your account ID.\n\nTo connect an account, go to our bot using this link: <a target="_blank" rel="noreferrer noopener" href='{{url}}'>{{url}}</a>`,
      link
    )
  }
}
