import { AppException } from '../../../common/repository/data/source/exception/AppException.ts'
import { UnauthorizedException } from '../../../common/repository/data/source/exception/UnauthorizedException.ts'
import { ExceptionHandlerService } from '../../../common/service/exception-handler/ExceptionHandlerService.ts'
import { AppRouter } from '../router/AppRouter.ts'
import { AppPresenter } from './AppPresenter.ts'

export class AppPresenterImpl extends AppPresenter {

  constructor(
    private readonly exceptionNotifierService: ExceptionHandlerService,
    private readonly router: AppRouter,
  ) {
    super()
  }

  public destroy(): void {
  }

  public ready(): void {
    this.exceptionNotifierService
      .observe()
      .subscribe({
        next: (error: AppException) => {
          if (error instanceof UnauthorizedException) {
            this.router.openLoginPage()
          }
        }
      })
  }
}
