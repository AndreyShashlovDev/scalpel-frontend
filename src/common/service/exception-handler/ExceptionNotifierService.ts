import { AppException } from '../../repository/data/source/exception/AppException.ts'

export abstract class ExceptionNotifierService {

  public abstract notify(exception: AppException): void
}
