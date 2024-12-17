import { ApplicationRouter } from '../../../common/router/domain/ApplicationRouter.ts'
import { ExceptionHandlerService } from '../../../common/service/exception-handler/ExceptionHandlerService.ts'
import { getDIValue, injectionKernel, Singleton } from '../../../Injections.ts'
import { AppPresenter } from './AppPresenter.ts'
import { AppPresenterImpl } from './AppPresenterImpl.ts'

injectionKernel.set(
  AppPresenter,
  new Singleton(() => new AppPresenterImpl(getDIValue(ExceptionHandlerService), getDIValue(ApplicationRouter)))
)
