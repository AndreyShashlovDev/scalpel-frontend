import { ApplicationRouter } from '../../../common/router/domain/ApplicationRouter.ts'
import { AppAuthService } from '../../../common/service/auth/AppAuthService.ts'
import { ExceptionHandlerService } from '../../../common/service/exception-handler/ExceptionHandlerService.ts'
import { getDIValue, injectionKernel, Singleton } from '../../../utils/arch/Injections.ts'
import { AppPresenter } from '../domain/AppPresenter.ts'
import { AppPresenterImpl } from '../domain/AppPresenterImpl.ts'

injectionKernel.set(
  AppPresenter,
  new Singleton(() => new AppPresenterImpl(
    getDIValue(ExceptionHandlerService),
    getDIValue(AppAuthService),
    getDIValue(ApplicationRouter)
  ))
)
