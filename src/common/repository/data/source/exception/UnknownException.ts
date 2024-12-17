import { AppException } from './AppException.ts'

export class UnknownException extends AppException {

  public static create = (message?: string) => new UnknownException(0, message ?? 'Something went wrong')

  private constructor(code: number, message: string) {
    super(code, message)
  }
}
