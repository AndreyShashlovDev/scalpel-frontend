import { Observable, Subject } from 'rxjs'
import { AppException } from '../../repository/data/source/exception/AppException.ts'
import { ExceptionHandlerService } from './ExceptionHandlerService.ts'
import { ExceptionNotifierService } from './ExceptionNotifierService.ts'

export class AppExceptionHandlerService implements ExceptionHandlerService, ExceptionNotifierService {

  private readonly subject = new Subject<AppException>()

  public notify(exception: AppException): void {
    this.subject.next(exception)
  }

  public observe(): Observable<AppException> {
    return this.subject.asObservable()
  }
}
