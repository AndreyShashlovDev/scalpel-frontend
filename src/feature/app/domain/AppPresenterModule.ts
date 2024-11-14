import { ApplicationRouter } from '../../../common/router/domain/ApplicationRouter.ts'
import { ExceptionHandlerService } from '../../../common/service/exception-handler/ExceptionHandlerService.ts'
import { Factory, getDIValue, injectionKernel } from '../../../Injections.ts'
import { AppPresenter } from './AppPresenter.ts'
import { AppPresenterImpl } from './AppPresenterImpl.ts'

injectionKernel.set(
  AppPresenter,
  new Factory(() => new AppPresenterImpl(getDIValue(ExceptionHandlerService), getDIValue(ApplicationRouter)), false)
)
