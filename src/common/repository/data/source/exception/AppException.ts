export abstract class AppException {

  public readonly code: number
  public readonly message: string

  protected constructor(code: number, message: string) {
    this.code = code
    this.message = message
  }
}
