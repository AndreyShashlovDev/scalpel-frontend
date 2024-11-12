import { AppException } from './AppException.ts'

export class UnauthorizedException extends AppException {

  public static create = () => new UnauthorizedException(401, 'Unauthorized')

  private constructor(code: number, message: string) {
    super(code, message)
  }
}
