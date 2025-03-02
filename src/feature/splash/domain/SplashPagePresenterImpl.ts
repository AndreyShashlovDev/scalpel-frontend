import { AppAuthService } from '../../../common/service/auth/AppAuthService.ts'
import { Delay } from '../../../utils/Delay.ts'
import { SplashPageRouter } from './router/SplashPageRouter.ts'
import { SplashPagePresenter } from './SplashPagePresenter.ts'

export class SplashPagePresenterImpl extends SplashPagePresenter {

  constructor(
    private readonly router: SplashPageRouter,
    private readonly authService: AppAuthService,
  ) {
    super()
  }

  public ready(): void {
    this.authService.loadData()
      .then(async (hasAuth) => {
        await Delay(500)

        if (hasAuth) {
          this.router.openStrategiesPage()
        } else {
          this.router.openLoginPage()
        }
      })
      .catch(e => {
        console.error(e)
        this.router.openLoginPage()
      })
  }

  public destroy(): void {
  }
}
