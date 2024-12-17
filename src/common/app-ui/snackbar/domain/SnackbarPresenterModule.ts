import { getDIValue, injectionKernel, Singleton } from '../../../../Injections.ts'
import { ExceptionHandlerService } from '../../../service/exception-handler/ExceptionHandlerService.ts'
import { SnackbarPresenter } from './SnackbarPresenter.ts'
import { SnackbarPresenterImpl } from './SnackbarPresenterImpl.ts'

injectionKernel.set(
  SnackbarPresenter,
  new Singleton(() => new SnackbarPresenterImpl(getDIValue(ExceptionHandlerService)))
)
