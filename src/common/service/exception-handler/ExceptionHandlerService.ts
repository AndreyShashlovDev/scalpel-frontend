import { Observable } from 'rxjs'
import { AppException } from '../../repository/data/source/exception/AppException.ts'

export abstract class ExceptionHandlerService {

  public abstract observe(): Observable<AppException>
}
