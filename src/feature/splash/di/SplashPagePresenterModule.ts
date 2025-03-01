import { ApplicationRouter } from '../../../common/router/domain/ApplicationRouter.ts'
import { AppAuthService } from '../../../common/service/auth/AppAuthService.ts'
import { Factory, getDIValue, injectionKernel } from '../../../Injections.ts'
import { SplashPagePresenter } from '../domain/SplashPagePresenter.ts'
import { SplashPagePresenterImpl } from '../domain/SplashPagePresenterImpl.ts'

injectionKernel.set(
  SplashPagePresenter,
  new Factory(
    () => new SplashPagePresenterImpl(
      getDIValue(ApplicationRouter),
      getDIValue(AppAuthService),
    ),
    false
  )
)
